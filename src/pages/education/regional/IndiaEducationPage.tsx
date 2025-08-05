import React from 'react';
import RegionalEducationTemplate from '../../../components/education/RegionalEducationTemplate';

const IndiaEducationPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Education India | CRC Screening Guide',
    metaDescription: 'Comprehensive guide to colorectal cancer screening in India. Learn about CRC, available tests, costs, and hospital options across Indian cities.',
    heroTitle: 'Colorectal Cancer Education for India',
    heroSubtitle: 'Understanding colorectal cancer screening options across India, from metro cities to tier-2 locations.',
    crc101: {
      title: 'Colorectal Cancer Awareness in India',
      sections: [
        {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer affects the large intestine (colon) and rectum. While traditionally less common in India than Western countries, rates are rising rapidly in urban areas due to lifestyle changes and dietary shifts.',
          imageAlt: 'Medical illustration of colorectal anatomy with Indian context'
        },
        {
          title: 'Rising Incidence in Urban India',
          content: 'Indian metropolitan cities like Mumbai, Delhi, Bangalore, and Chennai are seeing increased CRC rates. The adoption of Western dietary patterns, reduced fiber intake, and lifestyle factors contribute to this trend.',
          imageAlt: 'Graph showing increasing CRC incidence in Indian cities'
        },
        {
          title: 'Cultural and Dietary Factors',
          content: 'Traditional Indian diets rich in fiber, vegetables, and spices were protective. However, increased consumption of processed foods, red meat, and reduced physical activity have changed the risk profile in urban populations.',
          imageAlt: 'Comparison of traditional vs modern Indian diet impact on CRC risk'
        }
      ]
    },
    statistics: {
      title: 'CRC Statistics in India',
      stats: [
        {
          number: '57,000+',
          label: 'New cases annually in India',
          source: 'GLOBOCAN 2020'
        },
        {
          number: '85%',
          label: 'Detected at advanced stages',
          source: 'Indian Journal of Medical Research'
        },
        {
          number: '45-50',
          label: 'Recommended screening age range',
          source: 'Indian Council of Medical Research'
        }
      ]
    },
    screeningInfo: {
      title: 'Screening Options Available in India',
      methods: [
        {
          name: 'FIT/FOBT Tests',
          description: 'Fecal tests available at diagnostic centers across India. Cost ranges from ₹500-₹1,500. Available at Apollo, Fortis, Max Healthcare, and local labs.',
          suitableFor: 'Average-risk adults 45-50 years and above'
        },
        {
          name: 'Blood-Based Tests',
          description: 'Advanced circulating tumor DNA tests available at premium hospitals in metro cities. Cost ranges from ₹15,000-₹35,000.',
          suitableFor: 'Urban professionals preferring convenience'
        },
        {
          name: 'Colonoscopy',
          description: 'Available at major hospitals and cancer centers. Cost ranges from ₹12,000-₹25,000. Insurance coverage available for diagnostic procedures.',
          suitableFor: 'All risk categories, gold standard screening'
        }
      ]
    },
    callsToAction: {
      primary: 'Find Hospital in India',
      secondary: 'Check Insurance Coverage',
      tertiary: 'Consult Gastroenterologist'
    },
    navigation: {
      faqs: 'Common Questions',
      findClinic: 'Find Hospital',
      news: 'Medical Updates',
      screening: 'Start Screening'
    }
  };

  return (
    <RegionalEducationTemplate
      region="India"
      language="en"
      content={content}
    />
  );
};

export default IndiaEducationPage;