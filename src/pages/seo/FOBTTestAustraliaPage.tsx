import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const FOBTTestAustraliaPage: React.FC = () => {
  const content = {
    title: 'FOBT Test Australia | Free Bowel Cancer Screening Program',
    metaDescription: 'Free FOBT (Faecal Occult Blood Test) in Australia. Learn about the National Bowel Cancer Screening Program, eligibility, and how to complete your test.',
    heroTitle: 'Free FOBT Testing for All Eligible Australians',
    heroSubtitle: 'The Faecal Occult Blood Test (FOBT) is provided free through Australia\'s National Bowel Cancer Screening Program to save lives.',
    benefitsList: [
      'Completely free for eligible Australians aged 50-74',
      'Mailed directly to your home every two years',
      'TGA-approved and clinically validated',
      'Simple at-home collection process',
      'No dietary restrictions required',
      'Integrated with Australian healthcare system'
    ],
    ctaText: {
      primary: 'Order FOBT Kit',
      secondary: 'Check Eligibility',
      tertiary: 'Learn More'
    },
    faqItems: [
      {
        question: 'What is the FOBT test?',
        answer: 'The Faecal Occult Blood Test (FOBT) detects tiny amounts of blood in bowel motions that may indicate bowel cancer or polyps. Australia uses an immunochemical version (iFOBT) that doesn\'t require dietary restrictions.'
      },
      {
        question: 'Who gets free FOBT testing in Australia?',
        answer: 'All Australians aged 50-74 are eligible for free FOBT testing through the National Bowel Cancer Screening Program. Kits are automatically mailed to eligible individuals every two years.'
      },
      {
        question: 'How do I complete the FOBT test?',
        answer: 'Follow the simple instructions in your kit: collect small stool samples using the provided equipment, store as directed, and return to the laboratory using the prepaid envelope. No preparation needed.'
      },
      {
        question: 'What happens if my FOBT is positive?',
        answer: 'A positive result means blood was detected and requires follow-up with colonoscopy. Your GP will arrange this urgently. Remember, only about 1 in 18 positive tests actually show cancer - most reveal treatable conditions.'
      }
    ],
    localizedContent: {
      statsTitle: 'FOBT Program Success in Australia',
      processTitle: 'FOBT Testing Process',
      processSteps: [
        'Receive free FOBT kit by mail or collect from GP',
        'Complete test at home following kit instructions',
        'Return sample using prepaid envelope and await results notification'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="FOBT test Australia"
      language="en"
      region="Australia"
      intent="non-invasive"
      category="local"
      content={content}
    />
  );
};

export default FOBTTestAustraliaPage;