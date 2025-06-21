// Performance optimization utilities for large HTML5 content
export class ContentOptimizer {
  private contentCache: Map<string, string> = new Map();
  private imageCache: Map<string, string> = new Map();
  private loadedPages: Set<number> = new Set();
  private preloadedPages: Set<number> = new Set();
  private maxCacheSize = 50; // Maximum pages to keep in memory
  private maxImageCacheSize = 100; // Maximum images to cache

  // Optimize HTML content by lazy loading images and media
  optimizeContent(html: string, pageNumber: number): string {
    const cacheKey = `page_${pageNumber}`;
    
    if (this.contentCache.has(cacheKey)) {
      return this.contentCache.get(cacheKey)!;
    }

    let optimizedHtml = html;

    // Replace images with lazy loading placeholders
    optimizedHtml = this.optimizeImages(optimizedHtml, pageNumber);
    
    // Optimize embedded scripts for better performance
    optimizedHtml = this.optimizeScripts(optimizedHtml);
    
    // Add intersection observer for lazy loading
    optimizedHtml = this.addLazyLoadingObserver(optimizedHtml, pageNumber);

    // Cache the optimized content
    this.cacheContent(cacheKey, optimizedHtml);
    
    return optimizedHtml;
  }

  private optimizeImages(html: string, pageNumber: number): string {
    // Replace img tags with lazy loading versions
    return html.replace(
      /<img([^>]*?)src=["']([^"']*?)["']([^>]*?)>/gi,
      (match, before, src, after) => {
        const imageId = `img_${pageNumber}_${this.generateImageId(src)}`;
        const placeholder = this.generatePlaceholder(200, 150);
        
        return `<img${before}src="${placeholder}" data-lazy-src="${src}" data-image-id="${imageId}" class="lazy-image"${after} loading="lazy" onload="this.classList.add('loaded')">`;
      }
    );
  }

  private optimizeScripts(html: string): string {
    // Defer script execution to improve initial load time
    return html.replace(
      /<script([^>]*?)>/gi,
      '<script$1 defer>'
    );
  }

  private addLazyLoadingObserver(html: string, pageNumber: number): string {
    const observerScript = `
      <script defer>
        (function() {
          if (typeof window.contentObserver === 'undefined') {
            window.contentObserver = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  const img = entry.target;
                  const lazySrc = img.getAttribute('data-lazy-src');
                  if (lazySrc) {
                    img.src = lazySrc;
                    img.removeAttribute('data-lazy-src');
                    window.contentObserver.unobserve(img);
                  }
                }
              });
            }, { rootMargin: '50px' });
          }
          
          // Observe all lazy images on this page
          setTimeout(() => {
            document.querySelectorAll('.lazy-image[data-lazy-src]').forEach(img => {
              window.contentObserver.observe(img);
            });
          }, 100);
        })();
      </script>
    `;

    return html + observerScript;
  }

  private generatePlaceholder(width: number, height: number): string {
    // Generate a lightweight SVG placeholder
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='100%25' height='100%25' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E`;
  }

  private generateImageId(src: string): string {
    // Simple hash function for image URLs
    let hash = 0;
    for (let i = 0; i < src.length; i++) {
      const char = src.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  private cacheContent(key: string, content: string): void {
    // Implement LRU cache for content
    if (this.contentCache.size >= this.maxCacheSize) {
      const firstKey = this.contentCache.keys().next().value;
      this.contentCache.delete(firstKey);
    }
    this.contentCache.set(key, content);
  }

  // Preload adjacent pages for smooth navigation
  preloadAdjacentPages(currentPage: number, totalPages: number, getPageContent: (page: number) => string): void {
    const pagesToPreload = [
      currentPage + 1,
      currentPage + 2,
      currentPage - 1,
      currentPage - 2
    ].filter(page => page >= 1 && page <= totalPages && !this.preloadedPages.has(page));

    pagesToPreload.forEach(page => {
      if (!this.preloadedPages.has(page)) {
        // Preload in the background
        setTimeout(() => {
          try {
            const content = getPageContent(page);
            this.optimizeContent(content, page);
            this.preloadedPages.add(page);
          } catch (error) {
            console.warn(`Failed to preload page ${page}:`, error);
          }
        }, 100);
      }
    });
  }

  // Clean up unused cache entries
  cleanup(currentPage: number, keepRange: number = 5): void {
    const keysToRemove: string[] = [];
    
    this.contentCache.forEach((_, key) => {
      const pageMatch = key.match(/page_(\d+)/);
      if (pageMatch) {
        const pageNum = parseInt(pageMatch[1]);
        if (Math.abs(pageNum - currentPage) > keepRange) {
          keysToRemove.push(key);
        }
      }
    });

    keysToRemove.forEach(key => {
      this.contentCache.delete(key);
      const pageMatch = key.match(/page_(\d+)/);
      if (pageMatch) {
        this.preloadedPages.delete(parseInt(pageMatch[1]));
      }
    });
  }

  // Get memory usage statistics
  getMemoryStats(): { 
    cachedPages: number;
    preloadedPages: number;
    cacheSize: number;
    imageCacheSize: number;
  } {
    return {
      cachedPages: this.contentCache.size,
      preloadedPages: this.preloadedPages.size,
      cacheSize: this.maxCacheSize,
      imageCacheSize: this.maxImageCacheSize
    };
  }

  // Force clear all caches
  clearAllCaches(): void {
    this.contentCache.clear();
    this.imageCache.clear();
    this.loadedPages.clear();
    this.preloadedPages.clear();
  }
}

// Virtual scrolling for large content
export class VirtualContentRenderer {
  private containerHeight: number;
  private itemHeight: number;
  private buffer: number;

  constructor(containerHeight: number, itemHeight: number = 100, buffer: number = 5) {
    this.containerHeight = containerHeight;
    this.itemHeight = itemHeight;
    this.buffer = buffer;
  }

  calculateVisibleRange(scrollTop: number, totalItems: number): { start: number; end: number } {
    const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(totalItems - 1, start + visibleCount + this.buffer * 2);

    return { start, end };
  }

  getItemStyle(index: number): React.CSSProperties {
    return {
      position: 'absolute',
      top: index * this.itemHeight,
      left: 0,
      right: 0,
      height: this.itemHeight,
    };
  }

  getTotalHeight(totalItems: number): number {
    return totalItems * this.itemHeight;
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTiming(label: string): void {
    const key = `${label}_start`;
    this.recordMetric(key, performance.now());
  }

  endTiming(label: string): number {
    const startKey = `${label}_start`;
    const endTime = performance.now();
    const startTimes = this.metrics.get(startKey);
    
    if (startTimes && startTimes.length > 0) {
      const startTime = startTimes.pop()!;
      const duration = endTime - startTime;
      this.recordMetric(label, duration);
      return duration;
    }
    
    return 0;
  }

  private recordMetric(label: string, value: number): void {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, []);
    }
    
    const values = this.metrics.get(label)!;
    values.push(value);
    
    // Keep only the last 100 measurements
    if (values.length > 100) {
      values.shift();
    }
  }

  getAverageMetric(label: string): number {
    const values = this.metrics.get(label);
    if (!values || values.length === 0) return 0;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetricSummary(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const summary: Record<string, { avg: number; min: number; max: number; count: number }> = {};
    
    this.metrics.forEach((values, label) => {
      if (label.endsWith('_start')) return;
      
      if (values.length > 0) {
        summary[label] = {
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          count: values.length
        };
      }
    });
    
    return summary;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

// Global instances
export const contentOptimizer = new ContentOptimizer();
export const performanceMonitor = new PerformanceMonitor();