import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

// Compression middleware for faster responses
export const compressionMiddleware = compression({
  level: 6, // Good balance of compression vs CPU
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: any, res: any) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Response optimization middleware
export const responseOptimizer = (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  
  res.json = function(obj: any) {
    // Set performance headers
    res.setHeader('X-Powered-By', 'EdVirons-Optimized');
    
    // Enable HTTP/2 Server Push hints
    if (req.url === '/api/auth/user' && obj.id) {
      res.setHeader('Link', '</api/notifications>; rel=prefetch');
    }
    
    return originalJson.call(this, obj);
  };
  
  next();
};

// Memory usage monitoring
export const memoryMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const startMemory = process.memoryUsage();
  
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    const endMemory = process.memoryUsage();
    
    const memoryDelta = {
      rss: endMemory.rss - startMemory.rss,
      heapUsed: endMemory.heapUsed - startMemory.heapUsed,
      heapTotal: endMemory.heapTotal - startMemory.heapTotal,
      external: endMemory.external - startMemory.external
    };
    
    // Log memory spikes
    if (memoryDelta.heapUsed > 10 * 1024 * 1024) { // 10MB spike
      console.warn(`[MEMORY SPIKE] ${req.method} ${req.url} - Heap: +${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    }
    
    // Log slow requests with memory usage
    if (duration > 1000) {
      console.warn(`[PERFORMANCE] ${req.method} ${req.url} - ${duration.toFixed(2)}ms - Heap: +${(memoryDelta.heapUsed / 1024 / 1024).toFixed(2)}MB`);
    }
  });
  
  next();
};

// Request rate limiter per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const simpleRateLimit = (maxRequests: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    
    const record = requestCounts.get(ip);
    
    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((record.resetTime - now) / 1000)
      });
    }
    
    record.count++;
    next();
  };
};

// Cache headers optimizer
export const cacheHeaders = (req: Request, res: Response, next: NextFunction) => {
  const url = req.url;
  
  // API routes
  if (url.startsWith('/api/')) {
    if (url.includes('/auth/user')) {
      res.setHeader('Cache-Control', 'private, no-cache');
    } else if (url.includes('/library/') || url.includes('/subjects')) {
      res.setHeader('Cache-Control', 'public, max-age=300'); // 5 minutes
    } else {
      res.setHeader('Cache-Control', 'public, max-age=60'); // 1 minute
    }
  }
  
  // Static assets
  else if (url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); // 1 year
  }
  
  // HTML pages
  else {
    res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
  }
  
  next();
};