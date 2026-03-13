// Chief-of-Staff — Multi-Project Control Registry
// Registers and tracks connected projects across Chandra's ecosystem.

export type ProjectStatus = 'active' | 'paused' | 'archived' | 'planning';

export interface ConnectedProject {
  id: string;
  project_name: string;
  repo_url: string;
  status: ProjectStatus;
  last_sync: string;
  active_agents: string[];
  description: string;
  tier: 'tier-1' | 'tier-2' | 'tier-3';
  domain?: string;
}

// Initial project registry — matches the three strategic domains
const projectsData: ConnectedProject[] = [
  {
    id: 'proj-colonaive',
    project_name: 'COLONAiVE',
    repo_url: 'https://github.com/colonaive/colonaive-mvp-live',
    status: 'active',
    last_sync: new Date().toISOString(),
    active_agents: ['claude-cto', 'codex-engineer', 'gemini-research', 'browser-qa'],
    description: 'National CRC screening movement — public portal, CEO cockpit, intelligence radars, LinkedIn automation.',
    tier: 'tier-1',
    domain: 'colonaive.com',
  },
  {
    id: 'proj-durmah',
    project_name: 'Durmah.ai',
    repo_url: 'https://github.com/durmah/durmah-ai',
    status: 'active',
    last_sync: '2026-03-10T00:00:00Z',
    active_agents: ['claude-cto', 'codex-engineer'],
    description: 'AI-assisted legal learning platform for UK university law students. Durham, Oxford, Cambridge.',
    tier: 'tier-2',
    domain: 'durmah.ai',
  },
  {
    id: 'proj-sgrenovate',
    project_name: 'SG Renovate AI',
    repo_url: 'https://github.com/sgrenovate/sgrenovate-ai',
    status: 'active',
    last_sync: '2026-03-08T00:00:00Z',
    active_agents: ['claude-cto'],
    description: 'Governance operating system for Singapore renovation projects. Milestone-based payments, audit trails.',
    tier: 'tier-3',
    domain: 'sgrenovate.ai',
  },
];

export const projectRegistry = {
  /** Get all registered projects */
  getAllProjects(): ConnectedProject[] {
    return [...projectsData];
  },

  /** Get project by ID */
  getProject(id: string): ConnectedProject | undefined {
    return projectsData.find((p) => p.id === id);
  },

  /** Get projects by tier */
  getByTier(tier: ConnectedProject['tier']): ConnectedProject[] {
    return projectsData.filter((p) => p.tier === tier);
  },

  /** Get active projects */
  getActiveProjects(): ConnectedProject[] {
    return projectsData.filter((p) => p.status === 'active');
  },

  /** Get project count by status */
  getStats(): { total: number; active: number; paused: number; totalAgents: number } {
    return {
      total: projectsData.length,
      active: projectsData.filter((p) => p.status === 'active').length,
      paused: projectsData.filter((p) => p.status === 'paused').length,
      totalAgents: projectsData.reduce((acc, p) => acc + p.active_agents.length, 0),
    };
  },

  /** Update project sync time */
  updateSync(projectId: string): boolean {
    const project = projectsData.find((p) => p.id === projectId);
    if (!project) return false;
    project.last_sync = new Date().toISOString();
    return true;
  },
};
