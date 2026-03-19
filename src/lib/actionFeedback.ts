/**
 * Action Feedback & Decision Loop Engine — CTW-COCKPIT-02D
 *
 * Tracks action lifecycle (suggested → accepted/ignored → completed),
 * learns from founder behaviour to adjust future priority scores,
 * and exposes a founder behaviour profile.
 */

import { supabase } from '@/supabase';

/* ── Types ── */

export type ActionSource = 'radar' | 'early_warning' | 'strategy' | 'email' | 'manual' | 'linkedin' | 'task';
export type ActionStatus = 'suggested' | 'accepted' | 'ignored' | 'completed';
export type ActionOutcome = 'success' | 'partial' | 'failed' | 'unknown';

export interface ActionHistoryRecord {
  id: string;
  action_text: string;
  source: ActionSource;
  priority_score: number;
  status: ActionStatus;
  outcome: ActionOutcome | null;
  source_action_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FounderProfile {
  totalActions: number;
  acceptedPercent: number;
  completedPercent: number;
  ignoredPercent: number;
  preferredSources: { source: string; count: number }[];
  avgCompletionScore: number;
  successRate: number;
}

/* ── CRUD: Action Feedback ── */

/** Insert a new suggested action into history */
export async function trackAction(
  actionText: string,
  source: ActionSource,
  priorityScore: number,
  sourceActionId?: string,
): Promise<ActionHistoryRecord | null> {
  const { data, error } = await supabase
    .from('ceo_action_history')
    .insert({
      action_text: actionText,
      source,
      priority_score: Math.min(100, Math.max(0, Math.round(priorityScore))),
      status: 'suggested',
      source_action_id: sourceActionId || null,
    })
    .select()
    .single();

  if (error) {
    console.error('[ActionFeedback] trackAction error:', error.message);
    return null;
  }
  return data as ActionHistoryRecord;
}

/** Mark action as accepted by founder */
export async function markActionAccepted(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('ceo_action_history')
    .update({ status: 'accepted' })
    .eq('id', id);

  if (error) {
    console.error('[ActionFeedback] markAccepted error:', error.message);
    return false;
  }
  return true;
}

/** Mark action as ignored by founder */
export async function markActionIgnored(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('ceo_action_history')
    .update({ status: 'ignored' })
    .eq('id', id);

  if (error) {
    console.error('[ActionFeedback] markIgnored error:', error.message);
    return false;
  }
  return true;
}

/** Mark action as completed with outcome */
export async function markActionCompleted(
  id: string,
  outcome: ActionOutcome = 'success',
): Promise<boolean> {
  const { error } = await supabase
    .from('ceo_action_history')
    .update({ status: 'completed', outcome })
    .eq('id', id);

  if (error) {
    console.error('[ActionFeedback] markCompleted error:', error.message);
    return false;
  }
  return true;
}

/** Fetch full action history (most recent first) */
export async function getActionHistory(limit = 50): Promise<ActionHistoryRecord[]> {
  const { data, error } = await supabase
    .from('ceo_action_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[ActionFeedback] getActionHistory error:', error.message);
    return [];
  }
  return (data || []) as ActionHistoryRecord[];
}

/* ── Learning Layer (V1 — Rule-Based) ── */

/**
 * Adjust a raw priority score based on historical founder behaviour.
 *
 * Rules:
 * - If similar actions (same source) were frequently accepted → boost +5 to +15
 * - If similar actions (same source) were frequently ignored → reduce -5 to -15
 * - Completed actions with success outcome → extra boost +5
 */
export async function getAdjustedPriorityScore(
  rawScore: number,
  source: ActionSource,
  actionText: string,
): Promise<number> {
  // Fetch recent history for this source (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('ceo_action_history')
    .select('status, outcome, action_text')
    .eq('source', source)
    .gte('created_at', thirtyDaysAgo);

  if (error || !data || data.length === 0) return rawScore;

  const total = data.length;
  const accepted = data.filter((r) => r.status === 'accepted' || r.status === 'completed').length;
  const ignored = data.filter((r) => r.status === 'ignored').length;
  const successes = data.filter((r) => r.outcome === 'success').length;

  let adjustment = 0;

  // Source acceptance ratio boost/penalty
  const acceptRatio = accepted / total;
  const ignoreRatio = ignored / total;

  if (acceptRatio > 0.6) adjustment += 10;
  else if (acceptRatio > 0.4) adjustment += 5;

  if (ignoreRatio > 0.6) adjustment -= 10;
  else if (ignoreRatio > 0.4) adjustment -= 5;

  // Success bonus
  if (successes > 3) adjustment += 5;

  // Text similarity bonus: check if keywords from action_text match accepted history
  const words = actionText.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
  const acceptedTexts = data
    .filter((r) => r.status === 'accepted' || r.status === 'completed')
    .map((r) => (r.action_text || '').toLowerCase());

  let keywordMatches = 0;
  for (const word of words) {
    if (acceptedTexts.some((t) => t.includes(word))) keywordMatches++;
  }
  if (keywordMatches >= 3) adjustment += 5;
  else if (keywordMatches >= 1) adjustment += 2;

  return Math.min(100, Math.max(0, rawScore + adjustment));
}

/* ── Founder Behaviour Profile ── */

/** Build a profile of founder's action patterns */
export async function getFounderProfile(): Promise<FounderProfile> {
  const { data, error } = await supabase
    .from('ceo_action_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error || !data || data.length === 0) {
    return {
      totalActions: 0,
      acceptedPercent: 0,
      completedPercent: 0,
      ignoredPercent: 0,
      preferredSources: [],
      avgCompletionScore: 0,
      successRate: 0,
    };
  }

  const records = data as ActionHistoryRecord[];
  const total = records.length;
  const accepted = records.filter((r) => r.status === 'accepted').length;
  const completed = records.filter((r) => r.status === 'completed').length;
  const ignored = records.filter((r) => r.status === 'ignored').length;
  const successes = records.filter((r) => r.outcome === 'success').length;
  const withOutcome = records.filter((r) => r.outcome !== null).length;

  // Count by source for preferred sources
  const sourceCounts: Record<string, number> = {};
  for (const r of records.filter((r) => r.status === 'accepted' || r.status === 'completed')) {
    sourceCounts[r.source] = (sourceCounts[r.source] || 0) + 1;
  }
  const preferredSources = Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);

  // Average priority score of completed actions
  const completedRecords = records.filter((r) => r.status === 'completed');
  const avgCompletionScore = completedRecords.length > 0
    ? Math.round(completedRecords.reduce((sum, r) => sum + r.priority_score, 0) / completedRecords.length)
    : 0;

  return {
    totalActions: total,
    acceptedPercent: total > 0 ? Math.round((accepted / total) * 100) : 0,
    completedPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    ignoredPercent: total > 0 ? Math.round((ignored / total) * 100) : 0,
    preferredSources,
    avgCompletionScore,
    successRate: withOutcome > 0 ? Math.round((successes / withOutcome) * 100) : 0,
  };
}
