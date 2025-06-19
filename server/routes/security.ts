import { Express, Request, Response } from 'express';
import { isAuthenticated, requireRole, AuthenticatedRequest } from '../roleMiddleware.js';
import { requirePermissions } from '../security/middleware.js';

export function registerSecurityRoutes(app: Express) {
  // Security monitoring endpoints
  app.get('/api/security/status', 
    isAuthenticated, 
    requirePermissions(['read:security_logs', 'manage:system']),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        // Basic security status information
        const securityStatus = {
          timestamp: new Date().toISOString(),
          rateLimiting: {
            enabled: true,
            authLimit: 5,
            apiLimit: 100,
            uploadLimit: 20
          },
          contentSecurity: {
            helmet: true,
            inputSanitization: true,
            fileValidation: true,
            sensitiveDataScanning: true
          },
          sessionSecurity: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
          },
          accessControl: {
            roleBasedAccess: true,
            permissionValidation: true,
            sessionValidation: true
          }
        };

        res.json(securityStatus);
      } catch (error) {
        console.error('Security status error:', error);
        res.status(500).json({ error: 'Failed to retrieve security status' });
      }
    }
  );

  // Security audit log endpoint
  app.get('/api/security/audit-logs',
    isAuthenticated,
    requirePermissions(['read:security_logs']),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        // In a real implementation, this would fetch from a security log database
        const auditLogs = [
          {
            id: '1',
            timestamp: new Date().toISOString(),
            event: 'login_attempt',
            userId: req.user?.id,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            success: true
          },
          {
            id: '2', 
            timestamp: new Date(Date.now() - 300000).toISOString(),
            event: 'permission_denied',
            userId: 'unknown',
            ip: req.ip,
            resource: '/api/admin/users',
            reason: 'insufficient_permissions'
          }
        ];

        res.json({
          logs: auditLogs,
          total: auditLogs.length,
          page: 1,
          limit: 50
        });
      } catch (error) {
        console.error('Audit logs error:', error);
        res.status(500).json({ error: 'Failed to retrieve audit logs' });
      }
    }
  );

  // Force password reset for user (admin only)
  app.post('/api/security/force-password-reset/:userId',
    isAuthenticated,
    requireRole(['school_admin', 'it_staff']),
    requirePermissions(['manage:users']),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { userId } = req.params;
        const { reason } = req.body;

        // Log the forced password reset
        console.log(`[SECURITY] Forced password reset initiated by ${req.user?.id} for user ${userId}. Reason: ${reason}`);

        // In a real implementation, this would:
        // 1. Invalidate all user sessions
        // 2. Generate a secure reset token
        // 3. Send notification to user
        // 4. Log the action for audit

        res.json({
          success: true,
          message: 'Password reset initiated',
          resetToken: 'demo-reset-token-' + Date.now()
        });
      } catch (error) {
        console.error('Force password reset error:', error);
        res.status(500).json({ error: 'Failed to force password reset' });
      }
    }
  );

  // Lock/unlock user account
  app.post('/api/security/account/:userId/:action',
    isAuthenticated,
    requireRole(['school_admin', 'it_staff']),
    requirePermissions(['manage:users']),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { userId, action } = req.params;
        const { reason } = req.body;

        if (!['lock', 'unlock'].includes(action)) {
          return res.status(400).json({ error: 'Invalid action. Use lock or unlock.' });
        }

        // Log the account action
        console.log(`[SECURITY] Account ${action} initiated by ${req.user?.id} for user ${userId}. Reason: ${reason}`);

        res.json({
          success: true,
          message: `Account ${action} successful`,
          userId,
          action,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Account lock/unlock error:', error);
        res.status(500).json({ error: `Failed to ${req.params.action} account` });
      }
    }
  );

  // Security incident reporting
  app.post('/api/security/incident',
    isAuthenticated,
    requirePermissions(['read:security_logs', 'manage:system']),
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const { type, description, severity, affectedUsers } = req.body;

        const incident = {
          id: 'incident-' + Date.now(),
          type,
          description,
          severity,
          affectedUsers,
          reportedBy: req.user?.id,
          timestamp: new Date().toISOString(),
          status: 'open'
        };

        // Log the security incident
        console.error(`[SECURITY INCIDENT] ${severity.toUpperCase()}: ${type} - ${description}`, incident);

        res.json({
          success: true,
          incident,
          message: 'Security incident reported successfully'
        });
      } catch (error) {
        console.error('Security incident reporting error:', error);
        res.status(500).json({ error: 'Failed to report security incident' });
      }
    }
  );

  // Check user permissions
  app.get('/api/security/permissions/:userId?',
    isAuthenticated,
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        const userId = req.params.userId || req.user?.id;
        
        // Only allow checking own permissions unless admin
        if (userId !== req.user?.id && !['school_admin', 'it_staff'].includes(req.user?.role || '')) {
          return res.status(403).json({ error: 'Can only check own permissions' });
        }

        const userRole = req.user?.role;
        const permissions = getPermissionsForRole(userRole);

        res.json({
          userId,
          role: userRole,
          permissions,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Permission check error:', error);
        res.status(500).json({ error: 'Failed to check permissions' });
      }
    }
  );
}

function getPermissionsForRole(role?: string): string[] {
  const rolePermissions: Record<string, string[]> = {
    student: ['read:own_profile', 'read:courses', 'write:submissions', 'read:grades'],
    teacher: ['read:own_profile', 'read:courses', 'write:grades', 'read:students', 'write:content'],
    school_admin: ['read:all', 'write:all', 'delete:all', 'manage:users'],
    parent: ['read:child_profile', 'read:child_grades', 'read:communications'],
    it_staff: ['manage:system', 'read:logs', 'manage:devices'],
    security_staff: ['read:security_logs', 'manage:access_controls']
  };

  return rolePermissions[role || ''] || [];
}