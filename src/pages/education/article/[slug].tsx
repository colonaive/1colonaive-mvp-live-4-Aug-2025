import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useEducationContent } from '../../../hooks/useEducationContent';
import ArticleLayout from '../../../components/education/ArticleLayout';
import { Container } from '../../../components/ui/Container';
import { Loader2 } from 'lucide-react';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticleBySlug, getRelatedArticles, loading } = useEducationContent();
  
  if (loading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-700">Loading article...</span>
      </div>
    );
  }
  
  if (!slug) {
    return <Navigate to="/education" replace />;
  }
  
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return (
      <div className="pt-32 min-h-screen">
        <Container>
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">
              The article you're looking for doesn't exist or has been moved.
            </p>
            <a 
              href="/education"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back to Education Hub
            </a>
          </div>
        </Container>
      </div>
    );
  }
  
  const relatedArticles = getRelatedArticles(article.id);
  
  // For now, we'll use the excerpt as content
  // In a real implementation, you would have full article content
  const articleContent = article.content || (
    <div>
      <p className="mb-4">{article.excerpt}</p>
      <p className="mb-4">This is a placeholder for the full article content. In a production environment, this would be replaced with the complete article text.</p>
      <p>The article would include detailed information about {article.title.toLowerCase()}, with proper formatting, headings, and possibly images or diagrams to illustrate key points.</p>
    </div>
  );
  
  return (
    <ArticleLayout article={article} relatedArticles={relatedArticles}>
      {articleContent}
    </ArticleLayout>
  );
};

export default ArticlePage;