// supabase/functions/fetch_rss/index.ts
// Trusted-source RSS ingester with GPT classification & summary.
// - Only ingests from allow-listed sources (domain verified).
// - Extracts canonical URL, builds url_key, and UPSERTs on url_key (cross-source de-dup).
// - Publishes APPROVED only if CRC-relevant; otherwise skipped (or could be pending).
// ENV needed: SB_URL, SB_SERVICE_ROLE_KEY, OPENAI_API_KEY

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SB_URL")!;
const SB_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const OPENAI = Deno.env.get("OPENAI_API_KEY") || "";

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
const UA = "Mozilla/5.0 (compatible; COLONAiVE-RSS/1.5)";

// ---- CRC keyword gate (fallback + safety net) ----
const CRC_TERMS = [
  "colorectal", "colon cancer", "rectal cancer", "bowel cancer", "crc ",
  "adenoma", "polyp", "sessile serrated", "advanced adenoma",
  "colonoscopy", "sigmoidoscopy", "fit ", "fecal immunochemical",
  "stool dna", "cologuard", "msi-h", "lynch", "fap", "hnpcc",
  "metastatic colorectal", "mcrc", "rectum", "hemicolectomy",
  "kras", "braf", "egfr", "bevacizumab", "cetuximab", "oxaliplatin", "capecitabine",
  // screening/policy
  "screening", "screening age", "age 45", "early-onset", "early onset", "eo crc", "eo-crc"
];

function isClearlyCRC(title: string, text: string) {
  const hay = (title + " " + text).toLowerCase();
  return CRC_TERMS.some(t => hay.includes(t));
}

const strip = (s: string) =>
  s.replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const host = (u: string) => { try { return new URL(u).host; } catch { return ""; } };
const root = (h: string) => (h || "").toLowerCase().split(".").filter(Boolean).slice(-2).join(".");

// ---------- helpers ----------
async function fetchText(u: string) {
  const r = await fetch(u, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!r.ok) throw new Error(`Fetch ${r.status} ${u}`);
  return await r.text();
}

function textBetween(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1].replace(/<!\[CDATA\[(.*?)\]\]>/gis, "$1").trim() : null;
}

function normalizeForKey(u: string) {
  try {
    const url = new URL(u);
    url.hash = "";
    url.search = ""; // drop trackers
    url.pathname = url.pathname.replace(/\/+$/, "");
    return `${url.protocol}//${url.host.toLowerCase()}${url.pathname}`;
  } catch {
    return u.toLowerCase();
  }
}

function extractCanonical(html: string): string | null {
  const can = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  if (can?.[1]) return can[1];
  const og = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']+)["']/i);
  if (og?.[1]) return og[1];
  return null;
}

// ---------- RSS parse ----------
async function parseFeed(rss: string) {
  const xml = await fetchText(rss);
  const out: Array<{ title: string; link: string; pub?: string; desc?: string }> = [];
  const items = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
  if (items.length) {
    for (const b of items) {
      const title = textBetween(b, "title") ?? "";
      const link = (textBetween(b, "link") ?? "").trim();
      const pub = textBetween(b, "pubDate") ?? textBetween(b, "dc:date") ?? undefined;
      const desc = textBetween(b, "description") ?? textBetween(b, "content:encoded") ?? undefined;
      if (title && link) out.push({ title, link, pub, desc });
    }
    return out;
  }
  const entries = xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
  for (const b of entries) {
    const title = textBetween(b, "title") ?? "";
    const m = b.match(/<link[^>]+href=["']([^"']+)["']/i);
    const link = m ? m[1] : "";
    const pub = textBetween(b, "updated") ?? textBetween(b, "published") ?? undefined;
    const desc = textBetween(b, "summary") ?? textBetween(b, "content") ?? undefined;
    if (title && link) out.push({ title, link, pub, desc });
  }
  return out;
}

// ---------- GPT classifier ----------
type Catalog = { tag: string; label: string; group_name: string };

async function classifyAndSummarize(allowed: Catalog[], title: string, text: string) {
  if (!OPENAI) {
    // Heuristic fallback
    const low = (title + " " + text).toLowerCase();
    const tags: string[] = [];
    if (low.includes("early-onset") || low.includes("early onset") || low.includes("age 45") || low.includes("younger than 50"))
      tags.push("early_onset_crc", "screening_policy");
    if (low.includes("guideline") || low.includes("recommendation")) tags.push("guidelines");
    if (low.includes("colonoscopy") || low.includes("fit")) tags.push("screening_methods");
    if (low.includes("bleeding") || low.includes("hematochezia")) tags.push("rectal_bleeding", "hematochezia");
    if (low.includes("hemorrhoid") || low.includes("piles")) tags.push("hemorrhoids");
    if (low.includes("constipation")) tags.push("constipation");
    const uniq = Array.from(new Set(tags.filter(t => allowed.find(a => a.tag === t))));
    const score = isClearlyCRC(title, text) ? 8 : (uniq.length ? 5 : 1);
    return { tags: uniq, relevance: score, reason: "Heuristic fallback", summary: null };
  }

  const allowedList = allowed.map(a => a.tag).join(", ");
  const messages = [
    { role: "system", content:
`You are a medical editor for colorectal cancer. Use ONLY facts in the text.
Return STRICT JSON with keys:
"tags": array subset of [${allowedList}]
"relevance": integer 0..10 (≥8 if clearly CRC/EOCRC/guideline; 5–7 CRC-related; ≤4 off-topic)
"reason": one sentence citing explicit facts
"summary": 2–3 factual sentences.` },
    { role: "user", content: `TITLE: ${title}\n\nTEXT:\n${text.slice(0, 12000)}\n\nReturn JSON only.` }
  ];

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { authorization: `Bearer ${OPENAI}`, "content-type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.1, messages })
  });
  const j = await r.json();
  const raw = j?.choices?.[0]?.message?.content?.trim?.() || "{}";
  try {
    const p = JSON.parse(raw);
    const tags: string[] = Array.isArray(p.tags) ? p.tags.filter((t: string) => allowed.find(a => a.tag === t)) : [];
    const relevance = Math.max(0, Math.min(10, Number(p.relevance) || 0));
    const reason = typeof p.reason === "string" ? p.reason : null;
    const summary = typeof p.summary === "string" ? p.summary : null;
    return { tags, relevance, reason, summary };
  } catch {
    return { tags: [], relevance: 0, reason: "Parse error", summary: null };
  }
}

// ---------- main ----------
async function run() {
  const { data: sources, error: sErr } = await sb.from("news_sources")
    .select("id,name,rss_url,default_category,enabled,kind,allowed_domain")
    .eq("enabled", true);
  if (sErr) throw sErr;

  const { data: catalog } = await sb.from("topic_catalog").select("*") as unknown as { data: Catalog[] };

  let total = 0, inserted = 0, skipped = 0;

  for (const s of sources ?? []) {
    try {
      const allowRoot = root(s.allowed_domain || host(s.rss_url));
      const feedItems = await parseFeed(s.rss_url);
      total += feedItems.length;

      for (const it of feedItems) {
        try {
          // resolve final URL & verify domain allowlist
          const head = await fetch(it.link, { redirect: "follow", headers: { "user-agent": UA } });
          if (!head.ok) { skipped++; continue; }
          const finalUrl = head.url || it.link;
          if (allowRoot && root(host(finalUrl)) !== allowRoot) { skipped++; continue; }

          // fetch article page
          let html = "";
          try {
            const page = await fetch(finalUrl, { headers: { "user-agent": UA } });
            if (page.ok) html = await page.text();
          } catch {}
          const canonical = extractCanonical(html) || finalUrl;
          const url_key = normalizeForKey(canonical);
          const pageText = strip(html);
          const title = strip(it.title);

          // meta
          const meta = (name: string) => {
            const m = html.match(new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, "i"));
            return m ? m[1] : null;
          };
          const prop = (p: string) => {
            const m = html.match(new RegExp(`<meta[^>]+property=["']${p}["'][^>]+content=["']([^"']+)["']`, "i"));
            return m ? m[1] : null;
          };
          const metaDesc = prop("og:description") || meta("description") || it.desc || "";
          const metaImg = prop("og:image") || null;

          // classify & summarize
          const cls = await classifyAndSummarize(catalog || [], title, pageText || metaDesc);

          // ---- Relevance gate ----
          const relevant = (cls.relevance >= 5) || isClearlyCRC(title, pageText || metaDesc);
          if (!relevant) { skipped++; continue; }

          // Compute legacy hash (keep for forensics)
          const enc = new TextEncoder().encode(`${title}|${finalUrl}`);
          const buf = await crypto.subtle.digest("SHA-256", enc);
          const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");

          // UPSERT by url_key
          const { error: upErr } = await sb.from("news_items").upsert([{
            title,
            link: finalUrl,
            canonical_url: canonical,
            url_key,
            source_name: s.name,
            pub_date: (it.pub ? new Date(it.pub) : new Date()).toISOString(),
            category: s.default_category,
            kind: s.kind,                                  // 'journal' | 'news'
            excerpt: metaDesc ? strip(metaDesc).slice(0, 400) : null,
            thumbnail_url: metaImg,
            status: "approved",                            // only relevant items reach here
            topic_tags: cls.tags,
            relevance_score: cls.relevance,
            ai_relevance_reason: cls.reason,
            ai_summary: cls.summary,
            ai_model: cls.summary ? "gpt-4o-mini" : null,
            ai_confidence: cls.summary ? 70 : null,
            ai_updated_at: cls.summary ? new Date().toISOString() : null,
            is_sticky: cls.tags?.includes("early_onset_crc") && cls.relevance >= 8,
            sticky_priority: (cls.tags?.includes("early_onset_crc") && cls.relevance >= 8) ? 1 : 999,
            hash
          }], { onConflict: "url_key", ignoreDuplicates: true });

          if (upErr) skipped++; else inserted++;
        } catch {
          skipped++;
        }
      }
    } catch {
      skipped += 1;
      continue;
    }
  }
  return { total, inserted, skipped };
}

serve(async () => {
  try {
    const r = await run();
    return new Response(JSON.stringify({ ok: true, ...r }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
