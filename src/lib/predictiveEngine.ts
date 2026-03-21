/**
 * Predictive Intelligence Engine — CTW-COCKPIT-02D.8
 *
 * Analyses recurring CEO events to predict likely future occurrences.
 * Only predicts from REAL recurring patterns — no AI hallucination.
 *
 * Logic:
 * 1. Fetch resolved events with is_recurring = true or recurrence_count >= 2
 * 2. Group by event_type + entity keywords
 * 3. Calculate average time gap between occurrences
 * 4. If pattern is consistent, generate a prediction
 */

import { supabase } from '@/supabase';
import type { EventType } from '@/lib/eventConsolidationEngine';
import { generatePreemptiveAction, type PreemptiveAction } from '@/lib/preemptiveActionEngine';

/* ── Types ── */

export interface CEOPrediction {
  id: string;
  event_type: EventType;
  predicted_event_name: string;
  predicted_date: string;
  confidence_score: number;
  source_event_ids: string[];
  status: 'active' | 'dismissed' | 'occurred' | 'expired';
  recommended_action: string | null;
  action_generated_at: string | null;
  action_status: 'pending' | 'executed' | 'ignored';
  source_system: string[];
  created_at: string;
  updated_at: string;
}

/* ── Hardening Constants ── */

/** Only display predictions with confidence >= this threshold */
const DISPLAY_CONFIDENCE_THRESHOLD = 55;
/** Maximum predictions shown in cockpit */
const MAX_COCKPIT_PREDICTIONS = 3;
/** Events within this window (hours) are treated as one occurrence */
const CLUSTER_DEDUP_HOURS = 48;
/** Predictions expire after this many days past predicted_date */
const PREDICTION_EXPIRY_DAYS = 2;

/**
 * Get the pre-emptive action for a prediction (computed, not stored).
 * Used by UI to display action details and quick options.
 */
export function getPredictionAction(prediction: CEOPrediction): PreemptiveAction {
  return generatePreemptiveAction(prediction.predicted_event_name, prediction.event_type);
}

interface ResolvedEvent {
  id: string;
  event_name: string;
  event_type: EventType;
  resolved_at: string | null;
  created_at: string;
  recurrence_count: number;
  is_recurring: boolean;
}

interface PatternGroup {
  event_type: EventType;
  label: string;
  events: ResolvedEvent[];
  entity: string;
}

/* ── Entity Keywords for Pattern Grouping ── */

const ENTITY_KEYWORDS = [
  'ups', 'dhl', 'fedex', 'shipment', 'customs', 'clearance',
  'angsana', 'singlera', 'ktph', 'hsa', 'fda', 'nmpa', 'cdsco',
  'investor', 'funding', 'pitch', 'trial', 'validation',
];

/* ── Pattern Analysis ── */

/**
 * Extract the dominant entity keyword from an event name.
 */
function extractEntity(eventName: string): string {
  const lower = eventName.toLowerCase();
  for (const kw of ENTITY_KEYWORDS) {
    if (lower.includes(kw)) return kw;
  }
  return 'general';
}

/**
 * Group resolved recurring events by event_type + entity keyword.
 */
function groupByPattern(events: ResolvedEvent[]): PatternGroup[] {
  const groups = new Map<string, PatternGroup>();

  for (const evt of events) {
    const entity = extractEntity(evt.event_name);
    const key = `${evt.event_type}:${entity}`;

    if (!groups.has(key)) {
      groups.set(key, {
        event_type: evt.event_type,
        label: evt.event_name,
        events: [],
        entity,
      });
    }
    groups.get(key)!.events.push(evt);
  }

  return Array.from(groups.values());
}

/**
 * Cluster-deduplicate events that occur within CLUSTER_DEDUP_HOURS of each other.
 * Treats closely-spaced events as ONE occurrence to prevent false recurrence inflation.
 */
function clusterDedup(events: ResolvedEvent[]): ResolvedEvent[] {
  if (events.length <= 1) return events;

  const sorted = [...events].sort((a, b) => {
    const dateA = new Date(a.resolved_at || a.created_at).getTime();
    const dateB = new Date(b.resolved_at || b.created_at).getTime();
    return dateA - dateB;
  });

  const deduped: ResolvedEvent[] = [sorted[0]];
  const thresholdMs = CLUSTER_DEDUP_HOURS * 60 * 60 * 1000;

  for (let i = 1; i < sorted.length; i++) {
    const prevTime = new Date(deduped[deduped.length - 1].resolved_at || deduped[deduped.length - 1].created_at).getTime();
    const currTime = new Date(sorted[i].resolved_at || sorted[i].created_at).getTime();
    if (currTime - prevTime > thresholdMs) {
      deduped.push(sorted[i]);
    }
  }

  return deduped;
}

/**
 * Calculate average time gap (in days) between events in a group.
 * Returns null if fewer than 2 events (can't compute gap).
 */
function calculateAverageGap(events: ResolvedEvent[]): { avgGapDays: number; consistency: number } | null {
  if (events.length < 2) return null;

  // Sort by date (oldest first)
  const sorted = [...events].sort((a, b) => {
    const dateA = new Date(a.resolved_at || a.created_at).getTime();
    const dateB = new Date(b.resolved_at || b.created_at).getTime();
    return dateA - dateB;
  });

  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].resolved_at || sorted[i - 1].created_at).getTime();
    const curr = new Date(sorted[i].resolved_at || sorted[i].created_at).getTime();
    const gapDays = (curr - prev) / (1000 * 60 * 60 * 24);
    if (gapDays > 0) gaps.push(gapDays);
  }

  if (gaps.length === 0) return null;

  const avgGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;

  // Consistency: how regular is the pattern? (1.0 = perfectly regular, 0.0 = chaotic)
  // Uses coefficient of variation (lower = more consistent)
  const variance = gaps.reduce((sum, g) => sum + Math.pow(g - avgGap, 2), 0) / gaps.length;
  const stdDev = Math.sqrt(variance);
  const cv = avgGap > 0 ? stdDev / avgGap : 1;
  // Convert CV to 0-1 consistency score (CV of 0 = 1.0 consistency, CV of 1+ = 0.0)
  const consistency = Math.max(0, Math.min(1, 1 - cv));

  return { avgGapDays: Math.round(avgGap), consistency };
}

/**
 * Compute confidence score from pattern strength.
 * Factors: number of occurrences, consistency, recency.
 */
function computeConfidence(group: PatternGroup, consistency: number): number {
  const occurrences = group.events.length;

  // Base confidence from occurrences (2 events = 40, 3 = 55, 4 = 65, 5+ = 75)
  const occurrenceScore = Math.min(75, 25 + occurrences * 12.5);

  // Consistency bonus (0-20 points)
  const consistencyBonus = consistency * 20;

  // Recency bonus: if last event was within 30 days, add up to 5 points
  const lastEvent = group.events.reduce((latest, e) => {
    const d = new Date(e.resolved_at || e.created_at).getTime();
    return d > latest ? d : latest;
  }, 0);
  const daysSinceLast = (Date.now() - lastEvent) / (1000 * 60 * 60 * 24);
  const recencyBonus = daysSinceLast <= 30 ? 5 : 0;

  return Math.min(100, Math.round(occurrenceScore + consistencyBonus + recencyBonus));
}

/**
 * Generate a human-readable prediction name.
 */
function generatePredictionName(group: PatternGroup): string {
  const entity = group.entity.charAt(0).toUpperCase() + group.entity.slice(1);
  const typeLabels: Record<string, string> = {
    logistics: 'Shipment/Logistics Issue',
    regulatory: 'Regulatory Action Required',
    investor: 'Investor Follow-up Needed',
    clinical: 'Clinical Study Activity',
    product: 'Product Issue',
    partnership: 'Partnership Action Required',
    general: 'Recurring Issue',
  };
  const typeLabel = typeLabels[group.event_type] || 'Issue';
  return `${entity} ${typeLabel} Likely`;
}

/* ── Public API ── */

/**
 * Run the predictive analysis pipeline:
 * 1. Fetch recurring resolved events
 * 2. Group by pattern
 * 3. Calculate timing patterns
 * 4. Generate predictions
 * 5. Persist to ceo_predictions
 * 6. Return active predictions
 */
export async function generatePredictions(): Promise<CEOPrediction[]> {
  // Step 1: Fetch resolved events that are recurring or have recurrence_count >= 2
  const { data: resolvedEvents } = await supabase
    .from('ceo_events')
    .select('id, event_name, event_type, resolved_at, created_at, recurrence_count, is_recurring')
    .eq('status', 'resolved')
    .or('is_recurring.eq.true,recurrence_count.gte.2')
    .order('created_at', { ascending: false })
    .limit(200);

  if (!resolvedEvents || resolvedEvents.length < 2) {
    // Not enough data to predict — return existing active predictions
    return getActivePredictions();
  }

  // Step 2: Group by pattern
  const groups = groupByPattern(resolvedEvents as ResolvedEvent[]);

  // Step 3-4: Analyse each group and generate predictions
  const predictions: Omit<CEOPrediction, 'id' | 'created_at' | 'updated_at'>[] = [];

  for (const group of groups) {
    // Cluster-deduplicate: events within 48h count as ONE occurrence
    group.events = clusterDedup(group.events);

    if (group.events.length < 2) continue; // Need at least 2 real occurrences

    const gapAnalysis = calculateAverageGap(group.events);
    if (!gapAnalysis) continue;

    const { avgGapDays, consistency } = gapAnalysis;
    if (avgGapDays <= 0 || avgGapDays > 180) continue; // Skip unreasonable gaps

    const confidence = computeConfidence(group, consistency);
    if (confidence < 35) continue; // Skip low-confidence predictions (kept in DB but not displayed if < 55)

    // Predict next occurrence: last event date + average gap
    const lastEventDate = group.events.reduce((latest, e) => {
      const d = new Date(e.resolved_at || e.created_at).getTime();
      return d > latest ? d : latest;
    }, 0);
    const predictedDate = new Date(lastEventDate + avgGapDays * 24 * 60 * 60 * 1000);

    // Only predict future events (within next 60 days)
    const now = new Date();
    const sixtyDaysOut = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);
    if (predictedDate < now || predictedDate > sixtyDaysOut) continue;

    const predName = generatePredictionName(group);
    const action = generatePreemptiveAction(predName, group.event_type);

    predictions.push({
      event_type: group.event_type as EventType,
      predicted_event_name: predName,
      predicted_date: predictedDate.toISOString().split('T')[0],
      confidence_score: confidence,
      source_event_ids: group.events.map((e) => e.id),
      status: 'active',
      recommended_action: action.recommended_action,
      action_generated_at: new Date().toISOString(),
      action_status: 'pending',
      source_system: ['colonaive'],
    });
  }

  // Step 5: Expire old predictions past their date + PREDICTION_EXPIRY_DAYS
  try {
    const expiryThreshold = new Date(Date.now() - PREDICTION_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    await supabase
      .from('ceo_predictions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('status', 'active')
      .lt('predicted_date', expiryThreshold);

    // Expire remaining active predictions to refresh
    await supabase
      .from('ceo_predictions')
      .update({ status: 'expired', updated_at: new Date().toISOString() })
      .eq('status', 'active');

    if (predictions.length > 0) {
      // Sort by confidence (highest first), take top MAX_COCKPIT_PREDICTIONS
      predictions.sort((a, b) => b.confidence_score - a.confidence_score);
      await supabase
        .from('ceo_predictions')
        .insert(predictions.slice(0, MAX_COCKPIT_PREDICTIONS));
    }
  } catch {
    // Silent fail on persistence
  }

  // Step 6: Return active predictions
  return getActivePredictions();
}

/**
 * Fetch active predictions without re-generating.
 * Only returns predictions with confidence >= DISPLAY_CONFIDENCE_THRESHOLD.
 * Used for fast cockpit rendering.
 */
export async function getActivePredictions(): Promise<CEOPrediction[]> {
  const { data } = await supabase
    .from('ceo_predictions')
    .select('*')
    .eq('status', 'active')
    .gte('confidence_score', DISPLAY_CONFIDENCE_THRESHOLD)
    .order('confidence_score', { ascending: false })
    .limit(MAX_COCKPIT_PREDICTIONS);

  return (data || []) as CEOPrediction[];
}

/**
 * Dismiss a prediction (user indicates it's not relevant).
 */
export async function dismissPrediction(predictionId: string): Promise<void> {
  await supabase
    .from('ceo_predictions')
    .update({ status: 'dismissed', updated_at: new Date().toISOString() })
    .eq('id', predictionId);
}

/**
 * Mark a prediction's action as executed or ignored.
 */
export async function updatePredictionActionStatus(
  predictionId: string,
  status: 'executed' | 'ignored',
): Promise<void> {
  await supabase
    .from('ceo_predictions')
    .update({ action_status: status, updated_at: new Date().toISOString() })
    .eq('id', predictionId);
}

/**
 * Log an action execution (for Work Room tracking).
 */
export async function logActionExecution(
  sourceType: 'event' | 'prediction',
  sourceId: string,
  actionType: string,
): Promise<void> {
  try {
    await supabase.from('ceo_action_logs').insert({
      source_type: sourceType,
      source_id: sourceId,
      action_type: actionType,
    });
  } catch {
    // Silent fail — logging is non-blocking
  }
}

/**
 * Get the confidence label for display.
 */
export function getConfidenceLabel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: 'High Confidence', color: 'text-red-600 dark:text-red-400' };
  if (score >= 50) return { label: 'Medium Confidence', color: 'text-amber-600 dark:text-amber-400' };
  return { label: 'Low Confidence', color: 'text-blue-600 dark:text-blue-400' };
}

/**
 * Get the expected timeframe label.
 */
export function getTimeframeLabel(predictedDate: string): string {
  const now = new Date();
  const predicted = new Date(predictedDate);
  const daysUntil = Math.ceil((predicted.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil <= 0) return 'Imminent';
  if (daysUntil <= 3) return `within ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
  if (daysUntil <= 7) return 'within 1 week';
  if (daysUntil <= 14) return 'within 2 weeks';
  if (daysUntil <= 30) return 'within 1 month';
  return `in ~${Math.round(daysUntil / 7)} weeks`;
}
