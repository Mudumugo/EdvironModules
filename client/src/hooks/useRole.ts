import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { 
  hasPermission, 
  hasAnyPermission, 
  isStudent, 
  isTeacher, 
  isAdmin, 
  isStaff
} from "@shared/roleUtils";
import { type Permission, type UserRole } from "@shared/schema";

export function useRole() {
  const user = null; // Disabled auth polling to prevent twitching

  return {
    user,
    role: user?.role as UserRole,
    permissions: (user as any)?.permissions || [],
    
    // Permission checks
    hasPermission: (permission: Permission) => 
      user ? hasPermission(user.role as UserRole, (user as any).permissions || [], permission) : false,
    
    hasAnyPermission: (permissions: Permission[]) =>
      user ? hasAnyPermission(user.role as UserRole, (user as any).permissions || [], permissions) : false,
    
    // Role type checks
    isStudent: () => user ? isStudent(user.role as UserRole) : false,
    isTeacher: () => user ? isTeacher(user.role as UserRole) : false,
    isAdmin: () => user ? isAdmin(user.role as UserRole) : false,
    isStaff: () => user ? isStaff(user.role as UserRole) : false,
    
    // Specific role checks
    isPrincipal: () => user?.role === 'principal',
    isVicePrincipal: () => user?.role === 'vice_principal',
    isSchoolAdmin: () => user?.role === 'school_admin',
    isITStaff: () => user?.role === 'school_it_staff',
    isSecurity: () => user?.role === 'school_security',
    isCounselor: () => user?.role === 'counselor',
    isLibrarian: () => user?.role === 'librarian',
    isTutor: () => user?.role === 'tutor',
    isParent: () => user?.role === 'parent',
    
    // Student level checks
    isElementaryStudent: () => user?.role === 'student_elementary',
    isMiddleStudent: () => user?.role === 'student_middle',
    isHighStudent: () => user?.role === 'student_high',
    isCollegeStudent: () => user?.role === 'student_college',
  };
}

export function useUsers() {
  const { hasPermission } = useRole();

  // Get all users (admin only)
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    enabled: hasPermission('manage_users')
  });

  // Get students (teachers and admins)
  const { data: students = [], isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/users/students'],
    enabled: hasPermission('view_student_records') || hasPermission('manage_classes')
  });

  // Get teachers (admin only)
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ['/api/users/teachers'],
    enabled: hasPermission('manage_users')
  });

  // Get available roles
  const { data: availableRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['/api/users/available-roles'],
    enabled: hasPermission('manage_users')
  });

  return {
    users,
    students,
    teachers,
    availableRoles,
    isLoading: usersLoading || studentsLoading || teachersLoading || rolesLoading
  };
}

export function useUsersByRole(role: string) {
  const { hasPermission } = useRole();

  return useQuery({
    queryKey: ['/api/users/role', role],
    enabled: hasPermission('view_student_records') && !!role
  });
}