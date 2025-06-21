// Re-export everything from the modular role system
export * from './core';
export * from './permissions';
export * from './utils';

// Legacy exports for backward compatibility
export { ROLE_HIERARCHY, ROLE_PERMISSIONS } from './core';
export { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions, 
  canManageUser, 
  getAccessibleRoles 
} from './permissions';
export { 
  isStudent, 
  isTeacher, 
  isAdmin, 
  isStaff, 
  getRoleDisplayName,
  getRoleCategory 
} from './utils';