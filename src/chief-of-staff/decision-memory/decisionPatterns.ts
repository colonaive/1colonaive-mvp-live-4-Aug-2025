// CEO Decision Pattern Detection
// Identifies recurring patterns in CEO actions to enable proactive suggestions.

import { decisionMemoryEngine, type DecisionEvent } from './decisionMemoryEngine';

export interface DecisionPattern {
  id: string;
  action_type: string;
  entity: string | null;
  context_hint: string | null;
  frequency: number;
  confidence: number;
  label: string;
}

// Minimum frequency to qualify as a pattern
const PATTERN_THRESHOLD = 2;

export const decisionPatterns = {
  /** Detect all active patterns from memory */
  detect(): DecisionPattern[] {
    const memories = decisionMemoryEngine.getAll();
    const patterns: DecisionPattern[] = [];

    for (const m of memories) {
      if (m.frequency >= PATTERN_THRESHOLD && m.confidence_score >= 30) {
        patterns.push({
          id: m.id,
          action_type: m.action_type,
          entity: m.entity,
          context_hint: m.context_summary,
          frequency: m.frequency,
          confidence: m.confidence_score,
          label: buildPatternLabel(m),
        });
      }
    }

    return patterns.sort((a, b) => b.confidence - a.confidence);
  },

  /** Find patterns matching a message */
  matchPatterns(message: string): DecisionPattern[] {
    const patterns = this.detect();
    const lower = message.toLowerCase();
    const matched: DecisionPattern[] = [];

    for (const p of patterns) {
      let relevance = 0;

      // Entity name match
      if (p.entity && lower.includes(p.entity.toLowerCase())) {
        relevance += 3;
      }

      // Context similarity
      if (p.context_hint) {
        const contextWords = p.context_hint.toLowerCase().split(/\s+/);
        const matchingWords = contextWords.filter((w) => w.length > 3 && lower.includes(w));
        relevance += matchingWords.length;
      }

      // Action type keyword match
      const actionKeywords: Record<string, string[]> = {
        email: ['email', 'send', 'write', 'update', 'reach out', 'contact'],
        task: ['task', 'implement', 'build', 'fix', 'create', 'deploy'],
        prompt: ['prompt', 'ag', 'antigravity', 'generate'],
        roadmap: ['roadmap', 'plan', 'feature', 'milestone'],
        linkedin: ['linkedin', 'post', 'share'],
        strategy: ['strategy', 'memo', 'briefing'],
      };

      const keywords = actionKeywords[p.action_type] || [];
      if (keywords.some((k) => lower.includes(k))) {
        relevance += 1;
      }

      if (relevance >= 2) {
        matched.push(p);
      }
    }

    return matched.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  },

  /** Get top recurring patterns for dashboard display */
  getTopPatterns(limit = 5): DecisionPattern[] {
    return this.detect().slice(0, limit);
  },
};

function buildPatternLabel(m: DecisionEvent): string {
  const actionLabels: Record<string, string> = {
    email: 'Email',
    task: 'Task',
    prompt: 'AG Prompt',
    roadmap: 'Roadmap',
    linkedin: 'LinkedIn',
    strategy: 'Strategy',
  };
  const action = actionLabels[m.action_type] || m.action_type;
  if (m.entity) {
    return `${action} → ${m.entity}`;
  }
  if (m.context_summary) {
    return `${action}: ${m.context_summary.slice(0, 40)}`;
  }
  return action;
}
