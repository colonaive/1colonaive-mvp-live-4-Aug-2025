// Chief-of-Staff — Product Roadmap Engine
// Stores feature roadmap, release planning, milestones, and priority ranking.

export type MilestoneStatus = 'planned' | 'in-progress' | 'completed' | 'deferred';
export type RoadmapPriority = 'P0' | 'P1' | 'P2' | 'P3';

export interface RoadmapEntry {
  id: string;
  title: string;
  description: string;
  priority: RoadmapPriority;
  status: MilestoneStatus;
  targetRelease?: string;
  completedDate?: string;
  dependencies?: string[];
  tags: string[];
}

export interface Milestone {
  id: string;
  name: string;
  targetDate: string;
  status: MilestoneStatus;
  entries: string[]; // roadmap entry IDs
}

// Initial roadmap entries sourced from project strategy
const roadmapEntries: RoadmapEntry[] = [
  {
    id: 'rm-001',
    title: 'Radar Intelligence Expansion',
    description: 'Extend CRC Research Radar with deeper PubMed integration, journal impact scoring, and automated briefing generation.',
    priority: 'P0',
    status: 'in-progress',
    targetRelease: 'Q1 2026',
    tags: ['intelligence', 'radar', 'research'],
  },
  {
    id: 'rm-002',
    title: 'LinkedIn Automation',
    description: 'Full LinkedIn post generation pipeline from CRC news and competitive intelligence, with one-click publishing.',
    priority: 'P0',
    status: 'in-progress',
    targetRelease: 'Q1 2026',
    tags: ['marketing', 'linkedin', 'automation'],
  },
  {
    id: 'rm-003',
    title: 'Policy Advocacy Platform',
    description: 'Automated monitoring of Singapore MOH, WHO, and regional health policy updates relevant to CRC screening.',
    priority: 'P1',
    status: 'planned',
    targetRelease: 'Q2 2026',
    tags: ['policy', 'advocacy', 'government'],
  },
  {
    id: 'rm-004',
    title: 'NotebookLM Content Factory',
    description: 'Integration with Google NotebookLM for automated content generation from knowledgebase documents.',
    priority: 'P2',
    status: 'planned',
    targetRelease: 'Q2 2026',
    tags: ['content', 'automation', 'ai'],
  },
  {
    id: 'rm-005',
    title: 'Competitive Intelligence Radar v2',
    description: 'Enhanced competitor monitoring with FDA approval tracking, partnership detection, and strategic implication scoring.',
    priority: 'P1',
    status: 'in-progress',
    targetRelease: 'Q1 2026',
    tags: ['intelligence', 'competitive', 'radar'],
  },
  {
    id: 'rm-006',
    title: 'Investor Materials Generator',
    description: 'AI-powered generation of pitch decks, market summaries, and financial narratives from knowledgebase data.',
    priority: 'P1',
    status: 'planned',
    targetRelease: 'Q2 2026',
    tags: ['investors', 'fundraising', 'materials'],
  },
  {
    id: 'rm-007',
    title: 'India Market GTM',
    description: 'CDSCO regulatory submission support, India market pages, and local partner engagement tools.',
    priority: 'P0',
    status: 'in-progress',
    targetRelease: 'Q1 2026',
    tags: ['india', 'market', 'regulatory'],
  },
  {
    id: 'rm-008',
    title: 'Chief-of-Staff Intelligence Layer',
    description: 'Central operational intelligence platform managing tasks, roadmap, research, investors, and multi-project coordination.',
    priority: 'P0',
    status: 'in-progress',
    targetRelease: 'Q1 2026',
    tags: ['chief-of-staff', 'operations', 'platform'],
  },
];

const milestones: Milestone[] = [
  {
    id: 'ms-q1-2026',
    name: 'Q1 2026 — Intelligence Platform',
    targetDate: '2026-03-31',
    status: 'in-progress',
    entries: ['rm-001', 'rm-002', 'rm-005', 'rm-007', 'rm-008'],
  },
  {
    id: 'ms-q2-2026',
    name: 'Q2 2026 — Automation & Advocacy',
    targetDate: '2026-06-30',
    status: 'planned',
    entries: ['rm-003', 'rm-004', 'rm-006'],
  },
];

export const roadmapEngine = {
  /** Get all roadmap entries */
  getAllEntries(): RoadmapEntry[] {
    return [...roadmapEntries];
  },

  /** Get entries by priority */
  getByPriority(priority: RoadmapPriority): RoadmapEntry[] {
    return roadmapEntries.filter((e) => e.priority === priority);
  },

  /** Get entries by status */
  getByStatus(status: MilestoneStatus): RoadmapEntry[] {
    return roadmapEntries.filter((e) => e.status === status);
  },

  /** Get all milestones */
  getMilestones(): Milestone[] {
    return [...milestones];
  },

  /** Get active milestone */
  getActiveMilestone(): Milestone | undefined {
    return milestones.find((m) => m.status === 'in-progress');
  },

  /** Get roadmap stats */
  getStats(): { total: number; planned: number; inProgress: number; completed: number; deferred: number } {
    return {
      total: roadmapEntries.length,
      planned: roadmapEntries.filter((e) => e.status === 'planned').length,
      inProgress: roadmapEntries.filter((e) => e.status === 'in-progress').length,
      completed: roadmapEntries.filter((e) => e.status === 'completed').length,
      deferred: roadmapEntries.filter((e) => e.status === 'deferred').length,
    };
  },
};
