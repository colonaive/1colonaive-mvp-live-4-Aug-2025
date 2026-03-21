import React, { useState, useEffect } from 'react';
import { ArrowLeft, Inbox, RefreshCw, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cockpitService, type InboxEmail } from '@/services/cockpitService';
import { generateFounderBriefing, type FounderBriefing } from '@/lib/founderBriefing';

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-SG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

export default function EmailIntelligencePage() {
  const navigate = useNavigate();
  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);
  const [founderBriefing, setFounderBriefing] = useState<FounderBriefing | null>(null);
  const [founderLoading, setFounderLoading] = useState(true);

  const loadInbox = async () => {
    setInboxLoading(true);
    setInboxError(null);
    try {
      const data = await cockpitService.fetchInboxEmails();
      setEmails(data);
    } catch (err: unknown) {
      setInboxError(err instanceof Error ? err.message : 'Failed to load emails');
    } finally {
      setInboxLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
    generateFounderBriefing()
      .then((b) => setFounderBriefing(b))
      .catch(() => {})
      .finally(() => setFounderLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/admin/ceo-cockpit')} className="text-white/70 hover:text-white transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Email Intelligence</h1>
            <p className="text-sm text-white/60">Inbox triage & classified email signals</p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

        {/* Classified Email Signals */}
        {!founderLoading && founderBriefing?.emailIntelligence && founderBriefing.emailIntelligence.totalIngested > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Classified Signals</h2>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {founderBriefing.emailIntelligence.totalIngested} ingested
              </span>
            </div>

            {founderBriefing.emailIntelligence.takeAction.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase mb-2">Execute Now</p>
                <div className="space-y-2">
                  {founderBriefing.emailIntelligence.takeAction.map((email) => (
                    <div key={email.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-red-50/50 dark:bg-red-900/10 rounded-lg px-3 py-2">
                      <span title={`Confidence: ${email.confidence_level}`} className="flex-shrink-0">
                        {email.confidence_level === 'high' ? '●' : email.confidence_level === 'medium' ? '◐' : '○'}
                      </span>
                      <span className={`text-[10px] px-1 py-0.5 rounded flex-shrink-0 ${
                        email.source_origin === 'direct_email' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                        : email.source_origin === 'manual_entry' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {email.source_origin === 'direct_email' ? 'Email' : email.source_origin === 'manual_entry' ? 'Verified' : 'AI'}
                      </span>
                      <span className="truncate">{email.sender_name} — {email.subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {founderBriefing.emailIntelligence.investigate.length > 0 && (
              <div>
                <p className="text-xs font-medium text-amber-600 dark:text-amber-400 uppercase mb-2">Watch</p>
                <div className="space-y-2">
                  {founderBriefing.emailIntelligence.investigate.map((email) => (
                    <div key={email.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg px-3 py-2">
                      <span title={`Confidence: ${email.confidence_level}`} className="flex-shrink-0">
                        {email.confidence_level === 'high' ? '●' : email.confidence_level === 'medium' ? '◐' : '○'}
                      </span>
                      <span className={`text-[10px] px-1 py-0.5 rounded flex-shrink-0 ${
                        email.source_origin === 'direct_email' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300'
                        : email.source_origin === 'manual_entry' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                      }`}>
                        {email.source_origin === 'direct_email' ? 'Email' : email.source_origin === 'manual_entry' ? 'Verified' : 'AI'}
                      </span>
                      <span className="truncate">{email.sender_name} — {email.subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Raw Inbox */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-[#0F766E]" />
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Inbox — admin@saversmed.com</h2>
            </div>
            <button onClick={loadInbox} className="text-xs text-blue-600 hover:underline">Refresh</button>
          </div>

          {inboxLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw size={18} className="animate-spin text-gray-400" />
              <span className="ml-2 text-sm text-gray-400">Loading emails...</span>
            </div>
          ) : inboxError ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle size={24} className="text-amber-400 mb-2" />
              <p className="text-sm text-amber-600 dark:text-amber-400">{inboxError}</p>
              <button onClick={loadInbox} className="mt-2 text-xs text-blue-600 hover:underline">Retry</button>
            </div>
          ) : emails.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No emails found.</p>
          ) : (
            <div className="space-y-3">
              {emails.map((e) => (
                <div
                  key={e.id}
                  className={`border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 ${
                    !e.isRead ? 'pl-3 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <p className={`text-sm ${e.isRead ? 'text-gray-700 dark:text-gray-300' : 'font-semibold text-gray-900 dark:text-white'} line-clamp-1`}>
                    {e.subject}
                  </p>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[60%]">{e.sender}</span>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{formatDateTime(e.receivedDateTime)}</span>
                  </div>
                  {e.preview && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{e.preview}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
