// Reusable SEO Page List Component
import React from 'react';
import { Button } from './ui/Button';
import { ArrowRight, Globe, MapPin } from 'lucide-react';
import { SEO_PAGES } from '../pages/seo/index';

interface SEOPageListProps {
  variant?: 'compact' | 'detailed' | 'minimal';
  limit?: number;
  regions?: string[];
  priority?: 'high' | 'medium' | 'all';
  showStats?: boolean;
  className?: string;
}

const SEOPageList: React.FC<SEOPageListProps> = ({
  variant = 'compact',
  limit,
  regions,
  priority = 'all',
  showStats = false,
  className = ''
}) => {
  // Filter pages based on props
  let filteredPages = SEO_PAGES;

  if (regions && regions.length > 0) {
    filteredPages = filteredPages.filter(page => regions.includes(page.region || 'Global'));
  }

  if (priority !== 'all') {
    filteredPages = filteredPages.filter(page => page.priority === priority);
  }

  // Sort by priority and search volume
  filteredPages = filteredPages.sort((a, b) => {
    if (a.priority === 'high' && b.priority !== 'high') return -1;
    if (b.priority === 'high' && a.priority !== 'high') return 1;
    return (b.searchVolume || 0) - (a.searchVolume || 0);
  });

  if (limit) {
    filteredPages = filteredPages.slice(0, limit);
  }

  // Group by region for detailed view
  const pagesByRegion = filteredPages.reduce((acc, page) => {
    const region = page.region || 'Global';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(page);
    return acc;
  }, {} as Record<string, typeof filteredPages>);

  const renderMinimal = () => (
    <div className={`space-y-2 ${className}`}>
      {filteredPages.map((page) => (
        <a
          key={page.path}
          href={page.path}
          className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors group"
        >
          <div className="flex items-center">
            <span className="text-lg mr-3">{page.flag}</span>
            <span className="font-medium text-gray-900 group-hover:text-blue-600">
              {page.title}
            </span>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </a>
      ))}
    </div>
  );

  const renderCompact = () => (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPages.map((page) => (
          <a
            key={page.path}
            href={page.path}
            className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center flex-1">
              <span className="text-xl mr-3">{page.flag}</span>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {page.title}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {page.description}
                </div>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
          </a>
        ))}
      </div>
    </div>
  );

  const renderDetailed = () => (
    <div className={`space-y-8 ${className}`}>
      {Object.entries(pagesByRegion).map(([region, pages]) => (
        <div key={region}>
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">{pages[0]?.flag || '🌍'}</span>
            <h3 className="text-xl font-bold text-gray-900">{region}</h3>
            <span className="ml-2 text-sm text-gray-500">({pages.length} pages)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    {page.priority === 'high' && (
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    )}
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {page.intent}
                    </span>
                  </div>
                  {showStats && (
                    <span className="text-xs text-gray-400">
                      {page.searchVolume}/mo
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {page.title}
                </h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {page.description}
                </p>
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  View Page
                  <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Stats component
  const renderStats = () => {
    if (!showStats) return null;
    
    const totalPages = filteredPages.length;
    const totalSearchVolume = filteredPages.reduce((sum, page) => sum + (page.searchVolume || 0), 0);
    const uniqueRegions = new Set(filteredPages.map(page => page.region)).size;

    return (
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalPages}</div>
            <div className="text-sm text-blue-700">Pages</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{uniqueRegions}</div>
            <div className="text-sm text-blue-700">Regions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{totalSearchVolume.toLocaleString()}</div>
            <div className="text-sm text-blue-700">Monthly Searches</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderStats()}
      {variant === 'minimal' && renderMinimal()}
      {variant === 'compact' && renderCompact()}
      {variant === 'detailed' && renderDetailed()}
    </div>
  );
};

// Pre-configured components for common use cases
export const RegionalScreeningLinks: React.FC<{ className?: string }> = ({ className }) => (
  <SEOPageList
    variant="compact"
    regions={['Singapore', 'Australia', 'India', 'Philippines', 'Japan']}
    priority="high"
    limit={6}
    className={className}
  />
);

export const PopularSEOPages: React.FC<{ className?: string }> = ({ className }) => (
  <SEOPageList
    variant="minimal"
    priority="high"
    limit={8}
    className={className}
  />
);

export const SEOPagesByRegion: React.FC<{ region: string; className?: string }> = ({ region, className }) => (
  <SEOPageList
    variant="detailed"
    regions={[region]}
    showStats={true}
    className={className}
  />
);

// Call-to-Action Box Component
export const RegionalScreeningCTA: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-6 border border-blue-200 ${className}`}>
    <div className="flex items-start">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Globe className="h-5 w-5 text-blue-600" />
        </div>
      </div>
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🌏 Explore Screening Options by Country
        </h3>
        <p className="text-gray-600 mb-4">
          Discover region-specific colorectal cancer screening information, costs, and healthcare options 
          tailored to your location.
        </p>
        <a href="/seo">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            View All Regional Pages
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </a>
      </div>
    </div>
  </div>
);

export default SEOPageList;