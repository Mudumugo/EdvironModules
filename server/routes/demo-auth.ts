import { Express, Request, Response } from 'express';
import { storage } from '../storage';

export function registerDemoAuthRoutes(app: Express) {
  // Simple demo login without complex middleware
  app.post('/api/auth/demo-login', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ 
          error: 'Email is required',
          code: 'MISSING_EMAIL'
        });
      }

      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Check if account is active
      if (user.isActive === false) {
        return res.status(423).json({ 
          error: 'Account is locked',
          code: 'ACCOUNT_LOCKED'
        });
      }

      // Create session
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
        
        req.session.loginTime = Date.now();
        req.session.lastActivity = Date.now();
      }

      console.log(`Demo login successful for: ${user.email}`);
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          firstName: user.firstName,
          lastName: user.lastName
        }
      });
    } catch (error) {
      console.error('Demo login error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        code: 'INTERNAL_ERROR'
      });
    }
  });
}