import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Smartphone } from 'lucide-react';

interface InstallPromptProps {
  onInstall: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({
  onInstall,
  onDismiss,
  isVisible
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Install EdVirons App
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">
              Get the full app experience with offline access, push notifications, and faster loading.
            </p>
            
            <div className="flex items-center space-x-2 mt-3">
              <Button
                size="sm"
                onClick={onInstall}
                className="h-8 px-3 text-xs"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="h-8 px-3 text-xs"
              >
                Maybe Later
              </Button>
            </div>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="flex-shrink-0 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;