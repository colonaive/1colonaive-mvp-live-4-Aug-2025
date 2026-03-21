import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageSquare,
  Mic,
  MicOff,
  Send,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ListChecks,
  Mail,
  FileText,
  Wand2,
  Linkedin,
  BookOpen,
  Save,
  MoreHorizontal,
  RefreshCw,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { chatEngine, type ChatMessage, type SuggestedAction } from '@/chief-of-staff/action-center/chatEngine';
import { voiceInput } from '@/chief-of-staff/action-center/voiceInput';
import { actionRouter, type ActionType } from '@/chief-of-staff/action-center/actionRouter';
import { promptGenerator } from '@/chief-of-staff/action-center/promptGenerator';
import { emailComposer } from '@/chief-of-staff/action-center/emailComposer';
import { decisionMemoryEngine } from '@/chief-of-staff/decision-memory/decisionMemoryEngine';
import { decisionSuggestions, type MemorySuggestion } from '@/chief-of-staff/decision-memory/decisionSuggestions';

const ACTION_ICONS: Record<string, React.ReactNode> = {
  'create-task': <ListChecks size={12} />,
  'draft-email': <Mail size={12} />,
  'generate-prompt': <Wand2 size={12} />,
  'add-roadmap': <MapPin size={12} />,
  'generate-linkedin': <Linkedin size={12} />,
  'create-strategy-note': <BookOpen size={12} />,
  'save-transcript': <Save size={12} />,
  'export-meeting-note': <FileText size={12} />,
};

// Pending action state — when a CTA needs follow-up context before executing
type PendingAction = {
  type: string;
  messageId?: string;
} | null;

interface ActionCenterChatProps {
  /** Called whenever an action modifies shared state (tasks, roadmap, etc.) so the parent can re-render widgets */
  onAction?: () => void;
}

const ActionCenterChat: React.FC<ActionCenterChatProps> = ({ onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [emailDraftId, setEmailDraftId] = useState<string | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<{ stop: () => void } | null>(null);

  // Scroll within the chat container only — never the page
  const scrollToBottom = useCallback(() => {
    const el = chatContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, generatedPrompt, emailDraftId, scrollToBottom]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Load decision memory on first expand
  useEffect(() => {
    if (isExpanded) {
      decisionMemoryEngine.ensureLoaded().catch(() => {});
    }
  }, [isExpanded]);

  const refreshMessages = useCallback(() => {
    setMessages([...chatEngine.getMessages()]);
  }, []);

  const notifyParent = useCallback(() => {
    onAction?.();
  }, [onAction]);

  // --- Check if there's enough CEO context for an action ---
  const getCEOContext = (): string => {
    const ceoMsgs = chatEngine.getMessages().filter((m) => m.role === 'ceo');
    return ceoMsgs.map((m) => m.content).join(' ');
  };

  const hasSubstantiveContext = (): boolean => {
    const ctx = getCEOContext();
    return ctx.trim().length >= 15;
  };

  // Map CTA action types to memory action types
  const memoryActionType = (ctaType: string): string => {
    const map: Record<string, string> = {
      'draft-email': 'email',
      'create-task': 'task',
      'generate-prompt': 'prompt',
      'add-roadmap': 'roadmap',
      'generate-linkedin': 'linkedin',
      'create-strategy-note': 'strategy',
    };
    return map[ctaType] || ctaType;
  };

  // Extract entity name from a message (e.g. "Kevin", "Aaron")
  const extractEntity = (text: string): string | undefined => {
    const knownNames = ['kevin', 'aaron', 'qiang', 'manish', 'daniel', 'francis', 'lawrence'];
    const lower = text.toLowerCase();
    for (const name of knownNames) {
      if (lower.includes(name)) return name.charAt(0).toUpperCase() + name.slice(1);
    }
    const match = text.match(/(?:to|for|with|from)\s+([A-Z][a-z]+)/);
    return match?.[1];
  };

  // Record action to decision memory (fire-and-forget)
  const recordToMemory = (ctaType: string, context: string) => {
    decisionMemoryEngine.recordAction({
      action_type: memoryActionType(ctaType),
      entity: extractEntity(context),
      context_summary: context.slice(0, 120),
    }).catch(() => {});
  };

  // --- CTA action handler ---
  const handleCTAAction = (actionType: string, messageId?: string) => {
    if (messageId) {
      chatEngine.markActionExecuted(messageId, actionType);
    }

    const lastCeoContent = (() => {
      const ceoMsgs = chatEngine.getMessages().filter((m) => m.role === 'ceo');
      return ceoMsgs[ceoMsgs.length - 1]?.content || '';
    })();

    switch (actionType) {
      case 'draft-email': {
        if (!hasSubstantiveContext()) {
          chatEngine.addResponse(
            'I need a bit more context to draft the email.\n\nWho should I send it to, and what should the email be about?'
          );
          setPendingAction({ type: 'draft-email', messageId });
          refreshMessages();
          inputRef.current?.focus();
          return;
        }
        const draft = emailComposer.createDraft(lastCeoContent);
        setEmailDraftId(draft.id);
        chatEngine.addResponse(
          `Email draft created.\n\nTo: ${draft.to || '(specify recipient)'}\nSubject: "${draft.subject}"\n\nReview and send below.`,
          'draft-email'
        );
        break;
      }

      case 'create-task': {
        if (!hasSubstantiveContext()) {
          chatEngine.addResponse(
            'What task would you like to create?\n\nPlease describe the task — e.g. "Implement radar scoring update" or "Fix LinkedIn automation pipeline".'
          );
          setPendingAction({ type: 'create-task', messageId });
          refreshMessages();
          inputRef.current?.focus();
          return;
        }
        const detected = actionRouter.detectAction(lastCeoContent);
        const result = actionRouter.executeAction({ ...detected, type: 'create-task' });
        chatEngine.addResponse(
          `${result.message}\n\nTask added to Chief-of-Staff dashboard.`,
          'create-task',
          [{ type: 'generate-prompt', label: 'Generate AG Prompt' }]
        );
        notifyParent();
        break;
      }

      case 'generate-prompt': {
        if (!hasSubstantiveContext()) {
          chatEngine.addResponse(
            'I need more context to generate a useful AG prompt.\n\nWhat problem are you trying to solve, or what feature should the prompt address?'
          );
          setPendingAction({ type: 'generate-prompt', messageId });
          refreshMessages();
          inputRef.current?.focus();
          return;
        }
        const prompt = promptGenerator.generateFromChat();
        setGeneratedPrompt(prompt.prompt);
        chatEngine.addResponse(
          `AG prompt generated: "${prompt.title}"\n\nCopy or send to Antigravity below.`,
          'generate-prompt'
        );
        break;
      }

      case 'add-roadmap': {
        if (!hasSubstantiveContext()) {
          chatEngine.addResponse(
            'What feature or milestone should I add to the roadmap?\n\nDescribe the item and its priority.'
          );
          setPendingAction({ type: 'add-roadmap', messageId });
          refreshMessages();
          inputRef.current?.focus();
          return;
        }
        chatEngine.addResponse(
          `Roadmap item captured: "${lastCeoContent.slice(0, 60)}..."\n\nAdded to product backlog.`,
          'add-roadmap',
          [{ type: 'create-task', label: 'Create Task' }]
        );
        notifyParent();
        break;
      }

      case 'generate-linkedin': {
        chatEngine.addResponse(
          'LinkedIn post content staged. Navigate to LinkedIn Intelligence widget to finalize and publish.',
          'generate-linkedin'
        );
        break;
      }

      case 'create-strategy-note': {
        if (!hasSubstantiveContext()) {
          chatEngine.addResponse('What strategic insight or decision should I capture?');
          setPendingAction({ type: 'create-strategy-note', messageId });
          refreshMessages();
          inputRef.current?.focus();
          return;
        }
        chatEngine.addResponse(
          `Strategy memo saved: "${lastCeoContent.slice(0, 60)}..."`,
          'create-strategy-note'
        );
        break;
      }

      case 'export-meeting-note': {
        chatEngine.addResponse(
          'Meeting note exported from conversation context.',
          'export-meeting-note'
        );
        break;
      }

      case 'save-transcript': {
        chatEngine.saveTranscript();
        chatEngine.addResponse('Transcript saved successfully.');
        break;
      }

      default:
        chatEngine.addResponse('Action not recognized.');
    }

    // Record action to decision memory
    recordToMemory(actionType, lastCeoContent);

    setPendingAction(null);
    refreshMessages();
  };

  // --- Send handler with intent detection + memory suggestions + pending action ---
  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');

    // Add CEO message
    chatEngine.sendMessage(text);

    // If there's a pending action waiting for context, fulfill it now
    if (pendingAction) {
      const actionType = pendingAction.type;
      setPendingAction(null);

      switch (actionType) {
        case 'create-task': {
          const detected = actionRouter.detectAction(text);
          const result = actionRouter.executeAction({ ...detected, type: 'create-task' });
          chatEngine.addResponse(
            `${result.message}\n\nTask added to Chief-of-Staff dashboard.`,
            'create-task',
            [{ type: 'generate-prompt', label: 'Generate AG Prompt' }]
          );
          recordToMemory('create-task', text);
          notifyParent();
          break;
        }
        case 'generate-prompt': {
          const prompt = promptGenerator.generateFromText(text);
          setGeneratedPrompt(prompt.prompt);
          chatEngine.addResponse(
            `AG prompt generated: "${prompt.title}"\n\nCopy or send to Antigravity below.`,
            'generate-prompt'
          );
          recordToMemory('generate-prompt', text);
          break;
        }
        case 'draft-email': {
          const draft = emailComposer.createDraft(text);
          setEmailDraftId(draft.id);
          chatEngine.addResponse(
            `Email draft created.\n\nTo: ${draft.to || '(specify recipient)'}\nSubject: "${draft.subject}"\n\nReview and send below.`,
            'draft-email'
          );
          recordToMemory('draft-email', text);
          break;
        }
        case 'add-roadmap': {
          chatEngine.addResponse(
            `Roadmap item captured: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"\n\nAdded to product backlog.`,
            'add-roadmap',
            [{ type: 'create-task', label: 'Create Task' }]
          );
          recordToMemory('add-roadmap', text);
          notifyParent();
          break;
        }
        case 'create-strategy-note': {
          chatEngine.addResponse(
            `Strategy memo saved: "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
            'create-strategy-note'
          );
          recordToMemory('create-strategy-note', text);
          break;
        }
        default: {
          chatEngine.addResponse(`Action completed: ${actionType}`);
        }
      }

      refreshMessages();
      return;
    }

    // Fetch memory-based suggestions (async, non-blocking)
    let memorySuggestions: MemorySuggestion[] = [];
    try {
      memorySuggestions = await decisionSuggestions.getSuggestions(text);
    } catch {
      // Memory suggestions are supplementary — don't block on failure
    }

    // Normal intent detection flow
    const intent = actionRouter.detectIntent(text);

    // Merge memory suggestions into CTA list (memory suggestions first if relevant)
    const mergeSuggestions = (intentActions: SuggestedAction[]): SuggestedAction[] => {
      const merged: SuggestedAction[] = [];
      const seen = new Set<string>();

      // Memory suggestions come first (they're personalized)
      for (const ms of memorySuggestions) {
        if (!seen.has(ms.action.type)) {
          merged.push(ms.action);
          seen.add(ms.action.type);
        }
      }

      // Then intent-based suggestions
      for (const a of intentActions) {
        if (!seen.has(a.type)) {
          merged.push(a);
          seen.add(a.type);
        }
      }

      return merged.slice(0, 4);
    };

    // Build memory hint text if we have relevant suggestions
    const memoryHint = memorySuggestions.length > 0
      ? `\n\n${memorySuggestions[0].reason}`
      : '';

    if (intent.primary.confidence >= 50) {
      if (intent.primary.type === 'draft-email') {
        const draft = emailComposer.createDraft(text);
        setEmailDraftId(draft.id);
        chatEngine.addResponse(
          `${intent.analysisText}${memoryHint}\n\nEmail draft created for: ${draft.to || '(specify recipient)'}.\nSubject: "${draft.subject}"`,
          'draft-email',
          mergeSuggestions(intent.suggestedActions.filter((a) => a.type !== 'draft-email'))
        );
        recordToMemory('draft-email', text);
      } else if (intent.primary.type === 'generate-prompt') {
        const prompt = promptGenerator.generateFromText(text);
        setGeneratedPrompt(prompt.prompt);
        chatEngine.addResponse(
          `${intent.analysisText}${memoryHint}\n\nAG prompt generated: "${prompt.title}"`,
          'generate-prompt',
          mergeSuggestions(intent.suggestedActions.filter((a) => a.type !== 'generate-prompt'))
        );
        recordToMemory('generate-prompt', text);
      } else if (intent.primary.type === 'create-task') {
        const result = actionRouter.executeAction(intent.primary);
        chatEngine.addResponse(
          `${intent.analysisText}${memoryHint}\n\n${result.message}`,
          intent.primary.type,
          mergeSuggestions(intent.suggestedActions.filter((a) => a.type !== intent.primary.type))
        );
        recordToMemory('create-task', text);
        notifyParent();
      } else {
        const result = actionRouter.executeAction(intent.primary);
        chatEngine.addResponse(
          `${intent.analysisText}${memoryHint}\n\n${result.message}`,
          intent.primary.type,
          mergeSuggestions(intent.suggestedActions.filter((a) => a.type !== intent.primary.type))
        );
        recordToMemory(intent.primary.type, text);
      }
    } else {
      // Low confidence — show memory suggestions prominently if available
      const responseText = memorySuggestions.length > 0
        ? `Understood. ${memorySuggestions[0].reason}\n\nWhat would you like to do?`
        : `Understood. I've noted: "${text.slice(0, 100)}${text.length > 100 ? '...' : ''}"\n\nWhat would you like to do with this?`;

      chatEngine.addResponse(
        responseText,
        undefined,
        mergeSuggestions(intent.suggestedActions)
      );
    }

    refreshMessages();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    if (isListening && voiceRef.current) {
      voiceRef.current.stop();
      voiceRef.current = null;
      setIsListening(false);
      return;
    }

    const handle = voiceInput.startListening({
      onResult: (transcript) => {
        setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      },
      onError: () => {
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (handle) {
      voiceRef.current = handle;
      setIsListening(true);
    }
  };

  const handleQuickAction = (type: ActionType) => {
    setShowActions(false);

    if (type === 'save-transcript') {
      handleCTAAction('save-transcript');
      return;
    }

    // For all other quick actions, go through the CTA handler which will ask for context if needed
    if (type === 'generate-prompt' || type === 'create-task') {
      handleCTAAction(type);
      return;
    }

    const labels: Record<string, string> = {
      'draft-email': 'Email: Send to ',
      'add-roadmap': 'Roadmap: Add feature ',
      'generate-linkedin': 'LinkedIn: Create post about ',
      'create-strategy-note': 'Strategy: ',
      'export-meeting-note': 'Meeting note: ',
    };
    setInput(labels[type] || '');
    inputRef.current?.focus();
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  // --- CTA Button Component ---
  const CTAButtons: React.FC<{ actions: SuggestedAction[]; messageId: string }> = ({ actions, messageId }) => {
    if (!actions || actions.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-2">
        {actions.map((action) => (
          <button
            key={action.type}
            onClick={() => handleCTAAction(action.type, messageId)}
            disabled={action.executed}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[10px] font-medium transition-all ${
              action.executed
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-default line-through'
                : 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-700 hover:bg-teal-100 dark:hover:bg-teal-900/50 hover:border-teal-400 dark:hover:border-teal-500 cursor-pointer'
            }`}
          >
            {ACTION_ICONS[action.type] || <ArrowRight size={12} />}
            <span>{action.label}</span>
            {action.executed && <Check size={10} className="ml-0.5" />}
          </button>
        ))}
      </div>
    );
  };

  // Collapsed bar
  if (!isExpanded) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-[#0A385A] to-[#0F766E] rounded-lg text-white hover:opacity-95 transition-opacity shadow-md"
        >
          <MessageSquare size={18} />
          <span className="text-sm font-medium">Ask the Chief-of-Staff AI</span>
          <ChevronDown size={16} className="ml-auto opacity-60" />
        </button>
      </div>
    );
  }

  // Expanded panel
  return (
    <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#0A385A] to-[#0F766E]">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-white" />
          <span className="text-sm font-semibold text-white">CEO Action Center</span>
          <span className="text-[10px] text-white/50 ml-2">{messages.length} messages</span>
          {pendingAction && (
            <span className="text-[10px] text-amber-300 ml-2">Awaiting input...</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Quick actions"
          >
            <MoreHorizontal size={16} />
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => { chatEngine.clearConversation(); setMessages([]); setIsExpanded(false); setGeneratedPrompt(null); setEmailDraftId(null); setPendingAction(null); }}
            className="p-1.5 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Quick Actions Dropdown */}
      {showActions && (
        <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-5 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {actionRouter.getAvailableActions().map((action) => (
              <button
                key={action.type}
                onClick={() => handleQuickAction(action.type)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:border-teal-400 dark:hover:border-teal-400 text-xs text-gray-700 dark:text-gray-300 transition-colors"
              >
                {ACTION_ICONS[action.type] || <FileText size={14} />}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages — scrolls ONLY within this container */}
      <div ref={chatContainerRef} className="h-72 overflow-y-auto px-5 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={28} className="text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Type a message or use voice to interact with the Chief-of-Staff AI.
            </p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
              Try: "Create task to update radar scoring" or "Send email to Kevin about validation results"
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'ceo' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 ${
                msg.role === 'ceo'
                  ? 'bg-[#0A385A] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Inline CTA buttons for assistant messages */}
              {msg.role === 'assistant' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <CTAButtons actions={msg.suggestedActions} messageId={msg.id} />
              )}

              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[9px] opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.actionTaken && (
                  <span className="text-[9px] bg-white/10 dark:bg-black/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    {msg.actionTaken}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Generated prompt display */}
        {generatedPrompt && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">Generated AG Prompt</span>
              <button
                onClick={() => copyToClipboard(generatedPrompt, 'prompt')}
                className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 hover:underline"
              >
                {copiedPrompt === 'prompt' ? <Check size={12} /> : <Copy size={12} />}
                {copiedPrompt === 'prompt' ? 'Copied!' : 'Copy Prompt'}
              </button>
            </div>
            <pre className="text-[10px] text-amber-800 dark:text-amber-200 whitespace-pre-wrap max-h-32 overflow-y-auto font-mono">
              {generatedPrompt}
            </pre>
          </div>
        )}

        {/* Email draft display */}
        {emailDraftId && (() => {
          const draft = emailComposer.getAllDrafts().find((d) => d.id === emailDraftId);
          if (!draft) return null;
          const isSent = draft.status === 'sent';
          const isFailed = draft.status === 'failed';
          return (
            <div className={`border rounded-lg p-3 ${isSent ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : isFailed ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[11px] font-semibold ${isSent ? 'text-emerald-700 dark:text-emerald-300' : isFailed ? 'text-red-700 dark:text-red-300' : 'text-blue-700 dark:text-blue-300'}`}>
                  {isSent ? 'Email Sent' : isFailed ? 'Email Failed' : 'Email Draft'}
                </span>
                <span className="text-[10px] text-gray-500">{draft.status}</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <p className="text-gray-800 dark:text-gray-200"><strong>To:</strong> {draft.to || '(not set)'}</p>
                {draft.cc && <p className="text-gray-800 dark:text-gray-200"><strong>Cc:</strong> {draft.cc}</p>}
                <p className="text-gray-800 dark:text-gray-200"><strong>Subject:</strong> {draft.subject}</p>
                <p className="text-gray-700 dark:text-gray-300 mt-1 whitespace-pre-wrap line-clamp-4">{draft.body}</p>
              </div>
              {!isSent && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={async () => {
                      if (!draft.to) {
                        chatEngine.addResponse('Cannot send: no recipient specified. Edit the draft first.');
                        refreshMessages();
                        return;
                      }
                      setSendingEmail(true);
                      const result = await emailComposer.sendEmail(draft.id);
                      setSendingEmail(false);
                      if (result.success) {
                        chatEngine.addResponse(
                          `Email sent successfully to ${draft.to}.\n\nWould you like to do anything else?`,
                          'email-sent',
                          [
                            { type: 'create-task', label: 'Create Follow-up Task' },
                            { type: 'save-transcript', label: 'Save Transcript' },
                          ]
                        );
                      } else {
                        chatEngine.addResponse(
                          `Email send failed: ${result.error}\n\nWould you like to retry or edit?`,
                          'email-failed'
                        );
                      }
                      refreshMessages();
                      notifyParent();
                    }}
                    disabled={sendingEmail || !draft.to}
                    className="px-3 py-1.5 rounded bg-[#0F766E] text-white text-[10px] font-medium hover:bg-[#0F766E]/90 disabled:opacity-40 transition-colors flex items-center gap-1"
                  >
                    {sendingEmail ? <RefreshCw size={10} className="animate-spin" /> : <Send size={10} />}
                    {sendingEmail ? 'Sending...' : 'Send'}
                  </button>
                  <button
                    onClick={() => {
                      setInput(`Edit email to ${draft.to}: `);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      emailComposer.deleteDraft(draft.id);
                      setEmailDraftId(null);
                      chatEngine.addResponse('Email draft discarded.');
                      refreshMessages();
                    }}
                    className="px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              )}
              {isSent && (
                <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-600 dark:text-emerald-400">
                  <Check size={12} />
                  <span>Delivered at {draft.sentAt ? new Date(draft.sentAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-2">
        {voiceInput.isSupported() && (
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            title={isListening ? 'Stop listening' : 'Voice dictation'}
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          data-chat-input
          placeholder={pendingAction ? `Describe the ${pendingAction.type.replace('-', ' ')}...` : isListening ? 'Listening...' : 'Type a message or instruction...'}
          className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-2 rounded-lg bg-[#0F766E] text-white hover:bg-[#0F766E]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ActionCenterChat;
