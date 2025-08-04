import React from 'react';
import { Link } from 'react-router-dom';
import { Article, Reference } from '../../data/education/articles';
import { Container } from '../ui/Container';
import { Clock, Calendar, BookOpen, ArrowLeft, Share2, Printer, Download, ExternalLink } from 'lucide-react';
import RelatedArticles from './RelatedArticles';

interface ArticleLayoutProps {
  article: Article;
  relatedArticles: Article[];
  children: React.ReactNode;
}

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ 
  article, 
  relatedArticles,
  children 
}) => {
  const getCategoryPath = (category: string): string => {
    const paths: Record<string, string> = {
      'patient-basics': '/education/patients/basics',
      'patient-screening': '/education/patients/screening',
      'patient-symptoms': '/education/patients/symptoms',
      'patient-prevention': '/education/patients/prevention',
      'clinician-guidelines': '/education/clinicians/guidelines',
      'clinician-research': '/education/clinicians/research',
      'clinician-case-studies': '/education/clinicians/case-studies',
      'clinician-cme': '/education/clinicians/cme-resources',
      'newsroom': '/education/newsroom',
      'research-updates': '/education/newsroom/research-updates'
    };
    return paths[category] || '/education';
  };

  const getCategoryName = (category: string): string => {
    const names: Record<string, string> = {
      'patient-basics': 'CRC Basics',
      'patient-screening': 'Screening',
      'patient-symptoms': 'Symptoms',
      'patient-prevention': 'Prevention',
      'clinician-guidelines': 'Guidelines',
      'clinician-research': 'Research',
      'clinician-case-studies': 'Case Studies',
      'clinician-cme': 'CME Resources',
      'newsroom': 'Newsroom',
      'research-updates': 'Research Updates'
    };
    return names[category] || category;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying link:', err));
    }
  };

  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      {/* Breadcrumb */}
      <Container>
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/education" className="hover:text-blue-600">Education</Link>
          {' > '}
          <Link to={getCategoryPath(article.category)} className="hover:text-blue-600">
            {getCategoryName(article.category)}
          </Link>
          {' > '}
          <span className="text-gray-700">{article.title}</span>
        </div>
      </Container>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 mb-8 py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link to={getCategoryPath(article.category)} className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to {getCategoryName(article.category)}
            </Link>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            
            <p className="text-xl text-gray-600 mb-6">{article.excerpt}</p>
            
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{article.readTime} min read</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Published: {new Date(article.publishedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>Difficulty: {article.difficulty}</span>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <span className="text-sm font-medium mr-2">By:</span>
              <span className="text-sm font-semibold">{article.author.name}</span>
              {article.author.credentials && (
                <span className="text-sm text-gray-500 ml-2">({article.author.credentials})</span>
              )}
            </div>
            
            {article.image && (
              <div className="mb-8">
                <img 
                  src={article.image.url} 
                  alt={article.image.alt} 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                {article.image.caption && (
                  <p className="text-sm text-gray-500 mt-2 text-center">{article.image.caption}</p>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Article Content */}
      <Container>
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="prose prose-lg max-w-none">
                {children}
              </div>
              
              {/* References Section */}
              {article.references && article.references.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h2 className="text-xl font-bold mb-4">References</h2>
                  <ol className="list-decimal pl-5 space-y-2">
                    {article.references.map((ref: Reference) => (
                      <li key={ref.id} className="text-sm text-gray-600">
                        {ref.authors.join(', ')} ({ref.year}). {ref.title}.
                        {ref.journal && <span> <em>{ref.journal}</em>,</span>}
                        {ref.volume && <span> {ref.volume}</span>}
                        {ref.pages && <span>, {ref.pages}</span>}.
                        {ref.doi && (
                          <a 
                            href={`https://doi.org/${ref.doi}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            https://doi.org/{ref.doi}
                          </a>
                        )}
                        {ref.url && !ref.doi && (
                          <a 
                            href={ref.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 ml-1"
                          >
                            {ref.url}
                          </a>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <Link 
                    key={tag} 
                    to={`/education?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              
              {/* Article Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-wrap gap-4">
                <button 
                  onClick={handleShare}
                  className="inline-flex items-center text-gray-600 hover:text-blue-600"
                >
                  <Share2 className="h-5 w-5 mr-1" />
                  Share
                </button>
                <button 
                  onClick={handlePrint}
                  className="inline-flex items-center text-gray-600 hover:text-blue-600"
                >
                  <Printer className="h-5 w-5 mr-1" />
                  Print
                </button>
                {article.downloadUrl && (
                  <a 
                    href={article.downloadUrl}
                    download
                    className="inline-flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <Download className="h-5 w-5 mr-1" />
                    Download PDF
                  </a>
                )}
                {article.externalUrl && (
                  <a 
                    href={article.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-gray-600 hover:text-blue-600"
                  >
                    <ExternalLink className="h-5 w-5 mr-1" />
                    External Resource
                  </a>
                )}
              </div>
            </div>
            
            {/* Triage Tool Prompt - only for symptom-related articles */}
            {(article.category.includes('symptoms') || article.tags.some(tag => 
              ['symptoms', 'warning signs', 'early detection', 'risk factors'].includes(tag.toLowerCase())
            )) && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">?</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">Worried about symptoms?</h3>
                    <p className="text-orange-800 mb-4">
                      Use our secure self-assessment Triage Tool to get personalized guidance based on your symptoms and risk factors.
                    </p>
                    <Link 
                      to="/triage"
                      className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Start Triage Assessment
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Medical Disclaimer */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
              <p className="text-sm text-blue-800">
                <strong>Medical Disclaimer:</strong> This content is for informational and educational purposes only. 
                It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
                Always seek the advice of your physician or other qualified health provider with any questions 
                you may have regarding a medical condition.
              </p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Author Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold mb-3">About the Author</h3>
              <p className="text-gray-600 text-sm mb-3">{article.author.name}</p>
              {article.author.credentials && (
                <p className="text-gray-600 text-sm mb-3">{article.author.credentials}</p>
              )}
              {article.author.affiliation && (
                <p className="text-gray-600 text-sm">{article.author.affiliation}</p>
              )}
            </div>
            
            {/* Related Articles */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">Related Articles</h3>
              <RelatedArticles articles={relatedArticles} />
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/get-screened" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Get Screened
                  </Link>
                </li>
                <li>
                  <Link to="/find-a-gp" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Find a GP
                  </Link>
                </li>
                <li>
                  <Link to="/find-a-specialist" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Find a Specialist
                  </Link>
                </li>
                <li>
                  <Link to="/join-the-movement" className="text-blue-600 hover:text-blue-800 flex items-center">
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                    Join the Movement
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ArticleLayout;