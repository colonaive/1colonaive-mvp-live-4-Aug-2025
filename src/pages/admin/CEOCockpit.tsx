import React, { useState, useEffect } from 'react';
import {
  Zap,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Target,
  BarChart3,
  Inbox,
  Shield,
  Linkedin,
  Radar,
  UserCircle,
  Globe,
  X,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { consolidateEvents, getTopEvents, type CEOEvent } from '@/lib/eventConsolidationEngine';
import { dismissNudge, generateProactiveSignals, type ProactiveNudge } from '@/lib/proactiveEngine';
import { taskEngine } from '@/chief-of-staff/tasks/taskEngine';
import { operationsEngine } from '@/chief-of-staff/operations/operationsEngine';
import { investorGenerator } from '@/chief-of-staff/investors/investorGenerator';

const today = new Date().toLocaleDateString('en-SG', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

/* ── Risk level badge colors ── */

const riskColors: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  high: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  medium: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  low: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-600 dark:text-gray-400', dot: 'bg-gray-400' },
};

const eventTypeLabels: Record<string, string> = {
  logistics: 'Logistics',
  investor: 'Investor',
  regulatory: 'Regulatory',
  product: 'Product',
  clinical: 'Clinical',
  partnership: 'Partnership',
  general: 'General',
};

const CEOCockpit: React.FC = () => {
  const navigate = useNavigate();

  // Section 1: Consolidated events
  const [events, setEvents] = useState<CEOEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [nudges, setNudges] = useState<ProactiveNudge[]>([]);

  // Section 2: Priority snapshot (collapsible) — kept for deep-dive
  const [priorityOpen, setPriorityOpen] = useState(false);

  // Section 3: KPI snapshot (collapsible)
  const [kpiOpen, setKpiOpen] = useState(false);

  useEffect(() => {
    setEventsLoading(true);

    // Run consolidation pipeline + nudges in parallel
    Promise.all([
      consolidateEvents().catch(() => getTopEvents(5).catch(() => [])),
      generateProactiveSignals().catch(() => []),
    ])
      .then(([consolidatedEvents, proactiveNudges]) => {
        setEvents(consolidatedEvents);
        setNudges(proactiveNudges);
      })
      .finally(() => setEventsLoading(false));
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
            SECTION 1 — Consolidated Events
            ============================================================ */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
            Today — Execute Now
          </h2>

          {eventsLoading ? (
            <div className="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <RefreshCw size={18} className="animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-400">Consolidating events...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
              <Zap size={28} className="text-gray-300 dark:text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No consolidated events require attention right now.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Event cards — max 5 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {events.slice(0, 5).map((evt) => {
                  const colors = riskColors[evt.risk_level] || riskColors.low;
                  return (
                    <div
                      key={evt.id}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: risk dot + type badge + priority */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${colors.bg} ${colors.text}`}>
                            {eventTypeLabels[evt.event_type] || evt.event_type}
                          </span>
                          <span className="text-[10px] text-gray-400 ml-auto">{evt.priority_score}/100</span>
                        </div>

                        {/* Event name */}
                        <p className="text-sm font-medium text-gray-900 dark:text-white leading-snug line-clamp-2">
                          {evt.event_name}
                        </p>

                        {/* Next action */}
                        {evt.next_action && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            <span className="font-medium text-gray-600 dark:text-gray-300">Next:</span> {evt.next_action}
                          </p>
                        )}

                        {/* Risk summary */}
                        {evt.risk_summary && evt.risk_summary !== 'No identified risks' && (
                          <p className="text-xs text-red-500 dark:text-red-400 mt-1 line-clamp-1">
                            <span className="font-medium">Risk:</span> {evt.risk_summary}
                          </p>
                        )}

                        {/* Signal count */}
                        <p className="text-[10px] text-gray-400 mt-2">{evt.summary}</p>
                      </div>

                      <button
                        onClick={() => navigate(`/admin/workroom?event_id=${evt.id}`)}
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
              {nudges.length > 0 && (
                <div className="space-y-1.5">
                  {nudges.slice(0, 3).map((nudge) => (
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
                          setNudges((prev) => prev.filter((n) => n.id !== nudge.id));
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
                <span>{events.length} event{events.length !== 1 ? 's' : ''} consolidated</span>
                <span>{nudges.length} nudge{nudges.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </section>

        {/* ============================================================
            SECTION 2 — Priority Snapshot (collapsible, deep-dive)
            ============================================================ */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setPriorityOpen(!priorityOpen)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Target size={16} className="text-[#0F766E]" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Event Detail</span>
              {events.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                  {events.length} event{events.length !== 1 ? 's' : ''} &middot; {events.filter((e) => e.risk_level === 'critical' || e.risk_level === 'high').length} high-risk
                </span>
              )}
            </div>
            {priorityOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </button>

          {priorityOpen && (
            <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700 pt-3">
              {events.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No events to show.</p>
              ) : (
                <div className="space-y-3">
                  {events.map((evt) => {
                    const colors = riskColors[evt.risk_level] || riskColors.low;
                    return (
                      <div key={evt.id} className="flex items-start gap-3 text-xs">
                        <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white">{evt.event_name}</p>
                          <p className="text-gray-500 dark:text-gray-400 mt-0.5">{evt.next_action}</p>
                          {evt.risk_summary && evt.risk_summary !== 'No identified risks' && (
                            <p className="text-red-500 dark:text-red-400 mt-0.5">Risk: {evt.risk_summary}</p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium uppercase ${colors.bg} ${colors.text}`}>
                            {evt.risk_level}
                          </span>
                          <span className="text-[10px] text-gray-400">{evt.priority_score}/100</span>
                        </div>
                      </div>
                    );
                  })}
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
