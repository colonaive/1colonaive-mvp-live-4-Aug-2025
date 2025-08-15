import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const ClinicianGuidelinesHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'clinician-guidelines',
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
            <Link to="/education/clinicians" className="inline-flex items-center text-purple-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Clinician Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Clinical Guidelines</h1>
            <p className="text-xl">
              Evidence-based protocols and recommendations for colorectal cancer screening, diagnosis, and management.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search clinical guidelines..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Clinical Guidelines"}
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
                  : "Clinical guidelines are coming soon. Check back later for updates."}
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

        {/* Guidelines Summary */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Key Screening Guidelines</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Range</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">USPSTF (2021)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Colonoscopy, FIT, FIT-DNA, Flexible Sigmoidoscopy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45-75 years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Varies by test</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">American Cancer Society (2018)</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Colonoscopy, FIT, FIT-DNA, Flexible Sigmoidoscopy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45-75 years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Varies by test</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Singapore MOH</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FIT, Colonoscopy</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50+ years</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">FIT annually, Colonoscopy every 10 years</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Note: Guidelines may vary based on individual risk factors. Always consult the most recent recommendations.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Clinical Network</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Become part of Singapore's growing network of healthcare providers committed to reducing colorectal cancer mortality through early detection.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register/clinic">
              <button className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors">
                Register Your Clinic
              </button>
            </Link>
            <Link to="/find-a-specialist">
              <button className="px-6 py-3 bg-white text-purple-600 font-medium rounded-lg border border-purple-600 hover:bg-purple-50 transition-colors">
                Find Project Partner Clinics
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ClinicianGuidelinesHub;