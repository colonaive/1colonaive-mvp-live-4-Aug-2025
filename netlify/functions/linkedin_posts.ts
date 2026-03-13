// @ts-nocheck
/**
 * LinkedIn Post Intelligence — Netlify Function
 *
 * Actions:
 *   ?action=generate  — scan crc_news_feed for high-relevance articles, create post drafts
 *   ?action=list       — return all linkedin_posts (filterable by status)
 *   ?action=update     — update a post (PATCH body: { id, draft_content?, hashtags?, status?, image_prompt? })
 */

import { createClient } from '@supabase/supabase-js';

/* ── keyword sets ── */

const COLONAIQ_KEYWORDS = [
  'blood-based', 'blood based', 'ctdna', 'liquid biopsy',
  'methylation', 'non-invasive screening', 'non invasive screening',
  'cell-free dna', 'cell free dna', 'cfdna',
];

const HASHTAG_BASE = [
  '#ColorectalCancer', '#CRCScreening', '#EarlyDetection',
  '#CancerPrevention', '#PublicHealth', '#ColonAiVE',
];

const COLONAIQ_CONTEXT_BLOCK = `
Advances in blood-based screening technologies are gaining attention globally as additional tools to improve participation in colorectal cancer screening programs.

In Singapore, the ColonAiQ\u00AE blood-based screening test has received regulatory clearance and may contribute to expanding non-invasive screening options alongside established screening pathways.

Learn more:
https://colonaiq-asia.com`;

const COLONOSCOPY_GUARDRAIL =
  'Screening tests help identify individuals who should undergo colonoscopy, which remains the gold standard for diagnosis and prevention.';

/* ── helpers ── */

function shouldIncludeColonAiQ(title: string, summary: string): boolean {
  const text = `${title} ${summary}`.toLowerCase();
  return COLONAIQ_KEYWORDS.some((kw) => text.includes(kw));
}

function generateHashtags(title: string, summary: string): string {
  const tags = [...HASHTAG_BASE];
  const text = `${title} ${summary}`.toLowerCase();
  if (COLONAIQ_KEYWORDS.some((kw) => text.includes(kw))) {
    tags.push('#BloodBasedScreening');
  }
  if (text.includes('liquid biopsy')) tags.push('#LiquidBiopsy');
  if (text.includes('clinical trial')) tags.push('#ClinicalTrials');
  if (text.includes('singapore')) tags.push('#Singapore');
  // deduplicate
  return [...new Set(tags)].join(' ');
}

function generateImagePrompt(title: string): string {
  return `medical illustration of colorectal cancer screening awareness, colon outline icon, early detection theme, professional healthcare style, teal and white palette — inspired by: "${title.slice(0, 80)}"`;
}

function buildDraftContent(article: {
  title: string;
  link: string;
  source: string;
  summary: string | null;
}): string {
  const includeColonAiQ = shouldIncludeColonAiQ(article.title, article.summary || '');

  const lines: string[] = [];

  // Headline
  lines.push(article.title);
  lines.push('');

  // Evidence summary
  if (article.summary) {
    lines.push(article.summary);
    lines.push('');
  }

  // Public health insight
  lines.push(COLONOSCOPY_GUARDRAIL);
  lines.push('');

  // Optional ColonAiQ context
  if (includeColonAiQ) {
    lines.push(COLONAIQ_CONTEXT_BLOCK.trim());
    lines.push('');
  }

  // Source
  lines.push(`Source: ${article.link}`);
  lines.push(`(${article.source})`);
  lines.push('');

  // Hashtags
  lines.push(generateHashtags(article.title, article.summary || ''));

  return lines.join('\n');
}

/* ── handler ── */

export async function handler(event: any) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'server_configuration_error' }),
    };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const action = event.queryStringParameters?.action || 'list';

  /* ── LIST ── */
  if (action === 'list') {
    const status = event.queryStringParameters?.status || '';
    const limit = Math.min(Number(event.queryStringParameters?.limit || 50), 100);

    let query = supabase
      .from('linkedin_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: data || [] }),
    };
  }

  /* ── GENERATE ── */
  if (action === 'generate') {
    const threshold = Number(event.queryStringParameters?.threshold || 20);

    // Fetch recent high-relevance CRC news
    const { data: articles, error: newsErr } = await supabase
      .from('crc_news_feed')
      .select('id,title,link,source,summary,relevance_score,date_published')
      .gte('relevance_score', threshold)
      .order('date_published', { ascending: false, nullsFirst: false })
      .limit(30);

    if (newsErr) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: newsErr.message }),
      };
    }

    if (!articles || articles.length === 0) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generated: 0, message: 'No articles above threshold' }),
      };
    }

    // Fetch existing source_urls to avoid duplicates
    const { data: existing } = await supabase
      .from('linkedin_posts')
      .select('source_url');

    const existingUrls = new Set((existing || []).map((e: any) => e.source_url));

    let generated = 0;
    for (const article of articles) {
      if (existingUrls.has(article.link)) continue;

      const draft = buildDraftContent(article);
      const hashtags = generateHashtags(article.title, article.summary || '');
      const imagePrompt = generateImagePrompt(article.title);
      const includeColonAiQ = shouldIncludeColonAiQ(article.title, article.summary || '');

      const { error: insertErr } = await supabase.from('linkedin_posts').insert({
        source_url: article.link,
        title: article.title,
        draft_content: draft,
        hashtags,
        image_prompt: imagePrompt,
        colonaiq_context: includeColonAiQ,
        status: 'new',
        relevance_score: article.relevance_score,
        source_name: article.source,
      });

      if (!insertErr) generated++;
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, generated, scanned: articles.length }),
    };
  }

  /* ── UPDATE ── */
  if (action === 'update' && event.httpMethod === 'POST') {
    let body: any;
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
    }

    const { id, ...fields } = body;
    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing id' }) };
    }

    // Only allow safe fields
    const allowed: Record<string, any> = {};
    if (fields.draft_content !== undefined) allowed.draft_content = fields.draft_content;
    if (fields.hashtags !== undefined) allowed.hashtags = fields.hashtags;
    if (fields.image_prompt !== undefined) allowed.image_prompt = fields.image_prompt;
    if (fields.status !== undefined) {
      allowed.status = fields.status;
      if (fields.status === 'posted') allowed.posted_at = new Date().toISOString();
    }
    allowed.updated_at = new Date().toISOString();

    const { error } = await supabase.from('linkedin_posts').update(allowed).eq('id', id);
    if (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ok: false, error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true }),
    };
  }

  return {
    statusCode: 400,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ error: `Unknown action: ${action}` }),
  };
}
