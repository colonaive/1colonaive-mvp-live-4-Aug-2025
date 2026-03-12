// @ts-nocheck

import { createClient } from '@supabase/supabase-js';
// rss-parser types are messy for functions; ignore them.
// @ts-ignore
import Parser from "rss-parser";

const parser: any = new (Parser as any)({
  headers: { "User-Agent": "COLONAiVE/NewsFetcher" },
});

type NewsCategory = "Screening" | "Research" | "Guidelines" | "Policy";

// ---- SOURCE FEEDS (kept broad but we hard‑gate to CRC below) ----
type FeedConfig =
  | {
      kind?: "rss";
      url: string;
      defaultCategory?: NewsCategory;
    }
  | {
      kind: "pubmed";
      label: string;
      query: string;
      defaultCategory?: NewsCategory;
    };

const GOOGLE_NEWS_QUERIES = [
  "colorectal cancer screening",
  "blood-based colorectal cancer screening",
  "ctDNA colorectal cancer screening",
  "early onset colorectal cancer",
  "colon cancer screening program",
];

const FEEDS: FeedConfig[] = [
  {
    kind: "pubmed",
    label: "PubMed: colorectal cancer",
    query:
      '("colorectal cancer"[Title/Abstract] OR "colon cancer"[Title/Abstract] OR "rectal cancer"[Title/Abstract])',
    defaultCategory: "Research",
  },
  { url: "https://www.nejm.org/feed/rss", defaultCategory: "Research" },
  { url: "https://jamanetwork.com/rss/site_9/mostRecentIssue.xml", defaultCategory: "Research" },
  { url: "https://www.thelancet.com/rssfeed/lancet_oncology_current.xml", defaultCategory: "Research" },
  { url: "https://gut.bmj.com/rss/current.xml", defaultCategory: "Research" },
  { url: "https://ascopost.com/rss", defaultCategory: "Research" },
  { url: "https://www.nccn.org/rss", defaultCategory: "Guidelines" },
  { url: "https://www.uspreventiveservicestaskforce.org/uspstf/site-feed.xml", defaultCategory: "Guidelines" },
  { url: "https://www.cancer.org/feeds/newsroom.rss" },
  // Google News RSS feeds — generated from GOOGLE_NEWS_QUERIES
  ...GOOGLE_NEWS_QUERIES.map((q) => ({
    url: `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en&gl=US&ceid=US:en`,
    defaultCategory: "Screening" as NewsCategory,
  })),
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
  "pubmed.ncbi.nlm.nih.gov",
  "news.google.com",
];

const domainOf = (u: string) => {
  try {
    return new URL(u).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// ---- RELEVANCE SCORING ----
// Higher score = more relevant to CRC screening awareness mission
const HIGH_VALUE_KEYWORDS = [
  { pattern: /\bblood[- ]based\b/i, weight: 15 },
  { pattern: /\bscreening\b/i, weight: 12 },
  { pattern: /\bctdna\b/i, weight: 15 },
  { pattern: /\bearly detection\b/i, weight: 14 },
  { pattern: /\bearly[- ]onset\b/i, weight: 12 },
  { pattern: /\bliquid biopsy\b/i, weight: 15 },
  { pattern: /\bmethylation\b/i, weight: 10 },
  { pattern: /\bcolonoscopy\b/i, weight: 8 },
  { pattern: /\bpopulation[- ]based\b/i, weight: 8 },
  { pattern: /\bguideline/i, weight: 8 },
  { pattern: /\bsensitivity|specificity\b/i, weight: 7 },
  { pattern: /\bstool[- ]dna|fit\b/i, weight: 6 },
  { pattern: /\bnon[- ]invasive\b/i, weight: 10 },
  { pattern: /\bstage i\b|stage 1\b/i, weight: 6 },
  { pattern: /\bcost[- ]effective/i, weight: 5 },
];

function computeRelevanceScore(title: string, summary: string): number {
  const hay = `${title}\n${summary}`.toLowerCase();
  let score = 0;
  for (const kw of HIGH_VALUE_KEYWORDS) {
    if (kw.pattern.test(hay)) score += kw.weight;
  }
  // Cap at 100
  return Math.min(score, 100);
}

// ---- LOW-VALUE ARTICLE FILTER ----
// Exclude basic-science articles unless they also mention screening/detection
const LOW_VALUE_PATTERNS = [
  /\bmouse model/i,
  /\borganoid/i,
  /\bcell line/i,
  /\bmolecular pathway/i,
  /\bgene mutation analysis/i,
  /\bin[- ]?vitro\b/i,
  /\bxenograft/i,
  /\btransgenic mice/i,
];

const RESCUE_PATTERNS = [
  /\bscreening\b/i,
  /\bearly detection\b/i,
  /\bblood[- ]based\b/i,
  /\bliquid biopsy\b/i,
  /\bctdna\b/i,
  /\bclinical trial\b/i,
];

function isLowValueArticle(title: string, summary: string): boolean {
  const hay = `${title}\n${summary}`;
  const hasLowValue = LOW_VALUE_PATTERNS.some((p) => p.test(hay));
  if (!hasLowValue) return false;
  // Rescue if it also mentions screening-relevant topics
  const hasRescue = RESCUE_PATTERNS.some((p) => p.test(hay));
  return !hasRescue;
}

function normalizeDateInput(value: unknown): string {
  const dateValue =
    typeof value === "string" || value instanceof Date
      ? new Date(value)
      : new Date();

  return Number.isNaN(dateValue.getTime())
    ? new Date().toISOString()
    : dateValue.toISOString();
}

function canonicalizeCategory(value: unknown): NewsCategory | null {
  if (typeof value !== "string") return null;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  if (
    normalized === "screening" ||
    normalized.includes("screening") ||
    normalized.includes("colonoscopy") ||
    normalized.includes("fit") ||
    normalized.includes("fobt")
  ) {
    return "Screening";
  }

  if (
    normalized === "research" ||
    normalized.includes("research") ||
    normalized.includes("study") ||
    normalized.includes("trial") ||
    normalized.includes("meta-analysis")
  ) {
    return "Research";
  }

  if (
    normalized === "guidelines" ||
    normalized.includes("guideline") ||
    normalized.includes("recommendation") ||
    normalized.includes("uspstf") ||
    normalized.includes("nccn") ||
    normalized.includes("esmo")
  ) {
    return "Guidelines";
  }

  if (
    normalized === "policy" ||
    normalized.includes("policy") ||
    normalized.includes("ministry") ||
    normalized.includes("funding") ||
    normalized.includes("program")
  ) {
    return "Policy";
  }

  return null;
}

function deriveCategory(title = "", summary = "", content = ""): NewsCategory | null {
  const hay = `${title}\n${summary}\n${content}`.trim().toLowerCase();
  if (!hay) {
    return null;
  }

  if (/\b(screen|screening|colonoscopy|sigmoidoscopy|stool|fit|fobt|blood test|fecal|faecal)\b/.test(hay)) {
    return "Screening";
  }

  if (/\b(guideline|guidelines|recommendation|task force|uspstf|nccn|esmo|asco|consensus)\b/.test(hay)) {
    return "Guidelines";
  }

  if (/\b(study|trial|cohort|research|meta-analysis|systematic review|randomized|randomised|preprint|journal)\b/.test(hay)) {
    return "Research";
  }

  if (/\b(ministry|government|policy|funding|programme|program|initiative|national)\b/.test(hay)) {
    return "Policy";
  }

  return null;
}

function resolveCategory(item: any, defaultCategory: NewsCategory | undefined, title: string, summary: string, content: string) {
  const categoryCandidates = [
    ...(Array.isArray(item?.categories) ? item.categories : []),
    item?.category,
    defaultCategory,
  ];

  for (const candidate of categoryCandidates) {
    const canonical = canonicalizeCategory(candidate);
    if (canonical) {
      return canonical;
    }
  }

  return deriveCategory(title, summary, content);
}

async function fetchPubMedFeed(feed: Extract<FeedConfig, { kind: "pubmed" }>) {
  const searchUrl =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi" +
    `?db=pubmed&term=${encodeURIComponent(feed.query)}&retmax=3&sort=pub+date&retmode=json`;
  const searchResponse = await fetch(searchUrl, {
    headers: { "User-Agent": "COLONAiVE/NewsFetcher" },
  });

  if (!searchResponse.ok) {
    throw new Error(`PubMed search failed: ${searchResponse.status}`);
  }

  const searchJson = await searchResponse.json();
  const ids = searchJson?.esearchresult?.idlist ?? [];

  if (!Array.isArray(ids) || !ids.length) {
    return { title: feed.label, items: [] };
  }

  const summaryUrl =
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi" +
    `?db=pubmed&id=${ids.join(",")}&retmode=json`;
  const summaryResponse = await fetch(summaryUrl, {
    headers: { "User-Agent": "COLONAiVE/NewsFetcher" },
  });

  if (!summaryResponse.ok) {
    throw new Error(`PubMed summary failed: ${summaryResponse.status}`);
  }

  const summaryJson = await summaryResponse.json();

  return {
    title: feed.label,
    items: ids
      .map((id: string) => {
        const meta = summaryJson?.result?.[id];
        if (!meta?.title) return null;

        const pubDate =
          meta.pubdate ||
          meta.epubdate ||
          meta.sortpubdate ||
          meta.sortfirstauthor ||
          new Date().toISOString();
        const byline = Array.isArray(meta.authors)
          ? meta.authors.map((author: any) => author?.name).filter(Boolean).join(", ")
          : "";

        return {
          title: meta.title,
          link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          pubDate,
          contentSnippet: [meta.fulljournalname || meta.source || "", byline].filter(Boolean).join(". "),
          categories: [feed.defaultCategory].filter(Boolean),
        };
      })
      .filter(Boolean),
  };
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
        category: item.category ?? null,
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
      out =
        f.kind === "pubmed"
          ? await fetchPubMedFeed(f)
          : await parser.parseURL(f.url);
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

      // Filter out low-value basic-science articles
      if (isLowValueArticle(title, text)) continue;

      const summary = await aiSummary(title, text, useAI);
      const pub = it.isoDate || it.pubDate || new Date().toISOString();
      const category = resolveCategory(it, f.defaultCategory, title, it.contentSnippet || it.summary || "", it.content || "");

      // Compute relevance score based on screening-related keywords
      const relevance = computeRelevanceScore(title, summary);

      collected.push({
        title,
        url: link,
        source: sourceTitle || dom,
        category,
        published_at: normalizeDateInput(pub),
        summary,
        relevance_score: relevance,
      });

      if (Date.now() - started > 25000) break;
    }
  }

  // Sort by relevance score descending before upserting
  collected.sort((a, b) => (b.relevance_score || 0) - (a.relevance_score || 0));

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
