/**
 * Proactive Intelligence Engine — CTW-COCKPIT-02F
 *
 * Detects overdue actions, ignored high-priority items, stale opportunities,
 * and unaddressed risks — then generates founder nudges with suppression logic.
 */

import { supabase } from '@/supabase';
import { getGlobalPriorities, type GlobalPriority } from '@/lib/projectSignals';
import type { ActionHistoryRecord } from '@/lib/actionFeedback';
import { getOverdueFollowups, getUpcomingFollowups, getHighValueContacts, type LinkedInContact } from '@/lib/linkedinEngine';

/* ── Types ── */

export type NudgeType = 'overdue' | 'ignored' | 'stale' | 'risk' | 'focus' | 'linkedin_followup' | 'linkedin_overdue' | 'linkedin_warm';

export interface ProactiveNudge {
  id: string;
  type: NudgeType;
  message: string;
  severity: 'urgent' | 'attention' | 'info';
  recommended_action: string;
  source_id?: string;
  created_at: string;
}

export interface TodayFocus {
  generatedAt: string;
  topPriorities: GlobalPriority[];
  nudges: ProactiveNudge[];
  upcomingCount: number;
}

/* ── Configuration ── */

const OVERDUE_THRESHOLD_HOURS = 72; // 3 days
const STALE_THRESHOLD_HOURS = 72;   // 3 days
const HIGH_PRIORITY_THRESHOLD = 70;
const MAX_NUDGES = 5;

/* ── Suppression ── */

const suppressedNudges = new Map<string, number>(); // nudge id → timestamp
const SUPPRESSION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function isNudgeSuppressed(nudgeId: string): boolean {
  const suppressedAt = suppressedNudges.get(nudgeId);
  if (!suppressedAt) return false;
  if (Date.now() - suppressedAt > SUPPRESSION_WINDOW_MS) {
    suppressedNudges.delete(nudgeId);
    return false;
  }
  return true;
}

function markNudgeShown(nudgeId: string): void {
  suppressedNudges.set(nudgeId, Date.now());
}

/** Dismiss a nudge (suppress for 24h) */
export function dismissNudge(nudgeId: string): void {
  suppressedNudges.set(nudgeId, Date.now());
}

/* ── Nudge Detection ── */

/**
 * Detect overdue actions: accepted but not completed after threshold.
 */
function detectOverdueActions(history: ActionHistoryRecord[]): ProactiveNudge[] {
  const nudges: ProactiveNudge[] = [];
  const now = Date.now();
  const thresholdMs = OVERDUE_THRESHOLD_HOURS * 60 * 60 * 1000;

  for (const record of history) {
    if (record.status !== 'accepted') continue;

    const age = now - new Date(record.updated_at || record.created_at).getTime();
    if (age < thresholdMs) continue;

    const days = Math.floor(age / (24 * 60 * 60 * 1000));
    const nudgeId = `overdue-${record.id}`;

    if (isNudgeSuppressed(nudgeId)) continue;

    nudges.push({
      id: nudgeId,
      type: 'overdue',
      message: `"${record.action_text}" was accepted ${days} day${days > 1 ? 's' : ''} ago but not completed.`,
      severity: days > 7 ? 'urgent' : 'attention',
      recommended_action: 'Complete or reassess this action.',
      source_id: record.id,
      created_at: new Date().toISOString(),
    });
  }

  return nudges;
}

/**
 * Detect ignored high-priority actions.
 */
function detectIgnoredHighPriority(history: ActionHistoryRecord[]): ProactiveNudge[] {
  const nudges: ProactiveNudge[] = [];

  for (const record of history) {
    if (record.status !== 'ignored') continue;
    if (record.priority_score < HIGH_PRIORITY_THRESHOLD) continue;

    const nudgeId = `ignored-${record.id}`;
    if (isNudgeSuppressed(nudgeId)) continue;

    nudges.push({
      id: nudgeId,
      type: 'ignored',
      message: `High-priority action "${record.action_text}" (score: ${record.priority_score}) was ignored.`,
      severity: record.priority_score >= 85 ? 'urgent' : 'attention',
      recommended_action: 'Reconsider this action or delegate it.',
      source_id: record.id,
      created_at: new Date().toISOString(),
    });
  }

  return nudges;
}

/**
 * Detect stale signals: suggested actions with no activity for >3 days.
 */
function detectStaleSignals(history: ActionHistoryRecord[]): ProactiveNudge[] {
  const nudges: ProactiveNudge[] = [];
  const now = Date.now();
  const thresholdMs = STALE_THRESHOLD_HOURS * 60 * 60 * 1000;

  for (const record of history) {
    if (record.status !== 'suggested') continue;
    if (record.priority_score < 50) continue; // skip low-priority

    const age = now - new Date(record.created_at).getTime();
    if (age < thresholdMs) continue;

    const days = Math.floor(age / (24 * 60 * 60 * 1000));
    const nudgeId = `stale-${record.id}`;

    if (isNudgeSuppressed(nudgeId)) continue;

    nudges.push({
      id: nudgeId,
      type: 'stale',
      message: `"${record.action_text}" has been pending for ${days} day${days > 1 ? 's' : ''} with no action.`,
      severity: 'info',
      recommended_action: 'Accept, ignore, or review this signal.',
      source_id: record.id,
      created_at: new Date().toISOString(),
    });
  }

  return nudges;
}

/**
 * Detect unaddressed cross-project risks from 02E.
 */
function detectUnaddressedRisks(): ProactiveNudge[] {
  const nudges: ProactiveNudge[] = [];

  try {
    const priorities = getGlobalPriorities(10);

    // Flag top priorities with score >= 70 as risk nudges
    for (const gp of priorities) {
      if (gp.score < HIGH_PRIORITY_THRESHOLD) continue;

      const nudgeId = `risk-${gp.project}-${gp.title.slice(0, 20).replace(/\s/g, '-')}`;
      if (isNudgeSuppressed(nudgeId)) continue;

      nudges.push({
        id: nudgeId,
        type: 'risk',
        message: `${gp.projectLabel}: "${gp.title}" (score: ${gp.score}) needs attention.`,
        severity: gp.score >= 85 ? 'urgent' : 'attention',
        recommended_action: gp.reason.slice(0, 150),
        created_at: new Date().toISOString(),
      });
    }
  } catch {
    // silent fail — cross-project is supplementary
  }

  return nudges;
}

/* ── LinkedIn Relationship Nudges — CTW-COCKPIT-03A ── */

async function detectLinkedInOverdueFollowups(): Promise<ProactiveNudge[]> {
  const nudges: ProactiveNudge[] = [];
  try {
    const overdue = await getOverdueFollowups();
    for (const contact of overdue) {
      const nudgeId = `linkedin-overdue-${contact.id}`;
      if (isNudgeSuppressed(nudgeId)) continue;

      const daysOverdue = contact.next_followup_date
        ? Math.floor((Date.now() - new Date(contact.next_followup_date).getTime()) / (24 * 60 * 60 * 1000))
        : 0;

      nudges.push({
        id: nudgeId,
        type: 'linkedin_overdue',
        message: `Follow-up with ${contact.name}${contact.organisation ? ` (${contact.organisation})` : ''} is ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue.`,
        severity: daysOverdue > 7 ? 'urgent' : 'attention',
        recommended_action: `Send a follow-up message to ${contact.name}.`,
        source_id: contact.id,
        created_at: new Date().toISOString(),
      });
    }
  } catch {
    // silent — supplementary
  }
  return nudges;
}

async function detectLinkedInUpcomingFollowups(): Promise<ProactiveNudge[]> {
  const nudges: ProactiveNudge[] = [];
  try {
    const upcoming = await getUpcomingFollowups(3); // next 3 days
    for (const contact of upcoming) {
      const nudgeId = `linkedin-followup-${contact.id}`;
      if (isNudgeSuppressed(nudgeId)) continue;

      nudges.push({
        id: nudgeId,
        type: 'linkedin_followup',
        message: `Follow-up due with ${contact.name}${contact.organisation ? ` (${contact.organisation})` : ''}.`,
        severity: 'info',
        recommended_action: `Prepare and send follow-up to ${contact.name}.`,
        source_id: contact.id,
        created_at: new Date().toISOString(),
      });
    }
  } catch {
    // silent
  }
  return nudges;
}

async function detectWarmLeadsNotProgressed(): Promise<ProactiveNudge[]> {
  const nudges: ProactiveNudge[] = [];
  try {
    const highValue = await getHighValueContacts();
    const staleThreshold = 14 * 24 * 60 * 60 * 1000; // 14 days

    for (const contact of highValue) {
      if (!contact.last_contact_date) continue;
      const age = Date.now() - new Date(contact.last_contact_date).getTime();
      if (age < staleThreshold) continue;

      const nudgeId = `linkedin-warm-${contact.id}`;
      if (isNudgeSuppressed(nudgeId)) continue;

      const days = Math.floor(age / (24 * 60 * 60 * 1000));
      nudges.push({
        id: nudgeId,
        type: 'linkedin_warm',
        message: `${contact.status === 'advisor' ? 'Advisor' : 'Warm lead'} ${contact.name} has not been contacted in ${days} days.`,
        severity: days > 30 ? 'urgent' : 'attention',
        recommended_action: `Re-engage ${contact.name} to maintain relationship.`,
        source_id: contact.id,
        created_at: new Date().toISOString(),
      });
    }
  } catch {
    // silent
  }
  return nudges;
}

/* ── Main Engine ── */

/**
 * Generate all proactive nudges from action history and cross-project signals.
 */
export async function generateProactiveSignals(): Promise<ProactiveNudge[]> {
  // Fetch recent action history
  let history: ActionHistoryRecord[] = [];
  try {
    const { data, error } = await supabase
      .from('ceo_action_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (!error && data) {
      history = data as ActionHistoryRecord[];
    }
  } catch {
    // silent fail — will still generate risk nudges
  }

  // LinkedIn relationship nudges (async)
  let linkedInNudges: ProactiveNudge[] = [];
  try {
    const [liOverdue, liUpcoming, liWarm] = await Promise.all([
      detectLinkedInOverdueFollowups(),
      detectLinkedInUpcomingFollowups(),
      detectWarmLeadsNotProgressed(),
    ]);
    linkedInNudges = [...liOverdue, ...liUpcoming, ...liWarm];
  } catch {
    // silent — supplementary
  }

  // Collect all nudge types
  const allNudges: ProactiveNudge[] = [
    ...detectOverdueActions(history),
    ...detectIgnoredHighPriority(history),
    ...detectStaleSignals(history),
    ...detectUnaddressedRisks(),
    ...linkedInNudges,
  ];

  // Sort: urgent first, then attention, then info
  const severityOrder = { urgent: 0, attention: 1, info: 2 };
  allNudges.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  // Limit to MAX_NUDGES
  const finalNudges = allNudges.slice(0, MAX_NUDGES);

  // Mark shown nudges for suppression
  for (const nudge of finalNudges) {
    markNudgeShown(nudge.id);
  }

  return finalNudges;
}

/**
 * Get today's focus: top priorities + nudges + upcoming count.
 */
export async function getTodayFocus(): Promise<TodayFocus> {
  const [nudges, topPriorities] = await Promise.all([
    generateProactiveSignals(),
    Promise.resolve(getGlobalPriorities(3)),
  ]);

  // Count upcoming actions (accepted but not completed, created in last 48h)
  let upcomingCount = 0;
  try {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { count, error } = await supabase
      .from('ceo_action_history')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'accepted')
      .gte('created_at', twoDaysAgo);

    if (!error && count !== null) {
      upcomingCount = count;
    }
  } catch {
    // silent
  }

  return {
    generatedAt: new Date().toISOString(),
    topPriorities,
    nudges,
    upcomingCount,
  };
}
