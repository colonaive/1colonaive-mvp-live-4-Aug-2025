import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Target, RefreshCw, Zap, UserCircle, Globe,
  Check, X, CheckCircle2, Repeat,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateFounderBriefing, type FounderBriefing } from '@/lib/founderBriefing';
import { generateCrossProjectBriefing, type CrossProjectBriefing, type ProjectId } from '@/lib/projectSignals';
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
import { getRecurringEvents, type CEOEvent } from '@/lib/eventConsolidationEngine';

export default function FounderIntelligencePage() {
  const navigate = useNavigate();
  const [founderBriefing, setFounderBriefing] = useState<FounderBriefing | null>(null);
  const [founderLoading, setFounderLoading] = useState(true);
  const [trackedActions, setTrackedActions] = useState<Map<number, ActionHistoryRecord>>(new Map());
  const [actionUpdating, setActionUpdating] = useState<string | null>(null);
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null);
  const [crossProjectBriefing, setCrossProjectBriefing] = useState<CrossProjectBriefing | null>(null);
  const [recurringEvents, setRecurringEvents] = useState<CEOEvent[]>([]);

  useEffect(() => {
    (async () => {
      setFounderLoading(true);
      try {
        const briefingData = await generateFounderBriefing();
        setFounderBriefing(briefingData);
        const tracked = new Map<number, ActionHistoryRecord>();
        for (let i = 0; i < briefingData.recommendedActions.length; i++) {
          const rec = briefingData.recommendedActions[i];
          const source = briefingData.topPriorities[i]?.source || 'strategy';
          const record = await trackAction(rec.title, source as ActionHistoryRecord['source'], rec.priority);
          if (record) tracked.set(i, record);
        }
        setTrackedActions(tracked);
      } catch { /* silent */ }
      finally { setFounderLoading(false); }
    })();
    getFounderProfile().then(setFounderProfile).catch(() => {});
    try { setCrossProjectBriefing(generateCrossProjectBriefing()); } catch { /* silent */ }
    getRecurringEvents().then(setRecurringEvents).catch(() => {});
  }, []);

  const handleAcceptAction = async (index: number) => {
    const record = trackedActions.get(index);
    if (!record) return;
    setActionUpdating(record.id);
    const ok = await markActionAccepted(record.id);
    if (ok) setTrackedActions((prev) => { const next = new Map(prev); next.set(index, { ...record, status: 'accepted' }); return next; });
    setActionUpdating(null);
  };
  const handleIgnoreAction = async (index: number) => {
    const record = trackedActions.get(index);
    if (!record) return;
    setActionUpdating(record.id);
    const ok = await markActionIgnored(record.id);
    if (ok) setTrackedActions((prev) => { const next = new Map(prev); next.set(index, { ...record, status: 'ignored' }); return next; });
    setActionUpdating(null);
  };
  const handleCompleteAction = async (index: number) => {
    const record = trackedActions.get(index);
    if (!record) return;
    setActionUpdating(record.id);
    const ok = await markActionCompleted(record.id, 'success');
    if (ok) {
      setTrackedActions((prev) => { const next = new Map(prev); next.set(index, { ...record, status: 'completed', outcome: 'success' }); return next; });
      getFounderProfile().then(setFounderProfile).catch(() => {});
    }
    setActionUpdating(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/admin/ceo-cockpit')} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Founder Intelligence</h1>
            <p className="text-sm text-white/60">Action scoring, priorities & recommended next moves</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">
        {founderLoading ? (
          <div className="flex items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <RefreshCw size={18} className="animate-spin text-gray-400" />
            <span className="ml-2 text-sm text-gray-400">Analysing intelligence signals...</span>
          </div>
        ) : !founderBriefing ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-center">
            <Target size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">No intelligence signals available.</p>
          </div>
        ) : (
          <>
            {/* Guardrail Banner */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex-wrap text-[11px]">
              <span className="font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Guardrail: Strict Mode</span>
              <span className="text-emerald-600 dark:text-emerald-400">|</span>
              <span className="text-emerald-600 dark:text-emerald-400">Verified sources only</span>
              <span className="text-emerald-600 dark:text-emerald-400">|</span>
              <span className="text-gray-500 dark:text-gray-400">
                <span title="HIGH">●</span> HIGH &nbsp;<span title="MEDIUM">◐</span> MED &nbsp;<span title="LOW">○</span> LOW
              </span>
              <span className="text-emerald-600 dark:text-emerald-400">|</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium">
                Founder Verified Facts Active
              </span>
            </div>

            {/* Executive Summary */}
            <div className="bg-gradient-to-r from-[#0A385A]/5 to-[#0F766E]/5 dark:from-[#0A385A]/20 dark:to-[#0F766E]/20 rounded-xl p-5">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Executive Summary</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{founderBriefing.executiveSummary}</p>
            </div>

            {/* Priorities + Risks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Top Priorities</p>
                {founderBriefing.topPriorities.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No priority actions identified.</p>
                ) : (
                  <div className="space-y-3">
                    {founderBriefing.topPriorities.map((action: ScoredAction) => (
                      <div key={action.id} className="border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{action.title}</p>
                            <p className="text-[10px] text-gray-400 mt-1 capitalize">{action.source.replace('_', ' ')}</p>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            action.scores.priority >= 70 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : action.scores.priority >= 50 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}>{action.scores.priority}/100</span>
                        </div>
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
              </section>

              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Critical Risks</p>
                {founderBriefing.criticalRisks.length === 0 ? (
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">No critical risks detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {founderBriefing.criticalRisks.map((risk) => (
                      <div key={risk.id} className="border border-gray-100 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">{risk.title}</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            risk.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                            : risk.severity === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                          }`}>{risk.severity}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{risk.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Recommended Next Moves with Decision Loop */}
            {founderBriefing.recommendedActions.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Recommended Next Moves</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {founderBriefing.recommendedActions.slice(0, 3).map((rec, i) => {
                    const tracked = trackedActions.get(i);
                    const status = tracked?.status || 'suggested';
                    const isUpdating = tracked && actionUpdating === tracked.id;
                    return (
                      <div key={i} className={`border rounded-lg p-4 ${
                        status === 'accepted' ? 'border-emerald-300 dark:border-emerald-600'
                        : status === 'completed' ? 'border-blue-300 dark:border-blue-600'
                        : status === 'ignored' ? 'border-gray-200 dark:border-gray-700 opacity-60'
                        : 'border-gray-200 dark:border-gray-600'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={12} className="text-amber-500 flex-shrink-0" />
                          <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{rec.title}</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{rec.rationale}</p>
                        <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
                          <span>Priority: {rec.priority}</span>
                          <span className={`px-1.5 py-0.5 rounded ${
                            rec.effort === 'low' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300'
                            : rec.effort === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300'
                          }`}>{rec.effort} effort</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-gray-100 dark:border-gray-600">
                          {status === 'suggested' && (
                            <>
                              <button onClick={() => handleAcceptAction(i)} disabled={!!isUpdating} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 transition-colors">
                                <Check size={10} /> Accept
                              </button>
                              <button onClick={() => handleIgnoreAction(i)} disabled={!!isUpdating} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-400 transition-colors">
                                <X size={10} /> Ignore
                              </button>
                            </>
                          )}
                          {status === 'accepted' && (
                            <>
                              <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"><Check size={10} /> Accepted</span>
                              <button onClick={() => handleCompleteAction(i)} disabled={!!isUpdating} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 transition-colors ml-auto">
                                <CheckCircle2 size={10} /> Complete
                              </button>
                            </>
                          )}
                          {status === 'completed' && <span className="flex items-center gap-1 text-[10px] font-medium text-blue-600 dark:text-blue-400"><CheckCircle2 size={10} /> Completed</span>}
                          {status === 'ignored' && <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400"><X size={10} /> Ignored</span>}
                          {isUpdating && <RefreshCw size={10} className="animate-spin text-gray-400 ml-auto" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Founder Behaviour Profile */}
            {founderProfile && founderProfile.totalActions > 0 && (
              <section className="bg-gradient-to-r from-[#0A385A]/5 to-purple-500/5 dark:from-[#0A385A]/20 dark:to-purple-500/20 rounded-xl p-5">
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
              </section>
            )}

            {/* Cross-Project Intelligence */}
            {crossProjectBriefing && (
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Globe size={16} className="text-indigo-600 dark:text-indigo-400" />
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Global Intelligence</h2>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/30 mb-4">
                  <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300 uppercase tracking-wide mb-1">Top Project Right Now</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{crossProjectBriefing.topProjectLabel}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{crossProjectBriefing.topProjectReason}</p>
                </div>

                <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-lg p-3 border border-amber-100 dark:border-amber-800/20 mb-4">
                  <div className="flex items-start gap-2">
                    <Zap size={14} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{crossProjectBriefing.focusShiftAdvice}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Top Cross-Project Actions</p>
                    <div className="space-y-2">
                      {crossProjectBriefing.globalPriorities.map((gp) => (
                        <div key={`gp-${gp.rank}`} className="flex items-center justify-between text-xs border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-600 text-[10px] font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">{gp.rank}</span>
                            <span className="text-gray-900 dark:text-white truncate">{gp.title}</span>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ml-2 flex-shrink-0 ${
                            ({ colonaive: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300', durmah: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', sciencehod: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', sgrenovate: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' } as Record<ProjectId, string>)[gp.project] || 'bg-gray-100 text-gray-600'
                          }`}>{gp.projectLabel}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Portfolio Health</p>
                    <div className="space-y-2">
                      {crossProjectBriefing.projectSummaries.map((proj) => (
                        <div key={proj.project} className="flex items-center justify-between text-xs">
                          <span className="text-gray-900 dark:text-white">{proj.label}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${proj.urgency_score >= 70 ? 'bg-red-500' : proj.urgency_score >= 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${proj.urgency_score}%` }} />
                            </div>
                            <span className="text-[10px] text-gray-400 w-6 text-right">{proj.urgency_score}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Recurring Issues */}
            {recurringEvents.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Repeat size={14} className="text-purple-500" />
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Recurring Issues</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 font-medium">
                    {recurringEvents.length} pattern{recurringEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-3">
                  {recurringEvents.map((evt) => (
                    <div key={evt.id} className="flex items-start gap-3 border border-purple-100 dark:border-purple-800/30 rounded-lg p-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">{evt.event_name}</p>
                        {evt.next_action && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                            <span className="font-medium text-gray-600 dark:text-gray-300">Next:</span> {evt.next_action}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                          <span className="capitalize">{evt.event_type}</span>
                          <span>&middot;</span>
                          <span>Occurred {evt.recurrence_count} time{evt.recurrence_count !== 1 ? 's' : ''}</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex-shrink-0">
                        <Repeat size={10} /> Recurring
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Signal count */}
            <div className="text-center text-[10px] text-gray-400">
              {founderBriefing.signalCount} signals analysed &middot; Intelligence Guardrails Active
            </div>
          </>
        )}
      </div>
    </div>
  );
}
