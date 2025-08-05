import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColonCancerTestPhilippinesPage: React.FC = () => {
  const content = {
    title: 'Colon Cancer Test Philippines | Colorectal Screening Options',
    metaDescription: 'Colon cancer testing in the Philippines. Available at major hospitals in Manila, Cebu, and Davao. Affordable screening options with PhilHealth coverage.',
    heroTitle: 'Colon Cancer Testing in the Philippines',
    heroSubtitle: 'Access comprehensive colon cancer screening at leading hospitals across the Philippines, from Metro Manila to Cebu and Davao.',
    benefitsList: [
      'Available at top hospitals: St. Luke\'s, Makati Med, Asian Hospital',
      'PhilHealth coverage for eligible procedures',
      'Affordable costs compared to other countries',
      'Modern facilities with international standards',
      'Filipino and international gastroenterologists',
      'Comprehensive cancer care centers available'
    ],
    ctaText: {
      primary: 'Find Testing Center',
      secondary: 'Check PhilHealth',
      tertiary: 'Book Consultation'
    },
    faqItems: [
      {
        question: 'Where can I get colon cancer testing in the Philippines?',
        answer: 'Major hospitals offer testing: St. Luke\'s Medical Center, Makati Medical Center, Asian Hospital, Philippine General Hospital, Vicente Sotto Memorial, and Davao Medical School Foundation. Many have dedicated gastroenterology departments.'
      },
      {
        question: 'What are the costs of colon cancer tests in the Philippines?',
        answer: 'FOBT/FIT: ₱1,000-₱3,000, Blood tests: ₱20,000-₱40,000, Flexible sigmoidoscopy: ₱15,000-₱25,000, Colonoscopy: ₱25,000-₱40,000. PhilHealth provides partial coverage for medically indicated procedures.'
      },
      {
        question: 'Is colon cancer screening covered by PhilHealth?',
        answer: 'PhilHealth covers colonoscopy and other procedures when medically indicated (symptoms, positive screening tests, family history). Coverage includes both professional fees and hospital charges at accredited facilities.'
      },
      {
        question: 'When should Filipinos start colon cancer screening?',
        answer: 'Screening is recommended from age 45-50, or earlier with risk factors. Rising colon cancer rates in the Philippines make screening increasingly important, especially for those with family history or lifestyle risk factors.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colon Cancer in the Philippines',
      processTitle: 'Getting Tested in the Philippines',
      processSteps: [
        'Consult with gastroenterologist at accredited hospital',
        'Verify PhilHealth coverage and complete required documentation',
        'Undergo testing and receive results with follow-up recommendations'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colon cancer test Philippines"
      language="en"
      region="Philippines"
      intent="diagnosis"
      category="local"
      content={content}
    />
  );
};

export default ColonCancerTestPhilippinesPage;