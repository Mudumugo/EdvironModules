import { useAuth } from "@/hooks/useAuth";
import { hasModuleAccess } from "@/config/rolePermissions";
import { UserRole } from "@shared/schema";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  moduleId?: string;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export default function RoleProtectedRoute({ 
  children, 
  moduleId, 
  allowedRoles = [], 
  redirectTo = "/" 
}: RoleProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      // User not authenticated, will be handled by App.tsx
      return;
    }

    const userRole = user.role as UserRole;
    
    // Check module-based access
    if (moduleId && !hasModuleAccess(userRole, moduleId)) {
      console.warn(`Access denied: User role '${userRole}' cannot access module '${moduleId}'`);
      setLocation(redirectTo);
      return;
    }

    // Check role-based access
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      console.warn(`Access denied: User role '${userRole}' not in allowed roles [${allowedRoles.join(', ')}]`);
      setLocation(redirectTo);
      return;
    }
  }, [user, isLoading, moduleId, allowedRoles, redirectTo, setLocation]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null; // Will be handled by main app routing
  }

  const userRole = user.role as UserRole;

  // Check access permissions
  if (moduleId && !hasModuleAccess(userRole, moduleId)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this module.</p>
        </div>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Your role doesn't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}