// PUBLICATION CARD COMPONENT FOR SCIENTIFIC PUBLICATIONS
import React from 'react';
import { ExternalLink, Calendar, BookOpen } from 'lucide-react';
import type { ScientificPublication } from '../lib/fetchNews';

interface PublicationCardProps {
  publication: ScientificPublication;
}

const PublicationCard: React.FC<PublicationCardProps> = ({ publication }) => {
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

  const getJournalColor = (journal: string) => {
    const colors: { [key: string]: string } = {
      'PubMed': 'bg-green-100 text-green-800',
      'New England Journal of Medicine': 'bg-red-100 text-red-800',
      'NEJM': 'bg-red-100 text-red-800',
      'JAMA': 'bg-indigo-100 text-indigo-800',
      'Oxford Academic': 'bg-purple-100 text-purple-800',
      'Kaiser Permanente Research': 'bg-blue-100 text-blue-800',
      'Nature Medicine': 'bg-emerald-100 text-emerald-800',
    };
    return colors[journal] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
        <a 
          href={publication.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-green-600 transition-colors"
        >
          {publication.title}
        </a>
      </h3>
      
      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJournalColor(publication.journal)}`}>
          <BookOpen className="h-3 w-3 inline mr-1" />
          {publication.journal}
        </span>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(publication.date)}
        </div>
      </div>
      
      {publication.authors && (
        <p className="text-xs text-gray-500 mb-2">
          <strong>Authors:</strong> {publication.authors}
        </p>
      )}
      
      <p className="text-gray-700 text-sm leading-relaxed mb-3">
        {publication.summary}
      </p>
      
      <div className="flex justify-end">
        <a
          href={publication.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
        >
          Read Paper
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default PublicationCard;