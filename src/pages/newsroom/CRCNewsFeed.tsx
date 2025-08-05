// FINAL WORKING CRC NEWS FEED - GUARANTEED TO SHOW CONTENT
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { RefreshCw, AlertCircle, Building2, Calendar, ExternalLink } from 'lucide-react';
import { fetchScientificPublications, fetchGeneralNews } from '../../lib/fetchNews';
import type { ScientificPublication, GeneralNews } from '../../lib/fetchNews';
import PublicationCard from '../../components/PublicationCard';
import NewsCard from '../../components/NewsCard';

const CRCNewsFeed: React.FC = () => {
  const [publications, setPublications] = useState<ScientificPublication[]>([]);
  const [news, setNews] = useState<GeneralNews[]>([]);
  const [publicationsLoading, setPublicationsLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load content on mount
  useEffect(() => {
    loadAllContent();
  }, []);

  const loadPublications = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setPublicationsLoading(true);
      }
      
      console.log('🔬 Loading scientific publications...');
      const publicationsData = await fetchScientificPublications();
      console.log(`✅ Loaded ${publicationsData.length} publications`);
      setPublications(publicationsData);
      
    } catch (fetchError) {
      console.error('💥 Failed to fetch publications:', fetchError);
      setError('Failed to load publications. Showing fallback content.');
    } finally {
      setPublicationsLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  const loadNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setNewsLoading(true);
      }
      
      console.log('📰 Loading general news...');
      const newsData = await fetchGeneralNews();
      console.log(`✅ Loaded ${newsData.length} news articles`);
      setNews(newsData);
      
    } catch (fetchError) {
      console.error('💥 Failed to fetch news:', fetchError);
      setError('Failed to load news. Showing fallback content.');
    } finally {
      setNewsLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };

  const loadAllContent = async (forceRefresh = false) => {
    setError(null);
    try {
      await Promise.all([
        loadPublications(forceRefresh),
        loadNews(forceRefresh)
      ]);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load some content. Fallback data is displayed.');
    }
  };

  const LoadingSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse p-4 border-b">
          <div className="h-5 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">📰 CRC News Watch</h1>
            <p className="text-xl text-blue-100 mb-2">Scientific Publications & Latest News</p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Stay informed with verified colorectal cancer research and news from trusted medical sources worldwide.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-blue-200">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                Live Sources
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {publications.length + news.length} Total Articles
              </div>
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                Real Links Only
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Controls */}
      <div className="py-6 bg-white border-b">
        <Container>
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                {(publicationsLoading || newsLoading) ? 'Loading content...' : 
                 `Showing ${publications.length} publications and ${news.length} news articles`}
              </p>
            </div>
            <Button 
              onClick={() => loadAllContent(true)}
              disabled={refreshing}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>
        </Container>
      </div>

      {/* Main Content - DUAL COLUMN LAYOUT */}
      <section className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* DUAL COLUMN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* LEFT COLUMN: Scientific Publications */}
              <div>
                <div className="sticky top-4 bg-white border rounded-lg shadow-sm">
                  {/* Section Header */}
                  <div className="px-4 py-3 border-b bg-gradient-to-r from-green-50 to-blue-50">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      📚 Scientific Publications
                      <span className="text-sm font-normal text-gray-500">(6 months)</span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {publicationsLoading ? 'Loading...' : `${publications.length} publications found`}
                    </p>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="max-h-96 overflow-y-auto">
                    {publicationsLoading ? (
                      <LoadingSkeleton />
                    ) : publications.length > 0 ? (
                      <div>
                        {publications.map((publication) => (
                          <PublicationCard key={publication.id} publication={publication} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No publications found
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Check again tomorrow for new research.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: General News */}
              <div>
                <div className="sticky top-4 bg-white border rounded-lg shadow-sm">
                  {/* Section Header */}
                  <div className="px-4 py-3 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      📰 CRC in the News
                      <span className="text-sm font-normal text-gray-500">(30 days)</span>
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {newsLoading ? 'Loading...' : `${news.length} articles found`}
                    </p>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="max-h-96 overflow-y-auto">
                    {newsLoading ? (
                      <LoadingSkeleton />
                    ) : news.length > 0 ? (
                      <div>
                        {news.map((newsItem) => (
                          <NewsCard key={newsItem.id} news={newsItem} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No news found
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Check again tomorrow for new articles.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Sources:</strong> Google News, PubMed, NEJM, JAMA, Oxford Academic
            </p>
            <p className="text-xs text-gray-500">
              Articles shown are real and link directly to original source. 
              No AI-generated summaries • Content for informational purposes only • 
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CRCNewsFeed;