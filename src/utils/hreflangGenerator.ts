// Hreflang Generator for COLONAiVE International SEO
// Supports SG (en,zh,ms,ta), IN (en,hi), PH (en,tl), JP (en,ja), AU (en)

export interface HreflangMapping {
  language: string;
  region?: string;
  hreflang: string;
  url: string;
  title: string;
}

export interface RegionalLanguageConfig {
  region: string;
  languages: string[];
  defaultLanguage: string;
  regionCode: string;
}

export class HreflangGenerator {
  
  // Regional language configuration per PQ strategy
  private static readonly REGIONAL_CONFIGS: RegionalLanguageConfig[] = [
    {
      region: 'Singapore',
      languages: ['en', 'zh', 'ms', 'ta'],
      defaultLanguage: 'en',
      regionCode: 'SG'
    },
    {
      region: 'India',
      languages: ['en', 'hi'],
      defaultLanguage: 'en',
      regionCode: 'IN'
    },
    {
      region: 'Philippines',
      languages: ['en', 'tl'],
      defaultLanguage: 'en',
      regionCode: 'PH'
    },
    {
      region: 'Japan',
      languages: ['en', 'ja'],
      defaultLanguage: 'en',
      regionCode: 'JP'
    },
    {
      region: 'Australia',
      languages: ['en'],
      defaultLanguage: 'en',
      regionCode: 'AU'
    }
  ];

  /**
   * Generate hreflang tags for a specific page across all supported regions/languages
   */
  static generateHreflangTags(
    basePath: string, 
    currentLanguage: string, 
    currentRegion: string,
    keyword: string
  ): HreflangMapping[] {
    const hreflangTags: HreflangMapping[] = [];
    
    // Add x-default for primary English version
    hreflangTags.push({
      language: 'en',
      region: 'Singapore',
      hreflang: 'x-default',
      url: `https://colonaive.com${basePath}`,
      title: this.generateLocalizedTitle(keyword, 'en', 'Singapore')
    });

    // Generate for each regional configuration
    this.REGIONAL_CONFIGS.forEach(config => {
      config.languages.forEach(language => {
        const localizedPath = this.generateLocalizedPath(basePath, language, config.region);
        const hreflang = language === config.defaultLanguage && language === 'en' 
          ? config.regionCode.toLowerCase()
          : `${language}-${config.regionCode}`;
        
        hreflangTags.push({
          language,
          region: config.region,
          hreflang,
          url: `https://colonaive.com${localizedPath}`,
          title: this.generateLocalizedTitle(keyword, language, config.region)
        });
      });
    });

    return hreflangTags;
  }

  /**
   * Generate localized URL path based on language and region
   */
  private static generateLocalizedPath(basePath: string, language: string, region: string): string {
    if (language === 'en') {
      // English versions use regional suffix
      const regionSuffix = region === 'Singapore' ? '' : `-${region.toLowerCase()}`;
      return `${basePath}${regionSuffix}`;
    }

    // Non-English versions use language prefix
    const languagePathMap = {
      'zh': 'zh-cn',
      'hi': 'hi-in', 
      'ta': 'ta-sg',
      'ms': 'ms-sg',
      'tl': 'tl-ph',
      'ja': 'ja-jp'
    };

    const languagePath = languagePathMap[language as keyof typeof languagePathMap] || language;
    return `/${languagePath}${basePath}`;
  }

  /**
   * Generate localized titles for different languages
   */
  private static generateLocalizedTitle(keyword: string, language: string, region: string): string {
    const titles = {
      en: {
        'blood test colorectal cancer': `Blood Test for Colorectal Cancer | ${region}`,
        'colon cancer test': `Colon Cancer Test | ${region}`,
        'early detection colon cancer': `Early Detection Colon Cancer | ${region}`,
        'FIT test': `FIT Test | ${region}`,
        'bowel cancer screening': `Bowel Cancer Screening | ${region}`,
        'colonoscopy cost': `Colonoscopy Cost | ${region}`,
        'FOBT test': `FOBT Test | ${region}`
      },
      zh: {
        'blood test colorectal cancer': '大腸癌血液檢測 | 新加坡',
        'colon cancer test': '結腸癌檢測 | 新加坡',
        'early detection colon cancer': '大腸癌早期檢測 | 新加坡',
        'FIT test': '糞便潛血檢查 | 新加坡',
        'bowel cancer screening': '腸癌篩查 | 新加坡'
      },
      hi: {
        'blood test colorectal cancer': 'कोलोरेक्टल कैंसर रक्त परीक्षण | भारत',
        'colon cancer test': 'कोलन कैंसर टेस्ट | भारत',
        'early detection colon cancer': 'कोलन कैंसर का जल्दी पता लगाना | भारत',
        'colonoscopy cost': 'कोलोनोस्कोपी की लागत | भारत'
      },
      ta: {
        'blood test colorectal cancer': 'குடல் புற்றுநோய் இரத்த பரிசோதனை | சிங்கப்பூர்',
        'colon cancer test': 'கோலன் கேன்சர் டெஸ்ட் | சிங்கப்பூர்',
        'early detection colon cancer': 'குடல் புற்றுநோய் ஆரம்ப கண்டுபிடிப்பு | சிங்கப்பூர்'
      },
      tl: {
        'blood test colorectal cancer': 'Dugo Test para sa Colon Cancer | Pilipinas',
        'colon cancer test': 'Pagsusulit sa Colon Cancer | Pilipinas',
        'early detection colon cancer': 'Magang Paghahanap ng Colon Cancer | Pilipinas'
      },
      ja: {
        'blood test colorectal cancer': '大腸がん血液検査 | 日本',
        'colon cancer test': '大腸がん検査 | 日本',
        'early detection colon cancer': '大腸がん早期発見 | 日本',
        'colonoscopy cost': '大腸内視鏡検査費用 | 日本'
      }
    };

    const languageTitles = titles[language as keyof typeof titles];
    if (languageTitles) {
      const matchingTitle = Object.keys(languageTitles).find(key => 
        keyword.toLowerCase().includes(key.toLowerCase())
      );
      if (matchingTitle) {
        return languageTitles[matchingTitle as keyof typeof languageTitles];
      }
    }

    // Fallback to English
    return titles.en[keyword as keyof typeof titles.en] || `${keyword} | ${region}`;
  }

  /**
   * Generate canonical URL for a page
   */
  static generateCanonicalUrl(basePath: string, language: string, region: string): string {
    if (language === 'en' && region === 'Singapore') {
      return `https://colonaive.com${basePath}`;
    }
    
    const localizedPath = this.generateLocalizedPath(basePath, language, region);
    return `https://colonaive.com${localizedPath}`;
  }

  /**
   * Generate sitemap entries for all language/region combinations
   */
  static generateSitemapEntries(pages: Array<{path: string, keyword: string}>): Array<{
    url: string;
    changefreq: string;
    priority: number;
    lastmod: string;
    alternates: HreflangMapping[];
  }> {
    const sitemapEntries: any[] = [];

    pages.forEach(page => {
      this.REGIONAL_CONFIGS.forEach(config => {
        config.languages.forEach(language => {
          const localizedPath = this.generateLocalizedPath(page.path, language, config.region);
          const hreflangTags = this.generateHreflangTags(page.path, language, config.region, page.keyword);
          
          sitemapEntries.push({
            url: `https://colonaive.com${localizedPath}`,
            changefreq: 'weekly',
            priority: language === 'en' && config.region === 'Singapore' ? 1.0 : 0.8,
            lastmod: new Date().toISOString().split('T')[0],
            alternates: hreflangTags
          });
        });
      });
    });

    return sitemapEntries;
  }

  /**
   * Generate language detection and redirect logic
   */
  static generateLanguageRedirectRules(): Array<{
    condition: string;
    redirect: string;
    description: string;
  }> {
    return [
      {
        condition: 'Accept-Language: zh-CN, zh-SG, zh-HK',
        redirect: '/zh-cn/seo/*',
        description: 'Redirect Chinese users to Chinese language pages'
      },
      {
        condition: 'Accept-Language: hi-IN, hi',
        redirect: '/hi-in/seo/*',
        description: 'Redirect Hindi users to Hindi language pages'
      },
      {
        condition: 'Accept-Language: ja-JP, ja',
        redirect: '/ja-jp/seo/*',
        description: 'Redirect Japanese users to Japanese language pages'
      },
      {
        condition: 'Accept-Language: tl-PH, tl',
        redirect: '/tl-ph/seo/*',
        description: 'Redirect Tagalog users to Tagalog language pages'
      },
      {
        condition: 'Accept-Language: ta-SG, ta',
        redirect: '/ta-sg/seo/*',
        description: 'Redirect Tamil users to Tamil language pages'
      },
      {
        condition: 'GeoIP: AU',
        redirect: '/seo/*-australia',
        description: 'Redirect Australian users to Australia-specific pages'
      },
      {
        condition: 'GeoIP: IN',
        redirect: '/seo/*-india',
        description: 'Redirect Indian users to India-specific pages'
      },
      {
        condition: 'GeoIP: PH',
        redirect: '/seo/*-philippines',
        description: 'Redirect Philippine users to Philippines-specific pages'
      },
      {
        condition: 'GeoIP: JP',
        redirect: '/ja-jp/seo/*',
        description: 'Redirect Japanese users to Japanese language pages'
      }
    ];
  }

  /**
   * Generate React component for hreflang tags
   */
  static generateHreflangComponent(hreflangTags: HreflangMapping[]): any {
    return {
      componentName: 'HreflangTags',
      helmetContent: hreflangTags.map(tag => ({
        rel: 'alternate',
        hrefLang: tag.hreflang,
        href: tag.url
      }))
    };
  }
}

export default HreflangGenerator;