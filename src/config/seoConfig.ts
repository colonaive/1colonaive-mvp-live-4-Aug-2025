// SEO Configuration for COLONAiVE Landing Pages
// Generated from seo_keywords.csv

export interface SEOPageConfig {
  path: string;
  component: string;
  keyword: string;
  language: string;
  region: string;
  priority: 'high' | 'medium' | 'low';
  searchVolume: number;
  competition: 'high' | 'medium' | 'low';
  intent: 'diagnosis' | 'early detection' | 'non-invasive' | 'mortality';
  category: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  hreflang?: { [key: string]: string };
}

export const SEO_LANDING_PAGES: SEOPageConfig[] = [
  {
    path: '/seo/colorectal-cancer-screening-singapore',
    component: 'ColorectalCancerScreeningSingaporePage',
    keyword: 'colorectal cancer screening',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 1000,
    competition: 'medium',
    intent: 'diagnosis',
    category: 'primary',
    title: 'Colorectal Cancer Screening Singapore | Early Detection Saves Lives',
    metaDescription: 'Get comprehensive colorectal cancer screening in Singapore. HSA-cleared blood tests and colonoscopy services. Book your screening today - early detection saves lives.',
    canonicalUrl: 'https://colonaive.com/seo/colorectal-cancer-screening-singapore'
  },
  {
    path: '/seo/colon-cancer-test-singapore',
    component: 'ColonCancerTestSingaporePage',
    keyword: 'colon cancer test Singapore',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 800,
    competition: 'low',
    intent: 'diagnosis',
    category: 'local',
    title: 'Colon Cancer Test Singapore | Advanced Blood Tests & Screening Options',
    metaDescription: 'Get reliable colon cancer testing in Singapore. HSA-cleared blood tests, FIT tests, and colonoscopy options. Book your test today for early detection and peace of mind.',
    canonicalUrl: 'https://colonaive.com/seo/colon-cancer-test-singapore'
  },
  {
    path: '/seo/blood-test-colorectal-cancer',
    component: 'BloodTestColorectalCancerPage',
    keyword: 'blood test colorectal cancer',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 600,
    competition: 'medium',
    intent: 'non-invasive',
    category: 'primary',
    title: 'Blood Test for Colorectal Cancer | Non-Invasive CRC Screening Singapore',
    metaDescription: 'Revolutionary blood test for colorectal cancer screening. 94% accuracy, HSA-cleared, non-invasive alternative to colonoscopy. Book your CRC blood test in Singapore today.',
    canonicalUrl: 'https://colonaive.com/seo/blood-test-colorectal-cancer'
  },
  {
    path: '/seo/colorectal-cancer-screening-australia',
    component: 'ColorectalCancerScreeningAustraliaPage',
    keyword: 'colorectal cancer screening Australia',
    language: 'en',
    region: 'Australia',
    priority: 'high',
    searchVolume: 2000,
    competition: 'medium',
    intent: 'diagnosis',
    category: 'primary',
    title: 'Colorectal Cancer Screening Australia | National Bowel Cancer Screening Program',
    metaDescription: 'Access Australia\'s National Bowel Cancer Screening Program. Free FOBT tests, Medicare rebates for colonoscopy. Early detection saves lives - get screened today.',
    canonicalUrl: 'https://colonaive.com/seo/colorectal-cancer-screening-australia'
  },
  {
    path: '/seo/da-chang-ai-sha-zha',
    component: 'DaChangAiShaZhaPage',
    keyword: '大腸癌篩查',
    language: 'zh',
    region: 'Singapore',
    priority: 'medium',
    searchVolume: 500,
    competition: 'medium',
    intent: 'diagnosis',
    category: 'primary',
    title: '大腸癌篩查新加坡 | 早期發現挽救生命 | 血液檢測服務',
    metaDescription: '新加坡大腸癌篩查服務。衛生科學局批准的血液檢測，結腸鏡檢查選項。立即預約篩查 - 早期發現挽救生命。',
    canonicalUrl: 'https://colonaive.com/seo/da-chang-ai-sha-zha',
    hreflang: {
      'en': 'https://colonaive.com/seo/colorectal-cancer-screening-singapore',
      'zh-CN': 'https://colonaive.com/seo/da-chang-ai-sha-zha'
    }
  },
  {
    path: '/seo/colorectal-cancer-screening-india',
    component: 'ColorectalCancerScreeningIndiaPage',
    keyword: 'colorectal cancer screening India',
    language: 'en',
    region: 'India',
    priority: 'medium',
    searchVolume: 800,
    competition: 'low',
    intent: 'diagnosis',
    category: 'primary',
    title: 'Colorectal Cancer Screening India | कोलोरेक्टल कैंसर स्क्रीनिंग | Early Detection',
    metaDescription: 'Comprehensive colorectal cancer screening in India. Blood tests, colonoscopy services, and expert specialists across major cities. Book your screening consultation today.',
    canonicalUrl: 'https://colonaive.com/seo/colorectal-cancer-screening-india'
  }
];

// CTA Configuration
export const CTA_CONFIG = {
  'diagnosis': {
    primary: 'Book Screening Now',
    secondary: 'Find Specialist',
    tertiary: 'Get CRC Blood Test'
  },
  'early detection': {
    primary: 'Start Early Detection',
    secondary: 'Find GP Near You',
    tertiary: 'Learn More'
  },
  'non-invasive': {
    primary: 'Get Blood Test',
    secondary: 'Compare Options',
    tertiary: 'Find Testing Center'
  },
  'mortality': {
    primary: 'Get Screened Today',
    secondary: 'Find Specialist',
    tertiary: 'Read Research'
  }
};

// Regional Configuration
export const REGIONAL_CONFIG = {
  'Singapore': {
    currency: 'SGD',
    healthSystem: 'Singapore Ministry of Health',
    regulatoryBody: 'HSA',
    nationalProgram: 'Singapore National Cancer Screening Program',
    language: ['en', 'zh', 'ta', 'ms']
  },
  'Australia': {
    currency: 'AUD',
    healthSystem: 'Medicare',
    regulatoryBody: 'TGA',
    nationalProgram: 'National Bowel Cancer Screening Program',
    language: ['en']
  },
  'India': {
    currency: 'INR',
    healthSystem: 'Indian Health System',
    regulatoryBody: 'CDSCO',
    nationalProgram: 'National Programme for Prevention and Control of Cancer',
    language: ['en', 'hi', 'ta', 'te', 'bn']
  },
  'Philippines': {
    currency: 'PHP',
    healthSystem: 'PhilHealth',
    regulatoryBody: 'FDA Philippines',
    nationalProgram: 'DOH Cancer Control Program',
    language: ['en', 'tl']
  },
  'Japan': {
    currency: 'JPY',
    healthSystem: 'Japanese National Health Insurance',
    regulatoryBody: 'PMDA',
    nationalProgram: 'National Cancer Screening Program',
    language: ['ja', 'en']
  }
};

// SEO Schema Markup Templates
export const generateSchemaMarkup = (pageConfig: SEOPageConfig) => {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "name": pageConfig.title,
    "description": pageConfig.metaDescription,
    "url": pageConfig.canonicalUrl,
    "inLanguage": pageConfig.language,
    "about": {
      "@type": "MedicalCondition",
      "name": "Colorectal Cancer",
      "alternateName": ["Colon Cancer", "Bowel Cancer", "CRC"]
    },
    "mainContentOfPage": {
      "@type": "MedicalProcedure",
      "name": "Colorectal Cancer Screening",
      "procedureType": "Diagnostic Test",
      "bodyLocation": {
        "@type": "AnatomicalStructure",
        "name": "Colon and Rectum"
      }
    },
    "audience": {
      "@type": "PeopleAudience",
      "audienceType": "Adults aged 45 and above",
      "geographicArea": {
        "@type": "Place",
        "name": pageConfig.region
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "COLONAiVE",
      "url": "https://colonaive.com"
    }
  };
};

// Sitemap generation
export const generateSitemap = () => {
  return SEO_LANDING_PAGES.map(page => ({
    url: page.canonicalUrl,
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: page.priority === 'high' ? 0.9 : page.priority === 'medium' ? 0.7 : 0.5
  }));
};