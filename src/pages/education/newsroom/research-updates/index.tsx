import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const ResearchUpdatesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'research-updates',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/education/newsroom" className="inline-flex items-center text-indigo-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Newsroom
            </Link>
            <h1 className="text-3xl font-bold mb-4">Research Updates</h1>
            <p className="text-xl">
              Latest findings and advancements in colorectal cancer research.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search research updates..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Research Updates"}
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
                  ? "No research updates found matching your search criteria." 
                  : "No research updates are currently published in this section."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Research Highlights */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Research Highlights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h4 className="font-semibold text-indigo-700 mb-2">Blood-Based Screening Advancements</h4>
              <p className="text-gray-600 text-sm">
                Recent studies show promising results for non-invasive blood tests in detecting early-stage colorectal cancer, 
                potentially increasing screening compliance rates.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">Microbiome Research</h4>
              <p className="text-gray-600 text-sm">
                Emerging research suggests gut microbiome composition may play a role in colorectal cancer development 
                and could offer new avenues for prevention and early detection.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700 mb-2">AI in Colonoscopy</h4>
              <p className="text-gray-600 text-sm">
                Artificial intelligence tools are showing promise in improving polyp detection rates during colonoscopy, 
                potentially enhancing the effectiveness of this gold-standard screening method.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700 mb-2">Population Screening Strategies</h4>
              <p className="text-gray-600 text-sm">
                Studies of organized screening programs demonstrate that multi-modal approaches with 
                clear follow-up pathways can significantly reduce CRC mortality at a population level.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Stay Informed</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Subscribe to our newsletter to receive the latest research updates and advancements in colorectal cancer prevention.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/join-the-movement">
              <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
                Subscribe to Updates
              </button>
            </Link>
            <Link to="/education/clinicians/research">
              <button className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors">
                View Clinical Research
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ResearchUpdatesPage;
