import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupSecurity } from "./security/index.js";

const app = express();

// Setup security middleware first
setupSecurity(app);

// Performance middleware
app.use((req, res, next) => {
  // Timing
  const start = Date.now();
  let headersSent = false;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (!headersSent && !res.headersSent) {
      try {
        res.setHeader('X-Response-Time', `${duration}ms`);
      } catch (e) {
        // Headers already sent, ignore
      }
    }
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.url} - ${duration}ms`);
    }
  });
  
  // Cache control - set early before any response
  if (!res.headersSent) {
    if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (req.url.startsWith('/api/')) {
      res.setHeader('Cache-Control', 'public, max-age=300');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600');
    }
  }
  
  next();
});

// Request size limiter
app.use((req, res, next) => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSizeBytes = 1024 * 1024; // 1MB
  
  if (contentLength > maxSizeBytes) {
    return res.status(413).json({
      error: 'Request too large',
      maxSize: '1MB'
    });
  }
  
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Session configuration will be handled by setupAuth

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Seed library data on startup
  // await seedLibraryData(); // Commented out temporarily

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
