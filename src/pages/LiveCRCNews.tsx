// /src/pages/LiveCRCNews.tsx
import React, { useEffect, useMemo, useState } from "react";

type NewsItem = {
  id?: string;
  title: string;
  url: string;
  source?: string;
  source_domain?: string;
  authors?: string[];
  image_url?: string | null;
  category?: string | null;
  published_at?: string | null;
  summary?: string;
  tags?: string[];
  is_sticky?: boolean | null;
  sticky_priority?: number | null;
};

type Accent = {
  ring: string;
  headerBg: string;
  headerText: string;
  borderLeft: string;
  badge: string;
};

const CATEGORY_ALL = "All";
const CATEGORY_ORDER = [
  "Screening",
  "Guidelines",
  "Research",
  "Policy",
  "Uncategorized",
];

const fmtDate = (iso?: string | null) => {
  if (!iso) return "No date";
  const d = new Date(iso);
  if (isNaN(+d)) return "No date";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const categoryLabel = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : "Uncategorized";
};

const categorySort = (left: string, right: string) => {
  const leftIndex = CATEGORY_ORDER.indexOf(left);
  const rightIndex = CATEGORY_ORDER.indexOf(right);

  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }

  return left.localeCompare(right);
};

const domainFromUrl = (url?: string) => {
  if (!url) return "";

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const favicon = (host?: string) => (host ? `https://www.google.com/s2/favicons?domain=${host}&sz=64` : "");

function buildApiUrl(params: { q?: string; limit?: number }) {
  const u = new URL("/.netlify/functions/list_crc_news", window.location.origin);
  if (params.q) u.searchParams.set("q", params.q);
  u.searchParams.set("limit", String(params.limit ?? 120));
  return u.toString();
}

const Chip: React.FC<{ label: string; active?: boolean; onClick?: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition ${
      active ? "bg-emerald-600 text-white shadow-sm" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
    }`}
  >
    {label}
  </button>
);

const accents: Record<string, Accent> = {
  Screening: {
    ring: "ring-emerald-100",
    headerBg: "bg-emerald-50",
    headerText: "text-emerald-900",
    borderLeft: "border-l-emerald-300",
    badge: "bg-emerald-100 text-emerald-800",
  },
  Guidelines: {
    ring: "ring-indigo-100",
    headerBg: "bg-indigo-50",
    headerText: "text-indigo-900",
    borderLeft: "border-l-indigo-300",
    badge: "bg-indigo-100 text-indigo-800",
  },
  Research: {
    ring: "ring-sky-100",
    headerBg: "bg-sky-50",
    headerText: "text-sky-900",
    borderLeft: "border-l-sky-300",
    badge: "bg-sky-100 text-sky-800",
  },
  Policy: {
    ring: "ring-amber-100",
    headerBg: "bg-amber-50",
    headerText: "text-amber-900",
    borderLeft: "border-l-amber-300",
    badge: "bg-amber-100 text-amber-800",
  },
  Uncategorized: {
    ring: "ring-slate-100",
    headerBg: "bg-slate-50",
    headerText: "text-slate-900",
    borderLeft: "border-l-slate-300",
    badge: "bg-slate-100 text-slate-800",
  },
};

const EmptyBox: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-sm text-gray-500 px-4 py-8">No stories yet for {label}.</div>
);

const NewsCard: React.FC<{ item: NewsItem; accent: typeof accents[keyof typeof accents] }> = ({ item, accent }) => {
  const host = item.source_domain || domainFromUrl(item.url);
  return (
    <article
      className={`group relative rounded-xl border border-gray-200 ${accent.borderLeft} border-l-4 bg-white p-4 shadow-sm hover:shadow-md transition`}
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 ring-1 ring-gray-200 flex items-center justify-center">
          {item.image_url ? (
            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
          ) : host ? (
            <img src={favicon(host)} alt="" className="w-8 h-8 opacity-80" />
          ) : (
            <div className="text-xs text-gray-400">no image</div>
          )}
        </div>

        <div className="min-w-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-base font-semibold text-gray-900 leading-snug hover:underline"
          >
            {item.title}
            <span className="ml-1 align-middle text-xs text-gray-400 group-hover:text-gray-500">↗</span>
          </a>

          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
            {host && <span className="truncate">{item.source || host}</span>}
            <span>•</span>
            <time dateTime={item.published_at || undefined}>{fmtDate(item.published_at)}</time>
          </div>

          {item.summary && <p className="mt-2 text-sm text-gray-700 line-clamp-3">{item.summary}</p>}

          <div className="mt-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center text-sm font-medium ${accent.headerText.replace(
                "900",
                "700"
              )} underline-offset-2 hover:underline`}
            >
              Read full article →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

const ColumnBox: React.FC<{
  title: string;
  items: NewsItem[];
}> = ({ title, items }) => {
  const accent = accents[title] || accents.Uncategorized;
  return (
    // Create a local stacking context and keep it below the site header
    <section className="relative z-0 flex flex-col rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm">
      <div className={`px-4 py-3 ${accent.headerBg} ${accent.headerText} text-sm font-semibold tracking-wide`}>
        {title.toUpperCase()}
      </div>
      {/* Contained scroll; never “bleeds” into the page or header */}
      <div
        className={`p-4 space-y-3 max-h-[900px] md:max-h-[700px] lg:max-h-[800px] overflow-y-auto overscroll-contain ${accent.ring}`}
      >
        {items.length === 0 ? (
          <EmptyBox label={title} />
        ) : (
          items.map((it) => <NewsCard key={(it.id ?? it.url) + (it.published_at ?? "")} item={it} accent={accent} />)
        )}
      </div>
    </section>
  );
};

const LiveCRCNews: React.FC = () => {
  const [activeCat, setActiveCat] = useState<string>(CATEGORY_ALL);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<NewsItem[]>([]);

  const load = async (opts?: { q?: string }) => {
    setLoading(true);
    setErr(null);
    try {
      const url = buildApiUrl({
        q: (opts?.q ?? q).trim() || undefined,
        limit: 120,
      });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const j = await res.json();
      setItems(j.items || []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load({ q: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availableCategories = useMemo(() => {
    const labels = new Set<string>();
    for (const item of items) {
      labels.add(categoryLabel(item.category));
    }
    if (activeCat !== CATEGORY_ALL) {
      labels.add(activeCat);
    }
    return Array.from(labels).sort(categorySort);
  }, [activeCat, items]);

  const visibleItems = useMemo(
    () =>
      activeCat === CATEGORY_ALL
        ? items
        : items.filter((item) => categoryLabel(item.category) === activeCat),
    [activeCat, items]
  );

  const grouped = useMemo(() => {
    const groups = new Map<string, NewsItem[]>();
    for (const item of visibleItems) {
      const label = categoryLabel(item.category);
      const bucket = groups.get(label) || [];
      bucket.push(item);
      groups.set(label, bucket);
    }

    const entries = Array.from(groups.entries()).sort((left, right) => categorySort(left[0], right[0]));
    if (!entries.length && activeCat !== CATEGORY_ALL) {
      return [[activeCat, []] as [string, NewsItem[]]];
    }

    return entries;
  }, [activeCat, visibleItems]);

  return (
    // isolate = new stacking context for this page; z-0 keeps it under the header
    <main className="relative z-0 isolate bg-gray-50 pt-24 md:pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Latest in Colorectal Cancer</h1>
          <p className="mt-1 text-gray-600">Only verified stories with direct links to original sources.</p>
        </header>

        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            <Chip
              label={CATEGORY_ALL}
              active={activeCat === CATEGORY_ALL}
              onClick={() => setActiveCat(CATEGORY_ALL)}
            />
            {availableCategories.map((c) => (
              <Chip
                key={c}
                label={c}
                active={activeCat === c}
                onClick={() => setActiveCat(c)}
              />
            ))}
          </div>

          <div className="w-full md:w-96">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") load({ q });
                }}
                placeholder="Explore topics, care, coverage"
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 pr-24 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => load({ q })}
                className="absolute right-1.5 top-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {loading && <div className="mb-4 text-sm text-gray-500">Loading…</div>}
        {err && <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{err}</div>}

        {grouped.length === 0 ? (
          <section className="rounded-2xl border border-gray-200 bg-white px-4 py-8 text-sm text-gray-500 shadow-sm">
            No stories available right now.
          </section>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {grouped.map(([title, groupItems]) => (
              <ColumnBox key={title} title={title} items={groupItems} />
            ))}
          </div>
        )}

        <div className="mt-10 text-xs text-gray-400">
          Tip: click “Search” with an empty box to refresh. Items are ordered by publish date, newest first.
        </div>
      </div>
    </main>
  );
};

export default LiveCRCNews;
