// VERIFIED CRC NEWS API - REAL SOURCES ONLY
// NO AI-GENERATED CONTENT, NO HALLUCINATED STATISTICS

interface NewsArticle {
  title: string;
  published: string;
  source: string;
  summary: string;
  url: string;
  content?: string;
  type: 'clinical' | 'news';
  authors?: string;
  journal?: string;
  doi?: string;
}

interface ClinicalPublication extends NewsArticle {
  type: 'clinical';
  authors?: string;
  journal: string;
  abstract?: string;
  doi?: string;
}

interface GeneralNews extends NewsArticle {
  type: 'news';
  publisher: string;
}

// CLINICAL PUBLICATION SOURCES (last 6 months)
const CLINICAL_SOURCES = [
  {
    name: 'PubMed CRC Research',
    url: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1wGl4Q5T2VjMlqqx4keMKlZv8FGI_Ll9YyBFxT_fN5Y7yKCqO7/?limit=15',
    source: 'PubMed',
    type: 'clinical' as const
  },
  {
    name: 'NEJM Cancer Research',
    url: 'https://www.nejm.org/action/showFeed?type=etoc&feed=rss',
    source: 'NEJM',
    type: 'clinical' as const
  },
  {
    name: 'JAMA Oncology',
    url: 'https://jamanetwork.com/rss/site_4/category_393.xml',
    source: 'JAMA',
    type: 'clinical' as const
  },
  {
    name: 'Nature Medicine',
    url: 'https://feeds.nature.com/nm/rss/current',
    source: 'Nature Medicine',
    type: 'clinical' as const
  }
];

// GENERAL NEWS SOURCES (last 30 days)
const NEWS_SOURCES = [
  {
    name: 'Google News CRC',
    url: 'https://news.google.com/rss/search?q="colorectal+cancer"+OR+"colon+cancer"+screening&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News',
    type: 'news' as const
  },
  {
    name: 'Reuters Health News',
    url: 'https://www.reuters.com/pf/rss/life-health/',
    source: 'Reuters Health',
    type: 'news' as const
  },
  {
    name: 'Medical News Today',
    url: 'https://www.medicalnewstoday.com/rss',
    source: 'Medical News Today',
    type: 'news' as const
  }
];

class VerifiedCRCNewsService {
  
  /**
   * Check if article is within time filter
   */
  private isWithinTimeFilter(publishedDate: string, type: 'clinical' | 'news'): boolean {
    const articleDate = new Date(publishedDate);
    const now = new Date();
    const daysDiff = (now.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24);
    
    // Clinical: last 6 months (180 days), News: last 30 days
    const maxDays = type === 'clinical' ? 180 : 30;
    return daysDiff <= maxDays;
  }

  /**
   * Extract clinical publication metadata
   */
  private extractClinicalMetadata(item: any, source: string): {
    authors?: string;
    journal?: string;
    doi?: string;
  } {
    let authors = '';
    let journal = source;
    let doi = '';
    
    // Extract authors from PubMed format
    if (source === 'PubMed' && item.description) {
      const authorMatch = item.description.match(/Author(?:s)?:\s*([^.]+)/i);
      if (authorMatch) {
        authors = authorMatch[1].trim();
      }
    }
    
    // Extract DOI if present
    if (item.link && item.link.includes('doi.org')) {
      const doiMatch = item.link.match(/doi\.org\/(10\..+)/);
      if (doiMatch) {
        doi = doiMatch[1];
      }
    }
    
    return { authors, journal, doi };
  }

  /**
   * Fetch real RSS content using CORS proxy
   */
  private async fetchRealRSS(
    feedUrl: string, 
    source: string, 
    type: 'clinical' | 'news'
  ): Promise<NewsArticle[]> {
    try {
      // Use RSS2JSON proxy for CORS bypass
      const count = type === 'clinical' ? 15 : 10;
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=${count}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        console.warn(`RSS fetch failed for ${source}: ${data.message}`);
        return [];
      }

      const articles: NewsArticle[] = [];
      
      for (const item of data.items || []) {
        if (!item.title || !item.link) continue;
        
        // Filter for CRC-related articles
        const searchText = `${item.title} ${item.description || ''}`.toLowerCase();
        if (!this.isCRCRelated(searchText, type)) continue;
        
        // Check time filter
        const publishedDate = item.pubDate || new Date().toISOString();
        if (!this.isWithinTimeFilter(publishedDate, type)) continue;
        
        // Create article with REAL content only
        const cleanDescription = this.cleanHtmlContent(item.description || '');
        const excerpt = this.extractRealExcerpt(cleanDescription, source);
        
        const baseArticle = {
          title: item.title,
          published: publishedDate,
          source: source,
          summary: excerpt,
          url: item.link,
          content: cleanDescription,
          type: type
        };
        
        if (type === 'clinical') {
          const metadata = this.extractClinicalMetadata(item, source);
          articles.push({
            ...baseArticle,
            authors: metadata.authors,
            journal: metadata.journal || source,
            doi: metadata.doi
          });
        } else {
          articles.push({
            ...baseArticle,
            publisher: source
          });
        }
      }
      
      return articles;
    } catch (error) {
      console.error(`Error fetching RSS from ${source}:`, error);
      return [];
    }
  }

  /**
   * Check if content is CRC-related using keywords
   */
  private isCRCRelated(text: string, type: 'clinical' | 'news' = 'news'): boolean {
    const clinicalKeywords = [
      'colorectal cancer', 'CRC screening', 'blood-based screening', 
      'colonoscopy', 'adenoma', 'early detection', 'colorectal neoplasm',
      'fecal immunochemical test', 'fit test', 'stool dna test',
      'kaiser permanente', 'triple-effect', 'screening program'
    ];
    
    const newsKeywords = [
      'colorectal cancer', 'colon cancer', 'bowel cancer', 'crc',
      'colonoscopy', 'screening', 'polyp', 'early detection',
      'stool test', 'blood test', 'fit test', 'fobt'
    ];
    
    const keywords = type === 'clinical' ? clinicalKeywords : newsKeywords;
    return keywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  }

  /**
   * Clean HTML and extract plain text
   */
  private cleanHtmlContent(html: string): string {
    if (!html) return '';
    
    // Remove HTML tags
    const textContent = html.replace(/<[^>]*>/g, '');
    
    // Decode common HTML entities
    const decoded = textContent
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&nbsp;/g, ' ');
    
    return decoded.trim();
  }

  /**
   * Extract real excerpt from article content (NO AI GENERATION)
   */
  private extractRealExcerpt(content: string, source: string): string {
    if (!content || content.length < 30) {
      return `Read the full article from ${source} for complete details.`;
    }
    
    // Get first 1-2 sentences from actual content
    const sentences = content.split(/[.!?]+/);
    const firstSentences = sentences.slice(0, 2).join('. ').trim();
    
    if (firstSentences.length > 20 && firstSentences.length < 300) {
      return `${firstSentences}. Read the full article from ${source} for complete details.`;
    }
    
    // Fallback to first 150 characters
    const excerpt = content.substring(0, 150).trim();
    return `${excerpt}... Read the full article from ${source} for complete details.`;
  }

  /**
   * Fetch clinical publications (last 6 months)
   */
  async fetchClinicalPublications(): Promise<ClinicalPublication[]> {
    console.log('Fetching clinical publications from medical journals...');
    
    const allArticles: NewsArticle[] = [];
    
    // Fetch from clinical sources
    for (const source of CLINICAL_SOURCES) {
      try {
        const articles = await this.fetchRealRSS(source.url, source.source, 'clinical');
        allArticles.push(...articles);
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to fetch clinical publications from ${source.source}:`, error);
      }
    }
    
    // Remove duplicates and sort by publication date
    const uniqueArticles = this.removeDuplicates(allArticles);
    uniqueArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
    console.log(`Found ${uniqueArticles.length} clinical publications`);
    return uniqueArticles as ClinicalPublication[];
  }
  
  /**
   * Fetch general news articles (last 30 days)
   */
  async fetchGeneralNews(): Promise<GeneralNews[]> {
    console.log('Fetching general CRC news from news sources...');
    
    const allArticles: NewsArticle[] = [];
    
    // Fetch from news sources
    for (const source of NEWS_SOURCES) {
      try {
        const articles = await this.fetchRealRSS(source.url, source.source, 'news');
        allArticles.push(...articles);
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error(`Failed to fetch news from ${source.source}:`, error);
      }
    }
    
    // Remove duplicates and sort by date
    const uniqueArticles = this.removeDuplicates(allArticles);
    uniqueArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
    console.log(`Found ${uniqueArticles.length} news articles`);
    return uniqueArticles as GeneralNews[];
  }
  
  /**
   * Fetch all verified CRC content (legacy method)
   */
  async fetchVerifiedNews(): Promise<NewsArticle[]> {
    const [clinical, news] = await Promise.all([
      this.fetchClinicalPublications(),
      this.fetchGeneralNews()
    ]);
    
    return [...clinical, ...news];
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  private removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
    const unique: NewsArticle[] = [];
    const seenTitles = new Set<string>();

    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        unique.push(article);
      }
    }

    return unique;
  }
}

// Create service instance
const verifiedNewsService = new VerifiedCRCNewsService();

/**
 * Fetch clinical publications
 */
export async function fetchClinicalPublications(): Promise<ClinicalPublication[]> {
  try {
    return await verifiedNewsService.fetchClinicalPublications();
  } catch (error) {
    console.error('Error fetching clinical publications:', error);
    return [];
  }
}

/**
 * Fetch general news articles
 */
export async function fetchGeneralNews(): Promise<GeneralNews[]> {
  try {
    return await verifiedNewsService.fetchGeneralNews();
  } catch (error) {
    console.error('Error fetching general news:', error);
    return [];
  }
}

/**
 * Main API function - VERIFIED SOURCES ONLY (legacy)
 */
export async function fetchVerifiedCRCNews(): Promise<NewsArticle[]> {
  try {
    return await verifiedNewsService.fetchVerifiedNews();
  } catch (error) {
    console.error('Error fetching verified CRC news:', error);
    return [];
  }
}

// NO MOCK DATA - Empty array when no real articles available
export const verifiedCRCNews: NewsArticle[] = [];

export default verifiedNewsService;