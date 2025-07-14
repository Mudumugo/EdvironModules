// Performance analytics and monitoring

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, PerformanceObserver> = new Map();
  private isInitialized = false;

  init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.initWebVitals();
    this.initNavigationTiming();
    this.initResourceTiming();
    this.initUserTiming();
    
    this.isInitialized = true;
    console.log('[Performance] Tracker initialized');
  }

  private initWebVitals() {
    // Core Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.addMetric('LCP', lastEntry.renderTime || lastEntry.loadTime, {
          element: lastEntry.element?.tagName
        });
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (e) {
        console.warn('[Performance] LCP observer not supported');
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          this.addMetric('FID', entry.processingStart - entry.startTime, {
            eventType: entry.name
          });
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (e) {
        console.warn('[Performance] FID observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.addMetric('CLS', clsValue);
          }
        });
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (e) {
        console.warn('[Performance] CLS observer not supported');
      }
    }
  }

  private initNavigationTiming() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        this.addMetric('DOM_CONTENT_LOADED', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
        this.addMetric('LOAD_EVENT', navigation.loadEventEnd - navigation.loadEventStart);
        this.addMetric('TOTAL_LOAD_TIME', navigation.loadEventEnd - navigation.navigationStart);
        this.addMetric('DNS_LOOKUP', navigation.domainLookupEnd - navigation.domainLookupStart);
        this.addMetric('TCP_CONNECT', navigation.connectEnd - navigation.connectStart);
        this.addMetric('TTFB', navigation.responseStart - navigation.requestStart);
      });
    }
  }

  private initResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceResourceTiming) => {
          // Track slow resources
          const duration = entry.responseEnd - entry.startTime;
          if (duration > 1000) { // Resources taking more than 1 second
            this.addMetric('SLOW_RESOURCE', duration, {
              url: entry.name,
              type: entry.initiatorType,
              size: entry.transferSize
            });
          }
        });
      });

      try {
        resourceObserver.observe({ entryTypes: ['resource'] });
        this.observers.set('resource', resourceObserver);
      } catch (e) {
        console.warn('[Performance] Resource observer not supported');
      }
    }
  }

  private initUserTiming() {
    if ('PerformanceObserver' in window) {
      const userTimingObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.addMetric(`USER_${entry.name.toUpperCase()}`, entry.duration || 0, {
            entryType: entry.entryType
          });
        });
      });

      try {
        userTimingObserver.observe({ entryTypes: ['measure', 'mark'] });
        this.observers.set('userTiming', userTimingObserver);
      } catch (e) {
        console.warn('[Performance] User timing observer not supported');
      }
    }
  }

  addMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata
    };

    this.metrics.push(metric);

    // Log slow operations
    if (value > 1000) {
      console.warn(`[Performance] Slow operation: ${name} took ${value.toFixed(2)}ms`, metadata);
    }

    // Keep only last 100 metrics
    if (this.metrics.length > 100) {
      this.metrics.shift();
    }

    // Emit custom event for real-time monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('performanceMetric', { detail: metric }));
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  mark(name: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      performance.mark(name);
    }
  }

  measure(name: string, startMark: string, endMark?: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }
      } catch (e) {
        console.warn(`[Performance] Failed to measure ${name}:`, e);
      }
    }
  }

  getReport(): Record<string, any> {
    const report: Record<string, any> = {};
    
    // Group metrics by name
    const metricGroups = this.metrics.reduce((groups, metric) => {
      if (!groups[metric.name]) {
        groups[metric.name] = [];
      }
      groups[metric.name].push(metric.value);
      return groups;
    }, {} as Record<string, number[]>);

    // Calculate statistics for each metric
    Object.entries(metricGroups).forEach(([name, values]) => {
      const sorted = values.sort((a, b) => a - b);
      report[name] = {
        count: values.length,
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        median: sorted[Math.floor(sorted.length / 2)],
        min: Math.min(...values),
        max: Math.max(...values),
        p95: sorted[Math.floor(sorted.length * 0.95)]
      };
    });

    return report;
  }

  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics = [];
    this.isInitialized = false;
  }
}

// Export singleton instance
export const performanceTracker = new PerformanceTracker();

// React hook for performance tracking
export const usePerformanceTracking = () => {
  const startTiming = (name: string) => {
    performanceTracker.mark(`${name}-start`);
  };

  const endTiming = (name: string) => {
    performanceTracker.mark(`${name}-end`);
    performanceTracker.measure(name, `${name}-start`, `${name}-end`);
  };

  const trackComponentRender = (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      performanceTracker.addMetric(`COMPONENT_RENDER_${componentName}`, endTime - startTime);
    };
  };

  return {
    startTiming,
    endTiming,
    trackComponentRender,
    addMetric: performanceTracker.addMetric.bind(performanceTracker),
    getMetrics: performanceTracker.getMetrics.bind(performanceTracker),
    getReport: performanceTracker.getReport.bind(performanceTracker)
  };
};

// Initialize performance tracking
if (typeof window !== 'undefined') {
  performanceTracker.init();
}