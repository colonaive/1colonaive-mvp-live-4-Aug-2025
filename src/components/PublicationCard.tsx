// PUBLICATION CARD COMPONENT - DISPLAYS SCIENTIFIC PUBLICATIONS
import React from 'react';
import { ExternalLink, Calendar, BookOpen, Users } from 'lucide-react';
import type { ScientificArticle } from '../lib/fetchRSSFeed';

interface PublicationCardProps {
  article: ScientificArticle;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ article }) => {
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

  const getJournalBadgeColor = (journal: string) => {
    const colors: { [key: string]: string } = {
      'PubMed': 'bg-green-100 text-green-800 border-green-200',
      'New England Journal of Medicine': 'bg-red-100 text-red-800 border-red-200',
      'NEJM': 'bg-red-100 text-red-800 border-red-200',
      'JAMA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'Oxford Academic - Gastroenterology': 'bg-purple-100 text-purple-800 border-purple-200',
      'Oxford Academic': 'bg-purple-100 text-purple-800 border-purple-200',
      'Kaiser Permanente Research': 'bg-blue-100 text-blue-800 border-blue-200',
      'Nature Medicine': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    };
    return colors[journal] || 'bg-gray-100 text-gray-800 border-gray-200';
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
              className="hover:text-green-600 transition-colors"
            >
              {article.title}
            </a>
          </h3>
        </div>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-3 flex-shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded-full hover:bg-green-700 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Paper
        </a>
      </div>
      
      {/* Meta information */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getJournalBadgeColor(article.journal)}`}>
            <BookOpen className="h-3 w-3" />
            {article.journal}
          </span>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(article.date)}
          </div>
        </div>
        
        {article.authors && (
          <div className="flex items-start gap-1 text-sm text-gray-600">
            <Users className="h-3 w-3 mt-0.5 flex-shrink-0" />
            <span className="font-medium">Authors:</span>
            <span className="flex-1">{article.authors}</span>
          </div>
        )}
      </div>
      
      {/* Abstract/Summary */}
      <div className="mb-3">
        <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg border-l-4 border-green-300">
          {article.summary}
        </p>
      </div>
      
      {/* Footer with direct link */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 text-sm font-medium inline-flex items-center gap-1 transition-colors"
        >
          Read full publication
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default PublicationCard;