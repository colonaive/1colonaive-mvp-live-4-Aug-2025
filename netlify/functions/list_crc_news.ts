// @ts-nocheck

export async function handler(event: any) {
  try {
    const category = event.queryStringParameters?.category || "All";
    const q = event.queryStringParameters?.q?.trim() || "";
    const limit = Number(event.queryStringParameters?.limit || 40);

    const supabaseUrl = process.env.SUPABASE_URL!;
    const anonKey = process.env.SUPABASE_ANON_KEY!; // read‑only key

    const url = new URL(`${supabaseUrl}/rest/v1/crc_news`);
    const select =
      "id,title,url,source,source_domain,authors,image_url,category,published_at,summary,tags";
    url.searchParams.set("select", select);
    url.searchParams.set("order", "published_at.desc");
    url.searchParams.set("limit", String(limit));
    if (category !== "All") url.searchParams.set("category", `eq.${category}`);
    if (q) url.searchParams.set("title", `ilike.%${q}%`);

    const res = await fetch(url.toString(), {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });

    if (!res.ok) {
      return { statusCode: res.status, body: await res.text() };
    }

    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify({ items: data }) };
  } catch (e: any) {
    return { statusCode: 500, body: e?.message || "error" };
  }
}
