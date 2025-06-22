// Re-export all schemas from their respective modules
export * from './user';
export * from './tenant';
export * from './library';
export * from './content';
export * from './communication';
export * from './crm';
export * from './session';
export * from './calendar';
export * from './academic';

// Legacy imports for existing schemas - only include if files exist
// Note: These are commented out as the files may not exist yet
// export * from './xapi.schema';
// export * from './education.schema';
// export * from './mdm.schema';
// export * from './activity.schema';
// export * from './signup.schema';

// Additional types and utilities
export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin' | 'school_admin' | 'school_it_staff' | 'school_security' | 'global_author';

export type Permission = 
  | 'read_books'
  | 'write_books'
  | 'manage_library'
  | 'create_content'
  | 'manage_users'
  | 'manage_tenant'
  | 'view_analytics'
  | 'manage_assignments'
  | 'grade_assignments'
  | 'send_messages'
  | 'manage_announcements'
  | 'manage_events'
  | 'manage_classes'
  | 'view_reports'
  | 'export_data'
  | 'manage_settings';

// User role definitions
export const USER_ROLES = {
  // Student roles by education level
  STUDENT_ELEMENTARY: "student_elementary",
  STUDENT_MIDDLE: "student_middle", 
  STUDENT_HIGH: "student_high",
  STUDENT_COLLEGE: "student_college",
  
  // Educational staff
  TEACHER: "teacher",
  TUTOR: "tutor",
  PRINCIPAL: "principal",
  VICE_PRINCIPAL: "vice_principal",
  COUNSELOR: "counselor",
  LIBRARIAN: "librarian",
  
  // Administrative staff
  SCHOOL_ADMIN: "school_admin",
  SCHOOL_SECURITY: "school_security",
  SCHOOL_IT_STAFF: "school_it_staff",
  IT_STAFF: "it_staff",
  SECURITY_STAFF: "security_staff",
  
  // Non-teaching staff
  OFFICE_STAFF: "office_staff",
  RECEPTIONIST: "receptionist",
  SECRETARY: "secretary",
  REGISTRAR: "registrar",
  ACCOUNTANT: "accountant",
  FINANCE_OFFICER: "finance_officer",
  CUSTODIAN: "custodian",
  MAINTENANCE_STAFF: "maintenance_staff",
  GROUNDSKEEPER: "groundskeeper",
  CAFETERIA_STAFF: "cafeteria_staff",
  KITCHEN_MANAGER: "kitchen_manager",
  BUS_DRIVER: "bus_driver",
  TRANSPORT_COORDINATOR: "transport_coordinator",
  NURSE: "nurse",
  HEALTH_AIDE: "health_aide",
  PSYCHOLOGIST: "psychologist",
  SOCIAL_WORKER: "social_worker",
  SPEECH_THERAPIST: "speech_therapist",
  OCCUPATIONAL_THERAPIST: "occupational_therapist",
  SPECIAL_EDUCATION_AIDE: "special_education_aide",
  TEACHING_ASSISTANT: "teaching_assistant",
  PARAPROFESSIONAL: "paraprofessional",
  MEDIA_SPECIALIST: "media_specialist",
  TECHNOLOGY_COORDINATOR: "technology_coordinator",
  ATHLETIC_DIRECTOR: "athletic_director",
  COACH: "coach",
  ACTIVITY_COORDINATOR: "activity_coordinator",
  
  // Family
  PARENT: "parent"
} as const;

export const GRADE_LEVELS = {
  // Elementary
  KINDERGARTEN: "K",
  GRADE_1: "1", GRADE_2: "2", GRADE_3: "3", GRADE_4: "4", GRADE_5: "5",
  
  // Middle School
  GRADE_6: "6", GRADE_7: "7", GRADE_8: "8",
  
  // High School
  GRADE_9: "9", GRADE_10: "10", GRADE_11: "11", GRADE_12: "12",
  
  // College
  COLLEGE_YEAR_1: "College Year 1",
  COLLEGE_YEAR_2: "College Year 2", 
  COLLEGE_YEAR_3: "College Year 3",
  COLLEGE_YEAR_4: "College Year 4",
  GRADUATE: "Graduate"
} as const;

export const PERMISSIONS = {
  // Student permissions
  VIEW_OWN_GRADES: "view_own_grades",
  SUBMIT_ASSIGNMENTS: "submit_assignments",
  JOIN_VIRTUAL_CLASSES: "join_virtual_classes",
  ACCESS_LIBRARY: "access_library",
  VIEW_SCHEDULE: "view_schedule",
  
  // Teacher permissions
  MANAGE_CLASSES: "manage_classes",
  GRADE_ASSIGNMENTS: "grade_assignments",
  CREATE_ASSIGNMENTS: "create_assignments",
  MANAGE_ATTENDANCE: "manage_attendance",
  VIEW_STUDENT_RECORDS: "view_student_records",
  CONDUCT_LIVE_SESSIONS: "conduct_live_sessions",
  
  // Admin permissions
  MANAGE_USERS: "manage_users",
  MANAGE_SCHOOL_SETTINGS: "manage_school_settings",
  VIEW_ALL_ANALYTICS: "view_all_analytics",
  MANAGE_DEVICES: "manage_devices",
  MANAGE_LICENSING: "manage_licensing",
  
  // IT Staff permissions
  CONFIGURE_SYSTEMS: "configure_systems",
  MANAGE_NETWORK: "manage_network",
  INSTALL_SOFTWARE: "install_software",
  
  // Security permissions
  SECURITY_VIEW: "security_view",
  SECURITY_MANAGE: "security_manage",
  VIEW_ACCESS_LOGS: "view_access_logs",
  MANAGE_SECURITY_POLICIES: "manage_security_policies",
  MONITOR_ACTIVITIES: "monitor_activities",
  MANAGE_SECURITY: "manage_security",
  
  // PBX Communication permissions
  MANAGE_PBX: "manage_pbx",
  EMERGENCY_BROADCAST: "emergency_broadcast",
  PAGE_DEVICES: "page_devices",
  VIEW_CALL_LOGS: "view_call_logs",
  
  // Library permissions
  READ_BOOKS: "read_books",
  WRITE_BOOKS: "write_books",
  MANAGE_LIBRARY: "manage_library",
  CREATE_CONTENT: "create_content",
  MANAGE_TENANT: "manage_tenant",
  VIEW_ANALYTICS: "view_analytics",
  SEND_MESSAGES: "send_messages",
  MANAGE_ANNOUNCEMENTS: "manage_announcements",
  MANAGE_EVENTS: "manage_events",
  VIEW_REPORTS: "view_reports",
  EXPORT_DATA: "export_data",
  MANAGE_SETTINGS: "manage_settings",
} as const;

export type GradeLevel = typeof GRADE_LEVELS[keyof typeof GRADE_LEVELS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    'read_books',
    'send_messages',
  ],
  teacher: [
    'read_books',
    'write_books',
    'create_content',
    'manage_assignments',
    'grade_assignments',
    'send_messages',
    'manage_announcements',
    'manage_events',
    'manage_classes',
    'view_reports',
  ],
  parent: [
    'read_books',
    'send_messages',
    'view_reports',
  ],
  admin: [
    'read_books',
    'write_books',
    'manage_library',
    'create_content',
    'manage_users',
    'view_analytics',
    'manage_assignments',
    'grade_assignments',
    'send_messages',
    'manage_announcements',
    'manage_events',
    'manage_classes',
    'view_reports',
    'export_data',
    'manage_settings',
  ],
  school_admin: [
    'read_books',
    'write_books',
    'manage_library',
    'create_content',
    'manage_users',
    'manage_tenant',
    'view_analytics',
    'manage_assignments',
    'grade_assignments',
    'send_messages',
    'manage_announcements',
    'manage_events',
    'manage_classes',
    'view_reports',
    'export_data',
    'manage_settings',
  ],
  school_it_staff: [
    'read_books',
    'manage_users',
    'view_analytics',
    'manage_settings',
    'export_data',
  ],
  school_security: [
    'read_books',
    'view_reports',
  ],
  global_author: [
    'read_books',
    'write_books',
    'manage_library',
    'create_content',
    'view_analytics',
    'export_data',
  ],
  super_admin: [
    'read_books',
    'write_books',
    'manage_library',
    'create_content',
    'manage_users',
    'manage_tenant',
    'view_analytics',
    'manage_assignments',
    'grade_assignments',
    'send_messages',
    'manage_announcements',
    'manage_events',
    'manage_classes',
    'view_reports',
    'export_data',
    'manage_settings',
  ],
};