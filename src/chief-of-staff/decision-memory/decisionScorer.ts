// CEO Decision Scorer
// Scores decision memories based on frequency, recency, and context similarity.

import type { DecisionEvent } from './decisionMemoryEngine';

export interface ScoredDecision {
  memory: DecisionEvent;
  score: number;
  reason: string;
}

// Weights
const FREQUENCY_WEIGHT = 3;
const RECENCY_WEIGHT = 2;
const CONFIDENCE_WEIGHT = 1;

export const decisionScorer = {
  /** Score a single memory relative to a message context */
  scoreMemory(memory: DecisionEvent, message: string): ScoredDecision {
    let score = 0;
    const reasons: string[] = [];

    // Frequency component
    const freqScore = Math.min(memory.frequency * FREQUENCY_WEIGHT, 30);
    score += freqScore;
    if (memory.frequency >= 3) {
      reasons.push(`used ${memory.frequency} times`);
    }

    // Recency component (higher if used recently)
    const hoursSinceUse = (Date.now() - new Date(memory.last_used_at).getTime()) / (1000 * 60 * 60);
    const recencyScore =
      hoursSinceUse < 24
        ? 20 * RECENCY_WEIGHT
        : hoursSinceUse < 168 // 1 week
          ? 10 * RECENCY_WEIGHT
          : 2 * RECENCY_WEIGHT;
    score += recencyScore;
    if (hoursSinceUse < 24) {
      reasons.push('used today');
    } else if (hoursSinceUse < 168) {
      reasons.push('used this week');
    }

    // Confidence component
    score += (memory.confidence_score / 100) * 20 * CONFIDENCE_WEIGHT;

    // Context similarity bonus
    if (message) {
      const lower = message.toLowerCase();
      if (memory.entity && lower.includes(memory.entity.toLowerCase())) {
        score += 25;
        reasons.push(`mentions ${memory.entity}`);
      }
      if (memory.context_summary) {
        const words = memory.context_summary.toLowerCase().split(/\s+/);
        const matches = words.filter((w) => w.length > 3 && lower.includes(w)).length;
        score += matches * 5;
        if (matches > 0) reasons.push('context match');
      }
    }

    return {
      memory,
      score: Math.round(score),
      reason: reasons.join(', ') || 'historical pattern',
    };
  },

  /** Score and rank multiple memories against a message */
  rankMemories(memories: DecisionEvent[], message: string, limit = 3): ScoredDecision[] {
    return memories
      .map((m) => this.scoreMemory(m, message))
      .filter((s) => s.score >= 15) // minimum relevance threshold
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
};
