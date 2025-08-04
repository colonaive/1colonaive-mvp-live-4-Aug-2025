import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const PatientScreeningHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'patient-screening',
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
            <Link to="/education/patients" className="inline-flex items-center text-green-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Patient Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Screening Options</h1>
            <p className="text-xl">
              Learn about different colorectal cancer screening methods, preparation, and what to expect.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search screening options..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Screening Resources"}
          </h2>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-600">No articles found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Screened?</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Now that you understand your screening options, take the next step toward prevention.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-screened">
              <button className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                Get Screened Now
              </button>
            </Link>
            <Link to="/find-a-gp">
              <button className="px-6 py-3 bg-white text-green-600 font-medium rounded-lg border border-green-600 hover:bg-green-50 transition-colors">
                Find a Healthcare Provider
              </button>
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-teal-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">Still unsure about which test is right for you?</h3>
          <p className="text-teal-700 mb-4">
            Explore our Frequently Asked Questions for detailed guidance on screening options, preparation, and what to expect.
          </p>
          <Link 
            to="/education/faqs"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
          >
            View Screening FAQs
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default PatientScreeningHub;