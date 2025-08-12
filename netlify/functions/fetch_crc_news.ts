import type { Handler } from "@netlify/functions";
import crypto from "crypto";
// @ts-ignore
import Parser from "rss-parser";

const parser: any = new (Parser as any)({ headers: { "User-Agent": "COLONAiVE/NewsFetcher" } });

// Feeds (we'll limit when in "fast" mode)
const FEEDS: { url: string; category: "Clinical Research" | "Screening & Policy" | "Awareness & Campaigns" }[] = [
  { url: "https://www.nejm.org/feed/rss", category: "Clinical Research" },
  { url: "https://jamanetwork.com/rss/site_9/mostRecentIssue.xml", category: "Clinical Research" },
  { url: "https://www.thelancet.com/rssfeed/lancet_oncology_current.xml", category: "Clinical Research" },
  { url: "https://gut.bmj.com/rss/current.xml", category: "Clinical Research" },
  { url: "https://ascopost.com/rss", category: "Clinical Research" },
  { url: "https://www.nccn.org/rss", category: "Screening & Policy" },
  { url: "https://www.uspreventiveservicestaskforce.org/uspstf/site-feed.xml", category: "Screening & Policy" },
  { url: "https://www.cancer.org/feeds/newsroom.rss", category: "Awareness & Campaigns" },
];

const CRC_KEYWORDS = ["colorectal","colon cancer","rectal cancer","crc","adenoma","advanced adenoma","polyp","polyps","colonoscopy","screening","sigmoidoscopy","fecal","stool test","ct colonography","blood-based","liquid biopsy","dna methylation","fit","fobt","mt-sdna"];
const TRUSTED_DOMAINS = ["nejm.org","jamanetwork.com","thelancet.com","lancet.com","gut.bmj.com","bmj.com","ascopost.com","nccn.org","uspreventiveservicestaskforce.org","cancer.org","nature.com","annals.org","sciencedirect.com","cell.com"];

const sha = (s:string)=>crypto.createHash("sha256").update(s).digest("hex");
const domainOf = (u:string)=>{ try { return new URL(u).hostname.replace(/^www\./,""); } catch { return ""; } };
const isCRC = (t?:string)=> (t||"").toLowerCase() && CRC_KEYWORDS.some(k => (t||"").toLowerCase().includes(k));

async function upsert(items: any[]) {
  if (!items.length) return;
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const res = await fetch(`${url}/rest/v1/crc_news`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type":"application/json", Prefer:"resolution=merge-duplicates" },
    body: JSON.stringify(items),
  });
  if (!res.ok) throw new Error(`Supabase upsert failed: ${res.status} ${await res.text()}`);
}

async function aiSummary(title:string, text:string, useAI:boolean) {
  if (!useAI || !process.env.OPENAI_API_KEY) {
    const snippet = (text||"").split(/[\.\n]/).slice(0,3).join(". ").trim();
    return snippet || "Summary unavailable. Open the original article for details.";
  }
  const r = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type":"application/json"},
    body:JSON.stringify({
      model:"gpt-4o-mini",
      temperature:0.2,
      messages:[
        {role:"system",content:"Medical editor. Write a neutral 2–3 sentence summary for clinicians about colorectal cancer research or screening policy."},
        {role:"user",content:`Title: ${title}\nText:\n${text}\n\nWrite the summary.`}
      ]
    })
  });
  const j = await r.json();
  return j.choices?.[0]?.message?.content?.trim() || "Summary unavailable.";
}

export const handler: Handler = async (event) => {
  const started = Date.now();
  const FAST = event.queryStringParameters?.fast === "1";
  const useAI = !FAST; // fast mode skips AI

  // In fast mode, use fewer feeds and cap items
  const feeds = FAST ? FEEDS.slice(0, 4) : FEEDS;

  const collected: any[] = [];

  for (const f of feeds) {
    if (Date.now() - started > 23000) break; // safety to avoid 30s timeout

    let out:any;
    try { out = await parser.parseURL(f.url); } catch { continue; }
    const sourceTitle = out.title || "";

    for (const it of out.items?.slice(0, FAST ? 6 : 12) || []) {
      const title = it.title || "";
      const link = it.link || it.guid || "";
      if (!title || !link) continue;
      const dom = domainOf(link);
      if (!TRUSTED_DOMAINS.includes(dom)) continue;

      const text = `${it.contentSnippet || ""}\n${it.content || ""}\n${it.summary || ""}`;
      if (!isCRC(`${title}\n${text}`)) continue;

      const summary = await aiSummary(title, text, useAI);
      const pub = it.isoDate || it.pubDate || new Date().toISOString();

      collected.push({
        title,
        url: link,
        source: sourceTitle || dom,
        source_domain: dom,
        authors: it.creator ? [String(it.creator)] : [],
        image_url: it.enclosure?.url || null,
        category: f.category,
        published_at: new Date(pub).toISOString(),
        summary,
        tags: [],
        hash: sha(`${title}|${link}`),
      });

      if (Date.now() - started > 25000) break;
    }
  }

  try { await upsert(collected); } catch (e:any) { return { statusCode: 500, body: e.message || "upsert error" }; }
  return { statusCode: 200, body: JSON.stringify({ inserted_or_merged: collected.length, fast: FAST }) };
};
