import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColorectalCancerScreeningAustraliaPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Screening Australia | National Bowel Cancer Screening Program',
    metaDescription: 'Access Australia\'s National Bowel Cancer Screening Program. Free FOBT tests, Medicare rebates for colonoscopy. Early detection saves lives – get screened today.',
    heroTitle: 'Colorectal Cancer Screening in Australia',
    heroSubtitle: 'Take advantage of Australia\'s comprehensive bowel cancer screening program. Free screening tests and Medicare support available.',
    benefitsList: [
      'Free FOBT screening through National Bowel Cancer Screening Program',
      'Medicare rebates available for diagnostic colonoscopy',
      'Australia has one of the world\'s best screening programs',
      'Screening reduces bowel cancer deaths by up to 15%',
      'Convenient home testing kits delivered to your door',
      'Follow-up care through Australian specialists'
    ],
    ctaText: {
      primary: 'Get Free Screening',
      secondary: 'Find Australian Specialist',
      tertiary: 'Learn About NBCSP'
    },
    faqItems: [
      {
        question: 'What is Australia\'s National Bowel Cancer Screening Program?',
        answer: 'Australia\'s NBCSP provides free bowel cancer screening to eligible Australians aged 50-74. You\'ll receive a free FOBT (immunochemical faecal occult blood test) kit by mail every two years, which you complete at home and return for analysis.'
      },
      {
        question: 'Am I eligible for free bowel cancer screening in Australia?',
        answer: 'All Australians aged 50-74 with a current Medicare card are eligible for free screening through the NBCSP. The program has been gradually expanding and now covers all eligible age groups with biennial screening invitations.'
      },
      {
        question: 'What happens if my FOBT test is positive?',
        answer: 'A positive FOBT result doesn\'t mean you have cancer – about 1 in 14 people get a positive result. You\'ll be referred for colonoscopy, which is covered by Medicare. This diagnostic procedure will determine if further investigation or treatment is needed.'
      },
      {
        question: 'Should I get screened if I have no symptoms?',
        answer: 'Yes, absolutely. Bowel cancer often develops without symptoms, especially in early stages. The NBCSP is designed for people without symptoms. If you have symptoms like bleeding, pain, or bowel changes, see your GP immediately – don\'t wait for routine screening.'
      }
    ],
    localizedContent: {
      statsTitle: 'Australian Bowel Cancer Statistics',
      processTitle: 'Your Australian Screening Journey',
      processSteps: [
        'Receive your free FOBT screening kit by mail (if eligible) or request from your GP',
        'Complete the simple home test following the provided instructions',
        'Return the kit and receive results within 2 weeks, with GP follow-up if needed'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colorectal cancer screening Australia"
      language="en"
      region="Australia"
      intent="diagnosis"
      category="primary"
      content={content}
    />
  );
};

export default ColorectalCancerScreeningAustraliaPage;