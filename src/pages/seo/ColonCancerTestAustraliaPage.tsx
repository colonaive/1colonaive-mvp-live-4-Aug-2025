import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColonCancerTestAustraliaPage: React.FC = () => {
  const content = {
    title: 'Colon Cancer Test Australia | National Bowel Cancer Screening',
    metaDescription: 'Colon cancer testing in Australia through the National Bowel Cancer Screening Program. Free testing for eligible Australians aged 50-74. Learn about your options.',
    heroTitle: 'Colon Cancer Testing Across Australia',
    heroSubtitle: 'Access comprehensive colon cancer testing through Australia\'s National Bowel Cancer Screening Program and private healthcare options.',
    benefitsList: [
      'Free National Bowel Cancer Screening Program for ages 50-74',
      'TGA-approved screening technologies available',
      'Comprehensive Medicare coverage for eligible testing',
      'Private options with advanced blood tests and colonoscopy',
      'Access to leading gastroenterologists nationwide',
      'Integration with Australian healthcare system and GP networks'
    ],
    ctaText: {
      primary: 'Find Testing Near You',
      secondary: 'Check Eligibility',
      tertiary: 'Compare Options'
    },
    faqItems: [
      {
        question: 'What is the National Bowel Cancer Screening Program?',
        answer: 'Australia\'s government program provides free bowel cancer screening for eligible Australians aged 50-74. Participants receive a free FOBT (Faecal Occult Blood Test) kit by mail every two years.'
      },
      {
        question: 'What colon cancer tests are available in Australia?',
        answer: 'Options include: Free FOBT through the national program, private FIT tests, advanced blood tests (Shield™, Cologuard alternatives), flexible sigmoidoscopy, and colonoscopy at public and private facilities.'
      },
      {
        question: 'How much do colon cancer tests cost in Australia?',
        answer: 'FOBT is free through the national program. Private FIT tests cost $30-$80, blood tests $300-$600, colonoscopy $1500-$3000 privately (bulk-billed options available). Medicare provides rebates for many services.'
      },
      {
        question: 'When should I get tested for colon cancer?',
        answer: 'Most Australians should begin screening at age 50, or earlier with family history or symptoms. The national program automatically sends kits to eligible individuals. Consult your GP for personalized recommendations.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colon Cancer Impact in Australia',
      processTitle: 'Getting Tested in Australia',
      processSteps: [
        'Receive free FOBT kit by mail or consult GP for screening options',
        'Complete test following provided instructions or attend clinic appointment',
        'Receive results and follow-up care through your GP or specialist referral'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colon cancer test Australia"
      language="en"
      region="Australia"
      intent="diagnosis"
      category="local"
      content={content}
    />
  );
};

export default ColonCancerTestAustraliaPage;