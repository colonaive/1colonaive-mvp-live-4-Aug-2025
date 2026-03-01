// @ts-nocheck

import { createClient } from '@supabase/supabase-js';
// rss-parser types are messy for functions; ignore them.
// @ts-ignore
import Parser from "rss-parser";

const parser: any = new (Parser as any)({
  headers: { "User-Agent": "COLONAiVE/NewsFetcher" },
});

// ---- SOURCE FEEDS (kept broad but we hard‑gate to CRC below) ----
const FEEDS: {
  url: string;
  category: "Clinical Research" | "Screening & Policy" | "Awareness & Campaigns";
}[] = [
  { url: "https://www.nejm.org/feed/rss", category: "Clinical Research" },
  { url: "https://jamanetwork.com/rss/site_9/mostRecentIssue.xml", category: "Clinical Research" },
  { url: "https://www.thelancet.com/rssfeed/lancet_oncology_current.xml", category: "Clinical Research" },
  { url: "https://gut.bmj.com/rss/current.xml", category: "Clinical Research" },
  { url: "https://ascopost.com/rss", category: "Clinical Research" },
  { url: "https://www.nccn.org/rss", category: "Screening & Policy" },
  { url: "https://www.uspreventiveservicestaskforce.org/uspstf/site-feed.xml", category: "Screening & Policy" },
  { url: "https://www.cancer.org/feeds/newsroom.rss", category: "Awareness & Campaigns" },
];

// ---- STRICT CRC CLASSIFIER ----
// Positive signals (must have at least one)
const CRC_POSITIVE =
  /\b(colorectal|crc|colon(?!ize|ial)|rectal|colonic|rectum|polyps?|adenomas?|adenomatous|sessile serrated|colonoscopy|sigmoidoscopy|fit\b|fob(t)?\b|faecal immunochemical|stool dna|mt-?sdna|ct colonography|screening.*(colon|rectal|colorectal)|early[- ]onset.*(crc|colorectal))\b/i;

// Negative signals (instantly exclude)
const CRC_NEGATIVE =
  /\b(upper gi|nasopharyngeal|nasopharynx|oropharyn(g|x)|esophag(e|us|eal)|gastric|stomach|duoden(al|um)|hepato(biliary)?|biliar(y|e)|pancrea(tic|s)|liver|hepatitis|hcc)\b/i;

function isCRCStrict(title = "", summary = "", content = ""): boolean {
  const hay = `${title}\n${summary}\n${content}`.toLowerCase();
  return CRC_POSITIVE.test(hay) && !CRC_NEGATIVE.test(hay);
}

const TRUSTED_DOMAINS = [
  "nejm.org",
  "jamanetwork.com",
  "thelancet.com",
  "lancet.com",
  "gut.bmj.com",
  "bmj.com",
  "ascopost.com",
  "nccn.org",
  "uspreventiveservicestaskforce.org",
  "cancer.org",
  "nature.com",
  "annals.org",
  "sciencedirect.com",
  "cell.com",
];

const domainOf = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

function normalizeDateInput(value: unknown): string {
  const dateValue =
    typeof value === "string" || value instanceof Date
      ? new Date(value)
      : new Date();

  return Number.isNaN(dateValue.getTime())
    ? new Date().toISOString()
    : dateValue.toISOString();
}

async function upsert(items: any[]) {
  if (!items.length) return;
  
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url) {
    throw new Error('SUPABASE_URL environment variable is required');
  }
  
  if (!key) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  }

  // Create server-side client with service role key
  const supabase = createClient(url, key);

  const rows = items
    .map((item) => {
      const rawScore = item.relevance_score;
      const relevance_score =
        typeof rawScore === "number" && Number.isFinite(rawScore)
          ? rawScore
          : rawScore == null
            ? 5
            : Number(rawScore);

      return {
        title: item.title,
        link: item.url,
        source: item.source,
        summary: item.summary,
        date_published: normalizeDateInput(item.published_at),
        relevance_score: Number.isFinite(relevance_score) ? relevance_score : 5,
      };
    })
    .filter((item) => item.title && item.link);

  if (!rows.length) return;

  const { error } = await supabase
    .from('crc_news_feed')
    .upsert(rows, { onConflict: 'link' });

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }
}

async function aiSummary(title: string, text: string, useAI: boolean) {
  if (!useAI || !process.env.OPENAI_API_KEY) {
    const snippet = (text || "").split(/[\.\n]/).slice(0, 3).join(". ").trim();
    return snippet || "Summary unavailable. Open the original article for details.";
  }

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "Medical editor. Write a neutral 2–3 sentence summary for clinicians about colorectal cancer research, screening policy, or awareness.",
        },
        { role: "user", content: `Title:\n${title}\n\nText:\n${text}\n\nWrite the summary.` },
      ],
    }),
  });

  const j = await r.json();
  return j.choices?.[0]?.message?.content?.trim() || "Summary unavailable.";
}

export async function handler(event: any) {
  const started = Date.now();
  const FAST = event.queryStringParameters?.fast === "1";
  const useAI = !FAST; // skip AI in fast mode
  const feeds = FAST ? FEEDS.slice(0, 4) : FEEDS;

  const collected: any[] = [];

  for (const f of feeds) {
    if (Date.now() - started > 23000) break; // stay under Netlify 30s limit

    let out: any;
    try {
      out = await parser.parseURL(f.url);
    } catch {
      continue;
    }

    const sourceTitle = out.title || "";

    for (const it of out.items?.slice(0, FAST ? 6 : 12) || []) {
      const title = it.title || "";
      const link = it.link || it.guid || "";
      if (!title || !link) continue;

      const dom = domainOf(link);
      if (!TRUSTED_DOMAINS.includes(dom)) continue;

      const text = `${it.contentSnippet || ""}\n${it.content || ""}\n${it.summary || ""}`;
      if (!isCRCStrict(title, it.contentSnippet || it.summary || "", it.content || "")) continue;

      const summary = await aiSummary(title, text, useAI);
      const pub = it.isoDate || it.pubDate || new Date().toISOString();

      collected.push({
        title,
        url: link,
        source: sourceTitle || dom,
        published_at: normalizeDateInput(pub),
        summary,
        relevance_score: 5,
      });

      if (Date.now() - started > 25000) break;
    }
  }

  try {
    await upsert(collected);
  } catch (e: any) {
    console.error("News function error:", e?.message);
    return { 
      statusCode: 500, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "server_error" }) 
    };
  }

  return { 
    statusCode: 200, 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inserted_or_merged: collected.length, fast: FAST }) 
  };
}
