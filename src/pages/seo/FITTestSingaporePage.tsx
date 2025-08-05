import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const FITTestSingaporePage: React.FC = () => {
  const content = {
    title: 'FIT Test Singapore | Fecal Immunochemical Test for Colon Cancer',
    metaDescription: 'FIT test (Fecal Immunochemical Test) for colon cancer screening in Singapore. Convenient, accurate, and affordable. Available at polyclinics and GP clinics.',
    heroTitle: 'FIT Test: Simple Home Screening for Colon Cancer',
    heroSubtitle: 'The Fecal Immunochemical Test (FIT) is a convenient, at-home screening option recommended by Singapore\'s Ministry of Health.',
    benefitsList: [
      'No dietary restrictions or medication adjustments required',
      'Can be done in the privacy of your own home',
      'High accuracy for detecting colorectal cancer',
      'Available at polyclinics with government subsidies',
      'Recommended by Singapore MOH screening guidelines',
      'Quick and easy sample collection process'
    ],
    ctaText: {
      primary: 'Get FIT Test Kit',
      secondary: 'Find Nearest Clinic',
      tertiary: 'Compare Test Options'
    },
    faqItems: [
      {
        question: 'What is a FIT test and how does it work?',
        answer: 'The FIT (Fecal Immunochemical Test) detects hidden blood in stool that may indicate colorectal cancer or polyps. It uses antibodies to specifically detect human blood, making it more accurate than older tests.'
      },
      {
        question: 'How much does a FIT test cost in Singapore?',
        answer: 'FIT tests are heavily subsidized in Singapore. At polyclinics, costs range from $5-$10 for eligible residents. Private GP clinics may charge $20-$50. Many insurance plans and Medisave cover FIT testing.'
      },
      {
        question: 'How often should I do a FIT test?',
        answer: 'Singapore guidelines recommend annual FIT testing for adults aged 50-75 at average risk. Some may start earlier at 45 based on family history or risk factors. Your doctor will advise on the appropriate schedule.'
      },
      {
        question: 'What if my FIT test is positive?',
        answer: 'A positive FIT test requires follow-up colonoscopy to investigate further. Don\'t panic - only about 10% of positive FIT tests reveal cancer. Many show benign conditions or pre-cancerous polyps that can be removed.'
      }
    ],
    localizedContent: {
      statsTitle: 'FIT Test Performance in Singapore',
      processTitle: 'How to Complete Your FIT Test',
      processSteps: [
        'Collect FIT test kit from polyclinic, GP, or order online',
        'Follow simple instructions to collect stool sample at home',
        'Return sample to clinic or laboratory for analysis and await results'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="FIT test Singapore"
      language="en"
      region="Singapore"
      intent="non-invasive"
      category="local"
      content={content}
    />
  );
};

export default FITTestSingaporePage;