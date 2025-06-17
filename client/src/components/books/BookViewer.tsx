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
  Pause
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
      className={`bg-white rounded-lg shadow-lg ${isFullscreen ? 'fixed inset-0 z-50' : ''} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-semibold text-lg">{bookData.title}</h3>
            {bookData.author && (
              <p className="text-sm text-gray-600">by {bookData.author}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{bookData.grade}</Badge>
          <Badge variant="outline">{bookData.subject}</Badge>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center space-x-2">
          {/* Navigation */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="text-sm font-medium min-w-20 text-center">
            {currentPage} / {bookData.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === bookData.totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <Button variant="outline" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm min-w-12 text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>

          {/* Rotation Controls */}
          <Button variant="outline" size="sm" onClick={rotateLeft}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={rotateRight}>
            <RotateCw className="h-4 w-4" />
          </Button>

          {/* Auto-play */}
          <Button
            variant={isAutoPlay ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoPlay}
          >
            {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>

          {/* Bookmark */}
          <Button
            variant={bookmarkPages.includes(currentPage) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleBookmark(currentPage)}
          >
            <Bookmark className="h-4 w-4" />
          </Button>

          {/* Fullscreen */}
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 py-2 bg-gray-50">
        <Progress value={progressPercentage} className="w-full" />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Progress: {Math.round(progressPercentage)}%</span>
          <span>{bookData.totalPages} pages</span>
        </div>
      </div>

      {/* Book Content */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="h-full flex items-center justify-center p-4">
          <div
            ref={pageRef}
            className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
          >
            {bookData.pages && bookData.pages[currentPage - 1] ? (
              <div className="relative">
                <img
                  src={bookData.pages[currentPage - 1]}
                  alt={`Page ${currentPage}`}
                  className="max-w-full max-h-full object-contain shadow-lg"
                  style={{ minHeight: '500px', minWidth: '400px' }}
                />
                
                {/* Interactive overlay for page interactions */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Reading progress indicator */}
                  {bookmarkPages.includes(currentPage) && (
                    <div className="absolute top-0 right-0 p-2">
                      <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-bl-lg text-xs font-semibold">
                        <Bookmark className="h-3 w-3 inline mr-1" />
                        Bookmarked
                      </div>
                    </div>
                  )}
                  
                  {/* Page navigation hints */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-xs">
                    Use ← → keys to navigate
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-96 h-[500px] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-300 rounded-lg">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-4 animate-pulse" />
                  <p className="text-blue-600 font-medium text-lg">Page {currentPage}</p>
                  <p className="text-sm text-blue-400 mt-2">Loading interactive content...</p>
                  <div className="mt-4 flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Input */}
      <div className="flex items-center justify-center p-3 border-t bg-gray-50">
        <div className="flex items-center space-x-2">
          <span className="text-sm">Go to page:</span>
          <input
            type="number"
            min="1"
            max={bookData.totalPages}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 text-sm border rounded"
          />
          <Button size="sm" variant="outline" onClick={() => goToPage(1)}>
            First
          </Button>
          <Button size="sm" variant="outline" onClick={() => goToPage(bookData.totalPages)}>
            Last
          </Button>
        </div>
      </div>

      {/* Interactive Features */}
      <div className="border-t bg-gray-50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700">Interactive Features</div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const synth = window.speechSynthesis;
                const utterance = new SpeechSynthesisUtterance(`Reading page ${currentPage} of ${bookData.title}`);
                synth.speak(utterance);
              }}
            >
              <Volume2 className="h-4 w-4 mr-1" />
              Read Aloud
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
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share Page
            </Button>
          </div>
        </div>
        
        {/* Study Tools */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-white rounded border">
            <div className="font-semibold">{Math.round(progressPercentage)}%</div>
            <div className="text-gray-500">Complete</div>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <div className="font-semibold">{bookmarkPages.length}</div>
            <div className="text-gray-500">Bookmarks</div>
          </div>
          <div className="text-center p-2 bg-white rounded border">
            <div className="font-semibold">{Math.floor(Date.now() / 60000) % 60}m</div>
            <div className="text-gray-500">Reading</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50 rounded-b-lg">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            Notes
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {bookmarkPages.length > 0 && (
            <Badge variant="secondary">
              {bookmarkPages.length} bookmark{bookmarkPages.length !== 1 ? 's' : ''}
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookViewer;