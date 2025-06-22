import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  showInstallPrompt: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    showInstallPrompt: false,
    installPrompt: null
  });

  useEffect(() => {
    // Check if app is installed (running in standalone mode)
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    setPWAState(prev => ({ ...prev, isInstalled }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent,
        showInstallPrompt: !isInstalled
      }));
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setPWAState(prev => ({
        ...prev,
        isInstalled: true,
        isInstallable: false,
        showInstallPrompt: false,
        installPrompt: null
      }));
    };

    // Listen for online/offline status
    const handleOnline = () => {
      setPWAState(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      setPWAState(prev => ({ ...prev, isOffline: true }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!pwaState.installPrompt) return false;

    try {
      await pwaState.installPrompt.prompt();
      const choiceResult = await pwaState.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setPWAState(prev => ({
          ...prev,
          showInstallPrompt: false,
          installPrompt: null
        }));
        return true;
      }
    } catch (error) {
      console.error('Failed to install app:', error);
    }
    
    return false;
  };

  const dismissInstallPrompt = () => {
    setPWAState(prev => ({
      ...prev,
      showInstallPrompt: false
    }));
  };

  // Register service worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration);
        
        // Listen for service worker updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
                if (confirm('New version available! Reload to update?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          }
        });
        
        return registration;
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    }
    return null;
  };

  // Cache book content for offline reading
  const cacheBookContent = async (bookData: any) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_BOOK_CONTENT',
        bookData
      });
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  // Show notification
  const showNotification = (title: string, options?: NotificationOptions) => {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          ...options
        });
      });
    }
  };

  return {
    ...pwaState,
    installApp,
    dismissInstallPrompt,
    registerServiceWorker,
    cacheBookContent,
    requestNotificationPermission,
    showNotification
  };
};