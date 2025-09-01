import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const BloodTestColorectalCancerPage: React.FC = () => {
  const content = {
    title: 'Blood Test for Colorectal Cancer | Non-Invasive CRC Screening Singapore',
    metaDescription: 'Revolutionary blood test for colorectal cancer screening. 94% accuracy, HSA-cleared, non-invasive alternative to colonoscopy. Book your CRC blood test in Singapore today.',
    heroTitle: 'Revolutionary Blood Test for Colorectal Cancer',
    heroSubtitle: 'Skip the prep, skip the procedure. Get reliable colorectal cancer screening with a simple blood test - now available in Singapore.',
    benefitsList: [
      '94% accuracy in detecting colorectal cancer',
      'No bowel preparation or dietary restrictions required',
      'HSA-cleared and clinically validated technology',
      'Results available within 2-3 business days',
      'Suitable for screening-hesitant individuals',
      'Can be combined with other health screenings'
    ],
    ctaText: {
      primary: 'Get CRC Blood Test',
      secondary: 'Find Testing Location',
      tertiary: 'Compare Screening Options'
    },
    faqItems: [
      {
        question: 'How does a blood test detect colorectal cancer?',
        answer: 'Advanced blood tests detect circulating tumor DNA (ctDNA) and other biomarkers that colorectal cancer cells release into the bloodstream. The Shield™ test, approved by HSA, uses machine learning to analyze these signals with 94% sensitivity for cancer detection.'
      },
      {
        question: 'Is a blood test as accurate as a colonoscopy?',
        answer: 'Blood tests show excellent accuracy (94% sensitivity for cancer), but colonoscopy remains the gold standard. However, blood tests are ideal for initial screening and for people who cannot or will not undergo colonoscopy. Positive results require colonoscopy follow-up.'
      },
      {
        question: 'Who should consider a blood test for colorectal cancer?',
        answer: 'Blood tests are ideal for adults 45+ at average risk, those who have delayed screening due to colonoscopy concerns, busy professionals seeking convenient screening, and as part of comprehensive health check-ups.'
      },
      {
        question: 'What happens if my blood test is positive?',
        answer: 'A positive result means further investigation is needed, typically with colonoscopy. Your healthcare provider will arrange urgent referral and support you through the next steps. Remember, early detection leads to better outcomes.'
      }
    ],
    localizedContent: {
      statsTitle: 'Blood Test Performance Data',
      processTitle: 'Simple Blood Test Process',
      processSteps: [
        'Schedule blood draw at any participating clinic or laboratory',
        'Simple blood collection takes just 5 minutes with no special preparation',
        'Receive results digitally with clear interpretation and next steps'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="blood test colorectal cancer"
      language="en"
      region="Singapore"
      intent="non-invasive"
      category="primary"
      content={content}
    />
  );
};

export default BloodTestColorectalCancerPage;