import React, { useState } from 'react';
import { contentOptimizer, performanceMonitor } from '@/lib/performance/contentOptimizer';
import { ResponsiveWrapper } from '@/components/adaptive/ResponsiveWrapper';
import { ScaleControls } from '@/components/adaptive/ScaleControls';
import { useAdaptiveScaling } from '@/hooks/useAdaptiveScaling';
import { useBookViewer } from '@/hooks/useBookViewer';
import BookViewerCore from './viewer/BookViewerCore';
import BookViewerControls from './viewer/BookViewerControls';
import BookViewerNavigation from './viewer/BookViewerNavigation';
import { BookOpen } from 'lucide-react';

interface LibraryBookViewerProps {
  bookData?: {
    id: number;
    title: string;
    author?: string;
    totalPages?: number;
    pages?: string[];
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
    content?: string;
    mediaAssets?: any[];
    interactiveElements?: any[];
    trackingConfig?: any;
  };
  onClose?: () => void;
  className?: string;
}

export const LibraryBookViewer: React.FC<LibraryBookViewerProps> = ({ 
  bookData, 
  onClose, 
  className = '' 
}) => {
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const { deviceInfo } = useAdaptiveScaling();
  const totalPages = bookData?.totalPages || 15;
  
  const {
    currentPage,
    zoom,
    bookmarkPages,
    showControls,
    isLoading,
    showPerformanceStats,
    showDebugPanel,
    showScaleControls,
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
  } = useBookViewer(bookData, totalPages);

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
    <ResponsiveWrapper 
      className={`fixed inset-0 z-[999999] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden ${className}`}
      enableScaling={false}
    >
      <div 
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
              
              <BookViewerCore
                bookData={bookData}
                currentPage={currentPage}
                zoom={zoom}
                isLoading={isLoading}
                contentRef={contentRef}
              />
            </div>
            
            <BookViewerControls
              currentPage={currentPage}
              totalPages={totalPages}
              zoom={zoom}
              bookmarkPages={bookmarkPages}
              showControls={showControls}
              showPerformanceStats={showPerformanceStats}
              showScaleControls={showScaleControls}
              showDebugPanel={showDebugPanel}
              onClose={() => onClose?.()}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onToggleBookmark={toggleBookmark}
              onTogglePerformanceStats={togglePerformanceStats}
              onToggleScaleControls={toggleScaleControls}
              onToggleDebugPanel={toggleDebugPanel}
              bookTitle={bookData?.title}
            />

            <BookViewerNavigation
              currentPage={currentPage}
              totalPages={totalPages}
              showControls={showControls}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
            />
            
            {/* Table of Contents */}
            {renderTableOfContents()}
          </div>
        </div>
        
        {/* Performance Stats Modal */}
        {showPerformanceStats && (
          <PerformanceStatsModal 
            onClose={() => togglePerformanceStats()}
            currentPage={currentPage}
          />
        )}
        
        {/* Scale Controls */}
        {showScaleControls && (
          <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-[999999]">
            <ScaleControls 
              showAdvanced={deviceInfo.type === 'desktop'}
              onClose={() => toggleScaleControls()}
            />
          </div>
        )}
        
        {/* Debug Panel */}
        {showDebugPanel && process.env.NODE_ENV === 'development' && (
          <DebugPanel 
            onClose={() => toggleDebugPanel()}
            currentPage={currentPage}
            bookData={bookData}
          />
        )}
      </div>
    </ResponsiveWrapper>
  );
};

// Performance Stats Modal Component
const PerformanceStatsModal: React.FC<{
  onClose: () => void;
  currentPage: number;
}> = ({ onClose, currentPage }) => {
  const [stats, setStats] = useState<any>({});

  React.useEffect(() => {
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
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2">Memory Usage</h4>
            <div className="text-sm space-y-1">
              <div>Cached Pages: {stats.memory?.cachedPages || 0}</div>
              <div>Preloaded Pages: {stats.memory?.preloadedPages || 0}</div>
              <div>Cache Limit: {stats.memory?.cacheSize || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Debug Panel Component
const DebugPanel: React.FC<{
  onClose: () => void;
  currentPage: number;
  bookData: any;
}> = ({ onClose, currentPage, bookData }) => {
  return (
    <div className="fixed inset-0 z-[999999] bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b bg-red-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-red-800">Debug Panel</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
        </div>
        <div className="p-4">
          <div className="text-sm">
            <div>Current Page: {currentPage}</div>
            <div>Book ID: {bookData?.id}</div>
            <div>Title: {bookData?.title}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryBookViewer;