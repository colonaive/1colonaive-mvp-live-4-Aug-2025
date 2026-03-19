/**
 * Founder Briefing Engine — CTW-COCKPIT-02C
 *
 * Synthesizes intelligence from multiple cockpit data sources into
 * an actionable founder briefing with priorities, risks, and recommendations.
 */

import {
  type ActionCandidate,
  type ScoredAction,
  getNextBestActions,
  radarSignalsToActions,
  earlyWarningsToActions,
  strategyImplicationsToActions,
} from '@/lib/actionIntelligence';
import { generateCrossProjectBriefing, type CrossProjectBriefing } from '@/lib/projectSignals';
import { competitiveIntelligenceService } from '@/services/competitiveIntelligenceService';
import { radarService } from '@/services/radarService';

/* ── Types ── */

export interface FounderBriefing {
  generatedAt: string;
  executiveSummary: string;
  topPriorities: ScoredAction[];
  criticalRisks: RiskItem[];
  recommendedActions: RecommendedAction[];
  signalCount: number;
  crossProjectIntelligence: CrossProjectBriefing | null;
}

export interface RiskItem {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  source: string;
  description: string;
}

export interface RecommendedAction {
  title: string;
  rationale: string;
  priority: number;
  effort: 'low' | 'medium' | 'high';
}

/* ── Risk detection keywords ── */

const RISK_KEYWORDS = [
  'competitor', 'launch', 'fda approval', 'market entry',
  'recall', 'patent', 'regulatory change', 'price war',
  'acquisition', 'merger', 'delisting', 'reimbursement',
];

/* ── Engine ── */

/**
 * Generate a complete founder intelligence briefing.
 * Pulls from radar signals, early warnings, strategy implications,
 * and competitive intelligence.
 */
export async function generateFounderBriefing(): Promise<FounderBriefing> {
  // Fetch all intelligence sources in parallel
  const [radarSignals, earlyWarnings, strategyImplications] = await Promise.all([
    radarService.fetchTopSignals(7, 10).catch(() => []),
    competitiveIntelligenceService.fetchEarlyWarningSignals(10).catch(() => []),
    competitiveIntelligenceService.fetchStrategyImplications(10).catch(() => []),
  ]);

  // Cross-project intelligence
  let crossProjectIntelligence: CrossProjectBriefing | null = null;
  try {
    crossProjectIntelligence = generateCrossProjectBriefing();
  } catch {
    // silent fail — cross-project is supplementary
  }

  // Convert to action candidates
  const allCandidates: ActionCandidate[] = [
    ...radarSignalsToActions(radarSignals),
    ...earlyWarningsToActions(earlyWarnings),
    ...strategyImplicationsToActions(strategyImplications),
  ];

  // Score and rank
  const topPriorities = getNextBestActions(allCandidates, 3);

  // Extract risks from early warnings
  const criticalRisks = extractRisks(earlyWarnings, strategyImplications);

  // Generate recommended actions
  const recommendedActions = generateRecommendations(topPriorities, criticalRisks);

  // Build executive summary
  const executiveSummary = buildExecutiveSummary(
    allCandidates.length,
    topPriorities,
    criticalRisks,
    crossProjectIntelligence,
  );

  return {
    generatedAt: new Date().toISOString(),
    executiveSummary,
    topPriorities,
    criticalRisks,
    recommendedActions,
    signalCount: allCandidates.length,
    crossProjectIntelligence,
  };
}

/* ── Helpers ── */

function extractRisks(
  earlyWarnings: { id: string; title: string; source: string; analysis: string | null; market_implication: string | null; confidence_score: number }[],
  strategyImplications: { id: string; signal_title: string; analysis: string | null; market_implication: string | null; priority: string }[],
): RiskItem[] {
  const risks: RiskItem[] = [];

  for (const ew of earlyWarnings) {
    const text = `${ew.title} ${ew.analysis || ''} ${ew.market_implication || ''}`.toLowerCase();
    const isRisky = RISK_KEYWORDS.some((kw) => text.includes(kw));
    if (isRisky || ew.confidence_score >= 70) {
      risks.push({
        id: `risk-ew-${ew.id}`,
        title: ew.title,
        severity: ew.confidence_score >= 80 ? 'high' : ew.confidence_score >= 60 ? 'medium' : 'low',
        source: ew.source,
        description: ew.market_implication || ew.analysis || 'Requires investigation.',
      });
    }
  }

  for (const si of strategyImplications) {
    if (si.priority === 'critical' || si.priority === 'high') {
      risks.push({
        id: `risk-si-${si.id}`,
        title: si.signal_title,
        severity: si.priority === 'critical' ? 'high' : 'medium',
        source: 'Strategy Analysis',
        description: si.market_implication || si.analysis || 'Strategic risk identified.',
      });
    }
  }

  // Sort by severity, limit to 5
  const order = { high: 0, medium: 1, low: 2 };
  return risks.sort((a, b) => order[a.severity] - order[b.severity]).slice(0, 5);
}

function generateRecommendations(
  topPriorities: ScoredAction[],
  risks: RiskItem[],
): RecommendedAction[] {
  const recommendations: RecommendedAction[] = [];

  // Recommendations from top priorities
  for (const action of topPriorities) {
    const effortLevel = action.scores.effort <= 30 ? 'low' : action.scores.effort <= 60 ? 'medium' : 'high';
    recommendations.push({
      title: action.title,
      rationale: action.description.slice(0, 200) || 'High-priority signal requiring attention.',
      priority: action.scores.priority,
      effort: effortLevel,
    });
  }

  // Recommendations from critical risks
  for (const risk of risks.filter((r) => r.severity === 'high').slice(0, 2)) {
    recommendations.push({
      title: `Investigate: ${risk.title}`,
      rationale: risk.description.slice(0, 200),
      priority: 85,
      effort: 'medium',
    });
  }

  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
}

function buildExecutiveSummary(
  totalSignals: number,
  topPriorities: ScoredAction[],
  risks: RiskItem[],
  crossProject: CrossProjectBriefing | null,
): string {
  const highRiskCount = risks.filter((r) => r.severity === 'high').length;
  const topAction = topPriorities[0];

  const parts: string[] = [];

  parts.push(`${totalSignals} intelligence signals analysed across radar, early warnings, and strategy implications.`);

  if (topAction) {
    parts.push(`Top priority: "${topAction.title}" (score: ${topAction.scores.priority}/100).`);
  }

  if (highRiskCount > 0) {
    parts.push(`${highRiskCount} critical risk${highRiskCount > 1 ? 's' : ''} flagged requiring immediate attention.`);
  } else {
    parts.push('No critical risks detected in current signal landscape.');
  }

  if (crossProject) {
    parts.push(`Cross-project focus: ${crossProject.topProjectLabel} (urgency leader).`);
  }

  return parts.join(' ');
}
