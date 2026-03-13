// @ts-nocheck
/**
 * Early Signal Detection Engine — Scheduled Netlify Function
 *
 * Detects research signals before media amplification:
 * 1. Monitor PubMed for recent papers
 * 2. Check if they appear in Google News
 * 3. If paper exists in PubMed but NOT in news → flag as early_warning_signal
 * 4. Generate strategic analysis for high-confidence signals
 *
 * Schedule: 0 */12 * * *  (every 12 hours)
 */

import { createClient } from '@supabase/supabase-js';

const EARLY_SIGNAL_QUERIES = [
  'blood-based colorectal cancer screening',
  'ctDNA colorectal detection',
  'methylation biomarker colorectal',
  'liquid biopsy CRC sensitivity specificity',
  'multi-cancer early detection colorectal',
];

async function searchPubMed(query: string, max = 5): Promise<string[]> {
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${max}&sort=pub+date&retmode=json&datetype=edat&reldate=7`;
  const res = await fetch(url, { headers: { 'User-Agent': 'COLONAiVE/EarlySignal' } });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.esearchresult?.idlist ?? [];
}

async function fetchPubMedDetails(ids: string[]) {
  if (!ids.length) return [];
  const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'COLONAiVE/EarlySignal' } });
  if (!res.ok) return [];
  const data = await res.json();

  return ids.map(id => {
    const m = data?.result?.[id];
    if (!m?.title) return null;
    return {
      pubmed_id: id,
      title: m.title,
      journal: m.fulljournalname || m.source || '',
      link: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
    };
  }).filter(Boolean);
}

async function isInGoogleNews(title: string): Promise<boolean> {
  try {
    // Search for the exact title in Google News
    const shortTitle = title.split(/[.:]/).slice(0, 2).join(' ').slice(0, 80);
    const res = await fetch(
      `https://news.google.com/rss/search?q=${encodeURIComponent(shortTitle)}&hl=en&gl=US&ceid=US:en`,
      { headers: { 'User-Agent': 'COLONAiVE/EarlySignal' } },
    );
    if (!res.ok) return false;
    const xml = await res.text();
    // If we find any items, it's in the news
    return /<item>/i.test(xml);
  } catch {
    return false;
  }
}

async function generateAnalysis(
  title: string,
  journal: string,
  openaiKey: string,
): Promise<{ analysis: string; market_implication: string; recommended_action: string } | null> {
  if (!openaiKey) return null;
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are a strategic intelligence analyst for a colorectal cancer screening company.
Return JSON: {"analysis":"...", "market_implication":"...", "recommended_action":"..."}
Each field should be 1-2 sentences. Focus on competitive positioning and strategic relevance.`,
          },
          {
            role: 'user',
            content: `Early research signal detected before media coverage:
Title: ${title}
Journal: ${journal}
Provide strategic analysis.`,
          },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return JSON.parse(data.choices?.[0]?.message?.content || '{}');
  } catch {
    return null;
  }
}

export async function handler() {
  const started = Date.now();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing env vars' }) };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const stats = { scanned: 0, early_signals: 0, strategies: 0 };

  try {
    // Collect recent PubMed papers
    const allIds = new Set<string>();
    for (const q of EARLY_SIGNAL_QUERIES) {
      if (Date.now() - started > 18000) break;
      const ids = await searchPubMed(q, 3);
      ids.forEach((id: string) => allIds.add(id));
    }

    const papers = await fetchPubMedDetails([...allIds]);
    stats.scanned = papers.length;

    // Check existing early warning signals to avoid duplicates
    const { data: existingSignals } = await supabase
      .from('early_warning_signals')
      .select('source_link');
    const existingLinks = new Set((existingSignals || []).map((s: any) => s.source_link));

    for (const paper of papers) {
      if (Date.now() - started > 25000) break;
      if (!paper || existingLinks.has(paper.link)) continue;

      // Check if this paper has media coverage
      const inMedia = await isInGoogleNews(paper.title);

      // Higher confidence if not yet in media (early signal)
      const confidence = inMedia ? 30 : 75;

      // Generate strategic analysis for high-confidence signals
      let strategyAnalysis = null;
      if (confidence >= 60 && openaiKey) {
        strategyAnalysis = await generateAnalysis(paper.title, paper.journal, openaiKey);
      }

      const { error } = await supabase.from('early_warning_signals').upsert({
        title: paper.title,
        source: paper.journal || 'PubMed',
        source_link: paper.link,
        pubmed_id: paper.pubmed_id,
        confidence_score: confidence,
        signal_category: 'research',
        analysis: strategyAnalysis?.analysis || null,
        market_implication: strategyAnalysis?.market_implication || null,
        recommended_action: strategyAnalysis?.recommended_action || null,
        in_media: inMedia,
      }, { onConflict: 'source_link' });

      if (!error) stats.early_signals++;

      // Save strategy implication if generated
      if (strategyAnalysis && confidence >= 60) {
        await supabase.from('strategy_implications').insert({
          signal_title: paper.title,
          analysis: strategyAnalysis.analysis,
          market_implication: strategyAnalysis.market_implication,
          recommended_action: strategyAnalysis.recommended_action,
          priority: confidence >= 70 ? 'high' : 'monitor',
        });
        stats.strategies++;
      }
    }

  } catch (err: any) {
    console.error('Early signal scan error:', err?.message);
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err?.message }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, stats, duration_ms: Date.now() - started }),
  };
}

export const config = {
  schedule: '0 */12 * * *',
};
