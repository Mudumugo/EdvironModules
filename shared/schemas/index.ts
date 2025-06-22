// Re-export all schemas from their respective modules
export * from './user';
export * from './tenant';
export * from './library';
export * from './content';
export * from './communication';

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