// Performance Optimization Utilities for COLONAiVE
// Targets Mobile PSI >90, Core Web Vitals optimization, and SEO performance

export interface PerformanceConfig {
  enableImageOptimization: boolean;
  enableLazyLoading: boolean;
  compressImages: boolean;
  minifyAssets: boolean;
  enableCaching: boolean;
  enablePreloading: boolean;
}

export interface ImageOptimizationOptions {
  format: 'webp' | 'avif' | 'jpeg';
  quality: number;
  sizes: number[];
  lazyLoad: boolean;
  placeholder: 'blur' | 'empty';
}

export class PerformanceOptimizer {
  
  private static readonly DEFAULT_CONFIG: PerformanceConfig = {
    enableImageOptimization: true,
    enableLazyLoading: true,
    compressImages: true,
    minifyAssets: true,
    enableCaching: true,
    enablePreloading: true
  };

  /**
   * Generate optimized image component with WebP support and lazy loading
   */
  static generateOptimizedImage(
    src: string, 
    alt: string, 
    options: Partial<ImageOptimizationOptions> = {}
  ): any {
    const config = {
      format: 'webp',
      quality: 85,
      sizes: [320, 640, 768, 1024, 1280, 1920],
      lazyLoad: true,
      placeholder: 'blur',
      ...options
    };

    return {
      component: 'OptimizedImage',
      props: {
        src,
        alt,
        loading: config.lazyLoad ? 'lazy' : 'eager',
        decoding: 'async',
        sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
        srcSet: config.sizes.map(size => 
          `${this.generateImageUrl(src, size, config.format, config.quality)} ${size}w`
        ).join(', '),
        style: {
          aspectRatio: 'auto',
          objectFit: 'cover'
        },
        onLoad: 'handleImageLoad',
        onError: 'handleImageError'
      }
    };
  }

  /**
   * Generate image URL with optimization parameters
   */
  private static generateImageUrl(
    src: string, 
    width: number, 
    format: string, 
    quality: number
  ): string {
    // In production, this would integrate with image CDN (Cloudinary, ImageKit, etc.)
    const baseUrl = src.startsWith('http') ? src : `https://colonaive.com${src}`;
    return `${baseUrl}?w=${width}&f=${format}&q=${quality}`;
  }

  /**
   * Generate critical CSS for above-the-fold content
   */
  static generateCriticalCSS(pageType: 'landing' | 'news' | 'clinic'): string {
    const commonCSS = `
      /* Critical CSS for Core Web Vitals */
      * { box-sizing: border-box; }
      body { margin: 0; font-family: system-ui, -apple-system, sans-serif; }
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      
      /* Above-fold hero styles */
      .hero { min-height: 60vh; display: flex; align-items: center; }
      .hero-title { font-size: clamp(2rem, 5vw, 4rem); font-weight: bold; line-height: 1.2; }
      .hero-subtitle { font-size: clamp(1rem, 3vw, 1.5rem); margin: 1rem 0; }
      
      /* Navigation critical styles */
      .nav { position: fixed; top: 0; width: 100%; z-index: 50; background: white; }
      .nav-logo { height: 2.5rem; width: auto; }
      
      /* Button critical styles */
      .btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: 600; text-decoration: none; display: inline-block; }
      .btn-primary { background: #2563eb; color: white; }
    `;

    const pageSpecificCSS = {
      landing: `
        .gradient-hero { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
      `,
      news: `
        .news-card { border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; }
        .news-meta { font-size: 0.875rem; color: #6b7280; }
      `,
      clinic: `
        .clinic-info { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        .clinic-hours { font-size: 0.875rem; }
      `
    };

    return commonCSS + pageSpecificCSS[pageType];
  }

  /**
   * Generate resource preloading directives
   */
  static generatePreloadDirectives(pageType: string): Array<{
    rel: string;
    href: string;
    as: string;
    crossorigin?: string;
  }> {
    const commonPreloads = [
      { rel: 'preload', href: '/fonts/inter-var.woff2', as: 'font', crossorigin: 'anonymous' },
      { rel: 'preload', href: '/images/colonaive-logo.webp', as: 'image' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com', as: 'document' },
      { rel: 'preconnect', href: 'https://www.google-analytics.com', as: 'document' }
    ];

    const pageSpecificPreloads = {
      landing: [
        { rel: 'preload', href: '/images/hero-background.webp', as: 'image' },
        { rel: 'preload', href: '/api/stats', as: 'fetch', crossorigin: 'anonymous' }
      ],
      news: [
        { rel: 'preload', href: '/api/news', as: 'fetch', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/images/news-placeholder.webp', as: 'image' }
      ],
      clinic: [
        { rel: 'preload', href: '/api/clinics', as: 'fetch', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/images/clinic-default.webp', as: 'image' }
      ]
    };

    return [
      ...commonPreloads,
      ...(pageSpecificPreloads[pageType as keyof typeof pageSpecificPreloads] || [])
    ];
  }

  /**
   * Generate lazy loading intersection observer
   */
  static generateLazyLoadObserver(): string {
    return `
      // Intersection Observer for lazy loading
      const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.srcset = img.dataset.srcset;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });

      // Apply to all lazy images
      document.querySelectorAll('img[data-src]').forEach(img => {
        lazyImageObserver.observe(img);
      });
    `;
  }

  /**
   * Generate performance monitoring script
   */
  static generatePerformanceMonitoring(): string {
    return `
      // Core Web Vitals monitoring
      import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

      const sendToAnalytics = (metric) => {
        // Send to Google Analytics 4
        gtag('event', metric.name, {
          custom_parameter_1: metric.value,
          custom_parameter_2: metric.rating,
          custom_parameter_3: metric.delta
        });
        
        // Send to custom analytics
        fetch('/api/analytics/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metric)
        });
      };

      // Track all Core Web Vitals
      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);

      // Page-specific performance tracking
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        const navigation = performance.getEntriesByType('navigation')[0];
        
        sendToAnalytics({
          name: 'page_load_time',
          value: loadTime,
          rating: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'needs-improvement' : 'poor'
        });
      });
    `;
  }

  /**
   * Generate service worker for caching
   */
  static generateServiceWorker(): string {
    return `
      const CACHE_NAME = 'colonaive-v1';
      const STATIC_ASSETS = [
        '/',
        '/manifest.json',
        '/images/colonaive-logo.webp',
        '/css/critical.css',
        '/js/main.js'
      ];

      // Install event - cache static assets
      self.addEventListener('install', event => {
        event.waitUntil(
          caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
        );
      });

      // Fetch event - serve from cache, fallback to network
      self.addEventListener('fetch', event => {
        if (event.request.method !== 'GET') return;
        
        event.respondWith(
          caches.match(event.request)
            .then(response => {
              if (response) return response;
              
              return fetch(event.request).then(response => {
                // Cache successful responses
                if (response.status === 200) {
                  const responseClone = response.clone();
                  caches.open(CACHE_NAME)
                    .then(cache => cache.put(event.request, responseClone));
                }
                return response;
              });
            })
            .catch(() => {
              // Fallback for offline
              if (event.request.destination === 'document') {
                return caches.match('/offline.html');
              }
            })
        );
      });

      // Activate event - clean up old caches
      self.addEventListener('activate', event => {
        event.waitUntil(
          caches.keys().then(cacheNames => {
            return Promise.all(
              cacheNames.map(cacheName => {
                if (cacheName !== CACHE_NAME) {
                  return caches.delete(cacheName);
                }
              })
            );
          })
        );
      });
    `;
  }

  /**
   * Generate bundle optimization configuration
   */
  static generateBundleConfig(): any {
    return {
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 20
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true
            },
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react-vendor',
              chunks: 'all',
              priority: 30
            }
          }
        },
        usedExports: true,
        sideEffects: false,
        minimizer: [
          {
            terserOptions: {
              compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug']
              },
              mangle: true,
              format: {
                comments: false
              }
            }
          }
        ]
      },
      resolve: {
        alias: {
          '@': './src'
        }
      },
      plugins: [
        // Image optimization
        {
          name: 'image-optimization',
          generateBundle() {
            // Convert images to WebP/AVIF
            // Implement responsive image generation
          }
        },
        // Critical CSS extraction
        {
          name: 'critical-css',
          generateBundle() {
            // Extract critical CSS for each page type
          }
        }
      ]
    };
  }

  /**
   * Generate performance budget configuration
   */
  static generatePerformanceBudget(): any {
    return {
      budgets: [
        {
          type: 'bundle',
          name: 'main',
          maximumWarning: '1mb',
          maximumError: '2mb'
        },
        {
          type: 'initial',
          maximumWarning: '500kb',
          maximumError: '1mb'
        },
        {
          type: 'anyComponentStyle',
          maximumWarning: '50kb',
          maximumError: '100kb'
        }
      ],
      performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      },
      lighthouse: {
        'first-contentful-paint': 1500,
        'largest-contentful-paint': 2500,
        'first-input-delay': 100,
        'cumulative-layout-shift': 0.1,
        'speed-index': 2000,
        'performance-score': 90
      }
    };
  }
}

export default PerformanceOptimizer;