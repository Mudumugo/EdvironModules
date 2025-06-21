import { ExtensionHeader } from "./ExtensionHeader";
import { ExtensionTabs } from "./ExtensionTabs";
import { ExtensionContent } from "./ExtensionContent";
import { ExtensionPermissionsDialog } from "./ExtensionPermissionsDialog";
import { usePersonalExtensionInterface } from "@/hooks/usePersonalExtensionInterface";

export default function PersonalExtensionInterface() {
  const {
    activeTab,
    selectedCategory,
    searchQuery,
    sortBy,
    selectedExtension,
    showPermissions,
    availableExtensions,
    installedExtensions,
    globalSettings,
    categories,
    extensionsLoading,
    installedLoading,
    settingsLoading,
    isInstalling,
    isUninstalling,
    isToggling,
    isUpdatingSettings,
    setActiveTab,
    setSelectedCategory,
    setSearchQuery,
    setSortBy,
    setSelectedExtension,
    setShowPermissions,
    handleInstall,
    handleUninstall,
    handleToggle,
    handleUpdateSettings,
    handleExportSettings,
    handleImportSettings,
  } = usePersonalExtensionInterface();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ExtensionHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onExportSettings={handleExportSettings}
        onImportSettings={handleImportSettings}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExtensionTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          installedExtensions={installedExtensions}
        />

        <ExtensionContent
          activeTab={activeTab}
          availableExtensions={availableExtensions}
          installedExtensions={installedExtensions}
          globalSettings={globalSettings}
          extensionsLoading={extensionsLoading}
          installedLoading={installedLoading}
          settingsLoading={settingsLoading}
          isInstalling={isInstalling}
          isUninstalling={isUninstalling}
          isToggling={isToggling}
          isUpdatingSettings={isUpdatingSettings}
          onInstall={handleInstall}
          onUninstall={handleUninstall}
          onToggle={handleToggle}
          onUpdateSettings={handleUpdateSettings}
          onShowPermissions={setShowPermissions}
          setSelectedExtension={setSelectedExtension}
        />

        <ExtensionPermissionsDialog
          extension={selectedExtension}
          show={showPermissions}
          onClose={() => setShowPermissions(false)}
        />
      </div>
    </div>
  );
}