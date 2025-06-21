import { useState, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface PersonalExtension {
  id: string;
  name: string;
  description: string;
  category: 'productivity' | 'learning' | 'communication' | 'entertainment' | 'utility';
  version: string;
  isActive: boolean;
  isInstalled: boolean;
  author: string;
  rating: number;
  downloads: number;
  iconUrl?: string;
  screenshots: string[];
  permissions: string[];
  settings: Record<string, any>;
  lastUpdated: Date;
}

export interface ExtensionCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

export interface ExtensionSettings {
  notifications: boolean;
  autoUpdate: boolean;
  dataSharing: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
}

export const EXTENSION_CATEGORIES: ExtensionCategory[] = [
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Tools to help you get more done',
    icon: 'Zap',
    count: 0
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Educational tools and resources',
    icon: 'BookOpen',
    count: 0
  },
  {
    id: 'communication',
    name: 'Communication',
    description: 'Stay connected with others',
    icon: 'MessageSquare',
    count: 0
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    description: 'Fun and games',
    icon: 'Play',
    count: 0
  },
  {
    id: 'utility',
    name: 'Utilities',
    description: 'Helpful system tools',
    icon: 'Settings',
    count: 0
  }
];

export function usePersonalExtensionInterface() {
  const [activeTab, setActiveTab] = useState<'discover' | 'installed' | 'settings'>('discover');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'downloads' | 'updated'>('rating');
  const [selectedExtension, setSelectedExtension] = useState<PersonalExtension | null>(null);
  const [showPermissions, setShowPermissions] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available extensions
  const { data: availableExtensions = [], isLoading: extensionsLoading } = useQuery<PersonalExtension[]>({
    queryKey: ['/api/extensions/available', { category: selectedCategory, search: searchQuery, sort: sortBy }],
    queryFn: () => apiRequest('GET', `/api/extensions/available?category=${selectedCategory}&search=${encodeURIComponent(searchQuery)}&sort=${sortBy}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch installed extensions
  const { data: installedExtensions = [], isLoading: installedLoading } = useQuery<PersonalExtension[]>({
    queryKey: ['/api/extensions/installed'],
    queryFn: () => apiRequest('GET', '/api/extensions/installed'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch extension settings
  const { data: globalSettings, isLoading: settingsLoading } = useQuery<ExtensionSettings>({
    queryKey: ['/api/extensions/settings'],
    queryFn: () => apiRequest('GET', '/api/extensions/settings'),
  });

  // Install extension mutation
  const installExtensionMutation = useMutation({
    mutationFn: async (extensionId: string) => {
      return apiRequest('POST', `/api/extensions/${extensionId}/install`);
    },
    onSuccess: (_, extensionId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/extensions/installed'] });
      const extension = availableExtensions.find(ext => ext.id === extensionId);
      toast({
        title: "Extension installed",
        description: `${extension?.name} has been installed successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Installation failed",
        description: error.message || "Failed to install extension",
        variant: "destructive",
      });
    },
  });

  // Uninstall extension mutation
  const uninstallExtensionMutation = useMutation({
    mutationFn: async (extensionId: string) => {
      return apiRequest('DELETE', `/api/extensions/${extensionId}/install`);
    },
    onSuccess: (_, extensionId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/extensions/installed'] });
      const extension = installedExtensions.find(ext => ext.id === extensionId);
      toast({
        title: "Extension uninstalled",
        description: `${extension?.name} has been uninstalled.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Uninstall failed",
        description: error.message || "Failed to uninstall extension",
        variant: "destructive",
      });
    },
  });

  // Toggle extension active state mutation
  const toggleExtensionMutation = useMutation({
    mutationFn: async ({ extensionId, isActive }: { extensionId: string; isActive: boolean }) => {
      return apiRequest('PATCH', `/api/extensions/${extensionId}/toggle`, { isActive });
    },
    onSuccess: (_, { extensionId, isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/extensions/installed'] });
      const extension = installedExtensions.find(ext => ext.id === extensionId);
      toast({
        title: isActive ? "Extension enabled" : "Extension disabled",
        description: `${extension?.name} has been ${isActive ? 'enabled' : 'disabled'}.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Toggle failed",
        description: error.message || "Failed to toggle extension state",
        variant: "destructive",
      });
    },
  });

  // Update extension settings mutation
  const updateExtensionSettingsMutation = useMutation({
    mutationFn: async ({ extensionId, settings }: { extensionId: string; settings: Record<string, any> }) => {
      return apiRequest('PATCH', `/api/extensions/${extensionId}/settings`, { settings });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/extensions/installed'] });
      toast({
        title: "Settings updated",
        description: "Extension settings have been saved.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update extension settings",
        variant: "destructive",
      });
    },
  });

  // Update global settings mutation
  const updateGlobalSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<ExtensionSettings>) => {
      return apiRequest('PATCH', '/api/extensions/settings', settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/extensions/settings'] });
      toast({
        title: "Settings saved",
        description: "Global extension settings have been updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const installExtension = useCallback((extensionId: string) => {
    installExtensionMutation.mutate(extensionId);
  }, [installExtensionMutation]);

  const uninstallExtension = useCallback((extensionId: string) => {
    uninstallExtensionMutation.mutate(extensionId);
  }, [uninstallExtensionMutation]);

  const toggleExtension = useCallback((extensionId: string, isActive: boolean) => {
    toggleExtensionMutation.mutate({ extensionId, isActive });
  }, [toggleExtensionMutation]);

  const updateExtensionSettings = useCallback((extensionId: string, settings: Record<string, any>) => {
    updateExtensionSettingsMutation.mutate({ extensionId, settings });
  }, [updateExtensionSettingsMutation]);

  const updateGlobalSettings = useCallback((settings: Partial<ExtensionSettings>) => {
    updateGlobalSettingsMutation.mutate(settings);
  }, [updateGlobalSettingsMutation]);

  const filterExtensions = useCallback((extensions: PersonalExtension[]) => {
    let filtered = extensions;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ext => ext.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ext => 
        ext.name.toLowerCase().includes(query) ||
        ext.description.toLowerCase().includes(query) ||
        ext.author.toLowerCase().includes(query)
      );
    }

    // Sort extensions
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'updated':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const getExtensionStatus = useCallback((extensionId: string) => {
    const installed = installedExtensions.find(ext => ext.id === extensionId);
    if (!installed) return 'not_installed';
    return installed.isActive ? 'active' : 'inactive';
  }, [installedExtensions]);

  const getCategoryExtensions = useCallback((category: string) => {
    return availableExtensions.filter(ext => ext.category === category);
  }, [availableExtensions]);

  const getPopularExtensions = useCallback(() => {
    return [...availableExtensions]
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 10);
  }, [availableExtensions]);

  const getRecentlyUpdated = useCallback(() => {
    return [...availableExtensions]
      .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
      .slice(0, 10);
  }, [availableExtensions]);

  return {
    // State
    activeTab,
    selectedCategory,
    searchQuery,
    sortBy,
    selectedExtension,
    showPermissions,

    // Data
    availableExtensions: filterExtensions(availableExtensions),
    installedExtensions,
    globalSettings,
    categories: EXTENSION_CATEGORIES,

    // Loading states
    extensionsLoading,
    installedLoading,
    settingsLoading,
    isInstalling: installExtensionMutation.isPending,
    isUninstalling: uninstallExtensionMutation.isPending,
    isToggling: toggleExtensionMutation.isPending,
    isUpdatingSettings: updateExtensionSettingsMutation.isPending || updateGlobalSettingsMutation.isPending,

    // Actions
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

    // Utilities
    getExtensionStatus,
    getCategoryExtensions,
    getPopularExtensions,
    getRecentlyUpdated,

    // Computed
    activeExtensionsCount: installedExtensions.filter(ext => ext.isActive).length,
    totalInstalledCount: installedExtensions.length,
    hasActiveExtensions: installedExtensions.some(ext => ext.isActive),
  };
}