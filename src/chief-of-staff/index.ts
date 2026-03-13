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

// Action Center
export { chatEngine } from './action-center/chatEngine';
export type { ChatMessage, ChatTranscript } from './action-center/chatEngine';

export { actionRouter } from './action-center/actionRouter';
export type { ActionType, RoutedAction } from './action-center/actionRouter';

export { promptGenerator } from './action-center/promptGenerator';
export type { AGPrompt } from './action-center/promptGenerator';

export { emailComposer } from './action-center/emailComposer';
export type { EmailDraft, EmailStatus } from './action-center/emailComposer';

export { voiceInput } from './action-center/voiceInput';

// Decision Memory
export { decisionMemoryEngine } from './decision-memory/decisionMemoryEngine';
export type { DecisionEvent, RecordActionInput } from './decision-memory/decisionMemoryEngine';

export { decisionPatterns } from './decision-memory/decisionPatterns';
export type { DecisionPattern } from './decision-memory/decisionPatterns';

export { decisionScorer } from './decision-memory/decisionScorer';
export type { ScoredDecision } from './decision-memory/decisionScorer';

export { decisionSuggestions } from './decision-memory/decisionSuggestions';
export type { MemorySuggestion } from './decision-memory/decisionSuggestions';
