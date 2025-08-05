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

// Whitelisted sources for quality control
const TRUSTED_SOURCES = [
  'pubmed', 'nejm', 'jama', 'lancet', 'bmj', 'nature medicine',
  'journal of clinical oncology', 'gastroenterology', 'annals of internal medicine',
  'kaiser permanente', 'mayo clinic', 'cleveland clinic', 'johns hopkins',
  'straits times', 'channelnewsasia', 'today online', 'ministry of health singapore',
  'reuters health', 'associated press', 'healthline', 'webmd', 'medscape',
  'world health organization', 'cdc', 'american cancer society', 'national cancer institute'
];

// Interface for skipped articles logging
interface SkippedArticle {
  title?: string;
  link?: string;
  source: string;
  reason: string;
  timestamp: string;
  raw_content?: string;
}

class CRCNewsFeedService {
  private readonly OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  private skippedArticles: SkippedArticle[] = [];

  /**
   * Validate article URL integrity
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validate if source is from trusted medical/news outlets
   */
  private isTrustedSource(source: string): boolean {
    const lowerSource = source.toLowerCase();
    return TRUSTED_SOURCES.some(trusted => 
      lowerSource.includes(trusted.toLowerCase()) || 
      trusted.toLowerCase().includes(lowerSource)
    );
  }

  /**
   * Validate article has minimum required fields
   */
  private validateArticleIntegrity(item: any, feedSource: string): { isValid: boolean; reason?: string } {
    // Check for valid title
    if (!item.title || item.title.trim().length < 10) {
      return { isValid: false, reason: 'Missing or too short title' };
    }

    // Check for valid link
    if (!item.link || !this.isValidUrl(item.link)) {
      return { isValid: false, reason: 'Missing or invalid URL' };
    }

    // Check for publication date
    if (!item.pubDate && !item.published) {
      return { isValid: false, reason: 'Missing publication date' };
    }

    // Check if source is trusted (warning level, not blocking)
    if (!this.isTrustedSource(feedSource)) {
      console.warn(`Article from untrusted source: ${feedSource}`);
    }

    // Check for minimum content
    const content = item.contentSnippet || item.description || item.content || '';
    if (content.trim().length < 50) {
      return { isValid: false, reason: 'Insufficient content for analysis' };
    }

    return { isValid: true };
  }

  /**
   * Log skipped articles for admin review
   */
  private logSkippedArticle(item: any, feedSource: string, reason: string): void {
    const skipped: SkippedArticle = {
      title: item.title || 'No title',
      link: item.link || 'No link',
      source: feedSource,
      reason,
      timestamp: new Date().toISOString(),
      raw_content: JSON.stringify(item).substring(0, 500)
    };
    
    this.skippedArticles.push(skipped);
    console.log(`[SKIPPED ARTICLE] ${reason}: ${skipped.title} from ${feedSource}`);
    
    // In production, this would also log to a database table or monitoring service
    this.saveSkippedArticleToDatabase(skipped);
  }

  /**
   * Save skipped articles to database for admin review
   */
  private async saveSkippedArticleToDatabase(skipped: SkippedArticle): Promise<void> {
    try {
      // In production, save to a dedicated skipped_articles table
      const { error } = await supabase
        .from('crc_news_skipped')
        .insert([{
          title: skipped.title,
          link: skipped.link,
          source: skipped.source,
          skip_reason: skipped.reason,
          raw_content: skipped.raw_content,
          created_at: skipped.timestamp
        }]);

      if (error && !error.message.includes('relation "crc_news_skipped" does not exist')) {
        console.error('Error logging skipped article:', error);
      }
    } catch (error) {
      // Silently fail if table doesn't exist yet
      console.warn('Skipped articles logging unavailable:', error);
    }
  }

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
   * Generate excerpt from original article content (NO AI GENERATION)
   */
  private generateArticleExcerpt(title: string, content: string, source: string): {
    summary: string;
    relevance_score: number;
  } {
    // Extract first meaningful sentences from original content only
    const cleanContent = this.cleanHtmlContent(content);
    
    if (!cleanContent || cleanContent.length < 50) {
      return {
        summary: `Read the full article from ${source} for complete details.`,
        relevance_score: this.calculateRelevanceScore(title, content)
      };
    }
    
    // Get first 1-2 sentences from original article
    const sentences = cleanContent.split(/[.!?]+/);
    const firstSentences = sentences.slice(0, 2).join('. ').trim();
    
    const excerpt = firstSentences.length > 20 
      ? `${firstSentences}. Read the full article from ${source} for complete details.`
      : `${cleanContent.substring(0, 200)}... Read the full article from ${source} for complete details.`;
    
    return {
      summary: excerpt,
      relevance_score: this.calculateRelevanceScore(title, content)
    };
  }

  /**
   * Check if summary contains statistics not present in original content
   */
  private containsSuspiciousStatistics(summary: string, originalContent: string): boolean {
    // Extract percentages and numbers from summary
    const summaryNumbers = summary.match(/\d+%|\d+\.\d+%|\d+\s*lives?\s*saved|\d+\s*sensitivity|\d+\s*specificity/gi) || [];
    
    if (summaryNumbers.length === 0) return false;
    
    // Check if these numbers appear in original content
    return summaryNumbers.some(num => {
      const cleanNum = num.replace(/[^\d.%]/g, '');
      return !originalContent.toLowerCase().includes(cleanNum.toLowerCase());
    });
  }

  /**
   * Generate fallback summary without AI when accuracy is questionable
   */
  private generateFallbackSummary(title: string, content: string, source: string): string {
    const firstSentence = content.split('.')[0]?.trim() || title;
    return `According to ${source}, ${firstSentence.toLowerCase()}. This research contributes to ongoing efforts in colorectal cancer screening and detection.`;
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

        // Validate article integrity before processing
        const validation = this.validateArticleIntegrity(item, source);
        if (!validation.isValid) {
          this.logSkippedArticle(item, source, validation.reason!);
          continue;
        }

        // Generate excerpt from original article content (NO AI GENERATION)
        const { summary, relevance_score } = this.generateArticleExcerpt(
          item.title,
          content,
          source
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

  /**
   * Get skipped articles for admin review
   */
  async getSkippedArticles(limit = 50): Promise<SkippedArticle[]> {
    try {
      const { data, error } = await supabase
        .from('crc_news_skipped')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching skipped articles:', error);
        return this.skippedArticles.slice(-limit); // Return in-memory fallback
      }

      return data.map(item => ({
        title: item.title,
        link: item.link,
        source: item.source,
        reason: item.skip_reason,
        timestamp: item.created_at,
        raw_content: item.raw_content
      }));
    } catch (error) {
      console.error('Error in getSkippedArticles:', error);
      return this.skippedArticles.slice(-limit); // Return in-memory fallback
    }
  }

  /**
   * Get feed quality metrics for admin dashboard
   */
  async getFeedQualityMetrics(): Promise<{
    total_processed: number;
    total_accepted: number;
    total_skipped: number;
    skip_reasons: { [key: string]: number };
    accuracy_score: number;
  }> {
    try {
      const [articlesResult, skippedResult] = await Promise.all([
        supabase.from('crc_news_feed').select('id', { count: 'exact' }),
        supabase.from('crc_news_skipped').select('skip_reason', { count: 'exact' })
      ]);

      const totalAccepted = articlesResult.count || 0;
      const totalSkipped = skippedResult.count || 0;
      const totalProcessed = totalAccepted + totalSkipped;

      // Count skip reasons
      const skipReasons: { [key: string]: number } = {};
      if (skippedResult.data) {
        skippedResult.data.forEach(item => {
          const reason = item.skip_reason || 'Unknown';
          skipReasons[reason] = (skipReasons[reason] || 0) + 1;
        });
      }

      // Calculate accuracy score (percentage of articles that passed validation)
      const accuracyScore = totalProcessed > 0 ? (totalAccepted / totalProcessed) * 100 : 100;

      return {
        total_processed: totalProcessed,
        total_accepted: totalAccepted,
        total_skipped: totalSkipped,
        skip_reasons: skipReasons,
        accuracy_score: accuracyScore
      };
    } catch (error) {
      console.error('Error calculating feed quality metrics:', error);
      return {
        total_processed: 0,
        total_accepted: 0,
        total_skipped: 0,
        skip_reasons: {},
        accuracy_score: 0
      };
    }
  }
}

// Export singleton instance
export const crcNewsFeedService = new CRCNewsFeedService();

// REMOVED: All AI-generated mock data with hallucinated statistics
// This service now only returns real articles from verified RSS sources
export const mockCRCNews: CRCNewsArticle[] = [];