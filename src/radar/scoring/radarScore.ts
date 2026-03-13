/**
 * Radar Signal Scoring Engine
 * Computes a composite score for CRC research signals based on strategic relevance.
 */

export type SignalLevel = 'strategic' | 'high' | 'monitor' | 'ignore';

interface ScoringInput {
  title: string;
  abstract?: string;
  journal?: string;
  source?: string;
  authors?: string;
}

// High-impact factor journals (IF > 20)
const HIGH_IF_JOURNALS = [
  'new england journal of medicine',
  'nejm',
  'lancet',
  'lancet oncology',
  'jama',
  'jama oncology',
  'nature',
  'nature medicine',
  'nature reviews cancer',
  'bmj',
  'cell',
  'annals of oncology',
  'journal of clinical oncology',
  'gastroenterology',
  'gut',
  'science',
];

const SCORING_RULES: Array<{ pattern: RegExp; weight: number; label: string }> = [
  // Clinical trial signals
  { pattern: /\bclinical trial\b/i, weight: 4, label: 'clinical_trial' },
  { pattern: /\brandomized\b|\brandomised\b|\brct\b/i, weight: 3, label: 'rct' },
  // Screening population study
  { pattern: /\bscreening\b.*\bpopulation\b|\bpopulation[- ]based\b.*\bscreening\b/i, weight: 4, label: 'screening_population' },
  { pattern: /\bscreening\b/i, weight: 2, label: 'screening' },
  // ctDNA / liquid biopsy
  { pattern: /\bctdna\b|\bcirculating tumor dna\b|\bcirculating tumour dna\b/i, weight: 3, label: 'ctDNA' },
  { pattern: /\bliquid biopsy\b/i, weight: 3, label: 'liquid_biopsy' },
  // DNA methylation
  { pattern: /\bdna methylation\b|\bmethylation\b/i, weight: 3, label: 'methylation' },
  // Policy relevance
  { pattern: /\bpolicy\b|\bguideline\b|\brecommendation\b|\btask force\b/i, weight: 3, label: 'policy' },
  // Large cohort
  { pattern: /\b\d{3,}\s*(patients?|participants?|subjects?|individuals?)\b/i, weight: 3, label: 'large_cohort' },
  // Media coverage indicator
  { pattern: /\bnews\b|\bpress release\b|\bannouncement\b/i, weight: 2, label: 'media' },
  // Early detection / non-invasive
  { pattern: /\bearly detection\b|\bearly[- ]onset\b/i, weight: 3, label: 'early_detection' },
  { pattern: /\bnon[- ]invasive\b|\bblood[- ]based\b/i, weight: 3, label: 'non_invasive' },
  // Sensitivity/specificity results
  { pattern: /\bsensitivity\b.*\bspecificity\b|\bspecificity\b.*\bsensitivity\b/i, weight: 2, label: 'performance_metrics' },
];

export function computeRadarScore(input: ScoringInput): number {
  const haystack = `${input.title}\n${input.abstract || ''}\n${input.journal || ''}`.toLowerCase();
  let score = 0;

  // Journal impact factor bonus
  const journalLower = (input.journal || '').toLowerCase();
  if (HIGH_IF_JOURNALS.some((j) => journalLower.includes(j))) {
    score += 5;
  }

  // Apply scoring rules
  for (const rule of SCORING_RULES) {
    if (rule.pattern.test(haystack)) {
      score += rule.weight;
    }
  }

  return score;
}

export function classifySignal(score: number): SignalLevel {
  if (score >= 12) return 'strategic';
  if (score >= 8) return 'high';
  if (score >= 5) return 'monitor';
  return 'ignore';
}

export function getSignalColor(level: SignalLevel): string {
  switch (level) {
    case 'strategic': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20';
    case 'high': return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20';
    case 'monitor': return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20';
    case 'ignore': return 'text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-800';
  }
}

export function getSignalLabel(level: SignalLevel): string {
  switch (level) {
    case 'strategic': return 'STRATEGIC SIGNAL';
    case 'high': return 'HIGH RELEVANCE';
    case 'monitor': return 'MONITOR';
    case 'ignore': return 'LOW PRIORITY';
  }
}
