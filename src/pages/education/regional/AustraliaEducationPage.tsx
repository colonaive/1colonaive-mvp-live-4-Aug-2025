import React from 'react';
import RegionalEducationTemplate from '../../../components/education/RegionalEducationTemplate';

const AustraliaEducationPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Education Australia | CRC Screening Guide',
    metaDescription: 'Complete guide to colorectal cancer screening in Australia. Learn about the National Bowel Cancer Screening Program, Medicare coverage, and screening options.',
    heroTitle: 'Colorectal Cancer Education for Australians',
    heroSubtitle: 'Understanding Australia\'s National Bowel Cancer Screening Program and private screening options available across the country.',
    crc101: {
      title: 'Colorectal Cancer in Australia',
      sections: [
        {
          title: 'What is Bowel Cancer?',
          content: 'Bowel cancer (colorectal cancer) develops in the large bowel (colon) or back passage (rectum). It\'s Australia\'s second most common cancer, affecting both men and women across all states and territories.',
          imageAlt: 'Medical diagram of bowel anatomy with Australian health context'
        },
        {
          title: 'How Bowel Cancer Develops',
          content: 'Most bowel cancers develop from small growths called polyps on the bowel wall. While most polyps are harmless, some can become cancerous over 5-10 years. This is why regular screening is so important.',
          imageAlt: 'Progression diagram showing polyp to cancer development timeline'
        },
        {
          title: 'Risk Factors for Australians',
          content: 'Key risk factors include age (especially 50+), family history, inflammatory bowel disease, smoking, excessive alcohol, and diet high in red and processed meats. Australia\'s lifestyle factors contribute to bowel cancer rates.',
          imageAlt: 'Australian-specific risk factors infographic for bowel cancer'
        }
      ]
    },
    statistics: {
      title: 'Bowel Cancer Statistics in Australia',
      stats: [
        {
          number: '2nd',
          label: 'Most common cancer in Australia',
          source: 'Australian Institute of Health and Welfare 2023'
        },
        {
          number: '90%',
          label: 'Survival rate when detected early',
          source: 'Cancer Council Australia'
        },
        {
          number: '50-74',
          label: 'Free screening age range',
          source: 'National Bowel Cancer Screening Program'
        }
      ]
    },
    screeningInfo: {
      title: 'Screening Options in Australia',
      methods: [
        {
          name: 'Free FOBT Kit',
          description: 'Faecal Occult Blood Test provided free through the National Bowel Cancer Screening Program. Mailed to eligible Australians aged 50-74 every two years.',
          suitableFor: 'All Australians aged 50-74 years'
        },
        {
          name: 'Private Blood Tests',
          description: 'Advanced blood-based screening tests available at private clinics and pathology centers. Cost ranges from $300-$600, with some Medicare rebates available.',
          suitableFor: 'Adults seeking additional screening options'
        },
        {
          name: 'Colonoscopy',
          description: 'Available through public hospital system (bulk-billed) or private hospitals. Medicare provides rebates for medically indicated procedures.',
          suitableFor: 'Follow-up to positive screening or high-risk individuals'
        }
      ]
    },
    callsToAction: {
      primary: 'Order Free FOBT Kit',
      secondary: 'Find Australian Clinic',
      tertiary: 'Talk to GP'
    },
    navigation: {
      faqs: 'Frequently Asked Questions',
      findClinic: 'Find a Clinic',
      news: 'Latest Research',
      screening: 'Start Screening'
    }
  };

  return (
    <RegionalEducationTemplate
      region="Australia"
      language="en"
      content={content}
    />
  );
};

export default AustraliaEducationPage;