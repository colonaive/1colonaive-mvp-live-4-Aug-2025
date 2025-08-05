import React from 'react';
import SEOLandingTemplate from './SEOLandingTemplate';

const EarlyDetectionColonCancerPage: React.FC = () => {
  const content = {
    title: 'Early Detection Colon Cancer | Screening Saves Lives Singapore',
    metaDescription: 'Early detection of colon cancer saves lives. Learn about screening options, symptoms, and risk factors. Get screened today with HSA-cleared tests in Singapore.',
    heroTitle: 'Early Detection Saves Lives: Colon Cancer Screening',
    heroSubtitle: 'Catch colon cancer in its earliest, most treatable stages. With proper screening, 90% of cases are preventable or curable.',
    benefitsList: [
      '90% survival rate when detected early (Stage I)',
      'Prevention through polyp removal during screening',
      'Multiple screening options available (blood test, FIT, colonoscopy)',
      'HSA-cleared screening technologies',
      'Age-appropriate screening recommendations starting at 45',
      'Family history and risk factor assessment available'
    ],
    ctaText: {
      primary: 'Start Screening Now',
      secondary: 'Check Your Risk',
      tertiary: 'Find Screening Options'
    },
    faqItems: [
      {
        question: 'When should I start screening for colon cancer?',
        answer: 'Most people should begin regular colon cancer screening at age 45, or earlier if you have family history or other risk factors. Singapore follows international guidelines recommending screening for average-risk adults from age 45-75.'
      },
      {
        question: 'What are the early signs of colon cancer?',
        answer: 'Early colon cancer often has no symptoms, which is why screening is crucial. However, warning signs include persistent changes in bowel habits, blood in stool, unexplained weight loss, persistent abdominal discomfort, and fatigue.'
      },
      {
        question: 'How effective is early detection?',
        answer: 'Early detection dramatically improves outcomes. When caught at Stage I, colon cancer has a 90% five-year survival rate. Screening can even prevent cancer by detecting and removing precancerous polyps.'
      },
      {
        question: 'What screening options are available in Singapore?',
        answer: 'Singapore offers multiple HSA-cleared screening options: FIT tests (annual), advanced blood tests like Shield™, flexible sigmoidoscopy, and colonoscopy. Your doctor can recommend the best option based on your age, risk factors, and preferences.'
      }
    ],
    localizedContent: {
      statsTitle: 'Early Detection Impact in Singapore',
      processTitle: 'Your Early Detection Journey',
      processSteps: [
        'Risk assessment and screening recommendation from your doctor',
        'Choose appropriate screening method based on your needs',
        'Follow-up care and continued monitoring as recommended'
      ]
    }
  };

  return (
    <SEOLandingTemplate
      keyword="early detection colon cancer"
      language="en"
      region="Singapore"
      intent="early detection"
      category="primary"
      content={content}
    />
  );
};

export default EarlyDetectionColonCancerPage;