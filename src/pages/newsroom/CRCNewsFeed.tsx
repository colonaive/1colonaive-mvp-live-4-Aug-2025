// WORKING CRC News Feed - Fixed implementation with proper RSS feeds
import React, { useState, useEffect, useMemo } from 'react';
import { Container } from '../../components/ui/Container';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Search, ExternalLink, Calendar, Building2, RefreshCw, Filter, AlertCircle } from 'lucide-react';
import { fetchWorkingClinicalPublications, fetchWorkingGeneralNews } from '../../api/feeds/crc-news-working';

interface NewsArticle {
  title: string;
  published: string;
  source: string;
  summary: string;
  url: string;
  type: 'clinical' | 'news';
  authors?: string;
  journal?: string;
}

const CRCNewsFeed: React.FC = () => {
  const [clinicalPublications, setClinicalPublications] = useState<NewsArticle[]>([]);
  const [generalNews, setGeneralNews] = useState<NewsArticle[]>([]);
  const [clinicalLoading, setClinicalLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load content on component mount
  useEffect(() => {
    loadAllContent();
  }, []);

  const loadClinicalPublications = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setClinicalLoading(true);
      }
      setError(null);
      
      console.log('🔬 Loading clinical publications...');
      const publications = await fetchWorkingClinicalPublications();
      console.log(`✅ Loaded ${publications.length} clinical publications`);
      setClinicalPublications(publications);
      
      if (publications.length === 0) {
        console.warn('⚠️ No clinical publications loaded - check RSS feeds');
      }
    } catch (fetchError) {
      console.error('💥 Failed to fetch clinical publications:', fetchError);
      setError('Failed to load clinical publications. Using fallback data.');
      setClinicalPublications([]);
    } finally {
      setClinicalLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };
  
  const loadGeneralNews = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setNewsLoading(true);
      }
      setError(null);
      
      console.log('📰 Loading general news...');
      const newsArticles = await fetchWorkingGeneralNews();
      console.log(`✅ Loaded ${newsArticles.length} news articles`);
      setGeneralNews(newsArticles);
      
      if (newsArticles.length === 0) {
        console.warn('⚠️ No news articles loaded - check RSS feeds');
      }
    } catch (fetchError) {
      console.error('💥 Failed to fetch general news:', fetchError);
      setError('Failed to load news articles. Using fallback data.');
      setGeneralNews([]);
    } finally {
      setNewsLoading(false);
      if (forceRefresh) setRefreshing(false);
    }
  };
  
  const loadAllContent = async (forceRefresh = false) => {
    try {
      await Promise.all([
        loadClinicalPublications(forceRefresh),
        loadGeneralNews(forceRefresh)
      ]);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load some content. Please try again later.');
    }
  };

  // Get unique sources for filter dropdown
  const availableSources = useMemo(() => {
    const allSources = [
      ...clinicalPublications.map(pub => pub.source),
      ...generalNews.map(news => news.source)
    ];
    const sources = Array.from(new Set(allSources));
    return sources.sort();
  }, [clinicalPublications, generalNews]);

  // Filter clinical publications
  const filteredClinicalPublications = useMemo(() => {
    return clinicalPublications.filter(publication => {
      const matchesSearch = searchTerm === '' || 
        publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publication.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (publication.authors && publication.authors.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSource = selectedSource === '' || publication.source === selectedSource;
      
      return matchesSearch && matchesSource;
    });
  }, [clinicalPublications, searchTerm, selectedSource]);
  
  // Filter general news
  const filteredGeneralNews = useMemo(() => {
    return generalNews.filter(news => {
      const matchesSearch = searchTerm === '' || 
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.summary.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSource = selectedSource === '' || news.source === selectedSource;
      
      return matchesSearch && matchesSource;
    });
  }, [generalNews, searchTerm, selectedSource]);

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
      'Google News': 'bg-blue-100 text-blue-800',
      'Reuters Health': 'bg-orange-100 text-orange-800',
      'PubMed': 'bg-green-100 text-green-800',
      'Kaiser Permanente': 'bg-purple-100 text-purple-800',
      'Oxford Academic': 'bg-red-100 text-red-800',
      'System': 'bg-gray-100 text-gray-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-4xl font-bold">📰 CRC News Watch</h1>
            </div>
            <p className="text-xl text-blue-100 mb-2">Real-Time Medical News & Research</p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Stay informed with verified colorectal cancer research publications and news from trusted medical sources worldwide.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center mt-6 space-x-8 text-sm text-blue-200">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {availableSources.length} Sources
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {clinicalPublications.length + generalNews.length} Articles
              </div>
              <div className="flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                Live RSS Feeds
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
                onClick={() => loadAllContent(true)}
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
              {(clinicalLoading || newsLoading) ? 'Loading content...' : 
               `Showing ${filteredClinicalPublications.length + filteredGeneralNews.length} of ${clinicalPublications.length + generalNews.length} articles`}
            </p>
          </div>
        </Container>
      </section>

      {/* Content Sections */}
      <section className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Clinical Publications Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    📚 Clinical Publications
                    <span className="text-sm font-normal text-gray-500 ml-2">(6 months)</span>
                  </h2>
                  <div className="text-sm text-gray-500">
                    {clinicalLoading ? 'Loading...' : `${filteredClinicalPublications.length} found`}
                  </div>
                </div>
                
                {/* Scrollable container */}
                <div className="border rounded-lg bg-white shadow-sm">
                  <div className="max-h-96 overflow-y-auto">
                    {clinicalLoading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse border-b pb-4">
                            <div className="h-5 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredClinicalPublications.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {filteredClinicalPublications.map((publication, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                              <a 
                                href={publication.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:text-green-600 transition-colors"
                              >
                                {publication.title}
                              </a>
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(publication.source)}`}>
                                {publication.journal || publication.source}
                              </span>
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(publication.published)}
                              </div>
                            </div>
                            
                            {publication.authors && (
                              <p className="text-xs text-gray-500 mb-2">Authors: {publication.authors}</p>
                            )}
                            
                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                              {publication.summary}
                            </p>
                            
                            <div className="flex justify-end">
                              <a
                                href={publication.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
                              >
                                Read Paper
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No recent clinical publications found
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Check again tomorrow for new research publications.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* General News Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    📰 CRC in the News
                    <span className="text-sm font-normal text-gray-500 ml-2">(30 days)</span>
                  </h2>
                  <div className="text-sm text-gray-500">
                    {newsLoading ? 'Loading...' : `${filteredGeneralNews.length} found`}
                  </div>
                </div>
                
                {/* Scrollable container */}
                <div className="border rounded-lg bg-white shadow-sm">
                  <div className="max-h-96 overflow-y-auto">
                    {newsLoading ? (
                      <div className="p-4 space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse border-b pb-4">
                            <div className="h-5 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                            <div className="h-12 bg-gray-200 rounded"></div>
                          </div>
                        ))}
                      </div>
                    ) : filteredGeneralNews.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {filteredGeneralNews.map((news, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                                  <a 
                                    href={news.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-600 transition-colors"
                                  >
                                    {news.title}
                                  </a>
                                </h3>
                                
                                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(news.source)}`}>
                                    {news.source}
                                  </span>
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {formatDate(news.published)}
                                  </div>
                                </div>
                                
                                <p className="text-gray-700 text-sm leading-relaxed mb-2">
                                  {news.summary}
                                </p>
                              </div>
                              
                              <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
                              >
                                Read
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No recent news articles found
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Check again tomorrow for new CRC news.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {(searchTerm || selectedSource) && (filteredClinicalPublications.length === 0 && filteredGeneralNews.length === 0) && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedSource('');
                  }}
                  variant="outline"
                  className="mr-3"
                >
                  Clear Filters
                </Button>
                <Button 
                  onClick={() => loadAllContent(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Feed
                </Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Footer Info */}
      <section className="py-8 bg-gray-100">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Clinical Sources:</strong> PubMed, Kaiser Permanente, Oxford Academic | 
              <strong>News Sources:</strong> Google News, Reuters Health
            </p>
            <p className="text-xs text-gray-500">
              All content from real RSS feeds • Clinical publications (6 months) • News articles (30 days) • No AI-generated summaries • Real excerpts only. 
              Content is for informational purposes only and should not replace professional medical advice. 
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CRCNewsFeed;