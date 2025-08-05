import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColonCancerTestIndiaPage: React.FC = () => {
  const content = {
    title: 'Colon Cancer Test India | Colorectal Screening Options',
    metaDescription: 'Colon cancer testing in India. Affordable screening options including blood tests, stool tests, and colonoscopy at leading hospitals and diagnostic centers.',
    heroTitle: 'Accessible Colon Cancer Testing Across India',
    heroSubtitle: 'Early detection of colon cancer is now more accessible across India with affordable screening options at leading hospitals and diagnostic centers.',
    benefitsList: [
      'Available at major hospital chains and diagnostic centers',
      'Affordable pricing compared to Western countries',
      'Multiple test options: blood tests, stool tests, colonoscopy',
      'Insurance coverage available through major providers',
      'Expert gastroenterologists and oncologists',
      'Modern facilities with international standards'
    ],
    ctaText: {
      primary: 'Find Testing Center',
      secondary: 'Check Prices',
      tertiary: 'Book Consultation'
    },
    faqItems: [
      {
        question: 'What colon cancer tests are available in India?',
        answer: 'India offers comprehensive options including FIT/FOBT tests (₹500-₹1,500), advanced blood tests (₹15,000-₹35,000), flexible sigmoidoscopy (₹8,000-₹15,000), and colonoscopy (₹12,000-₹25,000) at leading hospitals.'
      },
      {
        question: 'When should Indians start colon cancer screening?',
        answer: 'Experts recommend screening from age 45-50 for average-risk Indians, or earlier with family history. Rising rates in urban India make early screening increasingly important, especially in metro cities.'
      },
      {
        question: 'Which hospitals offer colon cancer testing?',
        answer: 'Leading hospitals include Apollo, Fortis, Max Healthcare, Manipal, AIIMS, Tata Memorial Hospital, and regional cancer centers. Many offer comprehensive screening packages and expert gastroenterology departments.'
      },
      {
        question: 'Is colon cancer testing covered by insurance in India?',
        answer: 'Many health insurance policies cover diagnostic tests when medically indicated. Preventive screening coverage varies by insurer. Check with your provider or consider health screening packages offered by hospitals.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colon Cancer Trends in India',
      processTitle: 'Getting Tested in India',
      processSteps: [
        'Consult gastroenterologist or oncologist for risk assessment',
        'Choose appropriate test based on age, risk factors, and budget',
        'Complete testing at accredited facility and discuss results with specialist'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colon cancer test India"
      language="en"
      region="India"
      intent="diagnosis"
      category="local"
      content={content}
    />
  );
};

export default ColonCancerTestIndiaPage;