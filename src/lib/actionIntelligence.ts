/**
 * Action Intelligence Engine — CTW-COCKPIT-02C
 *
 * Scores cockpit actions by impact, urgency, effort, and strategic alignment
 * to surface the highest-priority next moves for the founder.
 */

import type { EarlyWarningSignal, StrategyImplication } from '@/services/competitiveIntelligenceService';
import type { RadarSignal } from '@/services/radarService';

/* ── Types ── */

export interface ActionCandidate {
  id: string;
  title: string;
  description: string;
  source: 'radar' | 'early_warning' | 'strategy' | 'linkedin' | 'task' | 'custom' | 'email';
  sourceId?: string;
  created_at: string;
  /** Raw scores populated by the engine */
  scores?: {
    impact: number;
    urgency: number;
    effort: number;
    alignment: number;
    priority: number;
  };
}

export interface ScoredAction extends ActionCandidate {
  scores: {
    impact: number;
    urgency: number;
    effort: number;
    alignment: number;
    priority: number;
  };
  rank: number;
}

/* ── Scoring weights ── */

const WEIGHTS = {
  impact: 0.35,
  urgency: 0.30,
  effort: 0.15, // inverted — lower effort = higher score
  alignment: 0.20,
} as const;

/* ── Strategic keywords for alignment scoring ── */

const ALIGNMENT_KEYWORDS = [
  'screening', 'uptake', 'colonoscopy', 'early detection',
  'colonaiq', 'blood-based', 'methylation', 'crc',
  'colorectal', 'prevention', 'awareness', 'movement',
  'hsa', 'regulatory', 'cdsco', 'nmpa',
  'saver', 'singlera', 'angsana',
];

const HIGH_IMPACT_KEYWORDS = [
  'regulatory', 'approval', 'clearance', 'partnership',
  'clinical trial', 'government', 'national', 'mortality',
  'breakthrough', 'fda', 'hsa', 'cdsco',
];

const URGENCY_KEYWORDS = [
  'deadline', 'expiring', 'urgent', 'critical', 'recall',
  'competitor launch', 'market entry', 'submission',
];

/* ── Scoring functions ── */

/** Impact: how much this action moves the needle (0–100) */
export function calculateImpactScore(action: ActionCandidate): number {
  let score = 40; // baseline
  const text = `${action.title} ${action.description}`.toLowerCase();

  for (const kw of HIGH_IMPACT_KEYWORDS) {
    if (text.includes(kw)) score += 8;
  }

  // Source-based boost
  if (action.source === 'early_warning') score += 15;
  if (action.source === 'strategy') score += 10;
  if (action.source === 'radar') score += 5;

  return Math.min(100, score);
}

/** Urgency: time-sensitivity (0–100) */
export function calculateUrgencyScore(action: ActionCandidate): number {
  let score = 30; // baseline
  const text = `${action.title} ${action.description}`.toLowerCase();

  for (const kw of URGENCY_KEYWORDS) {
    if (text.includes(kw)) score += 12;
  }

  // Recency boost — newer signals are more urgent
  const ageHours = (Date.now() - new Date(action.created_at).getTime()) / (1000 * 60 * 60);
  if (ageHours < 24) score += 25;
  else if (ageHours < 72) score += 15;
  else if (ageHours < 168) score += 5;

  return Math.min(100, score);
}

/** Effort: estimated effort to act (0–100, lower = easier) */
export function calculateEffortScore(action: ActionCandidate): number {
  let score = 50; // baseline medium effort

  // LinkedIn posts are low effort
  if (action.source === 'linkedin') score = 20;
  // Tasks vary but are structured
  if (action.source === 'task') score = 40;
  // Strategy implications require analysis
  if (action.source === 'strategy') score = 60;
  // Early warnings may need investigation
  if (action.source === 'early_warning') score = 55;

  return Math.min(100, score);
}

/** Strategic alignment with COLONAiVE doctrine (0–100) */
export function calculateStrategicAlignment(action: ActionCandidate): number {
  let score = 20; // baseline
  const text = `${action.title} ${action.description}`.toLowerCase();

  for (const kw of ALIGNMENT_KEYWORDS) {
    if (text.includes(kw)) score += 6;
  }

  return Math.min(100, score);
}

/** Combined priority score (0–100) */
export function getPriorityScore(action: ActionCandidate): number {
  const impact = calculateImpactScore(action);
  const urgency = calculateUrgencyScore(action);
  const effort = calculateEffortScore(action);
  const alignment = calculateStrategicAlignment(action);

  // Invert effort: low effort = high contribution
  const effortInverted = 100 - effort;

  const priority = Math.round(
    impact * WEIGHTS.impact +
    urgency * WEIGHTS.urgency +
    effortInverted * WEIGHTS.effort +
    alignment * WEIGHTS.alignment
  );

  return Math.min(100, Math.max(0, priority));
}

/* ── Next Best Action Engine ── */

/** Score all candidates and return top N */
export function getNextBestActions(
  actions: ActionCandidate[],
  limit = 3,
): ScoredAction[] {
  const scored: ScoredAction[] = actions.map((action) => {
    const impact = calculateImpactScore(action);
    const urgency = calculateUrgencyScore(action);
    const effort = calculateEffortScore(action);
    const alignment = calculateStrategicAlignment(action);
    const priority = getPriorityScore(action);

    return {
      ...action,
      scores: { impact, urgency, effort, alignment, priority },
      rank: 0,
    };
  });

  // Sort by priority descending
  scored.sort((a, b) => b.scores.priority - a.scores.priority);

  // Assign ranks
  scored.forEach((s, i) => {
    s.rank = i + 1;
  });

  return scored.slice(0, limit);
}

/* ── Signal adapters ── */

/** Convert radar signals to action candidates */
export function radarSignalsToActions(signals: RadarSignal[]): ActionCandidate[] {
  return signals.map((s) => ({
    id: `radar-${s.id}`,
    title: s.title,
    description: s.summary || s.abstract || '',
    source: 'radar' as const,
    sourceId: s.id,
    created_at: s.created_at || new Date().toISOString(),
  }));
}

/** Convert early warning signals to action candidates */
export function earlyWarningsToActions(signals: EarlyWarningSignal[]): ActionCandidate[] {
  return signals.map((s) => ({
    id: `ew-${s.id}`,
    title: s.title,
    description: `${s.analysis || ''} ${s.market_implication || ''} ${s.recommended_action || ''}`.trim(),
    source: 'early_warning' as const,
    sourceId: s.id,
    created_at: s.detected_at || s.created_at,
  }));
}

/** Convert strategy implications to action candidates */
export function strategyImplicationsToActions(signals: StrategyImplication[]): ActionCandidate[] {
  return signals.map((s) => ({
    id: `strategy-${s.id}`,
    title: s.signal_title,
    description: `${s.analysis || ''} ${s.recommended_action || ''}`.trim(),
    source: 'strategy' as const,
    sourceId: s.id,
    created_at: s.created_at,
  }));
}
