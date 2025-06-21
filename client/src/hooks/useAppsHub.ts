import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  price: string;
  icon: string;
  featured: boolean;
  trending: boolean;
  recommended: boolean;
  popular: boolean;
  essential: boolean;
  premium: boolean;
  tags: string[];
  url: string;
  internal?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  appCount: number;
}

export function useAppsHub() {
  const [activeTab, setActiveTab] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showInstalled, setShowInstalled] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch apps
  const { data: apps = [], isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ['/api/apps', { category: selectedCategory, sort: sortBy, search: searchQuery }],
    queryFn: () => apiRequest('GET', `/api/apps?category=${selectedCategory}&sort=${sortBy}&search=${encodeURIComponent(searchQuery)}`),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/apps/categories'],
    queryFn: () => apiRequest('GET', '/api/apps/categories'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch installed apps
  const { data: installedApps = [], isLoading: installedLoading } = useQuery<string[]>({
    queryKey: ['/api/apps/installed'],
    queryFn: () => apiRequest('GET', '/api/apps/installed'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Install app mutation
  const installAppMutation = useMutation({
    mutationFn: async (appId: string) => {
      return apiRequest('POST', `/api/apps/${appId}/install`);
    },
    onSuccess: (_, appId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/apps/installed'] });
      const app = apps.find(a => a.id === appId);
      toast({
        title: "App installed",
        description: `${app?.name} has been installed successfully.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Installation failed",
        description: error.message || "Failed to install app",
        variant: "destructive",
      });
    },
  });

  // Uninstall app mutation
  const uninstallAppMutation = useMutation({
    mutationFn: async (appId: string) => {
      return apiRequest('DELETE', `/api/apps/${appId}/install`);
    },
    onSuccess: (_, appId) => {
      queryClient.invalidateQueries({ queryKey: ['/api/apps/installed'] });
      const app = apps.find(a => a.id === appId);
      toast({
        title: "App uninstalled",
        description: `${app?.name} has been uninstalled.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Uninstall failed",
        description: error.message || "Failed to uninstall app",
        variant: "destructive",
      });
    },
  });

  // Rate app mutation
  const rateAppMutation = useMutation({
    mutationFn: async ({ appId, rating }: { appId: string; rating: number }) => {
      return apiRequest('POST', `/api/apps/${appId}/rate`, { rating });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/apps'] });
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Rating failed",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    },
  });

  // Filter apps
  const filteredApps = apps.filter(app => {
    if (showInstalled && !installedApps.includes(app.id)) return false;
    
    switch (activeTab) {
      case 'featured':
        return app.featured;
      case 'trending':
        return app.trending;
      case 'recommended':
        return app.recommended;
      case 'essential':
        return app.essential;
      default:
        return true;
    }
  });

  // Get apps by category
  const getAppsByCategory = (categoryId: string) => {
    return apps.filter(app => categoryId === 'all' || app.category === categoryId);
  };

  // Check if app is installed
  const isAppInstalled = (appId: string) => {
    return installedApps.includes(appId);
  };

  // Get category info
  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  return {
    // State
    activeTab,
    viewMode,
    searchQuery,
    selectedCategory,
    sortBy,
    showInstalled,
    
    // Data
    apps: filteredApps,
    allApps: apps,
    categories,
    installedApps,
    
    // Loading states
    appsLoading,
    categoriesLoading,
    installedLoading,
    
    // Actions
    setActiveTab,
    setViewMode,
    setSearchQuery,
    setSelectedCategory,
    setSortBy,
    setShowInstalled,
    getAppsByCategory,
    isAppInstalled,
    getCategoryInfo,
    
    // Mutations
    installApp: installAppMutation.mutate,
    uninstallApp: uninstallAppMutation.mutate,
    rateApp: rateAppMutation.mutate,
    
    // Mutation states
    isInstalling: installAppMutation.isPending,
    isUninstalling: uninstallAppMutation.isPending,
    isRating: rateAppMutation.isPending,
  };
}