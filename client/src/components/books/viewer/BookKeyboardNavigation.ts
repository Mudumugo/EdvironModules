import { useEffect } from 'react';

interface UseBookKeyboardNavigationProps {
  currentPage: number;
  totalPages: number;
  showTableOfContents: boolean;
  showInteractiveMode: boolean;
  isMultimediaContent: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onGoToPage: (page: number) => void;
  onToggleTableOfContents: () => void;
  onToggleInteractiveMode: () => void;
  onUserActivity: () => void;
  onClose?: () => void;
}

export const useBookKeyboardNavigation = ({
  currentPage,
  totalPages,
  showTableOfContents,
  showInteractiveMode,
  isMultimediaContent,
  onPreviousPage,
  onNextPage,
  onGoToPage,
  onToggleTableOfContents,
  onToggleInteractiveMode,
  onUserActivity,
  onClose
}: UseBookKeyboardNavigationProps) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      onUserActivity(); // Show controls on any key press
      
      switch (e.key) {
        case 'ArrowLeft':
          onPreviousPage();
          break;
        case 'ArrowRight':
          onNextPage();
          break;
        case 'Home':
          onGoToPage(1);
          break;
        case 'End':
          onGoToPage(totalPages);
          break;
        case 'Escape':
          if (showTableOfContents) {
            onToggleTableOfContents();
          } else if (showInteractiveMode) {
            onToggleInteractiveMode();
          } else if (onClose) {
            onClose();
          }
          break;
        case 'i':
        case 'I':
          if (isMultimediaContent) {
            onToggleInteractiveMode();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    currentPage,
    totalPages,
    showTableOfContents,
    showInteractiveMode,
    isMultimediaContent,
    onPreviousPage,
    onNextPage,
    onGoToPage,
    onToggleTableOfContents,
    onToggleInteractiveMode,
    onUserActivity,
    onClose
  ]);
};