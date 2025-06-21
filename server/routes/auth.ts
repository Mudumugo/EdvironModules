import { Express, Request, Response } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../roleMiddleware';
import type { AuthenticatedRequest } from '../roleMiddleware';
import { validationPatterns } from '../security/config.js';
import { validateInput, validationSchemas } from '../security/validation.js';

export function registerAuthRoutes(app: Express) {
  // Get current user endpoint with session validation
  app.get('/api/auth/user', (req: Request, res: Response) => {
    if (!req.user && !req.session?.user) {
      return res.status(401).json({ 
        error: 'Not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    const user = req.session?.user || req.user;
    
    // Add session info if available
    const sessionInfo = req.session ? {
      loginTime: req.session.loginTime,
      lastActivity: req.session.lastActivity,
      expiresAt: req.session.loginTime ? req.session.loginTime + (24 * 60 * 60 * 1000) : null
    } : null;
    
    res.json({
      ...user,
      sessionInfo
    });
  });

  // Demo login endpoint
  app.post('/api/auth/demo-login', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email required' });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Simple session creation
      if (req.session) {
        req.session.user = {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          firstName: user.firstName,
          lastName: user.lastName,
          permissions: user.permissions || []
        };
      }

      res.json({ 
        success: true, 
        user: req.session?.user 
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Logout endpoint with security logging (POST)
  app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.session?.user?.id;
    const userEmail = req.user?.email || req.session?.user?.email;
    
    req.session.destroy((err) => {
      if (err) {
        console.error(`[SECURITY] Logout error for user ${userId}:`, err);
        return res.status(500).json({ 
          error: 'Failed to logout',
          code: 'LOGOUT_ERROR'
        });
      }
      
      // Log successful logout
      if (userId) {
        console.log(`[SECURITY] User logged out: ${userEmail} (${userId}) from IP: ${req.ip}`);
      }
      
      res.clearCookie('connect.sid');
      res.json({ 
        success: true,
        message: 'Logged out successfully'
      });
    });
  });

  // Logout endpoint (GET for legacy support)
  app.get('/api/logout', (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.session?.user?.id;
    const userEmail = req.user?.email || req.session?.user?.email;
    
    req.session.destroy((err) => {
      if (err) {
        console.error(`[SECURITY] Logout error for user ${userId}:`, err);
        return res.redirect('/?error=logout_failed');
      }
      
      // Log successful logout
      if (userId) {
        console.log(`[SECURITY] User logged out: ${userEmail} (${userId}) from IP: ${req.ip}`);
      }
      
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
}