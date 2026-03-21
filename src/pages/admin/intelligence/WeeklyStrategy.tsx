import React, { useState, useEffect } from 'react';
import { ArrowLeft, ClipboardList, Briefcase, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { strategyDigest, type WeeklyStrategyDigest } from '@/chief-of-staff/strategy/strategyDigest';
import { cockpitService, type ExecutiveBriefingSummary } from '@/services/cockpitService';

const healthDot = (status: 'green' | 'amber' | 'red') => {
  const cls = status === 'green' ? 'bg-emerald-500' : status === 'amber' ? 'bg-amber-500' : 'bg-red-500';
  return <span className={`inline-block w-2 h-2 rounded-full ${cls}`} />;
};

export default function WeeklyStrategyPage() {
  const navigate = useNavigate();
  const [digest, setDigest] = useState<WeeklyStrategyDigest | null>(null);
  const [briefing, setBriefing] = useState<ExecutiveBriefingSummary | null>(null);
  const [briefingHistory, setBriefingHistory] = useState<ExecutiveBriefingSummary[]>([]);
  const [briefingLoading, setBriefingLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setDigest(strategyDigest.generate());
    setBriefingLoading(true);
    Promise.all([
      cockpitService.fetchLatestBriefing(),
      cockpitService.fetchBriefingHistory(7),
    ])
      .then(([latest, history]) => {
        setBriefing(latest);
        setBriefingHistory(history);
      })
      .catch(() => {})
      .finally(() => setBriefingLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/admin/ceo-cockpit')} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Weekly Strategy</h1>
            <p className="text-sm text-white/60">Strategy digest & executive briefings</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Weekly Strategy Digest */}
        {digest && (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={16} className="text-[#0F766E]" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Weekly Strategy Digest</h2>
              <span className="text-xs text-gray-400 ml-auto">Week of {digest.weekOf}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {digest.sections.map((section) => (
                <div key={section.heading} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {healthDot(section.status)}
                    <h4 className="text-xs font-semibold text-[#0F766E] dark:text-emerald-400 uppercase tracking-wide">
                      {section.heading}
                    </h4>
                  </div>
                  <ul className="space-y-1">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        <span className="text-[#0F766E] dark:text-emerald-400 mr-1">&#8226;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executive Briefing */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase size={16} className="text-[#0F766E]" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">Executive Briefing</h2>
            {briefing?.created_at && (
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(briefing.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            )}
          </div>

          {briefingLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw size={18} className="animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-400">Loading briefing...</span>
            </div>
          ) : !briefing ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Briefcase size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-400">No briefing available yet.</p>
              <p className="text-xs text-gray-400 mt-1">Briefings are generated daily at 07:00 SGT.</p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {(briefing.sections || []).map((section) => (
                  <div key={section.heading} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-xs font-semibold text-[#0F766E] dark:text-emerald-400 uppercase tracking-wide mb-2">
                      {section.heading}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                          <span className="text-[#0F766E] dark:text-emerald-400 mr-1">&#8226;</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {briefingHistory.length > 1 && (
                <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {showHistory ? 'Hide' : 'View'} past briefings ({briefingHistory.length - 1})
                  </button>
                  {showHistory && (
                    <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                      {briefingHistory.slice(1).map((b) => (
                        <div key={b.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/30 rounded px-3 py-2">
                          <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">{b.date}</span>
                          <span className="text-[10px] text-gray-400">{(b.sections || []).length} sections</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
