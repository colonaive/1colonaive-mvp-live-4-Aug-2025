import React from 'react';
import RegionalEducationTemplate from '../../../components/education/RegionalEducationTemplate';

const PhilippinesEducationPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Education Philippines | CRC Screening Guide',
    metaDescription: 'Complete guide to colorectal cancer screening in the Philippines. Learn about CRC, PhilHealth coverage, and available options in Manila, Cebu, and Davao.',
    heroTitle: 'Colorectal Cancer Education for Filipinos',
    heroSubtitle: 'Understanding colorectal cancer screening in the Philippines, with PhilHealth coverage and hospital options.',
    crc101: {
      title: 'Colorectal Cancer in the Philippines',
      sections: [
        {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer (kanser sa bituka) develops in the large intestine. While not as common as other cancers in the Philippines, rates are increasing, especially in urban areas like Metro Manila.',
          imageAlt: 'Medical diagram of colorectal system with Filipino context'
        },
        {
          title: 'Rising Rates in Urban Philippines',
          content: 'Major cities including Manila, Cebu, and Davao are seeing increased colorectal cancer incidence. Changes in diet, reduced physical activity, and lifestyle factors contribute to this trend.',
          imageAlt: 'Philippine map highlighting urban areas with increasing CRC rates'
        },
        {
          title: 'Risk Factors for Filipinos',
          content: 'Key risk factors include family history, age over 50, smoking, excessive alcohol consumption, and dietary changes including increased processed food consumption and reduced fiber intake.',
          imageAlt: 'Infographic showing CRC risk factors relevant to Filipino population'
        }
      ]
    },
    statistics: {
      title: 'CRC Statistics in the Philippines',
      stats: [
        {
          number: '6th',
          label: 'Most common cancer in Philippines',
          source: 'Philippine Cancer Society 2023'
        },
        {
          number: '90%',
          label: 'Survival rate with early detection',
          source: 'Philippine General Hospital'
        },
        {
          number: '50+',
          label: 'Recommended screening age',
          source: 'Department of Health Philippines'
        }
      ]
    },
    screeningInfo: {
      title: 'Screening Options in the Philippines',
      methods: [
        {
          name: 'Stool Tests',
          description: 'Fecal tests available at major hospitals and laboratories. Cost ranges from ₱1,000-₱3,000. Some coverage available through PhilHealth.',
          suitableFor: 'Average-risk adults 50 years and above'
        },
        {
          name: 'Blood Tests',
          description: 'Advanced blood-based screening available at premium hospitals in Manila, Cebu, and Davao. Cost ranges from ₱20,000-₱40,000.',
          suitableFor: 'Adults preferring non-invasive screening'
        },
        {
          name: 'Colonoscopy',
          description: 'Available at St. Luke\'s, Makati Medical Center, Asian Hospital, and other major facilities. PhilHealth provides partial coverage for diagnostic procedures.',
          suitableFor: 'All risk categories, comprehensive screening'
        }
      ]
    },
    callsToAction: {
      primary: 'Find Philippine Hospital',
      secondary: 'Check PhilHealth Coverage',
      tertiary: 'Consult Doctor'
    },
    navigation: {
      faqs: 'Mga Tanong (FAQs)',
      findClinic: 'Maghanap ng Hospital',
      news: 'Medical News',
      screening: 'Simulan ang Screening'
    }
  };

  return (
    <RegionalEducationTemplate
      region="Philippines"
      language="en"
      content={content}
    />
  );
};

export default PhilippinesEducationPage;