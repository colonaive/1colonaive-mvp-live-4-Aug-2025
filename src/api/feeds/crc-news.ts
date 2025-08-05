// src/api/feeds/crc-news.ts
// Real RSS-based CRC news feed implementation

interface NewsArticle {
  title: string;
  published: string;
  source: string;
  summary: string;
  url: string;
  content?: string;
}

interface RSSFeed {
  name: string;
  url: string;
  source: string;
}

// Real trusted medical RSS sources
const RSS_SOURCES: RSSFeed[] = [
  {
    name: 'Google News CRC',
    url: 'https://news.google.com/rss/search?q=colorectal+cancer+screening&hl=en-US&gl=US&ceid=US:en',
    source: 'Google News'
  },
  {
    name: 'Google News CRC Singapore',
    url: 'https://news.google.com/rss/search?q=colorectal+cancer+singapore&hl=en-US&gl=SG&ceid=SG:en',
    source: 'Google News SG'
  },
  {
    name: 'Reuters Health',
    url: 'https://www.reuters.com/pf/rss/life-health/',
    source: 'Reuters Health'
  },
  {
    name: 'Medical News Today',
    url: 'https://www.medicalnewstoday.com/rss',
    source: 'Medical News Today'
  }
];

// Keywords to filter CRC-related articles
const CRC_KEYWORDS = [
  'colorectal cancer',
  'colon cancer',
  'CRC',
  'polyp',
  'early detection',
  'screening',
  'colonoscopy',
  'sigmoidoscopy',
  'FIT test',
  'fecal immunochemical',
  'bowel cancer',
  'rectum cancer',
  'Singapore',
  'HSA',
  'gastroenterology'
];

class CRCNewsFeedService {
  private readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

  constructor() {
    // RSS parsing will be handled server-side in production
  }

  /**
   * Check if article content contains CRC-related keywords
   */
  private containsCRCKeywords(text: string): boolean {
    const lowerText = text.toLowerCase();
    return CRC_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
  }

  /**
   * Clean HTML content and extract text
   */
  private cleanHtmlContent(html: string): string {
    if (!html) return '';
    
    // Remove HTML tags
    const textContent = html.replace(/<[^>]*>/g, '');
    
    // Decode HTML entities
    const div = document.createElement('div');
    div.innerHTML = textContent;
    const cleaned = div.textContent || div.innerText || '';
    
    return cleaned.trim().substring(0, 500);
  }

  /**
   * Generate simple summary from article content (no AI hallucinations)
   */
  private generateSimpleSummary(title: string, content: string, source: string): string {
    if (!content || content.length < 50) {
      return `${title} - Read the full article from ${source} for complete details.`;
    }
    
    // Extract first meaningful sentence or paragraph
    const sentences = content.split(/[.!?]+/);
    const firstSentence = sentences[0]?.trim();
    
    if (firstSentence && firstSentence.length > 20) {
      return `${firstSentence}. Read the full article from ${source} for complete details.`;
    }
    
    // Fallback to first 150 characters
    const excerpt = content.substring(0, 150).trim();
    return `${excerpt}... Read the full article from ${source} for complete details.`;
  }

  /**
   * Fetch and parse RSS feed from a single source using CORS proxy
   */
  private async fetchRSSFeed(feedSource: RSSFeed): Promise<NewsArticle[]> {
    try {
      console.log(`Fetching real RSS feed from: ${feedSource.source}`);
      
      // Use RSS2JSON CORS proxy service
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedSource.url)}&count=10`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status !== 'ok') {
        throw new Error(`RSS2JSON error: ${data.message}`);
      }

      const articles: NewsArticle[] = [];
      
      for (const item of data.items || []) {
        if (!item.title || !item.link) continue;
        
        // Filter for CRC-related articles
        const content = item.description || item.content || '';
        const searchText = `${item.title} ${content}`.toLowerCase();
        
        if (!this.containsCRCKeywords(searchText)) continue;
        
        // Clean up the content for summary
        const cleanContent = this.cleanHtmlContent(content);
        const summary = this.generateSimpleSummary(item.title, cleanContent, feedSource.source);
        
        articles.push({
          title: item.title,
          published: item.pubDate || new Date().toISOString(),
          source: feedSource.source,
          summary,
          url: item.link,
          content: cleanContent
        });
      }
      
      console.log(`Found ${articles.length} CRC articles from ${feedSource.source}`);
      return articles;
    } catch (error) {
      console.error(`Error fetching RSS from ${feedSource.source}:`, error);
      return [];
    }
  }

  /**
   * Fetch CRC news from all RSS sources
   */
  async fetchCRCNews(): Promise<NewsArticle[]> {
    console.log('Starting CRC news fetch from multiple sources...');
    
    const allArticles: NewsArticle[] = [];
    
    // Fetch from all sources in parallel (but with controlled concurrency)
    const fetchPromises = RSS_SOURCES.map(source => this.fetchRSSFeed(source));
    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      } else {
        console.error(`Failed to fetch from ${RSS_SOURCES[index].source}:`, result.reason);
      }
    });

    // Remove duplicates based on title similarity
    const uniqueArticles = this.removeDuplicates(allArticles);
    
    // Sort by date (newest first)
    uniqueArticles.sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
    
    console.log(`Total unique CRC articles found: ${uniqueArticles.length}`);
    return uniqueArticles.slice(0, 20); // Limit to 20 most recent
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  private removeDuplicates(articles: NewsArticle[]): NewsArticle[] {
    const unique: NewsArticle[] = [];
    const seenTitles = new Set<string>();

    for (const article of articles) {
      const normalizedTitle = article.title.toLowerCase().replace(/[^\w\s]/g, '').trim();
      
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        unique.push(article);
      }
    }

    return unique;
  }
}

// Singleton instance
const crcNewsService = new CRCNewsFeedService();

/**
 * Main API function to fetch CRC news
 */
export async function fetchCRCNews(): Promise<NewsArticle[]> {
  try {
    return await crcNewsService.fetchCRCNews();
  } catch (error) {
    console.error('Error in fetchCRCNews:', error);
    return [];
  }
}

/**
 * Fallback news data when RSS feeds are unavailable
 */
export const mockCRCNews: NewsArticle[] = [
  {
    title: "No recent CRC articles available",
    published: new Date().toISOString(),
    source: "System",
    summary: "Unable to fetch recent colorectal cancer news at this time. Please check back later or visit trusted medical news sources directly.",
    url: "#"
  }
];

export default crcNewsService;