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
  
  // Non-teaching staff - Office and Administrative
  [USER_ROLES.OFFICE_STAFF]: 32,
  [USER_ROLES.RECEPTIONIST]: 32,
  [USER_ROLES.SECRETARY]: 35,
  [USER_ROLES.REGISTRAR]: 38,
  [USER_ROLES.ACCOUNTANT]: 35,
  [USER_ROLES.FINANCE_OFFICER]: 38,
  
  // Non-teaching staff - Maintenance and Facilities
  [USER_ROLES.CUSTODIAN]: 30,
  [USER_ROLES.MAINTENANCE_STAFF]: 30,
  [USER_ROLES.GROUNDSKEEPER]: 30,
  
  // Non-teaching staff - Food Services
  [USER_ROLES.CAFETERIA_STAFF]: 30,
  [USER_ROLES.KITCHEN_MANAGER]: 35,
  
  // Non-teaching staff - Transportation
  [USER_ROLES.BUS_DRIVER]: 30,
  [USER_ROLES.TRANSPORT_COORDINATOR]: 35,
  
  // Non-teaching staff - Health and Wellness
  [USER_ROLES.NURSE]: 42,
  [USER_ROLES.HEALTH_AIDE]: 35,
  [USER_ROLES.PSYCHOLOGIST]: 45,
  [USER_ROLES.SOCIAL_WORKER]: 45,
  [USER_ROLES.SPEECH_THERAPIST]: 42,
  [USER_ROLES.OCCUPATIONAL_THERAPIST]: 42,
  
  // Non-teaching staff - Educational Support
  [USER_ROLES.SPECIAL_EDUCATION_AIDE]: 35,
  [USER_ROLES.TEACHING_ASSISTANT]: 35,
  [USER_ROLES.PARAPROFESSIONAL]: 35,
  [USER_ROLES.MEDIA_SPECIALIST]: 38,
  [USER_ROLES.TECHNOLOGY_COORDINATOR]: 40,
  
  // Non-teaching staff - Athletics and Activities
  [USER_ROLES.ATHLETIC_DIRECTOR]: 45,
  [USER_ROLES.COACH]: 38,
  [USER_ROLES.ACTIVITY_COORDINATOR]: 35,
  
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
    PERMISSIONS.MANAGE_SECURITY,
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
    PERMISSIONS.MANAGE_SECURITY,
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
    PERMISSIONS.MANAGE_SECURITY,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
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
  
  // Non-teaching staff - Office and Administrative
  [USER_ROLES.OFFICE_STAFF]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.RECEPTIONIST]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.SECRETARY]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
  ],
  [USER_ROLES.REGISTRAR]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  [USER_ROLES.ACCOUNTANT]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.FINANCE_OFFICER]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
  ],
  
  // Non-teaching staff - Maintenance and Facilities
  [USER_ROLES.CUSTODIAN]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.MAINTENANCE_STAFF]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.GROUNDSKEEPER]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  
  // Non-teaching staff - Food Services
  [USER_ROLES.CAFETERIA_STAFF]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.KITCHEN_MANAGER]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
  ],
  
  // Non-teaching staff - Transportation
  [USER_ROLES.BUS_DRIVER]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.TRANSPORT_COORDINATOR]: [
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
  ],
  
  // Non-teaching staff - Health and Wellness
  [USER_ROLES.NURSE]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.HEALTH_AIDE]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.PSYCHOLOGIST]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.SOCIAL_WORKER]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.SPEECH_THERAPIST]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.OCCUPATIONAL_THERAPIST]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  
  // Non-teaching staff - Educational Support
  [USER_ROLES.SPECIAL_EDUCATION_AIDE]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.TEACHING_ASSISTANT]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.PARAPROFESSIONAL]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.MEDIA_SPECIALIST]: [
    PERMISSIONS.ACCESS_LIBRARY,
    PERMISSIONS.VIEW_SCHEDULE,
  ],
  [USER_ROLES.TECHNOLOGY_COORDINATOR]: [
    PERMISSIONS.MANAGE_DEVICES,
    PERMISSIONS.CONFIGURE_SYSTEMS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  
  // Non-teaching staff - Athletics and Activities
  [USER_ROLES.ATHLETIC_DIRECTOR]: [
    PERMISSIONS.MANAGE_SCHOOL_SETTINGS,
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.COACH]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
  ],
  [USER_ROLES.ACTIVITY_COORDINATOR]: [
    PERMISSIONS.VIEW_STUDENT_RECORDS,
    PERMISSIONS.VIEW_SCHEDULE,
    PERMISSIONS.ACCESS_LIBRARY,
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
  const permissions = userPermissions || [];
  return rolePermissions.includes(requiredPermission) || permissions.includes(requiredPermission);
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
  const staffRoles = [
    "school_it_staff", "school_security", "counselor", "librarian",
    // Non-teaching staff - Office and Administrative
    "office_staff", "receptionist", "secretary", "registrar", "accountant", "finance_officer",
    // Non-teaching staff - Maintenance and Facilities
    "custodian", "maintenance_staff", "groundskeeper",
    // Non-teaching staff - Food Services
    "cafeteria_staff", "kitchen_manager",
    // Non-teaching staff - Transportation
    "bus_driver", "transport_coordinator",
    // Non-teaching staff - Health and Wellness
    "nurse", "health_aide", "psychologist", "social_worker", "speech_therapist", "occupational_therapist",
    // Non-teaching staff - Educational Support
    "special_education_aide", "teaching_assistant", "paraprofessional", "media_specialist", "technology_coordinator",
    // Non-teaching staff - Athletics and Activities
    "athletic_director", "coach", "activity_coordinator"
  ];
  return staffRoles.includes(role);
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
    
    // Non-teaching staff - Office and Administrative
    [USER_ROLES.OFFICE_STAFF]: "Office Staff",
    [USER_ROLES.RECEPTIONIST]: "Receptionist",
    [USER_ROLES.SECRETARY]: "Secretary",
    [USER_ROLES.REGISTRAR]: "Registrar",
    [USER_ROLES.ACCOUNTANT]: "Accountant",
    [USER_ROLES.FINANCE_OFFICER]: "Finance Officer",
    
    // Non-teaching staff - Maintenance and Facilities
    [USER_ROLES.CUSTODIAN]: "Custodian",
    [USER_ROLES.MAINTENANCE_STAFF]: "Maintenance Staff",
    [USER_ROLES.GROUNDSKEEPER]: "Groundskeeper",
    
    // Non-teaching staff - Food Services
    [USER_ROLES.CAFETERIA_STAFF]: "Cafeteria Staff",
    [USER_ROLES.KITCHEN_MANAGER]: "Kitchen Manager",
    
    // Non-teaching staff - Transportation
    [USER_ROLES.BUS_DRIVER]: "Bus Driver",
    [USER_ROLES.TRANSPORT_COORDINATOR]: "Transport Coordinator",
    
    // Non-teaching staff - Health and Wellness
    [USER_ROLES.NURSE]: "School Nurse",
    [USER_ROLES.HEALTH_AIDE]: "Health Aide",
    [USER_ROLES.PSYCHOLOGIST]: "School Psychologist",
    [USER_ROLES.SOCIAL_WORKER]: "Social Worker",
    [USER_ROLES.SPEECH_THERAPIST]: "Speech Therapist",
    [USER_ROLES.OCCUPATIONAL_THERAPIST]: "Occupational Therapist",
    
    // Non-teaching staff - Educational Support
    [USER_ROLES.SPECIAL_EDUCATION_AIDE]: "Special Education Aide",
    [USER_ROLES.TEACHING_ASSISTANT]: "Teaching Assistant",
    [USER_ROLES.PARAPROFESSIONAL]: "Paraprofessional",
    [USER_ROLES.MEDIA_SPECIALIST]: "Media Specialist",
    [USER_ROLES.TECHNOLOGY_COORDINATOR]: "Technology Coordinator",
    
    // Non-teaching staff - Athletics and Activities
    [USER_ROLES.ATHLETIC_DIRECTOR]: "Athletic Director",
    [USER_ROLES.COACH]: "Coach",
    [USER_ROLES.ACTIVITY_COORDINATOR]: "Activity Coordinator",
    
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