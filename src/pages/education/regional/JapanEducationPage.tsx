import React from 'react';
import RegionalEducationTemplate from '../../../components/education/RegionalEducationTemplate';

const JapanEducationPage: React.FC = () => {
  const content = {
    title: 'Colorectal Cancer Education Japan | 大腸がん検診ガイド',
    metaDescription: 'Complete guide to colorectal cancer screening in Japan. Learn about CRC screening programs, health insurance coverage, and options available across Japan.',
    heroTitle: 'Colorectal Cancer Education for Japan',
    heroSubtitle: 'Understanding colorectal cancer screening in Japan, including national health insurance coverage and advanced screening technologies.',
    crc101: {
      title: 'Colorectal Cancer Awareness in Japan (大腸がんについて)',
      sections: [
        {
          title: 'What is Colorectal Cancer?',
          content: 'Colorectal cancer (大腸がん) affects the large intestine and rectum. Japan has one of the world\'s highest rates of colorectal cancer, making screening particularly important for the Japanese population.',
          imageAlt: 'Anatomical diagram of colorectal system with Japanese medical context'
        },
        {
          title: 'High Incidence in Japan',
          content: 'Japan has experienced dramatic increases in colorectal cancer rates since the 1950s, largely attributed to dietary westernization, increased meat consumption, and reduced fiber intake compared to traditional Japanese diets.',
          imageAlt: 'Historical chart showing rising CRC rates in Japan post-1950s'
        },
        {
          title: 'Modern Risk Factors',
          content: 'Key risk factors for Japanese include age (especially 50+), family history, lifestyle changes from traditional diet, increased alcohol consumption, smoking, and reduced physical activity in urban environments.',
          imageAlt: 'Japanese lifestyle factors contributing to CRC risk'
        }
      ]
    },
    statistics: {
      title: 'CRC Statistics in Japan',
      stats: [
        {
          number: '#1',
          label: 'Most common cancer in Japanese men',
          source: 'Japan Cancer Society 2023'
        },
        {
          number: '95%',
          label: 'Survival rate with early detection',
          source: 'National Cancer Center Japan'
        },
        {
          number: '40+',
          label: 'Recommended screening age',
          source: 'Ministry of Health, Labour and Welfare'
        }
      ]
    },
    screeningInfo: {
      title: 'Screening Options in Japan',
      methods: [
        {
          name: 'Fecal Occult Blood Test (便潜血検査)',
          description: 'Annual screening provided through national health insurance and municipal programs. Highly accessible and covered by insurance for adults 40 and older.',
          suitableFor: 'All adults 40+ years (covered by insurance)'
        },
        {
          name: 'Advanced Blood Tests',
          description: 'Liquid biopsy and circulating tumor DNA tests available at leading hospitals and comprehensive medical centers. Cost ranges from ¥50,000-¥100,000.',
          suitableFor: 'Adults seeking advanced screening technology'
        },
        {
          name: 'Colonoscopy (大腸内視鏡検査)',
          description: 'Available at hospitals nationwide with excellent quality standards. Covered by national health insurance when medically indicated or following positive screening.',
          suitableFor: 'High-risk individuals and diagnostic follow-up'
        }
      ]
    },
    callsToAction: {
      primary: 'Find Japanese Hospital',
      secondary: 'Check Insurance Coverage',
      tertiary: 'Consult Specialist'
    },
    navigation: {
      faqs: 'よくある質問 (FAQ)',
      findClinic: '医療機関を探す',
      news: '最新医療ニュース',
      screening: '検診を始める'
    }
  };

  return (
    <RegionalEducationTemplate
      region="Japan"
      language="en"
      content={content}
    />
  );
};

export default JapanEducationPage;