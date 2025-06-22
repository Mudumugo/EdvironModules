import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, CloudOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOffline: boolean;
}

const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOffline }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (isOffline) {
      setIsVisible(true);
      // Auto-hide after 5 seconds if user doesn't interact
      const timer = setTimeout(() => {
        if (!showDetail) {
          setIsVisible(false);
        }
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      // Show "back online" message briefly
      if (isVisible) {
        setTimeout(() => setIsVisible(false), 2000);
      }
    }
  }, [isOffline, showDetail]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top duration-300">
      <div 
        className={`rounded-lg shadow-lg border p-3 cursor-pointer transition-all duration-300 ${
          isOffline 
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' 
            : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        }`}
        onClick={() => setShowDetail(!showDetail)}
      >
        <div className="flex items-center space-x-3">
          <div className={`flex-shrink-0 ${
            isOffline ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
          }`}>
            {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
          </div>
          
          <div className="flex-1">
            <div className={`font-medium text-sm ${
              isOffline 
                ? 'text-orange-900 dark:text-orange-100' 
                : 'text-green-900 dark:text-green-100'
            }`}>
              {isOffline ? 'You\'re offline' : 'Back online'}
            </div>
            
            {showDetail && (
              <div className={`text-xs mt-1 ${
                isOffline 
                  ? 'text-orange-700 dark:text-orange-300' 
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {isOffline 
                  ? 'Some features are limited. Downloaded content is still available.'
                  : 'All features are now available. Syncing your changes...'
                }
              </div>
            )}
          </div>
          
          {isOffline && (
            <div className="flex-shrink-0">
              <CloudOff className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            </div>
          )}
        </div>
        
        {showDetail && isOffline && (
          <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-orange-700 dark:text-orange-300">Downloaded books</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-orange-700 dark:text-orange-300">Offline notes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-orange-700 dark:text-orange-300">Live features</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-orange-700 dark:text-orange-300">New content</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfflineIndicator;