// Build configuration for tenant-specific deployments
// Controls which features/routes are included in different build types

export type BuildType = 'global' | 'tenant' | 'development';

export interface BuildConfig {
  type: BuildType;
  excludedRoutes: string[];
  excludedModules: string[];
  excludedComponents: string[];
}

// Features that are only available in global/development builds
const GLOBAL_ONLY_FEATURES = {
  routes: ['/authoring-dashboard'],
  modules: ['authoring-dashboard'],
  components: ['AuthoringDashboard']
};

export const BUILD_CONFIGS: Record<BuildType, BuildConfig> = {
  global: {
    type: 'global',
    excludedRoutes: [],
    excludedModules: [],
    excludedComponents: []
  },
  tenant: {
    type: 'tenant',
    excludedRoutes: GLOBAL_ONLY_FEATURES.routes,
    excludedModules: GLOBAL_ONLY_FEATURES.modules,
    excludedComponents: GLOBAL_ONLY_FEATURES.components
  },
  development: {
    type: 'development',
    excludedRoutes: [],
    excludedModules: [],
    excludedComponents: []
  }
};

// Get current build configuration from environment
export function getCurrentBuildConfig(): BuildConfig {
  const buildType = (import.meta.env.VITE_BUILD_TYPE as BuildType) || 'development';
  return BUILD_CONFIGS[buildType];
}

// Check if a route should be included in current build
export function isRouteIncluded(route: string): boolean {
  const config = getCurrentBuildConfig();
  return !config.excludedRoutes.includes(route);
}

// Check if a module should be included in current build
export function isModuleIncluded(moduleId: string): boolean {
  const config = getCurrentBuildConfig();
  return !config.excludedModules.includes(moduleId);
}

// Check if a component should be included in current build
export function isComponentIncluded(componentName: string): boolean {
  const config = getCurrentBuildConfig();
  return !config.excludedComponents.includes(componentName);
}

// Check if user has access to global features (content authoring)
export function hasGlobalAuthoringAccess(userRole?: string): boolean {
  const config = getCurrentBuildConfig();
  
  // In tenant builds, authoring is never accessible
  if (config.type === 'tenant') {
    return false;
  }
  
  // In global/development builds, check role permissions
  const authoringRoles = ['global_author', 'content_admin', 'super_admin'];
  return userRole ? authoringRoles.includes(userRole) : false;
}