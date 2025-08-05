// NEWS CARD COMPONENT FOR GENERAL NEWS
import React from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import type { GeneralNews } from '../lib/fetchNews';

interface NewsCardProps {
  news: GeneralNews;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getSourceColor = (source: string) => {
    const colors: { [key: string]: string } = {
      'Google News': 'bg-blue-100 text-blue-800',
      'Reuters Health': 'bg-orange-100 text-orange-800',
      'Medical News Today': 'bg-purple-100 text-purple-800',
      'Associated Press': 'bg-green-100 text-green-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
            <a 
              href={news.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              {news.title}
            </a>
          </h3>
          
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(news.source)}`}>
              {news.source}
            </span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(news.date)}
            </div>
          </div>
          
          <p className="text-gray-700 text-sm leading-relaxed mb-2">
            {news.summary}
          </p>
        </div>
        
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors"
        >
          Read
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;