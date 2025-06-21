import { usePersonalExtensionInterface } from "@/hooks/usePersonalExtensionInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneForwarded,
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Clock,
  User,
  Settings,
  Download,
  Trash2,
  Star,
  Search
} from "lucide-react";

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
    installExtension,
    uninstallExtension,
    toggleExtension,
    updateExtensionSettings,
    updateGlobalSettings,
    getExtensionStatus,
    getCategoryExtensions,
    getPopularExtensions,
    getRecentlyUpdated,
    activeExtensionsCount,
    totalInstalledCount,
    hasActiveExtensions
  } = usePersonalExtensionInterface();

  if (extensionsLoading || installedLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Personal Extensions</h1>
          <p className="text-gray-600">Customize your EdVirons experience with extensions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline">
            {activeExtensionsCount} Active
          </Badge>
          <Badge variant="secondary">
            {totalInstalledCount} Installed
          </Badge>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'discover', label: 'Discover' },
          { id: 'installed', label: 'Installed' },
          { id: 'settings', label: 'Settings' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="updated">Updated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Extensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableExtensions.map((extension) => (
              <Card key={extension.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {extension.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{extension.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{extension.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{extension.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {extension.category}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">
                    {extension.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">by {extension.author}</p>
                    
                    <div className="flex items-center space-x-2">
                      {getExtensionStatus(extension.id) === 'not_installed' ? (
                        <Button 
                          size="sm"
                          onClick={() => installExtension(extension.id)}
                          disabled={isInstalling}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Install
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {getExtensionStatus(extension.id) === 'active' ? 'Active' : 'Installed'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {availableExtensions.length === 0 && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No extensions found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or browse different categories.</p>
            </div>
          )}
        </div>
      )}

      {/* Installed Tab */}
      {activeTab === 'installed' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {installedExtensions.map((extension) => (
              <Card key={extension.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {extension.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{extension.name}</CardTitle>
                        <p className="text-sm text-gray-600">v{extension.version}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={extension.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {extension.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">
                    {extension.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant={extension.isActive ? "outline" : "default"}
                        onClick={() => toggleExtension(extension.id, !extension.isActive)}
                        disabled={isToggling}
                      >
                        {extension.isActive ? "Disable" : "Enable"}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedExtension(extension)}
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => uninstallExtension(extension.id)}
                      disabled={isUninstalling}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {installedExtensions.length === 0 && (
            <div className="text-center py-12">
              <Download className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No extensions installed</h3>
              <p className="text-gray-500">Browse the discover tab to find and install extensions.</p>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && globalSettings && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Extension Settings</CardTitle>
              <CardDescription>Configure how extensions behave across your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Extension Notifications</Label>
                  <p className="text-sm text-gray-600">Receive notifications from active extensions</p>
                </div>
                <input
                  id="notifications"
                  type="checkbox"
                  checked={globalSettings.notifications}
                  onChange={(e) => updateGlobalSettings({ notifications: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoUpdate">Auto-update Extensions</Label>
                  <p className="text-sm text-gray-600">Automatically update extensions when new versions are available</p>
                </div>
                <input
                  id="autoUpdate"
                  type="checkbox"
                  checked={globalSettings.autoUpdate}
                  onChange={(e) => updateGlobalSettings({ autoUpdate: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Extension Theme</Label>
                <Select 
                  value={globalSettings.theme} 
                  onValueChange={(value) => updateGlobalSettings({ theme: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Extension Settings Modal */}
      {selectedExtension && (
        <Dialog open={!!selectedExtension} onOpenChange={() => setSelectedExtension(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedExtension.name} Settings</DialogTitle>
              <DialogDescription>
                Configure settings for this extension
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Extension-specific settings would be displayed here based on the extension's configuration.
              </p>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setSelectedExtension(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}