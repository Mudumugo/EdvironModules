import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getModulesForUser } from '@/config/modules';
import { hasGlobalAuthoringAccess } from '@/config/buildConfig';

interface NavigationItem {
  id: string;
  title: string;
  url: string;
  icon: any;
  visible: boolean;
}

export function useTenantAwareNavigation() {
  const { user } = useAuth();
  
  const navigationItems = useMemo(() => {
    if (!user) return [];
    
    // Get modules available to this user in current build
    const availableModules = getModulesForUser(user.role);
    
    // Filter out global-only features for tenant users
    return availableModules
      .filter(module => {
        // For authoring dashboard, do additional access check
        if (module.id === 'authoring-dashboard') {
          return hasGlobalAuthoringAccess(user.role);
        }
        return true;
      })
      .map(module => ({
        id: module.id,
        title: module.name,
        url: module.route,
        icon: module.icon,
        visible: true
      }));
  }, [user]);

  return navigationItems;
}

export function isTenantBuild(): boolean {
  return import.meta.env.VITE_BUILD_TYPE === 'tenant';
}

export function isGlobalBuild(): boolean {
  return import.meta.env.VITE_BUILD_TYPE === 'global';
}
