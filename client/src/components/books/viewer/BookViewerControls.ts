import { useState, useEffect, useCallback } from 'react';

export const useBookViewerControls = () => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bookmarkPages, setBookmarkPages] = useState<number[]>([]);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 300));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    setZoom(Math.max(25, Math.min(300, level)));
  }, []);

  const toggleBookmark = useCallback((page: number) => {
    setBookmarkPages(prev => 
      prev.includes(page) 
        ? prev.filter(p => p !== page)
        : [...prev, page]
    );
  }, []);

  // Controls visibility management
  const showControlsTemporarily = useCallback(() => {
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
  }, [controlsTimeout]);

  const handleUserActivity = useCallback(() => {
    showControlsTemporarily();
  }, [showControlsTemporarily]);

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
  }, [handleUserActivity]);

  return {
    zoom,
    rotation,
    bookmarkPages,
    showTableOfContents,
    showInteractiveMode,
    showControls,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomLevel,
    toggleBookmark,
    setShowTableOfContents,
    setShowInteractiveMode,
    handleUserActivity
  };
};