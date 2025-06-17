import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  X,
  List,
  BookOpen
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
  const [bookmarkPages, setBookmarkPages] = useState<number[]>([]);
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
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= bookData.totalPages) {
      setCurrentPage(page);
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleBookmark = (page: number) => {
    setBookmarkPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  };

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
          if (showTableOfContents) {
            setShowTableOfContents(false);
          } else if (onClose) {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, bookData.totalPages, showTableOfContents, onClose]);

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden ${className}`}
    >
      {/* Flipbook-style Book Container - Full immersive viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* The Book itself - Centered with realistic dimensions */}
        <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex items-center justify-center">
          
          {/* Book Shadow and 3D Effect */}
          <div className="relative bg-white rounded-lg shadow-2xl transform transition-all duration-300" 
               style={{ 
                 width: '95%', 
                 height: '95%',
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
               }}>
            
            {/* Book Content Area */}
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <div className="w-full h-full flex items-center justify-center p-4">
                <div
                  ref={pageRef}
                  className="w-full h-full flex items-center justify-center transition-all duration-300"
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  {bookData.pages && bookData.pages[currentPage - 1] ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={bookData.pages[currentPage - 1]}
                        alt={`Page ${currentPage}`}
                        className="object-contain"
                        style={{ 
                          width: 'calc(100% - 2rem)',
                          height: 'calc(100% - 2rem)',
                          maxWidth: 'calc(100% - 2rem)',
                          maxHeight: 'calc(100% - 2rem)'
                        }}
                      />
                      
                      {/* Bookmark indicator */}
                      {bookmarkPages.includes(currentPage) && (
                        <div className="absolute top-2 right-2">
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
              </div>
            </div>
            
            {/* Flipbook-style overlay controls integrated into book margins */}
            
            {/* Top margin controls - Book title and status */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {bookData.title}
              </div>
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentPage} / {bookData.totalPages}
              </div>
            </div>
            
            {/* Left margin controls - Previous page */}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPreviousPage} 
                disabled={currentPage <= 1}
                className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full w-10 h-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Right margin controls - Next page */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={currentPage >= bookData.totalPages}
                className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full w-10 h-10"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Bottom margin controls - Tools and navigation */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              {/* Left tools */}
              <div className="flex items-center space-x-2">
                {/* Table of Contents */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowTableOfContents(!showTableOfContents)}
                    className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
                    title="Table of Contents"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  
                  {/* Table of Contents Dropdown */}
                  {showTableOfContents && (
                    <div className="absolute bottom-full left-0 mb-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-3 text-center border-b pb-2">Table of Contents</h3>
                        <div className="space-y-1">
                          {tableOfContents.map((chapter, chapterIndex) => (
                            <div key={chapterIndex} className="border-b border-gray-100 last:border-b-0">
                              <div className="p-2 bg-gray-50 rounded-t">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-semibold text-gray-900">{chapter.chapter}</div>
                                    <div className="text-sm text-gray-600">{chapter.title}</div>
                                  </div>
                                  <div className="text-sm text-gray-500">Pages {chapter.pages}</div>
                                </div>
                              </div>
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
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Zoom controls */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={zoomOut} 
                  disabled={zoom <= 50}
                  className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={zoomIn} 
                  disabled={zoom >= 200}
                  className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Center - Page input */}
              <div className="bg-black bg-opacity-50 rounded-full px-4 py-2">
                <input
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= bookData.totalPages) {
                      goToPage(page);
                    }
                  }}
                  className="w-16 px-2 py-1 text-center bg-transparent text-white border-0 focus:outline-none text-sm"
                  min="1"
                  max={bookData.totalPages}
                />
              </div>
              
              {/* Right tools */}
              <div className="flex items-center space-x-2">
                {/* Bookmark */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleBookmark(currentPage)}
                  className={`${bookmarkPages.includes(currentPage) ? 'bg-yellow-500 bg-opacity-80' : 'bg-black bg-opacity-30'} hover:bg-opacity-50 text-white border-0 rounded-full`}
                  title="Bookmark"
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                
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
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookViewer;