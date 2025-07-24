import { Request, Response, NextFunction } from 'express';
import { cache } from './cache';
import { SessionUser } from '../roleMiddleware';

// Optimized authentication middleware with caching
export const fastAuth = (req: any, res: Response, next: NextFunction) => {
  const sessionId = req.sessionID || req.session?.id;
  
  if (!sessionId) {
    return res.status(401).json({ 
      error: 'Not authenticated',
      code: 'NOT_AUTHENTICATED'
    });
  }

  // Check cache first for session
  const cachedUser = cache.getShort<SessionUser>(`session:${sessionId}`);
  if (cachedUser) {
    req.user = cachedUser;
    return next();
  }

  // Check session-based authentication 
  if (req.session?.user) {
    req.user = req.session.user;
    // Cache for 5 minutes
    cache.setShort(`session:${sessionId}`, req.session.user);
    return next();
  }
  
  // Check passport-based authentication
  if (req.user) {
    // Cache for 5 minutes
    cache.setShort(`session:${sessionId}`, req.user);
    return next();
  }
  
  res.status(401).json({ 
    error: 'Not authenticated',
    code: 'NOT_AUTHENTICATED'
  });
};

// Optimized logout with cache invalidation
export const fastLogout = (req: any, res: Response) => {
  const sessionId = req.sessionID || req.session?.id;
  
  // Clear cache
  if (sessionId) {
    cache.invalidate(`session:${sessionId}`);
  }
  
  // Standard logout
  if (req.session) {
    req.session.destroy((err: any) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  } else {
    res.json({ success: true, message: 'Logged out successfully' });
  }
};