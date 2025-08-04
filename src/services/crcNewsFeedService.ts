// src/services/crcNewsFeedService.ts
import { supabase } from '../supabase';

export interface CRCNewsArticle {
  id?: string;
  title: string;
  source: string;
  link: string;
  summary?: string;
  date_published: string;
  relevance_score?: number;
  is_sticky?: boolean;
  sticky_priority?: number;
  created_at?: string;
}

// RSS Feed sources for CRC news
const RSS_SOURCES = [
  {
    name: 'Google News CRC',
    url: 'https://news.google.com/rss/search?q=colorectal+cancer+screening',
    source: 'Google News'
  },
  {
    name: 'PubMed CRC',
    url: 'https://pubmed.ncbi.nlm.nih.gov/rss/search/1wGl4Q5T2VjMlqqx4keMKlZv8FGI_Ll9YyBFxT_fN5Y7yKCqO7/?limit=15&utm_campaign=pubmed-2&fc=20230101-20251231',
    source: 'PubMed'
  }
];

// Keywords for relevance scoring and filtering
const HIGH_RELEVANCE_KEYWORDS = [
  'singapore', 'asia pacific', 'asian', 'screening program', 'early detection',
  'kaiser permanente', 'rand study', 'mortality reduction', 'cost effective',
  'health economics', 'policy', 'guideline', 'hsa', 'ministry of health'
];

const MEDIUM_RELEVANCE_KEYWORDS = [
  'colorectal cancer', 'colon cancer', 'screening', 'colonoscopy', 'polyp',
  'fit test', 'blood test', 'prevention', 'biomarker', 'clinical trial'
];

const EXCLUSION_KEYWORDS = [
  'recipe', 'diet only', 'lifestyle blog', 'advertisement', 'supplement',
  'unproven', 'alternative medicine', 'celebrity'
];

class CRCNewsFeedService {
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  /**
   * Calculate relevance score based on content analysis
   */
  private calculateRelevanceScore(title: string, content: string): number {
    const text = `${title} ${content}`.toLowerCase();
    let score = 5; // Base score

    // Check for exclusions first
    if (EXCLUSION_KEYWORDS.some(keyword => text.includes(keyword.toLowerCase()))) {
      return 1;
    }

    // High relevance keywords
    const highMatches = HIGH_RELEVANCE_KEYWORDS.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
    score += highMatches * 2;

    // Medium relevance keywords
    const mediumMatches = MEDIUM_RELEVANCE_KEYWORDS.filter(keyword => 
      text.includes(keyword.toLowerCase())
    ).length;
    score += mediumMatches * 1;

    // Cap at 10
    return Math.min(score, 10);
  }

  /**
   * Generate AI summary and relevance score using OpenAI
   */
  private async generateAISummary(title: string, content: string): Promise<{
    summary: string;
    relevance_score: number;
  }> {
    if (!this.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback scoring');
      return {
        summary: `${title.substring(0, 200)}...`,
        relevance_score: this.calculateRelevanceScore(title, content)
      };
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
              content: `You are a medical news analyst specializing in colorectal cancer (CRC) research and screening. 

Your task is to:
1. Create a concise 2-4 line summary that captures the key clinical insights and implications
2. Score the article's relevance to CRC screening/prevention (1-10 scale)

Scoring criteria:
- 9-10: Major breakthroughs, policy changes, Singapore/APAC relevance, major studies (Kaiser Permanente, RAND)
- 7-8: Significant clinical findings, new screening methods, mortality data
- 5-6: General CRC research, routine clinical updates
- 3-4: Tangentially related, limited clinical relevance  
- 1-2: Not medically relevant, lifestyle content only

Respond in JSON format: {"summary": "...", "relevance_score": X}`
            },
            {
              role: 'user',
              content: `Title: ${title}\n\nContent: ${content.substring(0, 1500)}`
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const result = JSON.parse(data.choices[0]?.message?.content || '{}');
      
      return {
        summary: result.summary || `${title.substring(0, 200)}...`,
        relevance_score: Math.max(1, Math.min(10, result.relevance_score || 5))
      };
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return {
        summary: `${title.substring(0, 200)}...`,
        relevance_score: this.calculateRelevanceScore(title, content)
      };
    }
  }

  /**
   * Parse RSS feed using a CORS proxy
   */
  private async fetchRSSFeed(feedUrl: string, source: string): Promise<CRCNewsArticle[]> {
    try {
      // Use a CORS proxy service for RSS fetching
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}&api_key=YOUR_RSS2JSON_KEY&count=20`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const articles: CRCNewsArticle[] = [];

      for (const item of data.items || []) {
        if (!item.title || !item.link) continue;

        // Check if article is CRC-related
        const content = item.description || item.contentSnippet || '';
        const searchText = `${item.title} ${content}`;
        
        if (!this.containsCRCKeywords(searchText)) continue;

        // Generate AI summary and relevance score
        const { summary, relevance_score } = await this.generateAISummary(
          item.title,
          content
        );

        // Only include articles with relevance score >= 4
        if (relevance_score < 4) continue;

        articles.push({
          title: item.title,
          source,
          link: item.link,
          summary,
          date_published: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          relevance_score,
          is_sticky: relevance_score >= 9, // Auto-flag high relevance articles
          sticky_priority: relevance_score >= 9 ? 1 : 999
        });

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      return articles;
    } catch (error) {
      console.error(`Error fetching RSS from ${source}:`, error);
      return [];
    }
  }

  /**
   * Check if content contains CRC-related keywords
   */
  private containsCRCKeywords(text: string): boolean {
    const lowerText = text.toLowerCase();
    const crcKeywords = [...HIGH_RELEVANCE_KEYWORDS, ...MEDIUM_RELEVANCE_KEYWORDS];
    return crcKeywords.some(keyword => lowerText.includes(keyword.toLowerCase()));
  }

  /**
   * Fetch and store new articles from all RSS sources
   */
  async fetchAndStoreNews(): Promise<void> {
    console.log('Starting CRC news fetch from RSS sources...');
    
    const allArticles: CRCNewsArticle[] = [];
    
    // Fetch from all sources
    for (const source of RSS_SOURCES) {
      try {
        const articles = await this.fetchRSSFeed(source.url, source.source);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to fetch from ${source.source}:`, error);
      }
    }

    // Remove duplicates based on title similarity
    const uniqueArticles = this.removeDuplicates(allArticles);
    
    console.log(`Found ${uniqueArticles.length} unique articles to process`);

    // Store articles in Supabase
    for (const article of uniqueArticles) {
      try {
        // Check if article already exists
        const { data: existing } = await supabase
          .from('crc_news_feed')
          .select('id')
          .eq('link', article.link)
          .single();

        if (!existing) {
          const { error } = await supabase
            .from('crc_news_feed')
            .insert([article]);

          if (error) {
            console.error('Error inserting article:', error);
          } else {
            console.log(`Stored: ${article.title}`);
          }
        }
      } catch (error) {
        console.error('Error processing article:', error);
      }
    }

    console.log('CRC news fetch completed');
  }

  /**
   * Remove duplicate articles based on title similarity
   */
  private removeDuplicates(articles: CRCNewsArticle[]): CRCNewsArticle[] {
    const unique: CRCNewsArticle[] = [];
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

  /**
   * Fetch articles from Supabase with proper ordering
   */
  async getNewsArticles(limit = 50): Promise<CRCNewsArticle[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_crc_news_feed', { limit_count: limit });

      if (error) {
        console.error('Error fetching news articles:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNewsArticles:', error);
      return [];
    }
  }

  /**
   * Mark article as sticky with priority
   */
  async setArticleSticky(articleId: string, isSticky = true, priority = 1): Promise<void> {
    try {
      const { error } = await supabase
        .rpc('set_article_sticky', {
          article_id: articleId,
          sticky: isSticky,
          priority
        });

      if (error) {
        console.error('Error setting article sticky:', error);
      }
    } catch (error) {
      console.error('Error in setArticleSticky:', error);
    }
  }
}

// Export singleton instance
export const crcNewsFeedService = new CRCNewsFeedService();

// Mock data for development
export const mockCRCNews: CRCNewsArticle[] = [
  {
    id: '1',
    title: 'Kaiser Permanente Study: CRC Screening Saves 26 Lives Per 1,000 Screened',
    source: 'Kaiser Permanente',
    link: 'https://about.kaiserpermanente.org/news/kaiser-permanente-study-crc-screening',
    summary: 'Landmark 20-year study of 1.2 million participants shows systematic colorectal cancer screening prevents 26 deaths per 1,000 people screened. The study validates current screening guidelines and demonstrates significant mortality reduction through early detection programs.',
    date_published: '2025-08-03T10:00:00Z',
    relevance_score: 10,
    is_sticky: true,
    sticky_priority: 1,
    created_at: '2025-08-04T06:00:00Z'
  },
  {
    id: '2',
    title: 'Singapore Ministry of Health Expands CRC Screening to Age 40-44',
    source: 'Straits Times',
    link: 'https://www.straitstimes.com/singapore/health/moh-expands-crc-screening',
    summary: 'Following rising early-onset colorectal cancer rates, Singapore will pilot expanded screening for adults aged 40-44 starting January 2026. The program includes subsidized FIT tests and priority colonoscopy access, targeting a 70% participation rate.',
    date_published: '2025-08-02T14:30:00Z',
    relevance_score: 9,
    is_sticky: true,
    sticky_priority: 2,
    created_at: '2025-08-04T07:00:00Z'
  },
  {
    id: '3',
    title: 'Blood-Based CRC Test Achieves 94% Sensitivity in Multi-Center Trial',
    source: 'NEJM',
    link: 'https://www.nejm.org/doi/full/10.1056/NEJMoa2025042',
    summary: 'The Shield™ blood test demonstrated 94% sensitivity for colorectal cancer detection and 89% sensitivity for advanced adenomas in a 45,000-participant study. This non-invasive screening option could significantly improve participation rates among screening-hesitant populations.',
    date_published: '2025-08-01T09:15:00Z',
    relevance_score: 8,
    is_sticky: false,
    sticky_priority: 999,
    created_at: '2025-08-04T08:00:00Z'
  }
];