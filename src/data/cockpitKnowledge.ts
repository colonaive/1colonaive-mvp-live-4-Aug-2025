// CEO Cockpit — Static knowledge data extracted from agent/agent/knowledge/*.md
// Update this file when knowledge files change.

export interface RegulatoryItem {
  jurisdiction: string;
  status: string;
  classType: string;
  markerPanel: string;
  notes: string;
}

export interface ClinicalTrial {
  name: string;
  lead: string;
  institution: string;
  status: 'proposed' | 'active' | 'completed';
  objectives: string[];
}

export interface InvestorRound {
  phase: string;
  valuation: string;
  investors: { name: string; amount?: string }[];
  totalRaised: string;
  useOfFunds: string[];
}

export interface BrochureItem {
  filename: string;
  title: string;
  market: string;
  status: 'draft' | 'ready' | 'published';
}

export interface ProjectMemoryItem {
  filename: string;
  date: string;
  summary: string;
}

// --- Regulatory Status ---
export const regulatoryItems: RegulatoryItem[] = [
  {
    jurisdiction: 'Singapore (HSA)',
    status: 'Registered',
    classType: 'Class C Medical Device',
    markerPanel: '5-marker (SEPTIN9, IKZF1, BCAT1, VAV3, SEPTIN9-2)',
    notes: 'Current registered version. 6-marker update planned.',
  },
  {
    jurisdiction: 'EU (CE IVDR)',
    status: 'Aligned',
    classType: 'Class C IVD',
    markerPanel: '6-marker (SEPTIN9, SEPTIN9-R2, BCAT1, IKZF1, BCAN, VAV3)',
    notes: 'CE IVDR version with expanded panel.',
  },
  {
    jurisdiction: 'India (CDSCO)',
    status: 'Submission Planned',
    classType: 'Class C IVD',
    markerPanel: '6-marker',
    notes: 'MD-14 to MD-15 pathway. Target Q1 2026.',
  },
  {
    jurisdiction: 'China (NMPA)',
    status: 'Approved',
    classType: 'NMPA Certified',
    markerPanel: '5-marker',
    notes: 'Cert No. 20243400902, valid until 2029-05-13.',
  },
];

// --- Clinical Trials ---
export const clinicalTrials: ClinicalTrial[] = [
  {
    name: 'KTPH Investigator Study',
    lead: 'Dr Daniel Lee',
    institution: 'Khoo Teck Puat Hospital',
    status: 'proposed',
    objectives: [
      'Evaluate concordance between ColonAiQ results and colonoscopy findings',
      'Validate test performance in Singapore population',
      'Generate real-world evidence for clinical adoption',
    ],
  },
  {
    name: 'SCRS Physician Engagement',
    lead: 'SCRS Leadership',
    institution: 'Society of Colorectal Surgeons, Singapore',
    status: 'proposed',
    objectives: [
      'Physician education programs',
      'Investigator-initiated studies',
      'Multi-institution data collection',
      'Conference presentations',
    ],
  },
  {
    name: 'Temasek Research Collaboration',
    lead: 'TBD',
    institution: 'Temasek Life Sciences Laboratory',
    status: 'proposed',
    objectives: [
      'Translational clinical studies',
      'Biomarker validation research',
      'Multi-institution collaboration',
    ],
  },
  {
    name: 'SMILES Multi-Centre Trial',
    lead: 'Dr Param / Dr Ritesh',
    institution: 'SMILES Network',
    status: 'proposed',
    objectives: [
      'Validate ColonAiQ across diverse Asian populations',
      'Generate larger datasets for regulatory and guideline acceptance',
      'Support future reimbursement discussions',
    ],
  },
];

// --- Investor History ---
export const investorRounds: InvestorRound[] = [
  {
    phase: 'Seed Round (Pre-HSA)',
    valuation: 'SGD 500K',
    investors: [
      { name: 'Dr Arul', amount: 'SGD 60K' },
      { name: 'Lydia Tong', amount: 'SGD 5K' },
    ],
    totalRaised: 'SGD 65K',
    useOfFunds: ['Regulatory preparation', 'Market development', 'Operational runway'],
  },
  {
    phase: 'Second Raise (Post-HSA)',
    valuation: 'SGD 3M',
    investors: [
      { name: 'Prof Seow-Choen' },
      { name: 'Prof Shabbir' },
    ],
    totalRaised: 'SGD 60K',
    useOfFunds: ['Commercialization preparation', 'Clinical validation programs', 'Expansion planning'],
  },
];

// --- Brochures ---
export const brochures: BrochureItem[] = [
  { filename: 'SG_patient_brochure_v1.md', title: 'Singapore Patient Brochure', market: 'Singapore', status: 'draft' },
  { filename: 'SG_doctor_brochure_v1.md', title: 'Singapore Doctor Brochure', market: 'Singapore', status: 'draft' },
  { filename: 'SG_clinic_poster.md', title: 'Singapore Clinic Poster', market: 'Singapore', status: 'draft' },
];

// --- Project Memory (WCRs) ---
export const projectMemoryItems: ProjectMemoryItem[] = [];
