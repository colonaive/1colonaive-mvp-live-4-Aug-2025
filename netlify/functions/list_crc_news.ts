// @ts-nocheck

import { createClient } from '@supabase/supabase-js';

function normalizePublishedAt(value: string | null) {
  if (!value) return null;

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

export async function handler(event: any) {
  try {
    const category = event.queryStringParameters?.category?.trim() || "All";
    const q = event.queryStringParameters?.q?.trim() || "";
    const searchTerm = q.replace(/,/g, " ");
    const rawLimit = Number(event.queryStringParameters?.limit || 40);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 120) : 40;

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

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    let query = supabase
      .from('crc_news_feed')
      .select('id,title,link,source,summary,category,date_published,created_at,is_sticky,sticky_priority,relevance_score')
      .order('date_published', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false, nullsFirst: false })
      .limit(limit);

    if (searchTerm) {
      const pattern = `%${searchTerm}%`;
      query = query.or(`title.ilike.${pattern},summary.ilike.${pattern},source.ilike.${pattern}`);
    }

    if (category !== "All") {
      query = query.eq('category', category);
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

    const items = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      url: item.link,
      source: item.source,
      summary: item.summary,
      category: item.category ?? null,
      published_at: normalizePublishedAt(item.date_published ?? null),
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
