/**
 * Cross-Project Intelligence Engine — CTW-COCKPIT-02E
 *
 * Aggregates signals from all founder projects (COLONAiVE, Durmah, ScienceHOD,
 * SG Renovate) and surfaces global priorities for the CEO cockpit.
 */

/* ── Types ── */

export type ProjectId = 'colonaive' | 'durmah' | 'sciencehod' | 'sgrenovate';

export interface ProjectSignal {
  id: string;
  title: string;
  description: string;
  type: 'risk' | 'opportunity' | 'blocker' | 'milestone' | 'info';
  severity: 'critical' | 'high' | 'medium' | 'low';
  created_at: string;
}

export interface ProjectIntelligence {
  project: ProjectId;
  label: string;
  signals: ProjectSignal[];
  risks: ProjectSignal[];
  opportunities: ProjectSignal[];
  urgency_score: number;
}

export interface GlobalPriority {
  rank: number;
  project: ProjectId;
  projectLabel: string;
  title: string;
  reason: string;
  urgency: number;
  impact: number;
  score: number;
}

export interface CrossProjectBriefing {
  generatedAt: string;
  topProject: ProjectId;
  topProjectLabel: string;
  topProjectReason: string;
  globalPriorities: GlobalPriority[];
  projectSummaries: ProjectIntelligence[];
  focusShiftAdvice: string;
}

/* ── Severity weight map ── */

const SEVERITY_WEIGHT: Record<ProjectSignal['severity'], number> = {
  critical: 40,
  high: 25,
  medium: 12,
  low: 5,
};

const TYPE_WEIGHT: Record<ProjectSignal['type'], number> = {
  blocker: 35,
  risk: 25,
  opportunity: 15,
  milestone: 10,
  info: 3,
};

/* ── Project signal definitions ── */

/**
 * Each project defines its current signals as static snapshots.
 * In future iterations these can be replaced with live Supabase queries
 * or API calls to each project's backend.
 */

function getColonAiVESignals(): ProjectIntelligence {
  const signals: ProjectSignal[] = [
    {
      id: 'col-hsa-renewal',
      title: 'HSA Registration Renewal Due',
      description: 'ColonAiQ HSA clearance expires ~April 2026. Renewal documentation and submission must be prioritised.',
      type: 'risk',
      severity: 'critical',
      created_at: new Date().toISOString(),
    },
    {
      id: 'col-india-cdsco',
      title: 'India CDSCO MD-14 Submission',
      description: 'Target Q1 2026 submission for 6-marker version. Verify 5-marker vs 6-marker document alignment.',
      type: 'blocker',
      severity: 'high',
      created_at: new Date().toISOString(),
    },
    {
      id: 'col-angsana-validation',
      title: 'Angsana Lab Validation In Progress',
      description: 'HCT116 cell line concentration gradient validation underway. Awaiting KTPH clinical samples.',
      type: 'milestone',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'col-cockpit-intelligence',
      title: 'CEO Cockpit Intelligence Engine Live',
      description: 'Action intelligence, decision loop, and founder briefing layers operational.',
      type: 'milestone',
      severity: 'low',
      created_at: new Date().toISOString(),
    },
    {
      id: 'col-ktph-study',
      title: 'KTPH Investigator-Initiated Study',
      description: 'Dr Daniel Lee interest — convert to structured local evidence plan.',
      type: 'opportunity',
      severity: 'high',
      created_at: new Date().toISOString(),
    },
    {
      id: 'col-ph-gtm',
      title: 'Philippines GTM Planning',
      description: 'St. Luke\'s, Dr Carlos Dy, Dr Jun Ruiz stakeholder engagement. LTO/CMDR pathway.',
      type: 'opportunity',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
  ];

  return buildProjectIntelligence('colonaive', 'COLONAiVE', signals);
}

function getDurmahSignals(): ProjectIntelligence {
  const signals: ProjectSignal[] = [
    {
      id: 'dur-dci-stability',
      title: 'DCI Voice Pipeline Stability',
      description: 'DCI /api/dci/event had 500 errors previously. Verify current status before building further.',
      type: 'risk',
      severity: 'high',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dur-login-routes',
      title: 'University Login Route Canonicalization',
      description: 'CTW-LOGIN-01: /durham/login, /oxford/login, /cambridge/login routes pending.',
      type: 'blocker',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dur-resend-smtp',
      title: 'Resend SMTP Migration Pending',
      description: 'Supabase auth emails need migration to Resend SMTP. Next infra step.',
      type: 'risk',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dur-lnat-funnel',
      title: 'LNAT Commercial Funnel Active',
      description: 'Pricing only shown after value exposure inside portal. Funnel operational.',
      type: 'info',
      severity: 'low',
      created_at: new Date().toISOString(),
    },
    {
      id: 'dur-entity-name',
      title: 'Legal Entity Name Inconsistency',
      description: 'Mismatch between "DURMAH LEARNING PTE. LTD." and "Durmah Legal Studies Pte Ltd" in records.',
      type: 'risk',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
  ];

  return buildProjectIntelligence('durmah', 'Durmah.ai', signals);
}

function getScienceHODSignals(): ProjectIntelligence {
  const signals: ProjectSignal[] = [
    {
      id: 'sci-revenue-pipeline',
      title: 'Revenue Pipeline Development',
      description: 'ScienceHOD revenue model and pipeline need activation. Early-stage monetisation.',
      type: 'opportunity',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sci-content-engine',
      title: 'Content Engine Status',
      description: 'Science content generation and curation system. Verify operational status.',
      type: 'info',
      severity: 'low',
      created_at: new Date().toISOString(),
    },
  ];

  return buildProjectIntelligence('sciencehod', 'ScienceHOD', signals);
}

function getSGRenovateSignals(): ProjectIntelligence {
  const signals: ProjectSignal[] = [
    {
      id: 'sgr-v3-routing',
      title: 'Master v3 Routing Fixes',
      description: 'Routing fixes, workflow completeness, and market wedge definition in progress.',
      type: 'blocker',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sgr-market-wedge',
      title: 'Market Wedge Definition',
      description: 'Define operational wedge for initial market entry. Not a contractor marketplace.',
      type: 'opportunity',
      severity: 'medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 'sgr-escrow-arch',
      title: 'Escrow Architecture Ready',
      description: 'Milestone-based payment escrow architecture designed but not directly operated.',
      type: 'info',
      severity: 'low',
      created_at: new Date().toISOString(),
    },
  ];

  return buildProjectIntelligence('sgrenovate', 'SG Renovate AI', signals);
}

/* ── Engine functions ── */

function buildProjectIntelligence(
  project: ProjectId,
  label: string,
  signals: ProjectSignal[],
): ProjectIntelligence {
  const risks = signals.filter((s) => s.type === 'risk' || s.type === 'blocker');
  const opportunities = signals.filter((s) => s.type === 'opportunity');

  // Urgency = weighted sum of signal severities and types
  let urgency = 0;
  for (const s of signals) {
    urgency += SEVERITY_WEIGHT[s.severity] + TYPE_WEIGHT[s.type];
  }
  // Normalise to 0–100 (cap at 100)
  urgency = Math.min(100, Math.round(urgency / Math.max(signals.length, 1)));

  // Boost urgency for critical/high risks
  const criticalCount = risks.filter((r) => r.severity === 'critical').length;
  const highCount = risks.filter((r) => r.severity === 'high').length;
  urgency = Math.min(100, urgency + criticalCount * 15 + highCount * 8);

  return { project, label, signals, risks, opportunities, urgency_score: urgency };
}

/**
 * Aggregate signals from all projects.
 */
export function aggregateAllSignals(): ProjectIntelligence[] {
  return [
    getColonAiVESignals(),
    getDurmahSignals(),
    getScienceHODSignals(),
    getSGRenovateSignals(),
  ];
}

/**
 * Get top N global priorities across all projects.
 * Compares urgency and impact across projects, returns ranked list.
 */
export function getGlobalPriorities(limit = 5): GlobalPriority[] {
  const allProjects = aggregateAllSignals();
  const priorities: GlobalPriority[] = [];

  for (const proj of allProjects) {
    // Extract actionable signals (risks, blockers, high-severity opportunities)
    const actionable = proj.signals.filter(
      (s) =>
        s.type === 'risk' ||
        s.type === 'blocker' ||
        (s.type === 'opportunity' && (s.severity === 'critical' || s.severity === 'high')),
    );

    for (const signal of actionable) {
      const urgency = SEVERITY_WEIGHT[signal.severity] + TYPE_WEIGHT[signal.type];
      const impact = SEVERITY_WEIGHT[signal.severity] * 1.5;
      const score = Math.round(urgency * 0.5 + impact * 0.3 + proj.urgency_score * 0.2);

      priorities.push({
        rank: 0,
        project: proj.project,
        projectLabel: proj.label,
        title: signal.title,
        reason: signal.description,
        urgency,
        impact,
        score: Math.min(100, score),
      });
    }
  }

  // Sort by score descending
  priorities.sort((a, b) => b.score - a.score);

  // Assign ranks and limit
  return priorities.slice(0, limit).map((p, i) => ({ ...p, rank: i + 1 }));
}

/**
 * Generate the full cross-project intelligence briefing for the cockpit.
 */
export function generateCrossProjectBriefing(): CrossProjectBriefing {
  const projectSummaries = aggregateAllSignals();
  const globalPriorities = getGlobalPriorities(5);

  // Sort projects by urgency to find top project
  const sorted = [...projectSummaries].sort((a, b) => b.urgency_score - a.urgency_score);
  const topProject = sorted[0];

  // Build focus shift advice
  const focusShiftAdvice = buildFocusShiftAdvice(sorted);

  return {
    generatedAt: new Date().toISOString(),
    topProject: topProject.project,
    topProjectLabel: topProject.label,
    topProjectReason: buildTopProjectReason(topProject),
    globalPriorities,
    projectSummaries,
    focusShiftAdvice,
  };
}

/* ── Helpers ── */

function buildTopProjectReason(proj: ProjectIntelligence): string {
  const criticalRisks = proj.risks.filter((r) => r.severity === 'critical');
  const blockers = proj.signals.filter((s) => s.type === 'blocker');

  if (criticalRisks.length > 0) {
    return `${proj.label} has ${criticalRisks.length} critical risk${criticalRisks.length > 1 ? 's' : ''}: ${criticalRisks.map((r) => r.title).join(', ')}.`;
  }
  if (blockers.length > 0) {
    return `${proj.label} has ${blockers.length} blocker${blockers.length > 1 ? 's' : ''} requiring resolution.`;
  }
  return `${proj.label} has the highest urgency score (${proj.urgency_score}/100) across your portfolio.`;
}

function buildFocusShiftAdvice(sortedProjects: ProjectIntelligence[]): string {
  const top = sortedProjects[0];
  const second = sortedProjects[1];

  if (!top || !second) return 'Insufficient project data for focus advice.';

  const gap = top.urgency_score - second.urgency_score;

  if (gap > 20) {
    return `${top.label} demands immediate attention — urgency gap of ${gap} points over ${second.label}. Recommend concentrated focus.`;
  }
  if (gap > 10) {
    return `${top.label} is the priority, but ${second.label} is close behind. Split focus with ${top.label} taking 70% of attention.`;
  }
  return `${top.label} and ${second.label} have similar urgency. Address the highest-score global priority first, then alternate.`;
}
