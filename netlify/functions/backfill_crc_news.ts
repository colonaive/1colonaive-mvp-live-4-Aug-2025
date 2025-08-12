// @ts-nocheck
// Backfills 6 months (or ?months=N) of CRC news from Google CSE + PubMed into public.crc_news

import crypto from "crypto";

const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
const SUPABASE_SERVICE_ROLE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
const GOOGLE_CSE_ID = (process.env.GOOGLE_CSE_ID || "").trim();
const GOOGLE_API_KEY = (process.env.GOOGLE_API_KEY || "").trim();

// PubMed: supply an email if you have one (optional but recommended)
const PUBMED_EMAIL = (process.env.PUBMED_EMAIL || "colonaive@example.com").trim();

const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const domainOf = (u: string) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

const CRC_POSITIVE = /\b(colorectal|crc|colon(?!ize|ial)|rectal|colonic|rectum|polyps?|adenomas?|adenomatous|sessile serrated|colonoscopy|sigmoidoscopy|fit\b|fob(t)?\b|faecal immunochemical|stool dna|mt-?sdna|ct colonography|screening.*(colon|rectal|colorectal)|early[- ]onset.*(crc|colorectal)|blood[- ]based.*(screen|test|assay).*colorectal)\b/i;
const CRC_NEGATIVE = /\b(upper gi|nasopharyn|oropharyn|esophag|gastric|stomach|duoden|hepato|biliar|pancrea|liver|hepatitis|hcc)\b/i;

function isCRCStrict(title = "", summary = "", content = "") {
  const hay = `${title}\n${summary}\n${content}`.toLowerCase();
  return CRC_POSITIVE.test(hay) && !CRC_NEGATIVE.test(hay);
}

function mapCategory(text: string) {
  const t = text.toLowerCase();
  if (/(guideline|policy|uspstf|nccn|coverage|screening program|insurance|reimbursement|moh|cdc|who)/.test(t))
    return "Screening & Policy";
  if (/(campaign|awareness|survivor|community|csr|public\s+outreach)/.test(t))
    return "Awareness & Campaigns";
  return "Clinical Research";
}

async function upsert(items: any[]) {
  if (!items.length) return;
  const res = await fetch(`${SUPABASE_URL}/rest/v1/crc_news`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(items),
  });
  if (!res.ok) throw new Error(`Supabase upsert failed: ${res.status} ${await res.text()}`);
}

function iso(date: any) {
  const d = new Date(date);
  return isNaN(+d) ? new Date().toISOString() : d.toISOString();
}

// -------- Google Custom Search --------
const GOOGLE_QUERIES = [
  `"blood-based colorectal cancer screening"`,
  `"early-onset colorectal cancer"`,
  `"colorectal cancer" screening`,
  `"colorectal cancer" blood-based`,
  `"mt-sdna" colorectal`,
  `Kaiser colorectal screening`,
  `triple effect colorectal screening`,
];

async function googleSearchBackfill(months: number, limit: number) {
  if (!GOOGLE_CSE_ID || !GOOGLE_API_KEY) return [];
  const dateRestrict = `m${months}`; // last N months
  const results: any[] = [];
  for (const q of GOOGLE_QUERIES) {
    // Google CSE: up to 10 per page, iterate a couple of pages
    for (let start = 1; start <= Math.min(30, limit); start += 10) {
      const url = new URL("https://www.googleapis.com/customsearch/v1");
      url.searchParams.set("q", q);
      url.searchParams.set("cx", GOOGLE_CSE_ID);
      url.searchParams.set("key", GOOGLE_API_KEY);
      url.searchParams.set("num", "10");
      url.searchParams.set("start", String(start));
      url.searchParams.set("dateRestrict", dateRestrict);

      const r = await fetch(url.toString());
      const j = await r.json();
      const items = j.items || [];
      for (const it of items) {
        const title = it.title || "";
        const link = it.link || "";
        const snippet = it.snippet || "";
        if (!title || !link) continue;
        if (!isCRCStrict(title, snippet, "")) continue;

        const dom = domainOf(link);
        const mergedText = `${title} ${snippet} ${dom}`;
        results.push({
          title,
          url: link,
          source: dom || "web",
          source_domain: dom,
          authors: [],
          image_url: null,
          category: mapCategory(mergedText),
          published_at: iso(it.pagemap?.metatags?.[0]?.["article:published_time"] || it.cacheId ? new Date() : new Date()),
          summary: snippet,
          tags: [],
          hash: sha(`${title}|${link}`),
        });
        if (results.length >= limit) break;
      }
      if (results.length >= limit) break;
      await new Promise(res => setTimeout(res, 250)); // be gentle
    }
    if (results.length >= limit) break;
  }
  return results;
}

// -------- PubMed (E-utilities) --------
async function pubmedBackfill(days: number, retmax: number) {
  const term =
    encodeURIComponent(`(colorectal cancer) AND (screening OR blood-based OR "mt-sdna" OR "stool dna" OR colonoscopy)`);
  const base = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  // 1) Search last N days
  const esearch = `${base}/esearch.fcgi?db=pubmed&term=${term}&retmode=json&reldate=${days}&retmax=${retmax}&email=${PUBMED_EMAIL}`;
  const sResp = await fetch(esearch);
  const sJson = await sResp.json();
  const ids: string[] = sJson.esearchresult?.idlist || [];
  if (!ids.length) return [];

  // 2) Summaries
  const esummary = `${base}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json&email=${PUBMED_EMAIL}`;
  const eResp = await fetch(esummary);
  const eJson = await eResp.json();
  const uidMap = eJson.result || {};

  const rows: any[] = [];
  for (const id of ids) {
    const r = uidMap[id];
    if (!r) continue;
    const title = r.title || "";
    const journal = r.fulljournalname || r.source || "PubMed";
    const pubdate = r.pubdate || r.epubdate || new Date().toISOString();
    const url = `https://pubmed.ncbi.nlm.nih.gov/${id}/`;

    if (!isCRCStrict(title, journal, "")) continue;

    const dom = domainOf(url);
    const mergedText = `${title} ${journal}`;
    rows.push({
      title,
      url,
      source: journal,
      source_domain: dom,
      authors: (r.authors || []).map((a: any) => a.name).filter(Boolean),
      image_url: null,
      category: mapCategory(mergedText),
      published_at: iso(pubdate),
      summary: r.elocationid || r.sortfirstauthor ? `${journal}. ${pubdate}` : journal,
      tags: [],
      hash: sha(`${title}|${url}`),
    });
  }
  return rows;
}

export const handler = async (event: any) => {
  try {
    const months = Math.max(1, Math.min(18, parseInt(event.queryStringParameters?.months || "6", 10)));
    const days = months * 30;
    const limit = Math.max(20, Math.min(200, parseInt(event.queryStringParameters?.limit || "120", 10)));

    // Pull from both sources
    const [googleRows, pubmedRows] = await Promise.all([
      googleSearchBackfill(months, Math.floor(limit / 2)),
      pubmedBackfill(days, Math.floor(limit / 2)),
    ]);

    // Deduplicate by URL hash
    const seen = new Set<string>();
    const combined: any[] = [];
    for (const r of [...googleRows, ...pubmedRows]) {
      const key = r.hash;
      if (seen.has(key)) continue;
      seen.add(key);
      combined.push(r);
    }

    await upsert(combined);

    return {
      statusCode: 200,
      body: JSON.stringify({
        inserted_or_merged: combined.length,
        months,
        google: googleRows.length,
        pubmed: pubmedRows.length,
      }),
    };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "backfill error" };
  }
};
