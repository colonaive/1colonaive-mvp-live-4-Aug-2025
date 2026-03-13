// Chief-of-Staff — Research Intelligence Digest
// Integrates with CRC Research Radar, Competitive Intelligence, and Early Signal Engine.
// Generates weekly research briefs, strategic alerts, and screening policy insights.

import { radarService, type RadarSignal } from '@/services/radarService';
import { competitiveIntelligenceService, type TechnologyTrend, type EarlyWarningSignal } from '@/services/competitiveIntelligenceService';

export interface ResearchDigestSection {
  heading: string;
  items: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface WeeklyResearchDigest {
  generatedAt: string;
  weekOf: string;
  sections: ResearchDigestSection[];
  signalCount: number;
  alertCount: number;
}

export const researchDigest = {
  /** Fetch data from all intelligence sources and compile a digest */
  async generateWeeklyDigest(): Promise<WeeklyResearchDigest> {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    // Fetch from all radar sources
    const [signals, trends, warnings] = await Promise.all([
      radarService.fetchTopSignals(7, 20),
      competitiveIntelligenceService.fetchTechnologyTrends(),
      competitiveIntelligenceService.fetchEarlyWarningSignals(10),
    ]);

    const sections: ResearchDigestSection[] = [];

    // Research signals section
    if (signals.length > 0) {
      sections.push({
        heading: 'Top Research Signals',
        items: signals.slice(0, 5).map((s: RadarSignal) =>
          `[Score: ${s.radar_score}] ${s.headline || s.title} — ${s.journal || s.source}`
        ),
        priority: 'high',
      });
    }

    // Technology trends section
    if (trends.length > 0) {
      sections.push({
        heading: 'Technology Trends',
        items: trends.slice(0, 5).map((t: TechnologyTrend) =>
          `${t.trend_name}: ${t.evidence_count} signals, score ${t.trend_score}%`
        ),
        priority: 'medium',
      });
    }

    // Early warnings section
    const highConfidenceWarnings = warnings.filter((w: EarlyWarningSignal) => w.confidence_score >= 60);
    if (highConfidenceWarnings.length > 0) {
      sections.push({
        heading: 'Early Warning Alerts',
        items: highConfidenceWarnings.slice(0, 5).map((w: EarlyWarningSignal) =>
          `[${w.confidence_score}%] ${w.title} — ${w.recommended_action || 'Monitor closely'}`
        ),
        priority: 'high',
      });
    }

    // Screening policy insights (derived from radar signals tagged with policy)
    const policySignals = signals.filter((s: RadarSignal) =>
      (s.headline || s.title || '').toLowerCase().includes('policy') ||
      (s.headline || s.title || '').toLowerCase().includes('guideline') ||
      (s.headline || s.title || '').toLowerCase().includes('screening program')
    );
    if (policySignals.length > 0) {
      sections.push({
        heading: 'Screening Policy Insights',
        items: policySignals.slice(0, 3).map((s: RadarSignal) =>
          `${s.headline || s.title} — ${s.journal || s.source}`
        ),
        priority: 'medium',
      });
    }

    return {
      generatedAt: now.toISOString(),
      weekOf: `${weekStart.toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })} – ${now.toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      sections,
      signalCount: signals.length,
      alertCount: highConfidenceWarnings.length,
    };
  },

  /** Get quick signal summary for dashboard widget */
  async getSignalSummary(): Promise<{ totalSignals: number; strategicCount: number; alertCount: number; trendCount: number }> {
    const [signals, trends, warnings] = await Promise.all([
      radarService.fetchTopSignals(7, 50),
      competitiveIntelligenceService.fetchTechnologyTrends(),
      competitiveIntelligenceService.fetchEarlyWarningSignals(20),
    ]);

    return {
      totalSignals: signals.length,
      strategicCount: signals.filter((s: RadarSignal) => s.radar_score >= 12).length,
      alertCount: warnings.filter((w: EarlyWarningSignal) => w.confidence_score >= 60).length,
      trendCount: trends.length,
    };
  },
};
