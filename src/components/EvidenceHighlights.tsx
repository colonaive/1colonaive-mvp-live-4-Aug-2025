// /src/components/EvidenceHighlights.tsx
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface EvidenceCard {
  id: number;
  headline: string;
  description: string;
  source: string;
  link: string;
  linkType: 'DOI' | 'PMC' | 'HSA';
}

const evidenceData: EvidenceCard[] = [
  {
    id: 1,
    headline: 'Colonoscopy Reduces Deaths by Over 60%',
    description: 'Regular colonoscopy screening reduces CRC mortality by up to 62%.',
    source: 'Zhang et al. Meta-analysis (PMC7477408)',
    link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7477408/',
    linkType: 'PMC'
  },
  {
    id: 2,
    headline: 'Stage I CRC: 90%+ 5-Year Survival',
    description: 'Early-stage detection dramatically improves survival.',
    source: 'JAMA Network Open, 2021 (DOI: 10.1001/jamanetworkopen.2021.12539)',
    link: 'https://doi.org/10.1001/jamanetworkopen.2021.12539',
    linkType: 'DOI'
  },
  {
    id: 3,
    headline: 'Non-Invasive Tests Improve Screening Uptake',
    description: 'Blood-based or postal FIT programs double participation rates.',
    source: 'Cancer Prevention Research (PMC10835528)',
    link: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10835528/',
    linkType: 'PMC'
  },
  {
    id: 4,
    headline: '47% of Early-Onset CRC Cases &lt; Age 45',
    description: 'Nearly half of early-onset CRC is diagnosed before 45.',
    source: 'JAMA, 2021 (DOI: 10.1001/jama.2021.6238)',
    link: 'https://doi.org/10.1001/jama.2021.6238',
    linkType: 'DOI'
  },
  {
    id: 5,
    headline: 'HSA-Cleared Modern Screening Technologies',
    description: 'Singapore\'s Health Sciences Authority has cleared advanced non-invasive screening tools.',
    source: 'HSA registry (public info, use generic text only)',
    link: '#',
    linkType: 'HSA'
  }
];

export const EvidenceHighlights: React.FC = () => {
  const handleLinkClick = (link: string, linkType: string) => {
    if (link !== '#') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const getLinkColor = (linkType: string) => {
    switch (linkType) {
      case 'DOI':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200';
      case 'PMC':
        return 'bg-green-100 text-green-700 hover:bg-green-200';
      case 'HSA':
        return 'bg-teal-100 text-teal-700 hover:bg-teal-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Evidence-Backed CRC Screening Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Project COLONAiVE™ is built on peer-reviewed research demonstrating the life-saving impact of early colorectal cancer detection and screening.
          </p>
        </div>

        {/* Evidence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {evidenceData.map((evidence) => (
            <div
              key={evidence.id}
              data-testid={`evidence-card-${evidence.id}`}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col h-full"
            >
              {/* Headline */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">
                {evidence.headline}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {evidence.description}
              </p>
              
              {/* Source and Link */}
              <div className="mt-auto">
                <p className="text-xs text-gray-500 mb-3">
                  {evidence.source}
                </p>
                
                {evidence.linkType !== 'HSA' && (
                  <button
                    onClick={() => handleLinkClick(evidence.link, evidence.linkType)}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 ${getLinkColor(evidence.linkType)}`}
                    disabled={evidence.link === '#'}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View {evidence.linkType}
                  </button>
                )}
                
                {evidence.linkType === 'HSA' && (
                  <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getLinkColor(evidence.linkType)}`}>
                    <span className="w-3 h-3 mr-1 rounded-full bg-current opacity-60"></span>
                    Official Registry
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                All evidence claims verified through peer-reviewed research
              </span>
            </div>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="mt-8 max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Clinical Evidence Disclaimer:</strong> The statistics and claims presented are sourced from peer-reviewed medical literature and clinical studies. 
            Individual results may vary. This information is for educational purposes and does not constitute medical advice. 
            Always consult with qualified healthcare providers for personalized screening recommendations and medical decisions.
          </p>
        </div>
      </div>
    </div>
  );
};