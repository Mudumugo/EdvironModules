import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdaptiveScaling } from '@/hooks/useAdaptiveScaling';

interface BookViewerNavigationProps {
  currentPage: number;
  totalPages: number;
  showControls: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const BookViewerNavigation: React.FC<BookViewerNavigationProps> = ({
  currentPage,
  totalPages,
  showControls,
  onPreviousPage,
  onNextPage
}) => {
  const { isCompactMode } = useAdaptiveScaling();

  return (
    <>
      {/* Side Navigation for desktop/tablet */}
      {!isCompactMode && (
        <>
          <div className={`absolute inset-y-0 left-0 w-16 flex items-center justify-center transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPreviousPage}
              disabled={currentPage <= 1}
              className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-12 h-12 shadow-lg backdrop-blur-sm disabled:opacity-30"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className={`absolute inset-y-0 right-0 w-16 flex items-center justify-center transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
              className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white border-0 rounded-full w-12 h-12 shadow-lg backdrop-blur-sm disabled:opacity-30"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </>
      )}

      {/* Bottom Navigation for Mobile/Compact Mode */}
      {isCompactMode && (
        <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className="flex items-center space-x-3 bg-black bg-opacity-60 rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPreviousPage}
              disabled={currentPage <= 1}
              className="text-white border-0 rounded-full w-10 h-10 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-white text-sm font-medium px-3">
              {currentPage} / {totalPages}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNextPage}
              disabled={currentPage >= totalPages}
              className="text-white border-0 rounded-full w-10 h-10 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookViewerNavigation;