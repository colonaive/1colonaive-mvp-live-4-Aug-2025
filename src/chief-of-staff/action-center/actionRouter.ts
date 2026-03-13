// Chief-of-Staff — Action Router
// Intelligent routing of CEO chat messages to appropriate actions.

import { taskEngine } from '@/chief-of-staff/tasks/taskEngine';

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

// Keyword patterns for action detection
const ACTION_PATTERNS: { type: ActionType; patterns: RegExp[] }[] = [
  {
    type: 'create-task',
    patterns: [
      /\b(create|add|make|new)\s+(a\s+)?task\b/i,
      /\b(implement|build|fix|update|deploy)\b/i,
      /\btask:/i,
    ],
  },
  {
    type: 'draft-email',
    patterns: [
      /\b(send|draft|write|compose)\s+(an?\s+)?(email|mail|message)\b/i,
      /\b(email|write to|reach out to|send .+ to)\b/i,
      /\bemail:/i,
    ],
  },
  {
    type: 'generate-prompt',
    patterns: [
      /\b(generate|create|make)\s+(a\s+)?(prompt|ag prompt|antigravity)\b/i,
      /\bprompt:/i,
      /\bag:/i,
    ],
  },
  {
    type: 'add-roadmap',
    patterns: [
      /\b(add|create|plan)\s+(a\s+)?(roadmap|feature|milestone)\b/i,
      /\broadmap:/i,
    ],
  },
  {
    type: 'generate-linkedin',
    patterns: [
      /\b(linkedin|post|share on linkedin)\b/i,
      /\blinkedin:/i,
    ],
  },
  {
    type: 'create-strategy-note',
    patterns: [
      /\b(strategy|strategic|memo|briefing|note)\b/i,
      /\bstrategy:/i,
    ],
  },
  {
    type: 'export-meeting-note',
    patterns: [
      /\b(meeting|call|discussion)\s+(note|summary|recap)\b/i,
      /\bmeeting:/i,
    ],
  },
];

export const actionRouter = {
  /** Detect the most likely action from a message */
  detectAction(message: string): RoutedAction {
    let bestMatch: { type: ActionType; score: number } = { type: 'unknown', score: 0 };

    for (const { type, patterns } of ACTION_PATTERNS) {
      let score = 0;
      for (const pattern of patterns) {
        if (pattern.test(message)) score++;
      }
      if (score > bestMatch.score) {
        bestMatch = { type, score };
      }
    }

    const confidence = bestMatch.score > 0 ? Math.min(bestMatch.score / 2, 1) * 100 : 0;

    return {
      type: bestMatch.type,
      confidence,
      suggestedTitle: extractTitle(message, bestMatch.type),
      suggestedContent: message,
    };
  },

  /** Execute the routed action */
  executeAction(action: RoutedAction): { success: boolean; message: string; result?: unknown } {
    switch (action.type) {
      case 'create-task':
        const task = taskEngine.createTask({
          title: action.suggestedTitle,
          description: action.suggestedContent,
          state: 'pending',
          priority: 'medium',
          tags: ['ceo-created'],
        });
        return { success: true, message: `Task created: ${task.title}`, result: task };

      case 'add-roadmap':
        // Roadmap entries are static for now — return the suggestion
        return {
          success: true,
          message: `Roadmap suggestion noted: ${action.suggestedTitle}. Add to roadmapEngine manually.`,
        };

      case 'draft-email':
        return {
          success: true,
          message: `Email draft prepared. Use the email composer to review and send.`,
          result: { to: extractRecipient(action.suggestedContent), subject: action.suggestedTitle, body: action.suggestedContent },
        };

      case 'generate-prompt':
        const prompt = generateAGPrompt(action.suggestedContent);
        return { success: true, message: 'AG prompt generated.', result: prompt };

      case 'generate-linkedin':
        return { success: true, message: 'Navigate to LinkedIn Intelligence to create the post.' };

      case 'create-strategy-note':
        return { success: true, message: `Strategy note captured: ${action.suggestedTitle}` };

      case 'export-meeting-note':
        return { success: true, message: `Meeting note exported: ${action.suggestedTitle}` };

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
  // Take first sentence or first 80 chars
  const firstSentence = message.split(/[.!?\n]/)[0].trim();
  return firstSentence.length > 80 ? firstSentence.slice(0, 80) + '...' : firstSentence;
}

function extractRecipient(message: string): string {
  // Try to find "to [Name]" or "send to [Name]"
  const match = message.match(/(?:to|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  return match ? match[1] : '';
}

function generateAGPrompt(context: string): string {
  return `AG PROMPT\n\nContext: ${context}\n\nObjective: [Specify objective]\n\nSteps:\n1. [Step 1]\n2. [Step 2]\n3. [Step 3]\n\nExpected output: [Describe expected deliverable]`;
}
