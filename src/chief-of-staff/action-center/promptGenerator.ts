// Chief-of-Staff — AG Prompt Generator
// Converts CEO chat context into structured Antigravity prompts.

import { chatEngine, type ChatMessage } from './chatEngine';

export interface AGPrompt {
  id: string;
  title: string;
  prompt: string;
  sourceMessages: string[];
  generatedAt: string;
  status: 'generated' | 'copied' | 'sent';
}

let promptHistory: AGPrompt[] = [];

export const promptGenerator = {
  /** Generate an AG prompt from recent chat context */
  generateFromChat(title?: string): AGPrompt {
    const messages = chatEngine.getRecentMessages(10);
    const ceoMessages = messages.filter((m) => m.role === 'ceo');

    const context = ceoMessages.map((m) => m.content).join('\n');
    const inferredTitle = title || extractInferredTitle(ceoMessages);

    const prompt = formatAGPrompt(inferredTitle, context, ceoMessages);

    const agPrompt: AGPrompt = {
      id: `ag-${Date.now()}`,
      title: inferredTitle,
      prompt,
      sourceMessages: ceoMessages.map((m) => m.id),
      generatedAt: new Date().toISOString(),
      status: 'generated',
    };

    promptHistory.push(agPrompt);
    return agPrompt;
  },

  /** Generate from a specific text input */
  generateFromText(text: string, title?: string): AGPrompt {
    const inferredTitle = title || text.split(/[.!?\n]/)[0].trim().slice(0, 60);

    const prompt = formatAGPrompt(inferredTitle, text, []);

    const agPrompt: AGPrompt = {
      id: `ag-${Date.now()}`,
      title: inferredTitle,
      prompt,
      sourceMessages: [],
      generatedAt: new Date().toISOString(),
      status: 'generated',
    };

    promptHistory.push(agPrompt);
    return agPrompt;
  },

  /** Mark prompt as copied */
  markCopied(promptId: string): boolean {
    const p = promptHistory.find((pr) => pr.id === promptId);
    if (!p) return false;
    p.status = 'copied';
    return true;
  },

  /** Mark prompt as sent to AG */
  markSent(promptId: string): boolean {
    const p = promptHistory.find((pr) => pr.id === promptId);
    if (!p) return false;
    p.status = 'sent';
    return true;
  },

  /** Get all generated prompts */
  getHistory(): AGPrompt[] {
    return [...promptHistory];
  },

  /** Get recent prompts */
  getRecent(count: number): AGPrompt[] {
    return promptHistory.slice(-count);
  },

  /** Clear history */
  reset(): void {
    promptHistory = [];
  },
};

// --- Formatting helpers ---

function extractInferredTitle(messages: ChatMessage[]): string {
  if (messages.length === 0) return 'Untitled AG Prompt';
  const first = messages[0].content;
  const title = first.split(/[.!?\n]/)[0].trim();
  return title.length > 60 ? title.slice(0, 60) + '...' : title;
}

function formatAGPrompt(title: string, context: string, messages: ChatMessage[]): string {
  const lines = [
    'AG PROMPT',
    '=========',
    '',
    `Title: ${title}`,
    `Generated: ${new Date().toISOString()}`,
    '',
    '## Context',
    context,
    '',
  ];

  if (messages.length > 0) {
    lines.push('## CEO Instructions');
    messages.forEach((m, i) => {
      lines.push(`${i + 1}. ${m.content}`);
    });
    lines.push('');
  }

  lines.push(
    '## Objective',
    '[Define primary objective]',
    '',
    '## Steps',
    '1. [Step 1]',
    '2. [Step 2]',
    '3. [Step 3]',
    '',
    '## Expected Output',
    '[Describe deliverable]',
    '',
    '## Constraints',
    '- Work on main branch only',
    '- Commit and push automatically',
    '- Verify on production after deploy',
  );

  return lines.join('\n');
}
