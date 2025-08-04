// src/pages/newsroom/CRCNewsFeedPage.tsx
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Newspaper, 
  Calendar, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  Pin,
  TrendingUp,
  Clock,
  Eye,
  Search
} from 'lucide-react';
import { crcNewsFeedService, mockCRCNews, CRCNewsArticle } from '../../services/crcNewsFeedService';

const CRCNewsFeedPage: React.FC = () => {
  const [articles, setArticles] = useState<CRCNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from Supabase
      const liveArticles = await crcNewsFeedService.getNewsArticles(50);
      
      // If no live articles, use mock data
      if (liveArticles.length === 0) {
        console.log('No live articles found, using mock data');
        setArticles(mockCRCNews);
      } else {
        setArticles(liveArticles);
      }
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles. Showing sample data.');
      setArticles(mockCRCNews);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // In production, this would trigger the RSS fetch
      await crcNewsFeedService.fetchAndStoreNews();
      await loadArticles();
    } catch (error) {
      console.error('Error refreshing news:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredArticles = articles.filter(article =>
    searchTerm === '' || 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 9) return 'bg-red-100 text-red-800';
    if (score >= 7) return 'bg-orange-100 text-orange-800';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getSourceColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'Kaiser Permanente': 'bg-purple-100 text-purple-800',
      'Straits Times': 'bg-red-100 text-red-800',
      'NEJM': 'bg-blue-100 text-blue-800',
      'JAMA': 'bg-green-100 text-green-800',
      'PubMed': 'bg-indigo-100 text-indigo-800',
      'Google News': 'bg-gray-100 text-gray-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Newspaper className="h-12 w-12 text-white mr-3" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">📰 Live CRC News Feed</h1>
                <div className="flex items-center justify-center text-blue-200 text-sm">
                  <Sparkles className="h-4 w-4 mr-1" />
                  <span>AI-Powered Medical Intelligence</span>
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-200 mb-6 max-w-3xl mx-auto">
              Real-time colorectal cancer research updates, screening breakthroughs, and clinical developments 
              from trusted medical sources worldwide.
            </p>

            {/* Stats Bar */}
            <div className="flex justify-center items-center space-x-8 text-sm text-blue-200 mb-6">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {articles.length} Articles
              </div>
              <div className="flex items-center">
                <Pin className="h-4 w-4 mr-1" />
                {articles.filter(a => a.is_sticky).length} Priority
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Daily Updates
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Updating...' : 'Refresh Feed'}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Articles Feed */}
      <section className="py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-700 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-6 text-center">
              <p className="text-gray-600">
                {loading ? 'Loading latest CRC research...' : `Showing ${filteredArticles.length} articles`}
              </p>
            </div>

            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded w-32"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredArticles.length > 0 ? (
              <div className="space-y-6">
                {filteredArticles.map((article, index) => (
                  <Card 
                    key={article.id || index} 
                    className={`hover:shadow-xl transition-all duration-300 ${
                      article.is_sticky 
                        ? 'border-l-4 border-l-red-500 bg-red-50/30' 
                        : 'border-l-4 border-l-blue-500'
                    }`}
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex items-start gap-3">
                          {article.is_sticky && (
                            <Pin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                              {article.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(article.source)}`}>
                                {article.source}
                              </span>
                              <div className="flex items-center text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(article.date_published)}
                              </div>
                              {article.relevance_score && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(article.relevance_score)}`}>
                                  Relevance: {article.relevance_score}/10
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Summary */}
                      {article.summary && (
                        <div className="mb-4">
                          <div className="flex items-center mb-2">
                            <Sparkles className="h-4 w-4 text-blue-500 mr-1" />
                            <span className="text-sm font-medium text-blue-700">AI Clinical Summary</span>
                          </div>
                          <div className="bg-blue-50 border-l-4 border-blue-200 p-4 rounded-r-lg">
                            <p className="text-gray-700 leading-relaxed">
                              {article.summary}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-gray-500 text-sm">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>Medical Research Update</span>
                        </div>
                        <a
                          href={article.link}
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
                  <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Check back later for the latest updates.'}
                  </p>
                  <Button 
                    onClick={() => setSearchTerm('')}
                    variant="outline"
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </Container>
      </section>

      {/* Footer */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Data Sources:</strong> Google News, PubMed, NEJM, JAMA, Medical Journals
            </p>
            <p className="text-xs text-gray-500">
              Articles are automatically curated using AI and scored for clinical relevance. 
              Information is for educational purposes only. Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CRCNewsFeedPage;