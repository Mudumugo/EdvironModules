import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface BookPage {
  id: string;
  pageNumber: number;
  title?: string;
  content: string;
  type: 'cover' | 'toc' | 'chapter' | 'content' | 'activity' | 'assessment';
  metadata?: Record<string, any>;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade: string;
  description?: string;
  coverImage?: string;
  totalPages: number;
  pages: BookPage[];
  metadata?: Record<string, any>;
}

export interface ReaderSettings {
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  theme: 'light' | 'dark' | 'sepia';
  autoScroll: boolean;
  autoScrollSpeed: number;
  showAnnotations: boolean;
  highlightColor: string;
}

export interface Annotation {
  id: string;
  pageId: string;
  text: string;
  note?: string;
  color: string;
  position: {
    start: number;
    end: number;
  };
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  pageId: string;
  pageNumber: number;
  title: string;
  createdAt: Date;
}

const DEFAULT_SETTINGS: ReaderSettings = {
  fontSize: 16,
  fontFamily: 'serif',
  lineHeight: 1.6,
  theme: 'light',
  autoScroll: false,
  autoScrollSpeed: 1,
  showAnnotations: true,
  highlightColor: '#fbbf24'
};

export function useBookReader(bookId?: string) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [settings, setSettings] = useState<ReaderSettings>(DEFAULT_SETTINGS);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [selectedText, setSelectedText] = useState<string>('');
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const readerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout>();

  // Fetch book data
  const { data: book, isLoading } = useQuery<Book>({
    queryKey: ['/api/books', bookId],
    queryFn: () => apiRequest('GET', `/api/books/${bookId}`),
    enabled: !!bookId,
  });

  // Current page
  const currentPage = book?.pages?.[currentPageIndex];

  // Navigation
  const goToPage = useCallback((pageIndex: number) => {
    if (!book) return;
    const validIndex = Math.max(0, Math.min(pageIndex, book.pages.length - 1));
    setCurrentPageIndex(validIndex);
    updateReadingProgress(validIndex);
  }, [book]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPageIndex + 1);
  }, [currentPageIndex, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPageIndex - 1);
  }, [currentPageIndex, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(0);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    if (book) goToPage(book.pages.length - 1);
  }, [book, goToPage]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<ReaderSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const increaseFontSize = useCallback(() => {
    updateSettings({ fontSize: Math.min(settings.fontSize + 2, 24) });
  }, [settings.fontSize, updateSettings]);

  const decreaseFontSize = useCallback(() => {
    updateSettings({ fontSize: Math.max(settings.fontSize - 2, 12) });
  }, [settings.fontSize, updateSettings]);

  const toggleTheme = useCallback(() => {
    const themes: ReaderSettings['theme'][] = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(settings.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updateSettings({ theme: themes[nextIndex] });
  }, [settings.theme, updateSettings]);

  // Auto-scroll
  const startAutoScroll = useCallback(() => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    
    autoScrollRef.current = setInterval(() => {
      if (readerRef.current) {
        const scrollAmount = settings.autoScrollSpeed * 2;
        readerRef.current.scrollTop += scrollAmount;
        
        // Auto-advance to next page when reaching bottom
        const { scrollTop, scrollHeight, clientHeight } = readerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          goToNextPage();
        }
      }
    }, 100);
  }, [settings.autoScrollSpeed, goToNextPage]);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = undefined;
    }
  }, []);

  const toggleAutoScroll = useCallback(() => {
    if (settings.autoScroll) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
    updateSettings({ autoScroll: !settings.autoScroll });
  }, [settings.autoScroll, startAutoScroll, stopAutoScroll, updateSettings]);

  // Annotations
  const addAnnotation = useCallback((text: string, note?: string) => {
    if (!currentPage || !selectedText) return;

    const newAnnotation: Annotation = {
      id: `annotation_${Date.now()}`,
      pageId: currentPage.id,
      text: selectedText,
      note,
      color: settings.highlightColor,
      position: { start: 0, end: selectedText.length }, // Simplified
      createdAt: new Date()
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    setSelectedText('');
    setIsAnnotationMode(false);
  }, [currentPage, selectedText, settings.highlightColor]);

  const removeAnnotation = useCallback((annotationId: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== annotationId));
  }, []);

  const getPageAnnotations = useCallback((pageId: string) => {
    return annotations.filter(a => a.pageId === pageId);
  }, [annotations]);

  // Bookmarks
  const addBookmark = useCallback((title?: string) => {
    if (!currentPage) return;

    const newBookmark: Bookmark = {
      id: `bookmark_${Date.now()}`,
      pageId: currentPage.id,
      pageNumber: currentPage.pageNumber,
      title: title || `Page ${currentPage.pageNumber}`,
      createdAt: new Date()
    };

    setBookmarks(prev => [...prev, newBookmark]);
  }, [currentPage]);

  const removeBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
  }, []);

  const goToBookmark = useCallback((bookmark: Bookmark) => {
    if (!book) return;
    const pageIndex = book.pages.findIndex(p => p.id === bookmark.pageId);
    if (pageIndex !== -1) {
      goToPage(pageIndex);
      setShowBookmarks(false);
    }
  }, [book, goToPage]);

  // Progress tracking
  const updateReadingProgress = useCallback((pageIndex: number) => {
    if (!book) return;
    const progress = ((pageIndex + 1) / book.pages.length) * 100;
    setReadingProgress(progress);
  }, [book]);

  // Text selection
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString().trim());
    } else {
      setSelectedText('');
    }
  }, []);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return; // Don't handle shortcuts in input fields
    }

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPreviousPage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNextPage();
        break;
      case 'Home':
        event.preventDefault();
        goToFirstPage();
        break;
      case 'End':
        event.preventDefault();
        goToLastPage();
        break;
      case '+':
      case '=':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          increaseFontSize();
        }
        break;
      case '-':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          decreaseFontSize();
        }
        break;
      case 't':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          toggleTheme();
        }
        break;
      case 'b':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          addBookmark();
        }
        break;
    }
  }, [goToPreviousPage, goToNextPage, goToFirstPage, goToLastPage, increaseFontSize, decreaseFontSize, toggleTheme, addBookmark]);

  // Effect for keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Effect for text selection
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, [handleTextSelection]);

  // Cleanup auto-scroll on unmount
  useEffect(() => {
    return () => {
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
      }
    };
  }, []);

  return {
    // Data
    book,
    currentPage,
    currentPageIndex,
    totalPages: book?.pages?.length || 0,
    
    // State
    settings,
    annotations,
    bookmarks,
    selectedText,
    isAnnotationMode,
    readingProgress,
    showSettings,
    showBookmarks,
    isLoading,
    
    // Refs
    readerRef,
    
    // Navigation
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    
    // Settings
    updateSettings,
    increaseFontSize,
    decreaseFontSize,
    toggleTheme,
    toggleAutoScroll,
    
    // Annotations
    addAnnotation,
    removeAnnotation,
    getPageAnnotations,
    setIsAnnotationMode,
    
    // Bookmarks
    addBookmark,
    removeBookmark,
    goToBookmark,
    
    // UI Controls
    setShowSettings,
    setShowBookmarks,
    
    // Computed
    canGoNext: currentPageIndex < (book?.pages?.length || 0) - 1,
    canGoPrevious: currentPageIndex > 0,
    currentPageAnnotations: currentPage ? getPageAnnotations(currentPage.id) : [],
    isBookmarked: currentPage ? bookmarks.some(b => b.pageId === currentPage.id) : false,
  };
}