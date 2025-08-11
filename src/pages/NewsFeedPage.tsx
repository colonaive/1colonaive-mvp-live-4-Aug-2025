// src/pages/NewsFeedPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import NewsCard from "../components/news/NewsCard";
import { NewsCategory, NewsItem } from "../types/news";
import { Container } from "../components/ui/Container"; // you already have this
import { Button } from "../components/ui/Button"; // you already have this

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const TABS: { key: NewsCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "clinical", label: "Clinical Research" },
  { key: "policy", label: "Screening & Policy" },
  { key: "awareness", label: "Awareness & Campaigns" },
];

const PAGE_SIZE = 12;

const NewsFeedPage: React.FC = () => {
  const [tab, setTab] = useState<"all" | NewsCategory>("all");
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const categoryFilter = useMemo(() => (tab === "all" ? undefined : tab), [tab]);

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
  }, [categoryFilter]);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      let query = supabase
        .from("news_items")
        .select("*")
        .eq("status", "approved")
        .order("pub_date", { ascending: false })
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

      if (categoryFilter) query = query.eq("category", categoryFilter);

      const { data, error } = await query;
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      if (!data || data.length < PAGE_SIZE) setHasMore(false);
      setItems((prev) => [...prev, ...data as NewsItem[]]);
      setLoading(false);
    };
    fetchPage();
  }, [page, categoryFilter]);

  return (
    <section className="py-12">
      <Container>
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Latest in Colorectal Cancer</h1>
          <p className="text-gray-600 mt-1">
            Only verified stories with direct links to original sources.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as any)}
              className={`rounded-full px-4 py-2 text-sm border ${
                tab === t.key ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {items.map((it) => (
            <NewsCard key={it.id} item={it} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {hasMore ? (
            <Button onClick={() => setPage((p) => p + 1)} disabled={loading}>
              {loading ? "Loading..." : "Load more"}
            </Button>
          ) : (
            <div className="text-sm text-gray-500">No more stories</div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default NewsFeedPage;
