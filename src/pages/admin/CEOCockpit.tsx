import React, { useState, useEffect } from 'react';
import {
  Inbox,
  Shield,
  FlaskConical,
  FileText,
  TrendingUp,
  Brain,
  GitBranch,
  RefreshCw,
  AlertCircle,
  Newspaper,
} from 'lucide-react';
import CockpitCard from '@/components/cockpit/CockpitCard';
import CockpitSection from '@/components/cockpit/CockpitSection';
import { cockpitService, type InboxEmail, type CRCNewsItem } from '@/services/cockpitService';

const today = new Date().toLocaleDateString('en-SG', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const statusBadge = (status: string) => {
  const colors: Record<string, string> = {
    proposed: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    draft: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    ready: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
    published: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium uppercase tracking-wide ${colors[status] || colors.draft}`}>
      {status}
    </span>
  );
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-SG', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  });
};

const CEOCockpit: React.FC = () => {
  const regulatory = cockpitService.getRegulatoryStatus();
  const trials = cockpitService.getClinicalTrials();
  const investors = cockpitService.getInvestorHistory();
  const brochureList = cockpitService.getBrochures();
  const memoryItems = cockpitService.getProjectMemoryItems();
  const repo = cockpitService.getRepoActivityPlaceholder();

  const [emails, setEmails] = useState<InboxEmail[]>([]);
  const [inboxLoading, setInboxLoading] = useState(true);
  const [inboxError, setInboxError] = useState<string | null>(null);

  const [crcNews, setCrcNews] = useState<CRCNewsItem[]>([]);
  const [crcLoading, setCrcLoading] = useState(true);
  const [crcError, setCrcError] = useState<string | null>(null);

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

  const loadCRCNews = async () => {
    setCrcLoading(true);
    setCrcError(null);
    try {
      const data = await cockpitService.fetchCRCNews();
      setCrcNews(data);
    } catch (err: unknown) {
      setCrcError(err instanceof Error ? err.message : 'Failed to load CRC news');
    } finally {
      setCrcLoading(false);
    }
  };

  useEffect(() => { loadInbox(); loadCRCNews(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-[#0A385A] to-[#0F766E] px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">CEO Cockpit</h1>
          <p className="text-sm text-white/70 mt-1">{today}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Row 1: Intelligence & Regulatory */}
        <CockpitSection>
          {/* Inbox Intelligence */}
          <CockpitCard
            title="Inbox Intelligence"
            subtitle="admin@saversmed.com — latest 10"
            icon={<Inbox size={18} />}
            status={inboxError ? 'pending' : 'active'}
          >
            {inboxLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading emails...</span>
              </div>
            ) : inboxError ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle size={24} className="text-amber-400 mb-2" />
                <p className="text-xs text-amber-600 dark:text-amber-400">{inboxError}</p>
                <button onClick={loadInbox} className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline">Retry</button>
              </div>
            ) : emails.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No emails found.</p>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {emails.map((e) => (
                  <div
                    key={e.id}
                    className={`border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0 ${
                      !e.isRead ? 'pl-2 border-l-2 border-l-blue-500' : ''
                    }`}
                  >
                    <p className={`text-xs ${e.isRead ? 'text-gray-700 dark:text-gray-300' : 'font-semibold text-gray-900 dark:text-white'} line-clamp-1`}>
                      {e.subject}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[60%]">{e.sender}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">{formatDateTime(e.receivedDateTime)}</span>
                    </div>
                    {e.preview && (
                      <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{e.preview}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          {/* Regulatory Status */}
          <CockpitCard
            title="Regulatory Status"
            subtitle="ColonAiQ approvals & submissions"
            icon={<Shield size={18} />}
            status="active"
            lastUpdated="March 2026"
          >
            <div className="space-y-3">
              {regulatory.map((r) => (
                <div key={r.jurisdiction} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-xs">{r.jurisdiction}</span>
                    {statusBadge(r.status.toLowerCase().includes('approved') || r.status.toLowerCase().includes('registered') ? 'active' : 'proposed')}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{r.classType}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">{r.notes}</p>
                </div>
              ))}
            </div>
          </CockpitCard>

          {/* Clinical Trials */}
          <CockpitCard
            title="Clinical Trials"
            subtitle="Validation studies & partnerships"
            icon={<FlaskConical size={18} />}
            status="pending"
            lastUpdated="March 2026"
          >
            <div className="space-y-3">
              {trials.map((t) => (
                <div key={t.name} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 dark:text-white text-xs">{t.name}</span>
                    {statusBadge(t.status)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{t.lead} — {t.institution}</p>
                </div>
              ))}
            </div>
          </CockpitCard>
        </CockpitSection>

        {/* Row 2: CRC Intelligence (full width) */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="CRC Intelligence"
            subtitle="Latest colorectal cancer research & screening news"
            icon={<Newspaper size={18} />}
            status={crcError ? 'pending' : 'active'}
          >
            {crcLoading ? (
              <div className="flex items-center justify-center py-6">
                <RefreshCw size={20} className="animate-spin text-gray-400" />
                <span className="ml-2 text-xs text-gray-400">Loading CRC news...</span>
              </div>
            ) : crcError ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle size={24} className="text-amber-400 mb-2" />
                <p className="text-xs text-amber-600 dark:text-amber-400">{crcError}</p>
                <button onClick={loadCRCNews} className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline">Retry</button>
              </div>
            ) : crcNews.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-4">No CRC news available.</p>
            ) : (
              <div className="space-y-4">
                {crcNews.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
                        >
                          {item.title}
                        </a>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">{item.source}</span>
                          {item.published_at && (
                            <span className="text-[10px] text-gray-400">{formatDateTime(item.published_at)}</span>
                          )}
                        </div>
                        {item.summary && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">{item.summary}</p>
                        )}
                      </div>
                      {item.relevance_score != null && (
                        <span className="shrink-0 inline-block bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded font-medium">
                          {item.relevance_score}%
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex gap-2">
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded">
                        Suggested: Share on LinkedIn
                      </span>
                      <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded">
                        Clinic bulletin
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* Row 3: Marketing, Investors, Memory */}
        <CockpitSection>
          {/* Marketing Materials */}
          <CockpitCard
            title="Marketing Materials"
            subtitle="Brochures & collateral"
            icon={<FileText size={18} />}
            status="pending"
            lastUpdated="March 2026"
          >
            {brochureList.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 text-xs text-center py-4">No brochures created yet.</p>
            ) : (
              <div className="space-y-2">
                {brochureList.map((b) => (
                  <div key={b.filename} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{b.title}</p>
                      <p className="text-[11px] text-gray-400">{b.market}</p>
                    </div>
                    {statusBadge(b.status)}
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>

          {/* Investor Intelligence */}
          <CockpitCard
            title="Investor Intelligence"
            subtitle="Funding history & valuations"
            icon={<TrendingUp size={18} />}
            status="active"
            lastUpdated="March 2026"
          >
            <div className="space-y-4">
              {investors.map((round) => (
                <div key={round.phase} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                  <p className="font-medium text-xs text-gray-900 dark:text-white mb-1">{round.phase}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                    <span>Valuation: <strong className="text-gray-700 dark:text-gray-300">{round.valuation}</strong></span>
                    <span>Raised: <strong className="text-gray-700 dark:text-gray-300">{round.totalRaised}</strong></span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {round.investors.map((inv) => (
                      <span
                        key={inv.name}
                        className="inline-block bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded"
                      >
                        {inv.name}{inv.amount ? ` (${inv.amount})` : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CockpitCard>

          {/* Project Memory */}
          <CockpitCard
            title="Project Memory"
            subtitle="Window Closure Records"
            icon={<Brain size={18} />}
            status={memoryItems.length > 0 ? 'active' : 'pending'}
          >
            {memoryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Brain size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
                <p className="text-gray-400 dark:text-gray-500 text-xs">No Window Closure Records yet.</p>
                <p className="text-gray-400 dark:text-gray-500 text-[11px] mt-1">Records will appear here after dev sessions.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {memoryItems.map((m) => (
                  <div key={m.filename} className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-900 dark:text-white">{m.filename}</p>
                      <p className="text-[11px] text-gray-400">{m.summary}</p>
                    </div>
                    <span className="text-[11px] text-gray-400">{m.date}</span>
                  </div>
                ))}
              </div>
            )}
          </CockpitCard>
        </CockpitSection>

        {/* Row 3: Repository Activity (full width) */}
        <CockpitSection columns={1}>
          <CockpitCard
            title="Repository Activity"
            subtitle="GitHub commits, PRs & deployments"
            icon={<GitBranch size={18} />}
            status="placeholder"
          >
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <GitBranch size={32} className="text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-400 dark:text-gray-500 text-xs">{repo.message}</p>
            </div>
          </CockpitCard>
        </CockpitSection>
      </div>
    </div>
  );
};

export default CEOCockpit;
