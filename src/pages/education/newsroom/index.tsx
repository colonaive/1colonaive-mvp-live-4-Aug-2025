import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../components/ui/Container';
import ContentSearch from '../../../components/education/ContentSearch';
import ArticleCard from '../../../components/education/ArticleCard';
import { useEducationContent } from '../../../hooks/useEducationContent';
import { Newspaper, FileText, TrendingUp, Calendar } from 'lucide-react';

const NewsroomHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'newsroom',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Newspaper className="h-12 w-12 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-6">Newsroom</h1>
            <p className="text-xl mb-8">
              Stay informed about the latest news, research updates, and announcements from Project COLONAiVE™.
            </p>
            <div className="max-w-2xl mx-auto">
              <ContentSearch 
                placeholder="Search news and updates..." 
                onSearch={handleSearch}
                initialQuery={searchQuery}
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search Results */}
        {searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Search Results for "{searchQuery}"</h2>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600 mb-4">No articles found matching your search criteria.</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </div>
        )}

        {/* News Categories */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">News Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                to="/education/newsroom/press-releases"
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-blue-100 text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Press Releases</h3>
                <p className="text-sm text-gray-600">Official announcements and statements from Project COLONAiVE™</p>
              </Link>
              
              <Link 
                to="/education/newsroom/research-updates"
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-green-100 text-green-600">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Research Updates</h3>
                <p className="text-sm text-gray-600">Latest findings and advancements in colorectal cancer research</p>
              </Link>
              
              <Link 
                to="/upcoming-events"
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-purple-100 text-purple-600">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
                <p className="text-sm text-gray-600">Webinars, conferences, and community events</p>
              </Link>
            </div>
          </div>
        )}

        {/* Recent News */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent News</h2>
            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles
                  .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
                  .slice(0, 6)
                  .map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-gray-600">No newsroom articles are currently published in this section.</p>
              </div>
            )}
          </div>
        )}

        {/* Media Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Media Contact</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            For media inquiries, interview requests, or additional information about Project COLONAiVE™, 
            please contact our communications team.
          </p>
          <div className="inline-block bg-gray-100 rounded-lg p-6">
            <p className="font-semibold text-gray-800 mb-1">Media Relations</p>
            <p className="text-gray-600 mb-2">Project COLONAiVE™</p>
            <p className="text-gray-600">
              <a href="mailto:media@colonaive.ai" className="text-blue-600 hover:text-blue-800">
                media@colonaive.ai
              </a>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default NewsroomHub;
