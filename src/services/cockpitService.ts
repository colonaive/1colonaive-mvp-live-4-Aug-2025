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
  preview: string;
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

export interface ExecutiveBriefingSummary {
  id: string;
  date: string;
  content: string;
  sections: { heading: string; items: string[] }[];
  created_at: string;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- external API response
    const messages = ((data as any).value || []) as any[];
    return messages.map((m) => ({
      id: m.id as string,
      subject: (m.subject as string) || '(no subject)',
      sender: (m.sender || m.from?.emailAddress?.name || m.from?.emailAddress?.address || 'Unknown') as string,
      receivedDateTime: m.receivedDateTime as string,
      isRead: (m.isRead ?? true) as boolean,
      preview: (m.preview || '') as string,
    }));
  },

  fetchCRCNews: async (): Promise<CRCNewsItem[]> => {
    const res = await fetch('/.netlify/functions/list_crc_news?limit=5');
    if (!res.ok) throw new Error(`CRC news fetch failed (${res.status})`);
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- external API response
    const items = ((data as any).items || []) as any[];
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

  fetchLatestBriefing: async (): Promise<ExecutiveBriefingSummary | null> => {
    try {
      const res = await fetch('/.netlify/functions/generate_briefing?action=latest');
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.content) return null;
      return data as ExecutiveBriefingSummary;
    } catch {
      return null;
    }
  },

  fetchBriefingHistory: async (limit = 7): Promise<ExecutiveBriefingSummary[]> => {
    try {
      const res = await fetch(`/.netlify/functions/generate_briefing?action=history&limit=${limit}`);
      if (!res.ok) return [];
      const data = await res.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return ((data as any).items || []) as ExecutiveBriefingSummary[];
    } catch {
      return [];
    }
  },

  getRepoActivityPlaceholder: (): PlaceholderSection => ({
    status: 'placeholder',
    message: 'GitHub API integration pending. Will show recent commits, open PRs, and deployment status.',
  }),
};
