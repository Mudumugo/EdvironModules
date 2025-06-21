// Module Configuration System
// Each module can be independently enabled/disabled

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  route: string;
  icon: string;
  category: 'core' | 'management' | 'analytics' | 'system';
  dependencies?: string[]; // Other modules this depends on
  permissions?: string[]; // Required user roles/permissions
  isPremium?: boolean; // Requires premium subscription
  isGlobalOnly?: boolean; // Excluded from tenant builds
}

export const MODULE_REGISTRY: ModuleConfig[] = [
  // Core Modules
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Central overview and analytics dashboard',
    enabled: true,
    route: '/',
    icon: 'BarChart3',
    category: 'core',
    permissions: ['*'] // All roles
  },
  {
    id: 'my-locker',
    name: 'My Locker',
    description: 'Personal workspace for saved resources, notes, and offline learning',
    enabled: true,
    route: '/my-locker',
    icon: 'FolderOpen',
    category: 'core',
    permissions: ['*'] // Available to all users
  },
  {
    id: 'school-management',
    name: 'School Management',
    description: 'Student, teacher, and class management system',
    enabled: true,
    route: '/school-management',
    icon: 'School',
    category: 'core',
    permissions: ['admin', 'teacher']
  },
  {
    id: 'users',
    name: 'User Management',
    description: 'Manage user roles and permissions',
    enabled: true,
    route: '/users',
    icon: 'Users',
    category: 'management',
    permissions: ['school_admin', 'principal']
  },
  {
    id: 'digital-library',
    name: 'Digital Library',
    description: 'Educational resources and content management',
    enabled: true,
    route: '/digital-library',
    icon: 'BookOpen',
    category: 'core',
    permissions: ['*']
  },
  {
    id: 'tutor-hub',
    name: 'Tutor Hub',
    description: 'Tutoring platform and session management',
    enabled: true,
    route: '/tutor-hub',
    icon: 'Presentation',
    category: 'core',
    permissions: ['tutor', 'admin']
  },

  // Management Modules
  {
    id: 'family-controls',
    name: 'Family Controls',
    description: 'Parent dashboard and student monitoring',
    enabled: true,
    route: '/family-controls',
    icon: 'Users',
    category: 'management',
    permissions: ['parent', 'admin']
  },
  {
    id: 'scheduling',
    name: 'Scheduling & Events',
    description: 'Calendar, events, and scheduling system',
    enabled: true,
    route: '/scheduling',
    icon: 'Calendar',
    category: 'management',
    permissions: ['*']
  },
  {
    id: 'device-management',
    name: 'Device Management',
    description: 'Mobile device management and monitoring',
    enabled: true, // Enable MDM capabilities
    route: '/device-management',
    icon: 'Smartphone',
    category: 'management',
    permissions: ['admin', 'teacher'],
    isPremium: true
  },

  // Analytics & Tools
  {
    id: 'analytics',
    name: 'Analytics & Reporting',
    description: 'Advanced analytics and custom reports',
    enabled: true,
    route: '/analytics',
    icon: 'BarChart3',
    category: 'analytics',
    permissions: ['admin', 'teacher']
  },
  {
    id: 'virtual-labs',
    name: 'Virtual Labs',
    description: 'Interactive virtual laboratory environment',
    enabled: false, // Optional module
    route: '/virtual-labs',
    icon: 'FlaskRound',
    category: 'analytics',
    permissions: ['teacher', 'student'],
    isPremium: true
  },
  {
    id: 'certification',
    name: 'Certification',
    description: 'Certificate generation and validation',
    enabled: false, // Optional module
    route: '/certification',
    icon: 'IdCard',
    category: 'analytics',
    permissions: ['admin', 'teacher'],
    isPremium: true
  },

  // System Modules
  {
    id: 'licensing',
    name: 'License & Subscriptions',
    description: 'Subscription management and billing',
    enabled: true,
    route: '/licensing',
    icon: 'CreditCard',
    category: 'system',
    permissions: ['admin']
  },
  {
    id: 'offline-sync',
    name: 'Offline Sync',
    description: 'Offline data synchronization',
    enabled: false, // Optional module
    route: '/offline-sync',
    icon: 'CloudDownload',
    category: 'system',
    permissions: ['admin'],
    isPremium: true
  },
  {
    id: 'settings',
    name: 'Settings',
    description: 'System configuration and user preferences',
    enabled: true,
    route: '/settings',
    icon: 'Settings',
    category: 'system',
    permissions: ['*']
  },
  
  // Global-only modules (excluded from tenant builds)
  {
    id: 'authoring-dashboard',
    name: 'Content Authoring',
    description: 'Global content creation and management for digital library',
    enabled: true,
    route: '/authoring-dashboard',
    icon: 'BookOpen',
    category: 'system',
    permissions: ['global_author', 'content_admin', 'super_admin'],
    isGlobalOnly: true // Mark as global-only feature
  }
];

import { isModuleIncluded } from "./buildConfig";

// Helper functions for module management
export function getEnabledModules(): ModuleConfig[] {
  return MODULE_REGISTRY.filter(module => module.enabled && isModuleIncluded(module.id));
}

export function getModulesByCategory(category: ModuleConfig['category']): ModuleConfig[] {
  return MODULE_REGISTRY.filter(module => module.category === category && module.enabled);
}

export function getModulesForUser(userRole: string): ModuleConfig[] {
  return MODULE_REGISTRY.filter(module => 
    module.enabled && 
    isModuleIncluded(module.id) && // Check build configuration
    (module.permissions?.includes('*') || module.permissions?.includes(userRole))
  );
}

export function toggleModule(moduleId: string, enabled: boolean): void {
  const module = MODULE_REGISTRY.find(m => m.id === moduleId);
  if (module) {
    module.enabled = enabled;
  }
}

export function isModuleEnabled(moduleId: string): boolean {
  const module = MODULE_REGISTRY.find(m => m.id === moduleId);
  return module?.enabled ?? false;
}

export function getModuleDependencies(moduleId: string): string[] {
  const module = MODULE_REGISTRY.find(m => m.id === moduleId);
  return module?.dependencies ?? [];
}

// Navigation structure based on enabled modules
export function getNavigationStructure(userRole: string = 'student') {
  const userModules = getModulesForUser(userRole);
  
  return [
    {
      section: "Core Modules",
      items: userModules.filter(m => m.category === 'core')
    },
    {
      section: "Management",
      items: userModules.filter(m => m.category === 'management')
    },
    {
      section: "Analytics & Tools",
      items: userModules.filter(m => m.category === 'analytics')
    },
    {
      section: "System",
      items: userModules.filter(m => m.category === 'system')
    }
  ].filter(section => section.items.length > 0);
}