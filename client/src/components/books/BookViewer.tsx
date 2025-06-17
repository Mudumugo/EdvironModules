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
  BookOpen,
  Play,
  Film,
  Monitor
} from 'lucide-react';
import { xapiTracker } from '@/lib/xapi/xapiTracker';
import InteractiveContentViewer from '@/components/multimedia/InteractiveContentViewer';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bookmarkPages, setBookmarkPages] = useState<number[]>([]);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [sessionStartTime] = useState(new Date());
  const [pageStartTime, setPageStartTime] = useState(new Date());
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [pageTransition, setPageTransition] = useState<'none' | 'next' | 'prev'>('none');
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Detect if this is multimedia/interactive content
  const isMultimediaContent = bookData.isInteractive || bookData.hasVideo || bookData.hasAudio || 
                             bookData.type === 'interactive' || bookData.type === 'html5';

  // Animation helper functions
  const getPageTransitionTransform = (): string => {
    switch (pageTransition) {
      case 'next':
        return 'translateX(3px) rotateY(-2deg)';
      case 'prev':
        return 'translateX(-3px) rotateY(2deg)';
      default:
        return '';
    }
  };

  const getPageTransitionOpacity = (): number => {
    return isPageTurning ? 0.85 : 1;
  };

  // Audio synthesis for realistic paper flip sound
  const playPageFlipSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const audioContext = audioContextRef.current;
      
      // Create multiple layers for realistic paper sound
      const createPaperRustle = (startTime: number, frequency: number, duration: number, volume: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();
        
        // White noise simulation for paper texture
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, startTime + duration);
        
        // High-pass filter for crisp paper sound
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, startTime);
        filter.Q.setValueAtTime(2, startTime);
        
        // Quick attack and decay for paper snap
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.005);
        gainNode.gain.exponentialRampToValueAtTime(volume * 0.1, startTime + duration * 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      
      // Layer 1: Initial paper contact (high frequency crinkle)
      createPaperRustle(now, 1200, 0.08, 0.02);
      
      // Layer 2: Main paper fold/turn (mid frequency)
      createPaperRustle(now + 0.02, 600, 0.12, 0.025);
      
      // Layer 3: Final settling (lower frequency rustle)
      createPaperRustle(now + 0.06, 300, 0.10, 0.015);
      
    } catch (error) {
      // Silently fail if audio context is not available
      console.log('Audio context not available for page flip sound');
    }
  };

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

  // Navigation functions with subtle page turn animations
  const animatePageTurn = (direction: 'next' | 'prev', targetPage: number) => {
    setIsPageTurning(true);
    setPageTransition(direction);
    
    // Play page flip sound effect
    playPageFlipSound();
    
    // Track current page view before transition
    trackPageView(currentPage);
    
    // Start CSS animation and update page content mid-transition
    setTimeout(() => {
      setCurrentPage(targetPage);
      setPageStartTime(new Date());
    }, 175); // Update content at animation midpoint
    
    // Complete the animation cycle
    setTimeout(() => {
      setPageTransition('none');
      setIsPageTurning(false);
    }, 350); // Match CSS animation duration
  };

  const goToNextPage = () => {
    if (currentPage < bookData.totalPages && !isPageTurning) {
      animatePageTurn('next', currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1 && !isPageTurning) {
      animatePageTurn('prev', currentPage - 1);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= bookData.totalPages && page !== currentPage && !isPageTurning) {
      const direction = page > currentPage ? 'next' : 'prev';
      animatePageTurn(direction, page);
    }
  };

  // Touch gesture handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || isPageTurning) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Only handle horizontal swipes (ignore vertical scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - go to previous page
        goToPreviousPage();
      } else {
        // Swipe left - go to next page
        goToNextPage();
      }
    }
    
    touchStartRef.current = null;
  };

  // Controls visibility management
  const showControlsTemporarily = () => {
    setShowControls(true);
    
    // Clear existing timeout
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    // Set new timeout to hide controls after 3 seconds of inactivity
    const newTimeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(newTimeout);
  };

  const handleUserActivity = () => {
    showControlsTemporarily();
  };

  // xAPI tracking functions
  const trackPageView = (page: number) => {
    if (bookData.xapiEnabled) {
      const timeOnPage = Math.floor((new Date().getTime() - pageStartTime.getTime()) / 1000);
      xapiTracker.trackReadingProgress(
        bookData.id.toString(),
        bookData.title,
        page,
        bookData.totalPages,
        timeOnPage
      );
    }
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const toggleBookmark = (page: number) => {
    const action = bookmarkPages.includes(page) ? 'removed' : 'added';
    setBookmarkPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
    
    // Track bookmark action
    if (bookData.xapiEnabled) {
      xapiTracker.trackBookmark(action, bookData.id.toString(), bookData.title, page);
    }
  };

  // Initialize xAPI tracking on component mount
  useEffect(() => {
    if (bookData.xapiEnabled) {
      xapiTracker.trackAccessed(bookData.id.toString(), bookData.title, bookData.type || 'book');
    }
  }, [bookData.id, bookData.title, bookData.xapiEnabled, bookData.type]);

  // Track session completion on unmount
  useEffect(() => {
    return () => {
      if (bookData.xapiEnabled) {
        const sessionDuration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
        trackPageView(currentPage); // Track final page
        xapiTracker.trackSessionComplete(bookData.id.toString(), bookData.title, sessionDuration);
      }
    };
  }, []);

  // Initialize controls timeout and cleanup
  useEffect(() => {
    showControlsTemporarily();
    
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, []);

  // Handle mouse movement and touch to show controls
  useEffect(() => {
    const handleMouseMove = () => {
      handleUserActivity();
    };

    const handleTouchStart = () => {
      handleUserActivity();
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      handleUserActivity(); // Show controls on any key press
      
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
          } else if (showInteractiveMode) {
            setShowInteractiveMode(false);
          } else if (onClose) {
            onClose();
          }
          break;
        case 'i':
        case 'I':
          if (isMultimediaContent) {
            setShowInteractiveMode(!showInteractiveMode);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, bookData.totalPages, showTableOfContents, showInteractiveMode, isMultimediaContent, onClose]);

  // Check if we should show interactive content viewer
  if (showInteractiveMode && isMultimediaContent) {
    return (
      <InteractiveContentViewer
        resourceId={bookData.id}
        title={bookData.title}
        content={bookData.content || ''}
        mediaAssets={bookData.mediaAssets || []}
        interactiveElements={bookData.interactiveElements || []}
        xapiEnabled={bookData.xapiEnabled || false}
        trackingConfig={bookData.trackingConfig || {}}
        onClose={() => setShowInteractiveMode(false)}
      />
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed inset-0 z-50 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden ${className}`}
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
                <div
                  ref={pageRef}
                  className={`w-full h-full flex items-center justify-center page-content-transition ${
                    isPageTurning ? 'pointer-events-none' : ''
                  } ${
                    pageTransition === 'next' ? 'page-turn-animation-next' : 
                    pageTransition === 'prev' ? 'page-turn-animation-prev' : ''
                  }`}
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'center'
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {bookData.pages && bookData.pages[currentPage - 1] ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src={bookData.pages[currentPage - 1]}
                        alt={`Page ${currentPage}`}
                        className="object-contain w-full h-full"
                        style={{ 
                          maxWidth: '100%',
                          maxHeight: '100%'
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
            <div className={`absolute top-4 left-4 right-4 flex items-center justify-between z-10 transition-all duration-500 ${
              showControls ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {bookData.title}
              </div>
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                {currentPage} / {bookData.totalPages}
              </div>
            </div>
            
            {/* Left margin controls - Previous page */}
            <div className={`absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2 z-10 transition-all duration-500 ${
              showControls ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPreviousPage} 
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
                onClick={goToNextPage} 
                disabled={currentPage >= bookData.totalPages}
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
                    onClick={() => setShowTableOfContents(!showTableOfContents)}
                    className="bg-black bg-opacity-30 hover:bg-opacity-50 text-white border-0 rounded-full w-10 h-10 sm:w-8 sm:h-8 touch-manipulation"
                    title="Table of Contents"
                  >
                    <List className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                  
                  {/* Table of Contents Dropdown */}
                  {showTableOfContents && (
                    <div className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 sm:max-h-96 overflow-y-auto">
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
                
                {/* Interactive Mode Toggle */}
                {isMultimediaContent && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowInteractiveMode(!showInteractiveMode)}
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