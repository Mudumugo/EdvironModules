import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  X,
  List,
  FileText,
  Printer,
  Edit3,
  CheckSquare
} from 'lucide-react';
import { xapiTracker } from '@/lib/xapi/xapiTracker';

interface WorksheetViewerProps {
  worksheetData: {
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
    hasAnswerKey?: boolean;
    xapiEnabled?: boolean;
    content?: string;
    instructions?: string;
    difficulty?: string;
    duration?: number;
    trackingConfig?: any;
  };
  onClose?: () => void;
  className?: string;
}

export const WorksheetViewer: React.FC<WorksheetViewerProps> = ({ 
  worksheetData, 
  onClose, 
  className = '' 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const containerRef = useRef<HTMLDivElement>(null);
  const activityTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-hide controls after inactivity
  const handleUserActivity = () => {
    setLastActivity(Date.now());
    setShowControls(true);
    
    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }
    
    activityTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    handleUserActivity();
    return () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, []);

  // xAPI Tracking
  useEffect(() => {
    if (worksheetData.xapiEnabled) {
      xapiTracker.trackAccessed(
        worksheetData.id.toString(),
        worksheetData.title,
        'worksheet'
      );
    }
  }, [worksheetData]);

  useEffect(() => {
    if (worksheetData.xapiEnabled && currentPage > 1) {
      xapiTracker.trackActivity({
        verb: {
          id: 'http://adlnet.gov/expapi/verbs/progressed',
          display: { 'en-US': 'progressed' }
        },
        object: {
          id: `${window.location.origin}/resource/${worksheetData.id}`,
          definition: {
            name: { 'en-US': worksheetData.title },
            type: 'http://adlnet.gov/expapi/activities/worksheet'
          }
        },
        result: {
          completion: currentPage === worksheetData.totalPages,
          extensions: {
            'http://adlnet.gov/expapi/activities/worksheet/page': currentPage,
            'http://adlnet.gov/expapi/activities/worksheet/totalPages': worksheetData.totalPages,
            'http://adlnet.gov/expapi/activities/worksheet/progress': Math.round((currentPage / worksheetData.totalPages) * 100)
          }
        }
      });
    }
  }, [currentPage, worksheetData]);

  const nextPage = () => {
    if (currentPage < worksheetData.totalPages) {
      setCurrentPage(currentPage + 1);
      handleUserActivity();
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      handleUserActivity();
    }
  };

  const zoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
    handleUserActivity();
  };

  const zoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
    handleUserActivity();
  };

  const handleDownload = () => {
    // Simulate download functionality
    const link = document.createElement('a');
    link.href = '#'; // Would be actual worksheet file URL
    link.download = `${worksheetData.title}.pdf`;
    link.click();
    handleUserActivity();
  };

  const toggleAnswerKey = () => {
    setShowAnswerKey(!showAnswerKey);
    handleUserActivity();
  };

  const getCurrentPageContent = () => {
    if (showAnswerKey && worksheetData.hasAnswerKey) {
      return `Answer Key - Page ${currentPage} of ${worksheetData.totalPages}`;
    }
    return worksheetData.pages[currentPage - 1] || `Page ${currentPage} Content`;
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed top-0 left-0 right-0 bottom-0 z-[999999] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden ${className}`}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999
      }}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
    >
      {/* Worksheet Container - Full immersive viewport */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        {/* The Worksheet itself - Responsive dimensions for all devices */}
        <div className="relative w-full h-full flex items-center justify-center px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4">
          
          {/* Worksheet Shadow and 3D Effect */}
          <div className="relative bg-white rounded-lg shadow-2xl transform transition-all duration-300 w-full h-full max-w-5xl max-h-[95vh] sm:max-h-[90vh]" 
               style={{ 
                 transform: `scale(${zoom / 100})`,
                 boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)'
               }}>
            
            {/* Worksheet Header with Title and Info */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 sm:p-4 rounded-t-lg z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">
                    {worksheetData.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm opacity-90 mt-1">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {worksheetData.type || 'Worksheet'}
                    </span>
                    {worksheetData.grade && (
                      <span>{worksheetData.grade}</span>
                    )}
                    {worksheetData.difficulty && (
                      <span className="px-2 py-1 bg-white/20 rounded text-xs">
                        {worksheetData.difficulty}
                      </span>
                    )}
                    {worksheetData.duration && (
                      <span>{worksheetData.duration} min</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Panel (collapsible) */}
            {showInstructions && worksheetData.instructions && (
              <div className="absolute top-16 sm:top-20 left-4 right-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r-lg z-10 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-yellow-800 mb-1">Instructions</h3>
                    <p className="text-xs sm:text-sm text-yellow-700">{worksheetData.instructions}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowInstructions(false)}
                    className="text-yellow-600 hover:text-yellow-800 p-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}

            {/* Main Worksheet Content Area */}
            <div className="relative w-full h-full pt-16 sm:pt-20 pb-16 sm:pb-20 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
                <div className="w-full h-full bg-white rounded-lg border-2 border-gray-200 overflow-auto">
                  
                  {/* Page Content Display */}
                  <div className="w-full h-full flex items-center justify-center text-center p-6 sm:p-8">
                    <div className="max-w-4xl">
                      {showAnswerKey ? (
                        <div className="space-y-6">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                              <CheckSquare className="h-5 w-5" />
                              Answer Key - Page {currentPage}
                            </h3>
                            <div className="text-sm text-green-700">
                              {getCurrentPageContent()}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                            Page {currentPage} of {worksheetData.totalPages}
                          </h2>
                          <div className="text-gray-600 leading-relaxed">
                            <div className="min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                              <div className="text-center space-y-4">
                                <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                                <p className="text-lg font-medium">{getCurrentPageContent()}</p>
                                <p className="text-sm text-gray-500">
                                  Interactive worksheet content would appear here
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls - Bottom Bar */}
            <div className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 p-3 sm:p-4 rounded-b-lg transition-all duration-300 ${
              showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                
                {/* Page Navigation */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <span className="px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 rounded text-xs sm:text-sm font-medium">
                    {currentPage} / {worksheetData.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextPage}
                    disabled={currentPage === worksheetData.totalPages}
                    className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Center Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomOut}
                    disabled={zoom <= 50}
                    className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium min-w-[3rem] text-center">
                    {zoom}%
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={zoomIn}
                    disabled={zoom >= 200}
                    className="h-8 w-8 sm:h-10 sm:w-10 p-0"
                  >
                    <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {worksheetData.hasAnswerKey && (
                    <Button
                      variant={showAnswerKey ? "default" : "outline"}
                      size="sm"
                      onClick={toggleAnswerKey}
                      className="h-8 sm:h-10 px-2 sm:px-3"
                    >
                      <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden sm:inline">
                        {showAnswerKey ? 'Hide' : 'Show'} Answers
                      </span>
                      <span className="sm:hidden">Ans</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                    className="h-8 sm:h-10 px-2 sm:px-3"
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Download</span>
                    <span className="sm:hidden">DL</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button - Top Right */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={`absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg border border-gray-200 transition-all duration-300 ${
            showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          <X className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Instructions Toggle - Top Left */}
        {!showInstructions && worksheetData.instructions && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowInstructions(true)}
            className={`absolute top-4 left-4 h-10 px-3 rounded-full bg-yellow-100/90 hover:bg-yellow-200 shadow-lg border border-yellow-300 transition-all duration-300 ${
              showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            <List className="h-4 w-4 text-yellow-700 mr-1" />
            <span className="text-xs text-yellow-700">Instructions</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default WorksheetViewer;