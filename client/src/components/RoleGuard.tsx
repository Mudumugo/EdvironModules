import { ReactNode } from 'react';
import { useRole } from '@/hooks/useRole';
import { type Permission, type UserRole } from '@shared/roleUtils';

interface RoleGuardProps {
  children: ReactNode;
  roles?: UserRole[];
  permissions?: Permission[];
  requireAll?: boolean; // If true, user must have ALL permissions; if false, ANY permission
  fallback?: ReactNode;
}

export function RoleGuard({ 
  children, 
  roles, 
  permissions, 
  requireAll = false, 
  fallback = null 
}: RoleGuardProps) {
  const { role, hasPermission, hasAnyPermission } = useRole();

  // Check role access
  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) {
      return <>{fallback}</>;
    }
  }

  // Check permission access
  if (permissions && permissions.length > 0) {
    let hasAccess = false;
    
    if (requireAll) {
      hasAccess = permissions.every(permission => hasPermission(permission));
    } else {
      hasAccess = hasAnyPermission(permissions);
    }
    
    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

// Convenience components for common role checks
export function StudentOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      roles={['student_elementary', 'student_middle', 'student_high', 'student_college']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function TeacherOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard roles={['teacher']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      roles={['principal', 'vice_principal', 'school_admin']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function StaffOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      roles={['school_it_staff', 'school_security', 'counselor', 'librarian']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}

export function EducatorOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard 
      roles={['teacher', 'tutor', 'principal', 'vice_principal']}
      fallback={fallback}
    >
      {children}
    </RoleGuard>
  );
}