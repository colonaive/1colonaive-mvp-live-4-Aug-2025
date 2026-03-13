// Chief-of-Staff — Investor Materials Engine
// Generates pitch deck content, market summaries, technology explainers, and financial narratives.
// Sources data from knowledgebase, research radar, and market intelligence.

import { regulatoryItems, investorRounds, clinicalTrials } from '@/data/cockpitKnowledge';

export type MaterialType = 'pitch-deck' | 'market-summary' | 'tech-explainer' | 'financial-narrative' | 'one-pager';
export type MaterialStatus = 'draft' | 'review' | 'approved' | 'distributed';

export interface InvestorMaterial {
  id: string;
  type: MaterialType;
  title: string;
  description: string;
  status: MaterialStatus;
  generatedAt: string;
  lastUpdated: string;
  sections: InvestorSection[];
}

export interface InvestorSection {
  heading: string;
  content: string;
  dataPoints?: string[];
}

export interface InvestorDashboardStats {
  totalMaterials: number;
  drafts: number;
  approved: number;
  lastGenerated?: string;
  totalRaised: string;
  currentValuation: string;
  marketsActive: number;
}

// Static materials registry
const materialsRegistry: InvestorMaterial[] = [
  {
    id: 'inv-001',
    type: 'pitch-deck',
    title: 'ColonAiQ Investor Deck — Q1 2026',
    description: 'Core pitch deck covering market opportunity, technology, regulatory status, and growth plan.',
    status: 'draft',
    generatedAt: '2026-03-13T00:00:00Z',
    lastUpdated: '2026-03-13T00:00:00Z',
    sections: [
      {
        heading: 'Market Opportunity',
        content: 'Colorectal cancer is the #1 cancer in Singapore and #3 globally. Current screening uptake is below 40%. ColonAiQ addresses the compliance gap with a non-invasive blood test.',
        dataPoints: ['#1 cancer in Singapore', '<40% screening uptake', '5-marker methylation PCR'],
      },
      {
        heading: 'Technology',
        content: 'Multi-gene methylation PCR detection using SEPTIN9, BCAT1, IKZF1, BCAN, VAV3 markers. ~86% sensitivity, 92% specificity for CRC detection.',
        dataPoints: ['86% sensitivity', '92% specificity', '5 biomarkers'],
      },
      {
        heading: 'Regulatory Status',
        content: regulatoryItems.map((r) => `${r.jurisdiction}: ${r.status}`).join('. '),
      },
      {
        heading: 'Financial Summary',
        content: investorRounds.map((r) => `${r.phase}: ${r.totalRaised} raised at ${r.valuation} valuation`).join('. '),
      },
    ],
  },
  {
    id: 'inv-002',
    type: 'market-summary',
    title: 'APAC CRC Screening Market Overview',
    description: 'Regional market analysis covering Singapore, India, Philippines, and expansion targets.',
    status: 'draft',
    generatedAt: '2026-03-13T00:00:00Z',
    lastUpdated: '2026-03-13T00:00:00Z',
    sections: [
      {
        heading: 'Singapore',
        content: 'HSA-registered. Lab validation with Angsana Molecular. COLONAiVE national movement launched.',
        dataPoints: ['Population: 5.9M', 'CRC incidence: #1 cancer', 'Screening gap: significant'],
      },
      {
        heading: 'India',
        content: 'CDSCO submission planned via MD-14/MD-15 pathway. 6-marker version. Partner: Futurz Med.',
        dataPoints: ['Population: 1.4B', 'Rising CRC incidence', 'Import license pathway'],
      },
      {
        heading: 'Philippines',
        content: 'GTM planning stage. Key contacts at St. Luke\'s. FDA LTO/CMDR pathway.',
        dataPoints: ['Population: 115M', 'Growing diagnostics market'],
      },
    ],
  },
  {
    id: 'inv-003',
    type: 'tech-explainer',
    title: 'ColonAiQ Technology Deep Dive',
    description: 'Technical overview of methylation PCR technology, marker panel, and clinical evidence.',
    status: 'draft',
    generatedAt: '2026-03-13T00:00:00Z',
    lastUpdated: '2026-03-13T00:00:00Z',
    sections: [
      {
        heading: 'How It Works',
        content: 'ColonAiQ detects cancer-specific DNA methylation patterns from a standard blood draw. Circulating tumor DNA (ctDNA) sheds into the bloodstream from colorectal tumors, carrying distinct methylation signatures.',
      },
      {
        heading: 'Clinical Trials',
        content: clinicalTrials.map((t) => `${t.name} (${t.institution}) — ${t.status}`).join('. '),
      },
    ],
  },
];

export const investorGenerator = {
  /** Get all investor materials */
  getAllMaterials(): InvestorMaterial[] {
    return [...materialsRegistry];
  },

  /** Get materials by type */
  getByType(type: MaterialType): InvestorMaterial[] {
    return materialsRegistry.filter((m) => m.type === type);
  },

  /** Get materials by status */
  getByStatus(status: MaterialStatus): InvestorMaterial[] {
    return materialsRegistry.filter((m) => m.status === status);
  },

  /** Get dashboard stats */
  getStats(): InvestorDashboardStats {
    const latestRound = investorRounds[investorRounds.length - 1];
    return {
      totalMaterials: materialsRegistry.length,
      drafts: materialsRegistry.filter((m) => m.status === 'draft').length,
      approved: materialsRegistry.filter((m) => m.status === 'approved').length,
      lastGenerated: materialsRegistry.length > 0
        ? materialsRegistry.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())[0].generatedAt
        : undefined,
      totalRaised: investorRounds.reduce((acc, r) => {
        const match = r.totalRaised.match(/[\d,]+/);
        return acc + (match ? parseInt(match[0].replace(',', ''), 10) : 0);
      }, 0).toLocaleString('en-SG', { style: 'currency', currency: 'SGD', maximumFractionDigits: 0 }),
      currentValuation: latestRound?.valuation || 'N/A',
      marketsActive: regulatoryItems.filter((r) =>
        r.status.toLowerCase().includes('approved') || r.status.toLowerCase().includes('registered')
      ).length,
    };
  },
};
