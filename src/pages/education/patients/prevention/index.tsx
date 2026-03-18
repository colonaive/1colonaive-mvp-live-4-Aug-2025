import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const PatientPreventionHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'patient-prevention',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/education/patients" className="inline-flex items-center text-purple-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Patient Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Prevention Strategies</h1>
            <p className="text-xl">
              Learn about lifestyle factors, dietary choices, and other strategies to reduce your colorectal cancer risk.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search prevention strategies..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Prevention Resources"}
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
                  : "No prevention articles are currently published in this section."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Prevention Tips */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Key Prevention Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700 mb-2">Healthy Diet</h4>
              <p className="text-gray-600 text-sm">
                Eat a diet rich in fruits, vegetables, and whole grains. Limit red and processed meats, 
                which have been linked to increased colorectal cancer risk.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700 mb-2">Regular Exercise</h4>
              <p className="text-gray-600 text-sm">
                Aim for at least 150 minutes of moderate exercise or 75 minutes of vigorous exercise each week.
              </p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-semibold text-red-700 mb-2">Avoid Tobacco</h4>
              <p className="text-gray-600 text-sm">
                Don't smoke or use tobacco products. If you do, seek help to quit.
              </p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-700 mb-2">Limit Alcohol</h4>
              <p className="text-gray-600 text-sm">
                If you drink alcohol, do so in moderation. For cancer prevention, less is better.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-700 mb-2">Maintain Healthy Weight</h4>
              <p className="text-gray-600 text-sm">
                Keep your weight within the healthy range and avoid excess weight gain around the midsection.
              </p>
            </div>
            <div className="border-l-4 border-teal-500 pl-4">
              <h4 className="font-semibold text-teal-700 mb-2">Regular Screening</h4>
              <p className="text-gray-600 text-sm">
                The most effective prevention strategy is regular screening to detect and remove polyps before they become cancerous.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Take the Next Step</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Prevention includes regular screening. Talk to your doctor about which screening option is right for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-screened">
              <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                Explore Screening Options
              </button>
            </Link>
            <Link to="/find-a-gp">
              <button className="px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors">
                Find a Healthcare Provider
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PatientPreventionHub;
