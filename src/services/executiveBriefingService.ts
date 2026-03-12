import { cockpitService } from './cockpitService';
import {
  regulatoryItems,
  clinicalTrials,
} from '@/data/cockpitKnowledge';

export interface BriefingSection {
  heading: string;
  items: string[];
}

export interface ExecutiveBriefing {
  id?: string;
  date: string;
  content: string;
  sections: BriefingSection[];
  generatedAt: string;
}

const formatDate = (d: Date): string =>
  d.toLocaleDateString('en-SG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

/**
 * Build the Inbox Highlights section from Outlook emails.
 */
async function buildInboxHighlights(): Promise<BriefingSection> {
  try {
    const emails = await cockpitService.fetchInboxEmails();
    const unread = emails.filter((e) => !e.isRead);
    const highlights = (unread.length > 0 ? unread : emails).slice(0, 5);
    return {
      heading: 'Inbox Highlights',
      items: highlights.length > 0
        ? highlights.map((e) => `${e.sender} — ${e.subject}`)
        : ['No recent emails'],
    };
  } catch {
    return { heading: 'Inbox Highlights', items: ['Inbox unavailable'] };
  }
}

/**
 * Build the CRC Intelligence section from the news feed.
 */
async function buildCRCIntelligence(): Promise<BriefingSection> {
  try {
    const news = await cockpitService.fetchCRCNews();
    return {
      heading: 'CRC Intelligence',
      items: news.length > 0
        ? news.slice(0, 3).map((n) => {
            const score = n.relevance_score != null ? ` (${n.relevance_score}%)` : '';
            return `${n.title}${score}`;
          })
        : ['No CRC news available'],
    };
  } catch {
    return { heading: 'CRC Intelligence', items: ['CRC news feed unavailable'] };
  }
}

/**
 * Build the Regulatory Status section from static knowledge data.
 */
function buildRegulatoryStatus(): BriefingSection {
  return {
    heading: 'Regulatory Status',
    items: regulatoryItems.map((r) => `${r.jurisdiction}: ${r.status}`),
  };
}

/**
 * Build the Clinical & Project Updates section.
 */
function buildProjectUpdates(): BriefingSection {
  return {
    heading: 'Clinical & Project Updates',
    items: clinicalTrials.map((t) => `${t.name} — ${t.status} (${t.institution})`),
  };
}

/**
 * Render sections to a plain-text briefing string.
 */
function renderBriefingText(date: string, sections: BriefingSection[]): string {
  let text = `Daily Executive Briefing\nDate: ${date}\n`;
  for (const section of sections) {
    text += `\n${section.heading}\n`;
    for (const item of section.items) {
      text += `• ${item}\n`;
    }
  }
  return text;
}

/**
 * Generate a complete executive briefing for today.
 */
export async function generateExecutiveBriefing(): Promise<ExecutiveBriefing> {
  const now = new Date();
  const dateStr = formatDate(now);

  const [inbox, crc] = await Promise.all([
    buildInboxHighlights(),
    buildCRCIntelligence(),
  ]);

  const regulatory = buildRegulatoryStatus();
  const projects = buildProjectUpdates();

  const sections = [inbox, crc, regulatory, projects];
  const content = renderBriefingText(dateStr, sections);

  return {
    date: now.toISOString().slice(0, 10),
    content,
    sections,
    generatedAt: now.toISOString(),
  };
}

/**
 * Fetch the latest briefing from Supabase (for cockpit display).
 */
export async function fetchLatestBriefing(): Promise<ExecutiveBriefing | null> {
  try {
    const res = await fetch('/.netlify/functions/generate_briefing?action=latest');
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.content) return null;
    return {
      id: data.id,
      date: data.date,
      content: data.content,
      sections: data.sections || [],
      generatedAt: data.created_at || data.generatedAt || '',
    };
  } catch {
    return null;
  }
}

/**
 * Fetch briefing history from Supabase.
 */
export async function fetchBriefingHistory(limit = 7): Promise<ExecutiveBriefing[]> {
  try {
    const res = await fetch(`/.netlify/functions/generate_briefing?action=history&limit=${limit}`);
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data.items)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.items.map((item: any) => ({
      id: item.id,
      date: item.date,
      content: item.content,
      sections: item.sections || [],
      generatedAt: item.created_at || '',
    }));
  } catch {
    return [];
  }
}
