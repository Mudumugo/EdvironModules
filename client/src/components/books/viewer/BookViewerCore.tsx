import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import { contentOptimizer, performanceMonitor } from '@/lib/performance/contentOptimizer';
import { useAdaptiveScaling } from '@/hooks/useAdaptiveScaling';

interface BookViewerCoreProps {
  bookData?: {
    pages?: string[];
    id?: number;
    title?: string;
  };
  currentPage: number;
  zoom: number;
  isLoading: boolean;
  contentRef: React.RefObject<HTMLDivElement>;
}

const BookViewerCore: React.FC<BookViewerCoreProps> = ({
  bookData,
  currentPage,
  zoom,
  isLoading,
  contentRef
}) => {
  const { 
    deviceInfo, 
    isCompactMode, 
    getScaledValue, 
    adaptiveStyles,
    scaleFactor 
  } = useAdaptiveScaling();

  const renderPageContent = useMemo(() => {
    const pageContent = bookData?.pages?.[currentPage - 1];
    
    if (!pageContent) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <BookOpen className={`${isCompactMode ? 'h-12 w-12' : 'h-16 w-16'} text-gray-400 mx-auto mb-4 animate-pulse`} />
            <p className={`text-gray-600 ${isCompactMode ? 'text-sm' : 'text-base'}`}>
              Loading page {currentPage}...
            </p>
          </div>
        </div>
      );
    }

    performanceMonitor.startTiming('contentOptimization');
    const optimizedContent = contentOptimizer.optimizeContent(pageContent, currentPage);
    performanceMonitor.endTiming('contentOptimization');

    // Adaptive padding based on device and scale
    const adaptivePadding = getScaledValue(
      deviceInfo.type === 'mobile' ? 12 : 
      deviceInfo.type === 'tablet' ? 20 : 24
    );

    // Combined zoom and adaptive scaling
    const totalScale = (zoom / 100) * scaleFactor;

    return (
      <div 
        ref={contentRef}
        className={`w-full h-full bg-white rounded-lg shadow-sm overflow-auto transition-opacity duration-200 ${
          isLoading ? 'opacity-50' : 'opacity-100'
        }`}
        style={{
          padding: `${adaptivePadding}px`,
          transform: `scale(${totalScale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          fontSize: adaptiveStyles.fontSize,
          lineHeight: adaptiveStyles.lineHeight
        }}
        dangerouslySetInnerHTML={{ __html: optimizedContent }}
      />
    );
  }, [currentPage, bookData?.pages, zoom, isLoading, isCompactMode, deviceInfo, getScaledValue, scaleFactor, adaptiveStyles, contentRef]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div 
        className={`w-full h-full flex items-center justify-center ${
          isCompactMode ? 'p-1' : 'p-1 sm:p-3 md:p-4 lg:p-6'
        }`}
        style={{ 
          padding: getScaledValue(isCompactMode ? 8 : 16) 
        }}
      >
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
  );
};

export default BookViewerCore;