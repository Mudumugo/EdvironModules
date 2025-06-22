import React from 'react';
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

interface BookViewerControlsProps {
  currentPage: number;
  totalPages: number;
  zoom: number;
  bookmarkPages: number[];
  showControls: boolean;
  showPerformanceStats: boolean;
  showScaleControls: boolean;
  showDebugPanel: boolean;
  onClose: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleBookmark: () => void;
  onTogglePerformanceStats: () => void;
  onToggleScaleControls: () => void;
  onToggleDebugPanel: () => void;
  bookTitle?: string;
}

const BookViewerControls: React.FC<BookViewerControlsProps> = ({
  currentPage,
  totalPages,
  zoom,
  bookmarkPages,
  showControls,
  showPerformanceStats,
  showScaleControls,
  showDebugPanel,
  onClose,
  onPreviousPage,
  onNextPage,
  onZoomIn,
  onZoomOut,
  onToggleBookmark,
  onTogglePerformanceStats,
  onToggleScaleControls,
  onToggleDebugPanel,
  bookTitle
}) => {
  return (
    <>
      {/* Top Controls */}
      <div className={`absolute top-4 left-4 right-4 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="flex items-center justify-between">
          {/* Left side - Navigation */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.history.back()}
              className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm"
              title="Back"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Center - Book title and controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onZoomOut}
                disabled={zoom <= 25}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm disabled:opacity-30"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onZoomIn}
                disabled={zoom >= 300}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm disabled:opacity-30"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleBookmark}
                className={`${bookmarkPages.includes(currentPage) ? 'bg-yellow-500 bg-opacity-90' : 'bg-black bg-opacity-60'} hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm`}
                title={bookmarkPages.includes(currentPage) ? 'Remove Bookmark' : 'Add Bookmark'}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
              <BookOpen className="h-4 w-4 inline mr-2" />
              {bookTitle || 'Interactive Book'}
            </div>
          </div>
          
          {/* Right side - Status indicators and debug tools */}
          <div className="flex items-center space-x-2">
            <div className="bg-black bg-opacity-60 text-white px-3 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
              Page {currentPage} of {totalPages}
            </div>
            {zoom !== 100 && (
              <div className="bg-blue-500 bg-opacity-80 text-white px-3 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm">
                {zoom}% zoom
              </div>
            )}
            
            {/* Debug tools */}
            <div className="flex items-center space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onTogglePerformanceStats}
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm"
                title="Performance Stats"
              >
                <Activity className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleScaleControls}
                className={`${showScaleControls ? 'bg-blue-500 bg-opacity-90' : 'bg-black bg-opacity-60'} hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm`}
                title="Display Settings"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onToggleDebugPanel}
                  className={`${showDebugPanel ? 'bg-red-500 bg-opacity-90' : 'bg-black bg-opacity-60'} hover:bg-opacity-80 text-white border-0 rounded-full w-9 h-9 shadow-lg backdrop-blur-sm`}
                  title="Debug Panel"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { BookViewerControls };