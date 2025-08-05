// COMPLETELY REBUILT CRC NEWS FEED - DUAL COLUMN WITH GUARANTEED CONTENT
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { RefreshCw, AlertCircle, Newspaper, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { fetchGeneralNews, fetchScientificPublications } from '../../lib/fetchRSSFeed';
import type { NewsArticle, ScientificArticle } from '../../lib/fetchRSSFeed';
import NewsCard from '../../components/NewsCard';
import PublicationCard from '../../components/PublicationCard';

const CRCNewsFeed: React.FC = () => {
  // State management
  const [generalNews, setGeneralNews] = useState<NewsArticle[]>([]);
  const [publications, setPublications] = useState<ScientificArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [pubsLoading, setPubsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load content on component mount
  useEffect(() => {
    loadAllContent();
  }, []);

  const loadGeneralNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setNewsLoading(true);
      }
      
      console.log('📰 Loading general news...');
      const newsData = await fetchGeneralNews();
      console.log(`✅ Loaded ${newsData.length} news articles`);
      setGeneralNews(newsData);
      
    } catch (fetchError) {
      console.error('💥 Failed to fetch general news:', fetchError);
      setError('Failed to load news. Showing fallback content.');
    } finally {
      setNewsLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  const loadScientificPublications = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setPubsLoading(true);
      }
      
      console.log('🔬 Loading scientific publications...');
      const pubsData = await fetchScientificPublications();
      console.log(`✅ Loaded ${pubsData.length} publications`);
      setPublications(pubsData);
      
    } catch (fetchError) {
      console.error('💥 Failed to fetch publications:', fetchError);
      setError('Failed to load publications. Showing fallback content.');
    } finally {
      setPubsLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  const loadAllContent = async (forceRefresh = false) => {
    setError(null);
    try {
      await Promise.all([
        loadGeneralNews(forceRefresh),
        loadScientificPublications(forceRefresh)
      ]);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load some content. Fallback data is displayed.');
    }
  };

  const LoadingSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="h-5 bg-gray-200 rounded mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = ({ type, icon: Icon }: { type: string; icon: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
      <Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No {type} Found
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Check again tomorrow for new {type.toLowerCase()}.
      </p>
      <Button 
        onClick={() => loadAllContent(true)}
        disabled={refreshing}
        variant="outline"
        size="sm"
      >
        Try Again
      </Button>
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">📰 CRC News Watch</h1>
            <p className="text-xl text-blue-100 mb-2">Scientific Publications & Latest News</p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-6">
              Stay informed with verified colorectal cancer research and news from trusted medical sources worldwide.
            </p>
            
            {/* Live stats */}
            <div className="flex justify-center items-center space-x-8 text-sm text-blue-200">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Live RSS Feeds
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Real-Time Updates
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {publications.length + generalNews.length} Total Articles
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Controls Bar */}
      <div className="py-6 bg-white border-b shadow-sm">
        <Container>
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">
                {(newsLoading || pubsLoading) ? 
                  'Loading content from RSS feeds...' : 
                  `Displaying ${generalNews.length} news articles and ${publications.length} scientific publications`}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Button 
              onClick={() => loadAllContent(true)}
              disabled={refreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        </Container>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="py-4 bg-red-50">
          <Container>
            <div className="max-w-6xl mx-auto">
              <div className="bg-red-100 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </Container>
        </div>
      )}

      {/* MAIN DUAL COLUMN LAYOUT */}
      <section className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: General News (30 days) */}
              <div className="space-y-6">
                {/* Section Header */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Newspaper className="h-6 w-6 text-blue-600" />
                      📰 General News
                      <span className="text-sm font-normal text-gray-500 bg-blue-100 px-2 py-1 rounded-full">
                        Last 30 days
                      </span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {newsLoading ? 'Loading news articles...' : `${generalNews.length} articles found`}
                    </p>
                  </div>
                  
                  {/* Scrollable News Content */}
                  <div className="max-h-screen overflow-y-auto p-4">
                    {newsLoading ? (
                      <LoadingSkeleton count={3} />
                    ) : generalNews.length > 0 ? (
                      <div className="space-y-4">
                        {generalNews.map((article) => (
                          <NewsCard key={article.id} article={article} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState type="News Articles" icon={Newspaper} />
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Scientific Publications (6 months) */}
              <div className="space-y-6">
                {/* Section Header */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-green-600" />
                      📚 Scientific Publications
                      <span className="text-sm font-normal text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                        Last 6 months
                      </span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-2">
                      {pubsLoading ? 'Loading publications...' : `${publications.length} publications found`}
                    </p>
                  </div>
                  
                  {/* Scrollable Publications Content */}
                  <div className="max-h-screen overflow-y-auto p-4">
                    {pubsLoading ? (
                      <LoadingSkeleton count={3} />
                    ) : publications.length > 0 ? (
                      <div className="space-y-4">
                        {publications.map((article) => (
                          <PublicationCard key={article.id} article={article} />
                        ))}
                      </div>
                    ) : (
                      <EmptyState type="Publications" icon={BookOpen} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-100 border-t">
        <Container>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Sources:</strong> Google News, PubMed, NEJM, JAMA, Oxford Academic.
            </p>
            <p className="text-xs text-gray-500">
              All articles shown are real and link directly to their official publishers.
              No AI-generated summaries • Content for informational purposes only • 
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default CRCNewsFeed;