import { Express, Request, Response } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../roleMiddleware';
import type { AuthenticatedRequest } from '../roleMiddleware';
import { validationPatterns } from '../security/config.js';
import { validateInput, validationSchemas } from '../security/validation.js';
import NodeCache from 'node-cache';

// Cache for demo users to improve login performance
const demoUserCache = new NodeCache({ 
  stdTTL: 300, // 5 minutes cache
  checkperiod: 60 // Check for expired keys every minute
});

// Pre-populate demo user cache for instant login
const DEMO_USERS = {
  // EdVirons Global Team
  'demo.admin@edvirons.com': {
    id: 'demo_edvirons_admin',
    email: 'demo.admin@edvirons.com',
    role: 'edvirons_admin',
    tenantId: 'edvirons-global',
    firstName: 'EdVirons',
    lastName: 'Admin',
    isActive: true,
    permissions: ['global_admin', 'apps_management', 'support_management', 'licensing_management', 'tenant_management']
  },
  'demo.content@edvirons.com': {
    id: 'demo_edvirons_content',
    email: 'demo.content@edvirons.com',
    role: 'edvirons_content_manager',
    tenantId: 'edvirons-global',
    firstName: 'EdVirons',
    lastName: 'Content Manager',
    isActive: true,
    permissions: ['apps_management', 'content_management']
  },
  'demo.support@edvirons.com': {
    id: 'demo_edvirons_support',
    email: 'demo.support@edvirons.com',
    role: 'edvirons_support',
    tenantId: 'edvirons-global',
    firstName: 'EdVirons',
    lastName: 'Support',
    isActive: true,
    permissions: ['support_management', 'ticket_management']
  },
  // School Tenant Users
  'student@edvirons.com': {
    id: 'demo_student_elementary',
    email: 'student@edvirons.com',
    role: 'student_elementary',
    tenantId: 'demo_tenant',
    firstName: 'Demo',
    lastName: 'Student',
    isActive: true,
    permissions: []
  },
  'demo.teacher@edvirons.com': {
    id: 'demo_teacher',
    email: 'demo.teacher@edvirons.com',
    role: 'teacher',
    tenantId: 'demo_tenant',
    firstName: 'Demo',
    lastName: 'Teacher',
    isActive: true,
    permissions: []
  },
  'demo.school@edvirons.com': {
    id: 'demo_school_admin',
    email: 'demo.school@edvirons.com',
    role: 'school_admin',
    tenantId: 'demo_tenant',
    firstName: 'Demo',
    lastName: 'School Admin',
    isActive: true,
    permissions: []
  },
  'demo.school_it_staff@edvirons.com': {
    id: 'demo_school_it_staff',
    email: 'demo.school_it_staff@edvirons.com',
    role: 'school_it_staff',
    tenantId: 'demo_tenant',
    firstName: 'Demo',
    lastName: 'IT Staff',
    isActive: true,
    permissions: []
  },
  'demo.author@edvirons.com': {
    id: 'demo_global_author',
    email: 'demo.author@edvirons.com',
    role: 'global_author',
    tenantId: 'demo_tenant',
    firstName: 'Demo',
    lastName: 'Author',
    isActive: true,
    permissions: []
  }
};

// Initialize demo user cache
Object.entries(DEMO_USERS).forEach(([email, user]) => {
  demoUserCache.set(email, user);
});

// Debug: Log initialized demo users
console.log('[DEMO USERS] Initialized demo users:', Object.keys(DEMO_USERS));

export function registerAuthRoutes(app: Express) {
  // Get current user endpoint with session validation
  app.get('/api/auth/user', (req: Request, res: Response) => {
    // Debug session state (remove in production)
    // console.log(`[DEBUG] Session check - sessionID: ${req.sessionID}, user in session: ${!!req.session?.user}, passport user: ${!!req.user}`);
    
    if (!req.user && !req.session?.user) {
      return res.status(401).json({ 
        error: 'Not authenticated',
        code: 'NOT_AUTHENTICATED'
      });
    }
    
    const user = req.session?.user || req.user;
    
    // Add session info if available
    const sessionInfo = req.session ? {
      loginTime: (req.session as any).loginTime,
      lastActivity: (req.session as any).lastActivity,
      expiresAt: (req.session as any).loginTime ? (req.session as any).loginTime + (24 * 60 * 60 * 1000) : null
    } : null;
    
    res.json({
      ...user,
      sessionInfo
    });
  });

  // Demo login endpoint for testing with enhanced security and caching
  app.post('/api/auth/demo-login', 
    validateInput({
      email: {
        required: true,
        type: 'string',
        pattern: validationPatterns.email
      }
    }),
    async (req: Request, res: Response) => {
      try {
        const { email } = req.body;

        // Check cache first for demo users (instant response)
        let user = demoUserCache.get(email);
        
        if (!user) {
          // Only hit database for non-demo users
          user = await storage.getUserByEmail(email);
          
          // Cache non-demo users temporarily
          if (user) {
            demoUserCache.set(email, user, 60); // 1 minute cache for non-demo
          }
        }
        
        if (!user) {
          console.warn(`[SECURITY] Demo login attempt for non-existent user: ${email} from IP: ${req.ip}`);
          return res.status(404).json({ 
            error: 'User not found',
            code: 'USER_NOT_FOUND'
          });
        }

        // Check if account is active
        if ((user as any).isActive === false) {
          console.warn(`[SECURITY] Demo login attempt for inactive user: ${email} from IP: ${req.ip}`);
          return res.status(423).json({ 
            error: 'Account is locked. Please contact administrator.',
            code: 'ACCOUNT_LOCKED'
          });
        }

        // Create optimized session with minimal data
        const sessionUser = {
          id: (user as any).id,
          email: (user as any).email,
          role: (user as any).role,
          tenantId: (user as any).tenantId,
          firstName: (user as any).firstName,
          lastName: (user as any).lastName,
          permissions: (user as any).permissions || []
        };

        // Set session data efficiently and ensure it's saved
        const currentTime = Date.now();
        req.session.user = sessionUser;
        (req.session as any).loginTime = currentTime;
        (req.session as any).lastIP = req.ip;
        (req.session as any).lastActivity = currentTime;
        
        // Force session save before responding and add webview compatibility headers
        await new Promise<void>((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(err);
            else resolve();
          });
        });
        
        // Add webview compatibility headers
        res.header('X-Frame-Options', 'SAMEORIGIN');
        res.header('Access-Control-Allow-Credentials', 'true');

        // Log successful demo login (async to not block response)
        setImmediate(() => {
          console.log(`[SECURITY] Demo login successful for user: ${(user as any).email} (${(user as any).id}) from IP: ${req.ip}`);
        });

        // Send immediate response
        res.json({ 
          success: true, 
          user: sessionUser,
          sessionInfo: {
            loginTime: currentTime,
            expiresAt: currentTime + (24 * 60 * 60 * 1000)
          }
        });
      } catch (error) {
        console.error('Demo login error:', error);
        res.status(500).json({ 
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        });
      }
    }
  );

  // Logout endpoint with enhanced cleanup (POST)
  app.post('/api/auth/logout', (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id || req.session?.user?.id;
    const userEmail = req.user?.email || req.session?.user?.email;
    
    // Enhanced session cleanup for demo accounts
    if (req.session) {
      // Clear all session data immediately
      req.session.user = undefined;
      (req.session as any).loginTime = null;
      (req.session as any).lastActivity = null;
      (req.session as any).lastIP = null;
    }
    
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
      res.clearCookie('edvirons.sid'); // Clear custom session cookie too
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