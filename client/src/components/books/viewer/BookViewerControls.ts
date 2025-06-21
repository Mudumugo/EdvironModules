import { useState, useEffect, useCallback, useRef } from 'react';

export const useBookViewerControls = () => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bookmarkPages, setBookmarkPages] = useState<number[]>([]);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [showInteractiveMode, setShowInteractiveMode] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 25, 300));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 25, 25));
  }, []);

  const resetZoom = useCallback(() => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  const setZoomLevel = useCallback((level: number) => {
    setZoom(Math.max(25, Math.min(300, level)));
    if (level <= 100) {
      setPanOffset({ x: 0, y: 0 });
    }
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -25 : 25;
      setZoom(prev => Math.max(25, Math.min(300, prev + delta)));
    }
  }, []);

  // Pan functionality for zoomed content
  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (zoom > 100) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  }, [zoom, panOffset]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging && zoom > 100) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart, zoom]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
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

  // Handle mouse movement, touch, and wheel events
  useEffect(() => {
    const handleMouseMoveActivity = (e: MouseEvent) => {
      handleUserActivity();
      handleMouseMove(e);
    };

    const handleTouchStart = () => {
      handleUserActivity();
    };

    document.addEventListener('mousemove', handleMouseMoveActivity);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveActivity);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleUserActivity, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp]);

  return {
    zoom,
    rotation,
    bookmarkPages,
    showTableOfContents,
    showInteractiveMode,
    showControls,
    panOffset,
    isDragging,
    containerRef,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomLevel,
    toggleBookmark,
    setShowTableOfContents,
    setShowInteractiveMode,
    handleUserActivity,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};