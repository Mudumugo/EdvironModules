// Main export file for dashboard hooks
export * from './types';
export { useWidgets } from './useWidgets';
export { useQuickActions } from './useQuickActions';
export { useRecentActivity } from './useRecentActivity';
export { useDashboardStats } from './useDashboardStats';

// Combined dashboard hook
import { useWidgets } from './useWidgets';
import { useQuickActions } from './useQuickActions';
import { useRecentActivity } from './useRecentActivity';
import { useDashboardStats } from './useDashboardStats';
import { useState } from 'react';
import { DashboardPreferences } from './types';

const DEFAULT_PREFERENCES: DashboardPreferences = {
  theme: 'auto',
  layout: 'comfortable',
  defaultView: 'overview',
  showQuickActions: true,
  showRecentActivity: true,
  refreshInterval: 5,
  autoSave: true
};

export function useDashboard() {
  const [preferences, setPreferences] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);
  const [isCustomizing, setIsCustomizing] = useState(false);
  
  const widgets = useWidgets();
  const quickActions = useQuickActions();
  const recentActivity = useRecentActivity();
  const stats = useDashboardStats();

  const updatePreferences = (newPreferences: Partial<DashboardPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  const toggleCustomizeMode = () => {
    setIsCustomizing(prev => !prev);
  };

  const resetDashboard = () => {
    widgets.resetWidgets();
    stats.resetStats();
    recentActivity.clearAllActivities();
    setPreferences(DEFAULT_PREFERENCES);
    setIsCustomizing(false);
  };

  return {
    // State
    preferences,
    isCustomizing,
    
    // Widget management
    ...widgets,
    
    // Quick actions
    quickActions: quickActions.quickActions,
    favoriteActions: quickActions.favoriteActions,
    executeAction: quickActions.executeAction,
    getActionsByCategory: quickActions.getActionsByCategory,
    getFavoriteActions: quickActions.getFavoriteActions,
    
    // Recent activity
    activities: recentActivity.activities,
    addActivity: recentActivity.addActivity,
    getRecentActivities: recentActivity.getRecentActivities,
    
    // Statistics
    stats: stats.stats,
    statsLoading: stats.loading,
    refreshStats: stats.refreshStats,
    getOverallHealth: stats.getOverallHealth,
    getImportantMetrics: stats.getImportantMetrics,
    
    // Preferences and customization
    updatePreferences,
    toggleCustomizeMode,
    resetDashboard
  };
}