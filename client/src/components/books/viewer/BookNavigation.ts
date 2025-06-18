import { useRef, useState, useCallback } from 'react';
import { useBookAudioSynthesis } from './BookAudioSynthesis';

interface UseBookNavigationProps {
  totalPages: number;
  onTrackPageView: (page: number) => void;
}

export const useBookNavigation = ({ totalPages, onTrackPageView }: UseBookNavigationProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [pageTransition, setPageTransition] = useState<'none' | 'next' | 'prev'>('none');
  const [pageStartTime, setPageStartTime] = useState(new Date());
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const { playPageFlipSound } = useBookAudioSynthesis();

  // Navigation functions with subtle page turn animations
  const animatePageTurn = useCallback((direction: 'next' | 'prev', targetPage: number) => {
    setIsPageTurning(true);
    setPageTransition(direction);
    
    // Play page flip sound effect
    playPageFlipSound();
    
    // Track current page view before transition
    onTrackPageView(currentPage);
    
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
  }, [currentPage, onTrackPageView, playPageFlipSound]);

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages && !isPageTurning) {
      animatePageTurn('next', currentPage + 1);
    }
  }, [currentPage, totalPages, isPageTurning, animatePageTurn]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1 && !isPageTurning) {
      animatePageTurn('prev', currentPage - 1);
    }
  }, [currentPage, isPageTurning, animatePageTurn]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !isPageTurning) {
      const direction = page > currentPage ? 'next' : 'prev';
      animatePageTurn(direction, page);
    }
  }, [currentPage, totalPages, isPageTurning, animatePageTurn]);

  // Touch gesture handlers for mobile navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
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
  }, [isPageTurning, goToPreviousPage, goToNextPage]);

  return {
    currentPage,
    isPageTurning,
    pageTransition,
    pageStartTime,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    handleTouchStart,
    handleTouchEnd
  };
};