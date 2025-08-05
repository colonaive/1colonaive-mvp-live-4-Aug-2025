// SEO Landing Pages Catalog
// Public-facing SEO catalog and index
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Globe, ArrowRight, Search, TrendingUp, Users, MapPin } from 'lucide-react';

// Component exports for internal use
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
export { default as SingaporeColorectalScreening } from './singapore-colorectal-screening';
export { default as AustraliaBowelCancerScreening } from './australia-bowel-cancer-screening';
export { default as IndiaColorectalScreening } from './india-colorectal-screening';
export { default as PhilippinesColorectalScreening } from './philippines-colorectal-screening';
export { default as JapanColorectalScreening } from './japan-colorectal-screening';

// SEO Page Metadata for routing
export const SEO_PAGES = [
  // Main Regional Landing Pages (Priority)
  {
    path: '/seo/singapore-colorectal-screening',
    component: 'SingaporeColorectalScreening',
    title: 'Colorectal Cancer Screening Singapore',
    description: 'HSA-cleared blood-based CRC screening in Singapore. 94% accuracy, no colonoscopy required.',
    keyword: 'colorectal cancer screening Singapore',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 1500,
    intent: 'diagnosis',
    flag: '🇸🇬'
  },
  {
    path: '/seo/australia-bowel-cancer-screening',
    component: 'AustraliaBowelCancerScreening',
    title: 'Bowel Cancer Screening Australia',
    description: 'Advanced CRC screening to complement NBCSP. Blood-based testing with 95% accuracy.',
    keyword: 'bowel cancer screening Australia',
    language: 'en',
    region: 'Australia',
    priority: 'high',
    searchVolume: 2000,
    intent: 'diagnosis',
    flag: '🇦🇺'
  },
  {
    path: '/seo/india-colorectal-screening',
    component: 'IndiaColorectalScreening',
    title: 'Colorectal Cancer Screening India',
    description: 'Early detection CRC screening for India. Addresses younger onset patterns.',
    keyword: 'colorectal cancer screening India',
    language: 'en',
    region: 'India',
    priority: 'high',
    searchVolume: 1200,
    intent: 'diagnosis',
    flag: '🇮🇳'
  },
  {
    path: '/seo/philippines-colorectal-screening',
    component: 'PhilippinesColorectalScreening',
    title: 'Colorectal Cancer Screening Philippines',
    description: 'Advanced CRC screening sa Pilipinas. PhilHealth coverage options available.',
    keyword: 'colorectal cancer screening Philippines',
    language: 'en',
    region: 'Philippines',
    priority: 'high',
    searchVolume: 800,
    intent: 'diagnosis',
    flag: '🇵🇭'
  },
  {
    path: '/seo/japan-colorectal-screening',
    component: 'JapanColorectalScreening',
    title: 'Colorectal Cancer Screening Japan',
    description: '大腸がん検診 | Advanced CRC screening with NHI coverage options.',
    keyword: 'colorectal cancer screening Japan',
    language: 'en',
    region: 'Japan',
    priority: 'high',
    searchVolume: 1000,
    intent: 'diagnosis',
    flag: '🇯🇵'
  },
  
  // Legacy Regional Pages
  {
    path: '/seo/colorectal-cancer-screening-singapore',
    component: 'ColorectalCancerScreeningSingaporePage',
    title: 'CRC Screening Singapore (Legacy)',
    description: 'Colorectal cancer screening in Singapore with modern technology.',
    keyword: 'colorectal cancer screening',
    language: 'en',
    region: 'Singapore',
    priority: 'medium',
    searchVolume: 1000,
    intent: 'diagnosis',
    flag: '🇸🇬'
  },
  {
    path: '/seo/colorectal-cancer-screening-australia',
    component: 'ColorectalCancerScreeningAustraliaPage',
    title: 'CRC Screening Australia (Legacy)',
    description: 'Colorectal cancer screening Australia with NBCSP complement.',
    keyword: 'colorectal cancer screening Australia', 
    language: 'en',
    region: 'Australia',
    priority: 'medium',
    searchVolume: 2000,
    intent: 'diagnosis',
    flag: '🇦🇺'
  },
  {
    path: '/seo/colorectal-cancer-screening-india',
    component: 'ColorectalCancerScreeningIndiaPage',
    title: 'CRC Screening India (Legacy)',
    description: 'Colorectal cancer screening for Indian population.',
    keyword: 'colorectal cancer screening India',
    language: 'en',
    region: 'India',
    priority: 'medium', 
    searchVolume: 800,
    intent: 'diagnosis',
    flag: '🇮🇳'
  },
  
  // Test-Specific Pages
  {
    path: '/seo/colon-cancer-test-singapore', 
    component: 'ColonCancerTestSingaporePage',
    title: 'Colon Cancer Test Singapore',
    description: 'Advanced colon cancer testing options in Singapore.',
    keyword: 'colon cancer test Singapore',
    language: 'en',
    region: 'Singapore',
    priority: 'high',
    searchVolume: 800,
    intent: 'diagnosis',
    flag: '🇸🇬'
  },
  {
    path: '/seo/blood-test-colorectal-cancer',
    component: 'BloodTestColorectalCancerPage',
    title: 'Blood Test for Colorectal Cancer',
    description: 'Non-invasive blood-based CRC screening with high accuracy.',
    keyword: 'blood test colorectal cancer',
    language: 'en',
    region: 'Global',
    priority: 'high',
    searchVolume: 600,
    intent: 'non-invasive',
    flag: '🌍'
  },
  {
    path: '/seo/colon-cancer-test-australia',
    component: 'ColonCancerTestAustraliaPage',
    title: 'Colon Cancer Test Australia',
    description: 'Comprehensive colon cancer testing in Australia.',
    keyword: 'colon cancer test Australia',
    language: 'en',
    region: 'Australia',
    priority: 'high',
    searchVolume: 1200,
    intent: 'diagnosis',
    flag: '🇦🇺'
  },
  {
    path: '/seo/colon-cancer-test-india',
    component: 'ColonCancerTestIndiaPage',
    title: 'Colon Cancer Test India',
    description: 'Affordable colon cancer testing options in India.',
    keyword: 'colon cancer test India',
    language: 'en',
    region: 'India',
    priority: 'medium',
    searchVolume: 600,
    intent: 'diagnosis',
    flag: '🇮🇳'
  },
  {
    path: '/seo/colon-cancer-test-philippines',
    component: 'ColonCancerTestPhilippinesPage',
    title: 'Colon Cancer Test Philippines',
    description: 'Colon cancer testing sa Pilipinas with PhilHealth options.',
    keyword: 'colon cancer test Philippines',
    language: 'en',
    region: 'Philippines',
    priority: 'medium',
    searchVolume: 300,
    intent: 'diagnosis',
    flag: '🇵🇭'
  },
  
  // Specialized Tests
  {
    path: '/seo/fit-test-singapore',
    component: 'FITTestSingaporePage',
    title: 'FIT Test Singapore',
    description: 'Faecal Immunochemical Test (FIT) in Singapore.',
    keyword: 'FIT test Singapore',
    language: 'en',
    region: 'Singapore',
    priority: 'medium',
    searchVolume: 400,
    intent: 'non-invasive',
    flag: '🇸🇬'
  },
  {
    path: '/seo/fobt-test-australia',
    component: 'FOBTTestAustraliaPage',
    title: 'FOBT Test Australia',
    description: 'Faecal Occult Blood Test (FOBT) in Australia via NBCSP.',
    keyword: 'FOBT test Australia',
    language: 'en',
    region: 'Australia',
    priority: 'medium',
    searchVolume: 800,
    intent: 'non-invasive',
    flag: '🇦🇺'
  },
  {
    path: '/seo/colonoscopy-india-cost',
    component: 'ColonoscopyIndiaCostPage',
    title: 'Colonoscopy Cost India',
    description: 'Affordable colonoscopy costs and options in India.',
    keyword: 'colonoscopy India cost',
    language: 'en',
    region: 'India',
    priority: 'medium',
    searchVolume: 500,
    intent: 'cost',
    flag: '🇮🇳'
  },
  
  // General Pages
  {
    path: '/seo/early-detection-colon-cancer',
    component: 'EarlyDetectionColonCancerPage',
    title: 'Early Detection Colon Cancer',
    description: 'Importance of early detection in colon cancer screening.',
    keyword: 'early detection colon cancer',
    language: 'en',
    region: 'Global',
    priority: 'high',
    searchVolume: 500,
    intent: 'early detection',
    flag: '🌍'
  },
  {
    path: '/seo/bowel-cancer-screening',
    component: 'BowelCancerScreeningPage',
    title: 'Bowel Cancer Screening',
    description: 'Comprehensive bowel cancer screening guide.',
    keyword: 'bowel cancer screening',
    language: 'en',
    region: 'Global',
    priority: 'high',
    searchVolume: 300,
    intent: 'diagnosis',
    flag: '🌍'
  },
  {
    path: '/seo/da-chang-ai-sha-zha',
    component: 'DaChangAiShaZhaPage',
    title: '大腸癌篩查',
    description: '新加坡大腸癌篩查服務，準確率高達94%。',
    keyword: '大腸癌篩查',
    language: 'zh',
    region: 'Singapore', 
    priority: 'medium',
    searchVolume: 500,
    intent: 'diagnosis',
    flag: '🇸🇬'
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

// Main SEO Catalog Component
const SEOCatalogPage: React.FC = () => {
  // Group pages by region
  const pagesByRegion = SEO_PAGES.reduce((acc, page) => {
    const region = page.region || 'Global';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(page);
    return acc;
  }, {} as Record<string, typeof SEO_PAGES>);

  // Sort regions with priority countries first
  const regionOrder = ['Singapore', 'Australia', 'India', 'Philippines', 'Japan', 'Global'];
  const sortedRegions = Object.keys(pagesByRegion).sort((a, b) => {
    const indexA = regionOrder.indexOf(a);
    const indexB = regionOrder.indexOf(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const getRegionDescription = (region: string) => {
    const descriptions = {
      Singapore: 'HSA-cleared screening options with high accuracy blood-based testing',
      Australia: 'Complement NBCSP with advanced screening technologies',
      India: 'Addressing younger onset patterns with accessible screening',
      Philippines: 'PhilHealth coverage options and bilingual support',
      Japan: 'NHI coverage with bilingual Japanese-English resources',
      Global: 'Universal screening information and test options'
    };
    return descriptions[region as keyof typeof descriptions] || 'Comprehensive screening information';
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>COLONAiVE™ Regional Screening Options | Explore by Country</title>
        <meta name="description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
        <meta name="keywords" content="colorectal cancer screening, colonoscopy, blood test, regional screening, COLONAiVE" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://colonaive.com/seo" />
        
        {/* Open Graph */}
        <meta property="og:title" content="COLONAiVE™ Regional Screening Options | Explore by Country" />
        <meta property="og:description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://colonaive.com/seo" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="COLONAiVE™ Regional Screening Options | Explore by Country" />
        <meta name="twitter:description" content="COLONAiVE™ is a clinician-led movement to outsmart colorectal cancer by promoting timely colonoscopy, education, and access to HSA-cleared blood-based screening. Learn how to take action early." />
      </Helmet>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-green-600 text-white py-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              🌍 Explore Screening Options by Country
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover region-specific colorectal cancer screening information, costs, and healthcare options 
              tailored to your location and needs.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-sm max-w-3xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">23+</div>
                  <div className="text-blue-200">SEO Landing Pages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">6</div>
                  <div className="text-blue-200">Countries Covered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">15k+</div>
                  <div className="text-blue-200">Monthly Searches</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Regional Sections */}
      <section className="py-16">
        <Container>
          <div className="max-w-7xl mx-auto">
            {sortedRegions.map((region) => (
              <div key={region} className="mb-16">
                <div className="flex items-center mb-8">
                  <div className="text-4xl mr-4">
                    {pagesByRegion[region][0]?.flag || '🌍'}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{region}</h2>
                    <p className="text-gray-600 mt-1">{getRegionDescription(region)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pagesByRegion[region]
                    .sort((a, b) => {
                      // Prioritize high priority pages
                      if (a.priority === 'high' && b.priority !== 'high') return -1;
                      if (b.priority === 'high' && a.priority !== 'high') return 1;
                      // Then sort by search volume
                      return (b.searchVolume || 0) - (a.searchVolume || 0);
                    })
                    .map((page) => (
                      <Card key={page.path} className="hover:shadow-lg transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{page.flag}</span>
                              <div className="flex items-center">
                                {page.priority === 'high' && (
                                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                )}
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                  {page.intent}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-xs text-gray-500">
                                <Search className="h-3 w-3 mr-1" />
                                {page.searchVolume}/mo
                              </div>
                            </div>
                          </div>
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {page.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {page.description}
                          </p>
                          
                          <a href={page.path}>
                            <Button 
                              variant="outline" 
                              className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-all"
                            >
                              View Page
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </a>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Why Choose Regional Screening Information?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Location-Specific</h3>
                <p className="text-sm text-gray-600">
                  Tailored information for healthcare systems, costs, and insurance coverage in your region
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Evidence-Based</h3>
                <p className="text-sm text-gray-600">
                  Content based on regional health authority guidelines and local clinical evidence
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Culturally Adapted</h3>
                <p className="text-sm text-gray-600">
                  Multilingual support and culturally appropriate messaging for each region
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* About COLONAiVE Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold mb-2">🧠 About COLONAiVE™</h2>
            <p>
              COLONAiVE™ is a national movement to outsmart colorectal cancer and reduce CRC-related
              mortality through early detection, inclusive education, and access to clinically validated
              screening technologies. Founded in Singapore, the movement champions colonoscopy as the
              gold standard — the only screening method that both detects and removes precancerous
              polyps, making it the only true preventive option. COLONAiVE™ also supports HSA-cleared,
              blood-based screening tools to help more people get tested before symptoms appear. Guided
              by leading specialists and driven by partnerships across Asia-Pacific, the initiative
              empowers individuals to know when and how to screen — turning awareness into life-saving
              action. Its foundation is built on clinical evidence, real-world health impact, and
              multilingual tools that reach underserved and younger populations.
            </p>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Start Your Screening Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Use our intelligent eligibility wizard to get personalized recommendations for your region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/get-screened#eligibility-check">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  Take Eligibility Assessment
                </Button>
              </a>
              <a href="/get-screened">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg">
                  Explore Screening Options
                </Button>
              </a>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default SEOCatalogPage;