import { BrowseExtensions } from "./BrowseExtensions";
import { InstalledExtensions } from "./InstalledExtensions";
import { GlobalSettings } from "./GlobalSettings";

interface ExtensionContentProps {
  activeTab: string;
  availableExtensions: any[];
  installedExtensions: any[];
  globalSettings: any;
  extensionsLoading: boolean;
  installedLoading: boolean;
  settingsLoading: boolean;
  isInstalling: boolean;
  isUninstalling: boolean;
  isToggling: boolean;
  isUpdatingSettings: boolean;
  onInstall: (extension: any) => void;
  onUninstall: (extension: any) => void;
  onToggle: (extension: any) => void;
  onUpdateSettings: (settings: any) => void;
  onShowPermissions: (show: boolean) => void;
  setSelectedExtension: (extension: any) => void;
}

export function ExtensionContent({
  activeTab,
  availableExtensions,
  installedExtensions,
  globalSettings,
  extensionsLoading,
  installedLoading,
  settingsLoading,
  isInstalling,
  isUninstalling,
  isToggling,
  isUpdatingSettings,
  onInstall,
  onUninstall,
  onToggle,
  onUpdateSettings,
  onShowPermissions,
  setSelectedExtension
}: ExtensionContentProps) {
  switch (activeTab) {
    case 'browse':
      return (
        <BrowseExtensions
          extensions={availableExtensions}
          loading={extensionsLoading}
          installing={isInstalling}
          onInstall={onInstall}
          onShowPermissions={onShowPermissions}
          setSelectedExtension={setSelectedExtension}
        />
      );
    
    case 'installed':
      return (
        <InstalledExtensions
          extensions={installedExtensions}
          loading={installedLoading}
          uninstalling={isUninstalling}
          toggling={isToggling}
          onUninstall={onUninstall}
          onToggle={onToggle}
          onShowPermissions={onShowPermissions}
          setSelectedExtension={setSelectedExtension}
        />
      );
    
    case 'settings':
      return (
        <GlobalSettings
          settings={globalSettings}
          loading={settingsLoading}
          updating={isUpdatingSettings}
          onUpdateSettings={onUpdateSettings}
        />
      );
    
    default:
      return null;
  }
}