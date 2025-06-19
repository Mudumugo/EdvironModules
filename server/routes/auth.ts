import { Express, Request, Response } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../roleMiddleware';
import type { AuthenticatedRequest } from '../roleMiddleware';

export function registerAuthRoutes(app: Express) {
  // Get current user endpoint
  app.get('/api/auth/user', (req: Request, res: Response) => {
    if (!req.user && !req.session?.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    const user = req.session?.user || req.user;
    res.json(user);
  });

  // Demo login endpoint for testing
  app.post('/api/auth/demo-login', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Create session
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: user.permissions || []
      };

      res.json({ success: true, user: req.session.user });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Logout endpoint
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true });
    });
  });
}