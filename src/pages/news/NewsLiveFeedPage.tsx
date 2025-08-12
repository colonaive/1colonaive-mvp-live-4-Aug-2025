// src/pages/news/NewsLiveFeedPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Container } from "../../components/ui/Container";
import { Button } from "../../components/ui/Button";
import {
  Newspaper, Microscope, Calendar, ExternalLink,
  Pin, RefreshCw, Search, Eye, BookOpen, TrendingUp, Archive, AlertCircle
} from "lucide-react";
import { getPublicNews, NewsItem } from "../../services/newsFeed";

type Kind = "clinical" | "news";

function isClinicalSource(name: string = "") {
  return /NEJM|New England|JAMA|Lancet|Nature|BMJ|Gastroenterolog|Gut\b|Oncology|Annals|ASCO|ESMO|NCCN|Kaiser/i.test(
    name
  );
}

function inferKind(n: NewsItem): Kind {
  if ((n as any).kind === "journal") return "clinical";
  if ((n as any).kind === "news") return "news";
  if ((n.category || "").toLowerCase() === "clinical") return "clinical";
  return isClinicalSource(n.source_name || "") ? "clinical" : "news";
}

function withinDays(dateIso?: string | null, days = 30) {
  if (!dateIso) return false;
  const d = new Date(dateIso).getTime();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return d >= cutoff;
}

function rankKey(n: NewsItem) {
  const sticky = n.is_sticky ? 1 : 0;
  const score = n.relevance_score ?? -1;
  const pub = n.pub_date ? new Date(n.pub_date).getTime() : 0;
  return [sticky, score, pub];
}

function cmpDesc(a: number[], b: number[]) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? 0;
    const bv = b[i] ?? 0;
    if (av !== bv) return bv - av;
  }
  return 0;
}

export default function NewsLiveFeedPage() {
  const [rows, setRows] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [limit, setLimit] = useState(80);
  const lastUpdated = useMemo(() => new Date(), []);

  async function load(force = false) {
    try {
      setErr(null);
      force ? setRefreshing(true) : setLoading(true);
      const data = await getPublicNews(limit);
      setRows(data);
    } catch (e: any) {
      setErr(e?.message || "Failed to load news.");
    } finally {
      force ? setRefreshing(false) : setLoading(false);
    }
  }

  useEffect(() => { load(false); /* on mount */ }, [limit]);

  const { clinical, news } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = rows.filter(n => {
      if (!q) return true;
      const hay =
        (n.title || "") + " " +
        (n.excerpt || "") + " " +
        (n.ai_summary || "") + " " +
        (n.source_name || "");
      return hay.toLowerCase().includes(q);
    });

    const clinical = filtered
      .filter(n => inferKind(n) === "clinical" && withinDays(n.pub_date, 183)) // ~6 months
      .sort((a, b) => cmpDesc(rankKey(a), rankKey(b)));

    const news = filtered
      .filter(n => inferKind(n) === "news" && withinDays(n.pub_date, 30))
      .sort((a, b) => cmpDesc(rankKey(a), rankKey(b)));

    return { clinical, news };
  }, [rows, search]);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="relative mr-4">
                <Newspaper className="h-12 w-12 text-white" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">📰 Live CRC Intelligence Hub</h1>
                <div className="flex items-center justify-center text-blue-200 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Real-Time Clinical & News Intelligence</span>
                </div>
              </div>
            </div>

            <p className="text-xl text-blue-100 mb-6 max-w-4xl mx-auto">
              Verified CRC research and medical news from trusted sources. Ranked by clinical impact and educational value.
            </p>

            <div className="flex justify-center items-center space-x-8 text-sm text-blue-200 mb-8">
              <div className="flex items-center">
                <Microscope className="h-4 w-4 mr-1" />
                {clinical.length} Clinical Papers
              </div>
              <div className="flex items-center">
                <Newspaper className="h-4 w-4 mr-1" />
                {news.length} News Articles
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Updated {lastUpdated.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300" />
                <input
                  type="text"
                  placeholder="Search papers and news…"
                  className="pl-10 pr-4 py-3 w-80 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                onClick={() => load(true)}
                disabled={refreshing}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Updating…" : "Refresh"}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Error banner */}
      {err && (
        <div className="py-4 bg-yellow-50 border-b">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-700">{err}</p>
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* Dual columns */}
      <section className="py-12">
        <Container>
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clinical */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Microscope className="h-6 w-6 text-green-600" />
                    🧬 Clinical Papers & Studies
                    <span className="text-sm font-normal text-gray-500 bg-green-100 px-3 py-1 rounded-full">
                      Last 6 months
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {loading ? "Loading clinical research…" : `${clinical.length} papers • Ranked by clinical impact`}
                  </p>
                </div>

                <div className="max-h-screen overflow-y-auto">
                  <div className="p-4 space-y-4">
                    {loading ? (
                      <SkeletonList />
                    ) : clinical.length ? (
                      clinical.map((n) => <ItemCard key={n.id} n={n} kind="clinical" />)
                    ) : (
                      <Empty type="Clinical Papers" icon={Microscope} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* News */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Newspaper className="h-6 w-6 text-blue-600" />
                    📰 Latest News & Updates
                    <span className="text-sm font-normal text-gray-500 bg-blue-100 px-3 py-1 rounded-full">
                      Last 30 days
                    </span>
                  </h2>
                  <p className="text-sm text-gray-600 mt-2">
                    {loading ? "Loading news…" : `${news.length} articles • Educational & policy updates`}
                  </p>
                </div>

                <div className="max-h-screen overflow-y-auto">
                  <div className="p-4 space-y-4">
                    {loading ? (
                      <SkeletonList />
                    ) : news.length ? (
                      news.map((n) => <ItemCard key={n.id} n={n} kind="news" />)
                    ) : (
                      <Empty type="News Articles" icon={Newspaper} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Load more */}
          <div className="flex justify-center mt-8">
            <Button onClick={() => setLimit((v) => v + 40)} variant="secondary">
              Load more
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer band */}
      <footer className="py-8 bg-gray-100 border-t">
        <Container>
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center items-center space-x-6 mb-4">
              <div className="flex items-center text-green-600">
                <Archive className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Auto-Archive System</span>
              </div>
              <div className="flex items-center text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Real-Time Rankings</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Trusted Sources:</strong> PubMed, NEJM, JAMA, Nature Medicine, Kaiser Permanente Research, FDA, Reuters Health
            </p>
            <p className="text-xs text-gray-500">
              Clinical papers archived after 6 months • News articles after 30 days • Ranked by clinical relevance.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function ItemCard({ n, kind }: { n: NewsItem; kind: Kind }) {
  const date = n.pub_date ? new Date(n.pub_date).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  }) : "—";
  const badge =
    kind === "clinical"
      ? "border-l-4 border-l-green-500"
      : "border-l-4 border-l-blue-500";

  return (
    <div className={`bg-white border rounded-lg p-5 hover:shadow-lg transition-all duration-300 ${badge} ${n.is_sticky ? "bg-red-50/20" : ""}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {n.is_sticky && (
            <div className="flex items-center mb-2">
              <Pin className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-xs font-semibold text-red-600 uppercase">
                {kind === "clinical" ? "High Priority" : "Breaking News"}
              </span>
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
            {n.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm mb-3 text-gray-600">
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
              {n.source_name}
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {date}
            </span>
            {typeof n.relevance_score === "number" && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                {kind === "clinical" ? "Impact" : "Relevance"}: {n.relevance_score}/10
              </span>
            )}
          </div>

          {(n.ai_summary || n.excerpt) && (
            <div className={`${kind === "clinical" ? "bg-green-50 border-l-4 border-green-200" : "bg-blue-50 border-l-4 border-blue-200"} p-3 rounded-r-lg mb-4`}>
              <p className="text-gray-700 text-sm leading-relaxed">
                {n.ai_summary || n.excerpt}
              </p>
            </div>
          )}

          {Array.isArray(n.topic_tags) && n.topic_tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {n.topic_tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {n.thumbnail_url ? (
          <img src={n.thumbnail_url} alt="" className="w-28 h-20 object-cover rounded border" />
        ) : (
          <div className="w-28 h-20 rounded border bg-gray-50" />
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-gray-500 text-xs">
          {kind === "clinical" ? <BookOpen className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
          {kind === "clinical" ? "Clinical Research" : "Medical News Update"}
        </div>
        <a
          href={n.link || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-medium rounded-lg ${kind === "clinical" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {kind === "clinical" ? "Read Study" : "Read Article"}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
      ))}
    </>
  );
}

function Empty({ type, icon: Icon }: { type: string; icon: any }) {
  return (
    <div className="text-center border rounded-lg py-10">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No {type} Found</h3>
      <p className="text-gray-600 text-sm mb-4">
        New {type.toLowerCase()} will appear here as sources update.
      </p>
    </div>
  );
}
