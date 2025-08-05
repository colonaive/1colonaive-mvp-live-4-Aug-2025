import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const ColorectalCancerScreeningIndiaPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Screening India | कोलोरेक्टल कैंसर स्क्रीनिंग | Early Detection',
    metaDescription: 'Comprehensive colorectal cancer screening in India. Blood tests, colonoscopy services, and expert specialists across major cities. Book your screening consultation today.',
    heroTitle: 'Colorectal Cancer Screening in India',
    heroSubtitle: 'Access advanced colorectal cancer screening across India\'s major cities. Early detection through modern testing methods and expert care.',
    benefitsList: [
      'Advanced screening technologies available in major Indian cities',
      'Experienced gastroenterologists and oncologists',
      'Affordable screening options with insurance coverage',
      'Multiple languages supported: Hindi, English, and regional languages',
      'State-of-the-art facilities in Delhi, Mumbai, Bangalore, Chennai',
      'Comprehensive follow-up care and treatment planning'
    ],
    ctaText: {
      primary: 'Book Screening',
      secondary: 'Find Indian Specialist',
      tertiary: 'Get Blood Test'
    },
    faqItems: [
      {
        question: 'What colorectal cancer screening options are available in India?',
        answer: 'India offers various screening methods including FIT tests, advanced blood tests, stool DNA tests, and colonoscopy. Major hospitals in Delhi, Mumbai, Bangalore, and Chennai provide comprehensive screening programs with international standard protocols.'
      },
      {
        question: 'At what age should I start colorectal cancer screening in India?',
        answer: 'Indian medical guidelines recommend starting screening at age 50 for average-risk individuals, similar to international standards. However, if you have family history, inflammatory bowel disease, or other risk factors, screening may begin earlier as recommended by your doctor.'
      },
      {
        question: 'Is colorectal cancer screening covered by insurance in India?',
        answer: 'Many health insurance policies in India cover colorectal cancer screening, especially diagnostic procedures like colonoscopy when medically indicated. Check with your insurance provider about coverage for preventive screening and specific test types.'
      },
      {
        question: 'Where can I get colorectal cancer screening in India?',
        answer: 'Colorectal screening is available at major hospitals and specialty clinics across India, including AIIMS, Tata Memorial, Apollo Hospitals, Fortis Healthcare, and other leading healthcare providers in metropolitan cities.'
      }
    ],
    localizedContent: {
      statsTitle: 'Colorectal Cancer in India - Key Statistics',
      processTitle: 'Your Screening Journey in India',
      processSteps: [
        'Consult with gastroenterologist or oncologist for risk assessment and screening recommendation',
        'Complete recommended screening test at certified facility with modern equipment',
        'Receive results with expert interpretation and personalized follow-up care plan'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="colorectal cancer screening India"
      language="en"
      region="India"
      intent="diagnosis"
      category="primary"
      content={content}
    />
  );
};

export default ColorectalCancerScreeningIndiaPage;