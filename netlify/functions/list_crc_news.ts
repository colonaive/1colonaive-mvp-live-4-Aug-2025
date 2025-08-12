// netlify/functions/list_crc_news.ts
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  try {
    const category = event.queryStringParameters?.category || "All";
    const q = event.queryStringParameters?.q?.trim() || "";
    const limit = Number(event.queryStringParameters?.limit || 40);

    const supabaseUrl = process.env.SUPABASE_URL!;
    const anonKey = process.env.SUPABASE_ANON_KEY!; // read-only

    const url = new URL(`${supabaseUrl}/rest/v1/crc_news`);
    const sel = "id,title,url,source,source_domain,authors,image_url,category,published_at,summary,tags";
    url.searchParams.set("select", sel);
    url.searchParams.set("order", "published_at.desc");
    url.searchParams.set("limit", String(limit));
    if (category !== "All") url.searchParams.set("category", `eq.${category}`);
    if (q) url.searchParams.set("title", `ilike.%${q}%`);

    const res = await fetch(url.toString(), {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ items: data }) };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "error" };
  }
};
