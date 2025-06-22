import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  bookViewerDebugger, 
  bookViewerProfiler, 
  bookViewerMemoryMonitor 
} from '@/lib/debug/bookViewerDebugger';
import { contentOptimizer, performanceMonitor } from '@/lib/performance/contentOptimizer';
import { usePWAContext } from '@/components/PWAProvider';

interface BookViewerState {
  currentPage: number;
  zoom: number;
  bookmarkPages: number[];
  showControls: boolean;
  showTableOfContents: boolean;
  isLoading: boolean;
  showPerformanceStats: boolean;
  showDebugPanel: boolean;
  showScaleControls: boolean;
}

export const useBookViewer = (bookData?: any, totalPages: number = 15) => {
  const [state, setState] = useState<BookViewerState>({
    currentPage: 1,
    zoom: 100,
    bookmarkPages: [],
    showControls: true,
    showTableOfContents: false,
    isLoading: false,
    showPerformanceStats: false,
    showDebugPanel: false,
    showScaleControls: false
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const pageChangeTimeoutRef = useRef<NodeJS.Timeout>();
  const { cacheBookContent } = usePWAContext();

  // Handle user activity to show/hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setState(prev => ({ ...prev, showControls: true }));
      timeout = setTimeout(() => setState(prev => ({ ...prev, showControls: false })), 3000);
    };

    const handleActivity = () => resetTimeout();
    
    resetTimeout();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  // Initialize performance monitoring and preloading
  useEffect(() => {
    bookViewerDebugger.info('lifecycle', 'Book viewer initialized', {
      bookId: bookData?.id,
      title: bookData?.title,
      totalPages,
      hasPages: !!bookData?.pages
    });

    if (bookData?.pages && bookData.pages.length > 0) {
      bookViewerProfiler.start('initialPreload');
      
      // Preload adjacent pages when book opens
      contentOptimizer.preloadAdjacentPages(
        state.currentPage, 
        totalPages, 
        (pageNum) => bookData.pages[pageNum - 1] || ''
      );
      
      // Cache book content for offline access
      if (bookData) {
        cacheBookContent(bookData);
        bookViewerDebugger.info('pwa', 'Book content cached for offline access', {
          bookId: bookData.id,
          title: bookData.title
        });
      }
      
      bookViewerProfiler.end('initialPreload');
      bookViewerDebugger.info('preload', 'Initial preload completed', {
        currentPage: state.currentPage,
        totalPages
      });
    }

    return () => {
      bookViewerDebugger.info('lifecycle', 'Book viewer unmounting');
      
      // Cleanup when component unmounts
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
      }
    };
  }, [bookData, state.currentPage, totalPages, cacheBookContent]);

  // Monitor memory usage and cleanup if needed
  useEffect(() => {
    const memoryCheckInterval = setInterval(() => {
      const memoryStats = contentOptimizer.getMemoryStats();
      
      // If cache is getting full, cleanup more aggressively
      if (memoryStats.cachedPages > memoryStats.cacheSize * 0.8) {
        contentOptimizer.cleanup(state.currentPage, 2);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(memoryCheckInterval);
  }, [state.currentPage]);

  // Page navigation with performance tracking
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== state.currentPage) {
      bookViewerDebugger.info('navigation', `Navigating to page ${page}`, {
        from: state.currentPage,
        to: page,
        totalPages
      });
      
      bookViewerProfiler.start('pageNavigation', { from: state.currentPage, to: page });
      performanceMonitor.startTiming('pageNavigation');
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Clear previous timeout
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
        bookViewerDebugger.debug('navigation', 'Cleared previous navigation timeout');
      }
      
      // Debounce page changes for better performance
      pageChangeTimeoutRef.current = setTimeout(() => {
        try {
          setState(prev => ({ ...prev, currentPage: page }));
          
          // Cleanup old content and preload adjacent pages
          bookViewerProfiler.start('contentCleanup');
          contentOptimizer.cleanup(page, 3);
          bookViewerProfiler.end('contentCleanup');
          
          if (bookData?.pages) {
            bookViewerProfiler.start('adjacentPreload');
            contentOptimizer.preloadAdjacentPages(
              page, 
              totalPages, 
              (pageNum) => bookData.pages[pageNum - 1] || ''
            );
            bookViewerProfiler.end('adjacentPreload');
          }
          
          setState(prev => ({ ...prev, isLoading: false }));
          performanceMonitor.endTiming('pageNavigation');
          bookViewerProfiler.end('pageNavigation');
          
          bookViewerDebugger.info('navigation', `Successfully navigated to page ${page}`);
        } catch (error) {
          bookViewerDebugger.error('navigation', `Failed to navigate to page ${page}`, error);
          setState(prev => ({ ...prev, isLoading: false }));
        }
      }, 100);
    } else {
      bookViewerDebugger.warn('navigation', `Invalid page navigation attempt`, {
        page,
        currentPage: state.currentPage,
        totalPages,
        isValid: page >= 1 && page <= totalPages,
        isDifferent: page !== state.currentPage
      });
    }
  }, [state.currentPage, totalPages, bookData]);

  const goToNextPage = useCallback(() => goToPage(state.currentPage + 1), [goToPage, state.currentPage]);
  const goToPreviousPage = useCallback(() => goToPage(state.currentPage - 1), [goToPage, state.currentPage]);

  const zoomIn = useCallback(() => {
    setState(prev => ({ ...prev, zoom: Math.min(prev.zoom + 25, 300) }));
  }, []);

  const zoomOut = useCallback(() => {
    setState(prev => ({ ...prev, zoom: Math.max(prev.zoom - 25, 25) }));
  }, []);

  const toggleBookmark = useCallback(() => {
    setState(prev => ({
      ...prev,
      bookmarkPages: prev.bookmarkPages.includes(prev.currentPage)
        ? prev.bookmarkPages.filter(page => page !== prev.currentPage)
        : [...prev.bookmarkPages, prev.currentPage]
    }));
  }, []);

  const togglePerformanceStats = useCallback(() => {
    setState(prev => ({ ...prev, showPerformanceStats: !prev.showPerformanceStats }));
  }, []);

  const toggleScaleControls = useCallback(() => {
    setState(prev => ({ ...prev, showScaleControls: !prev.showScaleControls }));
  }, []);

  const toggleDebugPanel = useCallback(() => {
    setState(prev => ({ ...prev, showDebugPanel: !prev.showDebugPanel }));
  }, []);

  return {
    ...state,
    contentRef,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    zoomIn,
    zoomOut,
    toggleBookmark,
    togglePerformanceStats,
    toggleScaleControls,
    toggleDebugPanel
  };
};