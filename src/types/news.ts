// src/types/news.ts
export type NewsCategory = 'clinical' | 'policy' | 'awareness';
export type NewsStatus = 'pending' | 'approved' | 'rejected' | 'hidden';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source_name: string;
  pub_date: string; // ISO string
  category: NewsCategory;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: NewsStatus;
  created_at: string;
  updated_at: string;
}

export interface NewsSource {
  id: string;
  name: string;
  rss_url: string;
  homepage_url: string | null;
  default_category: NewsCategory;
  enabled: boolean;
  created_at: string;
}
