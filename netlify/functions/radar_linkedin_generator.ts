// @ts-nocheck
/**
 * Radar → LinkedIn Generator — Netlify Function
 *
 * Scans crc_research_signals for high-score signals (radar_score >= 10)
 * and generates LinkedIn post drafts, inserting them into linkedin_posts.
 *
 * GET /.netlify/functions/radar_linkedin_generator
 */

import { createClient } from '@supabase/supabase-js';

const HASHTAG_BASE = [
  '#ColorectalCancer', '#CRCScreening', '#EarlyDetection',
  '#CancerPrevention', '#PublicHealth', '#ColonAiVE',
];

const COLONAIQ_KEYWORDS = [
  'blood-based', 'blood based', 'ctdna', 'liquid biopsy',
  'methylation', 'non-invasive screening', 'non invasive screening',
  'cell-free dna', 'cell free dna', 'cfdna',
];

const COLONOSCOPY_GUARDRAIL =
  'Screening tests help identify individuals who should undergo colonoscopy, which remains the gold standard for diagnosis and prevention.';

function shouldIncludeColonAiQ(text: string): boolean {
  const lower = text.toLowerCase();
  return COLONAIQ_KEYWORDS.some((kw) => lower.includes(kw));
}

function generateHashtags(text: string): string {
  const tags = [...HASHTAG_BASE];
  const lower = text.toLowerCase();
  if (COLONAIQ_KEYWORDS.some((kw) => lower.includes(kw))) tags.push('#BloodBasedScreening');
  if (lower.includes('liquid biopsy')) tags.push('#LiquidBiopsy');
  if (lower.includes('clinical trial')) tags.push('#ClinicalTrials');
  if (lower.includes('methylation')) tags.push('#Methylation');
  if (lower.includes('ctdna')) tags.push('#ctDNA');
  return [...new Set(tags)].join(' ');
}

async function generateLinkedInDraft(
  signal: { title: string; headline: string; key_finding: string; strategic_relevance: string; link: string },
  openaiKey: string,
): Promise<string> {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${openaiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        messages: [
          {
            role: 'system',
            content: `You write LinkedIn thought-leadership posts for a healthcare CEO who leads a colorectal cancer screening movement in Singapore.
Tone: Scientific, neutral, thought-provoking, non-promotional.
Length: 150-250 words.
Structure: Hook line → key insight → strategic reflection → call to awareness.
Never promote any specific product or company. Focus on the science and the public health mission.`,
          },
          {
            role: 'user',
            content: `Write a LinkedIn post based on this research signal:
Title: ${signal.title}
Key Finding: ${signal.key_finding || 'N/A'}
Strategic Relevance: ${signal.strategic_relevance || 'N/A'}
Source: ${signal.link}`,
          },
        ],
      }),
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || '';
  } catch {
    return '';
  }
}

export async function handler() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || '';

  if (!supabaseUrl || !serviceRoleKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing env vars' }) };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // Fetch high-score radar signals (score >= 10)
  const { data: signals, error: sigErr } = await supabase
    .from('crc_research_signals')
    .select('id,title,headline,key_finding,strategic_relevance,link,radar_score,journal,publication_date')
    .gte('radar_score', 10)
    .order('radar_score', { ascending: false })
    .limit(20);

  if (sigErr) {
    return { statusCode: 500, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ error: sigErr.message }) };
  }

  if (!signals?.length) {
    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ generated: 0, message: 'No signals above threshold' }) };
  }

  // Check existing source_urls to avoid duplicates
  const { data: existing } = await supabase.from('linkedin_posts').select('source_url');
  const existingUrls = new Set((existing || []).map((e: any) => e.source_url));

  let generated = 0;
  for (const signal of signals) {
    if (existingUrls.has(signal.link)) continue;

    const text = `${signal.title} ${signal.headline || ''} ${signal.key_finding || ''} ${signal.strategic_relevance || ''}`;
    const includeColonAiQ = shouldIncludeColonAiQ(text);
    const hashtags = generateHashtags(text);

    // Generate AI post content
    let postContent = await generateLinkedInDraft(signal, openaiKey);

    // Build draft
    const lines: string[] = [];
    lines.push(signal.headline || signal.title);
    lines.push('');
    if (postContent) {
      lines.push(postContent);
    } else {
      // Fallback
      if (signal.key_finding) lines.push(signal.key_finding);
      if (signal.strategic_relevance) { lines.push(''); lines.push(signal.strategic_relevance); }
    }
    lines.push('');
    lines.push(COLONOSCOPY_GUARDRAIL);
    lines.push('');
    lines.push(`Source: ${signal.link}`);
    if (signal.journal) lines.push(`(${signal.journal})`);
    lines.push('');
    lines.push(hashtags);

    const imagePrompt = `medical illustration of colorectal cancer screening awareness, colon outline icon, early detection theme, professional healthcare style, teal and white palette — inspired by: "${(signal.title || '').slice(0, 80)}"`;

    const { error: insertErr } = await supabase.from('linkedin_posts').insert({
      source_url: signal.link,
      title: signal.headline || signal.title,
      draft_content: lines.join('\n'),
      hashtags,
      image_prompt: imagePrompt,
      colonaiq_context: includeColonAiQ,
      status: 'new',
      relevance_score: signal.radar_score,
      source_name: signal.journal || 'CRC Research Radar',
    });

    if (!insertErr) generated++;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true, generated, scanned: signals.length }),
  };
}
