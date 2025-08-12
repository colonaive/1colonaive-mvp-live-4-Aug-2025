// src/pages/news/NewsLiveFeedPage.tsx
import React, { useEffect, useState } from "react";
import { getPublicNews, NewsItem } from "../../services/newsFeed";

export default function NewsLiveFeedPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const rows = await getPublicNews(60);
        setItems(rows);
      } catch (e: any) {
        setErr(e?.message || "Failed to load news");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Live CRC News (DB)</h1>
        {loading && <div>Loading…</div>}
        {err && <div className="text-red-600">{err}</div>}
        {!loading && items.length === 0 && <div>No stories yet.</div>}

        <ul className="space-y-4">
          {items.map((n) => (
            <li key={n.id} className="bg-white border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <a
                    href={n.link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="text-lg font-semibold text-blue-700 hover:underline"
                  >
                    {n.title}
                  </a>
                  <div className="text-sm text-gray-500 mt-1">
                    {n.source_name} •{" "}
                    {n.pub_date ? new Date(n.pub_date).toLocaleString() : "—"}
                    {n.relevance_score != null && (
                      <> • Score {n.relevance_score}</>
                    )}
                    {n.is_sticky ? <> • 📌 Sticky</> : null}
                  </div>
                  {n.ai_summary ? (
                    <p className="text-sm text-gray-700 mt-2">{n.ai_summary}</p>
                  ) : n.excerpt ? (
                    <p className="text-sm text-gray-700 mt-2">{n.excerpt}</p>
                  ) : null}
                  {Array.isArray(n.topic_tags) && n.topic_tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {n.topic_tags.map((t) => (
                        <span
                          key={t}
                          className="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {n.thumbnail_url ? (
                  <img
                    src={n.thumbnail_url}
                    alt=""
                    className="w-28 h-20 object-cover rounded border"
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
