// @ts-nocheck
// CRC Research Radar — Scheduled Netlify Function
// Runs every 6 hours to collect, score, deduplicate, and store CRC intelligence.
// Schedule: 0 */6 * * *

import { createClient } from '@supabase/supabase-js';

// ---- PubMed Collector ----
const PUBMED_QUERIES = [
  'colorectal cancer screening',
  'ctDNA screening colorectal',
  'DNA methylation colorectal cancer',
  'liquid biopsy colorectal cancer',
];

async function searchPubMed(query: string, max = 5): Promise<string[]> {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${max}&sort=pub+date&retmode=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'COLONAiVE/Radar' } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.esearchresult?.idlist ?? [];
}

async function fetchPubMedSummaries(ids: string[]) {
  if (!ids.length) return [];
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'COLONAiVE/Radar' } });
  if (!res.ok) return [];
  const data = await res.json();

  // Fetch abstracts
  let abstractMap: Record<string, string> = {};
  try {
    const absUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml&rettype=abstract`;
    const absRes = await fetch(absUrl, { headers: { 'User-Agent': 'COLONAiVE/Radar' } });
    if (absRes.ok) {
      const xml = await absRes.text();
      const articles = xml.split('<PubmedArticle>');
      for (const article of articles) {
        const pmid = article.match(/<PMID[^>]*>(\d+)<\/PMID>/)?.[1];
        const abs = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/)?.[1];
        if (pmid && abs) abstractMap[pmid] = abs.replace(/<[^>]+>/g, '').trim();
      }
    }
  } catch {}

  return ids.map(id => {
    const m = data?.result?.[id];
    if (!m?.title) return null;
    const authors = Array.isArray(m.authors) ? m.authors.map((a: any) => a?.name).filter(Boolean).join(', ') : '';
    return {
      source: 'PubMed',
      title: m.title,
      authors,
      journal: m.fulljournalname || m.source || '',
      publication_date: m.pubdate || m.epubdate || new Date().toISOString(),
      link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
      abstract: abstractMap[id] || '',
      signal_type: 'research',
    };
  }).filter(Boolean);
}

// ---- ClinicalTrials.gov Collector ----
const CT_QUERIES = ['colorectal cancer screening', 'ctDNA colorectal', 'methylation biomarkers colorectal'];

async function fetchClinicalTrials() {
  const results: any[] = [];
  const seen = new Set<string>();

  for (const q of CT_QUERIES) {
    try {
      const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(q)}&filter.overallStatus=RECRUITING,NOT_YET_RECRUITING,ACTIVE_NOT_RECRUITING&pageSize=10&sort=LastUpdatePostDate`;
      const res = await fetch(url, { headers: { 'User-Agent': 'COLONAiVE/Radar' } });
      if (!res.ok) continue;
      const data = await res.json();

      for (const study of (data?.studies || [])) {
        const proto = study?.protocolSection;
        if (!proto) continue;
        const nctId = proto.identificationModule?.nctId;
        if (!nctId || seen.has(nctId)) continue;
        seen.add(nctId);

        const locs = proto.contactsLocationsModule?.locations || [];
        results.push({
          trial_id: nctId,
          title: proto.identificationModule?.briefTitle || '',
          institution: proto.identificationModule?.organization?.fullName || locs[0]?.facility || '',
          phase: (proto.designModule?.phases || []).join(', ') || 'Not specified',
          status: proto.statusModule?.overallStatus || '',
          country: locs[0]?.country || '',
          link: `https://clinicaltrials.gov/study/${nctId}`,
          summary: (proto.descriptionModule?.briefSummary || '').slice(0, 1000),
        });
      }
    } catch { continue; }
  }
  return results;
}

// ---- Google News Collector ----
const NEWS_KEYWORDS = ['colorectal cancer screening', 'blood test colorectal cancer', 'liquid biopsy colorectal cancer'];

function extractRssItems(xml: string) {
  const items: any[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[1];
    const title = b.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
    const link = b.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const pubDate = b.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim() || '';
    const source = b.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.trim() || 'Google News';
    if (title && link) items.push({ title, link, pubDate, source });
  }
  return items;
}

async function fetchGoogleNews() {
  const results: any[] = [];
  const seen = new Set<string>();

  for (const kw of NEWS_KEYWORDS) {
    try {
      const res = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(kw)}&hl=en&gl=US&ceid=US:en`, {
        headers: { 'User-Agent': 'COLONAiVE/Radar' },
      });
      if (!res.ok) continue;
      const xml = await res.text();
      for (const item of extractRssItems(xml).slice(0, 8)) {
        if (seen.has(item.link)) continue;
        seen.add(item.link);
        results.push({
          title: item.title,
          publication: item.source,
          link: item.link,
          summary: '',
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        });
      }
    } catch { continue; }
  }
  return results;
}

// ---- FDA Collector ----
async function fetchFDA() {
  const results: any[] = [];
  try {
    const res = await fetch('https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/press-releases/rss.xml', {
      headers: { 'User-Agent': 'COLONAiVE/Radar' },
    });
    if (!res.ok) return results;
    const xml = await res.text();
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const b = m[1];
      const title = b.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
      const link = b.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
      const desc = b.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim() || '';
      if (!title || !link) continue;
      if (!/\b(cancer diagnostics?|liquid biopsy|ctdna|colorectal|colon cancer|screening test)\b/i.test(`${title} ${desc}`)) continue;
      results.push({
        country: 'United States',
        policy_title: title,
        description: desc.replace(/<[^>]+>/g, '').slice(0, 500),
        source_link: link,
      });
    }
  } catch {}
  return results;
}

// ---- Radar Scoring ----
const HIGH_IF = ['new england journal', 'nejm', 'lancet', 'jama', 'nature', 'bmj', 'cell', 'gut', 'gastroenterology', 'journal of clinical oncology', 'annals of oncology', 'science'];

function computeScore(title: string, abstract: string, journal: string): number {
  const hay = `${title}\n${abstract}\n${journal}`.toLowerCase();
  let s = 0;
  if (HIGH_IF.some(j => hay.includes(j))) s += 5;
  if (/\bclinical trial\b/i.test(hay)) s += 4;
  if (/\bscreening\b.*\bpopulation\b|\bpopulation[- ]based\b.*\bscreening\b/i.test(hay)) s += 4;
  if (/\bctdna\b|\bcirculating tumor dna\b/i.test(hay)) s += 3;
  if (/\bliquid biopsy\b/i.test(hay)) s += 3;
  if (/\bdna methylation\b|\bmethylation\b/i.test(hay)) s += 3;
  if (/\bpolicy\b|\bguideline\b|\brecommendation\b/i.test(hay)) s += 3;
  if (/\b\d{3,}\s*(patients?|participants?|subjects?)\b/i.test(hay)) s += 3;
  if (/\bnews\b|\bpress release\b/i.test(hay)) s += 2;
  if (/\bearly detection\b|\bearly[- ]onset\b/i.test(hay)) s += 3;
  if (/\bnon[- ]invasive\b|\bblood[- ]based\b/i.test(hay)) s += 3;
  if (/\bscreening\b/i.test(hay)) s += 2;
  return s;
}

// ---- AI Summary ----
async function aiSummarize(title: string, abstract: string, openaiKey: string) {
  if (!openaiKey || !abstract) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini', temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'Medical intelligence analyst. Return JSON: {"headline":"...", "key_finding":"...", "strategic_relevance":"...", "public_summary":"..."}. Neutral, evidence-based, max 2 sentences each.' },
          { role: 'user', content: `Title: ${title}\nAbstract: ${abstract.slice(0, 3000)}` },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch { return null; }
}

// ---- MAIN HANDLER ----
export async function handler() {
  const started = Date.now();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing SUPABASE env vars' }) };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const stats = { signals: 0, trials: 0, policies: 0, media: 0 };

  try {
    // 1. Collect PubMed research signals
    const allPubmedIds = new Set<string>();
    for (const q of PUBMED_QUERIES) {
      if (Date.now() - started > 20000) break;
      const ids = await searchPubMed(q, 5);
      ids.forEach((id: string) => allPubmedIds.add(id));
    }
    const pubmedResults = await fetchPubMedSummaries([...allPubmedIds]);

    // Score and summarize each signal
    for (const signal of pubmedResults) {
      if (Date.now() - started > 25000) break;
      const score = computeScore(signal.title, signal.abstract, signal.journal);
      if (score < 5) continue; // skip low-priority

      let summary = null;
      if (score >= 8 && openaiKey) {
        summary = await aiSummarize(signal.title, signal.abstract, openaiKey);
      }

      const row = {
        source: signal.source,
        title: signal.title,
        authors: signal.authors,
        journal: signal.journal,
        publication_date: signal.publication_date,
        link: signal.link,
        abstract: signal.abstract,
        summary: summary?.public_summary || signal.abstract?.slice(0, 500) || '',
        topic_tags: extractTags(signal.title, signal.abstract),
        radar_score: score,
        signal_type: signal.signal_type,
        headline: summary?.headline || signal.title,
        key_finding: summary?.key_finding || '',
        strategic_relevance: summary?.strategic_relevance || '',
        public_summary: summary?.public_summary || '',
      };

      const { error } = await supabase.from('crc_research_signals').upsert(row, { onConflict: 'link' });
      if (!error) stats.signals++;
    }

    // 2. Collect clinical trials
    if (Date.now() - started < 22000) {
      const trials = await fetchClinicalTrials();
      for (const trial of trials.slice(0, 20)) {
        const { error } = await supabase.from('crc_trials').upsert(trial, { onConflict: 'trial_id' });
        if (!error) stats.trials++;
      }
    }

    // 3. Collect Google News (media mentions)
    if (Date.now() - started < 22000) {
      const news = await fetchGoogleNews();
      for (const item of news.slice(0, 15)) {
        const { error } = await supabase.from('crc_media_mentions').upsert({
          title: item.title,
          publication: item.publication,
          link: item.link,
          summary: item.summary,
        }, { onConflict: 'link' });
        if (!error) stats.media++;
      }
    }

    // 4. Collect FDA policy updates
    if (Date.now() - started < 22000) {
      const fda = await fetchFDA();
      for (const item of fda) {
        const { error } = await supabase.from('crc_policy_updates').insert(item);
        if (!error) stats.policies++;
      }
    }

  } catch (err: any) {
    console.error('CRC Radar error:', err?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err?.message, stats }),
    };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, stats, duration_ms: Date.now() - started }),
  };
}

function extractTags(title: string, abstract: string): string[] {
  const hay = `${title} ${abstract}`.toLowerCase();
  const tags: string[] = [];
  if (/\bscreening\b/.test(hay)) tags.push('screening');
  if (/\bctdna\b/.test(hay)) tags.push('ctDNA');
  if (/\bmethylation\b/.test(hay)) tags.push('methylation');
  if (/\bliquid biopsy\b/.test(hay)) tags.push('liquid-biopsy');
  if (/\bcolonoscopy\b/.test(hay)) tags.push('colonoscopy');
  if (/\bearly detection\b/.test(hay)) tags.push('early-detection');
  if (/\bguideline\b/.test(hay)) tags.push('guidelines');
  if (/\bpolicy\b/.test(hay)) tags.push('policy');
  if (/\bclinical trial\b/.test(hay)) tags.push('clinical-trial');
  if (/\bnon[- ]invasive\b|\bblood[- ]based\b/.test(hay)) tags.push('non-invasive');
  return tags;
}

export const config = {
  schedule: '0 */6 * * *',
};
