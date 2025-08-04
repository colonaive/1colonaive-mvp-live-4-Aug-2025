// src/pages/admin/NewsFeedAdmin.tsx
import React, { useState, useEffect } from 'react';
import { Container } from '../../components/ui/Container';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Newspaper, 
  Pin, 
  Trash2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Settings,
  TrendingUp,
  Calendar,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { crcNewsFeedService, CRCNewsArticle } from '../../services/crcNewsFeedService';

const NewsFeedAdmin: React.FC = () => {
  const [articles, setArticles] = useState<CRCNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await crcNewsFeedService.getNewsArticles(100);
      setArticles(data);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshFeed = async () => {
    setRefreshing(true);
    try {
      await crcNewsFeedService.fetchAndStoreNews();
      await loadArticles();
    } catch (error) {
      console.error('Error refreshing feed:', error);
      setError('Failed to refresh feed');
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleSticky = async (articleId: string, currentSticky: boolean, currentPriority: number = 999) => {
    try {
      await crcNewsFeedService.setArticleSticky(
        articleId, 
        !currentSticky, 
        currentSticky ? 999 : 1
      );
      await loadArticles();
    } catch (error) {
      console.error('Error toggling sticky:', error);
      setError('Failed to update article');
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      // In a real implementation, you'd add a delete method to the service
      console.log('Delete article:', articleId);
      // For now, just refresh the list
      await loadArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      setError('Failed to delete article');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 9) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 7) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const stickyArticles = articles.filter(a => a.is_sticky);
  const regularArticles = articles.filter(a => !a.is_sticky);

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-12">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Settings className="h-8 w-8 mr-3" />
                  <h1 className="text-3xl font-bold">CRC News Feed Admin</h1>
                </div>
                <p className="text-blue-200 text-lg">
                  Manage live CRC news articles, sticky priorities, and feed updates
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-200 mb-2">Feed Statistics</div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center">
                    <Pin className="h-4 w-4 mr-1" />
                    {stickyArticles.length} Sticky
                  </div>
                  <div className="flex items-center">
                    <Newspaper className="h-4 w-4 mr-1" />
                    {articles.length} Total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Controls */}
      <section className="py-8 bg-white border-b">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                {loading ? 'Loading articles...' : `Managing ${articles.length} articles`}
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleRefreshFeed}
                  disabled={refreshing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Fetching...' : 'Refresh Feed'}
                </Button>
                <Button 
                  onClick={loadArticles}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload View
                </Button>
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Articles Management */}
      <section className="py-12">
        <Container>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Sticky Articles */}
            {stickyArticles.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Pin className="h-6 w-6 mr-2 text-red-500" />
                  Sticky Articles ({stickyArticles.length})
                </h2>
                <div className="space-y-4">
                  {stickyArticles.map((article, index) => (
                    <AdminArticleCard 
                      key={article.id || index}
                      article={article}
                      onToggleSticky={handleToggleSticky}
                      onDelete={handleDeleteArticle}
                      isSticky={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Articles */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Newspaper className="h-6 w-6 mr-2 text-blue-500" />
                Regular Articles ({regularArticles.length})
              </h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-gray-200 rounded mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : regularArticles.length > 0 ? (
                <div className="space-y-4">
                  {regularArticles.slice(0, 20).map((article, index) => (
                    <AdminArticleCard 
                      key={article.id || index}
                      article={article}
                      onToggleSticky={handleToggleSticky}
                      onDelete={handleDeleteArticle}
                      isSticky={false}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Articles Found</h3>
                    <p className="text-gray-600 mb-4">Click "Refresh Feed" to fetch the latest articles.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

// Admin Article Card Component
interface AdminArticleCardProps {
  article: CRCNewsArticle;
  onToggleSticky: (id: string, currentSticky: boolean, currentPriority?: number) => void;
  onDelete: (id: string) => void;
  isSticky: boolean;
}

const AdminArticleCard: React.FC<AdminArticleCardProps> = ({
  article,
  onToggleSticky,
  onDelete,
  isSticky
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 9) return 'bg-red-100 text-red-800 border-red-300';
    if (score >= 7) return 'bg-orange-100 text-orange-800 border-orange-300';
    if (score >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <Card className={`border-l-4 ${isSticky ? 'border-l-red-500 bg-red-50/30' : 'border-l-blue-500'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isSticky && <Pin className="h-4 w-4 text-red-500" />}
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRelevanceColor(article.relevance_score || 5)}`}>
                Score: {article.relevance_score}/10
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {article.source}
              </span>
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(article.date_published)}
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
              {article.title}
            </h3>
            {article.summary && (
              <div className="mb-3">
                <div className="flex items-center mb-1">
                  <Sparkles className="h-3 w-3 text-blue-500 mr-1" />
                  <span className="text-xs text-blue-600">AI Summary</span>
                </div>
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded border-l-2 border-blue-200">
                  {article.summary}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View Original
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onToggleSticky(
                article.id!, 
                article.is_sticky || false, 
                article.sticky_priority
              )}
              variant={isSticky ? "outline" : "default"}
              size="sm"
              className={isSticky ? "text-red-600 border-red-300 hover:bg-red-50" : "bg-red-600 hover:bg-red-700 text-white"}
            >
              {isSticky ? <EyeOff className="h-4 w-4 mr-1" /> : <Pin className="h-4 w-4 mr-1" />}
              {isSticky ? 'Unpin' : 'Pin'}
            </Button>
            <Button
              onClick={() => onDelete(article.id!)}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsFeedAdmin;