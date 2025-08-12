// netlify/functions/fetch_crc_news.ts
import type { Handler } from "@netlify/functions";
import crypto from "crypto";

// @ts-ignore - netlify functions allow dynamic import
import Parser from "rss-parser";

const parser: any = new (Parser as any)({
  headers: { "User-Agent": "COLONAiVE/NewsFetcher" },
});

const FEEDS: { url: string; category?: string }[] = [
  // Top clinical journals
  { url: "https://www.nejm.org/feed/rss", category: "Clinical Research" },
  { url: "https://jamanetwork.com/rss/site_9/mostRecentIssue.xml", category: "Clinical Research" },
  { url: "https://www.thelancet.com/rssfeed/lancet_oncology_current.xml", category: "Clinical Research" },
  { url: "https://feeds.feedburner.com/gastrojournal", category: "Clinical Research" },
  { url: "https://feeds.nature.com/nature/rss/current", category: "Clinical Research" },
  { url: "https://feeds.nature.com/nature-research/oncology/rss", category: "Clinical Research" },
  { url: "https://gut.bmj.com/rss/current.xml", category: "Clinical Research" },

  // Guidelines / policy
  { url: "https://www.nccn.org/rss", category: "Screening & Policy" },
  { url: "https://www.uspreventiveservicestaskforce.org/uspstf/site-feed.xml", category: "Screening & Policy" },

  // ASCO news
  { url: "https://ascopost.com/rss", category: "Clinical Research" },

  // Awareness (campaigns, NGOs)
  { url: "https://www.cancer.org/feeds/newsroom.rss", category: "Awareness & Campaigns" },
];

const CRC_KEYWORDS = [
  "colorectal", "colon cancer", "rectal cancer", "crc",
  "adenoma", "advanced adenoma", "polyps", "colonoscopy",
  "screening", "sigmoidoscopy", "fecal", "stool test", "ct colonography",
  "blood-based", "liquid biopsy", "dna methylation", "FIT", "FOBT", "mt-sDNA"
];

const TRUSTED_DOMAINS = [
  "nejm.org","jamanetwork.com","thelancet.com","lancet.com",
  "gastrojournal.org","nature.com","gut.bmj.com","bmj.com",
  "nccn.org","uspreventiveservicestaskforce.org","ascopost.com",
  "cancer.org","aacr.org","asco.org","annals.org","sciencedirect.com","cell.com"
];

function sha(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function looksCRC(text: string) {
  const t = (text || "").toLowerCase();
  return CRC_KEYWORDS.some(k => t.includes(k));
}

function toDomain(u: string) {
  try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; }
}

async function aiSummarize(title: string, text: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    // Fallback extractive snippet
    const snippet = (text || "").split(/[\.\n]/).slice(0, 3).join(". ").trim();
    return snippet || "Summary unavailable. Open the original article for details.";
  }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a medical editor. Write a 2–3 sentence neutral summary for clinicians about colorectal cancer research or screening policy. No hype." },
          { role: "user", content: `Title: ${title}\nText:\n${text}\n\nWrite the summary.` }
        ],
        temperature: 0.2,
      })
    });
    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || "";
  } catch {
    return "Summary unavailable. Open the original article for details.";
  }
}

type UpsertPayload = {
  title: string; url: string; source: string; source_domain: string;
  authors: string[]; image_url?: string | null; category: string;
  published_at: string; summary: string; tags: string[]; hash: string;
};

async function upsert(items: UpsertPayload[]) {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${supabaseUrl}/rest/v1/crc_news`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify(items),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Supabase upsert failed: ${res.status} ${t}`);
  }
}

export const handler: Handler = async () => {
  try {
    const collected: UpsertPayload[] = [];

    for (const feed of FEEDS) {
      let out: any;
      try { out = await parser.parseURL(feed.url); } catch { continue; }
      for (const i of out.items || []) {
        const title = i.title || "";
        const link = i.link || i.guid || "";
        if (!title || !link) continue;

        const domain = toDomain(link);
        if (!TRUSTED_DOMAINS.includes(domain)) continue;

        // CRC filter by title/summary categories
        const textBody = `${i.contentSnippet || ""}\n${i.content || ""}\n${i.summary || ""}`;
        if (!looksCRC([title, textBody].join(" "))) continue;

        const category = feed.category || "Clinical Research";
        const summary = await aiSummarize(title, textBody);
        const authors = i.creator ? [String(i.creator)] : [];
        const pub = i.isoDate || i.pubDate || new Date().toISOString();

        const payload: UpsertPayload = {
          title,
          url: link,
          source: out.title || domain,
          source_domain: domain,
          authors,
          image_url: i.enclosure?.url || null,
          category,
          published_at: new Date(pub).toISOString(),
          summary,
          tags: [],
          hash: sha(`${title}|${link}`),
        };
        collected.push(payload);
      }
    }

    if (collected.length) await upsert(collected);

    return {
      statusCode: 200,
      body: JSON.stringify({ inserted_or_merged: collected.length }),
    };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "error" };
  }
};
