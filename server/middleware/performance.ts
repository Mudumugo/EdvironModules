import { Request, Response, NextFunction } from 'express';
import compression from 'compression';

// Response compression middleware
export const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Balance between compression ratio and speed
  threshold: 1024 // Only compress responses larger than 1KB
});

// Cache control middleware
export const cacheControlMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Static assets - cache for 1 year
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  // API responses - cache for 5 minutes
  else if (req.url.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'public, max-age=300');
  }
  // HTML pages - cache for 1 hour
  else {
    res.setHeader('Cache-Control', 'public, max-age=3600');
  }
  
  next();
};

// Request timing middleware
export const timingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  
  next();
};

// Memory usage monitoring
export const memoryMonitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };
  
  // Add memory usage to response headers for debugging
  res.setHeader('X-Memory-Usage', JSON.stringify(memUsageMB));
  
  // Log high memory usage
  if (memUsageMB.heapUsed > 500) {
    console.warn(`High memory usage: ${memUsageMB.heapUsed}MB`);
  }
  
  next();
};

// Request size limiter
export const requestSizeLimiter = (maxSizeKB: number = 1024) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.headers['content-length'] || '0');
    const maxSizeBytes = maxSizeKB * 1024;
    
    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        error: 'Request too large',
        maxSize: `${maxSizeKB}KB`
      });
    }
    
    next();
  };
};

// Response optimization middleware
export const responseOptimizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Remove unnecessary headers
  res.removeHeader('X-Powered-By');
  
  // Add security headers that also improve performance
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Enable GZIP compression for text responses
  if (req.headers['accept-encoding']?.includes('gzip')) {
    res.setHeader('Content-Encoding', 'gzip');
  }
  
  next();
};