import React, { useState, useRef, useEffect } from 'react';
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
} from 'lucide-react';
import { chatEngine, type ChatMessage } from '@/chief-of-staff/action-center/chatEngine';
import { voiceInput } from '@/chief-of-staff/action-center/voiceInput';
import { actionRouter, type ActionType } from '@/chief-of-staff/action-center/actionRouter';
import { promptGenerator } from '@/chief-of-staff/action-center/promptGenerator';
import { emailComposer } from '@/chief-of-staff/action-center/emailComposer';

const ACTION_ICONS: Record<string, React.ReactNode> = {
  'create-task': <ListChecks size={14} />,
  'draft-email': <Mail size={14} />,
  'generate-prompt': <Wand2 size={14} />,
  'add-roadmap': <FileText size={14} />,
  'generate-linkedin': <Linkedin size={14} />,
  'create-strategy-note': <BookOpen size={14} />,
  'save-transcript': <Save size={14} />,
  'export-meeting-note': <FileText size={14} />,
};

const ActionCenterChat: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [emailDraftId, setEmailDraftId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<{ stop: () => void } | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSend = () => {
    if (!input.trim()) return;

    // Add CEO message
    chatEngine.sendMessage(input.trim());
    const detected = actionRouter.detectAction(input.trim());

    // Generate assistant response based on detected action
    let responseText: string;
    if (detected.confidence >= 50) {
      const result = actionRouter.executeAction(detected);
      responseText = result.message;

      // Handle specific action results
      if (detected.type === 'generate-prompt') {
        const prompt = promptGenerator.generateFromText(input.trim());
        setGeneratedPrompt(prompt.prompt);
      }
      if (detected.type === 'draft-email') {
        const draft = emailComposer.createDraft(input.trim());
        setEmailDraftId(draft.id);
        responseText = `Email draft created for: ${draft.to || '(specify recipient)'}. Subject: "${draft.subject}". Review in the email panel.`;
      }
    } else {
      responseText = `Understood. I've noted: "${input.trim().slice(0, 100)}${input.trim().length > 100 ? '...' : ''}". Would you like me to create a task, draft an email, or generate an AG prompt from this?`;
    }

    chatEngine.addResponse(responseText, detected.type !== 'unknown' ? detected.type : undefined);

    setMessages(chatEngine.getMessages());
    setInput('');
    setGeneratedPrompt(null);
    setEmailDraftId(null);
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
      chatEngine.saveTranscript();
      chatEngine.addResponse('Transcript saved successfully.');
      setMessages([...chatEngine.getMessages()]);
      return;
    }

    if (type === 'generate-prompt') {
      const prompt = promptGenerator.generateFromChat();
      setGeneratedPrompt(prompt.prompt);
      chatEngine.addResponse(`AG prompt generated: "${prompt.title}". Copy it below.`);
      setMessages([...chatEngine.getMessages()]);
      return;
    }

    // For other actions, pre-fill the input
    const labels: Record<string, string> = {
      'create-task': 'Task: ',
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
            onClick={() => { chatEngine.clearConversation(); setMessages([]); setIsExpanded(false); }}
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

      {/* Messages */}
      <div className="h-64 overflow-y-auto px-5 py-3 space-y-3">
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
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                msg.role === 'ceo'
                  ? 'bg-[#0A385A] text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[9px] opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {msg.actionTaken && (
                  <span className="text-[9px] bg-white/10 dark:bg-black/10 px-1.5 py-0.5 rounded uppercase">
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
          return (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-blue-700 dark:text-blue-300">Email Draft</span>
                <span className="text-[10px] text-blue-500">{draft.status}</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <p className="text-blue-800 dark:text-blue-200"><strong>To:</strong> {draft.to || '(not set)'}</p>
                <p className="text-blue-800 dark:text-blue-200"><strong>Subject:</strong> {draft.subject}</p>
                <p className="text-blue-700 dark:text-blue-300 mt-1 whitespace-pre-wrap line-clamp-3">{draft.body}</p>
              </div>
            </div>
          );
        })()}

        <div ref={messagesEndRef} />
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
          placeholder={isListening ? 'Listening...' : 'Type a message or instruction...'}
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
