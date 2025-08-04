// src/api/feeds/crc-news.ts
// Note: RSS parsing will need to be done server-side or via CORS proxy
// For now, we'll use mock data and provide architecture for server-side implementation

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

// Trusted medical RSS sources
const RSS_SOURCES: RSSFeed[] = [
  {
    name: 'PubMed Recent Articles',
    url: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1wGl4Q5T2VjMlqqx4keMKlZv8FGI_Ll9YyBFxT_fN5Y7yKCqO7/?limit=15&utm_campaign=pubmed-2&fc=20230101-20251231',
    source: 'PubMed'
  },
  {
    name: 'NEJM Latest Articles',
    url: 'https://www.nejm.org/action/showFeed?type=etoc&feed=rss',
    source: 'NEJM'
  },
  {
    name: 'JAMA Network',
    url: 'https://jamanetwork.com/rss/site_8/169.xml',
    source: 'JAMA'
  },
  {
    name: 'Reuters Health News',
    url: 'https://www.reuters.com/pf/rss/life-health/',
    source: 'Reuters Health'
  },
  {
    name: 'Straits Times Health',
    url: 'https://www.straitstimes.com/news/health/rss.xml',
    source: 'Straits Times'
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
   * Generate AI summary using OpenAI GPT-4
   */
  private async generateAISummary(title: string, content: string): Promise<string> {
    if (!this.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback summary');
      return `${title} - Recent research and developments in colorectal cancer screening and detection.`;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: `You are a medical news summarizer specializing in colorectal cancer (CRC) research. Create concise, insightful summaries that capture the main findings and their clinical significance. Always end with why this matters for CRC prevention, screening, or treatment.`
            },
            {
              role: 'user',
              content: `Summarize this medical article in 3-5 sentences, focusing on the key insights and clinical relevance for colorectal cancer:

Title: ${title}

Content: ${content.substring(0, 2000)}...

The summary should:
1. Capture the main research finding or clinical development
2. Explain why it matters for patients or healthcare providers
3. End with a compelling hook about its potential impact on CRC care`
            }
          ],
          max_tokens: 200,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Summary generation failed.';
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return `${title} - Important developments in colorectal cancer research with potential implications for screening and treatment protocols.`;
    }
  }

  /**
   * Fetch and parse RSS feed from a single source
   * Note: This should be implemented as a server-side function (Supabase Edge Function, etc.)
   */
  private async fetchRSSFeed(feedSource: RSSFeed): Promise<NewsArticle[]> {
    try {
      console.log(`RSS fetching would be done server-side for: ${feedSource.source}`);
      
      // In production, this would call a server-side endpoint like:
      // const response = await fetch('/api/rss-feeds', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ feedUrl: feedSource.url, source: feedSource.source })
      // });
      // return response.json();
      
      // For now, return empty array to fallback to mock data
      return [];
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
 * Mock data for development/testing
 */
export const mockCRCNews: NewsArticle[] = [
  {
    title: "Singapore Expands CRC Screening to Adults Aged 40–44",
    published: "2025-08-05",
    source: "Straits Times",
    summary: "Singapore's Ministry of Health will launch a pilot colorectal cancer screening program for adults under 45, citing recent evidence of rising early-onset CRC rates. The initiative includes subsidized FIT tests and colonoscopy referrals for high-risk individuals. This expansion reflects global trends toward earlier screening recommendations and could serve as a model for other Asian healthcare systems.",
    url: "https://www.straitstimes.com/health/crc-screening-expansion"
  },
  {
    title: "Blood-Based CRC Screening Shows 92% Sensitivity in Clinical Trial",
    published: "2025-08-04",
    source: "NEJM",
    summary: "A multicenter trial of liquid biopsy technology demonstrated 92% sensitivity for detecting colorectal cancer and 87% sensitivity for advanced adenomas. The non-invasive test analyzes circulating tumor DNA and methylation patterns, offering an alternative to traditional screening methods. This breakthrough could significantly improve screening participation rates and early detection outcomes globally.",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2025041"
  },
  {
    title: "AI-Enhanced Colonoscopy Reduces Missed Adenoma Rate by 34%",
    published: "2025-08-03",
    source: "JAMA",
    summary: "Computer-aided detection systems using deep learning algorithms significantly improved adenoma detection rates during routine colonoscopy procedures. The technology provides real-time alerts for suspicious lesions, particularly benefiting less experienced endoscopists. Implementation of AI-assisted screening could enhance the effectiveness of existing CRC prevention programs worldwide.",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2798765"
  }
];

export default crcNewsService;