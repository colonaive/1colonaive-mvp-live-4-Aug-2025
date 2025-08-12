// src/services/newsFeed.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
export const sb = createClient(supabaseUrl, supabaseAnonKey);

export type NewsItem = {
  id: string;
  title: string;
  link: string;
  canonical_url: string | null;
  source_name: string | null;
  pub_date: string | null;
  category: string | null;
  kind: "news" | "journal" | null;
  topic_tags: string[] | null;
  relevance_score: number | null;
  ai_summary: string | null;
  excerpt: string | null;
  thumbnail_url: string | null;
  is_sticky: boolean | null;
  sticky_priority: number | null;
};

export async function getPublicNews(limit = 40) {
  const { data, error } = await sb
    .from("news_items")
    .select(`
      id, title, link, canonical_url, source_name, pub_date,
      category, kind, topic_tags, relevance_score, ai_summary,
      excerpt, thumbnail_url, is_sticky, sticky_priority
    `)
    .eq("status", "approved")
    .order("is_sticky", { ascending: false })
    .order("sticky_priority", { ascending: true, nullsFirst: false })
    .order("relevance_score", { ascending: false, nullsFirst: false })
    .order("pub_date", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as NewsItem[];
}
