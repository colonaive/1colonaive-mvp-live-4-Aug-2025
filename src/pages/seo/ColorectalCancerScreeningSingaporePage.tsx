import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColorectalCancerScreeningSingaporePage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Screening Singapore | Early Detection Saves Lives',
    metaDescription: 'Get comprehensive colorectal cancer screening in Singapore. HSA-cleared blood tests and colonoscopy services. Book your screening today - early detection saves lives.',
    heroTitle: 'Colorectal Cancer Screening in Singapore',
    heroSubtitle: 'Protect your health with Singapore\'s most trusted colorectal cancer screening options. Early detection can save your life.',
    benefitsList: [
      'HSA-cleared screening technologies available in Singapore',
      '90% survival rate when colorectal cancer is caught early',
      'Non-invasive blood test options alongside traditional methods',
      'Subsidized screening programs through polyclinics',
      'Expert GP referrals for follow-up care',
      'Multilingual healthcare providers across Singapore'
    ],
    ctaText: {
      primary: 'Book Screening Now',
      secondary: 'Find Specialist',
      tertiary: 'Get CRC Blood Test'
    },
    faqItems: [
      {
        question: 'What colorectal cancer screening options are available in Singapore?',
        answer: 'Singapore offers multiple screening options including HSA-cleared blood tests, FIT (Fecal Immunochemical Test), and colonoscopy. The Ministry of Health recommends screening starting at age 50, or earlier if you have family history or risk factors.'
      },
      {
        question: 'Is colorectal cancer screening subsidized in Singapore?',
        answer: 'Yes, Singapore residents can access subsidized colorectal screening through polyclinics and public hospitals. The national screening program covers FIT tests and follow-up colonoscopy when indicated.'
      },
      {
        question: 'How often should I get screened for colorectal cancer?',
        answer: 'For average risk individuals, screening is recommended every 1-2 years with FIT tests or every 10 years with colonoscopy. Your GP will recommend the best schedule based on your risk factors and family history.'
      },
      {
        question: 'What are the early signs of colorectal cancer?',
        answer: 'Early colorectal cancer often has no symptoms, which is why screening is crucial. Warning signs may include changes in bowel habits, blood in stool, abdominal pain, unexplained weight loss, or fatigue.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colorectal Cancer Statistics in Singapore',
      processTitle: 'Your Screening Journey in Singapore',
      processSteps: [
        'Schedule appointment with GP or polyclinic for screening consultation',
        'Complete your chosen screening test (blood test, FIT, or colonoscopy)',
        'Receive results and follow-up care recommendations from your healthcare provider'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colorectal cancer screening"
      language="en"
      region="Singapore"
      intent="diagnosis"
      category="primary"
      content={content}
    />
  );
};

export default ColorectalCancerScreeningSingaporePage;