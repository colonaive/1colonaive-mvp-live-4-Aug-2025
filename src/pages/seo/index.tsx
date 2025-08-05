// SEO Landing Pages Index
// Auto-generated from seo_keywords.csv

export { default as ColorectalCancerScreeningSingaporePage } from './ColorectalCancerScreeningSingaporePage';
export { default as ColonCancerTestSingaporePage } from './ColonCancerTestSingaporePage';
export { default as BloodTestColorectalCancerPage } from './BloodTestColorectalCancerPage';
export { default as EarlyDetectionColonCancerPage } from './EarlyDetectionColonCancerPage';
export { default as FITTestSingaporePage } from './FITTestSingaporePage';
export { default as BowelCancerScreeningPage } from './BowelCancerScreeningPage';
export { default as ColorectalCancerScreeningAustraliaPage } from './ColorectalCancerScreeningAustraliaPage';
export { default as ColonCancerTestAustraliaPage } from './ColonCancerTestAustraliaPage';
export { default as FOBTTestAustraliaPage } from './FOBTTestAustraliaPage';
export { default as DaChangAiShaZhaPage } from './DaChangAiShaZhaPage';
export { default as ColorectalCancerScreeningIndiaPage } from './ColorectalCancerScreeningIndiaPage';
export { default as ColonCancerTestIndiaPage } from './ColonCancerTestIndiaPage';
export { default as ColonoscopyIndiaCostPage } from './ColonoscopyIndiaCostPage';
export { default as ColonCancerTestPhilippinesPage } from './ColonCancerTestPhilippinesPage';

// SEO Page Metadata for routing
export const SEO_PAGES = [
  {
    path: '/seo/colorectal-cancer-screening-singapore',
    component: 'ColorectalCancerScreeningSingaporePage',
    keyword: 'colorectal cancer screening',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 1000,
    intent: 'diagnosis'
  },
  {
    path: '/seo/colon-cancer-test-singapore', 
    component: 'ColonCancerTestSingaporePage',
    keyword: 'colon cancer test Singapore',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 800,
    intent: 'diagnosis'
  },
  {
    path: '/seo/blood-test-colorectal-cancer',
    component: 'BloodTestColorectalCancerPage', 
    keyword: 'blood test colorectal cancer',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 600,
    intent: 'non-invasive'
  },
  {
    path: '/seo/colorectal-cancer-screening-australia',
    component: 'ColorectalCancerScreeningAustraliaPage',
    keyword: 'colorectal cancer screening Australia', 
    language: 'en',
    region: 'Australia',
    priority: 'high',
    searchVolume: 2000,
    intent: 'diagnosis'
  },
  {
    path: '/seo/da-chang-ai-sha-zha',
    component: 'DaChangAiShaZhaPage',
    keyword: '大腸癌篩查',
    language: 'zh',
    region: 'Singapore', 
    priority: 'medium',
    searchVolume: 500,
    intent: 'diagnosis'
  },
  {
    path: '/seo/colorectal-cancer-screening-india',
    component: 'ColorectalCancerScreeningIndiaPage',
    keyword: 'colorectal cancer screening India',
    language: 'en',
    region: 'India',
    priority: 'medium', 
    searchVolume: 800,
    intent: 'diagnosis'
  },
  {
    path: '/seo/early-detection-colon-cancer',
    component: 'EarlyDetectionColonCancerPage',
    keyword: 'early detection colon cancer',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 500,
    intent: 'early detection'
  },
  {
    path: '/seo/fit-test-singapore',
    component: 'FITTestSingaporePage',
    keyword: 'FIT test Singapore',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 400,
    intent: 'non-invasive'
  },
  {
    path: '/seo/bowel-cancer-screening',
    component: 'BowelCancerScreeningPage',
    keyword: 'bowel cancer screening',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 300,
    intent: 'diagnosis'
  },
  {
    path: '/seo/colon-cancer-test-australia',
    component: 'ColonCancerTestAustraliaPage',
    keyword: 'colon cancer test Australia',
    language: 'en',
    region: 'Australia',
    priority: 'high',
    searchVolume: 1200,
    intent: 'diagnosis'
  },
  {
    path: '/seo/fobt-test-australia',
    component: 'FOBTTestAustraliaPage',
    keyword: 'FOBT test Australia',
    language: 'en',
    region: 'Australia',
    priority: 'high',
    searchVolume: 800,
    intent: 'non-invasive'
  },
  {
    path: '/seo/colon-cancer-test-india',
    component: 'ColonCancerTestIndiaPage',
    keyword: 'colon cancer test India',
    language: 'en',
    region: 'India',
    priority: 'medium',
    searchVolume: 600,
    intent: 'diagnosis'
  },
  {
    path: '/seo/colonoscopy-india-cost',
    component: 'ColonoscopyIndiaCostPage',
    keyword: 'colonoscopy India cost',
    language: 'en',
    region: 'India',
    priority: 'medium',
    searchVolume: 500,
    intent: 'diagnosis'
  },
  {
    path: '/seo/colon-cancer-test-philippines',
    component: 'ColonCancerTestPhilippinesPage',
    keyword: 'colon cancer test Philippines',
    language: 'en',
    region: 'Philippines',
    priority: 'medium',
    searchVolume: 300,
    intent: 'diagnosis'
  }
];

// Sitemap generation helper
export const generateSEOSitemap = () => {
  return SEO_PAGES.map(page => ({
    url: `https://colonaive.com${page.path}`,
    changefreq: 'weekly',
    priority: page.priority === 'high' ? 0.9 : 0.7,
    lastmod: new Date().toISOString().split('T')[0]
  }));
};

// Hreflang generation helper
export const generateHreflangTags = (currentPath: string) => {
  const currentPage = SEO_PAGES.find(page => page.path === currentPath);
  if (!currentPage) return [];
  
  const alternates = SEO_PAGES.filter(page => 
    page.keyword === currentPage.keyword || 
    page.intent === currentPage.intent
  );
  
  return alternates.map(page => ({
    hreflang: page.language === 'zh' ? 'zh-CN' : page.language,
    href: `https://colonaive.com${page.path}`
  }));
};