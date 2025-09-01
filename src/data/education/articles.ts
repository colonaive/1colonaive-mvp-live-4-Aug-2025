export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  category: 'patient-basics' | 'patient-screening' | 'patient-symptoms' | 'patient-prevention' | 
           'clinician-guidelines' | 'clinician-research' | 'clinician-case-studies' | 'clinician-cme' |
           'newsroom' | 'research-updates';
  subcategory?: string;
  audience: 'patients' | 'clinicians' | 'both';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  readTime: number; // minutes
  publishedDate: string;
  lastUpdated: string;
  author: {
    name: string;
    credentials?: string;
    affiliation?: string;
  };
  tags: string[];
  featured: boolean;
  references?: Reference[];
  relatedArticles?: string[]; // article IDs
  downloadUrl?: string; // for PDFs
  externalUrl?: string; // for external links
  image?: {
    url: string;
    alt: string;
    caption?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface Reference {
  id: string;
  authors: string[];
  title: string;
  journal?: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  url?: string;
  type: 'journal' | 'guideline' | 'website' | 'book' | 'conference';
}

// Complete articles database
export const educationArticles: Article[] = [
  {
    id: 'crc-basics-001',
    title: 'Understanding Colorectal Cancer: A Comprehensive Guide',
    slug: 'understanding-colorectal-cancer',
    excerpt: 'Learn about colorectal cancer fundamentals, risk factors, and why early detection is crucial for better outcomes.',
    category: 'patient-basics',
    audience: 'patients',
    difficulty: 'basic',
    readTime: 12,
    publishedDate: '2025-06-24',
    lastUpdated: '2025-06-24',
    author: {
      name: 'COLONAiVE Editorial Team',
      credentials: 'Content reviewed from medical literature',
      affiliation: 'Based on American Cancer Society & WHO guidelines'
    },
    tags: ['colorectal cancer', 'basics', 'prevention', 'risk factors', 'colon cancer', 'rectum'],
    featured: true,
    image: {
      url: '/assets/images/education/anatomy/colorectal-anatomy-diagram.webp',
      alt: 'Colorectal anatomy illustration showing colon and rectum',
      caption: 'Understanding colorectal anatomy is key to cancer prevention'
    },
    seo: {
      metaTitle: 'Understanding Colorectal Cancer: Complete Patient Guide | COLONAiVE',
      metaDescription: 'Comprehensive guide to colorectal cancer basics, risk factors, and prevention strategies based on medical literature.',
      keywords: ['colorectal cancer', 'colon cancer', 'prevention', 'risk factors', 'Singapore', 'screening']
    },
    references: [
      {
        id: 'ref-001',
        authors: ['American Cancer Society'],
        title: 'Colorectal Cancer Facts & Figures 2023-2025',
        year: 2023,
        url: 'https://www.cancer.org/research/cancer-facts-statistics/colorectal-cancer-facts-figures.html',
        type: 'website'
      },
      {
        id: 'ref-002',
        authors: ['World Health Organization'],
        title: 'Cancer: Colorectal cancer fact sheet',
        year: 2024,
        url: 'https://www.who.int/news-room/fact-sheets/detail/cancer',
        type: 'guideline'
      },
      {
        id: 'ref-003',
        authors: ['National Cancer Institute'],
        title: 'Colorectal Cancer Prevention (PDQ®)–Patient Version',
        year: 2024,
        url: 'https://www.cancer.gov/types/colorectal/patient/colorectal-prevention-pdq',
        type: 'guideline'
      },
      {
        id: 'ref-004',
        authors: ['Mayo Clinic Staff'],
        title: 'Colon cancer: Symptoms and causes',
        year: 2024,
        url: 'https://www.mayoclinic.org/diseases-conditions/colon-cancer/symptoms-causes/syc-20353669',
        type: 'website'
      }
    ]
  },
  {
    id: 'how-crc-develops-from-polyps',
    title: 'How Colorectal Cancer Develops from Polyps',
    slug: 'how-crc-develops-from-polyps',
    excerpt: 'Understand how most colorectal cancers begin as small benign polyps, and why early removal through screening can prevent cancer development.',
    category: 'patient-basics',
    audience: 'patients',
    difficulty: 'intermediate',
    readTime: 12,
    publishedDate: '2025-06-24',
    lastUpdated: '2025-06-24',
    author: {
      name: 'COLONAiVE Editorial Team',
      credentials: 'Content reviewed from medical literature',
      affiliation: 'Based on Cleveland Clinic & American Cancer Society guidelines'
    },
    tags: ['polyps', 'cancer development', 'adenoma', 'prevention', 'screening', 'pathology'],
    featured: true,
    image: {
      url: '/assets/images/education/anatomy/colon-polyp-progression-stages.webp',
      alt: 'Medical illustration showing the progression from normal colon tissue to small polyps, large polyps, and early cancer development with detailed anatomical cross-sections',
      caption: 'The adenoma-carcinoma sequence: How polyps transform into cancer over time'
    },
    seo: {
      metaTitle: 'How Colorectal Cancer Develops from Polyps | Prevention Guide',
      metaDescription: 'Learn how colorectal cancer develops from benign polyps over 7-10 years. Understand the adenoma-carcinoma sequence and why early screening prevents cancer.',
      keywords: ['colon polyps', 'colorectal cancer development', 'adenoma carcinoma sequence', 'polyp removal', 'cancer prevention', 'screening']
    },
    references: [
      {
        id: 'ref-001',
        authors: ['Cleveland Clinic'],
        title: 'Colon polyps: Different Types & Cancer Risk',
        year: 2023,
        url: 'https://my.clevelandclinic.org/health/diseases/15370-colon-polyps',
        type: 'website'
      },
      {
        id: 'ref-002',
        authors: ['Harvard Health Publishing'],
        title: 'They found colon polyps: Now what?',
        year: 2023,
        url: 'https://www.health.harvard.edu/diseases-and-conditions/they-found-colon-polyps-now-what',
        type: 'website'
      },
      {
        id: 'ref-003',
        authors: ['American Cancer Society'],
        title: 'Understanding Your Pathology Report: Colon Polyps',
        year: 2024,
        url: 'https://www.cancer.org/cancer/diagnosis-staging/tests/biopsy-and-cytology-tests/understanding-your-pathology-report/colon-pathology/colon-polyps-sessile-or-traditional-serrated-adenomas.html',
        type: 'website'
      },
      {
        id: 'ref-004',
        authors: ['University of Michigan Health'],
        title: 'Colon and Rectal Polyps',
        year: 2024,
        url: 'https://www.uofmhealth.org/conditions-treatments/digestive-and-liver-health/colon-and-rectal-polyps',
        type: 'website'
      },
      {
        id: 'ref-005',
        authors: ['Cleveland Clinic'],
        title: 'How Long Does It Take Colon Cancer To Grow?',
        year: 2024,
        url: 'https://health.clevelandclinic.org/how-quickly-do-colon-polyps-turn-cancerous',
        type: 'website'
      }
    ]
  },
  {
    id: 'colonoscopy-preparation-complete-guide',
    title: 'Colonoscopy Preparation: Your Complete Step-by-Step Guide',
    slug: 'colonoscopy-preparation-complete-guide',
    excerpt: 'Simple, reassuring preparation guide that makes colonoscopy feel approachable. Learn why this life-saving procedure is easier than you think.',
    category: 'patient-screening',
    audience: 'patients',
    difficulty: 'basic',
    readTime: 10,
    publishedDate: '2025-06-25',
    lastUpdated: '2025-06-25',
    author: {
      name: 'COLONAiVE Editorial Team',
      credentials: 'Content reviewed from medical literature',
      affiliation: 'Based on ASGE & International Medical Guidelines'
    },
    tags: ['colonoscopy', 'preparation', 'screening', 'prevention', 'healthcare guidance', 'patient education'],
    featured: true,
    image: {
      url: '/assets/images/education/procedures/colonoscopy-comfort.webp',
      alt: 'Reassuring medical consultation showing patient and doctor discussing colonoscopy preparation in comfortable healthcare setting',
      caption: 'Colonoscopy preparation made simple and reassuring'
    },
    seo: {
      metaTitle: 'Simple Colonoscopy Preparation Guide | Easy Step-by-Step Instructions',
      metaDescription: 'Reassuring colonoscopy preparation guide that makes screening feel approachable. Learn why this life-saving procedure is easier than you think with simple steps.',
      keywords: ['colonoscopy preparation', 'easy colonoscopy prep', 'screening preparation', 'bowel prep guide', 'colonoscopy tips', 'cancer prevention', 'healthcare screening']
    },
    references: [
      {
        id: 'ref-001',
        authors: ['American Society for Gastrointestinal Endoscopy'],
        title: 'ASGE Guidelines for Colonoscopy Preparation',
        year: 2023,
        url: 'https://www.asge.org/home/resources/publications/guidelines',
        type: 'guideline'
      },
      {
        id: 'ref-002',
        authors: ['Mayo Clinic'],
        title: 'Colonoscopy Preparation Instructions',
        year: 2024,
        url: 'https://www.mayoclinic.org/tests-procedures/colonoscopy/about/pac-20393569',
        type: 'website'
      },
      {
        id: 'ref-003',
        authors: ['US Multi-Society Task Force on Colorectal Cancer'],
        title: 'Optimizing Bowel Preparation for Colonoscopy',
        year: 2024,
        url: 'https://www.gastrojournal.org/article/S0016-5085(24)00123-4/fulltext',
        type: 'journal'
      },
      {
        id: 'ref-004',
        authors: ['American Cancer Society'],
        title: 'Patient Education for Colonoscopy Preparation',
        year: 2024,
        url: 'https://www.cancer.org/cancer/colon-rectal-cancer/detection-diagnosis-staging/screening-tests.html',
        type: 'website'
      }
    ]
  },
  {
  id: 'early-warning-signs-crc',
  title: 'Early Warning Signs of Colorectal Cancer',
  slug: 'early-warning-signs',
  excerpt: 'Learn to recognize the critical warning signs and symptoms of colorectal cancer that require immediate medical attention for early detection and better outcomes.',
  category: 'patient-symptoms',
  audience: 'patients',
  difficulty: 'basic',
  readTime: 8,
  publishedDate: '2025-06-25',
  lastUpdated: '2025-06-25',
  author: {
    name: 'COLONAiVE Editorial Team',
    credentials: 'Content reviewed from medical literature',
    affiliation: 'Based on Mayo Clinic and American Cancer Society guidelines'
  },
  tags: ['symptoms', 'warning signs', 'early detection', 'blood in stool', 'bowel changes', 'abdominal pain'],
  featured: true,
  image: {
    url: '/assets/images/education/symptoms/colorectal-cancer-tumor-diagram.webp',
    alt: 'Medical professional pointing to colorectal cancer tumor location on anatomical model of colon and rectum',
    caption: 'Understanding where colorectal cancer develops helps patients recognize the importance of early symptom recognition and screening.'
  },
  seo: {
    metaTitle: 'Early Warning Signs of Colorectal Cancer | Symptoms Guide',
    metaDescription: 'Recognize critical colorectal cancer warning signs including blood in stool, bowel changes, and abdominal pain. Learn when to seek immediate medical attention.',
    keywords: ['colorectal cancer symptoms', 'early warning signs', 'blood in stool', 'bowel changes', 'abdominal pain', 'when to see doctor']
  },
  references: [
  {
    id: 'ref-001',
    authors: ['Mayo Clinic Cancer Center Blog'],
    title: 'Warning signs of colorectal cancer in younger adults',
    year: 2024,
    url: 'https://cancerblog.mayoclinic.org/2024/04/17/warning-signs-of-colorectal-cancer-in-younger-adults/',
    type: 'website'
  },
  {
    id: 'ref-002',
    authors: ['American Cancer Society'],
    title: 'Colorectal Cancer Signs and Symptoms',
    year: 2024,
    url: 'https://www.cancer.org/cancer/types/colon-rectal-cancer/detection-diagnosis-staging/signs-and-symptoms.html',
    type: 'website'
  },
  {
    id: 'ref-003',
    authors: ['MD Anderson Cancer Center'],
    title: 'Colorectal Cancer Symptoms & Signs',
    year: 2024,
    url: 'https://www.mdanderson.org/cancer-types/colorectal-cancer/colorectal-cancer-symptoms.html',
    type: 'website'
  },
  {
    id: 'ref-004',
    authors: ['National Cancer Institute Singapore'],
    title: 'Colorectal Cancer Statistics Singapore',
    year: 2024,
    url: 'https://www.ncis.com.sg/cancer-information/cancer-types/colorectal-cancer',
    type: 'website'
  },
  {
    id: 'ref-005',
    authors: ['PMC - PubMed Central'],
    title: 'Trends in Early-Onset Colorectal Cancer in Singapore',
    year: 2024,
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11888020/',
    type: 'journal'
  }
]
},
  {
  id: 'colonoscopy-gold-standard-001',
  title: 'Colonoscopy: The Gold Standard for CRC Screening',
  slug: 'colonoscopy-gold-standard',
  excerpt: 'Learn why colonoscopy remains the most effective tool for colorectal cancer prevention and how it saves lives through early detection and polyp removal.',
  category: 'patient-screening',
  audience: 'patients',
  difficulty: 'basic',
  readTime: 12,
  publishedDate: '2025-06-25',
  lastUpdated: '2025-06-25',
  author: {
    name: 'COLONAiVE Editorial Team',
    credentials: 'Content reviewed from medical literature',
    affiliation: 'Based on American Cancer Society, Mayo Clinic & NEJM studies'
  },
  tags: ['colonoscopy', 'screening', 'prevention', 'gold standard', 'polyp removal', 'early detection'],
  featured: true,
  image: {
    url: '/assets/images/education/procedures/colonoscopy-procedure-room.webp',
    alt: 'Modern colonoscopy procedure room with advanced endoscopic equipment and comfortable patient bed',
    caption: 'State-of-the-art colonoscopy facilities ensure safe, comfortable screening procedures'
  },
  seo: {
    metaTitle: 'Colonoscopy: Gold Standard for Colorectal Cancer Screening | COLONAiVE',
    metaDescription: 'Learn why colonoscopy is the most effective colorectal cancer screening method. Discover how this gold standard procedure prevents cancer through early detection and polyp removal.',
    keywords: ['colonoscopy', 'colorectal cancer screening', 'gold standard', 'polyp removal', 'cancer prevention', 'early detection', 'endoscopy']
  },
  references: [
    {
      id: 'ref-001',
      authors: ['Zauber AG', 'Winawer SJ', 'O\'Brien MJ', 'et al'],
      title: 'Colonoscopic Polypectomy and Long-Term Prevention of Colorectal-Cancer Deaths',
      journal: 'New England Journal of Medicine',
      year: 2012,
      volume: '366',
      pages: '687-696',
      doi: '10.1056/NEJMoa1100370',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa1100370',
      type: 'journal'
    },
    {
      id: 'ref-002',
      authors: ['Winawer SJ', 'Zauber AG', 'Ho MN', 'et al'],
      title: 'Prevention of Colorectal Cancer by Colonoscopic Polypectomy',
      journal: 'New England Journal of Medicine',
      year: 1993,
      volume: '329',
      pages: '1977-1981',
      doi: '10.1056/NEJM199312303292701',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJM199312303292701',
      type: 'journal'
    },
    {
      id: 'ref-003',
      authors: ['American Cancer Society'],
      title: 'Colorectal Cancer Screening Tests',
      year: 2024,
      url: 'https://www.cancer.org/cancer/types/colon-rectal-cancer/detection-diagnosis-staging/screening-tests.html',
      type: 'website'
    },
    {
      id: 'ref-004',
      authors: ['Mayo Clinic Staff'],
      title: 'Colonoscopy: What you can expect',
      year: 2024,
      url: 'https://www.mayoclinic.org/tests-procedures/colonoscopy/about/pac-20393569',
      type: 'website'
    },
    {
      id: 'ref-005',
      authors: ['National Cancer Institute'],
      title: 'Colorectal Cancer Screening (PDQ®)–Health Professional Version',
      year: 2024,
      url: 'https://www.cancer.gov/types/colorectal/hp/colorectal-screening-pdq',
      type: 'guideline'
    },
    {
      id: 'ref-006',
      authors: ['Bretthauer M', 'Løberg M', 'Wieszczy P', 'et al'],
      title: 'Effect of Colonoscopy Screening on Risks of Colorectal Cancer and Related Death',
      journal: 'New England Journal of Medicine',
      year: 2022,
      volume: '387',
      pages: '1547-1556',
      doi: '10.1056/NEJMoa2208375',
      url: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2208375',
      type: 'journal'
    }
  ]
},

  {
    id: 'clin-kaiser-001',
    title: 'Kaiser Permanente CRC Screening Program: Evidence-Based Success',
    slug: 'kaiser-crc-study-analysis',
    excerpt: 'Analysis of the Kaiser Permanente screening program outcomes based on published research showing 33% reduction in CRC incidence.',
    category: 'clinician-research',
    audience: 'clinicians',
    difficulty: 'intermediate',
    readTime: 15,
    publishedDate: '2025-06-10',
    lastUpdated: '2025-06-15',
    author: {
      name: 'COLONAiVE Editorial Team',
      credentials: 'Content reviewed from medical literature',
      affiliation: 'Based on published peer-reviewed studies'
    },
    tags: ['screening program', 'population health', 'outcomes research', 'quality improvement'],
    featured: true,
    seo: {
      metaTitle: 'Kaiser Permanente CRC Screening Success: Clinical Analysis | COLONAiVE',
      metaDescription: 'Learn from Kaiser Permanente\'s successful CRC screening program based on published research and clinical outcomes.',
      keywords: ['CRC screening', 'population health', 'quality improvement', 'colorectal cancer prevention']
    },
    references: [
      {
        id: 'ref-007',
        authors: ['Corley DA', 'Jensen CD', 'Marks AR', 'et al'],
        title: 'Adenoma detection rate and risk of colorectal cancer and death',
        journal: 'New England Journal of Medicine',
        year: 2014,
        volume: '370',
        pages: '1298-1306',
        doi: '10.1056/NEJMoa1309086',
        type: 'journal'
      }
    ]
  }
];

// Helper function to get article by slug
export const getArticleBySlug = (slug: string): Article | undefined => {
  return educationArticles.find(article => article.slug === slug);
};

// Helper function to get articles by category
export const getArticlesByCategory = (category: string): Article[] => {
  return educationArticles.filter(article => article.category === category);
};

// Helper function to get featured articles
export const getFeaturedArticles = (): Article[] => {
  return educationArticles.filter(article => article.featured);
};