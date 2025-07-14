// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Lazy component loader
export const createLazyComponent = (importFunc: () => Promise<any>) => {
  const React = require('react');
  return React.lazy(importFunc);
};

// Virtual scrolling helper
export const getVirtualItems = (
  totalItems: number,
  containerHeight: number,
  itemHeight: number,
  scrollTop: number
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight),
    totalItems - 1
  );
  
  return {
    visibleStart,
    visibleEnd,
    totalHeight: totalItems * itemHeight,
    offsetY: visibleStart * itemHeight
  };
};

// Image lazy loading observer
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback);
    },
    {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    }
  );
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
    };
  }
  return null;
};

// Preload images
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Bundle size optimizer - code splitting helper
export const loadChunk = async (chunkName: string) => {
  try {
    const module = await import(/* webpackChunkName: "[request]" */ `@/chunks/${chunkName}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load chunk: ${chunkName}`, error);
    return null;
  }
};