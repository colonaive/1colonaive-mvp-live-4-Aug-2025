// supabase/functions/fetch_rss/index.ts
// Trusted-source RSS ingester with GPT classification & summary.
// - Allow-listed sources only (domain verified by registrable root).
// - Extracts canonical URL, builds url_key, UPSERTS on url_key (cross-source de-dup).
// - Publishes APPROVED immediately; admin can hide/delete/pin.
// ENV secrets: SB_URL, SB_SERVICE_ROLE_KEY, OPENAI_API_KEY

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SB_URL")!;
const SB_KEY = Deno.env.get("SB_SERVICE_ROLE_KEY")!;
const OPENAI = Deno.env.get("OPENAI_API_KEY") || "";

const sb = createClient(SB_URL, SB_KEY, { auth: { persistSession: false } });
const UA = "Mozilla/5.0 (compatible; COLONAiVE-RSS/1.5)";

// caps & timeouts to keep invocations snappy
const TOTAL_ITEM_LIMIT = 80;     // hard cap per run
const PER_SOURCE_LIMIT = 25;     // per-source cap
const AI_MAX_ITEMS = 10;         // at most this many items use GPT per run
const RSS_TIMEOUT_MS = 8000;     // 8s per RSS
const PAGE_TIMEOUT_MS = 6000;    // 6s per article page

// ---------- small utils ----------
const strip = (s: string) =>
  s.replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const host = (u: string) => { try { return new URL(u).host; } catch { return ""; } };
const root = (h: string) => (h || "").toLowerCase().split(".").filter(Boolean).slice(-2).join(".");

// fetch with timeout
async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal });
    return r;
  } finally {
    clearTimeout(t);
  }
}

async function fetchText(url: string, ms: number) {
  const r = await fetchWithTimeout(url, ms, { headers: { "user-agent": UA }, redirect: "follow" });
  if (!r.ok) throw new Error(`Fetch ${r.status} ${url}`);
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

// ---------- RSS parse (never throws) ----------
async function parseFeed(rss: string) {
  let xml = "";
  try {
    xml = await fetchText(rss, RSS_TIMEOUT_MS);
  } catch {
    return [];
  }

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

async function classifyAndSummarize(
  allowed: Catalog[],
  title: string,
  text: string,
  aiBudgetLeft: { v: number },
) {
  // heuristic fallback or when AI budget is exhausted
  const heuristic = () => {
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
    const score = uniq.includes("early_onset_crc") ? 8 : (uniq.length ? 5 : 2);
    return { tags: uniq, relevance: score, reason: "Heuristic fallback", summary: null, model: null as string | null };
  };

  if (!OPENAI || aiBudgetLeft.v <= 0) return heuristic();
  aiBudgetLeft.v--;

  const allowedList = allowed.map(a => a.tag).join(", ");
  const messages = [
    { role: "system", content:
`You are a medical editor for colorectal cancer. Use ONLY facts present in the text.
Return STRICT JSON with keys:
  "tags": array subset of [${allowedList}]
  "relevance": integer 0..10
  "reason": one sentence citing explicit facts
  "summary": 2–3 factual sentences.` },
    { role: "user", content: `TITLE: ${title}\n\nTEXT (truncated):\n${text.slice(0, 12000)}\n\nReturn JSON only.` }
  ] as const;

  try {
    const r = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", 8000, {
      method: "POST",
      headers: { authorization: `Bearer ${OPENAI}`, "content-type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.1, messages })
    });
    const j = await r.json();
    const raw = j?.choices?.[0]?.message?.content?.trim?.() || "{}";
    const p = JSON.parse(raw);
    const tags: string[] = Array.isArray(p.tags) ? p.tags.filter((t: string) => allowed.find(a => a.tag === t)) : [];
    const relevance = Math.max(0, Math.min(10, Number(p.relevance) || 0));
    const reason = typeof p.reason === "string" ? p.reason : null;
    const summary = typeof p.summary === "string" ? p.summary : null;
    return { tags, relevance, reason, summary, model: "gpt-4o-mini" };
  } catch {
    return heuristic();
  }
}

// ---------- main ----------
async function run() {
  const { data: sources, error: sErr } = await sb.from("news_sources")
    .select("id,name,rss_url,default_category,enabled,kind,allowed_domain")
    .eq("enabled", true);
  if (sErr) throw sErr;

  const { data: catalog } = await sb.from("topic_catalog").select("*") as unknown as { data: Catalog[] };

  let total = 0, inserted = 0, skipped = 0, processed = 0;
  const aiBudget = { v: AI_MAX_ITEMS };

  for (const s of sources ?? []) {
    if (processed >= TOTAL_ITEM_LIMIT) break;

    try {
      const allowRoot = root(s.allowed_domain || host(s.rss_url));
      const feedItems = (await parseFeed(s.rss_url)).slice(0, PER_SOURCE_LIMIT);
      total += feedItems.length;

      for (const it of feedItems) {
        if (processed >= TOTAL_ITEM_LIMIT) break;
        processed++;

        try {
          const finalUrl = it.link;

          // allowlist check by registrable root
          if (allowRoot && root(host(finalUrl)) !== allowRoot) { skipped++; continue; }

          // fetch page (best effort)
          let html = "";
          try {
            const page = await fetchWithTimeout(finalUrl, PAGE_TIMEOUT_MS, { headers: { "user-agent": UA }, redirect: "follow" });
            if (page.ok) html = await page.text();
          } catch {}

          const canonical = extractCanonical(html) || finalUrl;
          const url_key = normalizeForKey(canonical);
          const pageText = strip(html);
          const title = strip(it.title);

          // meta from page or feed
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

          // classify & summarize (bounded AI)
          const cls = await classifyAndSummarize(catalog || [], title, pageText || metaDesc, aiBudget);
          const autoSticky = cls.tags.includes("early_onset_crc") && cls.relevance >= 8;

          // legacy hash
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
            status: "approved",
            topic_tags: cls.tags,
            relevance_score: cls.relevance,
            ai_relevance_reason: cls.reason,
            ai_summary: cls.summary,
            ai_model: cls.model,
            ai_confidence: cls.model ? 70 : null,
            ai_updated_at: cls.model ? new Date().toISOString() : null,
            is_sticky: autoSticky,
            sticky_priority: autoSticky ? 1 : 999,
            hash
          }], { onConflict: "url_key", ignoreDuplicates: true });

          if (upErr) { skipped++; } else { inserted++; }
        } catch {
          skipped++;
        }
      }
    } catch {
      // skip whole source if its feed fails hard
      continue;
    }
  }
  return { total, inserted, skipped, processed, ai_used: AI_MAX_ITEMS - aiBudget.v };
}

serve(async () => {
  try {
    const r = await run();
    return new Response(JSON.stringify({ ok: true, ...r }), {
      headers: { "content-type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
});
