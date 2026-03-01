// @ts-nocheck

import { createClient } from '@supabase/supabase-js';

export async function handler(event: any) {
  try {
    const category = event.queryStringParameters?.category || "All";
    const q = event.queryStringParameters?.q?.trim() || "";
    const limit = Number(event.queryStringParameters?.limit || 40);

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
      console.error("Missing SUPABASE_URL environment variable");
      return { statusCode: 500, body: JSON.stringify({ error: "server_configuration_error" }) };
    }

    if (!serviceRoleKey) {
      console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
      return { statusCode: 500, body: JSON.stringify({ error: "server_configuration_error" }) };
    }

    // Create server-side client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let query = supabase
      .from('crc_news_feed')
      .select('id,title,link,source,summary,date_published,is_sticky,sticky_priority,relevance_score')
      .order('date_published', { ascending: false })
      .limit(limit);

    if (q) {
      query = query.ilike('title', `%${q}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error("News function error:", error?.message);
      return { 
        statusCode: 500, 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "server_error" }) 
      };
    }

    if (category !== "All") {
      console.warn("Ignoring unsupported category filter for crc_news_feed:", category);
    }

    const items = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.link,
      source: item.source,
      summary: item.summary,
      published_at: item.date_published,
      is_sticky: item.is_sticky,
      sticky_priority: item.sticky_priority,
      relevance_score: item.relevance_score,
    }));

    return { 
      statusCode: 200, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }) 
    };
  } catch (e: any) {
    console.error("News function error:", e?.message);
    return { 
      statusCode: 500, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: "server_error" }) 
    };
  }
}
