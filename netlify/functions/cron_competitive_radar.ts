// @ts-nocheck
// Competitive Intelligence Radar — Scheduled Netlify Function
// Monitors competitor activity and technology trends in the CRC screening space.
// Schedule: 0 */6 * * *  (every 6 hours)

import { createClient } from '@supabase/supabase-js';

const COMPETITORS = [
  { name: 'Guardant Health', keywords: ['guardant', 'shield test'] },
  { name: 'Exact Sciences', keywords: ['exact sciences', 'cologuard'] },
  { name: 'Freenome', keywords: ['freenome'] },
  { name: 'Grail', keywords: ['grail', 'galleri'] },
  { name: 'Delfi Diagnostics', keywords: ['delfi diagnostics', 'fragmentomics'] },
  { name: 'Natera', keywords: ['natera', 'signatera'] },
];

const TREND_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: 'Blood-based CRC screening', pattern: /\bblood[- ]based\b.*\b(screen|crc|colorectal)\b/i },
  { name: 'ctDNA liquid biopsy', pattern: /\bctdna\b|\bcirculating tumor dna\b/i },
  { name: 'Multi-cancer early detection', pattern: /\bmulti[- ]cancer\b.*\bdetection\b|\bMCED\b/i },
  { name: 'DNA methylation biomarkers', pattern: /\bmethylation\b.*\bbiomarker/i },
  { name: 'AI-assisted screening', pattern: /\b(artificial intelligence|machine learning|AI)\b.*\bscreen/i },
  { name: 'Fragmentomics', pattern: /\bfragmentomic/i },
  { name: 'Stool DNA testing', pattern: /\bstool\b.*\bdna\b|\bmt-?sdna\b/i },
];

function extractRssItems(xml: string) {
  const items: any[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const b = m[1];
    const title = b.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim() || '';
    const link = b.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const desc = b.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/)?.[1]?.trim() || '';
    if (title && link) items.push({ title, link, description: desc.replace(/<[^>]+>/g, '').slice(0, 500) });
  }
  return items;
}

export async function handler() {
  const started = Date.now();
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing env vars' }) };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const stats = { competitor_signals: 0, trends: 0 };

  try {
    // Scan Google News for each competitor
    for (const comp of COMPETITORS) {
      if (Date.now() - started > 20000) break;

      for (const kw of comp.keywords) {
        try {
          const res = await fetch(
            `https://news.google.com/rss/search?q=${encodeURIComponent(kw + ' colorectal cancer')}&hl=en&gl=US&ceid=US:en`,
            { headers: { 'User-Agent': 'COLONAiVE/CompRadar' } },
          );
          if (!res.ok) continue;
          const xml = await res.text();

          for (const item of extractRssItems(xml).slice(0, 5)) {
            // Score based on content relevance
            const hay = `${item.title} ${item.description}`.toLowerCase();
            let score = 5;
            if (/\bfda\b|\bapproval\b|\bclearance\b/i.test(hay)) score += 5;
            if (/\bclinical trial\b|\bphase\b/i.test(hay)) score += 3;
            if (/\bpartnership\b|\bacquisition\b|\bmerger\b/i.test(hay)) score += 4;
            if (/\blaunch\b|\bcommercial\b/i.test(hay)) score += 3;
            if (/\bresult\b|\bdata\b|\bstudy\b/i.test(hay)) score += 2;

            const { error } = await supabase.from('competitor_signals').upsert({
              company_name: comp.name,
              title: item.title,
              description: item.description,
              source: 'Google News',
              source_link: item.link,
              signal_score: Math.min(score, 25),
              signal_type: 'news',
            }, { onConflict: 'id' });

            // Use insert instead since we don't have unique constraint on source_link
            if (!error) stats.competitor_signals++;
          }
        } catch { continue; }
      }
    }

    // Detect technology trends from recent radar signals
    if (Date.now() - started < 22000) {
      const { data: recentSignals } = await supabase
        .from('crc_research_signals')
        .select('title,abstract,key_finding')
        .order('created_at', { ascending: false })
        .limit(50);

      const trendCounts: Record<string, number> = {};

      for (const signal of recentSignals || []) {
        const hay = `${signal.title} ${signal.abstract || ''} ${signal.key_finding || ''}`;
        for (const trend of TREND_PATTERNS) {
          if (trend.pattern.test(hay)) {
            trendCounts[trend.name] = (trendCounts[trend.name] || 0) + 1;
          }
        }
      }

      for (const [name, count] of Object.entries(trendCounts)) {
        const trendScore = Math.min(count * 10, 100);
        const { error } = await supabase.from('technology_trends').upsert({
          trend_name: name,
          trend_score: trendScore,
          description: `Detected ${count} signal(s) matching this trend in recent research.`,
          evidence_count: count,
        }, { onConflict: 'trend_name' });
        if (!error) stats.trends++;
      }
    }

  } catch (err: any) {
    console.error('Competitive radar error:', err?.message);
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: err?.message }) };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, stats, duration_ms: Date.now() - started }),
  };
}

export const config = {
  schedule: '0 */6 * * *',
};
