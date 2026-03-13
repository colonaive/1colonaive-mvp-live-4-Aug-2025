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

export interface LinkedInPost {
  id: string;
  source_url: string;
  title: string;
  draft_content: string | null;
  hashtags: string | null;
  image_prompt: string | null;
  image_url: string | null;
  linkedin_url: string | null;
  colonaiq_context: boolean;
  status: 'new' | 'draft' | 'posted';
  relevance_score: number | null;
  source_name: string | null;
  posted_at: string | null;
  created_at: string;
  updated_at: string;
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

  fetchLinkedInPosts: async (status?: string): Promise<LinkedInPost[]> => {
    const params = new URLSearchParams({ action: 'list', limit: '50' });
    if (status) params.set('status', status);
    const res = await fetch(`/.netlify/functions/linkedin_posts?${params}`);
    if (!res.ok) throw new Error(`LinkedIn posts fetch failed (${res.status})`);
    const data = await res.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ((data as any).items || []) as LinkedInPost[];
  },

  generateLinkedInPosts: async (): Promise<{ generated: number; scanned: number }> => {
    const res = await fetch('/.netlify/functions/linkedin_posts?action=generate');
    if (!res.ok) throw new Error(`LinkedIn generate failed (${res.status})`);
    return res.json();
  },

  updateLinkedInPost: async (
    id: string,
    fields: Partial<Pick<LinkedInPost, 'draft_content' | 'hashtags' | 'image_prompt' | 'image_url' | 'linkedin_url' | 'status'>>
  ): Promise<void> => {
    const res = await fetch('/.netlify/functions/linkedin_posts?action=update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...fields }),
    });
    if (!res.ok) throw new Error(`LinkedIn update failed (${res.status})`);
  },

  generatePostImage: async (prompt: string, postId?: string): Promise<{ image_url: string }> => {
    const res = await fetch('/.netlify/functions/generate_post_image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, post_id: postId }),
    });
    if (!res.ok) throw new Error(`Image generation failed (${res.status})`);
    return res.json();
  },

  generateFromManualSource: async (url?: string, text?: string): Promise<{ ok: boolean; post?: LinkedInPost; error?: string }> => {
    const res = await fetch('/.netlify/functions/linkedin_manual_source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, text }),
    });
    return res.json();
  },

  publishToLinkedIn: async (postId: string, text: string, articleUrl?: string, imageUrl?: string): Promise<{ success: boolean; linkedin_post_url?: string; error?: string }> => {
    const res = await fetch('/.netlify/functions/linkedin_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_id: postId, text, article_url: articleUrl, image_url: imageUrl }),
    });
    return res.json();
  },

  getRepoActivityPlaceholder: (): PlaceholderSection => ({
    status: 'placeholder',
    message: 'GitHub API integration pending. Will show recent commits, open PRs, and deployment status.',
  }),
};
