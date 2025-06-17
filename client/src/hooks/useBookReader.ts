import { useState, useEffect, useCallback } from 'react';

interface BookPage {
  id: number;
  pageNumber: number;
  content: string;
  imageUrl?: string;
  text?: string;
}

interface BookData {
  id: number;
  title: string;
  author: string;
  pages: BookPage[];
  totalPages: number;
  metadata?: {
    isbn?: string;
    publisher?: string;
    publishDate?: string;
    language?: string;
    grade?: string;
    subject?: string;
  };
}

interface BookReaderState {
  currentPage: number;
  zoom: number;
  rotation: number;
  viewMode: 'single' | 'double';
  isFullscreen: boolean;
  bookmarks: number[];
  readingProgress: number;
  lastReadPage: number;
  readingTime: number;
}

interface UseBookReaderOptions {
  bookId: number;
  autoSave?: boolean;
  enableAnalytics?: boolean;
}

export const useBookReader = (options: UseBookReaderOptions) => {
  const { bookId, autoSave = true, enableAnalytics = true } = options;

  const [bookData, setBookData] = useState<BookData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [readerState, setReaderState] = useState<BookReaderState>({
    currentPage: 1,
    zoom: 100,
    rotation: 0,
    viewMode: 'single',
    isFullscreen: false,
    bookmarks: [],
    readingProgress: 0,
    lastReadPage: 1,
    readingTime: 0
  });

  // Load book data
  const loadBook = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // In a real implementation, this would fetch from an API
      // For now, we'll create mock data based on the resource
      const mockBookData: BookData = {
        id: bookId,
        title: 'Sample Educational Book',
        author: 'Education Team',
        pages: Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          pageNumber: i + 1,
          content: `Page ${i + 1} content`,
          imageUrl: `/api/placeholder/400/500?page=${i + 1}`,
          text: `This is the content for page ${i + 1}. Educational content goes here.`
        })),
        totalPages: 20,
        metadata: {
          language: 'English',
          grade: 'Grade 5',
          subject: 'Mathematics'
        }
      };

      setBookData(mockBookData);
      
      // Load saved reading state
      if (autoSave) {
        const savedState = localStorage.getItem(`book-reader-${bookId}`);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setReaderState(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (err) {
      setError('Failed to load book');
      console.error('Error loading book:', err);
    } finally {
      setLoading(false);
    }
  }, [bookId, autoSave]);

  // Save reading state
  const saveReaderState = useCallback((newState: Partial<BookReaderState>) => {
    if (autoSave) {
      const stateToSave = { ...readerState, ...newState };
      localStorage.setItem(`book-reader-${bookId}`, JSON.stringify(stateToSave));
    }
  }, [bookId, autoSave, readerState]);

  // Navigation functions
  const goToPage = useCallback((pageNumber: number) => {
    if (!bookData || pageNumber < 1 || pageNumber > bookData.totalPages) return;
    
    const newState = {
      currentPage: pageNumber,
      lastReadPage: pageNumber,
      readingProgress: (pageNumber / bookData.totalPages) * 100
    };
    
    setReaderState(prev => ({ ...prev, ...newState }));
    saveReaderState(newState);

    // Analytics tracking
    if (enableAnalytics) {
      // Track page view
      console.log(`Page view: ${pageNumber} of book ${bookId}`);
    }
  }, [bookData, saveReaderState, enableAnalytics, bookId]);

  const nextPage = useCallback(() => {
    if (bookData && readerState.currentPage < bookData.totalPages) {
      goToPage(readerState.currentPage + 1);
    }
  }, [bookData, readerState.currentPage, goToPage]);

  const previousPage = useCallback(() => {
    if (readerState.currentPage > 1) {
      goToPage(readerState.currentPage - 1);
    }
  }, [readerState.currentPage, goToPage]);

  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => {
    if (bookData) goToPage(bookData.totalPages);
  }, [bookData, goToPage]);

  // View controls
  const setZoom = useCallback((zoom: number) => {
    const clampedZoom = Math.max(50, Math.min(200, zoom));
    const newState = { zoom: clampedZoom };
    setReaderState(prev => ({ ...prev, ...newState }));
    saveReaderState(newState);
  }, [saveReaderState]);

  const zoomIn = useCallback(() => setZoom(readerState.zoom + 25), [readerState.zoom, setZoom]);
  const zoomOut = useCallback(() => setZoom(readerState.zoom - 25), [readerState.zoom, setZoom]);
  const resetZoom = useCallback(() => setZoom(100), [setZoom]);

  const setRotation = useCallback((rotation: number) => {
    const normalizedRotation = rotation % 360;
    const newState = { rotation: normalizedRotation };
    setReaderState(prev => ({ ...prev, ...newState }));
    saveReaderState(newState);
  }, [saveReaderState]);

  const rotateLeft = useCallback(() => setRotation(readerState.rotation - 90), [readerState.rotation, setRotation]);
  const rotateRight = useCallback(() => setRotation(readerState.rotation + 90), [readerState.rotation, setRotation]);
  const resetRotation = useCallback(() => setRotation(0), [setRotation]);

  const toggleViewMode = useCallback(() => {
    const newMode = readerState.viewMode === 'single' ? 'double' : 'single';
    const newState = { viewMode: newMode };
    setReaderState(prev => ({ ...prev, ...newState }));
    saveReaderState(newState);
  }, [readerState.viewMode, saveReaderState]);

  const toggleFullscreen = useCallback(() => {
    const newState = { isFullscreen: !readerState.isFullscreen };
    setReaderState(prev => ({ ...prev, ...newState }));
    
    if (newState.isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [readerState.isFullscreen]);

  // Bookmark functions
  const addBookmark = useCallback((pageNumber: number) => {
    if (!readerState.bookmarks.includes(pageNumber)) {
      const newBookmarks = [...readerState.bookmarks, pageNumber].sort((a, b) => a - b);
      const newState = { bookmarks: newBookmarks };
      setReaderState(prev => ({ ...prev, ...newState }));
      saveReaderState(newState);
    }
  }, [readerState.bookmarks, saveReaderState]);

  const removeBookmark = useCallback((pageNumber: number) => {
    const newBookmarks = readerState.bookmarks.filter(p => p !== pageNumber);
    const newState = { bookmarks: newBookmarks };
    setReaderState(prev => ({ ...prev, ...newState }));
    saveReaderState(newState);
  }, [readerState.bookmarks, saveReaderState]);

  const toggleBookmark = useCallback((pageNumber: number) => {
    if (readerState.bookmarks.includes(pageNumber)) {
      removeBookmark(pageNumber);
    } else {
      addBookmark(pageNumber);
    }
  }, [readerState.bookmarks, addBookmark, removeBookmark]);

  // Reading time tracking
  useEffect(() => {
    if (!enableAnalytics) return;

    const interval = setInterval(() => {
      setReaderState(prev => ({
        ...prev,
        readingTime: prev.readingTime + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [enableAnalytics]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          previousPage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextPage();
          break;
        case 'Home':
          e.preventDefault();
          firstPage();
          break;
        case 'End':
          e.preventDefault();
          lastPage();
          break;
        case 'Escape':
          if (readerState.isFullscreen) {
            toggleFullscreen();
          }
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case '0':
          e.preventDefault();
          resetZoom();
          break;
        case 'r':
          if (e.ctrlKey) {
            e.preventDefault();
            rotateRight();
          }
          break;
        case 'b':
          if (e.ctrlKey) {
            e.preventDefault();
            toggleBookmark(readerState.currentPage);
          }
          break;
        case 'f':
          if (e.ctrlKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    nextPage, 
    previousPage, 
    firstPage, 
    lastPage, 
    zoomIn, 
    zoomOut, 
    resetZoom, 
    rotateRight, 
    toggleBookmark, 
    toggleFullscreen,
    readerState.currentPage,
    readerState.isFullscreen
  ]);

  // Load book on mount
  useEffect(() => {
    loadBook();
  }, [loadBook]);

  return {
    // Data
    bookData,
    loading,
    error,
    
    // State
    ...readerState,
    
    // Navigation
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    
    // View controls
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    setRotation,
    rotateLeft,
    rotateRight,
    resetRotation,
    toggleViewMode,
    toggleFullscreen,
    
    // Bookmarks
    addBookmark,
    removeBookmark,
    toggleBookmark,
    
    // Utilities
    getCurrentPage: () => bookData?.pages.find(p => p.pageNumber === readerState.currentPage),
    getProgress: () => readerState.readingProgress,
    getTotalPages: () => bookData?.totalPages || 0,
    isBookmarked: (pageNumber: number) => readerState.bookmarks.includes(pageNumber),
    
    // Actions
    reload: loadBook
  };
};

export default useBookReader;