// CEO Decision Suggestions
// Generates proactive CTA suggestions based on decision memory patterns.
// Integrates with the Action Center chat flow.

import { decisionMemoryEngine } from './decisionMemoryEngine';
import { decisionPatterns } from './decisionPatterns';
import { decisionScorer } from './decisionScorer';
import type { SuggestedAction } from '../action-center/chatEngine';

export interface MemorySuggestion {
  action: SuggestedAction;
  reason: string;
  memoryId: string;
  score: number;
}

// Map memory action_type to CTA action type
const ACTION_TYPE_MAP: Record<string, string> = {
  email: 'draft-email',
  task: 'create-task',
  prompt: 'generate-prompt',
  roadmap: 'add-roadmap',
  linkedin: 'generate-linkedin',
  strategy: 'create-strategy-note',
};

export const decisionSuggestions = {
  /** Generate suggestions for a CEO message based on decision memory */
  async getSuggestions(message: string): Promise<MemorySuggestion[]> {
    await decisionMemoryEngine.ensureLoaded();

    const suggestions: MemorySuggestion[] = [];

    // 1. Check pattern matches
    const matchedPatterns = decisionPatterns.matchPatterns(message);
    for (const pattern of matchedPatterns) {
      const ctaType = ACTION_TYPE_MAP[pattern.action_type] || pattern.action_type;
      const label = pattern.entity
        ? `${getActionLabel(ctaType)} to ${pattern.entity}`
        : getActionLabel(ctaType);

      suggestions.push({
        action: { type: ctaType, label },
        reason: `You usually ${getActionVerb(pattern.action_type)}${pattern.entity ? ` ${pattern.entity}` : ''} for this type of request.`,
        memoryId: pattern.id,
        score: pattern.confidence,
      });
    }

    // 2. Score all memories against the message for additional suggestions
    const allMemories = decisionMemoryEngine.getAll();
    const scored = decisionScorer.rankMemories(allMemories, message, 3);

    for (const s of scored) {
      // Skip if already suggested via pattern
      if (suggestions.some((sg) => sg.memoryId === s.memory.id)) continue;

      const ctaType = ACTION_TYPE_MAP[s.memory.action_type] || s.memory.action_type;
      const label = s.memory.entity
        ? `${getActionLabel(ctaType)} to ${s.memory.entity}`
        : getActionLabel(ctaType);

      suggestions.push({
        action: { type: ctaType, label },
        reason: s.reason,
        memoryId: s.memory.id,
        score: s.score,
      });
    }

    // Deduplicate by action type + entity, keep highest score
    const seen = new Set<string>();
    const unique: MemorySuggestion[] = [];
    for (const s of suggestions.sort((a, b) => b.score - a.score)) {
      const key = `${s.action.type}|${s.action.label}`;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(s);
      }
    }

    return unique.slice(0, 3);
  },

  /** Record that the CEO accepted a suggestion */
  async acceptSuggestion(memoryId: string): Promise<void> {
    await decisionMemoryEngine.boostConfidence(memoryId, 10);
  },

  /** Record that the CEO ignored a suggestion (call after response without using suggested CTA) */
  async ignoreSuggestion(memoryId: string): Promise<void> {
    await decisionMemoryEngine.decayConfidence(memoryId, 3);
  },

  /** Generate a weekly learning summary */
  generateWeeklySummary(): string {
    const stats = decisionMemoryEngine.getStats();
    const topPatterns = decisionPatterns.getTopPatterns(5);
    const contacts = decisionMemoryEngine.getFrequentContacts(3);
    const actions = decisionMemoryEngine.getFrequentActions(3);

    const lines: string[] = ['CEO Decision Memory — Weekly Summary', ''];

    if (stats.totalMemories === 0) {
      lines.push('No decision patterns recorded yet. Patterns will emerge as you use the Action Center.');
      return lines.join('\n');
    }

    lines.push(`Total patterns tracked: ${stats.totalMemories}`);
    lines.push(`Average confidence: ${stats.avgConfidence}%`);
    lines.push('');

    if (contacts.length > 0) {
      lines.push('Most contacted:');
      for (const c of contacts) {
        lines.push(`  • ${c.entity} (${c.frequency} times)`);
      }
      lines.push('');
    }

    if (actions.length > 0) {
      lines.push('Most frequent actions:');
      for (const a of actions) {
        lines.push(`  • ${getActionLabel(ACTION_TYPE_MAP[a.action_type] || a.action_type)} (${a.total_frequency} uses)`);
      }
      lines.push('');
    }

    if (topPatterns.length > 0) {
      lines.push('Top patterns:');
      for (const p of topPatterns) {
        lines.push(`  • ${p.label} — ${p.frequency} times, ${p.confidence}% confidence`);
      }
    }

    return lines.join('\n');
  },
};

// --- Helpers ---

function getActionLabel(ctaType: string): string {
  const labels: Record<string, string> = {
    'draft-email': 'Draft Email',
    'create-task': 'Create Task',
    'generate-prompt': 'Generate AG Prompt',
    'add-roadmap': 'Add to Roadmap',
    'generate-linkedin': 'LinkedIn Post',
    'create-strategy-note': 'Strategy Memo',
  };
  return labels[ctaType] || ctaType;
}

function getActionVerb(actionType: string): string {
  const verbs: Record<string, string> = {
    email: 'email',
    task: 'create tasks for',
    prompt: 'generate prompts for',
    roadmap: 'add roadmap items for',
    linkedin: 'post on LinkedIn about',
    strategy: 'write strategy memos about',
  };
  return verbs[actionType] || actionType;
}
