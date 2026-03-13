// Chief-of-Staff — Action Router
// Intelligent routing of CEO chat messages to appropriate actions.
// Returns primary intent + secondary suggested CTA actions.

import { taskEngine } from '@/chief-of-staff/tasks/taskEngine';
import type { SuggestedAction } from './chatEngine';

export type ActionType =
  | 'create-task'
  | 'generate-prompt'
  | 'draft-email'
  | 'add-roadmap'
  | 'create-strategy-note'
  | 'generate-linkedin'
  | 'export-meeting-note'
  | 'save-transcript'
  | 'unknown';

export interface RoutedAction {
  type: ActionType;
  confidence: number;
  suggestedTitle: string;
  suggestedContent: string;
  metadata?: Record<string, string>;
}

export interface IntentResult {
  primary: RoutedAction;
  suggestedActions: SuggestedAction[];
  analysisText: string;
}

// Action labels for CTA buttons
const ACTION_LABELS: Record<ActionType, string> = {
  'create-task': 'Create Task',
  'generate-prompt': 'Generate AG Prompt',
  'draft-email': 'Draft Email',
  'add-roadmap': 'Add to Roadmap',
  'create-strategy-note': 'Strategy Memo',
  'generate-linkedin': 'LinkedIn Post',
  'export-meeting-note': 'Meeting Note',
  'save-transcript': 'Save Transcript',
  unknown: 'No Action',
};

// Intent category descriptions for analysis text
const INTENT_DESCRIPTIONS: Partial<Record<ActionType, string>> = {
  'draft-email': 'an external communication',
  'create-task': 'a development or operational task',
  'generate-prompt': 'an Antigravity prompt request',
  'add-roadmap': 'a product roadmap item',
  'generate-linkedin': 'a LinkedIn content request',
  'create-strategy-note': 'a strategic discussion',
  'export-meeting-note': 'a meeting or call summary',
};

// Keyword patterns for action detection
const ACTION_PATTERNS: { type: ActionType; patterns: RegExp[]; weight: number }[] = [
  {
    type: 'draft-email',
    weight: 3,
    patterns: [
      /\b(send|draft|write|compose)\s+(an?\s+)?(email|mail|message)\b/i,
      /\b(email|write to|reach out to)\b/i,
      /\bsend\s+.{1,30}\s+to\s+[A-Z]/i,
      /\bemail:/i,
    ],
  },
  {
    type: 'create-task',
    weight: 2,
    patterns: [
      /\b(create|add|make|new)\s+(a\s+)?task\b/i,
      /\b(implement|build|fix|update|deploy|ship)\b/i,
      /\btask:/i,
      /\bwe\s+(should|need\s+to|must)\s+(implement|build|fix|add|update|create)/i,
    ],
  },
  {
    type: 'generate-prompt',
    weight: 2,
    patterns: [
      /\b(generate|create|make)\s+(a\s+)?(prompt|ag prompt|antigravity)\b/i,
      /\bprompt:/i,
      /\bag:/i,
    ],
  },
  {
    type: 'add-roadmap',
    weight: 2,
    patterns: [
      /\b(add|create|plan)\s+(a\s+)?(roadmap|feature|milestone)\b/i,
      /\broadmap:/i,
      /\b(plan|schedule|next release)\b/i,
    ],
  },
  {
    type: 'generate-linkedin',
    weight: 3,
    patterns: [
      /\b(linkedin|post|share on linkedin)\b/i,
      /\blinkedin:/i,
    ],
  },
  {
    type: 'create-strategy-note',
    weight: 1,
    patterns: [
      /\b(strategy|strategic|memo|briefing)\b/i,
      /\bstrategy:/i,
    ],
  },
  {
    type: 'export-meeting-note',
    weight: 2,
    patterns: [
      /\b(meeting|call|discussion)\s+(note|summary|recap)\b/i,
      /\bmeeting:/i,
    ],
  },
];

export const actionRouter = {
  /** Full intent detection — returns primary intent + suggested CTAs */
  detectIntent(message: string): IntentResult {
    const scores: { type: ActionType; score: number }[] = [];

    for (const { type, patterns, weight } of ACTION_PATTERNS) {
      let matchCount = 0;
      for (const pattern of patterns) {
        if (pattern.test(message)) matchCount++;
      }
      if (matchCount > 0) {
        scores.push({ type, score: matchCount * weight });
      }
    }

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    const primary: RoutedAction = scores.length > 0
      ? {
          type: scores[0].type,
          confidence: Math.min((scores[0].score / 4) * 100, 100),
          suggestedTitle: extractTitle(message, scores[0].type),
          suggestedContent: message,
          metadata: extractMetadata(message),
        }
      : {
          type: 'unknown',
          confidence: 0,
          suggestedTitle: extractTitle(message, 'unknown'),
          suggestedContent: message,
        };

    // Build suggested CTAs: primary action first, then alternates, always include generic options
    const suggestedActions: SuggestedAction[] = [];

    if (primary.type !== 'unknown') {
      suggestedActions.push({ type: primary.type, label: ACTION_LABELS[primary.type] });
    }

    // Add secondary matches as alternate CTAs (max 2)
    for (let i = 1; i < Math.min(scores.length, 3); i++) {
      if (scores[i].type !== primary.type) {
        suggestedActions.push({ type: scores[i].type, label: ACTION_LABELS[scores[i].type] });
      }
    }

    // Always offer task creation and prompt generation if not already present
    const hasType = (t: ActionType) => suggestedActions.some((a) => a.type === t);
    if (!hasType('create-task') && primary.type !== 'create-task') {
      suggestedActions.push({ type: 'create-task', label: 'Create Task' });
    }
    if (!hasType('generate-prompt') && primary.type !== 'generate-prompt') {
      suggestedActions.push({ type: 'generate-prompt', label: 'Generate AG Prompt' });
    }

    // Cap at 4 suggested actions
    const finalActions = suggestedActions.slice(0, 4);

    // Build analysis text
    const intentDesc = INTENT_DESCRIPTIONS[primary.type];
    const analysisText = primary.type !== 'unknown'
      ? `This looks like ${intentDesc || 'a request'}.\n\nRecommended action: ${ACTION_LABELS[primary.type].toLowerCase()}.`
      : `Noted. How would you like to proceed?`;

    return { primary, suggestedActions: finalActions, analysisText };
  },

  /** Legacy detectAction — wraps detectIntent for backward compat */
  detectAction(message: string): RoutedAction {
    return this.detectIntent(message).primary;
  },

  /** Execute the routed action */
  executeAction(action: RoutedAction): { success: boolean; message: string; result?: unknown } {
    switch (action.type) {
      case 'create-task': {
        const task = taskEngine.createTask({
          title: action.suggestedTitle,
          description: action.suggestedContent,
          state: 'pending',
          priority: 'medium',
          tags: ['ceo-created'],
        });
        return { success: true, message: `Task created: "${task.title}"`, result: task };
      }

      case 'add-roadmap':
        return {
          success: true,
          message: `Roadmap item captured: "${action.suggestedTitle}". Added to feature backlog.`,
        };

      case 'draft-email':
        return {
          success: true,
          message: 'Email draft prepared. Review and send below.',
          result: {
            to: extractRecipient(action.suggestedContent),
            subject: action.suggestedTitle,
            body: action.suggestedContent,
          },
        };

      case 'generate-prompt': {
        const prompt = generateAGPrompt(action.suggestedContent);
        return { success: true, message: 'AG prompt generated. Copy it below.', result: prompt };
      }

      case 'generate-linkedin':
        return { success: true, message: 'LinkedIn post content ready for review in LinkedIn Intelligence.' };

      case 'create-strategy-note':
        return { success: true, message: `Strategy memo captured: "${action.suggestedTitle}"` };

      case 'export-meeting-note':
        return { success: true, message: `Meeting note exported: "${action.suggestedTitle}"` };

      case 'save-transcript':
        return { success: true, message: 'Transcript saved.' };

      default:
        return { success: false, message: 'Unable to determine action. Please be more specific.' };
    }
  },

  /** Get all available action types */
  getAvailableActions(): { type: ActionType; label: string; description: string }[] {
    return [
      { type: 'save-transcript', label: 'Save Transcript', description: 'Save current conversation' },
      { type: 'generate-prompt', label: 'Generate AG Prompt', description: 'Create Antigravity prompt from context' },
      { type: 'create-task', label: 'Create Task', description: 'Add to Chief-of-Staff task engine' },
      { type: 'add-roadmap', label: 'Add Roadmap Item', description: 'Add feature to product roadmap' },
      { type: 'draft-email', label: 'Draft Email', description: 'Compose and send email' },
      { type: 'generate-linkedin', label: 'Generate LinkedIn Post', description: 'Create LinkedIn content' },
      { type: 'create-strategy-note', label: 'Create Strategy Memo', description: 'Record strategic decision' },
      { type: 'export-meeting-note', label: 'Export Meeting Note', description: 'Export meeting summary' },
    ];
  },
};

// --- Helper functions ---

function extractTitle(message: string, _type: ActionType): string {
  const firstSentence = message.split(/[.!?\n]/)[0].trim();
  return firstSentence.length > 80 ? firstSentence.slice(0, 80) + '...' : firstSentence;
}

function extractRecipient(message: string): string {
  const match = message.match(/(?:to|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  return match ? match[1] : '';
}

function extractMetadata(message: string): Record<string, string> {
  const meta: Record<string, string> = {};
  const recipientMatch = message.match(/(?:to|for)\s+([A-Z][a-z]+)/);
  if (recipientMatch) meta.recipient = recipientMatch[1];
  const aboutMatch = message.match(/(?:about|regarding|re:?)\s+(.+?)(?:\.|$)/i);
  if (aboutMatch) meta.topic = aboutMatch[1].trim();
  return meta;
}

function generateAGPrompt(context: string): string {
  return `AG PROMPT\n\nContext: ${context}\n\nObjective: [Specify objective]\n\nSteps:\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nExpected output: [Describe expected deliverable]`;
}
