import { Request, Response, NextFunction } from 'express';
import { validationPatterns, suspiciousPatterns, educationalSecurityRules } from './config.js';
import { AuthenticatedRequest } from '../roleMiddleware.js';

// Enhanced request logging for security monitoring
export function securityLogger(req: Request, res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  const userAgent = req.get('User-Agent') || 'unknown';
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.url;
  const body = req.body;

  // Log suspicious requests
  const isSuspicious = checkSuspiciousActivity(req);
  if (isSuspicious) {
    console.warn(`[SECURITY] Suspicious request detected:`, {
      timestamp,
      ip,
      userAgent,
      method,
      url,
      body: body ? JSON.stringify(body).substring(0, 200) : 'no body',
      reason: isSuspicious
    });
  }

  // Log authentication attempts
  if (url.includes('/auth/') || url.includes('/login')) {
    console.log(`[AUTH] Authentication attempt:`, {
      timestamp,
      ip,
      userAgent,
      method,
      url,
      email: body?.email || 'unknown'
    });
  }

  next();
}

// Check for suspicious activity patterns
function checkSuspiciousActivity(req: Request): string | null {
  try {
    // Skip development-related URLs to reduce noise
    const developmentPatterns = [
      /@vite/,
      /@react-refresh/,
      /\.tsx(\?v=|$)/,
      /\.ts(\?v=|$)/,
      /\.js(\?v=|$)/,
      /\.css(\?v=|$)/,
      /@fs\/home\/runner\/workspace/,
      /\/src\//
    ];
    
    if (developmentPatterns.some(pattern => pattern.test(req.url))) {
      return null;
    }

    const combinedInput = JSON.stringify({
      url: req.url,
      query: req.query,
      body: req.body || {},
      headers: req.headers || {}
    });

    // Skip authentication and basic API endpoints from pattern matching
    const skipPatterns = ['/api/auth/', '/api/notifications', '/api/'];
    if (skipPatterns.some(skip => req.url.includes(skip))) {
      return null;
    }

    // Skip common legitimate query patterns
    const legitimatePatterns = [
      /\?v=/, // Vite cache busting
      /\?t=/, // Timestamp query
      /\/api\//, // API endpoints
    ];
    
    if (legitimatePatterns.some(pattern => pattern.test(req.url))) {
      return null;
    }

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(combinedInput)) {
        return `Matched suspicious pattern: ${pattern.source}`;
      }
    }

    // Check for rapid requests from same IP
    if (req.rateLimit && req.rateLimit.remaining < 10) {
      return 'High request frequency detected';
    }

    // Check for unusual user agent patterns (excluding development tools)
    const userAgent = req.get('User-Agent') || '';
    const isDevelopmentAgent = userAgent.includes('Replit-Bonsai') || userAgent.includes('curl') || userAgent.includes('Postman');
    
    if (!isDevelopmentAgent && (userAgent.length === 0 || userAgent.includes('bot') || userAgent.includes('crawler'))) {
      return 'Suspicious user agent';
    }

    return null;
  } catch (error) {
    console.error('Error in checkSuspiciousActivity:', error);
    return null;
  }
}

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
}

function sanitizeObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return sanitizeString(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized: any = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}

function sanitizeString(input: any): string {
  if (typeof input !== 'string') {
    return String(input);
  }
  
  // Remove dangerous characters and patterns
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/[<>'"]/g, '');
}

// File upload validation
export function validateFileUpload(req: Request, res: Response, next: NextFunction) {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];
  
  for (const file of files) {
    if (!file) continue;
    
    const extension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (!educationalSecurityRules.allowedFileExtensions.includes(extension)) {
      return res.status(400).json({
        error: 'File type not allowed',
        allowedTypes: educationalSecurityRules.allowedFileExtensions
      });
    }
    
    const maxSize = getMaxFileSizeForType(extension);
    if (file.size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        maxSize: maxSize,
        fileSize: file.size
      });
    }
  }
  
  next();
}

function getMaxFileSizeForType(extension: string): number {
  const imageTypes = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const videoTypes = ['.mp4', '.avi', '.mov', '.wmv'];
  const audioTypes = ['.mp3', '.wav'];
  const documentTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.rtf', '.csv'];

  if (imageTypes.includes(extension)) return educationalSecurityRules.maxFileSizes.image;
  if (videoTypes.includes(extension)) return educationalSecurityRules.maxFileSizes.video;
  if (audioTypes.includes(extension)) return educationalSecurityRules.maxFileSizes.audio;
  if (documentTypes.includes(extension)) return educationalSecurityRules.maxFileSizes.document;
  
  return educationalSecurityRules.maxFileSizes.general;
}

// Content scanning for sensitive data
export function scanForSensitiveData(req: Request, res: Response, next: NextFunction) {
  if (!req.body) return next();

  const content = JSON.stringify(req.body);
  
  for (const pattern of educationalSecurityRules.sensitiveDataPatterns) {
    if (pattern.test(content)) {
      console.warn(`[SECURITY] Sensitive data pattern detected in request from ${req.ip}`);
      return res.status(400).json({
        error: 'Content contains sensitive data patterns',
        code: 'SENSITIVE_DATA_DETECTED'
      });
    }
  }

  next();
}

// Session security validation
export function validateSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.user || !req.session) {
    return next();
  }

  // Check session age
  const sessionAge = Date.now() - (req.session.cookie.originalMaxAge || 0);
  const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

  if (sessionAge > maxSessionAge) {
    req.session.destroy((err) => {
      if (err) console.error('Error destroying session:', err);
    });
    return res.status(401).json({ error: 'Session expired' });
  }

  next();
}

// Request size limiting middleware
export function limitRequestSize(maxSize: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    if (contentLength > maxSize) {
      return res.status(413).json({
        error: 'Request too large',
        maxSize: maxSize
      });
    }
    next();
  };
}

// Role-based access control
export function requirePermissions(permissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const allowedPermissions = educationalSecurityRules.rolePermissions[userRole as keyof typeof educationalSecurityRules.rolePermissions] || [];

    const hasPermission = permissions.some(permission => 
      allowedPermissions.includes(permission) || 
      allowedPermissions.includes('read:all') || 
      allowedPermissions.includes('write:all') ||
      allowedPermissions.includes('manage:all')
    );

    if (!hasPermission) {
      console.warn(`[SECURITY] Permission denied for user ${req.user.id} (${userRole}) accessing ${req.url}`);
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        code: 'PERMISSION_DENIED',
        required: permissions,
        userRole: userRole
      });
    }

    next();
  };
}