// @ts-nocheck
/**
 * Generate Post Image — Netlify Function
 *
 * Input (POST):  { prompt: string, post_id?: string }
 * Output:        { image_url: string }
 *
 * Uses OpenAI DALL-E 3 to generate LinkedIn-ready images.
 * Returns a URL to the generated image (OpenAI temporary URL).
 * If post_id is provided, stores the image_url in linkedin_posts.
 */

import { createClient } from '@supabase/supabase-js';

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
  }

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { prompt, post_id } = body;
  if (!prompt || typeof prompt !== 'string') {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing prompt' }) };
  }

  // Sanitize and enhance the prompt for medical/healthcare style
  const safePrompt = `Professional healthcare awareness illustration: ${prompt.slice(0, 300)}. Style: clean medical illustration, teal and white color palette, LinkedIn-friendly, no text overlays, no faces, abstract scientific aesthetic.`;

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: safePrompt,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('OpenAI image generation failed:', err);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Image generation failed', details: err }),
      };
    }

    const data = await res.json();
    const image_url = data?.data?.[0]?.url;

    if (!image_url) {
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No image URL returned' }),
      };
    }

    // If post_id provided, store image_url in linkedin_posts
    if (post_id) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (supabaseUrl && serviceRoleKey) {
        const supabase = createClient(supabaseUrl, serviceRoleKey);
        await supabase
          .from('linkedin_posts')
          .update({ image_url, updated_at: new Date().toISOString() })
          .eq('id', post_id);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, image_url }),
    };
  } catch (e: any) {
    console.error('Image generation error:', e?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal error' }),
    };
  }
}
