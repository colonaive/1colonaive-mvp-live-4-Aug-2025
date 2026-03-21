import React, { useState, useEffect } from 'react';
import {
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Target,
  AlertTriangle,
  BarChart3,
  Activity,
  Inbox,
  Shield,
  Brain,
  Linkedin,
  Radar,
  UserCircle,
  Globe,
  X,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTodayFocus, dismissNudge, type TodayFocus } from '@/lib/proactiveEngine';
import { generateFounderBriefing, type FounderBriefing } from '@/lib/founderBriefing';
import { taskEngine } from '@/chief-of-staff/tasks/taskEngine';
import { operationsEngine } from '@/chief-of-staff/operations/operationsEngine';
import { investorGenerator } from '@/chief-of-staff/investors/investorGenerator';

const today = new Date().toLocaleDateString('en-SG', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const CEOCockpit: React.FC = () => {
  const navigate = useNavigate();

  // Section 1: Today's events
  const [todayFocus, setTodayFocus] = useState<TodayFocus | null>(null);
  const [todayLoading, setTodayLoading] = useState(true);

  // Section 2: Priority snapshot (collapsible)
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [founderBriefing, setFounderBriefing] = useState<FounderBriefing | null>(null);
  const [founderLoading, setFounderLoading] = useState(true);

  // Section 3: KPI snapshot (collapsible)
  const [kpiOpen, setKpiOpen] = useState(false);

  useEffect(() => {
    setTodayLoading(true);
    getTodayFocus()
      .then((f) => setTodayFocus(f))
      .catch(() => {})
      .finally(() => setTodayLoading(false));

    setFounderLoading(true);
    generateFounderBriefing()
      .then((b) => setFounderBriefing(b))
      .catch(() => {})
      .finally(() => setFounderLoading(false));
  }, []);

  // KPI data (synchronous)
  const taskStats = taskEngine.getStats();
  const opsStats = operationsEngine.getDashboardStats();
  const investorStats = investorGenerator.getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">CEO Cockpit</h1>
            <p className="text-sm text-white/70 mt-0.5">{today}</p>
          </div>
          <button
            onClick={() => navigate('/admin/workroom')}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Open Work Room
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* ============================================================
            SECTION 1 — TODAY: Execute Now
            ============================================================ */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
            Today — Execute Now
          </h2>

          {todayLoading ? (
            <div className="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <RefreshCw size={18} className="animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-400">Scanning for priorities...</span>
            </div>
          ) : !todayFocus || todayFocus.topPriorities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
              <Zap size={28} className="text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No consolidated events require attention right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Event cards — max 5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {todayFocus.topPriorities.slice(0, 5).map((gp) => {
                  const projectColors: Record<string, string> = {
                    colonaive: 'border-l-teal-500',
                    durmah: 'border-l-blue-500',
                    sciencehod: 'border-l-purple-500',
                    sgrenovate: 'border-l-orange-500',
                  };
                  return (
                    <div
                      key={`ev-${gp.rank}`}
                      className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-l-4 ${projectColors[gp.project] || 'border-l-gray-400'} p-4 flex flex-col justify-between`}
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                            gp.rank === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                            : gp.rank === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                          }`}>{gp.rank}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 uppercase font-medium">
                            {gp.projectLabel}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug">{gp.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          <span className="font-medium text-gray-600 dark:text-gray-300">Next:</span> {gp.reason.slice(0, 100)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/admin/workroom')}
                        className="mt-3 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-xs font-medium transition-colors"
                      >
                        Open Work Room
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Nudges (inline, compact) */}
              {todayFocus.nudges.length > 0 && (
                <div className="space-y-1.5">
                  {todayFocus.nudges.slice(0, 3).map((nudge) => (
                    <div
                      key={nudge.id}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                        nudge.severity === 'urgent'
                          ? 'bg-red-50 dark:bg-red-900/15 border border-red-200 dark:border-red-800/30'
                          : nudge.severity === 'attention'
                          ? 'bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/30'
                          : 'bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        nudge.severity === 'urgent' ? 'bg-red-500'
                        : nudge.severity === 'attention' ? 'bg-amber-500'
                        : 'bg-gray-400'
                      }`} />
                      <p className="text-xs text-gray-700 dark:text-gray-300 flex-1">{nudge.message}</p>
                      <button
                        onClick={() => {
                          dismissNudge(nudge.id);
                          setTodayFocus((prev) => prev ? { ...prev, nudges: prev.nudges.filter((n) => n.id !== nudge.id) } : prev);
                        }}
                        className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 flex-shrink-0"
                        title="Dismiss"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                <span>{todayFocus.nudges.length} nudge{todayFocus.nudges.length !== 1 ? 's' : ''}</span>
                {todayFocus.upcomingCount > 0 && (
                  <span className="text-blue-500">{todayFocus.upcomingCount} upcoming (48h)</span>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================
            SECTION 2 — Priority Snapshot (collapsible)
            ============================================================ */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setPriorityOpen(!priorityOpen)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#0F766E]" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Priority Snapshot</span>
              {founderBriefing && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  {founderBriefing.topPriorities.length} priorities &middot; {founderBriefing.criticalRisks.length} risks
                </span>
              )}
            </div>
            {priorityOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          {priorityOpen && (
            <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
              {founderLoading ? (
                <div className="flex items-center justify-center py-6">
                  <RefreshCw size={16} className="animate-spin text-gray-400" />
                  <span className="ml-2 text-xs text-gray-400">Loading intelligence...</span>
                </div>
              ) : !founderBriefing ? (
                <p className="text-xs text-gray-400 text-center py-4">No intelligence data available.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top Priorities */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Target size={12} /> Top Priorities
                    </p>
                    {founderBriefing.topPriorities.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">None identified.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {founderBriefing.topPriorities.slice(0, 5).map((a) => (
                          <li key={a.id} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                              a.scores.priority >= 70 ? 'bg-red-500' : a.scores.priority >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`} />
                            <span className="line-clamp-1">{a.title}</span>
                            <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">{a.scores.priority}/100</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Critical Risks */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <AlertTriangle size={12} /> Critical Risks
                    </p>
                    {founderBriefing.criticalRisks.length === 0 ? (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">No critical risks. Signal landscape clear.</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {founderBriefing.criticalRisks.slice(0, 5).map((r) => (
                          <li key={r.id} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                            <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                              r.severity === 'high' ? 'bg-red-500' : r.severity === 'medium' ? 'bg-amber-500' : 'bg-gray-400'
                            }`} />
                            <span className="line-clamp-1">{r.title}</span>
                            <span className={`ml-auto text-[10px] flex-shrink-0 uppercase font-medium ${
                              r.severity === 'high' ? 'text-red-500' : r.severity === 'medium' ? 'text-amber-500' : 'text-gray-400'
                            }`}>{r.severity}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ============================================================
            SECTION 3 — KPI Snapshot (collapsible)
            ============================================================ */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setKpiOpen(!kpiOpen)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="text-[#0F766E]" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">KPI Snapshot</span>
            </div>
            {kpiOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          {kpiOpen && (
            <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{taskStats.inProgress}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Tasks Active</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className={`text-lg font-bold ${opsStats.overallStatus === 'healthy' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {opsStats.overallStatus === 'healthy' ? 'Healthy' : 'Degraded'}
                  </p>
                  <p className="text-[10px] text-gray-500 uppercase">Systems</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{investorStats.totalRaised}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Total Raised</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{investorStats.marketsActive}</p>
                  <p className="text-[10px] text-gray-500 uppercase">Markets</p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================
            SECTION 4 — Intelligence Hub (links to sub-pages)
            ============================================================ */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
            Intelligence Hub
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { label: 'Email Intelligence', path: '/admin/intelligence/email', icon: Inbox, desc: 'Inbox triage & classified emails' },
              { label: 'Founder Intelligence', path: '/admin/intelligence/founder', icon: Target, desc: 'Action scoring & briefings' },
              { label: 'Weekly Strategy', path: '/admin/intelligence/weekly', icon: Briefcase, desc: 'Strategy digest & briefings' },
              { label: 'Regulatory Tracker', path: '/admin/intelligence/regulatory', icon: Shield, desc: 'Approvals & clinical trials' },
              { label: 'LinkedIn Intelligence', path: '/admin/linkedin-intelligence', icon: Linkedin, desc: 'Post opportunities & tracking' },
              { label: 'CRC Radar', path: '/admin/crc-radar', icon: Radar, desc: 'Research signals & news' },
              { label: 'Relationships', path: '/admin/relationship-intelligence', icon: UserCircle, desc: 'Contact priority & follow-ups' },
              { label: 'Global Intelligence', path: '/admin/intelligence/founder', icon: Globe, desc: 'Cross-project portfolio view' },
            ].map((item) => (
              <button
                key={item.path + item.label}
                onClick={() => navigate(item.path)}
                className="group flex flex-col items-start p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#0F766E]/40 hover:shadow-md transition-all text-left"
              >
                <item.icon size={18} className="text-[#0F766E] mb-2" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-[#0F766E] transition-colors">{item.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CEOCockpit;
