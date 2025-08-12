// src/pages/LiveCRCNews.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ShieldCheck, Search } from "lucide-react";

const CATS = ["All", "Clinical Research", "Screening & Policy", "Awareness & Campaigns"] as const;
type Cat = typeof CATS[number];

type Item = {
  id: string;
  title: string;
  url: string;
  source: string;
  source_domain: string;
  authors: string[] | null;
  image_url?: string | null;
  category: Cat | string;
  published_at: string;
  summary?: string | null;
  tags?: string[] | null;
};

const Pill: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-sm border transition ${
      active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
    }`}
  >
    {label}
  </button>
);

const Card: React.FC<{ item: Item }> = ({ item }) => {
  const d = new Date(item.published_at);
  const date = d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="h-14 w-14 rounded-xl bg-gray-50 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
        <div className="min-w-0">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug">
            {item.title}
          </h3>
          <div className="mt-1 text-xs text-gray-500">
            <span className="font-medium">{item.source}</span>
            <span className="mx-1.5">•</span>
            <time>{date}</time>
            <span className="mx-1.5">•</span>
            <span className="rounded bg-gray-100 px-2 py-0.5">{item.category}</span>
          </div>

          {item.summary && (
            <p className="mt-3 text-sm text-gray-700">
              {item.summary}
            </p>
          )}

          <div className="mt-3 flex items-center gap-3">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-sm font-medium"
              aria-label="Read original article"
            >
              Read original <ExternalLink className="h-4 w-4" />
            </a>
            <span className="text-xs text-gray-500">Verified source: {item.source_domain}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const Column: React.FC<{ title: string; items: Item[] }> = ({ title, items }) => (
  <section className="flex-1 min-w-[320px]">
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
    <div className="flex flex-col gap-4 h-[70vh] overflow-y-auto pr-1">
      {items.map(i => <Card key={i.id} item={i} />)}
      {!items.length && <div className="text-sm text-gray-500">No stories yet.</div>}
    </div>
  </section>
);

const LiveCRCNews: React.FC = () => {
  const [cat, setCat] = useState<Cat>("All");
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const qs = new URLSearchParams();
    if (cat) qs.set("category", cat);
    if (q.trim()) qs.set("q", q.trim());
    qs.set("limit", "80");
    const res = await fetch(`/.netlify/functions/list_crc_news?${qs.toString()}`);
    const json = await res.json();
    setItems(json.items || []);
    setLoading(false);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [cat]);
  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    if (!text) return items;
    return items.filter(i => i.title.toLowerCase().includes(text) || (i.summary || "").toLowerCase().includes(text));
  }, [items, q]);

  const clinical = filtered.filter(i => i.category === "Clinical Research");
  const policy   = filtered.filter(i => i.category === "Screening & Policy");
  const aware    = filtered.filter(i => i.category === "Awareness & Campaigns");

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Latest in Colorectal Cancer</h1>
          <p className="mt-1 text-sm text-gray-600">Only verified stories with direct links to original sources.</p>
        </header>

        <div className="flex items-center gap-2 flex-wrap mb-4">
          {CATS.map(c => <Pill key={c} label={c} active={cat===c} onClick={() => setCat(c)} />)}
          <div className="ml-auto relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") load(); }}
              placeholder="Explore topics, care, coverage"
              className="pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm w-72 outline-none focus:border-gray-300"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading verified CRC stories…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Column title="Clinical Research" items={cat==="All" ? clinical : filtered} />
            <div className="flex flex-col gap-6">
              <Column title="Screening & Policy" items={cat==="All" ? policy : filtered} />
              <Column title="Awareness & Campaigns" items={cat==="All" ? aware : filtered} />
            </div>
          </div>
        )}

        <div className="mt-10 text-xs text-gray-500">
          Tip: Click “Read original” to open the journal or guideline page in a new tab. We never rewrite headlines and we only summarize to help you triage what to read.
        </div>

        <div className="mt-8">
          <Link to="/" className="text-sm text-emerald-700 hover:text-emerald-800">← Back to Home</Link>
        </div>
      </div>
    </main>
  );
};

export default LiveCRCNews;
