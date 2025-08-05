// Performance Monitor Component for Core Web Vitals tracking
import { useEffect } from 'react';

interface PerformanceConfig {
  enableVitalsTracking: boolean;
  enableAnalytics: boolean;
  debugMode: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceConfig> = ({
  enableVitalsTracking = true,
  enableAnalytics = true,
  debugMode = false
}) => {

  useEffect(() => {
    if (!enableVitalsTracking) return;

    const sendMetric = (metric: any) => {
      if (debugMode) {
        console.log(`[Performance] ${metric.name}:`, metric);
      }

      // Send to analytics if enabled
      if (enableAnalytics && typeof gtag !== 'undefined') {
        gtag('event', metric.name, {
          event_category: 'Web Vitals',
          value: Math.round(metric.value),
          custom_parameter_1: metric.rating,
          non_interaction: true
        });
      }

      // Send to custom analytics endpoint
      if (enableAnalytics) {
        fetch('/api/analytics/vitals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
            url: window.location.href,
            timestamp: Date.now()
          })
        }).catch(err => {
          if (debugMode) console.error('Failed to send vitals:', err);
        });
      }
    };

    // Dynamic import of web-vitals to reduce bundle size
    const loadWebVitals = async () => {
      try {
        // Use dynamic import to avoid bundling web-vitals in SSR
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        
        // Track all Core Web Vitals
        getCLS(sendMetric);
        getFID(sendMetric);
        getFCP(sendMetric);
        getLCP(sendMetric);
        getTTFB(sendMetric);

        if (debugMode) {
          console.log('[Performance] Web Vitals tracking initialized');
        }
      } catch (error) {
        if (debugMode) {
          console.error('[Performance] Failed to load web-vitals:', error);
        }
      }
    };

    // Load web-vitals only in browser environment
    if (typeof window !== 'undefined') {
      loadWebVitals();
    }

    // Additional performance tracking
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          connection: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          load: navigation.loadEventEnd - navigation.navigationStart
        };

        if (debugMode) {
          console.log('[Performance] Page load metrics:', metrics);
        }

        sendMetric({
          name: 'page_load_complete',
          value: metrics.load,
          rating: metrics.load < 2000 ? 'good' : metrics.load < 4000 ? 'needs-improvement' : 'poor'
        });
      }
    };

    // Track page load when DOM is ready
    if (document.readyState === 'complete') {
      trackPageLoad();
    } else {
      window.addEventListener('load', trackPageLoad);
    }

    // Performance Observer for additional metrics
    if ('PerformanceObserver' in window) {
      try {
        // Long Task Observer
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              sendMetric({
                name: 'long_task',
                value: entry.duration,
                rating: entry.duration < 50 ? 'good' : 'poor'
              });
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Layout Shift Observer (for debugging CLS)
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            if (debugMode && entry.hadRecentInput === false) {
              console.log('[Performance] Layout shift:', entry.value, entry.sources);
            }
          });
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

      } catch (error) {
        if (debugMode) {
          console.error('[Performance] PerformanceObserver error:', error);
        }
      }
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', trackPageLoad);
    };
  }, [enableVitalsTracking, enableAnalytics, debugMode]);

  // This component doesn't render anything
  return null;
};

// Hook for programmatic performance monitoring
export const usePerformanceMonitoring = (config: Partial<PerformanceConfig> = {}) => {
  const defaultConfig: PerformanceConfig = {
    enableVitalsTracking: true,
    enableAnalytics: true,
    debugMode: process.env.NODE_ENV === 'development'
  };

  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    // Track route changes in SPA
    const trackRouteChange = () => {
      if (finalConfig.debugMode) {
        console.log('[Performance] Route changed:', window.location.pathname);
      }
    };

    // Listen for route changes (adjust based on your router)
    window.addEventListener('popstate', trackRouteChange);
    
    return () => {
      window.removeEventListener('popstate', trackRouteChange);
    };
  }, [finalConfig.debugMode]);

  const trackCustomMetric = (name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor') => {
    if (finalConfig.enableAnalytics && typeof gtag !== 'undefined') {
      gtag('event', name, {
        event_category: 'Custom Performance',
        value: Math.round(value),
        custom_parameter_1: rating,
        non_interaction: true
      });
    }

    if (finalConfig.debugMode) {
      console.log(`[Performance] Custom metric ${name}:`, { value, rating });
    }
  };

  const trackUserTiming = (name: string, startTime?: number) => {
    if (typeof window !== 'undefined' && window.performance) {
      if (startTime) {
        const duration = performance.now() - startTime;
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        trackCustomMetric(name, duration, duration < 1000 ? 'good' : duration < 3000 ? 'needs-improvement' : 'poor');
        
        return duration;
      } else {
        performance.mark(`${name}-start`);
        return performance.now();
      }
    }
    return 0;
  };

  return {
    trackCustomMetric,
    trackUserTiming,
    config: finalConfig
  };
};

export default PerformanceMonitor;