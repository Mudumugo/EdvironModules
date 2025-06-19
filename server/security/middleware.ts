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

function sanitizeString(input: any): any {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

// File upload security middleware
export function validateFileUpload(req: Request, res: Response, next: NextFunction) {
  if (!req.file && !req.files) {
    return next();
  }

  const files = req.files ? (Array.isArray(req.files) ? req.files : [req.files]) : [req.file];
  
  for (const file of files) {
    if (!file) continue;

    // Check file extension
    const ext = '.' + file.originalname.split('.').pop()?.toLowerCase();
    if (!educationalSecurityRules.allowedFileExtensions.includes(ext)) {
      return res.status(400).json({
        error: 'File type not allowed',
        code: 'INVALID_FILE_TYPE',
        allowedTypes: educationalSecurityRules.allowedFileExtensions
      });
    }

    // Check file size
    const maxSize = getMaxFileSizeForType(ext);
    if (file.size > maxSize) {
      return res.status(400).json({
        error: 'File size exceeds limit',
        code: 'FILE_TOO_LARGE',
        maxSize: maxSize,
        actualSize: file.size
      });
    }

    // Check filename for suspicious patterns
    if (!validationPatterns.filename.test(file.originalname)) {
      return res.status(400).json({
        error: 'Invalid filename',
        code: 'INVALID_FILENAME'
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
      if (err) console.error('Session destruction error:', err);
    });
    return res.status(401).json({
      error: 'Session expired',
      code: 'SESSION_EXPIRED'
    });
  }

  // Check for session hijacking indicators
  const currentIP = req.ip;
  const currentUserAgent = req.get('User-Agent');
  
  if (req.session.lastIP && req.session.lastIP !== currentIP) {
    console.warn(`[SECURITY] IP change detected for user ${req.user.id}: ${req.session.lastIP} -> ${currentIP}`);
    // In production, you might want to force re-authentication here
  }

  if (req.session.lastUserAgent && req.session.lastUserAgent !== currentUserAgent) {
    console.warn(`[SECURITY] User agent change detected for user ${req.user.id}`);
    // In production, you might want to force re-authentication here
  }

  // Update session tracking
  req.session.lastIP = currentIP;
  req.session.lastUserAgent = currentUserAgent;
  req.session.lastActivity = Date.now();

  next();
}

// Request size limiting
export function limitRequestSize(maxSize: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('Content-Length') || '0');
    
    if (contentLength > maxSize) {
      return res.status(413).json({
        error: 'Request too large',
        code: 'REQUEST_TOO_LARGE',
        maxSize: maxSize,
        actualSize: contentLength
      });
    }

    next();
  };
}