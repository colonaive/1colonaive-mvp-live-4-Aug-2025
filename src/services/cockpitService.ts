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

  getRepoActivityPlaceholder: (): PlaceholderSection => ({
    status: 'placeholder',
    message: 'GitHub API integration pending. Will show recent commits, open PRs, and deployment status.',
  }),
};
