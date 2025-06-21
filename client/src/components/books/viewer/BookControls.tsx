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
  BookmarkPlus,
  Menu,
  Home,
  BookOpen
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
      {/* Top header - Enhanced with navigation icons */}
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
              className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-10 h-10 sm:w-9 sm:h-9 touch-manipulation shadow-lg backdrop-blur-sm transition-all duration-200"
              title="Return to Library"
            >
              <Home className="h-5 w-5 sm:h-4 sm:w-4" />
            </Button>
          )}
          
          {/* Table of Contents icon */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleTableOfContents}
            className={`${showTableOfContents ? 'bg-blue-500 bg-opacity-90' : 'bg-black bg-opacity-60'} hover:bg-opacity-80 text-white border-0 rounded-full w-10 h-10 sm:w-9 sm:h-9 touch-manipulation shadow-lg backdrop-blur-sm transition-all duration-200`}
            title="Table of Contents"
          >
            <BookOpen className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
          
          {/* Book title */}
          <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm">
            {bookTitle || 'Interactive Book'}
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
        </div>
      </div>
      
      {/* Left margin controls - Previous page */}
      <div className={`absolute left-2 sm:left-4 md:left-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onPreviousPage} 
          disabled={currentPage <= 1}
          className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-14 h-14 sm:w-12 sm:h-12 md:w-10 md:h-10 touch-manipulation shadow-lg backdrop-blur-sm"
        >
          <ChevronLeft className="h-7 w-7 sm:h-6 sm:w-6 md:h-5 md:w-5" />
        </Button>
      </div>
      
      {/* Right margin controls - Next page */}
      <div className={`absolute right-2 sm:right-4 md:right-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onNextPage} 
          disabled={currentPage >= totalPages}
          className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-14 h-14 sm:w-12 sm:h-12 md:w-10 md:h-10 touch-manipulation shadow-lg backdrop-blur-sm"
        >
          <ChevronRight className="h-7 w-7 sm:h-6 sm:w-6 md:h-5 md:w-5" />
        </Button>
      </div>
      
      {/* Bottom margin controls - Tools and navigation */}
      <div className={`absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-10 transition-all duration-500 ${
        showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        
        {/* Mobile-first responsive layout */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          
          {/* Top row on mobile - Page navigation */}
          <div className="flex items-center justify-center space-x-2 sm:order-2">
            <div className="bg-black bg-opacity-60 rounded-full px-4 py-3 sm:px-4 sm:py-2 flex items-center space-x-2 shadow-lg backdrop-blur-sm">
              <span className="text-white text-sm font-medium">Page</span>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    onGoToPage(page);
                  }
                }}
                className="w-12 sm:w-16 px-2 py-1 text-center bg-transparent text-white border-0 focus:outline-none text-sm font-medium"
                min="1"
                max={totalPages}
              />
              <span className="text-white text-sm">of {totalPages}</span>
            </div>
            
            {/* Quick jump buttons - hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onGoToPage(1)}
                disabled={currentPage === 1}
                className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
                title="First Page"
              >
                First
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onGoToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full px-3 py-2 text-xs shadow-lg backdrop-blur-sm"
                title="Last Page"
              >
                Last
              </Button>
            </div>
          </div>

          {/* Bottom row on mobile - Tools */}
          <div className="flex items-center justify-between sm:justify-start sm:space-x-2 sm:order-1">
            
            {/* Left tools group */}
            <div className="flex items-center space-x-2">
              {/* Table of Contents - Now positioned in header too */}
              <div className="relative">
                <BookTableOfContents
                  isVisible={showTableOfContents}
                  onGoToPage={onGoToPage}
                  onClose={() => onToggleTableOfContents()}
                  currentPage={currentPage}
                />
              </div>
              
              {/* Interactive Mode Toggle */}
              {isMultimediaContent && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onToggleInteractiveMode}
                  className={`${showInteractiveMode ? 'bg-blue-500 bg-opacity-80' : 'bg-black bg-opacity-40'} hover:bg-opacity-60 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation shadow-lg backdrop-blur-sm`}
                  title="Interactive Mode"
                >
                  <Monitor className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              )}

              {/* Zoom controls */}
              <div className="flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onZoomOut} 
                  disabled={zoom <= 25}
                  className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation shadow-lg backdrop-blur-sm"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
                
                <div 
                  className="bg-black bg-opacity-60 text-white px-3 py-2 sm:px-2 sm:py-1 rounded-full text-sm sm:text-xs min-w-[60px] sm:min-w-[50px] text-center cursor-pointer hover:bg-opacity-70 transition-all shadow-lg backdrop-blur-sm"
                  onClick={onResetZoom}
                  title="Reset zoom"
                >
                  {zoom}%
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onZoomIn} 
                  disabled={zoom >= 300}
                  className="bg-black bg-opacity-40 hover:bg-opacity-60 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation shadow-lg backdrop-blur-sm"
                  title="Zoom In"
                >
                  <ZoomIn className="h-5 w-5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
            
            {/* Right tools group */}
            <div className="flex items-center space-x-2">
              {/* Bookmark */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onToggleBookmark(currentPage)}
                className={`${bookmarkPages.includes(currentPage) ? 'bg-yellow-500 bg-opacity-90' : 'bg-black bg-opacity-40'} hover:bg-opacity-70 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation shadow-lg backdrop-blur-sm transition-all duration-200`}
                title={bookmarkPages.includes(currentPage) ? 'Remove bookmark' : 'Add bookmark'}
              >
                <Bookmark className={`h-5 w-5 sm:h-4 sm:w-4 ${bookmarkPages.includes(currentPage) ? 'fill-current' : ''}`} />
              </Button>
              
              {/* Bookmarks count indicator - mobile optimized */}
              {bookmarkPages.length > 0 && (
                <div className="bg-yellow-500 bg-opacity-90 text-white px-3 py-2 sm:px-2 sm:py-1 rounded-full text-sm sm:text-xs shadow-lg backdrop-blur-sm font-medium">
                  {bookmarkPages.length}
                </div>
              )}
              
              {/* Additional close button in bottom controls */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleTableOfContents}
                className={`${showTableOfContents ? 'bg-blue-500 bg-opacity-90' : 'bg-black bg-opacity-40'} hover:bg-opacity-70 text-white border-0 rounded-full w-12 h-12 sm:w-10 sm:h-10 touch-manipulation shadow-lg backdrop-blur-sm transition-all duration-200`}
                title="Table of Contents"
              >
                <BookOpen className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};