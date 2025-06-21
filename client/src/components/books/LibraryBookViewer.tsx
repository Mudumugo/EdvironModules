import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  X,
  Home,
  BookOpen,
  Menu,
  Activity
} from 'lucide-react';
import { contentOptimizer, performanceMonitor } from '@/lib/performance/contentOptimizer';

interface LibraryBookViewerProps {
  bookData?: {
    id: number;
    title: string;
    author?: string;
    pages: string[];
    totalPages: number;
    thumbnailUrl?: string;
    description?: string;
    grade?: string;
    subject?: string;
    language?: string;
    type?: string;
    isInteractive?: boolean;
    hasVideo?: boolean;
    hasAudio?: boolean;
    xapiEnabled?: boolean;
  };
  onClose?: () => void;
  className?: string;
}

export const LibraryBookViewer: React.FC<LibraryBookViewerProps> = ({ 
  bookData, 
  onClose, 
  className = '' 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [bookmarkPages, setBookmarkPages] = useState<number[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPerformanceStats, setShowPerformanceStats] = useState(false);
  
  const contentRef = useRef<HTMLDivElement>(null);
  const pageChangeTimeoutRef = useRef<NodeJS.Timeout>();

  const totalPages = bookData?.totalPages || 15;

  // Handle user activity to show/hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      timeout = setTimeout(() => setShowControls(false), 3000);
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
    if (bookData?.pages && bookData.pages.length > 0) {
      // Preload adjacent pages when book opens
      contentOptimizer.preloadAdjacentPages(
        currentPage, 
        totalPages, 
        (pageNum) => bookData.pages[pageNum - 1] || ''
      );
    }

    return () => {
      // Cleanup when component unmounts
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
      }
    };
  }, [bookData, currentPage, totalPages]);

  // Monitor memory usage and cleanup if needed
  useEffect(() => {
    const memoryCheckInterval = setInterval(() => {
      const memoryStats = contentOptimizer.getMemoryStats();
      
      // If cache is getting full, cleanup more aggressively
      if (memoryStats.cachedPages > memoryStats.cacheSize * 0.8) {
        contentOptimizer.cleanup(currentPage, 2);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(memoryCheckInterval);
  }, [currentPage]);

  // Handle xAPI messages from interactive content
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'xapi') {
        // Track interaction via xAPI
        fetch('/api/xapi/statements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            verb: event.data.verb,
            object: event.data.object,
            result: event.data.result || {},
            context: {
              bookId: bookData?.id,
              bookTitle: bookData?.title,
              page: currentPage
            }
          })
        }).catch(console.error);
      } else if (event.data?.type === 'navigate') {
        setCurrentPage(event.data.page);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [bookData, currentPage]);

  // Optimized page navigation with performance tracking
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      performanceMonitor.startTiming('pageNavigation');
      setIsLoading(true);
      
      // Clear previous timeout
      if (pageChangeTimeoutRef.current) {
        clearTimeout(pageChangeTimeoutRef.current);
      }
      
      // Debounce page changes for better performance
      pageChangeTimeoutRef.current = setTimeout(() => {
        setCurrentPage(page);
        
        // Cleanup old content and preload adjacent pages
        contentOptimizer.cleanup(page, 3);
        
        if (bookData?.pages) {
          contentOptimizer.preloadAdjacentPages(
            page, 
            totalPages, 
            (pageNum) => bookData.pages[pageNum - 1] || ''
          );
        }
        
        setIsLoading(false);
        performanceMonitor.endTiming('pageNavigation');
      }, 100);
    }
  }, [currentPage, totalPages, bookData]);

  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  const zoomIn = () => setZoom(prev => Math.min(prev + 25, 300));
  const zoomOut = () => setZoom(prev => Math.max(prev - 25, 25));
  const resetZoom = () => setZoom(100);

  const toggleBookmark = (page: number) => {
    setBookmarkPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

  // Optimized content rendering with caching and lazy loading
  const renderPageContent = useMemo(() => {
    const pageContent = bookData?.pages?.[currentPage - 1];
    
    if (!pageContent) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading page {currentPage}...</p>
          </div>
        </div>
      );
    }

    performanceMonitor.startTiming('contentOptimization');
    const optimizedContent = contentOptimizer.optimizeContent(pageContent, currentPage);
    performanceMonitor.endTiming('contentOptimization');

    return (
      <div 
        ref={contentRef}
        className={`w-full h-full bg-white rounded-lg shadow-sm overflow-auto transition-opacity duration-200 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        style={{
          padding: zoom > 150 ? '1rem' : zoom > 100 ? '1.5rem' : '2rem',
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
        }}
        dangerouslySetInnerHTML={{ __html: optimizedContent }}
      />
    );
  }, [currentPage, bookData?.pages, zoom, isLoading]);

  const renderTableOfContents = () => {
    if (!showTableOfContents) return null;

    const chapters = [
      { title: "Cover Page", page: 1 },
      { title: "Table of Contents", page: 2 },
      { title: "Chapter 1: Introduction", page: 3 },
      { title: "Chapter 2: Interactive Elements", page: 5 },
      { title: "Chapter 3: Practical Applications", page: 8 },
      { title: "Interactive Assessments", page: 11 }
    ];

    return (
      <div className="fixed inset-4 sm:absolute sm:top-full sm:left-0 sm:inset-auto sm:mt-2 sm:w-80 md:w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[80vh] sm:max-h-80 md:max-h-96 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4 border-b pb-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-lg text-gray-900">Table of Contents</h3>
            </div>
            <button 
              onClick={() => setShowTableOfContents(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-2">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => {
                  goToPage(chapter.page);
                  setShowTableOfContents(false);
                }}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  currentPage === chapter.page
                    ? 'bg-blue-100 border-blue-500 text-blue-900 border'
                    : 'hover:bg-blue-50 border border-transparent'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{chapter.title}</span>
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                    Page {chapter.page}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className={`fixed inset-0 z-[999999] bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
    >
      {/* Book Container */}
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center px-1 sm:px-4 md:px-6 lg:px-8 py-1 sm:py-4">
          
          {/* Book Shadow and 3D Effect */}
          <div className="relative bg-white rounded-lg shadow-2xl transform transition-all duration-300 w-full h-full max-w-full sm:max-w-5xl max-h-full sm:max-h-[90vh]" 
               style={{
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
               }}>
            
            {/* Book Content Area */}
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <div className="w-full h-full flex items-center justify-center p-1 sm:p-3 md:p-4 lg:p-6">
                {renderPageContent}
              </div>
              
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
                  <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm shadow-lg">
                    Loading page {currentPage}...
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced Header with Navigation */}
            <div className={`absolute top-4 left-4 right-4 flex items-center justify-between z-10 transition-all duration-500 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
              
              {/* Left side - Navigation icons and book title */}
              <div className="flex items-center space-x-3">
                {/* Home icon */}
                {onClose && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onClose}
                    className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-10 h-10 sm:w-9 sm:h-9 shadow-lg backdrop-blur-sm transition-all duration-200"
                    title="Return to Library"
                  >
                    <Home className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                )}
                
                {/* Table of Contents icon */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(!showTableOfContents)}
                    className={`${showTableOfContents ? 'bg-blue-500 bg-opacity-90' : 'bg-black bg-opacity-60'} hover:bg-opacity-80 text-white border-0 rounded-full w-10 h-10 sm:w-9 sm:h-9 shadow-lg backdrop-blur-sm transition-all duration-200`}
                    title="Table of Contents"
                  >
                    <BookOpen className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                  
                  {renderTableOfContents()}
                </div>
                
                {/* Book title */}
                <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
                  {bookData?.title || 'Interactive Book'}
                </div>
              </div>
              
              {/* Right side - Status indicators */}
              <div className="flex items-center space-x-2">
                <div className="bg-black bg-opacity-60 text-white px-3 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
                  Page {currentPage} of {totalPages}
                </div>
                {zoom !== 100 && (
                  <div className="bg-blue-500 bg-opacity-80 text-white px-3 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
                    {zoom}% zoom
                  </div>
                )}
                
                {/* Performance indicator */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowPerformanceStats(!showPerformanceStats)}
                  className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm"
                  title="Performance Stats"
                >
                  <Activity className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Side Navigation */}
            <div className={`absolute left-2 sm:left-4 md:left-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
              showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPreviousPage} 
                disabled={currentPage <= 1}
                className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-14 h-14 sm:w-12 sm:h-12 md:w-10 md:h-10 shadow-lg backdrop-blur-sm"
              >
                <ChevronLeft className="h-7 w-7 sm:h-6 sm:w-6 md:h-5 md:w-5" />
              </Button>
            </div>
            
            <div className={`absolute right-2 sm:right-4 md:right-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
              showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={currentPage >= totalPages}
                className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-14 h-14 sm:w-12 sm:h-12 md:w-10 md:h-10 shadow-lg backdrop-blur-sm"
              >
                <ChevronRight className="h-7 w-7 sm:h-6 sm:w-6 md:h-5 md:w-5" />
              </Button>
            </div>
            
            {/* Bottom Controls */}
            <div className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10 transition-all duration-500 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                
                {/* Page navigation */}
                <div className="flex items-center justify-center space-x-2 sm:order-2">
                  <div className="bg-black bg-opacity-60 rounded-full px-4 py-3 sm:px-4 sm:py-2 flex items-center space-x-2 shadow-lg backdrop-blur-sm">
                    <span className="text-white text-sm font-medium">Page</span>
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= totalPages) {
                          goToPage(page);
                        }
                      }}
                      className="w-12 sm:w-16 px-2 py-1 text-center bg-transparent text-white border-0 focus:outline-none text-sm font-medium"
                      min="1"
                      max={totalPages}
                    />
                    <span className="text-white text-sm">of {totalPages}</span>
                  </div>
                </div>

                {/* Tools */}
                <div className="flex items-center justify-between sm:justify-start sm:space-x-2 sm:order-1">
                  
                  {/* Left tools */}
                  <div className="flex items-center space-x-2">
                    {/* Zoom controls */}
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={zoomOut} 
                        disabled={zoom <= 25}
                        className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 shadow-lg backdrop-blur-sm"
                        title="Zoom Out"
                      >
                        <ZoomOut className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                      
                      <div 
                        className="bg-black bg-opacity-60 text-white px-3 py-2 sm:px-2 sm:py-1 rounded-full text-sm sm:text-xs min-w-[60px] sm:min-w-[50px] text-center cursor-pointer hover:bg-opacity-70 transition-all shadow-lg backdrop-blur-sm"
                        onClick={resetZoom}
                        title="Reset zoom"
                      >
                        {zoom}%
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={zoomIn} 
                        disabled={zoom >= 300}
                        className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 shadow-lg backdrop-blur-sm"
                        title="Zoom In"
                      >
                        <ZoomIn className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Right tools */}
                  <div className="flex items-center space-x-2">
                    {/* Bookmark */}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleBookmark(currentPage)}
                      className={`${bookmarkPages.includes(currentPage) ? 'bg-yellow-500 bg-opacity-90' : 'bg-black bg-opacity-40'} hover:bg-opacity-70 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 shadow-lg backdrop-blur-sm transition-all duration-200`}
                      title={bookmarkPages.includes(currentPage) ? 'Remove bookmark' : 'Add bookmark'}
                    >
                      <Bookmark className={`h-5 w-5 sm:h-4 sm:w-4 ${bookmarkPages.includes(currentPage) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    {/* Bookmarks count */}
                    {bookmarkPages.length > 0 && (
                      <div className="bg-yellow-500 bg-opacity-90 text-white px-3 py-2 sm:px-2 sm:py-1 rounded-full text-sm sm:text-xs shadow-lg backdrop-blur-sm font-medium">
                        {bookmarkPages.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Performance Stats Modal */}
      {showPerformanceStats && (
        <PerformanceStatsModal 
          onClose={() => setShowPerformanceStats(false)}
          currentPage={currentPage}
        />
      )}
    </div>
  );
};

// Performance Stats Modal Component
const PerformanceStatsModal: React.FC<{
  onClose: () => void;
  currentPage: number;
}> = ({ onClose, currentPage }) => {
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const updateStats = () => {
      const performanceStats = performanceMonitor.getMetricSummary();
      const memoryStats = contentOptimizer.getMemoryStats();
      setStats({ performance: performanceStats, memory: memoryStats });
    };

    updateStats();
    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Performance Stats</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Memory Stats */}
          <div>
            <h4 className="font-medium mb-2">Memory Usage</h4>
            <div className="text-sm space-y-1">
              <div>Cached Pages: {stats.memory?.cachedPages || 0}</div>
              <div>Preloaded Pages: {stats.memory?.preloadedPages || 0}</div>
              <div>Cache Limit: {stats.memory?.cacheSize || 0}</div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div>
            <h4 className="font-medium mb-2">Performance Metrics</h4>
            <div className="text-sm space-y-1">
              {Object.entries(stats.performance || {}).map(([key, value]: [string, any]) => (
                <div key={key} className="flex justify-between">
                  <span>{key}:</span>
                  <span>{value.avg.toFixed(2)}ms avg</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Current Status */}
          <div>
            <h4 className="font-medium mb-2">Current Status</h4>
            <div className="text-sm space-y-1">
              <div>Current Page: {currentPage}</div>
              <div>Memory: {(performance.memory as any)?.usedJSHeapSize ? 
                `${Math.round((performance.memory as any).usedJSHeapSize / 1024 / 1024)}MB` : 'N/A'}</div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                contentOptimizer.clearAllCaches();
                performanceMonitor.clearMetrics();
              }}
              className="w-full"
            >
              Clear All Caches
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryBookViewer;