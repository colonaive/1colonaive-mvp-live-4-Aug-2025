import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Shield,
  FlaskConical,
  FileText,
  TrendingUp,
  Brain,
  GitBranch,
  RefreshCw,
  AlertCircle,
  Newspaper,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Linkedin,
  Radar,
  Target,
  Zap,
  Globe,
  ListChecks,
  Map as MapIcon,
  Activity,
  Layers,
  BarChart3,
  ClipboardList,
  Check,
  X,
  CheckCircle2,
  UserCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CockpitCard from '@/components/cockpit/CockpitCard';
import CockpitSection from '@/components/cockpit/CockpitSection';
import { cockpitService, type InboxEmail, type CRCNewsItem, type ExecutiveBriefingSummary, type LinkedInPost } from '@/services/cockpitService';
import { radarService, type RadarSignal } from '@/services/radarService';
import { competitiveIntelligenceService, type CompetitorSignal, type EarlyWarningSignal, type TechnologyTrend } from '@/services/competitiveIntelligenceService';
import { classifySignal, getSignalColor, getSignalLabel } from '@/radar/scoring/radarScore';
import { taskEngine } from '@/chief-of-staff/tasks/taskEngine';
import { roadmapEngine } from '@/chief-of-staff/roadmap/roadmapEngine';
import { operationsEngine } from '@/chief-of-staff/operations/operationsEngine';
import { investorGenerator } from '@/chief-of-staff/investors/investorGenerator';
import { projectRegistry } from '@/chief-of-staff/projects/projectRegistry';
import { strategyDigest, type WeeklyStrategyDigest } from '@/chief-of-staff/strategy/strategyDigest';
import ActionCenterChat from '@/components/cockpit/ActionCenterChat';
import { chatEngine } from '@/chief-of-staff/action-center/chatEngine';
import { promptGenerator } from '@/chief-of-staff/action-center/promptGenerator';
import { emailComposer } from '@/chief-of-staff/action-center/emailComposer';
import { decisionMemoryEngine } from '@/chief-of-staff/decision-memory/decisionMemoryEngine';
import { decisionPatterns, type DecisionPattern } from '@/chief-of-staff/decision-memory/decisionPatterns';
import { generateFounderBriefing, type FounderBriefing } from '@/lib/founderBriefing';
import { generateCrossProjectBriefing, type CrossProjectBriefing, type ProjectId } from '@/lib/projectSignals';
import { getTodayFocus, dismissNudge, type TodayFocus, type ProactiveNudge } from '@/lib/proactiveEngine';
import type { ScoredAction } from '@/lib/actionIntelligence';
import {
  trackAction,
  markActionAccepted,
  markActionIgnored,
  markActionCompleted,
  getFounderProfile,
  type ActionHistoryRecord,
  type FounderProfile,
} from '@/lib/actionFeedback';
import { getRelationshipStats, getOverdueFollowups, getUpcomingFollowups, type RelationshipStats, type LinkedInContact } from '@/lib/linkedinEngine';

const today = new Date().toLocaleDateString('en-SG', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    proposed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    ready: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    published: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    planned: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    'in-progress': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
    healthy: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    degraded: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    down: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
};

const healthDot = (status: 'green' | 'amber' | 'red') => {
  const cls = status === 'green' ? 'bg-emerald-500' : status === 'amber' ? 'bg-amber-500' : 'bg-red-500';
  return <span className={`inline-block w-2 h-2 rounded-full ${cls}`} />;
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-SG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const CEOCockpit: React.FC = () => {
  const navigate = useNavigate();
  const regulatory = cockpitService.getRegulatoryStatus();
  const trials = cockpitService.getClinicalTrials();
  const investors = cockpitService.getInvestorHistory();
  const brochureList = cockpitService.getBrochures();
  const memoryItems = cockpitService.getProjectMemoryItems();
  const repo = cockpitService.getRepoActivityPlaceholder();

  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);

  const [crcNews, setCrcNews] = useState<CRCNewsItem[]>([]);
  const [crcLoading, setCrcLoading] = useState(true);
  const [crcError, setCrcError] = useState<string | null>(null);

  const [briefing, setBriefing] = useState<ExecutiveBriefingSummary | null>(null);
  const [briefingHistory, setBriefingHistory] = useState<ExecutiveBriefingSummary[]>([]);
  const [briefingLoading, setBriefingLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPost[]>([]);
  const [linkedInLoading, setLinkedInLoading] = useState(true);

  const [radarSignals, setRadarSignals] = useState<RadarSignal[]>([]);
  const [radarLoading, setRadarLoading] = useState(true);

  const [compSignals, setCompSignals] = useState<CompetitorSignal[]>([]);
  const [earlyWarnings, setEarlyWarnings] = useState<EarlyWarningSignal[]>([]);
  const [techTrends, setTechTrends] = useState<TechnologyTrend[]>([]);
  const [compLoading, setCompLoading] = useState(true);

  // Founder Intelligence state
  const [founderBriefing, setFounderBriefing] = useState<FounderBriefing | null>(null);
  const [founderLoading, setFounderLoading] = useState(true);

  // Chief-of-Staff state
  const [digest, setDigest] = useState<WeeklyStrategyDigest | null>(null);
  const [, setWidgetTick] = useState(0);
  const [memoryPatterns, setMemoryPatterns] = useState<DecisionPattern[]>([]);
  const [memoryStats, setMemoryStats] = useState<{ totalMemories: number; topEntity: string | null; topAction: string | null; avgConfidence: number }>({ totalMemories: 0, topEntity: null, topAction: null, avgConfidence: 0 });

  // Decision Loop Engine state — CTW-COCKPIT-02D
  const [trackedActions, setTrackedActions] = useState<Map<number, ActionHistoryRecord>>(new Map());
  const [actionUpdating, setActionUpdating] = useState<string | null>(null);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);

  // Cross-Project Intelligence state — CTW-COCKPIT-02E
  const [crossProjectBriefing, setCrossProjectBriefing] = useState<CrossProjectBriefing | null>(null);

  // Proactive Intelligence state — CTW-COCKPIT-02F
  const [todayFocus, setTodayFocus] = useState<TodayFocus | null>(null);
  const [todayFocusLoading, setTodayFocusLoading] = useState(true);

  // Relationship Intelligence state — CTW-COCKPIT-03A
  const [relStats, setRelStats] = useState<RelationshipStats | null>(null);
  const [relOverdue, setRelOverdue] = useState<LinkedInContact[]>([]);
  const [relUpcoming, setRelUpcoming] = useState<LinkedInContact[]>([]);
  const [relLoading, setRelLoading] = useState(true);
  const handleActionCenterUpdate = () => {
    setWidgetTick((t) => t + 1);
    // Refresh decision memory widget
    setMemoryPatterns(decisionPatterns.getTopPatterns(5));
    setMemoryStats(decisionMemoryEngine.getStats());
  };

  const loadCompetitiveIntel = async () => {
    setCompLoading(true);
    try {
      const [cs, ew, tt] = await Promise.all([
        competitiveIntelligenceService.fetchCompetitorSignals(5),
        competitiveIntelligenceService.fetchEarlyWarningSignals(5),
        competitiveIntelligenceService.fetchTechnologyTrends(),
      ]);
      setCompSignals(cs);
      setEarlyWarnings(ew);
      setTechTrends(tt);
    } catch {
      // silent fail — supplementary
    } finally {
      setCompLoading(false);
    }
  };

  const loadRadar = async () => {
    setRadarLoading(true);
    try {
      const data = await radarService.fetchTopSignals(7, 5);
      setRadarSignals(data);
    } catch {
      // silent fail — supplementary
    } finally {
      setRadarLoading(false);
    }
  };

  const loadBriefing = async () => {
    setBriefingLoading(true);
    try {
      const [latest, history] = await Promise.all([
        cockpitService.fetchLatestBriefing(),
        cockpitService.fetchBriefingHistory(7),
      ]);
      setBriefing(latest);
      setBriefingHistory(history);
    } catch {
      // silent fail — briefing is supplementary
    } finally {
      setBriefingLoading(false);
    }
  };

  const loadInbox = async () => {
    setInboxLoading(true);
    setInboxError(null);
    try {
      const data = await cockpitService.fetchInboxEmails();
      setEmails(data);
    } catch (err: unknown) {
      setInboxError(err instanceof Error ? err.message : 'Failed to load emails');
    } finally {
      setInboxLoading(false);
    }
  };

  const loadCRCNews = async () => {
    setCrcLoading(true);
    setCrcError(null);
    try {
      const data = await cockpitService.fetchCRCNews();
      setCrcNews(data);
    } catch (err: unknown) {
      setCrcError(err instanceof Error ? err.message : 'Failed to load CRC news');
    } finally {
      setCrcLoading(false);
    }
  };

  const loadLinkedIn = async () => {
    setLinkedInLoading(true);
    try {
      const data = await cockpitService.fetchLinkedInPosts();
      setLinkedInPosts(data);
    } catch {
      // silent fail — supplementary
    } finally {
      setLinkedInLoading(false);
    }
  };

  const loadFounderIntelligence = async () => {
    setFounderLoading(true);
    try {
      const briefingData = await generateFounderBriefing();
      setFounderBriefing(briefingData);

      // Auto-track recommended actions in history
      const tracked = new Map<number, ActionHistoryRecord>();
      for (let i = 0; i < briefingData.recommendedActions.length; i++) {
        const rec = briefingData.recommendedActions[i];
        const source = briefingData.topPriorities[i]?.source || 'strategy';
        const record = await trackAction(rec.title, source as ActionHistoryRecord['source'], rec.priority);
        if (record) tracked.set(i, record);
      }
      setTrackedActions(tracked);
    } catch {
      // silent fail — supplementary intelligence
    } finally {
      setFounderLoading(false);
    }
  };

  const loadFounderProfile = async () => {
    try {
      const profile = await getFounderProfile();
      setFounderProfile(profile);
    } catch {
      // silent fail
    }
  };

  const handleAcceptAction = async (index: number) => {
    const record = trackedActions.get(index);
    if (!record) return;
    setActionUpdating(record.id);
    const ok = await markActionAccepted(record.id);
    if (ok) {
      setTrackedActions((prev) => {
        const next = new Map(prev);
        next.set(index, { ...record, status: 'accepted' });
        return next;
      });
    }
    setActionUpdating(null);
  };

  const handleIgnoreAction = async (index: number) => {
    const record = trackedActions.get(index);
    if (!record) return;
    setActionUpdating(record.id);
    const ok = await markActionIgnored(record.id);
    if (ok) {
      setTrackedActions((prev) => {
        const next = new Map(prev);
        next.set(index, { ...record, status: 'ignored' });
        return next;
      });
    }
    setActionUpdating(null);
  };

  const handleCompleteAction = async (index: number) => {
    const record = trackedActions.get(index);
    if (!record) return;
    setActionUpdating(record.id);
    const ok = await markActionCompleted(record.id, 'success');
    if (ok) {
      setTrackedActions((prev) => {
        const next = new Map(prev);
        next.set(index, { ...record, status: 'completed', outcome: 'success' });
        return next;
      });
      loadFounderProfile(); // Refresh profile after completion
    }
    setActionUpdating(null);
  };

  const loadRelationshipIntel = async () => {
    setRelLoading(true);
    try {
      const [stats, overdue, upcoming] = await Promise.all([
        getRelationshipStats(),
        getOverdueFollowups(),
        getUpcomingFollowups(7),
      ]);
      setRelStats(stats);
      setRelOverdue(overdue);
      setRelUpcoming(upcoming);
    } catch { /* silent */ }
    finally { setRelLoading(false); }
  };

  useEffect(() => {
    loadInbox(); loadCRCNews(); loadBriefing(); loadLinkedIn(); loadRadar(); loadCompetitiveIntel(); loadFounderIntelligence(); loadFounderProfile(); loadRelationshipIntel();
    // Load Proactive Intelligence (async)
    setTodayFocusLoading(true);
    getTodayFocus().then((f) => setTodayFocus(f)).catch(() => {}).finally(() => setTodayFocusLoading(false));
    // Load Cross-Project Intelligence (synchronous)
    try { setCrossProjectBriefing(generateCrossProjectBriefing()); } catch { /* silent */ }
    // Load Chief-of-Staff strategy digest (synchronous)
    setDigest(strategyDigest.generate());
    // Load decision memory
    decisionMemoryEngine.ensureLoaded().then(() => {
      setMemoryPatterns(decisionPatterns.getTopPatterns(5));
      setMemoryStats(decisionMemoryEngine.getStats());
    }).catch(() => {});
  }, []);

  // Chief-of-Staff computed data
  const taskStats = taskEngine.getStats();
  const roadmapStats = roadmapEngine.getStats();
  const roadmapEntries = roadmapEngine.getAllEntries();
  const activeMilestone = roadmapEngine.getActiveMilestone();
  const opsSnapshot = operationsEngine.getSnapshot();
  const opsStats = operationsEngine.getDashboardStats();
  const investorStats = investorGenerator.getStats();
  const investorMaterials = investorGenerator.getAllMaterials();
  const projects = projectRegistry.getAllProjects();
  const projectStats = projectRegistry.getStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">CEO Cockpit</h1>
          <p className="text-sm text-white/70 mt-1">{today}</p>
          <p className="text-xs text-white/50 mt-0.5">Chief-of-Staff Intelligence Layer Active</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* === TODAY'S FOCUS — Proactive Intelligence CTW-COCKPIT-02F === */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Today's Focus"
            subtitle="Proactive priorities, nudges & upcoming actions"
            icon={<Zap size={18} />}
            status={todayFocus ? 'active' : 'pending'}
          >
            {todayFocusLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={18} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Scanning for priorities...</span>
              </div>
            ) : !todayFocus ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Zap size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs text-gray-400">Proactive intelligence unavailable.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Top 3 Priorities Row */}
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Top Priorities Right Now</p>
                  {todayFocus.topPriorities.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No global priorities identified.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {todayFocus.topPriorities.map((gp) => (
                        <div key={`tf-${gp.rank}`} className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700/50 dark:to-gray-800/30 border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                              gp.rank === 1 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                              : gp.rank === 2 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                            }`}>{gp.rank}</span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                              ({ colonaive: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', durmah: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', sciencehod: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', sgrenovate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' } as Record<string, string>)[gp.project] || 'bg-gray-100 text-gray-600'
                            }`}>{gp.projectLabel}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">{gp.title}</p>
                          <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{gp.reason.slice(0, 80)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Nudges */}
                {todayFocus.nudges.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Proactive Nudges</p>
                    <div className="space-y-1.5">
                      {todayFocus.nudges.map((nudge) => (
                        <div
                          key={nudge.id}
                          className={`flex items-start gap-2 rounded-lg px-3 py-2 border ${
                            nudge.severity === 'urgent'
                              ? 'bg-red-50 border-red-200 dark:bg-red-900/15 dark:border-red-800/30'
                              : nudge.severity === 'attention'
                              ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/15 dark:border-amber-800/30'
                              : 'bg-gray-50 border-gray-200 dark:bg-gray-800/30 dark:border-gray-700'
                          }`}
                        >
                          <span className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                            nudge.severity === 'urgent' ? 'bg-red-500'
                            : nudge.severity === 'attention' ? 'bg-amber-500'
                            : 'bg-gray-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed ${
                              nudge.severity === 'urgent' ? 'text-red-800 dark:text-red-300'
                              : nudge.severity === 'attention' ? 'text-amber-800 dark:text-amber-300'
                              : 'text-gray-600 dark:text-gray-400'
                            }`}>{nudge.message}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 italic">{nudge.recommended_action}</p>
                          </div>
                          <button
                            onClick={() => {
                              dismissNudge(nudge.id);
                              setTodayFocus((prev) => prev ? { ...prev, nudges: prev.nudges.filter((n) => n.id !== nudge.id) } : prev);
                            }}
                            className="text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400 flex-shrink-0"
                            title="Dismiss for 24h"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer stats */}
                <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] text-gray-400">{todayFocus.nudges.length} active nudge{todayFocus.nudges.length !== 1 ? 's' : ''}</span>
                  {todayFocus.upcomingCount > 0 && (
                    <span className="text-[10px] text-blue-500">{todayFocus.upcomingCount} upcoming action{todayFocus.upcomingCount !== 1 ? 's' : ''} (48h)</span>
                  )}
                </div>
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* === CEO ACTION CENTER === */}
        <ActionCenterChat onAction={handleActionCenterUpdate} />

        {/* === ACTION CENTER DASHBOARD WIDGET === */}
        <CockpitSection>
          <CockpitCard
            title="Recent CEO Chats"
            subtitle={`${chatEngine.getMessageCount()} messages in current session`}
            icon={<ListChecks size={18} />}
            status={chatEngine.getMessageCount() > 0 ? 'active' : 'pending'}
          >
            {chatEngine.getMessages().length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No conversations yet. Use the Action Center above.</p>
            ) : (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {chatEngine.getRecentMessages(5).map((msg) => (
                  <div key={msg.id} className="text-[11px] text-gray-600 dark:text-gray-400 truncate">
                    <span className={msg.role === 'ceo' ? 'text-teal-600 dark:text-teal-400 font-medium' : 'text-gray-500'}>
                      {msg.role === 'ceo' ? 'CEO' : 'AI'}:
                    </span>{' '}
                    {msg.content.slice(0, 80)}{msg.content.length > 80 ? '...' : ''}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          <CockpitCard
            title="Generated Prompts"
            subtitle={`${promptGenerator.getHistory().length} prompts created`}
            icon={<ClipboardList size={18} />}
            status={promptGenerator.getHistory().length > 0 ? 'active' : 'pending'}
          >
            {promptGenerator.getHistory().length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No AG prompts generated yet.</p>
            ) : (
              <div className="space-y-2">
                {promptGenerator.getRecent(3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-gray-400">{p.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          <CockpitCard
            title="Draft Emails"
            subtitle={`${emailComposer.getStats().total} total · ${emailComposer.getStats().sent} sent`}
            icon={<Inbox size={18} />}
            status={emailComposer.getStats().total > 0 ? 'active' : 'pending'}
          >
            {emailComposer.getAllDrafts().length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No email drafts. Use "Draft email" in the Action Center.</p>
            ) : (
              <div className="space-y-2">
                {emailComposer.getPendingDrafts().slice(0, 3).map((d) => (
                  <div key={d.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{d.subject}</p>
                      <p className="text-[10px] text-gray-400">{d.to || '(no recipient)'} · {d.status}</p>
                    </div>
                    {statusBadge(d.status)}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* === DECISION MEMORY WIDGET === */}
        <CockpitSection>
          <CockpitCard
            title="Decision Memory"
            subtitle={`${memoryStats.totalMemories} patterns tracked`}
            icon={<Brain size={18} />}
            status={memoryStats.totalMemories > 0 ? 'active' : 'pending'}
          >
            {memoryStats.totalMemories === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No decision patterns yet. Patterns emerge as you use the Action Center.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{memoryStats.topAction || '—'}</p>
                    <p className="text-[10px] text-gray-500">Top Action</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400">{memoryStats.topEntity || '—'}</p>
                    <p className="text-[10px] text-gray-500">Top Contact</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                    <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{memoryStats.avgConfidence}%</p>
                    <p className="text-[10px] text-gray-500">Avg Confidence</p>
                  </div>
                </div>
                {memoryPatterns.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Active Patterns</p>
                    {memoryPatterns.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-700 dark:text-gray-300 truncate">{p.label}</span>
                        <span className="text-gray-400 ml-2 shrink-0">{p.frequency}x · {p.confidence}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* === CHIEF-OF-STAFF: Strategy Digest === */}
        {digest && (
          <CockpitSection columns={1}>
            <CockpitCard
              title="Weekly Strategy Digest"
              subtitle={`Week of ${digest.weekOf}`}
              icon={<ClipboardList size={18} />}
              status={digest.overallHealth === 'green' ? 'active' : 'pending'}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {digest.sections.map((section) => (
                  <div key={section.heading} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {healthDot(section.status)}
                      <h4 className="text-[11px] font-semibold text-[#0F766E] dark:text-emerald-400 uppercase tracking-wide">
                        {section.heading}
                      </h4>
                    </div>
                    <ul className="space-y-1">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                          <span className="text-[#0F766E] dark:text-emerald-400 mr-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CockpitCard>
          </CockpitSection>
        )}

        {/* Executive Briefing (top of dashboard) */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Executive Briefing"
            subtitle="Daily intelligence summary"
            icon={<Briefcase size={18} />}
            status={briefing ? 'active' : briefingLoading ? 'pending' : 'placeholder'}
            lastUpdated={briefing?.created_at ? new Date(briefing.created_at).toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }) : undefined}
          >
            {briefingLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading briefing...</span>
              </div>
            ) : !briefing ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Briefcase size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-xs">No briefing available yet.</p>
                <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-1">Briefings are generated daily at 07:00 SGT.</p>
              </div>
            ) : (
              <div>
                {/* Today's briefing sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {(briefing.sections || []).map((section) => (
                    <div key={section.heading} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <h4 className="text-[11px] font-semibold text-[#0F766E] dark:text-emerald-400 uppercase tracking-wide mb-2">
                        {section.heading}
                      </h4>
                      <ul className="space-y-1">
                        {section.items.map((item, idx) => (
                          <li key={idx} className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">
                            <span className="text-[#0F766E] dark:text-emerald-400 mr-1">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Past briefings toggle */}
                {briefingHistory.length > 1 && (
                  <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3">
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {showHistory ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      {showHistory ? 'Hide' : 'View'} past briefings ({briefingHistory.length - 1})
                    </button>
                    {showHistory && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                        {briefingHistory.slice(1).map((b) => (
                          <div
                            key={b.id}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/30 rounded px-3 py-2"
                          >
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
          </CockpitCard>
        </CockpitSection>

        {/* === FOUNDER INTELLIGENCE — Action Intelligence Layer === */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Founder Intelligence"
            subtitle="Action scoring, priorities & recommended next moves"
            icon={<Target size={18} />}
            status={founderBriefing ? 'active' : 'pending'}
            lastUpdated={founderBriefing ? new Date(founderBriefing.generatedAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) : undefined}
          >
            {founderLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw size={18} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Analysing intelligence signals...</span>
              </div>
            ) : !founderBriefing ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Target size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs text-gray-400">No intelligence signals available yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Guardrail Status Banner */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Guardrail: Strict Mode</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">|</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Verified sources only</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">|</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    <span title="HIGH confidence">●</span> HIGH &nbsp;
                    <span title="MEDIUM confidence">◐</span> MED &nbsp;
                    <span title="LOW confidence">○</span> LOW
                  </span>
                </div>

                {/* Executive Summary */}
                <div className="bg-gradient-to-r from-[#0A385A]/5 to-[#0F766E]/5 dark:from-[#0A385A]/20 dark:to-[#0F766E]/20 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Executive Summary</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{founderBriefing.executiveSummary}</p>
                </div>

                {/* Email Intelligence Section */}
                {founderBriefing.emailIntelligence && founderBriefing.emailIntelligence.totalIngested > 0 && (
                  <div className="bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Intelligence</p>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {founderBriefing.emailIntelligence.totalIngested} ingested
                      </span>
                    </div>
                    {founderBriefing.emailIntelligence.takeAction.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-medium text-red-600 dark:text-red-400 uppercase mb-1">Execute Now</p>
                        <div className="space-y-1">
                          {founderBriefing.emailIntelligence.takeAction.slice(0, 5).map((email) => (
                            <div key={email.id} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                              <span title={`Confidence: ${email.confidence_level}`} className="flex-shrink-0">
                                {email.confidence_level === 'high' ? '●' : email.confidence_level === 'medium' ? '◐' : '○'}
                              </span>
                              <span className="text-[10px] px-1 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 flex-shrink-0">
                                {email.source_origin === 'direct_email' ? 'Email' : email.source_origin === 'manual_entry' ? 'Manual' : 'AI'}
                              </span>
                              <span className="truncate">{email.sender_name} — {email.subject}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {founderBriefing.emailIntelligence.investigate.length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-amber-600 dark:text-amber-400 uppercase mb-1">Watch</p>
                        <div className="space-y-1">
                          {founderBriefing.emailIntelligence.investigate.slice(0, 3).map((email) => (
                            <div key={email.id} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                              <span title={`Confidence: ${email.confidence_level}`} className="flex-shrink-0">
                                {email.confidence_level === 'high' ? '●' : email.confidence_level === 'medium' ? '◐' : '○'}
                              </span>
                              <span className="text-[10px] px-1 py-0.5 rounded bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 flex-shrink-0">
                                {email.source_origin === 'direct_email' ? 'Email' : email.source_origin === 'manual_entry' ? 'Manual' : 'AI'}
                              </span>
                              <span className="truncate">{email.sender_name} — {email.subject}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Top 3 Priorities + Risks side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top Priorities */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Top Priorities</p>
                    {founderBriefing.topPriorities.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No priority actions identified.</p>
                    ) : (
                      <div className="space-y-2">
                        {founderBriefing.topPriorities.map((action: ScoredAction) => (
                          <div key={action.id} className="bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">{action.title}</p>
                                <p className="text-[10px] text-gray-400 mt-1 capitalize">{action.source.replace('_', ' ')}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  action.scores.priority >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : action.scores.priority >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                }`}>
                                  {action.scores.priority}/100
                                </span>
                                <span className="text-[9px] text-gray-400">#{action.rank}</span>
                              </div>
                            </div>
                            {/* Score breakdown */}
                            <div className="flex gap-3 mt-2 text-[9px] text-gray-400">
                              <span>Impact {action.scores.impact}</span>
                              <span>Urgency {action.scores.urgency}</span>
                              <span>Effort {action.scores.effort}</span>
                              <span>Alignment {action.scores.alignment}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Critical Risks */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Critical Risks</p>
                    {founderBriefing.criticalRisks.length === 0 ? (
                      <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                        <p className="text-xs text-emerald-700 dark:text-emerald-300">No critical risks detected. Signal landscape clear.</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {founderBriefing.criticalRisks.map((risk) => (
                          <div key={risk.id} className="bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">{risk.title}</p>
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                risk.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                : risk.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                                {risk.severity}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{risk.description}</p>
                            <p className="text-[9px] text-gray-400 mt-1">{risk.source}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recommended Next Moves — with Decision Loop buttons */}
                {founderBriefing.recommendedActions.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Recommended Next Moves</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {founderBriefing.recommendedActions.slice(0, 3).map((rec, i) => {
                        const tracked = trackedActions.get(i);
                        const status = tracked?.status || 'suggested';
                        const isUpdating = tracked && actionUpdating === tracked.id;
                        return (
                          <div key={i} className={`bg-white dark:bg-gray-700/50 border rounded-lg p-3 ${
                            status === 'accepted' ? 'border-emerald-300 dark:border-emerald-600'
                            : status === 'completed' ? 'border-blue-300 dark:border-blue-600'
                            : status === 'ignored' ? 'border-gray-200 dark:border-gray-700 opacity-60'
                            : 'border-gray-100 dark:border-gray-600'
                          }`}>
                            <div className="flex items-center gap-2 mb-1">
                              <Zap size={12} className="text-amber-500 flex-shrink-0" />
                              <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{rec.title}</p>
                            </div>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 line-clamp-2">{rec.rationale}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[9px] text-gray-400">Priority: {rec.priority}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                rec.effort === 'low' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                                : rec.effort === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                                : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                              }`}>
                                {rec.effort} effort
                              </span>
                            </div>
                            {/* Decision Loop Action Buttons */}
                            <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                              {status === 'suggested' && (
                                <>
                                  <button
                                    onClick={() => handleAcceptAction(i)}
                                    disabled={!!isUpdating}
                                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-colors"
                                  >
                                    <Check size={10} /> Accept
                                  </button>
                                  <button
                                    onClick={() => handleIgnoreAction(i)}
                                    disabled={!!isUpdating}
                                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    <X size={10} /> Ignore
                                  </button>
                                </>
                              )}
                              {status === 'accepted' && (
                                <>
                                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                                    <Check size={10} /> Accepted
                                  </span>
                                  <button
                                    onClick={() => handleCompleteAction(i)}
                                    disabled={!!isUpdating}
                                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors ml-auto"
                                  >
                                    <CheckCircle2 size={10} /> Complete
                                  </button>
                                </>
                              )}
                              {status === 'completed' && (
                                <span className="flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400">
                                  <CheckCircle2 size={10} /> Completed
                                </span>
                              )}
                              {status === 'ignored' && (
                                <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400">
                                  <X size={10} /> Ignored
                                </span>
                              )}
                              {isUpdating && <RefreshCw size={10} className="animate-spin text-gray-400 ml-auto" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Founder Behaviour Profile — CTW-COCKPIT-02D */}
                {founderProfile && founderProfile.totalActions > 0 && (
                  <div className="bg-gradient-to-r from-[#0A385A]/5 to-purple-500/5 dark:from-[#0A385A]/20 dark:to-purple-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCircle size={14} className="text-purple-500" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Founder Behaviour Profile</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{founderProfile.totalActions}</p>
                        <p className="text-[10px] text-gray-500">Total Actions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{founderProfile.acceptedPercent}%</p>
                        <p className="text-[10px] text-gray-500">Accepted</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{founderProfile.completedPercent}%</p>
                        <p className="text-[10px] text-gray-500">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{founderProfile.successRate}%</p>
                        <p className="text-[10px] text-gray-500">Success Rate</p>
                      </div>
                    </div>
                    {founderProfile.preferredSources.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-gray-400">Preferred sources:</span>
                        {founderProfile.preferredSources.slice(0, 3).map((ps) => (
                          <span key={ps.source} className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 capitalize">
                            {ps.source.replace('_', ' ')} ({ps.count})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Signal count footer */}
                <div className="text-center pt-2 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-[10px] text-gray-400">
                    {founderBriefing.signalCount} signals analysed from radar, early warnings, strategy implications & email intelligence
                  </p>
                  <p className="text-[9px] text-emerald-500 dark:text-emerald-400 mt-0.5">
                    Intelligence Guardrails Active — Verified Sources Only
                  </p>
                </div>
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* === GLOBAL INTELLIGENCE — Cross-Project Intelligence CTW-COCKPIT-02E === */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Global Intelligence"
            subtitle="Cross-project priorities, focus shifts & portfolio health"
            icon={<Globe size={18} />}
            status={crossProjectBriefing ? 'active' : 'pending'}
            lastUpdated={crossProjectBriefing ? new Date(crossProjectBriefing.generatedAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) : undefined}
          >
            {!crossProjectBriefing ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Globe size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-xs text-gray-400">Cross-project intelligence unavailable.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Top Project Banner */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={14} className="text-indigo-600 dark:text-indigo-400" />
                    <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wide">Top Project Right Now</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{crossProjectBriefing.topProjectLabel}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{crossProjectBriefing.topProjectReason}</p>
                </div>

                {/* Focus Shift Advice */}
                <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-100 dark:border-amber-800/20">
                  <div className="flex items-start gap-2">
                    <Zap size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{crossProjectBriefing.focusShiftAdvice}</p>
                  </div>
                </div>

                {/* Global Priorities + Project Health side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Top Cross-Project Actions */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Top Cross-Project Actions</p>
                    {crossProjectBriefing.globalPriorities.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No cross-project priorities identified.</p>
                    ) : (
                      <div className="space-y-2">
                        {crossProjectBriefing.globalPriorities.map((gp) => (
                          <div key={`gp-${gp.rank}`} className="bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="inline-block w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-600 text-[10px] font-bold text-gray-600 dark:text-gray-300 flex items-center justify-center">{gp.rank}</span>
                                  <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2">{gp.title}</p>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-1 ml-7">{gp.reason.slice(0, 120)}{gp.reason.length > 120 ? '...' : ''}</p>
                              </div>
                              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  gp.score >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                                  : gp.score >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                                }`}>{gp.score}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                  ({ colonaive: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', durmah: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', sciencehod: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', sgrenovate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' } as Record<ProjectId, string>)[gp.project] || 'bg-gray-100 text-gray-600'
                                }`}>{gp.projectLabel}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Portfolio Health */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Portfolio Health</p>
                    <div className="space-y-2">
                      {crossProjectBriefing.projectSummaries.map((proj) => (
                        <div key={proj.project} className="bg-white dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-gray-900 dark:text-white">{proj.label}</p>
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              proj.urgency_score >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                              : proj.urgency_score >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                            }`}>Urgency: {proj.urgency_score}</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-gray-600 rounded-full h-1.5 mb-2">
                            <div
                              className={`h-1.5 rounded-full ${
                                proj.urgency_score >= 70 ? 'bg-red-500' : proj.urgency_score >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${proj.urgency_score}%` }}
                            />
                          </div>
                          <div className="flex gap-3 text-[10px] text-gray-400">
                            <span>{proj.signals.length} signals</span>
                            <span>{proj.risks.length} risks</span>
                            <span>{proj.opportunities.length} opportunities</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* === CHIEF-OF-STAFF: Tasks + Roadmap + Operations === */}
        <CockpitSection>
          {/* Task Management */}
          <CockpitCard
            title="Chief-of-Staff Tasks"
            subtitle="Development task tracker"
            icon={<ListChecks size={18} />}
            status={taskStats.total > 0 ? 'active' : 'pending'}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{taskStats.inProgress}</p>
                  <p className="text-[10px] text-gray-500">In Progress</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{taskStats.completed}</p>
                  <p className="text-[10px] text-gray-500">Completed</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{taskStats.blocked}</p>
                  <p className="text-[10px] text-gray-500">Blocked</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-gray-500">
                <span>{taskStats.total} total tasks</span>
                <span>{taskStats.verified} verified</span>
              </div>
            </div>
          </CockpitCard>

          {/* Product Roadmap */}
          <CockpitCard
            title="Product Roadmap"
            subtitle={activeMilestone?.name || 'No active milestone'}
            icon={<MapIcon size={18} />}
            status={roadmapStats.inProgress > 0 ? 'active' : 'pending'}
          >
            <div className="space-y-2">
              {roadmapEntries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{entry.title}</p>
                    <p className="text-[10px] text-gray-400">{entry.targetRelease} · {entry.priority}</p>
                  </div>
                  {statusBadge(entry.status)}
                </div>
              ))}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                <span>{roadmapStats.total} features total</span>
                <span>{roadmapStats.completed} shipped</span>
              </div>
            </div>
          </CockpitCard>

          {/* Operations Status */}
          <CockpitCard
            title="Operations Status"
            subtitle={`Overall: ${opsStats.overallStatus.toUpperCase()}`}
            icon={<Activity size={18} />}
            status={opsStats.overallStatus === 'healthy' ? 'active' : 'pending'}
          >
            <div className="space-y-2">
              {opsSnapshot.systems.map((sys) => (
                <div key={sys.system} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${sys.status === 'healthy' ? 'bg-emerald-500' : sys.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-gray-900 dark:text-white">{sys.system}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{sys.status}</span>
                </div>
              ))}
              {opsStats.alertCount > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded p-2 mt-2">
                  <p className="text-[11px] text-red-700 dark:text-red-300 font-medium">{opsStats.alertCount} active alert(s)</p>
                </div>
              )}
            </div>
          </CockpitCard>
        </CockpitSection>

        {/* === CHIEF-OF-STAFF: Investors + Connected Projects === */}
        <CockpitSection columns={2}>
          {/* Investor Materials */}
          <CockpitCard
            title="Investor Materials"
            subtitle={`${investorStats.totalMaterials} materials · ${investorStats.currentValuation} valuation`}
            icon={<BarChart3 size={18} />}
            status={investorStats.totalMaterials > 0 ? 'active' : 'pending'}
          >
            <div className="space-y-2">
              {investorMaterials.slice(0, 4).map((mat) => (
                <div key={mat.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">{mat.title}</p>
                    <p className="text-[10px] text-gray-400">{mat.type}</p>
                  </div>
                  {statusBadge(mat.status)}
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2 text-center pt-2">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{investorStats.totalRaised}</p>
                  <p className="text-[10px] text-gray-500">Total Raised</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded p-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{investorStats.marketsActive}</p>
                  <p className="text-[10px] text-gray-500">Markets Cleared</p>
                </div>
              </div>
            </div>
          </CockpitCard>

          {/* Connected Projects */}
          <CockpitCard
            title="Connected Projects"
            subtitle={`${projectStats.active} active · ${projectStats.totalAgents} agents`}
            icon={<Layers size={18} />}
            status={projectStats.active > 0 ? 'active' : 'pending'}
          >
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{proj.project_name}</span>
                    {statusBadge(proj.status)}
                  </div>
                  <p className="text-[10px] text-gray-400">{proj.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-blue-500">{proj.tier.toUpperCase()}</span>
                    <span className="text-[10px] text-gray-400">{proj.active_agents.length} agents</span>
                    {proj.domain && <span className="text-[10px] text-gray-400">{proj.domain}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CockpitCard>
        </CockpitSection>

        {/* Row 1: Intelligence & Regulatory */}
        <CockpitSection>
          {/* Inbox Intelligence */}
          <CockpitCard
            title="Inbox Intelligence"
            subtitle="admin@saversmed.com — latest 10"
            icon={<Inbox size={18} />}
            status={inboxError ? 'pending' : 'active'}
          >
            {inboxLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading emails...</span>
              </div>
            ) : inboxError ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle size={24} className="text-amber-400 mb-2" />
                <p className="text-xs text-amber-600 dark:text-amber-400">{inboxError}</p>
                <button onClick={loadInbox} className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline">Retry</button>
              </div>
            ) : emails.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No emails found.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {emails.map((e) => (
                  <div
                    key={e.id}
                    className={`border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 ${
                      !e.isRead ? 'pl-2 border-l-2 border-l-blue-500' : ''
                    }`}
                  >
                    <p className={`text-xs ${e.isRead ? 'text-gray-700 dark:text-gray-300' : 'font-semibold text-gray-900 dark:text-white'} line-clamp-1`}>
                      {e.subject}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[60%]">{e.sender}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{formatDateTime(e.receivedDateTime)}</span>
                    </div>
                    {e.preview && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{e.preview}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          {/* Regulatory Status */}
          <CockpitCard
            title="Regulatory Status"
            subtitle="ColonAiQ approvals & submissions"
            icon={<Shield size={18} />}
            status="active"
            lastUpdated="March 2026"
          >
            <div className="space-y-3">
              {regulatory.map((r) => (
                <div key={r.jurisdiction} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-xs">{r.jurisdiction}</span>
                    {statusBadge(r.status.toLowerCase().includes('approved') || r.status.toLowerCase().includes('registered') ? 'active' : 'proposed')}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{r.classType}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{r.notes}</p>
                </div>
              ))}
            </div>
          </CockpitCard>

          {/* Clinical Trials */}
          <CockpitCard
            title="Clinical Trials"
            subtitle="Validation studies & partnerships"
            icon={<FlaskConical size={18} />}
            status="pending"
            lastUpdated="March 2026"
          >
            <div className="space-y-3">
              {trials.map((t) => (
                <div key={t.name} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-xs">{t.name}</span>
                    {statusBadge(t.status)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.lead} — {t.institution}</p>
                </div>
              ))}
            </div>
          </CockpitCard>
        </CockpitSection>

        {/* Row 2: CRC Intelligence (full width) */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="CRC Intelligence"
            subtitle="Latest colorectal cancer research & screening news"
            icon={<Newspaper size={18} />}
            status={crcError ? 'pending' : 'active'}
          >
            {crcLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading CRC news...</span>
              </div>
            ) : crcError ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle size={24} className="text-amber-400 mb-2" />
                <p className="text-xs text-amber-600 dark:text-amber-400">{crcError}</p>
                <button onClick={loadCRCNews} className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline">Retry</button>
              </div>
            ) : crcNews.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No CRC news available.</p>
            ) : (
              <div className="space-y-4">
                {crcNews.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                        >
                          {item.title}
                        </a>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{item.source}</span>
                          {item.published_at && (
                            <span className="text-[10px] text-gray-400">{formatDateTime(item.published_at)}</span>
                          )}
                        </div>
                        {item.summary && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{item.summary}</p>
                        )}
                      </div>
                      {item.relevance_score != null && (
                        <span className="shrink-0 inline-block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded font-medium">
                          {item.relevance_score}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded">
                        Suggested: Share on LinkedIn
                      </span>
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded">
                        Clinic bulletin
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* LinkedIn Intelligence */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="LinkedIn Intelligence"
            subtitle="AI-curated post opportunities from CRC news"
            icon={<Linkedin size={18} />}
            status={linkedInLoading ? 'pending' : linkedInPosts.length > 0 ? 'active' : 'placeholder'}
          >
            {linkedInLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading LinkedIn posts...</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {linkedInPosts.filter((p) => p.status !== 'posted').length}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Pending Posts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {linkedInPosts.filter((p) => {
                        if (p.status !== 'posted' || !p.posted_at) return false;
                        return (Date.now() - new Date(p.posted_at).getTime()) < 7 * 24 * 60 * 60 * 1000;
                      }).length}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">Posted This Week</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/linkedin-intelligence')}
                  className="px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-xs font-medium transition-colors"
                >
                  Open LinkedIn Intelligence
                </button>
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* Relationship Intelligence — CTW-COCKPIT-03A */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Relationship Intelligence"
            subtitle="LinkedIn contacts, follow-ups & relationship management"
            icon={<UserCircle size={18} />}
            status={relLoading ? 'pending' : relStats && relStats.totalContacts > 0 ? 'active' : 'placeholder'}
          >
            {relLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading relationship data...</span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{relStats?.totalContacts || 0}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Total Contacts</p>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${(relStats?.overdueFollowups || 0) > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {relStats?.overdueFollowups || 0}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Overdue</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{relStats?.upcomingFollowups || 0}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">Upcoming</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{relStats?.highValueContacts || 0}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">High-Value</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/admin/relationship-intelligence')}
                    className="px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-xs font-medium transition-colors"
                  >
                    Open Relationships
                  </button>
                </div>
                {/* Overdue contacts preview */}
                {relOverdue.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2">Overdue Follow-ups</p>
                    <div className="space-y-1.5">
                      {relOverdue.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{c.name}</span>
                          <span className="text-red-500 dark:text-red-400 text-[10px]">
                            {c.next_followup_date ? `${Math.abs(Math.ceil((new Date(c.next_followup_date).getTime() - Date.now()) / (24*60*60*1000)))}d overdue` : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Upcoming contacts preview */}
                {relUpcoming.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">Upcoming This Week</p>
                    <div className="space-y-1.5">
                      {relUpcoming.slice(0, 3).map((c) => (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <span className="text-gray-700 dark:text-gray-300 font-medium">{c.name}</span>
                          <span className="text-amber-500 dark:text-amber-400 text-[10px]">
                            {c.next_followup_date ? new Date(c.next_followup_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' }) : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* CRC Research Radar Widget */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="CRC Research Radar"
            subtitle="Top intelligence signals this week"
            icon={<Radar size={18} />}
            status={radarLoading ? 'pending' : radarSignals.length > 0 ? 'active' : 'placeholder'}
          >
            {radarLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading radar signals...</span>
              </div>
            ) : radarSignals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Radar size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-xs">No radar signals detected yet.</p>
              </div>
            ) : (
              <div>
                <div className="space-y-3 mb-4">
                  {radarSignals.slice(0, 3).map((signal) => {
                    const level = classifySignal(signal.radar_score);
                    const colorClass = getSignalColor(level);
                    return (
                      <div key={signal.id} className="flex items-start justify-between gap-3 border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                        <div className="flex-1">
                          <a
                            href={signal.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
                          >
                            {signal.headline || signal.title}
                          </a>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                            {signal.journal || signal.source} {signal.publication_date ? `— ${new Date(signal.publication_date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}` : ''}
                          </p>
                        </div>
                        <span className={`shrink-0 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${colorClass}`}>
                          {signal.radar_score} — {getSignalLabel(level)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => navigate('/admin/crc-radar')}
                  className="px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-xs font-medium transition-colors"
                >
                  Open Research Radar
                </button>
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* Row: Competitive Intelligence */}
        <CockpitSection>
          {/* Early Warning Signals */}
          <CockpitCard
            title="Early Warning Signals"
            subtitle="Pre-media research detections"
            icon={<Zap size={18} />}
            status={compLoading ? 'pending' : earlyWarnings.length > 0 ? 'active' : 'placeholder'}
          >
            {compLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading signals...</span>
              </div>
            ) : earlyWarnings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Zap size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs">No early warning signals detected yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {earlyWarnings.slice(0, 4).map((ew) => (
                  <div key={ew.id} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <a href={ew.source_link || '#'} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 line-clamp-2 flex-1">
                        {ew.title}
                      </a>
                      <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${ew.confidence_score >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                        {ew.confidence_score}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                      <span>{ew.source}</span>
                      {!ew.in_media && <span className="text-red-500 font-medium">NOT IN MEDIA</span>}
                    </div>
                    {ew.recommended_action && (
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 italic">{ew.recommended_action}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          {/* Competitor Activity */}
          <CockpitCard
            title="Competitor Activity"
            subtitle="Latest competitive signals"
            icon={<Target size={18} />}
            status={compLoading ? 'pending' : compSignals.length > 0 ? 'active' : 'placeholder'}
          >
            {compLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading...</span>
              </div>
            ) : compSignals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Target size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs">No competitor signals yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {compSignals.slice(0, 4).map((cs) => (
                  <div key={cs.id} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">{cs.title}</p>
                      <span className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {cs.company_name}
                      </span>
                    </div>
                    {cs.description && (
                      <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{cs.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          {/* Technology Trends */}
          <CockpitCard
            title="Technology Trends"
            subtitle="Detected from research signals"
            icon={<Globe size={18} />}
            status={compLoading ? 'pending' : techTrends.length > 0 ? 'active' : 'placeholder'}
          >
            {compLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading...</span>
              </div>
            ) : techTrends.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Globe size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 text-xs">No technology trends detected yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {techTrends.slice(0, 5).map((tt) => (
                  <div key={tt.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{tt.trend_name}</p>
                      <p className="text-[10px] text-gray-400">{tt.evidence_count} signal(s)</p>
                    </div>
                    <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(tt.trend_score, 100)}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-gray-500 ml-2 w-8 text-right">{tt.trend_score}%</span>
                  </div>
                ))}
                <button
                  onClick={() => navigate('/technology-landscape')}
                  className="px-4 py-2 rounded-lg bg-[#0A385A] hover:bg-[#0A385A]/90 text-white text-xs font-medium transition-colors mt-2"
                >
                  View Technology Landscape
                </button>
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* Row 3: Marketing, Investors, Memory */}
        <CockpitSection>
          {/* Marketing Materials */}
          <CockpitCard
            title="Marketing Materials"
            subtitle="Brochures & collateral"
            icon={<FileText size={18} />}
            status="pending"
            lastUpdated="March 2026"
          >
            {brochureList.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-xs text-center py-4">No brochures created yet.</p>
            ) : (
              <div className="space-y-2">
                {brochureList.map((b) => (
                  <div key={b.filename} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{b.title}</p>
                      <p className="text-[11px] text-gray-400">{b.market}</p>
                    </div>
                    {statusBadge(b.status)}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          {/* Investor Intelligence */}
          <CockpitCard
            title="Investor Intelligence"
            subtitle="Funding history & valuations"
            icon={<TrendingUp size={18} />}
            status="active"
            lastUpdated="March 2026"
          >
            <div className="space-y-4">
              {investors.map((round) => (
                <div key={round.phase} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-xs text-gray-900 dark:text-white mb-1">{round.phase}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                    <span>Valuation: <strong className="text-gray-700 dark:text-gray-300">{round.valuation}</strong></span>
                    <span>Raised: <strong className="text-gray-700 dark:text-gray-300">{round.totalRaised}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {round.investors.map((inv) => (
                      <span
                        key={inv.name}
                        className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded"
                      >
                        {inv.name}{inv.amount ? ` (${inv.amount})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CockpitCard>

          {/* Project Memory */}
          <CockpitCard
            title="Project Memory"
            subtitle="Window Closure Records"
            icon={<Brain size={18} />}
            status={memoryItems.length > 0 ? 'active' : 'pending'}
          >
            {memoryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Brain size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-xs">No Window Closure Records yet.</p>
                <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-1">Records will appear here after dev sessions.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {memoryItems.map((m) => (
                  <div key={m.filename} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{m.filename}</p>
                      <p className="text-[11px] text-gray-400">{m.summary}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{m.date}</span>
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* Row 3: Repository Activity (full width) */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Repository Activity"
            subtitle="GitHub commits, PRs & deployments"
            icon={<GitBranch size={18} />}
            status="placeholder"
          >
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <GitBranch size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-400 dark:text-gray-500 text-xs">{repo.message}</p>
            </div>
          </CockpitCard>
        </CockpitSection>
      </div>
    </div>
  );
};

export default CEOCockpit;
