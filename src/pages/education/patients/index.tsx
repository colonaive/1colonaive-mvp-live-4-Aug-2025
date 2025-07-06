import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../../../components/ui/Container';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import ContentSearch from '../../../components/education/ContentSearch';
import FeaturedContent from '../../../components/education/FeaturedContent';
import ArticleCard from '../../../components/education/ArticleCard';
import { useEducationContent } from '../../../hooks/useEducationContent';
import { educationCategories } from '../../../data/education/categories';
import { BookOpen, Search, Shield, TrendingUp } from 'lucide-react';

const PatientEducationHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { articles, featuredArticles } = useEducationContent({
    audience: 'patients',
    searchQuery
  });

  const patientCategories = educationCategories.filter(
    cat => cat.audience === 'patients' || cat.audience === 'both'
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Patient Education Hub</h1>
            <p className="text-xl mb-8">
              Empowering you with knowledge about colorectal cancer prevention, screening, and early detection.
            </p>
            <div className="max-w-2xl mx-auto">
              <ContentSearch 
                placeholder="Search for patient resources..." 
                onSearch={handleSearch}
                initialQuery={searchQuery}
              />
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        {/* Featured Content */}
        {featuredArticles.length > 0 && !searchQuery && (
          <FeaturedContent 
            articles={featuredArticles} 
            title="Featured Resources"
            description="Essential information for your colorectal health journey"
            className="mb-12"
          />
        )}

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
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              </div>
            )}
          </div>
        )}

        {/* Category Grid */}
        {!searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Browse by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {patientCategories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/education/patients/${category.id.replace('patient-', '')}`}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-6 flex flex-col items-center text-center"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-${category.color}-100 text-${category.color}-600`}>
                    {/* Dynamic icon rendering based on category.icon */}
                    {category.icon === 'BookOpen' && <BookOpen className="h-6 w-6" />}
                    {category.icon === 'Search' && <Search className="h-6 w-6" />}
                    {category.icon === 'TrendingUp' && <TrendingUp className="h-6 w-6" />}
                    {category.icon === 'Shield' && <Shield className="h-6 w-6" />}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Articles */}
        {!searchQuery && articles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles
                .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
                .slice(0, 6)
                .map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/education">
                <Button variant="outline">View All Articles</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Take Action?</h2>
          <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
            Knowledge is the first step. The next is to get screened. Early detection saves lives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/get-screened">
              <Button>Get Screened Now</Button>
            </Link>
            <Link to="/find-a-gp">
              <Button variant="outline">Find a Healthcare Provider</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PatientEducationHub;