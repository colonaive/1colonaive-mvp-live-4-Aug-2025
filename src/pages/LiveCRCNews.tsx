// src/pages/LiveCRCNews.tsx
import React, { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";

type Item = {
  id: string;
  title: string;
  url: string;
  source: string;
  source_domain: string | null;
  authors: string[] | null;
  image_url: string | null;
  category: "Clinical Research" | "Screening & Policy" | "Awareness & Campaigns" | null;
  published_at: string; // ISO
  summary: string | null;
  tags: string[] | null;
};

const CATS = ["All", "Clinical Research", "Screening & Policy", "Awareness & Campaigns"] as const;
type Cat = (typeof CATS)[number];

function formatDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function classNames(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

function NewsCard({ item }: { item: Item }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="w-24 h-24 shrink-0 rounded-lg bg-slate-100 overflow-hidden">
          {item.image_url ? (
            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
              no image
            </div>
          )}
        </div>
        <div className="min-w-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-slate-900 font-semibold leading-snug group-hover:text-emerald-700"
            title={item.title}
          >
            {item.title}
            <ExternalLink className="inline ml-1 h-4 w-4 align-text-top opacity-60 group-hover:opacity-100" />
          </a>
          <div className="mt-1 text-xs text-slate-500">
            {item.source || item.source_domain}
            {item.published_at ? ` • ${formatDate(item.published_at)}` : ""}
          </div>
          {item.summary && (
            <p className="mt-2 text-sm text-slate-700 line-clamp-4">{item.summary}</p>
          )}
          <div className="mt-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
            >
              Read full article →
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LiveCRCNews() {
  const [active, setActive] = useState<Cat>("All");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const params = new URLSearchParams();
        params.set("category", active);
        params.set("limit", "80");
        if (q.trim()) params.set("q", q.trim());
        const res = await fetch(`/.netlify/functions/list_crc_news?${params.toString()}`);
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${res.status}: ${txt}`);
        }
        const data = await res.json();
        if (!cancelled) setItems(data.items || []);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load news");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
    // re-run when active or q changes
  }, [active, q]);

  const groups = useMemo(() => {
    const fil = items; // already filtered server‑side by category & title
    const research = fil.filter(i => i.category === "Clinical Research");
    const policy = fil.filter(i => i.category === "Screening & Policy");
    const awareness = fil.filter(i => i.category === "Awareness & Campaigns");
    return { research, policy, awareness };
  }, [items]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Title */}
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Latest in Colorectal Cancer
        </h1>
        <p className="mt-1 text-slate-600 text-sm">
          Only verified stories with direct links to original sources.
        </p>
      </header>

      {/* Tabs + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={classNames(
                "px-3 py-1.5 rounded-full text-sm border",
                active === cat
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Explore topics, care, coverage"
            className="w-full rounded-full border border-slate-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Errors / loading */}
      {err && (
        <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
          {err}
        </div>
      )}
      {loading && (
        <div className="text-slate-500 text-sm mb-6">Loading the latest verified stories…</div>
      )}

      {/* Two-column main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-600">
            CLINICAL RESEARCH
          </h2>
          <div className="grid gap-4">
            {groups.research.length === 0 && !loading && (
              <div className="text-sm text-slate-500">No stories yet.</div>
            )}
            {groups.research.map((it) => (
              <NewsCard key={it.id} item={it} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-600">
            SCREENING &amp; POLICY
          </h2>
          <div className="grid gap-4">
            {groups.policy.length === 0 && !loading && (
              <div className="text-sm text-slate-500">No stories yet.</div>
            )}
            {groups.policy.map((it) => (
              <NewsCard key={it.id} item={it} />
            ))}
          </div>
        </section>
      </div>

      {/* Awareness below, full width */}
      <section className="mt-10">
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-600">
          AWARENESS &amp; CAMPAIGNS
        </h2>
        <div className="grid gap-4">
          {groups.awareness.length === 0 && !loading && (
            <div className="text-sm text-slate-500">No stories yet.</div>
          )}
          {groups.awareness.map((it) => (
            <NewsCard key={it.id} item={it} />
          ))}
        </div>
      </section>
    </div>
  );
}
