import React, { useRef } from 'react';
import InteractiveContentViewer from '@/components/multimedia/InteractiveContentViewer';
import {
  BookPageContent,
  BookControls,
  useBookNavigation,
  useBookTracking,
  useBookViewerControls,
  useBookKeyboardNavigation
} from './viewer';

interface BookViewerProps {
  resource?: any;
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
    content?: string;
    mediaAssets?: any[];
    interactiveElements?: any[];
    trackingConfig?: any;
  };
  onClose?: () => void;
  className?: string;
}

export const BookViewer: React.FC<BookViewerProps> = ({ bookData, onClose, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Detect if this is multimedia/interactive content
  const isMultimediaContent = bookData?.isInteractive || bookData?.hasVideo || bookData?.hasAudio || 
                             bookData?.type === 'interactive' || bookData?.type === 'html5';

  // Initialize tracking
  const { trackPageView, trackBookmark } = useBookTracking(bookData);

  // Initialize controls
  const {
    zoom,
    rotation,
    bookmarkPages,
    showTableOfContents,
    showInteractiveMode,
    showControls,
    zoomIn,
    zoomOut,
    toggleBookmark,
    setShowTableOfContents,
    setShowInteractiveMode,
    handleUserActivity
  } = useBookViewerControls();

  // Initialize navigation
  const {
    currentPage,
    isPageTurning,
    pageTransition,
    pageStartTime,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    handleTouchStart,
    handleTouchEnd
  } = useBookNavigation({
    totalPages: bookData?.totalPages || 0,
    onTrackPageView: (page) => trackPageView(page, pageStartTime)
  });

  // Handle bookmark with tracking
  const handleToggleBookmark = (page: number) => {
    const action = bookmarkPages.includes(page) ? 'removed' : 'added';
    toggleBookmark(page);
    trackBookmark(action, page);
  };

  // Initialize keyboard navigation
  useBookKeyboardNavigation({
    currentPage,
    totalPages: bookData?.totalPages || 0,
    showTableOfContents,
    showInteractiveMode,
    isMultimediaContent,
    onPreviousPage: goToPreviousPage,
    onNextPage: goToNextPage,
    onGoToPage: goToPage,
    onToggleTableOfContents: () => setShowTableOfContents(!showTableOfContents),
    onToggleInteractiveMode: () => setShowInteractiveMode(!showInteractiveMode),
    onUserActivity: handleUserActivity,
    onClose
  });

  // Check if we should show interactive content viewer
  if (showInteractiveMode && isMultimediaContent) {
    return (
      <InteractiveContentViewer
        resourceId={bookData?.id || 0}
        title={bookData?.title || ''}
        content={bookData?.content || ''}
        mediaAssets={bookData?.mediaAssets || []}
        interactiveElements={bookData?.interactiveElements || []}
        xapiEnabled={bookData?.xapiEnabled || false}
        trackingConfig={bookData?.trackingConfig || {}}
        onClose={() => setShowInteractiveMode(false)}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed top-0 left-0 right-0 bottom-0 z-[999999] bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden ${className}`}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
    >
      {/* Flipbook-style Book Container - Full immersive viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* The Book itself - Responsive dimensions for all devices */}
        <div className="relative w-full h-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4">
          
          {/* Book Shadow and 3D Effect */}
          <div className="relative bg-white rounded-lg shadow-2xl transform transition-all duration-300 w-full h-full max-w-5xl max-h-[95vh] sm:max-h-[90vh]" 
               style={{
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
               }}>
            
            {/* Book Content Area */}
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <div className="w-full h-full flex items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6">
                <BookPageContent
                  bookData={bookData}
                  currentPage={currentPage}
                  zoom={zoom}
                  rotation={rotation}
                  isPageTurning={isPageTurning}
                  pageTransition={pageTransition}
                  bookmarkPages={bookmarkPages}
                  pageRef={pageRef}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                />
              </div>
            </div>
            
            {/* Flipbook-style overlay controls integrated into book margins */}
            <BookControls
              showControls={showControls}
              currentPage={currentPage}
              totalPages={bookData?.totalPages || 0}
              zoom={zoom}
              isMultimediaContent={isMultimediaContent}
              showTableOfContents={showTableOfContents}
              showInteractiveMode={showInteractiveMode}
              bookmarkPages={bookmarkPages}
              bookTitle={bookData?.title}
              onPreviousPage={goToPreviousPage}
              onNextPage={goToNextPage}
              onGoToPage={goToPage}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onToggleBookmark={handleToggleBookmark}
              onToggleTableOfContents={() => setShowTableOfContents(!showTableOfContents)}
              onToggleInteractiveMode={() => setShowInteractiveMode(!showInteractiveMode)}
              onClose={onClose}
            />
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookViewer;