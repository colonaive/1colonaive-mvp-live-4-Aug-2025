// Chief-of-Staff — Chat Engine
// Manages CEO ↔ AI conversation state, transcript storage, and message handling.
// Supports contextual CTA actions attached to assistant messages.

export type SuggestedAction = {
  type: string;
  label: string;
  executed?: boolean;
};

export interface ChatMessage {
  id: string;
  role: 'ceo' | 'assistant';
  content: string;
  timestamp: string;
  contextTags?: string[];
  actionTaken?: string;
  suggestedActions?: SuggestedAction[];
}

export interface ChatTranscript {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  archived: boolean;
  summary?: string;
}

let currentMessages: ChatMessage[] = [];
let transcripts: ChatTranscript[] = [];

export const chatEngine = {
  /** Send a message from the CEO */
  sendMessage(content: string, contextTags?: string[]): ChatMessage {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'ceo',
      content,
      timestamp: new Date().toISOString(),
      contextTags,
    };
    currentMessages.push(msg);
    return msg;
  },

  /** Add an assistant response with optional CTA buttons */
  addResponse(content: string, actionTaken?: string, suggestedActions?: SuggestedAction[]): ChatMessage {
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
      actionTaken,
      suggestedActions,
    };
    currentMessages.push(msg);
    return msg;
  },

  /** Mark a suggested action as executed on a specific message */
  markActionExecuted(messageId: string, actionType: string): void {
    const msg = currentMessages.find((m) => m.id === messageId);
    if (msg?.suggestedActions) {
      const action = msg.suggestedActions.find((a) => a.type === actionType);
      if (action) action.executed = true;
    }
  },

  /** Get all current messages */
  getMessages(): ChatMessage[] {
    return [...currentMessages];
  },

  /** Get the last N messages */
  getRecentMessages(count: number): ChatMessage[] {
    return currentMessages.slice(-count);
  },

  /** Get conversation context as a single string (for prompt generation) */
  getConversationContext(): string {
    return currentMessages
      .map((m) => `[${m.role.toUpperCase()}] ${m.content}`)
      .join('\n\n');
  },

  /** Save current conversation as a transcript */
  saveTranscript(summary?: string): ChatTranscript {
    const transcript: ChatTranscript = {
      id: `transcript-${Date.now()}`,
      messages: [...currentMessages],
      createdAt: new Date().toISOString(),
      archived: false,
      summary,
    };
    transcripts.push(transcript);
    return transcript;
  },

  /** Archive a transcript */
  archiveTranscript(transcriptId: string): boolean {
    const t = transcripts.find((tr) => tr.id === transcriptId);
    if (!t) return false;
    t.archived = true;
    return true;
  },

  /** Get all transcripts */
  getTranscripts(): ChatTranscript[] {
    return [...transcripts];
  },

  /** Get non-archived transcripts */
  getActiveTranscripts(): ChatTranscript[] {
    return transcripts.filter((t) => !t.archived);
  },

  /** Clear current conversation */
  clearConversation(): void {
    currentMessages = [];
  },

  /** Get message count */
  getMessageCount(): number {
    return currentMessages.length;
  },

  /** Reset everything */
  reset(): void {
    currentMessages = [];
    transcripts = [];
  },
};
