import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  X,
  List,
  Monitor,
  RotateCcw,
  Maximize2,
  BookmarkPlus
} from 'lucide-react';
import { BookTableOfContents } from './BookTableOfContents';

interface BookControlsProps {
  showControls: boolean;
  currentPage: number;
  totalPages: number;
  zoom: number;
  isMultimediaContent: boolean;
  showTableOfContents: boolean;
  showInteractiveMode: boolean;
  bookmarkPages: number[];
  bookTitle?: string;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom?: () => void;
  onToggleBookmark: (page: number) => void;
  onToggleTableOfContents: () => void;
  onToggleInteractiveMode: () => void;
  onClose?: () => void;
}

export const BookControls: React.FC<BookControlsProps> = ({
  showControls,
  currentPage,
  totalPages,
  zoom,
  isMultimediaContent,
  showTableOfContents,
  showInteractiveMode,
  bookmarkPages,
  bookTitle,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleBookmark,
  onToggleTableOfContents,
  onToggleInteractiveMode,
  onClose
}) => {
  return (
    <>
      {/* Top margin controls - Book title and status */}
      <div className={`absolute top-4 left-4 right-4 flex items-center justify-between z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
          {bookTitle || 'Interactive Book'}
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-black bg-opacity-60 text-white px-3 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
            Page {currentPage} of {totalPages}
          </div>
          {zoom !== 100 && (
            <div className="bg-blue-500 bg-opacity-80 text-white px-3 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
              {zoom}% zoom
            </div>
          )}
        </div>
      </div>
      
      {/* Left margin controls - Previous page */}
      <div className={`absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPreviousPage} 
          disabled={currentPage <= 1}
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation"
        >
          <ChevronLeft className="h-6 w-6 sm:h-5 sm:w-5" />
        </Button>
      </div>
      
      {/* Right margin controls - Next page */}
      <div className={`absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNextPage} 
          disabled={currentPage >= totalPages}
          className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation"
        >
          <ChevronRight className="h-6 w-6 sm:h-5 sm:w-5" />
        </Button>
      </div>
      
      {/* Bottom margin controls - Tools and navigation */}
      <div className={`absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center justify-between z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        {/* Left tools */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Table of Contents */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleTableOfContents}
              className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full w-10 h-10 sm:w-8 sm:h-8 touch-manipulation"
              title="Table of Contents"
            >
              <List className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
            
            <BookTableOfContents
              isVisible={showTableOfContents}
              onGoToPage={onGoToPage}
              onClose={() => onToggleTableOfContents()}
            />
          </div>
          
          {/* Interactive Mode Toggle */}
          {isMultimediaContent && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleInteractiveMode}
              className={`${showInteractiveMode ? 'bg-blue-500 bg-opacity-80' : 'bg-black bg-opacity-30'} hover:bg-opacity-50 text-white border-0 rounded-full`}
              title="Interactive Mode (Press 'I')"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          )}

          {/* Zoom controls */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onZoomOut} 
            disabled={zoom <= 25}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
            title="Zoom Out (Ctrl + -)"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <div 
            className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs min-w-[50px] text-center cursor-pointer hover:bg-opacity-70 transition-all"
            onClick={onResetZoom}
            title="Click to reset zoom"
          >
            {zoom}%
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onZoomIn} 
            disabled={zoom >= 300}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
            title="Zoom In (Ctrl + +)"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {onResetZoom && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onResetZoom}
              className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
              title="Reset Zoom (Ctrl + 0)"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Center - Page input and quick navigation */}
        <div className="flex items-center space-x-2">
          <div className="bg-black bg-opacity-50 rounded-full px-4 py-2 flex items-center space-x-2">
            <span className="text-white text-sm">Page</span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onGoToPage(page);
                }
              }}
              className="w-16 px-2 py-1 text-center bg-transparent text-white border-0 focus:outline-none text-sm"
              min="1"
              max={totalPages}
            />
            <span className="text-white text-sm">of {totalPages}</span>
          </div>
          
          {/* Quick jump buttons */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onGoToPage(1)}
            disabled={currentPage === 1}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
            title="First Page"
          >
            <span className="text-xs">First</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onGoToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
            title="Last Page"
          >
            <span className="text-xs">Last</span>
          </Button>
        </div>
        
        {/* Right tools */}
        <div className="flex items-center space-x-2">
          {/* Bookmark */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleBookmark(currentPage)}
            className={`${bookmarkPages.includes(currentPage) ? 'bg-yellow-500 bg-opacity-90 shadow-lg' : 'bg-black bg-opacity-30'} hover:bg-opacity-70 text-white border-0 rounded-full transition-all duration-200`}
            title={bookmarkPages.includes(currentPage) ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark className={`h-4 w-4 ${bookmarkPages.includes(currentPage) ? 'fill-current' : ''}`} />
          </Button>
          
          {/* Bookmarks count indicator */}
          {bookmarkPages.length > 0 && (
            <div className="bg-yellow-500 bg-opacity-80 text-white px-2 py-1 rounded-full text-xs shadow-lg">
              {bookmarkPages.length} saved
            </div>
          )}
          
          {/* Close */}
          {onClose && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </>
  );
};