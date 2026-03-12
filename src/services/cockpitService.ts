import {
  regulatoryItems,
  clinicalTrials,
  investorRounds,
  brochures,
  projectMemoryItems,
  type RegulatoryItem,
  type ClinicalTrial,
  type InvestorRound,
  type BrochureItem,
  type ProjectMemoryItem,
} from '@/data/cockpitKnowledge';

interface PlaceholderSection {
  status: 'placeholder';
  message: string;
}

export interface InboxEmail {
  id: string;
  subject: string;
  sender: string;
  receivedDateTime: string;
  isRead: boolean;
}

export interface CRCNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  summary: string | null;
  published_at: string | null;
  relevance_score: number | null;
}

export const cockpitService = {
  getRegulatoryStatus: (): RegulatoryItem[] => regulatoryItems,
  getClinicalTrials: (): ClinicalTrial[] => clinicalTrials,
  getInvestorHistory: (): InvestorRound[] => investorRounds,
  getBrochures: (): BrochureItem[] => brochures,
  getProjectMemoryItems: (): ProjectMemoryItem[] => projectMemoryItems,

  fetchInboxEmails: async (): Promise<InboxEmail[]> => {
    const res = await fetch('/.netlify/functions/outlook-inbox');
    if (!res.ok) throw new Error(`Inbox fetch failed (${res.status})`);
    const data = await res.json();
    const messages: any[] = data.value || [];
    return messages.map((m) => ({
      id: m.id,
      subject: m.subject || '(no subject)',
      sender: m.from?.emailAddress?.name || m.from?.emailAddress?.address || 'Unknown',
      receivedDateTime: m.receivedDateTime,
      isRead: m.isRead ?? true,
    }));
  },

  fetchCRCNews: async (): Promise<CRCNewsItem[]> => {
    const res = await fetch('/.netlify/functions/list_crc_news?limit=5');
    if (!res.ok) throw new Error(`CRC news fetch failed (${res.status})`);
    const data = await res.json();
    const items: any[] = data.items || [];
    return items.map((item) => ({
      id: item.id,
      title: item.title || '(untitled)',
      url: item.url || '',
      source: item.source || 'Unknown',
      summary: item.summary || null,
      published_at: item.published_at || null,
      relevance_score: item.relevance_score ?? null,
    }));
  },

  getRepoActivityPlaceholder: (): PlaceholderSection => ({
    status: 'placeholder',
    message: 'GitHub API integration pending. Will show recent commits, open PRs, and deployment status.',
  }),
};
