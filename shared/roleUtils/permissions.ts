import { ROLE_HIERARCHY, ROLE_PERMISSIONS } from './core';
import type { UserRole, Permission } from '../schema';

export function hasPermission(userRole: UserRole, userPermissions: Permission[], requiredPermission: Permission): boolean {
  // Check if user has the specific permission
  if (userPermissions.includes(requiredPermission)) {
    return true;
  }
  
  // Check if user's role includes the permission
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(requiredPermission);
}

export function hasAnyPermission(userRole: UserRole, userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => 
    hasPermission(userRole, userPermissions, permission)
  );
}

export function hasAllPermissions(userRole: UserRole, userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => 
    hasPermission(userRole, userPermissions, permission)
  );
}

export function canManageUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetUserRole] || 0;
  
  // Can manage users with lower hierarchy level
  return currentLevel > targetLevel;
}

export function getAccessibleRoles(currentUserRole: UserRole): UserRole[] {
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => currentLevel > level)
    .map(([role, _]) => role as UserRole);
}