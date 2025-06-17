import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  BookOpen,
  Eye,
  Download,
  Share2,
  Bookmark,
  Settings,
  Volume2,
  VolumeX,
  Play,
  Pause,
  X
} from 'lucide-react';

interface BookViewerProps {
  bookData: {
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
  };
  onClose?: () => void;
  className?: string;
}

export const BookViewer: React.FC<BookViewerProps> = ({ bookData, onClose, className = '' }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [readingSpeed, setReadingSpeed] = useState(150); // words per minute
  const [bookmarkPages, setBookmarkPages] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'single' | 'double'>('single');
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Navigation functions
  const goToNextPage = () => {
    if (currentPage < bookData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= bookData.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Zoom functions
  const zoomIn = () => setZoom(Math.min(zoom + 25, 200));
  const zoomOut = () => setZoom(Math.max(zoom - 25, 50));
  const resetZoom = () => setZoom(100);

  // Rotation functions
  const rotateLeft = () => setRotation((rotation - 90) % 360);
  const rotateRight = () => setRotation((rotation + 90) % 360);
  const resetRotation = () => setRotation(0);

  // Fullscreen functions
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Bookmark functions
  const toggleBookmark = (pageNumber: number) => {
    setBookmarkPages(prev => 
      prev.includes(pageNumber) 
        ? prev.filter(p => p !== pageNumber)
        : [...prev, pageNumber]
    );
  };

  // Reading functions
  const toggleReading = () => {
    setIsReading(!isReading);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && !isReading) {
      const interval = setInterval(() => {
        if (currentPage < bookData.totalPages) {
          setCurrentPage(prev => prev + 1);
        } else {
          setIsAutoPlay(false);
        }
      }, 3000); // 3 seconds per page

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, currentPage, bookData.totalPages, isReading]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPreviousPage();
          break;
        case 'ArrowRight':
          goToNextPage();
          break;
        case 'Home':
          goToPage(1);
          break;
        case 'End':
          goToPage(bookData.totalPages);
          break;
        case 'Escape':
          if (isFullscreen) toggleFullscreen();
          break;
        case ' ':
          e.preventDefault();
          toggleAutoPlay();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, bookData.totalPages, isFullscreen]);

  const progressPercentage = (currentPage / bookData.totalPages) * 100;

  return (
    <div 
      ref={containerRef}
      className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg'} flex flex-col overflow-hidden ${className}`}
      style={{ height: isFullscreen ? '100vh' : 'min(95vh, 900px)' }}
    >
      {/* Header - Responsive */}
      <div className="flex items-center justify-between p-2 lg:p-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
        <div className="flex items-center space-x-2 lg:space-x-3 min-w-0">
          <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <h3 className="font-semibold text-sm lg:text-base text-gray-900 truncate">{bookData.title}</h3>
            {bookData.author && (
              <p className="text-xs text-gray-600 truncate">by {bookData.author}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 lg:space-x-2 flex-shrink-0">
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">{bookData.grade}</Badge>
          <Badge variant="outline" className="text-xs hidden sm:inline-flex">{bookData.subject}</Badge>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-1.5 lg:p-2 border-b bg-gray-50 gap-2 flex-shrink-0">
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Navigation */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-2 lg:px-3"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Previous</span>
          </Button>
          
          <span className="text-xs lg:text-sm font-medium px-2 lg:px-3 whitespace-nowrap">
            <span className="hidden sm:inline">Page </span>{currentPage} / {bookData.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === bookData.totalPages}
            className="px-2 lg:px-3"
          >
            <span className="hidden sm:inline mr-1">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Zoom Controls - Hidden on mobile, shown in bottom controls */}
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={zoomOut} className="px-2">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs min-w-[3rem] text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn} className="px-2">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Rotation Controls - Hidden on small screens */}
          <div className="hidden lg:flex items-center space-x-1">
            <Button variant="outline" size="sm" onClick={rotateLeft} className="px-2">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={rotateRight} className="px-2">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          {/* Auto-play */}
          <Button
            variant={isAutoPlay ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoPlay}
            className="px-2 hidden sm:inline-flex"
          >
            {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Bookmark */}
          <Button
            variant={bookmarkPages.includes(currentPage) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleBookmark(currentPage)}
            className="px-2"
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button variant="outline" size="sm" onClick={toggleFullscreen} className="px-2">
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-2 lg:px-3 py-1 bg-gray-50 border-b flex-shrink-0">
        <Progress value={progressPercentage} className="w-full h-1" />
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <span>Progress: {Math.round(progressPercentage)}%</span>
          <span className="hidden sm:inline">{bookData.totalPages} pages</span>
        </div>
      </div>

      {/* Main Book Content - Maximized viewing area */}
      <div className="flex-1 overflow-hidden bg-gray-100 relative">
        <div className="w-full h-full flex items-center justify-center p-1">
          <div
            ref={pageRef}
            className="bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
            }}
          >
            {bookData.pages && bookData.pages[currentPage - 1] ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={bookData.pages[currentPage - 1]}
                  alt={`Page ${currentPage}`}
                  className="max-w-full max-h-full object-contain"
                  style={{ 
                    width: 'auto',
                    height: 'auto',
                    maxWidth: isFullscreen ? '98vw' : '98%',
                    maxHeight: isFullscreen ? '85vh' : '85%',
                    minHeight: isFullscreen ? '60vh' : '50vh'
                  }}
                />
                
                {/* Interactive overlay for page interactions */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Reading progress indicator */}
                  {bookmarkPages.includes(currentPage) && (
                    <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
                      <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-bl-lg text-xs font-semibold">
                        <Bookmark className="h-3 w-3 inline mr-1" />
                        <span className="hidden sm:inline">Bookmarked</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Page navigation hints */}
                  <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 bg-black bg-opacity-50 text-white px-2 py-1 lg:px-3 lg:py-1 rounded text-xs">
                    <span className="hidden sm:inline">Use ← → keys to navigate</span>
                    <span className="sm:hidden">← →</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-md h-64 lg:h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-lg">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 lg:h-16 lg:w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-blue-600 font-medium text-base lg:text-lg">Page {currentPage}</p>
                  <p className="text-xs lg:text-sm text-blue-400 mt-2">Loading interactive content...</p>
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Mobile Controls Overlay */}
        <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-between items-center">
          <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-lg px-3 py-2">
            <Button variant="outline" size="sm" onClick={zoomOut} className="px-2">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs px-1 min-w-[3rem] text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={zoomIn} className="px-2">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-1 bg-white bg-opacity-90 rounded-lg px-3 py-2">
            <Button
              variant={isAutoPlay ? "default" : "outline"}
              size="sm"
              onClick={toggleAutoPlay}
              className="px-2 sm:hidden"
            >
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={rotateLeft} className="px-2">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={rotateRight} className="px-2">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Page Input & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 lg:p-3 border-t bg-gray-50 gap-2 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-xs lg:text-sm hidden sm:inline">Go to page:</span>
          <input
            type="number"
            min="1"
            max={bookData.totalPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            className="w-12 lg:w-16 px-1 lg:px-2 py-1 text-xs lg:text-sm border rounded"
          />
          <Button size="sm" variant="outline" onClick={() => goToPage(1)} className="px-2 lg:px-3 text-xs lg:text-sm">
            <span className="hidden sm:inline">First</span>
            <span className="sm:hidden">1</span>
          </Button>
          <Button size="sm" variant="outline" onClick={() => goToPage(bookData.totalPages)} className="px-2 lg:px-3 text-xs lg:text-sm">
            <span className="hidden sm:inline">Last</span>
            <span className="sm:hidden">{bookData.totalPages}</span>
          </Button>
        </div>

        {/* Mobile Zoom Controls */}
        <div className="flex md:hidden items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            className="px-2"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs px-1 min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoom >= 2}
            className="px-2"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Interactive Features - Collapsible */}
      <div className="border-t bg-gray-50 flex-shrink-0">
        <div className="p-2 lg:p-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center justify-between lg:justify-start lg:space-x-4">
              <div className="text-xs lg:text-sm font-medium text-gray-700">Interactive Features</div>
              <div className="flex items-center space-x-1 lg:space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const synth = window.speechSynthesis;
                    const utterance = new SpeechSynthesisUtterance(`Reading page ${currentPage} of ${bookData.title}`);
                    synth.speak(utterance);
                  }}
                  className="px-2 lg:px-3"
                >
                  <Volume2 className="h-4 w-4 lg:mr-1" />
                  <span className="hidden lg:inline">Read Aloud</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.share && navigator.share({
                      title: bookData.title,
                      text: `Check out page ${currentPage} of ${bookData.title}`,
                      url: window.location.href
                    });
                  }}
                  className="px-2 lg:px-3"
                >
                  <Share2 className="h-4 w-4 lg:mr-1" />
                  <span className="hidden lg:inline">Share</span>
                </Button>
              </div>
            </div>
            
            {/* Study Tools - Responsive Grid */}
            <div className="grid grid-cols-3 gap-1 lg:gap-2 text-xs">
              <div className="text-center p-1.5 lg:p-2 bg-white rounded border">
                <div className="font-semibold text-xs lg:text-sm">{Math.round(progressPercentage)}%</div>
                <div className="text-gray-500 text-xs">Complete</div>
              </div>
              <div className="text-center p-1.5 lg:p-2 bg-white rounded border">
                <div className="font-semibold text-xs lg:text-sm">{bookmarkPages.length}</div>
                <div className="text-gray-500 text-xs">Bookmarks</div>
              </div>
              <div className="text-center p-1.5 lg:p-2 bg-white rounded border">
                <div className="font-semibold text-xs lg:text-sm">{Math.floor(Date.now() / 60000) % 60}m</div>
                <div className="text-gray-500 text-xs">Reading</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-2 lg:p-3 border-t bg-gray-50 gap-2 flex-shrink-0 rounded-b-lg">
        <div className="flex items-center space-x-1 lg:space-x-2">
          <Button variant="outline" size="sm" className="px-2 lg:px-3">
            <Download className="h-4 w-4 lg:mr-1" />
            <span className="hidden lg:inline">Download</span>
          </Button>
          <Button variant="outline" size="sm" className="px-2 lg:px-3">
            <Eye className="h-4 w-4 lg:mr-1" />
            <span className="hidden lg:inline">Notes</span>
          </Button>
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAutoPlay}
              className={`${isAutoPlay ? 'bg-green-100 text-green-800' : ''} px-2`}
            >
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {bookmarkPages.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {bookmarkPages.length} bookmark{bookmarkPages.length !== 1 ? 's' : ''}
            </Badge>
          )}
          <Button variant="outline" size="sm" className="px-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookViewer;