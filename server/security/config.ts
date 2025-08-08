import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { Request, Response, NextFunction } from 'express';

// Rate limiting configurations for different endpoints
export const rateLimitConfigs = {
  // Authentication endpoints - stricter limits
  auth: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: {
      error: 'Too many authentication attempts, please try again later.',
      code: 'RATE_LIMIT_AUTH'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
      return req.ip + ':' + (req.body?.email || 'unknown');
    }
  }),

  // API endpoints - moderate limits
  api: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // 500 requests per window (increased for polling)
    message: {
      error: 'Too many API requests, please slow down.',
      code: 'RATE_LIMIT_API'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Auth check endpoint - very permissive for user state polling
  authCheck: rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200, // 200 requests per minute (allows frequent polling)
    message: {
      error: 'Too many authentication checks, please slow down.',
      code: 'RATE_LIMIT_AUTH_CHECK'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // File upload - stricter limits
  upload: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 uploads per hour
    message: {
      error: 'Upload limit exceeded, please try again later.',
      code: 'RATE_LIMIT_UPLOAD'
    },
    standardHeaders: true,
    legacyHeaders: false,
  }),

  // Sensitive operations (password reset, etc.)
  sensitive: rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // 3 attempts per hour
    message: {
      error: 'Too many sensitive operation attempts, please try again later.',
      code: 'RATE_LIMIT_SENSITIVE'
    },
    standardHeaders: true,
    legacyHeaders: false,
  })
};

// Helmet security configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:", "data:"], // Note: unsafe-eval needed for Vite in dev
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:", "wss:", "ws:", "http://localhost:*"],
      mediaSrc: ["'self'", "blob:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false, // Disabled for development flexibility
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input validation patterns
export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  filename: /^[a-zA-Z0-9._-]+$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  phoneNumber: /^\+?[\d\s\-\(\)]+$/,
};

// Suspicious patterns to detect potential attacks
export const suspiciousPatterns = [
  // SQL Injection patterns (but not too aggressive)
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b).*(\b(FROM|WHERE|VALUES)\b)/i,
  /(\b(OR|AND)\s+[\d\w'"=\s]+\s*[=><]\s*[\d\w'"=\s]*\s*--)/i,
  /(['"][\s]*;[\s]*--)/i,
  
  // XSS patterns
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/i,
  
  // Path traversal
  /\.\.\//,
  /\.\.\\/,
  /\/etc\/passwd/i,
  /\/windows\/system32/i,
  
  // Command injection patterns (more specific to avoid false positives)
  /[;&|`]\s*(cat|ls|pwd|rm|chmod|sudo|su|bash|sh|curl|wget)/i,
  /\$\([^)]*\)/,  // Command substitution
  /\b(cat|ls|pwd|id|whoami|uname)\s+[\/\w]/,
];

// Educational platform specific security rules
export const educationalSecurityRules = {
  // Allowed file extensions for uploads
  allowedFileExtensions: [
    '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx',
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
    '.mp3', '.wav', '.mp4', '.avi', '.mov', '.wmv',
    '.txt', '.rtf', '.csv', '.zip', '.rar'
  ],

  // Maximum file sizes (in bytes)
  maxFileSizes: {
    image: 5 * 1024 * 1024, // 5MB
    document: 10 * 1024 * 1024, // 10MB
    video: 100 * 1024 * 1024, // 100MB
    audio: 20 * 1024 * 1024, // 20MB
    general: 25 * 1024 * 1024 // 25MB
  },

  // Sensitive data patterns (to prevent accidental exposure)
  sensitiveDataPatterns: [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, // Credit card
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email in content
    /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/, // Phone number
  ],

  // Role-based access patterns
  rolePermissions: {
    student: ['read:own_profile', 'read:courses', 'write:submissions', 'read:grades'],
    teacher: ['read:own_profile', 'read:courses', 'write:grades', 'read:students', 'write:content'],
    admin: ['read:all', 'write:all', 'delete:all', 'manage:users'],
    parent: ['read:child_profile', 'read:child_grades', 'read:communications'],
    it_staff: ['manage:system', 'read:logs', 'manage:devices'],
    security_staff: ['read:security_logs', 'manage:access_controls']
  }
};