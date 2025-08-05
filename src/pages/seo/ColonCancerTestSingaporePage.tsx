import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColonCancerTestSingaporePage: React.FC = () => {
  const content = {
    title: 'Colon Cancer Test Singapore | Advanced Blood Tests & Screening Options',
    metaDescription: 'Get reliable colon cancer testing in Singapore. HSA-cleared blood tests, FIT tests, and colonoscopy options. Book your test today for early detection and peace of mind.',
    heroTitle: 'Advanced Colon Cancer Testing in Singapore',
    heroSubtitle: 'Choose from Singapore\'s most advanced colon cancer testing options. From non-invasive blood tests to comprehensive screening programs.',
    benefitsList: [
      'Multiple testing options: blood tests, FIT tests, and colonoscopy',
      'HSA-cleared advanced screening technologies',
      '94% sensitivity for early-stage colon cancer detection',
      'Same-day results available for some tests',
      'Experienced specialists across Singapore',
      'Insurance coverage available for eligible patients'
    ],
    ctaText: {
      primary: 'Book Test Today',
      secondary: 'Find Testing Center',
      tertiary: 'Compare Test Options'
    },
    faqItems: [
      {
        question: 'What types of colon cancer tests are available in Singapore?',
        answer: 'Singapore offers several colon cancer testing options: HSA-cleared blood tests (like Shield™), FIT (Fecal Immunochemical Test), stool DNA tests, and gold-standard colonoscopy. Each test has different advantages depending on your risk profile and preferences.'
      },
      {
        question: 'How accurate are blood tests for colon cancer?',
        answer: 'Advanced blood tests approved in Singapore show up to 94% sensitivity for detecting colon cancer and 89% sensitivity for advanced adenomas. While highly accurate, they complement rather than replace colonoscopy for high-risk individuals.'
      },
      {
        question: 'Where can I get a colon cancer test in Singapore?',
        answer: 'Colon cancer tests are available at public hospitals, private clinics, polyclinics, and specialized screening centers across Singapore. Many GPs can also arrange testing and provide referrals for follow-up care.'
      },
      {
        question: 'How much does colon cancer testing cost in Singapore?',
        answer: 'Costs vary by test type and provider. Subsidized FIT tests at polyclinics cost around S$5-10, while private blood tests range from S$300-800. Colonoscopy costs vary from S$1,000-3,000 depending on the facility and insurance coverage.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colon Cancer Testing Effectiveness',
      processTitle: 'Simple 3-Step Testing Process',
      processSteps: [
        'Choose your preferred test type and book appointment online or by phone',
        'Complete the test at your chosen location with professional medical staff',
        'Receive detailed results with clear next steps and specialist referrals if needed'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colon cancer test Singapore"
      language="en"
      region="Singapore"
      intent="diagnosis"
      category="local"
      content={content}
    />
  );
};

export default ColonCancerTestSingaporePage;