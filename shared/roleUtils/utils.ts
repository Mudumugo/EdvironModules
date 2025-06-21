import type { UserRole } from '../schema';
import { USER_ROLES } from '../schema';

export function isStudent(role: UserRole): boolean {
  return role === USER_ROLES.STUDENT || role === USER_ROLES.STUDENT_LEADER;
}

export function isTeacher(role: UserRole): boolean {
  return role === USER_ROLES.TEACHER || role === USER_ROLES.TUTOR || role === USER_ROLES.SUBSTITUTE_TEACHER;
}

export function isAdmin(role: UserRole): boolean {
  return role === USER_ROLES.PRINCIPAL || 
         role === USER_ROLES.VICE_PRINCIPAL || 
         role === USER_ROLES.SCHOOL_ADMIN;
}

export function isStaff(role: UserRole): boolean {
  const staffRoles = [
    USER_ROLES.OFFICE_STAFF,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.SECRETARY,
    USER_ROLES.REGISTRAR,
    USER_ROLES.ACCOUNTANT,
    USER_ROLES.FINANCE_OFFICER,
    USER_ROLES.CUSTODIAN,
    USER_ROLES.MAINTENANCE_STAFF,
    USER_ROLES.GROUNDSKEEPER,
    USER_ROLES.CAFETERIA_STAFF,
    USER_ROLES.KITCHEN_MANAGER,
    USER_ROLES.BUS_DRIVER,
    USER_ROLES.TRANSPORT_COORDINATOR,
    USER_ROLES.NURSE,
    USER_ROLES.HEALTH_AIDE,
    USER_ROLES.PSYCHOLOGIST,
    USER_ROLES.SOCIAL_WORKER,
    USER_ROLES.SPEECH_THERAPIST,
    USER_ROLES.OCCUPATIONAL_THERAPIST,
    USER_ROLES.SPECIAL_EDUCATION_AIDE,
    USER_ROLES.TEACHING_ASSISTANT,
    USER_ROLES.PARAPROFESSIONAL,
    USER_ROLES.MEDIA_SPECIALIST,
    USER_ROLES.TECHNOLOGY_COORDINATOR,
  ];
  
  return staffRoles.includes(role);
}

export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [USER_ROLES.PRINCIPAL]: 'Principal',
    [USER_ROLES.VICE_PRINCIPAL]: 'Vice Principal',
    [USER_ROLES.SCHOOL_ADMIN]: 'School Administrator',
    [USER_ROLES.SCHOOL_IT_STAFF]: 'IT Staff',
    [USER_ROLES.SCHOOL_SECURITY]: 'Security Staff',
    [USER_ROLES.TEACHER]: 'Teacher',
    [USER_ROLES.TUTOR]: 'Tutor',
    [USER_ROLES.COUNSELOR]: 'Counselor',
    [USER_ROLES.LIBRARIAN]: 'Librarian',
    [USER_ROLES.STUDENT]: 'Student',
    [USER_ROLES.STUDENT_LEADER]: 'Student Leader',
    [USER_ROLES.PARENT]: 'Parent',
    [USER_ROLES.GUARDIAN]: 'Guardian',
    [USER_ROLES.OFFICE_STAFF]: 'Office Staff',
    [USER_ROLES.RECEPTIONIST]: 'Receptionist',
    [USER_ROLES.SECRETARY]: 'Secretary',
    [USER_ROLES.REGISTRAR]: 'Registrar',
    [USER_ROLES.ACCOUNTANT]: 'Accountant',
    [USER_ROLES.FINANCE_OFFICER]: 'Finance Officer',
    [USER_ROLES.CUSTODIAN]: 'Custodian',
    [USER_ROLES.MAINTENANCE_STAFF]: 'Maintenance Staff',
    [USER_ROLES.GROUNDSKEEPER]: 'Groundskeeper',
    [USER_ROLES.CAFETERIA_STAFF]: 'Cafeteria Staff',
    [USER_ROLES.KITCHEN_MANAGER]: 'Kitchen Manager',
    [USER_ROLES.BUS_DRIVER]: 'Bus Driver',
    [USER_ROLES.TRANSPORT_COORDINATOR]: 'Transport Coordinator',
    [USER_ROLES.NURSE]: 'School Nurse',
    [USER_ROLES.HEALTH_AIDE]: 'Health Aide',
    [USER_ROLES.PSYCHOLOGIST]: 'School Psychologist',
    [USER_ROLES.SOCIAL_WORKER]: 'Social Worker',
    [USER_ROLES.SPEECH_THERAPIST]: 'Speech Therapist',
    [USER_ROLES.OCCUPATIONAL_THERAPIST]: 'Occupational Therapist',
    [USER_ROLES.SPECIAL_EDUCATION_AIDE]: 'Special Education Aide',
    [USER_ROLES.TEACHING_ASSISTANT]: 'Teaching Assistant',
    [USER_ROLES.PARAPROFESSIONAL]: 'Paraprofessional',
    [USER_ROLES.MEDIA_SPECIALIST]: 'Media Specialist',
    [USER_ROLES.TECHNOLOGY_COORDINATOR]: 'Technology Coordinator',
    [USER_ROLES.SUBSTITUTE_TEACHER]: 'Substitute Teacher',
    [USER_ROLES.VOLUNTEER]: 'Volunteer',
    [USER_ROLES.GUEST]: 'Guest',
  };
  
  return displayNames[role] || role;
}

export function getRoleCategory(role: UserRole): string {
  if (isAdmin(role)) return 'Administration';
  if (isTeacher(role)) return 'Teaching';
  if (isStudent(role)) return 'Student';
  if (role === USER_ROLES.PARENT || role === USER_ROLES.GUARDIAN) return 'Family';
  if (isStaff(role)) return 'Support Staff';
  return 'Other';
}