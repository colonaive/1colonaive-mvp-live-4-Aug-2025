import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const ClinicianCaseStudiesHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'clinician-case-studies',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/education/clinicians" className="inline-flex items-center text-green-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Clinician Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Case Studies</h1>
            <p className="text-xl">
              Real clinical cases and learning opportunities for healthcare professionals.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search case studies..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Clinical Case Studies"}
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
                  ? "No articles found matching your search criteria." 
                  : "No clinical case studies are currently published in this section."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Publishing Status */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Case Study Publishing Status</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            A case-study library is being curated for publication. It is intended to cover diagnostic challenges,
            management decisions, and prevention-focused learning scenarios once editorial review is complete.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/education/clinicians/research">
              <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                Browse Research Articles
              </button>
            </Link>
            <Link to="/education/clinicians/guidelines">
              <button className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition-colors">
                View Clinical Guidelines
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ClinicianCaseStudiesHub;
