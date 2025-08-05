import React from 'react';
import RegionalEducationTemplate from '../../../components/education/RegionalEducationTemplate';

const SingaporeEducationPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Education Singapore | CRC Screening Guide',
    metaDescription: 'Complete guide to colorectal cancer screening in Singapore. Learn about CRC, screening options, subsidies, and how to get started with early detection.',
    heroTitle: 'Colorectal Cancer Education for Singaporeans',
    heroSubtitle: 'Everything you need to know about colorectal cancer screening in Singapore, from subsidized options to private clinics.',
    crc101: {
      title: 'Understanding Colorectal Cancer (CRC)',
      sections: [
        {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer develops in the colon or rectum, often starting as small growths called polyps. Most polyps are benign, but some can become cancerous over time. In Singapore, CRC is the most common cancer, affecting both men and women.',
          imageAlt: 'Anatomical diagram showing colon and rectum location'
        },
        {
          title: 'How Polyps Develop into Cancer',
          content: 'The adenoma-carcinoma sequence shows how normal cells in the colon lining can develop into polyps, and over 10-15 years, some polyps may become cancerous. This slow progression is why screening is so effective - we can find and remove polyps before they become cancer.',
          imageAlt: 'Medical diagram showing polyp development stages'
        },
        {
          title: 'Risk Factors in Singapore',
          content: 'Risk factors include age (especially 50+), family history, diet high in processed meats, smoking, excessive alcohol, and inflammatory bowel disease. The Western diet adoption in Singapore has contributed to rising CRC rates.',
          imageAlt: 'Infographic showing CRC risk factors relevant to Singapore population'
        }
      ]
    },
    statistics: {
      title: 'CRC Statistics in Singapore',
      stats: [
        {
          number: '#1',
          label: 'Most common cancer in Singapore',
          source: 'Singapore Cancer Registry 2023'
        },
        {
          number: '90%',
          label: 'Survival rate when caught early',
          source: 'National Cancer Centre Singapore'
        },
        {
          number: '50+',
          label: 'Recommended screening age',
          source: 'MOH Clinical Practice Guidelines'
        }
      ]
    },
    screeningInfo: {
      title: 'Screening Options in Singapore',
      methods: [
        {
          name: 'FIT Test',
          description: 'Fecal Immunochemical Test available at polyclinics with government subsidies. Simple home-based test that detects hidden blood in stool.',
          suitableFor: 'Average-risk adults 50-75 years old'
        },
        {
          name: 'Blood Test (Shield™)',
          description: 'Advanced blood-based screening detecting circulating tumor DNA. HSA-cleared with 94% sensitivity for cancer detection.',
          suitableFor: 'Adults 45+ preferring non-invasive options'
        },
        {
          name: 'Colonoscopy',
          description: 'Gold standard screening allowing direct visualization and polyp removal. Available at public hospitals and private clinics.',
          suitableFor: 'All adults, especially high-risk individuals'
        }
      ]
    },
    callsToAction: {
      primary: 'Book Screening Now',
      secondary: 'Find Singapore Clinic',
      tertiary: 'Talk to Doctor'
    },
    navigation: {
      faqs: 'Frequently Asked Questions',
      findClinic: 'Find a Clinic',
      news: 'Latest CRC News',
      screening: 'Start Screening'
    }
  };

  return (
    <RegionalEducationTemplate
      region="Singapore"
      language="en"
      content={content}
    />
  );
};

export default SingaporeEducationPage;