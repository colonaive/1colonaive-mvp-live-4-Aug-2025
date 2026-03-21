import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Newspaper,
  Users,
  UserPlus,
  Briefcase,
  FileText,
  ArrowLeft,
  Brain,
  ListChecks,
  ClipboardList,
  Inbox,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import ActionCenterChat from '@/components/cockpit/ActionCenterChat';
import { chatEngine } from '@/chief-of-staff/action-center/chatEngine';
import { promptGenerator } from '@/chief-of-staff/action-center/promptGenerator';
import { emailComposer } from '@/chief-of-staff/action-center/emailComposer';
import { decisionMemoryEngine } from '@/chief-of-staff/decision-memory/decisionMemoryEngine';
import { decisionPatterns, type DecisionPattern } from '@/chief-of-staff/decision-memory/decisionPatterns';
import { getTopEvents, updateEventStatus, resolveEvent, type CEOEvent } from '@/lib/eventConsolidationEngine';
import { Lightbulb } from 'lucide-react';

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    sent: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
};

const quickActions = [
  { label: 'Manage News Feed', path: '/admin/news', icon: Newspaper, description: 'Review, approve and manage CRC news articles' },
  { label: 'Partner Specialists', path: '/admin/partner-specialists', icon: Users, description: 'View and manage partner specialist profiles' },
  { label: 'Add New Specialist', path: '/admin/partner-specialists/new', icon: UserPlus, description: 'Onboard a new partner specialist' },
  { label: 'CSR Partners', path: '/admin/csr-partners', icon: Briefcase, description: 'Manage corporate social responsibility partners' },
  { label: 'Add CSR Partner', path: '/admin/csr/new', icon: FileText, description: 'Register a new CSR partner organisation' },
];

export default function WorkRoom() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('event_id');
  const predictionType = searchParams.get('prediction_type');
  const predictionName = searchParams.get('prediction_name');

  const [, setWidgetTick] = useState(0);
  const [memoryPatterns, setMemoryPatterns] = useState<DecisionPattern[]>(() => decisionPatterns.getTopPatterns(5));
  const [memoryStats, setMemoryStats] = useState(() => decisionMemoryEngine.getStats());
  const [activeEvent, setActiveEvent] = useState<CEOEvent | null>(null);

  const [resolving, setResolving] = useState(false);

  // Load event context if event_id is present — transition to in_progress
  useEffect(() => {
    if (!eventId) return;
    getTopEvents(10).then(async (events) => {
      const found = events.find((e) => e.id === eventId);
      if (found) {
        setActiveEvent(found);
        // Auto-transition to in_progress when opening Work Room
        if (found.status === 'open') {
          await updateEventStatus(found.id, 'in_progress').catch(() => {});
          setActiveEvent({ ...found, status: 'in_progress' });
        }
      }
    }).catch(() => {});
  }, [eventId]);

  const handleResolveEvent = async () => {
    if (!activeEvent) return;
    setResolving(true);
    await resolveEvent(activeEvent.id).catch(() => {});
    setActiveEvent({ ...activeEvent, status: 'resolved', resolved_at: new Date().toISOString() });
    setResolving(false);
  };

  // Ensure decision memory is loaded
  React.useEffect(() => {
    decisionMemoryEngine.ensureLoaded().then(() => {
      setMemoryPatterns(decisionPatterns.getTopPatterns(5));
      setMemoryStats(decisionMemoryEngine.getStats());
    }).catch(() => {});
  }, []);

  const handleActionCenterUpdate = () => {
    setWidgetTick((t) => t + 1);
    setMemoryPatterns(decisionPatterns.getTopPatterns(5));
    setMemoryStats(decisionMemoryEngine.getStats());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="w-6 h-6 text-white/80" />
            <div>
              <h1 className="text-xl font-bold text-white">Work Room</h1>
              <p className="text-sm text-white/60">Execution layer — AI tools, drafts & operations</p>
            </div>
          </div>
          <Link
            to="/admin/ceo-cockpit"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/90 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            CEO Cockpit
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* === EVENT CONTEXT BANNER (if linked from cockpit) === */}
        {activeEvent && (
          <section className="bg-gradient-to-r from-[#0A385A]/5 to-[#0F766E]/5 dark:from-[#0A385A]/20 dark:to-[#0F766E]/20 rounded-xl border border-[#0F766E]/20 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className={
                activeEvent.risk_level === 'critical' ? 'text-red-500' :
                activeEvent.risk_level === 'high' ? 'text-amber-500' :
                'text-[#0F766E]'
              } />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{activeEvent.event_name}</p>
                {activeEvent.next_action && (
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-medium">Next:</span> {activeEvent.next_action}
                  </p>
                )}
                {activeEvent.risk_summary && activeEvent.risk_summary !== 'No identified risks' && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                    <span className="font-medium">Risk:</span> {activeEvent.risk_summary}
                  </p>
                )}
                <p className="text-[10px] text-gray-400 mt-1">{activeEvent.summary}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                  activeEvent.risk_level === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                  activeEvent.risk_level === 'high' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                  'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {activeEvent.risk_level}
                </span>
                {activeEvent.status === 'resolved' ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={12} /> Resolved
                  </span>
                ) : (
                  <button
                    onClick={handleResolveEvent}
                    disabled={resolving}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50 transition-colors"
                  >
                    {resolving ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* === PREDICTION CONTEXT BANNER (if linked from predicted risk) === */}
        {predictionName && !activeEvent && (
          <section className="bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl border border-purple-200/50 dark:border-purple-800/30 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb size={18} className="text-purple-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Predicted: {predictionName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  <span className="font-medium">Objective:</span> Prepare an action plan for this predicted event based on recurring patterns.
                </p>
                {predictionType && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Category: {predictionType.charAt(0).toUpperCase() + predictionType.slice(1)}
                  </p>
                )}
              </div>
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex-shrink-0">
                Predicted
              </span>
            </div>
          </section>
        )}

        {/* === ASK CHIEF OF STAFF (AI Chat) === */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
            Ask Chief of Staff
          </h2>
          <ActionCenterChat onAction={handleActionCenterUpdate} />
        </section>

        {/* === AI Tools Dashboard — 3-column grid === */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
            AI Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Recent Chats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ListChecks size={14} className="text-[#0F766E]" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Recent Chats</p>
                <span className="text-[10px] text-gray-400 ml-auto">{chatEngine.getMessageCount()} msgs</span>
              </div>
              {chatEngine.getMessages().length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-3">No conversations yet.</p>
              ) : (
                <div className="space-y-1.5 max-h-28 overflow-y-auto">
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
            </div>

            {/* Generated Prompts */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList size={14} className="text-[#0F766E]" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Generated Prompts</p>
                <span className="text-[10px] text-gray-400 ml-auto">{promptGenerator.getHistory().length}</span>
              </div>
              {promptGenerator.getHistory().length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-3">No prompts generated yet.</p>
              ) : (
                <div className="space-y-2">
                  {promptGenerator.getRecent(3).map((p) => (
                    <div key={p.id} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{p.title}</p>
                      <p className="text-[10px] text-gray-400">{p.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Draft Emails */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Inbox size={14} className="text-[#0F766E]" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">Draft Emails</p>
                <span className="text-[10px] text-gray-400 ml-auto">{emailComposer.getStats().total} total</span>
              </div>
              {emailComposer.getAllDrafts().length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-3">No drafts. Use Chief of Staff above.</p>
              ) : (
                <div className="space-y-2">
                  {emailComposer.getPendingDrafts().slice(0, 3).map((d) => (
                    <div key={d.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 dark:text-white truncate">{d.subject}</p>
                        <p className="text-[10px] text-gray-400">{d.to || '(no recipient)'}</p>
                      </div>
                      {statusBadge(d.status)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* === Decision Memory === */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-[#0F766E]" />
            <p className="text-xs font-semibold text-gray-900 dark:text-white">Decision Memory</p>
            <span className="text-[10px] text-gray-400 ml-auto">{memoryStats.totalMemories} patterns</span>
          </div>
          {memoryStats.totalMemories === 0 ? (
            <p className="text-gray-400 text-xs text-center py-3">No patterns yet. Patterns emerge as you use AI tools.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{memoryStats.topAction || '—'}</p>
                  <p className="text-[10px] text-gray-500">Top Action</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-teal-600 dark:text-teal-400">{memoryStats.topEntity || '—'}</p>
                  <p className="text-[10px] text-gray-500">Top Contact</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                  <p className="text-sm font-bold text-sky-600 dark:text-sky-400">{memoryStats.avgConfidence}%</p>
                  <p className="text-[10px] text-gray-500">Avg Confidence</p>
                </div>
              </div>
              {memoryPatterns.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">Active Patterns</p>
                  {memoryPatterns.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 dark:text-gray-300 truncate">{p.label}</span>
                      <span className="text-gray-400 ml-2 shrink-0">{p.frequency}x &middot; {p.confidence}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* === Quick Actions === */}
        <section>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="group flex items-start gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[#0F766E]/30 hover:shadow-md transition-all"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#0A385A]/10 dark:bg-[#0A385A]/30 flex items-center justify-center group-hover:bg-[#0A385A]/20 transition-colors">
                  <action.icon className="w-4 h-4 text-[#0A385A] dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-xs font-medium text-gray-900 dark:text-white group-hover:text-[#0F766E] transition-colors">{action.label}</h3>
                  <p className="text-[10px] text-gray-500 mt-0.5">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
