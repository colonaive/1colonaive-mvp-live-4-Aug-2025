// Chief-of-Staff — Central barrel export
// All submodules accessible from @/chief-of-staff

export { taskEngine } from './tasks/taskEngine';
export type { DevTask, TaskState, TaskPriority } from './tasks/taskEngine';

export { roadmapEngine } from './roadmap/roadmapEngine';
export type { RoadmapEntry, Milestone, MilestoneStatus, RoadmapPriority } from './roadmap/roadmapEngine';

export { researchDigest } from './research/researchDigest';
export type { WeeklyResearchDigest, ResearchDigestSection } from './research/researchDigest';

export { investorGenerator } from './investors/investorGenerator';
export type { InvestorMaterial, InvestorDashboardStats, MaterialType } from './investors/investorGenerator';

export { operationsEngine } from './operations/operationsEngine';
export type { OperationsSnapshot, SystemHealth, OperationalAlert } from './operations/operationsEngine';

export { projectRegistry } from './projects/projectRegistry';
export type { ConnectedProject, ProjectStatus } from './projects/projectRegistry';

export { strategyDigest } from './strategy/strategyDigest';
export type { WeeklyStrategyDigest, StrategySection } from './strategy/strategyDigest';
