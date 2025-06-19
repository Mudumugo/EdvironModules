import { Request, Response, NextFunction } from 'express';
import { hasPermission, hasAnyPermission } from '@shared/roleUtils';
import { PERMISSIONS, type Permission, type UserRole, type User } from '@shared/schema';

// Session user type (simplified for session storage)
export interface SessionUser {
  id: string;
  email: string | null;
  role: string;
  tenantId: string;
  firstName?: string | null;
  lastName?: string | null;
  permissions?: string[];
}

// Extended request type for authenticated requests
export interface AuthenticatedRequest extends Request {
  user?: SessionUser;
}

// Authentication middleware that checks session
export const isAuthenticated = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.session?.user) {
    req.user = req.session.user;
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};



// Middleware to check if user has specific permission
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // For demo purposes, allow all permissions for CRM-allowed roles
    const crmAllowedRoles = ['school_admin', 'teacher', 'it_staff', 'security_staff'];
    if (!crmAllowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: permission,
        userRole: user.role
      });
    }

    next();
  };
}

// Middleware to check if user has any of the specified permissions
export function requireAnyPermission(permissions: Permission[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // For demo purposes, allow all permissions for CRM-allowed roles
    const crmAllowedRoles = ['school_admin', 'teacher', 'it_staff', 'security_staff'];
    if (!crmAllowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        required: permissions,
        userRole: user.role
      });
    }

    next();
  };
}

// Middleware to check if user has specific role
export function requireRole(roles: UserRole | UserRole[]) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(user.role as UserRole)) {
      return res.status(403).json({ 
        message: 'Insufficient role privileges',
        required: allowedRoles,
        userRole: user.role
      });
    }

    next();
  };
}

// Middleware to check if user belongs to same tenant
export function requireSameTenant() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    const targetTenantId = req.params.tenantId || req.body.tenantId || req.query.tenantId;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (targetTenantId && user.tenantId !== targetTenantId) {
      return res.status(403).json({ 
        message: 'Access denied: Different tenant',
        userTenant: user.tenantId,
        requestedTenant: targetTenantId
      });
    }

    next();
  };
}

// Middleware to check if user can access student data (teachers can access their students, admins can access all)
export function requireStudentAccess() {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // For demo purposes, allow access for CRM-allowed roles
    const crmAllowedRoles = ['school_admin', 'teacher', 'it_staff', 'security_staff'];
    if (!crmAllowedRoles.includes(user.role)) {
      return res.status(403).json({ 
        message: 'Cannot access student data',
        userRole: user.role
      });
    }

    next();
  };
}

// Helper to check resource ownership
export function requireResourceOwnership(getResourceOwnerId: (req: AuthenticatedRequest) => string | Promise<string>) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    try {
      const resourceOwnerId = await getResourceOwnerId(req);
      
      // Allow access if user owns the resource or has admin permissions
      const isOwner = user.id === resourceOwnerId;
      const hasAdminAccess = hasAnyPermission(user.role as UserRole, (user.permissions || []) as Permission[], [
        PERMISSIONS.MANAGE_USERS,
        PERMISSIONS.VIEW_ALL_ANALYTICS
      ]);

      if (!isOwner && !hasAdminAccess) {
        return res.status(403).json({ 
          message: 'Access denied: Resource ownership required',
          userRole: user.role
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: 'Error verifying resource ownership' });
    }
  };
}

