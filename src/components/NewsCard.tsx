// NEWS CARD COMPONENT - DISPLAYS GENERAL NEWS ARTICLES
import React from 'react';
import { ExternalLink, Calendar, Globe } from 'lucide-react';
import type { NewsArticle } from '../lib/fetchRSSFeed';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'Google News': 'bg-blue-100 text-blue-800 border-blue-200',
      'Reuters Health': 'bg-orange-100 text-orange-800 border-orange-200',
      'Medical News Today': 'bg-purple-100 text-purple-800 border-purple-200',
      'HealthDay News': 'bg-green-100 text-green-800 border-green-200',
      'Associated Press': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[source] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2">
            <a 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {article.title}
            </a>
          </h3>
        </div>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Read
        </a>
      </div>
      
      {/* Meta information */}
      <div className="flex items-center gap-3 mb-3 text-sm text-gray-600">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getSourceBadgeColor(article.source)}`}>
          <Globe className="h-3 w-3" />
          {article.source}
        </span>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(article.date)}
        </div>
      </div>
      
      {/* Summary */}
      <p className="text-gray-700 text-sm leading-relaxed">
        {article.summary}
      </p>
      
      {/* Footer with direct link */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center gap-1 transition-colors"
        >
          Read full article
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;