// Critical CSS Component for Above-the-Fold Optimization
import React from 'react';

interface CriticalCSSProps {
  pageType: 'landing' | 'news' | 'clinic' | 'general';
}

export const CriticalCSS: React.FC<CriticalCSSProps> = ({ pageType }) => {
  const generateCriticalCSS = (type: string): string => {
    const commonCSS = `
      /* Reset and Base Styles */
      *, *::before, *::after { box-sizing: border-box; }
      * { margin: 0; }
      body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
      img, picture, video, canvas, svg { display: block; max-width: 100%; }
      input, button, textarea, select { font: inherit; }
      p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }
      
      /* Typography */
      body { 
        font-family: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 16px;
        color: #1f2937;
        background-color: #ffffff;
      }
      
      /* Layout Utilities */
      .container { 
        max-width: 1200px; 
        margin: 0 auto; 
        padding: 0 1rem; 
      }
      
      /* Navigation Critical Styles */
      .nav { 
        position: fixed; 
        top: 0; 
        width: 100%; 
        z-index: 50; 
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid #e5e7eb;
        height: 4rem;
      }
      
      .nav-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        padding: 0 1rem;
      }
      
      .nav-logo { 
        height: 2.5rem; 
        width: auto; 
      }
      
      /* Hero Section Critical Styles */
      .hero { 
        min-height: 100vh; 
        display: flex; 
        align-items: center; 
        padding-top: 4rem;
      }
      
      .hero-content {
        text-align: center;
        max-width: 4xl;
        margin: 0 auto;
      }
      
      .hero-title { 
        font-size: clamp(2rem, 5vw, 4rem); 
        font-weight: 700; 
        line-height: 1.2; 
        margin-bottom: 1.5rem;
      }
      
      .hero-subtitle { 
        font-size: clamp(1rem, 3vw, 1.25rem); 
        margin-bottom: 2rem; 
        color: #6b7280;
        max-width: 48rem;
        margin-left: auto;
        margin-right: auto;
      }
      
      /* Button Critical Styles */
      .btn { 
        padding: 0.75rem 1.5rem; 
        border-radius: 0.5rem; 
        font-weight: 600; 
        text-decoration: none; 
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease-in-out;
        border: 2px solid transparent;
        cursor: pointer;
        font-size: 1rem;
        line-height: 1.5;
      }
      
      .btn-primary { 
        background: #2563eb; 
        color: white; 
      }
      
      .btn-primary:hover {
        background: #1d4ed8;
        transform: translateY(-1px);
      }
      
      .btn-outline {
        background: transparent;
        border-color: currentColor;
      }
      
      .btn-lg {
        padding: 1rem 2rem;
        font-size: 1.125rem;
      }
      
      /* Card Critical Styles */
      .card {
        background: white;
        border-radius: 0.75rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        overflow: hidden;
      }
      
      .card-content {
        padding: 1.5rem;
      }
      
      /* Responsive Grid */
      .grid {
        display: grid;
        gap: 2rem;
      }
      
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      
      @media (min-width: 768px) {
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
      
      /* Utility Classes for Critical Path */
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      .text-right { text-align: right; }
      
      .font-bold { font-weight: 700; }
      .font-semibold { font-weight: 600; }
      .font-medium { font-weight: 500; }
      
      .text-white { color: white; }
      .text-gray-900 { color: #111827; }
      .text-gray-700 { color: #374151; }
      .text-gray-600 { color: #4b5563; }
      
      .bg-white { background-color: white; }
      .bg-gray-50 { background-color: #f9fafb; }
      
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .mb-8 { margin-bottom: 2rem; }
      .mb-12 { margin-bottom: 3rem; }
      
      .py-16 { padding-top: 4rem; padding-bottom: 4rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      
      /* Performance Optimizations */
      .animate-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
      
      /* Image optimization */
      img {
        height: auto;
        max-width: 100%;
      }
      
      .aspect-video { aspect-ratio: 16 / 9; }
      .aspect-square { aspect-ratio: 1 / 1; }
      
      /* Loading states */
      .loading-skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;

    const pageSpecificCSS = {
      landing: `
        .gradient-hero { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
          color: white;
        }
        
        .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
          gap: 2rem;
          margin-top: 3rem;
        }
        
        .stat-card {
          text-align: center;
          padding: 2rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          backdrop-filter: blur(10px);
        }
        
        .stat-number {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }
      `,
      
      news: `
        .news-header {
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
          color: white;
          padding: 4rem 0;
        }
        
        .news-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        
        @media (min-width: 1024px) {
          .news-grid {
            grid-template-columns: 2fr 1fr;
          }
        }
        
        .news-card { 
          border: 1px solid #e5e7eb; 
          border-radius: 0.75rem; 
          padding: 1.5rem;
          background: white; 
        }
        
        .news-meta { 
          font-size: 0.875rem; 
          color: #6b7280; 
          margin-bottom: 1rem;
        }
        
        .news-title {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 1rem;
        }
        
        .news-excerpt {
          color: #4b5563;
          line-height: 1.6;
        }
      `,
      
      clinic: `
        .clinic-header {
          background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          color: white;
          padding: 4rem 0;
        }
        
        .clinic-info { 
          display: grid; 
          gap: 2rem; 
        }
        
        @media (min-width: 1024px) {
          .clinic-info {
            grid-template-columns: 2fr 1fr;
          }
        }
        
        .clinic-details {
          background: white;
          border-radius: 0.75rem;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .clinic-hours { 
          font-size: 0.875rem; 
          line-height: 1.8;
        }
        
        .clinic-contact {
          background: #f9fafb;
          border-radius: 0.75rem;
          padding: 1.5rem;
        }
      `,
      
      general: ``
    };

    return commonCSS + (pageSpecificCSS[type as keyof typeof pageSpecificCSS] || '');
  };

  const criticalCSS = generateCriticalCSS(pageType);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: criticalCSS
      }}
    />
  );
};

// Hook for dynamic critical CSS injection
export const useCriticalCSS = (pageType: 'landing' | 'news' | 'clinic' | 'general') => {
  React.useEffect(() => {
    // Preload non-critical CSS
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = '/css/main.css';
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);

    // Remove loading class once fonts are loaded
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.body.classList.remove('fonts-loading');
        document.body.classList.add('fonts-loaded');
      });
    }

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return { pageType };
};

export default CriticalCSS;