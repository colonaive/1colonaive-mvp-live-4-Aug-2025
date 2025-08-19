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

    // Use Supabase client instead of direct fetch
    let query = supabase
      .from('crc_news')
      .select('id,title,url,source,source_domain,authors,image_url,category,published_at,summary,tags')
      .order('published_at', { ascending: false })
      .limit(limit);

    if (category !== "All") {
      query = query.eq('category', category);
    }

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

    return { 
      statusCode: 200, 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: data || [] }) 
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
