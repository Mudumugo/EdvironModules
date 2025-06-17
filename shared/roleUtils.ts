import { USER_ROLES, PERMISSIONS, type UserRole, type Permission } from './schema';

// Role hierarchy for access control
export const ROLE_HIERARCHY = {
  [USER_ROLES.PRINCIPAL]: 100,
  [USER_ROLES.VICE_PRINCIPAL]: 90,
  [USER_ROLES.SCHOOL_ADMIN]: 80,
  [USER_ROLES.SCHOOL_IT_STAFF]: 70,
  [USER_ROLES.SCHOOL_SECURITY]: 60,
  [USER_ROLES.TEACHER]: 50,
  [USER_ROLES.TUTOR]: 40,
  [USER_ROLES.COUNSELOR]: 45,
  [USER_ROLES.LIBRARIAN]: 35,
  [USER_ROLES.PARENT]: 30,
  [USER_ROLES.STUDENT_COLLEGE]: 25,
  [USER_ROLES.STUDENT_HIGH]: 20,
  [USER_ROLES.STUDENT_MIDDLE]: 15,
  [USER_ROLES.STUDENT_ELEMENTARY]: 10,
};

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  // Student permissions by level
  [USER_ROLES.STUDENT_ELEMENTARY]: [
    PERMISSIONS.VIEW_OWN_GRADES,
    PERMISSIONS.SUBMIT_ASSIGNMENTS,
    PERMISSIONS.JOIN_VIRTUAL_CLASSES,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  [USER_ROLES.STUDENT_MIDDLE]: [
    PERMISSIONS.VIEW_OWN_GRADES,
    PERMISSIONS.SUBMIT_ASSIGNMENTS,
    PERMISSIONS.JOIN_VIRTUAL_CLASSES,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  [USER_ROLES.STUDENT_HIGH]: [
    PERMISSIONS.VIEW_OWN_GRADES,
    PERMISSIONS.SUBMIT_ASSIGNMENTS,
    PERMISSIONS.JOIN_VIRTUAL_CLASSES,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  [USER_ROLES.STUDENT_COLLEGE]: [
    PERMISSIONS.VIEW_OWN_GRADES,
    PERMISSIONS.SUBMIT_ASSIGNMENTS,
    PERMISSIONS.JOIN_VIRTUAL_CLASSES,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  
  // Teacher permissions
  [USER_ROLES.TEACHER]: [
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.GRADE_ASSIGNMENTS,
    PERMISSIONS.CREATE_ASSIGNMENTS,
    PERMISSIONS.MANAGE_ATTENDANCE,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.CONDUCT_LIVE_SESSIONS,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  
  // Tutor permissions
  [USER_ROLES.TUTOR]: [
    PERMISSIONS.GRADE_ASSIGNMENTS,
    PERMISSIONS.CREATE_ASSIGNMENTS,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.CONDUCT_LIVE_SESSIONS,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  
  // Administrative roles
  [USER_ROLES.PRINCIPAL]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
    PERMISSIONS.VIEW_ALL_ANALYTICS,
    PERMISSIONS.MANAGE_DEVICES,
    PERMISSIONS.MANAGE_LICENSING,
    PERMISSIONS.VIEW_ACCESS_LOGS,
    PERMISSIONS.MANAGE_SECURITY_POLICIES,
    PERMISSIONS.MONITOR_ACTIVITIES,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
  ],
  [USER_ROLES.VICE_PRINCIPAL]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
    PERMISSIONS.VIEW_ALL_ANALYTICS,
    PERMISSIONS.MANAGE_CLASSES,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.MONITOR_ACTIVITIES,
  ],
  [USER_ROLES.SCHOOL_ADMIN]: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
    PERMISSIONS.VIEW_ALL_ANALYTICS,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
  ],
  
  // IT Staff permissions
  [USER_ROLES.SCHOOL_IT_STAFF]: [
    PERMISSIONS.MANAGE_DEVICES,
    PERMISSIONS.CONFIGURE_SYSTEMS,
    PERMISSIONS.MANAGE_NETWORK,
    PERMISSIONS.INSTALL_SOFTWARE,
    PERMISSIONS.MANAGE_LICENSING,
  ],
  
  // Security permissions
  [USER_ROLES.SCHOOL_SECURITY]: [
    PERMISSIONS.VIEW_ACCESS_LOGS,
    PERMISSIONS.MANAGE_SECURITY_POLICIES,
    PERMISSIONS.MONITOR_ACTIVITIES,
  ],
  
  // Support staff
  [USER_ROLES.COUNSELOR]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.LIBRARIAN]: [
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  
  // Parent permissions
  [USER_ROLES.PARENT]: [
    PERMISSIONS.VIEW_OWN_GRADES,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
};

// Utility functions for role management
export function hasPermission(userRole: UserRole, userPermissions: Permission[], requiredPermission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(requiredPermission) || userPermissions.includes(requiredPermission);
}

export function hasAnyPermission(userRole: UserRole, userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.some(permission => hasPermission(userRole, userPermissions, permission));
}

export function hasAllPermissions(userRole: UserRole, userPermissions: Permission[], requiredPermissions: Permission[]): boolean {
  return requiredPermissions.every(permission => hasPermission(userRole, userPermissions, permission));
}

export function isStudent(role: UserRole): boolean {
  return role.startsWith("student_");
}

export function isTeacher(role: UserRole): boolean {
  return role === "teacher";
}

export function isAdmin(role: UserRole): boolean {
  return ["principal", "vice_principal", "school_admin"].includes(role);
}

export function isStaff(role: UserRole): boolean {
  return ["school_it_staff", "school_security", "counselor", "librarian"].includes(role);
}

export function canManageUser(currentUserRole: UserRole, targetUserRole: UserRole): boolean {
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  const targetLevel = ROLE_HIERARCHY[targetUserRole] || 0;
  return currentLevel > targetLevel;
}

export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    [USER_ROLES.STUDENT_ELEMENTARY]: "Elementary Student",
    [USER_ROLES.STUDENT_MIDDLE]: "Middle School Student",
    [USER_ROLES.STUDENT_HIGH]: "High School Student",
    [USER_ROLES.STUDENT_COLLEGE]: "College Student",
    [USER_ROLES.TEACHER]: "Teacher",
    [USER_ROLES.TUTOR]: "Tutor",
    [USER_ROLES.PRINCIPAL]: "Principal",
    [USER_ROLES.VICE_PRINCIPAL]: "Vice Principal",
    [USER_ROLES.SCHOOL_ADMIN]: "School Administrator",
    [USER_ROLES.SCHOOL_IT_STAFF]: "IT Staff",
    [USER_ROLES.SCHOOL_SECURITY]: "Security Staff",
    [USER_ROLES.COUNSELOR]: "Counselor",
    [USER_ROLES.LIBRARIAN]: "Librarian",
    [USER_ROLES.PARENT]: "Parent",
  };
  return roleNames[role] || role;
}

export function getAccessibleRoles(currentUserRole: UserRole): UserRole[] {
  const currentLevel = ROLE_HIERARCHY[currentUserRole] || 0;
  return Object.keys(ROLE_HIERARCHY).filter(role => 
    ROLE_HIERARCHY[role as UserRole] < currentLevel
  ) as UserRole[];
}