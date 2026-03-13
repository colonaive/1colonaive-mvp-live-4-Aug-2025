import React, { useState, useEffect } from 'react';
import {
  Radar,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  FlaskConical,
  Globe,
  Newspaper,
  TrendingUp,
  Zap,
} from 'lucide-react';
import CockpitCard from '@/components/cockpit/CockpitCard';
import CockpitSection from '@/components/cockpit/CockpitSection';
import { radarService, type RadarSignal, type RadarTrial, type RadarPolicy, type RadarMediaMention } from '@/services/radarService';
import { classifySignal, getSignalColor, getSignalLabel } from '@/radar/scoring/radarScore';

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' });
};

const RadarScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const level = classifySignal(score);
  const colorClass = getSignalColor(level);
  const label = getSignalLabel(level);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
      {score} — {label}
    </span>
  );
};

const RadarSignalCard: React.FC<{ signal: RadarSignal }> = ({ signal }) => (
  <div className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <a
          href={signal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 flex items-center gap-1"
        >
          {signal.headline || signal.title}
          <ExternalLink size={10} className="shrink-0 opacity-50" />
        </a>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{signal.journal || signal.source}</span>
          {signal.authors && (
            <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{signal.authors}</span>
          )}
          {signal.publication_date && (
            <span className="text-[10px] text-gray-400">{formatDate(signal.publication_date)}</span>
          )}
        </div>
        {signal.key_finding && (
          <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1.5 line-clamp-2">{signal.key_finding}</p>
        )}
        {signal.strategic_relevance && (
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 italic line-clamp-1">{signal.strategic_relevance}</p>
        )}
        {signal.topic_tags && signal.topic_tags.length > 0 && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {signal.topic_tags.map((tag) => (
              <span key={tag} className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[9px] px-1.5 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <RadarScoreBadge score={signal.radar_score} />
    </div>
  </div>
);

const CRCRadar: React.FC = () => {
  const [signals7d, setSignals7d] = useState<RadarSignal[]>([]);
  const [signals30d, setSignals30d] = useState<RadarSignal[]>([]);
  const [trials, setTrials] = useState<RadarTrial[]>([]);
  const [policies, setPolicies] = useState<RadarPolicy[]>([]);
  const [media, setMedia] = useState<RadarMediaMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'7d' | '30d'>('7d');

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s7, s30, t, p, m] = await Promise.all([
        radarService.fetchTopSignals(7, 20),
        radarService.fetchTopSignals(30, 30),
        radarService.fetchTrials(15),
        radarService.fetchPolicies(10),
        radarService.fetchMediaMentions(15),
      ]);
      setSignals7d(s7);
      setSignals30d(s30);
      setTrials(t);
      setPolicies(p);
      setMedia(m);
    } catch (err) {
      console.error('Radar load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const result = await radarService.triggerRadarScan();
      setScanResult(result.ok ? `Scan complete: ${JSON.stringify(result.stats)}` : 'Scan failed');
      if (result.ok) loadAll();
    } catch {
      setScanResult('Scan failed');
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const today = new Date().toLocaleDateString('en-SG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const activeSignals = activeTab === '7d' ? signals7d : signals30d;
  const strategicCount = activeSignals.filter((s) => s.radar_score >= 12).length;
  const highCount = activeSignals.filter((s) => s.radar_score >= 8 && s.radar_score < 12).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Radar size={28} className="text-white/80" />
              <h1 className="text-2xl font-bold text-white">CRC Research Radar</h1>
            </div>
            <p className="text-sm text-white/70 mt-1">{today}</p>
          </div>
          <button
            onClick={triggerScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={scanning ? 'animate-spin' : ''} />
            {scanning ? 'Scanning...' : 'Run Radar Scan'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {scanResult && (
          <div className="mb-4 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs">
            {scanResult}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{strategicCount}</p>
            <p className="text-[11px] text-gray-500">Strategic Signals</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{highCount}</p>
            <p className="text-[11px] text-gray-500">High Relevance</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{trials.length}</p>
            <p className="text-[11px] text-gray-500">Active Trials</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{media.length}</p>
            <p className="text-[11px] text-gray-500">Media Mentions</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw size={24} className="animate-spin text-gray-400" />
            <span className="ml-3 text-gray-400">Loading radar data...</span>
          </div>
        ) : (
          <>
            {/* Research Signals */}
            <CockpitSection columns={1}>
              <CockpitCard
                title="Research Signals"
                subtitle="Top-scored CRC research intelligence"
                icon={<TrendingUp size={18} />}
                status="active"
              >
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('7d')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTab === '7d'
                        ? 'bg-[#0A385A] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Last 7 Days
                  </button>
                  <button
                    onClick={() => setActiveTab('30d')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      activeTab === '30d'
                        ? 'bg-[#0A385A] text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    Last 30 Days
                  </button>
                </div>

                {activeSignals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Radar size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-400 text-xs">No signals detected in this period.</p>
                    <p className="text-gray-400 text-[11px] mt-1">Run a radar scan to collect fresh intelligence.</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {activeSignals.map((signal) => (
                      <RadarSignalCard key={signal.id} signal={signal} />
                    ))}
                  </div>
                )}
              </CockpitCard>
            </CockpitSection>

            {/* Row 2: Trials + Policies */}
            <CockpitSection columns={2}>
              {/* Clinical Trials */}
              <CockpitCard
                title="Clinical Trials"
                subtitle="Active CRC screening trials worldwide"
                icon={<FlaskConical size={18} />}
                status={trials.length > 0 ? 'active' : 'placeholder'}
              >
                {trials.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-4">No trials data yet.</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {trials.map((t) => (
                      <div key={t.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <a
                          href={t.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                        >
                          {t.title}
                        </a>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
                            {t.trial_id}
                          </span>
                          {t.phase && (
                            <span className="text-[10px] text-gray-500">{t.phase}</span>
                          )}
                          {t.status && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                              {t.status}
                            </span>
                          )}
                          {t.country && (
                            <span className="text-[10px] text-gray-400">{t.country}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CockpitCard>

              {/* Policy Updates */}
              <CockpitCard
                title="Policy Updates"
                subtitle="Regulatory & policy developments"
                icon={<Globe size={18} />}
                status={policies.length > 0 ? 'active' : 'placeholder'}
              >
                {policies.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <AlertCircle size={24} className="text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-gray-400 text-xs">No policy updates detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {policies.map((p) => (
                      <div key={p.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium">
                            {p.country}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{p.policy_title}</p>
                        {p.description && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                        )}
                        {p.source_link && (
                          <a href={p.source_link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block">
                            Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CockpitCard>
            </CockpitSection>

            {/* Media Mentions */}
            <CockpitSection columns={1}>
              <CockpitCard
                title="Media Mentions"
                subtitle="CRC coverage in news media"
                icon={<Newspaper size={18} />}
                status={media.length > 0 ? 'active' : 'placeholder'}
              >
                {media.length === 0 ? (
                  <p className="text-gray-400 text-xs text-center py-4">No media mentions yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                    {media.map((m) => (
                      <div key={m.id} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                        <a
                          href={m.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-2"
                        >
                          {m.title}
                        </a>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-blue-600 dark:text-blue-400">{m.publication || 'News'}</span>
                          <span className="text-[10px] text-gray-400">{formatDate(m.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CockpitCard>
            </CockpitSection>
          </>
        )}
      </div>
    </div>
  );
};

export default CRCRadar;
