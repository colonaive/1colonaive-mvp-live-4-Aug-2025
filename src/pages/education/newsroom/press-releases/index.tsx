import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const PressReleasesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'newsroom',
    subcategory: 'press-releases',
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
          <div className="max-w-3xl mx-auto">
            <Link to="/education/newsroom" className="inline-flex items-center text-gray-300 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Newsroom
            </Link>
            <h1 className="text-3xl font-bold mb-4">Press Releases</h1>
            <p className="text-xl">
              Official announcements and statements from Project COLONAiVE™.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search press releases..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Press Releases"}
          </h2>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? "No press releases found matching your search criteria." 
                  : "No press releases are currently published in this section."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

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

export default PressReleasesPage;
