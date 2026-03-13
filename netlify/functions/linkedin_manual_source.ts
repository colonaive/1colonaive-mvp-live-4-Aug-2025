// @ts-nocheck
/**
 * LinkedIn Manual Source — Netlify Function
 *
 * Accepts a pasted URL or raw text, extracts/summarizes the content,
 * and generates a LinkedIn post draft that is saved to the linkedin_posts table.
 *
 * POST body:
 *   { url?: string, text?: string }
 *
 * Returns:
 *   { ok: true, post: LinkedInPost-shaped row }
 */

import { createClient } from '@supabase/supabase-js';

/* ── lightweight HTML stripper (same logic as fetch_crc_news) ── */

function stripHtmlToText(html: string): string {
  return html
    .replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(nav|header|footer|aside)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/(p|h[1-6]|div|li|br|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

async function fetchArticleContent(url: string): Promise<{ articleText: string | null; title: string | null }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      headers: { 'User-Agent': 'COLONAiVE/NewsFetcher' },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);
    if (!res.ok) return { articleText: null, title: null };

    const html = await res.text();
    const capped = html.slice(0, 100_000);

    // Extract <title>
    let title: string | null = null;
    const ogTitle = capped.match(/<meta\s+(?:[^>]*?)property=["']og:title["']\s+content=["']([^"']+)["']/i)
      || capped.match(/<meta\s+content=["']([^"']+)["']\s+(?:[^>]*?)property=["']og:title["']/i);
    if (ogTitle?.[1]) {
      title = ogTitle[1].trim();
    } else {
      const titleTag = capped.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleTag?.[1]) title = titleTag[1].trim();
    }

    const stripped = stripHtmlToText(capped);
    const articleText = stripped.length > 100 ? stripped.slice(0, 5000) : null;

    return { articleText, title };
  } catch {
    return { articleText: null, title: null };
  }
}

/* ── AI: summarise + generate LinkedIn post ── */

async function generatePost(
  articleText: string,
  sourceTitle: string | null,
  openaiKey: string,
): Promise<{ title: string; post: string; hashtags: string; image_prompt: string }> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You write LinkedIn thought-leadership posts for a healthcare CEO who leads a colorectal cancer screening movement in Singapore.

Tone: Scientific, neutral, thought-provoking, non-promotional.
Length: 150-250 words.
Structure: Hook line → key insight → strategic reflection → call to awareness.

Return a JSON object with these exact keys:
{
  "title": "short headline for the post (max 100 chars)",
  "post": "full LinkedIn post text (150-250 words, no hashtags)",
  "hashtags": "5-7 hashtags separated by spaces",
  "image_prompt": "DALL-E prompt for a medical illustration related to the article topic, teal and white palette, minimalist style"
}

Requirements:
1. Scientific tone
2. Neutral educational message
3. Mention importance of screening
4. Avoid promotional claims
5. Keep post under 1200 characters
6. Never say "summary unavailable"`,
        },
        {
          role: 'user',
          content: `Create a LinkedIn post based on this colorectal cancer article:\n\nTitle: ${sourceTitle || 'Untitled'}\n\nArticle text:\n${articleText.slice(0, 4000)}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status}`);
  }

  const j = await res.json();
  const raw = j.choices?.[0]?.message?.content?.trim();
  if (!raw) throw new Error('Empty OpenAI response');

  const parsed = JSON.parse(raw);
  return {
    title: parsed.title || sourceTitle || 'CRC Screening Update',
    post: parsed.post || '',
    hashtags: parsed.hashtags || '#ColorectalCancer #CRCScreening #EarlyDetection #PublicHealth #ColonAiVE',
    image_prompt: parsed.image_prompt || 'medical illustration of colorectal cancer screening awareness, minimalist medical infographic style, teal and white palette, colon outline, screening awareness theme',
  };
}

/* ── handler ── */

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Supabase not configured' }),
    };
  }

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { url, text } = body;
  if (!url && !text) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Provide either url or text' }),
    };
  }

  try {
    let articleText = '';
    let sourceTitle: string | null = null;
    let sourceUrl = url || '';

    if (url) {
      const extracted = await fetchArticleContent(url);
      articleText = extracted.articleText || '';
      sourceTitle = extracted.title;
      if (!articleText) {
        return {
          statusCode: 422,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Could not extract article content from the provided URL' }),
        };
      }
    } else {
      articleText = text;
      // Try to extract a title from the first line of pasted text
      const firstLine = text.split('\n')[0]?.trim();
      if (firstLine && firstLine.length < 200) {
        sourceTitle = firstLine;
      }
    }

    // Generate LinkedIn post via OpenAI
    const generated = await generatePost(articleText, sourceTitle, openaiKey);

    // Build full draft content (same structure as linkedin_posts generate action)
    const COLONOSCOPY_GUARDRAIL =
      'Screening tests help identify individuals who should undergo colonoscopy, which remains the gold standard for diagnosis and prevention.';

    const draftLines: string[] = [
      generated.title,
      '',
      generated.post,
      '',
      COLONOSCOPY_GUARDRAIL,
    ];
    if (sourceUrl) {
      draftLines.push('', `Source: ${sourceUrl}`);
    }
    draftLines.push('', generated.hashtags);

    const draftContent = draftLines.join('\n');

    // Save to linkedin_posts table
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const row = {
      source_url: sourceUrl || `manual:${Date.now()}`,
      title: generated.title,
      draft_content: draftContent,
      hashtags: generated.hashtags,
      image_prompt: generated.image_prompt,
      colonaiq_context: false,
      status: 'new',
      relevance_score: null,
      source_name: sourceUrl ? new URL(sourceUrl).hostname.replace(/^www\./, '') : 'Manual Input',
    };

    const { data, error } = await supabase
      .from('linkedin_posts')
      .insert(row)
      .select()
      .single();

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
      body: JSON.stringify({ ok: true, post: data }),
    };
  } catch (e: any) {
    console.error('Manual source error:', e?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false, error: e?.message || 'Internal error' }),
    };
  }
}
