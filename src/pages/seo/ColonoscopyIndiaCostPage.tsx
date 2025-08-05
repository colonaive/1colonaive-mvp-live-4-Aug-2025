import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColonoscopyIndiaCostPage: React.FC = () => {
  const content = {
    title: 'Colonoscopy Cost India | Affordable Colon Cancer Screening',
    metaDescription: 'Colonoscopy cost in India ranges from ₹12,000-₹25,000. Compare prices at top hospitals, insurance coverage, and find affordable colon cancer screening options.',
    heroTitle: 'Affordable Colonoscopy in India',
    heroSubtitle: 'Get world-class colonoscopy screening at a fraction of global costs. Compare prices and find the best options across India\'s leading hospitals.',
    benefitsList: [
      'Costs 70-80% less than Western countries',
      'Available at 500+ hospitals across India',
      'Insurance coverage available through major providers',
      'International quality standards at top hospitals',
      'Expert gastroenterologists and state-of-the-art equipment',
      'Package deals often include consultation and follow-up'
    ],
    ctaText: {
      primary: 'Compare Prices',
      secondary: 'Find Hospitals',
      tertiary: 'Check Insurance'
    },
    faqItems: [
      {
        question: 'What does colonoscopy cost in different Indian cities?',
        answer: 'Mumbai/Delhi: ₹15,000-₹25,000, Bangalore/Chennai: ₹12,000-₹20,000, Pune/Hyderabad: ₹10,000-₹18,000, Tier-2 cities: ₹8,000-₹15,000. Premium hospitals may charge more but offer comprehensive packages.'
      },
      {
        question: 'Is colonoscopy covered by health insurance in India?',
        answer: 'Most health insurance policies cover colonoscopy when medically indicated (symptoms, family history, positive screening tests). Preventive screening coverage varies. Cashless treatment available at network hospitals.'
      },
      {
        question: 'What is included in the colonoscopy cost?',
        answer: 'Typical costs include pre-procedure consultation, bowel preparation kit, the procedure itself, recovery monitoring, and basic pathology if biopsies are taken. Additional charges may apply for polyp removal or complex procedures.'
      },
      {
        question: 'How to choose the right hospital for colonoscopy?',
        answer: 'Consider: NABH/JCI accreditation, gastroenterologist experience, equipment quality, patient reviews, insurance network participation, and overall cost including consultation and follow-up care.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colonoscopy Accessibility in India',
      processTitle: 'Getting Colonoscopy in India',
      processSteps: [
        'Research hospitals, compare costs, and verify insurance coverage',
        'Book consultation with gastroenterologist and receive preparation instructions',
        'Complete procedure at chosen facility and receive comprehensive report'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colonoscopy India cost"
      language="en"
      region="India"
      intent="diagnosis"
      category="local"
      content={content}
    />
  );
};

export default ColonoscopyIndiaCostPage;