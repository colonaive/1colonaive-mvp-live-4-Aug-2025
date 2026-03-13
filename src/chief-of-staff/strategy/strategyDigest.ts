// Chief-of-Staff — Weekly Strategy Digest Generator
// Produces a comprehensive weekly strategy brief covering all intelligence domains.

import { roadmapEngine } from '@/chief-of-staff/roadmap/roadmapEngine';
import { operationsEngine } from '@/chief-of-staff/operations/operationsEngine';
import { projectRegistry } from '@/chief-of-staff/projects/projectRegistry';
import { investorGenerator } from '@/chief-of-staff/investors/investorGenerator';
import { taskEngine } from '@/chief-of-staff/tasks/taskEngine';

export interface StrategySection {
  heading: string;
  items: string[];
  status: 'green' | 'amber' | 'red';
}

export interface WeeklyStrategyDigest {
  generatedAt: string;
  weekOf: string;
  sections: StrategySection[];
  overallHealth: 'green' | 'amber' | 'red';
}

export const strategyDigest = {
  /** Generate the full weekly strategy digest */
  generate(): WeeklyStrategyDigest {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const sections: StrategySection[] = [];

    // 1. Product Roadmap Progress
    const roadmapStats = roadmapEngine.getStats();
    const activeMilestone = roadmapEngine.getActiveMilestone();
    sections.push({
      heading: 'Product Roadmap Progress',
      items: [
        `Active milestone: ${activeMilestone?.name || 'None'}`,
        `${roadmapStats.inProgress} features in progress, ${roadmapStats.completed} completed, ${roadmapStats.planned} planned`,
        ...roadmapEngine.getByStatus('in-progress').slice(0, 3).map((e) => `→ ${e.title} (${e.priority})`),
      ],
      status: roadmapStats.inProgress > 0 ? 'green' : 'amber',
    });

    // 2. Operational Status
    const opsStats = operationsEngine.getDashboardStats();
    sections.push({
      heading: 'Operational Status',
      items: [
        `Overall: ${opsStats.overallStatus.toUpperCase()}`,
        `${opsStats.healthyCount} systems healthy, ${opsStats.degradedCount} degraded`,
        `${opsStats.alertCount} active alert(s)`,
      ],
      status: opsStats.overallStatus === 'healthy' ? 'green' : opsStats.overallStatus === 'degraded' ? 'amber' : 'red',
    });

    // 3. Task Progress
    const taskStats = taskEngine.getStats();
    sections.push({
      heading: 'Development Tasks',
      items: [
        `${taskStats.total} total tasks: ${taskStats.completed} completed, ${taskStats.inProgress} in progress`,
        `${taskStats.blocked} blocked, ${taskStats.pending} pending`,
        `${taskStats.verified} verified on production`,
      ],
      status: taskStats.blocked > 0 ? 'amber' : 'green',
    });

    // 4. Connected Projects
    const projectStats = projectRegistry.getStats();
    sections.push({
      heading: 'Connected Projects',
      items: [
        `${projectStats.active} active projects across all tiers`,
        `${projectStats.totalAgents} AI agents deployed`,
        ...projectRegistry.getActiveProjects().map((p) => `→ ${p.project_name} (${p.tier}): ${p.status}`),
      ],
      status: 'green',
    });

    // 5. Investor Materials
    const investorStats = investorGenerator.getStats();
    sections.push({
      heading: 'Investor Readiness',
      items: [
        `${investorStats.totalMaterials} materials (${investorStats.drafts} drafts, ${investorStats.approved} approved)`,
        `Total raised: ${investorStats.totalRaised}`,
        `Current valuation: ${investorStats.currentValuation}`,
        `Markets with regulatory clearance: ${investorStats.marketsActive}`,
      ],
      status: investorStats.approved > 0 ? 'green' : 'amber',
    });

    // Determine overall health
    const statuses = sections.map((s) => s.status);
    const overallHealth = statuses.includes('red') ? 'red' : statuses.includes('amber') ? 'amber' : 'green';

    return {
      generatedAt: now.toISOString(),
      weekOf: `${weekStart.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} – ${now.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      sections,
      overallHealth,
    };
  },
};
