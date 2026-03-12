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

export const cockpitService = {
  getRegulatoryStatus: (): RegulatoryItem[] => regulatoryItems,
  getClinicalTrials: (): ClinicalTrial[] => clinicalTrials,
  getInvestorHistory: (): InvestorRound[] => investorRounds,
  getBrochures: (): BrochureItem[] => brochures,
  getProjectMemoryItems: (): ProjectMemoryItem[] => projectMemoryItems,

  getInboxPlaceholder: (): PlaceholderSection => ({
    status: 'placeholder',
    message: 'Outlook / Microsoft Graph integration pending. Will surface unread emails, flagged items, and meeting summaries.',
  }),

  getRepoActivityPlaceholder: (): PlaceholderSection => ({
    status: 'placeholder',
    message: 'GitHub API integration pending. Will show recent commits, open PRs, and deployment status.',
  }),
};
