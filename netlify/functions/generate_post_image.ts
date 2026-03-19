// @ts-nocheck
/**
 * Generate Post Image — Netlify Function
 *
 * Input (POST):  { prompt: string, post_id?: string }
 * Output:        { success: true, image_url: string }
 *
 * Uses OpenAI gpt-image-1 to generate LinkedIn-ready images.
 * Uploads the result to Supabase Storage for a persistent URL.
 * If post_id is provided, stores the image_url in linkedin_posts.
 */

import { createClient } from '@supabase/supabase-js';

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey) {
    console.error('OPENAI_API_KEY not configured');
    return { statusCode: 500, body: JSON.stringify({ error: 'OPENAI_API_KEY not configured' }) };
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Supabase credentials not configured');
    return { statusCode: 500, body: JSON.stringify({ error: 'Supabase credentials not configured' }) };
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

  console.log('Image request received', { post_id, promptLength: prompt.length });

  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: safePrompt,
        n: 1,
        size: '1024x1024',
        quality: 'low',
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('OpenAI image generation failed:', res.status, errText);
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Image generation failed', details: errText }),
      };
    }

    const data = await res.json();
    console.log('OpenAI response received');

    // gpt-image-1 returns b64_json; fall back to url for DALL-E compat
    const b64 = data?.data?.[0]?.b64_json;
    const directUrl = data?.data?.[0]?.url;

    if (!b64 && !directUrl) {
      console.error('No image data in response');
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No image data returned' }),
      };
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    let image_url: string;

    if (b64) {
      // Upload base64 to Supabase Storage for a persistent URL
      const fileName = `linkedin-images/${post_id || Date.now()}-${Date.now()}.png`;
      const buffer = Buffer.from(b64, 'base64');

      // Ensure bucket exists (idempotent)
      await supabase.storage.createBucket('post-images', { public: true }).catch(() => {});

      const { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(fileName, buffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.error('Supabase storage upload failed:', uploadError.message);
        // Fallback: return as data URL if storage upload fails
        image_url = `data:image/png;base64,${b64}`;
      } else {
        const { data: urlData } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);
        image_url = urlData.publicUrl;
        console.log('Image uploaded to Supabase Storage');
      }
    } else {
      image_url = directUrl;
    }

    // Store image_url in linkedin_posts if post_id provided
    if (post_id) {
      const { error: updateError } = await supabase
        .from('linkedin_posts')
        .update({ image_url, updated_at: new Date().toISOString() })
        .eq('id', post_id);
      if (updateError) {
        console.error('Failed to update post image_url:', updateError.message);
      }
    }

    console.log('Image generation complete', { post_id, hasUrl: !!image_url });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, image_url }),
    };
  } catch (e: any) {
    console.error('Image generation error:', e?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: e?.message || 'Internal error' }),
    };
  }
}
