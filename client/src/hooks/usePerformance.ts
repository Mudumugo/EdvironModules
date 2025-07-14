import { useEffect, useCallback, useRef } from 'react';

export const usePerformanceMonitor = () => {
  const metricsRef = useRef<{
    renderCount: number;
    lastRenderTime: number;
    totalRenderTime: number;
  }>({
    renderCount: 0,
    lastRenderTime: 0,
    totalRenderTime: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    metricsRef.current.renderCount++;
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      metricsRef.current.lastRenderTime = renderTime;
      metricsRef.current.totalRenderTime += renderTime;
      
      if (renderTime > 16) { // Slower than 60fps
        console.warn(`Slow render detected: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  const getMetrics = useCallback(() => ({
    ...metricsRef.current,
    averageRenderTime: metricsRef.current.totalRenderTime / metricsRef.current.renderCount
  }), []);

  return { getMetrics };
};

export const useImagePreloader = (imageSources: string[]) => {
  useEffect(() => {
    const preloadPromises = imageSources.map(src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.all(preloadPromises).catch(console.error);
  }, [imageSources]);
};

export const useVirtualScrolling = (
  items: any[],
  containerHeight: number,
  itemHeight: number,
  scrollTop: number
) => {
  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );
  
  const visibleItems = items.slice(visibleStart, visibleEnd);
  const offsetY = visibleStart * itemHeight;
  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    offsetY,
    totalHeight,
    visibleStart,
    visibleEnd
  };
};