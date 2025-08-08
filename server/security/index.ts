import { Express } from 'express';
import { rateLimitConfigs, helmetConfig } from './config.js';
import { 
  securityLogger, 
  sanitizeInput, 
  validateFileUpload, 
  scanForSensitiveData,
  validateSession,
  limitRequestSize 
} from './middleware.js';

export function setupSecurity(app: Express) {
  // Apply helmet for basic security headers
  app.use(helmetConfig);

  // Security logging
  app.use(securityLogger);

  // Request size limiting (general 10MB limit)
  app.use(limitRequestSize(10 * 1024 * 1024));

  // Input sanitization for all requests
  app.use(sanitizeInput);

  // Session validation for authenticated routes
  app.use('/api', validateSession);

  // Rate limiting for authentication endpoints
  app.use('/api/auth/user', rateLimitConfigs.authCheck); // Permissive rate limiting for auth checks
  app.use('/api/auth/login', rateLimitConfigs.auth);
  app.use('/api/auth/signup', rateLimitConfigs.auth);
  app.use('/api/auth/reset-password', rateLimitConfigs.sensitive);
  app.use('/api/auth/change-password', rateLimitConfigs.sensitive);

  // Rate limiting for API endpoints
  app.use('/api', rateLimitConfigs.api);

  // File upload validation
  app.use('/api/upload', validateFileUpload);
  app.use('/api/locker', validateFileUpload);
  app.use('/api/assignments/submit', validateFileUpload);

  // Content scanning for sensitive data
  app.use('/api/messages', scanForSensitiveData);
  app.use('/api/posts', scanForSensitiveData);
  app.use('/api/comments', scanForSensitiveData);

  // Specific rate limits for high-risk endpoints
  app.use('/api/upload', rateLimitConfigs.upload);
  app.use('/api/admin', rateLimitConfigs.sensitive);

  console.log('[SECURITY] Security middleware initialized');
}

// Export middleware for specific route protection
export * from './middleware.js';
export * from './config.js';