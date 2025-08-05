import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const BowelCancerScreeningPage: React.FC = () => {
  const content = {
    title: 'Bowel Cancer Screening Singapore | Colorectal Cancer Detection',
    metaDescription: 'Comprehensive bowel cancer screening in Singapore. Multiple HSA-cleared options including blood tests, FIT, and colonoscopy. Early detection saves lives.',
    heroTitle: 'Comprehensive Bowel Cancer Screening',
    heroSubtitle: 'Protect yourself with regular bowel cancer screening. Multiple convenient options available to suit your lifestyle and preferences.',
    benefitsList: [
      'Multiple screening methods: blood test, FIT, colonoscopy',
      'HSA-cleared and internationally validated technologies',
      'Suitable for all risk levels and age groups',
      'Government subsidies available at polyclinics',
      'Private clinic options with shorter waiting times',
      'Expert gastroenterologist network for follow-up care'
    ],
    ctaText: {
      primary: 'Schedule Screening',
      secondary: 'Compare Options',
      tertiary: 'Check Subsidies'
    },
    faqItems: [
      {
        question: 'What is bowel cancer screening?',
        answer: 'Bowel cancer screening involves tests to detect colorectal cancer or pre-cancerous polyps before symptoms appear. Singapore offers multiple HSA-cleared screening methods including stool tests, blood tests, and endoscopic procedures.'
      },
      {
        question: 'Who should get bowel cancer screening?',
        answer: 'Singapore guidelines recommend screening for adults aged 50-75, with consideration for earlier screening (age 45) based on family history or risk factors. Your doctor can assess your individual risk profile.'
      },
      {
        question: 'What are the different screening options?',
        answer: 'Options include: FIT tests (annual, at-home), advanced blood tests like Shield™ (convenient, high accuracy), flexible sigmoidoscopy (every 5 years), and colonoscopy (every 10 years, gold standard).'
      },
      {
        question: 'How much does bowel cancer screening cost?',
        answer: 'Costs vary by method and provider. Polyclinic FIT tests cost $5-$10, blood tests $200-$500, colonoscopy $800-$2000. Many services are Medisave-claimable and covered by insurance.'
      }
    ],
    localizedContent: {
      statsTitle: 'Bowel Cancer Statistics in Singapore',
      processTitle: 'Your Screening Journey',
      processSteps: [
        'Consult your doctor to determine the best screening method for you',
        'Complete chosen screening test with proper preparation if required',
        'Receive results and follow recommended next steps or surveillance schedule'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="bowel cancer screening"
      language="en"
      region="Singapore"
      intent="diagnosis"
      category="primary"
      content={content}
    />
  );
};

export default BowelCancerScreeningPage;