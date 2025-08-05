// Regional Education Pages Index
// CRC education content tailored for each target region

export { default as SingaporeEducationPage } from './SingaporeEducationPage';
export { default as IndiaEducationPage } from './IndiaEducationPage';
export { default as PhilippinesEducationPage } from './PhilippinesEducationPage';
export { default as AustraliaEducationPage } from './AustraliaEducationPage';
export { default as JapanEducationPage } from './JapanEducationPage';

// Regional education page metadata for routing
export const REGIONAL_EDUCATION_PAGES = [
  {
    path: '/education/singapore',
    component: 'SingaporeEducationPage',
    region: 'Singapore',
    language: 'en',
    title: 'CRC Education Singapore',
    available: true
  },
  {
    path: '/education/india',
    component: 'IndiaEducationPage',
    region: 'India',
    language: 'en',
    title: 'CRC Education India',
    available: true
  },
  {
    path: '/education/philippines',
    component: 'PhilippinesEducationPage',
    region: 'Philippines',
    language: 'en',
    title: 'CRC Education Philippines',
    available: true
  },
  {
    path: '/education/australia',
    component: 'AustraliaEducationPage',
    region: 'Australia',
    language: 'en',
    title: 'CRC Education Australia',
    available: true
  },
  {
    path: '/education/japan',
    component: 'JapanEducationPage',
    region: 'Japan',
    language: 'en',
    title: 'CRC Education Japan',
    available: true
  }
];

// Future multilingual versions (structure ready)
export const PLANNED_LANGUAGE_VERSIONS = [
  // Singapore multilingual
  { path: '/zh-cn/education/singapore', language: 'zh', region: 'Singapore', status: 'planned' },
  { path: '/ms-sg/education/singapore', language: 'ms', region: 'Singapore', status: 'planned' },
  { path: '/ta-sg/education/singapore', language: 'ta', region: 'Singapore', status: 'planned' },
  
  // India multilingual
  { path: '/hi-in/education/india', language: 'hi', region: 'India', status: 'planned' },
  
  // Philippines multilingual
  { path: '/tl-ph/education/philippines', language: 'tl', region: 'Philippines', status: 'planned' },
  
  // Japan multilingual
  { path: '/ja-jp/education/japan', language: 'ja', region: 'Japan', status: 'planned' }
];

// Navigation helper for regional education
export const getRegionalEducationNav = (currentRegion?: string) => {
  return REGIONAL_EDUCATION_PAGES.map(page => ({
    ...page,
    isActive: page.region === currentRegion,
    isCurrent: page.region === currentRegion
  }));
};

// Sitemap generation for regional education pages
export const generateRegionalEducationSitemap = () => {
  return REGIONAL_EDUCATION_PAGES.map(page => ({
    url: `https://colonaive.com${page.path}`,
    changefreq: 'monthly',
    priority: 0.8,
    lastmod: new Date().toISOString().split('T')[0]
  }));
};