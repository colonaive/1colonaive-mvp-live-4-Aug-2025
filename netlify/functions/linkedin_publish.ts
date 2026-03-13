// @ts-nocheck
/**
 * LinkedIn Publish — Netlify Function
 *
 * Publishes a post to LinkedIn via UGC API.
 *
 * Input (POST):
 * {
 *   post_id: string,         // linkedin_posts table ID
 *   text: string,            // full post text including hashtags
 *   article_url?: string,    // source article URL for link attachment
 *   image_url?: string       // optional image URL
 * }
 *
 * Required env vars:
 *   LINKEDIN_ACCESS_TOKEN    — OAuth 2.0 access token with w_member_social scope
 *   LINKEDIN_PERSON_URN      — e.g. "urn:li:person:XXXXX"
 *
 * Returns: { success: true, linkedin_post_url: string }
 */

import { createClient } from '@supabase/supabase-js';

export async function handler(event: any) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;

  if (!accessToken || !personUrn) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'LinkedIn credentials not configured',
        detail: 'Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN in Netlify environment variables.',
      }),
    };
  }

  let body: any;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  const { post_id, text, article_url, image_url } = body;
  if (!text || !post_id) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: post_id, text' }) };
  }

  // Build UGC post payload
  const ugcPayload: any = {
    author: personUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text,
        },
        shareMediaCategory: article_url ? 'ARTICLE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  // If we have an article URL, attach it as a link
  if (article_url) {
    ugcPayload.specificContent['com.linkedin.ugc.ShareContent'].media = [
      {
        status: 'READY',
        originalUrl: article_url,
        ...(image_url ? { thumbnails: [{ url: image_url }] } : {}),
      },
    ];
  }

  try {
    const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(ugcPayload),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('LinkedIn API error:', res.status, errBody);
      return {
        statusCode: res.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: false, error: 'LinkedIn API rejected the post', details: errBody }),
      };
    }

    // LinkedIn returns the post URN in the 'id' header or body
    const responseData = await res.json().catch(() => ({}));
    const postUrn = res.headers.get('x-restli-id') || responseData.id || '';
    const linkedinPostUrl = postUrn
      ? `https://www.linkedin.com/feed/update/${postUrn}`
      : 'https://www.linkedin.com/feed/';

    // Update the database record
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceRoleKey && post_id) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);
      await supabase
        .from('linkedin_posts')
        .update({
          status: 'posted',
          posted_at: new Date().toISOString(),
          linkedin_url: linkedinPostUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', post_id);
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, linkedin_post_url: linkedinPostUrl }),
    };
  } catch (e: any) {
    console.error('LinkedIn publish error:', e?.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: 'Internal error' }),
    };
  }
}
