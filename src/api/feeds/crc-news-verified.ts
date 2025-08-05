// VERIFIED CRC NEWS API - REAL SOURCES ONLY
// NO AI-GENERATED CONTENT, NO HALLUCINATED STATISTICS

interface NewsArticle {
  title: string;
  published: string;
  source: string;
  summary: string;
  url: string;
  content?: string;
}

// REAL RSS sources for CRC news
const VERIFIED_RSS_SOURCES = [
  {
    name: 'Google News CRC',
    url: 'https://news.google.com/rss/search?q=colorectal+cancer+screening&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News'
  },
  {
    name: 'PubMed Recent',
    url: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1wGl4Q5T2VjMlqqx4keMKlZv8FGI_Ll9YyBFxT_fN5Y7yKCqO7/?limit=10',
    source: 'PubMed'
  },
  {
    name: 'Reuters Health',
    url: 'https://www.reuters.com/pf/rss/life-health/',
    source: 'Reuters Health'
  }
];

class VerifiedCRCNewsService {
  
  /**
   * Fetch real RSS content using CORS proxy
   */
  private async fetchRealRSS(feedUrl: string, source: string): Promise<NewsArticle[]> {
    try {
      // Use RSS2JSON proxy for CORS bypass
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&count=5`;
      
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
        if (!this.isCRCRelated(searchText)) continue;
        
        // Create article with REAL content only
        const cleanDescription = this.cleanHtmlContent(item.description || '');
        const excerpt = this.extractRealExcerpt(cleanDescription, source);
        
        articles.push({
          title: item.title,
          published: item.pubDate || new Date().toISOString(),
          source: source,
          summary: excerpt,
          url: item.link,
          content: cleanDescription
        });
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
  private isCRCRelated(text: string): boolean {
    const crcKeywords = [
      'colorectal cancer', 'colon cancer', 'bowel cancer', 'crc',
      'colonoscopy', 'screening', 'polyp', 'early detection',
      'stool test', 'blood test', 'fit test', 'fobt'
    ];
    
    return crcKeywords.some(keyword => text.includes(keyword));
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
   * Fetch all verified CRC news from real sources
   */
  async fetchVerifiedNews(): Promise<NewsArticle[]> {
    console.log('Fetching VERIFIED CRC news from real RSS sources...');
    
    const allArticles: NewsArticle[] = [];
    
    // Fetch from all verified sources
    for (const source of VERIFIED_RSS_SOURCES) {
      try {
        const articles = await this.fetchRealRSS(source.url, source.source);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to fetch from ${source.source}:`, error);
      }
    }
    
    // Remove duplicates and sort by date
    const uniqueArticles = this.removeDuplicates(allArticles);
    uniqueArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
    console.log(`Found ${uniqueArticles.length} verified CRC articles`);
    return uniqueArticles.slice(0, 10); // Return top 10 most recent
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
 * Main API function - VERIFIED SOURCES ONLY
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