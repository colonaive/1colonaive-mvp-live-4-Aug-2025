import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../../components/ui/Container';
import ContentSearch from '../../../../components/education/ContentSearch';
import ArticleCard from '../../../../components/education/ArticleCard';
import { useEducationContent } from '../../../../hooks/useEducationContent';
import { ArrowLeft } from 'lucide-react';

const ClinicianResearchHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles } = useEducationContent({
    category: 'clinician-research',
    searchQuery
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            <Link to="/education/clinicians" className="inline-flex items-center text-blue-200 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Clinician Education
            </Link>
            <h1 className="text-3xl font-bold mb-4">Research & Studies</h1>
            <p className="text-xl">
              Latest research findings, clinical studies, and evidence-based analyses in colorectal cancer.
            </p>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Search */}
        <div className="mb-8">
          <ContentSearch 
            placeholder="Search research articles..." 
            onSearch={handleSearch}
            initialQuery={searchQuery}
          />
        </div>

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Research Articles"}
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
                  : "Research articles are coming soon. Check back later for updates."}
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

        {/* Featured Study */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h3 className="text-xl font-bold mb-4">Featured Study: Kaiser Permanente CRC Screening Program</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Key Findings</h4>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>33% reduction in CRC incidence</li>
                <li>50% reduction in CRC mortality</li>
                <li>Increased screening participation from 37% to over 80%</li>
                <li>Successful implementation of non-invasive screening followed by colonoscopy for positive results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Implications for Practice</h4>
              <p className="text-gray-600 mb-4">
                The Kaiser Permanente study demonstrates that organized screening programs with multiple modalities 
                can significantly reduce CRC burden at a population level.
              </p>
              <Link 
                to="/education/clinicians/research/kaiser-crc-study"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                Read Full Analysis
                <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Contribute to Research</h3>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Interested in participating in colorectal cancer research or clinical trials? 
            Join our network of healthcare professionals contributing to the advancement of CRC prevention.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/clinical-trials">
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                Learn About Clinical Trials
              </button>
            </Link>
            <Link to="/find-a-specialist">
              <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors">
                Find Project Partner Clinics
              </button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ClinicianResearchHub;