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
  X,
  List
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
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  // Table of Contents data - detailed structure with topics
  const tableOfContents = [
    { 
      chapter: "Chapter 1", 
      title: "Introduction to Numbers", 
      pages: "3-5",
      topics: [
        { title: "What are Numbers?", page: 3 },
        { title: "Counting 1-10", page: 4 },
        { title: "Number Recognition", page: 5 }
      ]
    },
    { 
      chapter: "Chapter 2", 
      title: "Addition and Subtraction", 
      pages: "6-9",
      topics: [
        { title: "Simple Addition", page: 6 },
        { title: "Adding with Objects", page: 7 },
        { title: "Basic Subtraction", page: 8 },
        { title: "Practice Problems", page: 9 }
      ]
    },
    { 
      chapter: "Chapter 3", 
      title: "Shapes and Patterns", 
      pages: "10-12",
      topics: [
        { title: "Basic Shapes", page: 10 },
        { title: "Pattern Recognition", page: 11 },
        { title: "Creating Patterns", page: 12 }
      ]
    },
    { 
      chapter: "Chapter 4", 
      title: "Review and Assessment", 
      pages: "13-15",
      topics: [
        { title: "Chapter Review", page: 13 },
        { title: "Assessment Quiz", page: 14 },
        { title: "Additional Practice", page: 15 }
      ]
    }
  ];

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
      style={{ height: isFullscreen ? '100vh' : '100vh' }}
    >
      {/* Simple Header - Clean Design */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <h3 className="font-medium text-base text-gray-900 truncate">{bookData.title}</h3>
          {bookData.author && (
            <span className="text-sm text-gray-600 truncate">by {bookData.author}</span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Home/Contents */}
          <Button variant="ghost" size="sm" title="Contents">
            <BookOpen className="h-4 w-4" />
          </Button>
          
          {/* Table of Contents */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowTableOfContents(!showTableOfContents)}
              title="Table of Contents"
            >
              <List className="h-4 w-4" />
            </Button>
            
            {/* Table of Contents Dropdown */}
            {showTableOfContents && (
              <div className="absolute top-full right-0 mt-1 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">Table of Contents</h3>
                  <div className="space-y-1">
                    {tableOfContents.map((chapter, chapterIndex) => (
                      <div key={chapterIndex} className="border-b border-gray-100 last:border-b-0">
                        {/* Chapter Header */}
                        <div className="p-2 bg-gray-50 rounded-t">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="font-semibold text-gray-900">{chapter.chapter}</div>
                              <div className="text-sm text-gray-600">{chapter.title}</div>
                            </div>
                            <div className="text-sm text-gray-500">Pages {chapter.pages}</div>
                          </div>
                        </div>
                        
                        {/* Chapter Topics */}
                        <div className="bg-white">
                          {chapter.topics.map((topic, topicIndex) => (
                            <button
                              key={topicIndex}
                              onClick={() => {
                                goToPage(topic.page);
                                setShowTableOfContents(false);
                              }}
                              className="w-full text-left p-2 pl-4 hover:bg-blue-50 border-l-2 border-transparent hover:border-blue-300 transition-colors"
                            >
                              <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-700">{topic.title}</div>
                                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  Page {topic.page}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="bg-blue-50 p-3 rounded">
                      <h4 className="font-medium text-blue-900 mb-2">How to Use This Book</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>📖 Read each chapter carefully</li>
                        <li>🎯 Complete practice exercises</li>
                        <li>📝 Take quizzes to test your knowledge</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Zoom Out */}
          <Button variant="ghost" size="sm" onClick={zoomOut} disabled={zoom <= 50} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          {/* Zoom Level */}
          <span className="text-sm min-w-[3rem] text-center">{zoom}%</span>
          
          {/* Zoom In */}
          <Button variant="ghost" size="sm" onClick={zoomIn} disabled={zoom >= 200} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          {/* Rotate */}
          <Button variant="ghost" size="sm" onClick={rotateRight} title="Rotate">
            <RotateCw className="h-4 w-4" />
          </Button>
          
          {/* Bookmark */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggleBookmark(currentPage)}
            className={bookmarkPages.includes(currentPage) ? 'text-yellow-600' : ''}
            title="Bookmark"
          >
            <Bookmark className="h-4 w-4" />
          </Button>
          
          {/* Save to Locker */}
          <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-3">
            <Download className="h-4 w-4 mr-1" />
            Save to Locker
          </Button>
          
          {/* Close */}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Main Book Content - Maximized viewing area */}
      <div className="flex-1 overflow-hidden bg-gray-100 relative">
        <div className="w-full h-full flex items-center justify-center p-1">
          <div
            ref={pageRef}
            className="bg-white shadow-xl rounded-lg overflow-auto transition-all duration-300 flex items-center justify-center"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center',
              width: '85%',
              height: '85%',
              margin: 'auto'
            }}
          >
            {bookData.pages && bookData.pages[currentPage - 1] ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={bookData.pages[currentPage - 1]}
                  alt={`Page ${currentPage}`}
                  className="object-contain p-4"
                  style={{ 
                    width: 'calc(100% - 2rem)',
                    height: 'calc(100% - 2rem)',
                    maxWidth: 'calc(100% - 2rem)',
                    maxHeight: 'calc(100% - 2rem)'
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
      </div>

      {/* Simple Bottom Navigation */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50 flex-shrink-0">
        {/* Previous Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        
        {/* Page Info */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Page {currentPage} of {bookData.totalPages}
          </span>
          <span className="text-sm text-gray-600">•</span>
          <span className="text-sm text-gray-600">{bookData.subject}</span>
        </div>
        
        {/* Next Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === bookData.totalPages}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BookViewer;