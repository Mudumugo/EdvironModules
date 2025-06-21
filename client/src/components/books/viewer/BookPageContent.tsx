import React from 'react';
import { BookOpen, Bookmark } from 'lucide-react';

interface BookPageContentProps {
  bookData?: {
    pages?: string[];
    totalPages?: number;
  };
  currentPage: number;
  zoom: number;
  rotation: number;
  panOffset?: { x: number; y: number };
  isPageTurning: boolean;
  pageTransition: 'none' | 'next' | 'prev';
  bookmarkPages: number[];
  pageRef: React.RefObject<HTMLDivElement>;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export const BookPageContent: React.FC<BookPageContentProps> = ({
  bookData,
  currentPage,
  zoom,
  rotation,
  panOffset = { x: 0, y: 0 },
  isPageTurning,
  pageTransition,
  bookmarkPages,
  pageRef,
  onTouchStart,
  onTouchEnd
}) => {
  return (
    <div
      ref={pageRef}
      className={`w-full h-full flex items-center justify-center page-content-transition ${
        isPageTurning ? 'pointer-events-none' : ''
      } ${
        pageTransition === 'next' ? 'page-turn-animation-next' : 
        pageTransition === 'prev' ? 'page-turn-animation-prev' : ''
      }`}
      style={{
        transform: `scale(${zoom / 100}) rotate(${rotation}deg) translate(${panOffset.x}px, ${panOffset.y}px)`,
        transformOrigin: 'center center',
        transition: isPageTurning ? 'none' : 'transform 0.2s ease-out'
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {bookData?.pages && bookData?.pages[currentPage - 1] ? (
        <div className="relative w-full h-full flex items-center justify-center">
          {bookData?.pages?.[currentPage - 1]?.startsWith('data:text/html') ? (
            <iframe
              src={bookData.pages[currentPage - 1]}
              className="w-full h-full border-0 rounded-lg"
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              title={`Page ${currentPage}`}
              sandbox="allow-scripts allow-same-origin allow-forms"
            />
          ) : bookData?.pages?.[currentPage - 1]?.startsWith('http') || bookData?.pages?.[currentPage - 1]?.startsWith('data:image') ? (
            <img
              src={bookData?.pages?.[currentPage - 1] || ''}
              alt={`Page ${currentPage}`}
              className="object-contain w-full h-full"
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%'
              }}
            />
          ) : (
            <div 
              className="w-full h-full overflow-auto bg-white rounded-lg shadow-inner p-4"
              style={{ 
                maxWidth: '100%',
                maxHeight: '100%'
              }}
              dangerouslySetInnerHTML={{ __html: bookData?.pages?.[currentPage - 1] || '' }}
            />
          )}
          
          {/* Bookmark indicator */}
          {bookmarkPages.includes(currentPage) && (
            <div className="absolute top-2 right-2 z-10">
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-bl-lg text-xs font-semibold">
                <Bookmark className="h-3 w-3 inline mr-1" />
                <span className="hidden sm:inline">Bookmarked</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-lg">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
            <p className="text-blue-600 font-medium text-lg">Page {currentPage}</p>
            <p className="text-sm text-blue-400 mt-2">Loading content...</p>
          </div>
        </div>
      )}
    </div>
  );
};