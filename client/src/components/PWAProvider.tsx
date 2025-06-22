import React, { createContext, useContext, useEffect } from 'react';
import { usePWA } from '@/hooks/usePWA';
import InstallPrompt from './mobile/InstallPrompt';
import OfflineIndicator from './mobile/OfflineIndicator';

const PWAContext = createContext<ReturnType<typeof usePWA> | null>(null);

export const usePWAContext = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWAContext must be used within PWAProvider');
  }
  return context;
};

interface PWAProviderProps {
  children: React.ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const pwa = usePWA();

  useEffect(() => {
    // Register service worker on component mount
    pwa.registerServiceWorker();
  }, []);

  return (
    <PWAContext.Provider value={pwa}>
      {children}
      
      {/* PWA Install Prompt */}
      <InstallPrompt
        isVisible={pwa.showInstallPrompt && !pwa.isInstalled}
        onInstall={pwa.installApp}
        onDismiss={pwa.dismissInstallPrompt}
      />
      
      {/* Offline Status Indicator */}
      <OfflineIndicator isOffline={pwa.isOffline} />
    </PWAContext.Provider>
  );
};