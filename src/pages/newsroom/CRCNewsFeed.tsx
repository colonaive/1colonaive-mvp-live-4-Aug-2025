// src/pages/newsroom/CRCNewsFeed.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search, ExternalLink, Calendar, Building2, Sparkles, RefreshCw, Filter } from 'lucide-react';
import { fetchCRCNews, mockCRCNews } from '../../api/feeds/crc-news';

interface NewsArticle {
  title: string;
  published: string;
  source: string;
  summary: string;
  url: string;
  content?: string;
}

const CRCNewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load news articles on component mount
  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Try to fetch live news, fallback to mock data
      let newsData: NewsArticle[] = [];
      
      try {
        newsData = await fetchCRCNews();
        if (newsData.length === 0) {
          // Fallback to mock data if no articles found
          newsData = mockCRCNews;
        }
      } catch (fetchError) {
        console.warn('Failed to fetch live news, using mock data:', fetchError);
        newsData = mockCRCNews;
      }

      setArticles(newsData);
    } catch (err) {
      console.error('Error loading news:', err);
      setError('Failed to load news articles. Please try again later.');
      setArticles(mockCRCNews); // Always fallback to mock data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Get unique sources for filter dropdown
  const availableSources = useMemo(() => {
    const sources = Array.from(new Set(articles.map(article => article.source)));
    return sources.sort();
  }, [articles]);

  // Filter articles based on search term and selected source
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSource = selectedSource === '' || article.source === selectedSource;
      
      return matchesSearch && matchesSource;
    });
  }, [articles, searchTerm, selectedSource]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getSourceColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'NEJM': 'bg-blue-100 text-blue-800',
      'JAMA': 'bg-green-100 text-green-800',
      'PubMed': 'bg-purple-100 text-purple-800',
      'Reuters Health': 'bg-orange-100 text-orange-800',
      'Straits Times': 'bg-red-100 text-red-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Dark Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold">📰 CRC News Watch</h1>
              <Sparkles className="h-8 w-8 text-blue-400 ml-3" />
            </div>
            <p className="text-xl text-blue-100 mb-2">Powered by AI</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Stay informed with the latest colorectal cancer research, screening developments, 
              and clinical breakthroughs from trusted medical sources worldwide.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-blue-200">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {availableSources.length} Sources
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {articles.length} Articles
              </div>
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 mr-1" />
                AI Summarized
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles by title or content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Source Filter */}
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[140px]"
                >
                  <option value="">All Sources</option>
                  {availableSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* Refresh Button */}
              <Button 
                onClick={() => loadNews(true)}
                disabled={refreshing}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {/* Results Count */}
            <p className="text-gray-600 mt-4 text-center">
              {loading ? 'Loading articles...' : `Showing ${filteredArticles.length} of ${articles.length} articles`}
            </p>
          </div>
        </Container>
      </section>

      {/* Articles Section */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      {/* Article Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                              {article.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(article.source)}`}>
                                {article.source}
                              </span>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(article.published)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <Sparkles className="h-4 w-4 text-blue-500 mr-1" />
                          <span className="text-sm font-medium text-blue-700">AI Summary</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border-l-4 border-blue-200">
                          {article.summary}
                        </p>
                      </div>

                      {/* External Link */}
                      <div className="flex justify-end">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Read Full Article
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or clearing the filters.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedSource('');
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </section>

      {/* Footer Info */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Data Sources:</strong> PubMed, NEJM, JAMA, Reuters Health, Straits Times Health
            </p>
            <p className="text-xs text-gray-500">
              Articles are automatically curated and summarized using AI. Summaries are for informational purposes only 
              and should not replace professional medical advice. Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CRCNewsFeed;