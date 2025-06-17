import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { extractTenant, requireTenantFeature, type TenantRequest } from "./tenantMiddleware";
import { fileStorage, cache, initializeBuckets } from "./minioClient";
import { upload, UploadHandlers, handleUploadError } from "./uploadMiddleware";

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily disable MinIO initialization for demonstration
  console.log('MinIO initialization disabled for demonstration mode');

  // Multi-tenant middleware - extract tenant from subdomain
  app.use(extractTenant);
  
  // Auth middleware
  await setupAuth(app);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Demo data endpoints for frontend functionality
  app.get('/api/demo/analytics', (req, res) => {
    res.json({
      totalStudents: 1247,
      totalTeachers: 89,
      totalClasses: 45,
      totalResources: 2156,
      activeSubscriptions: 12
    });
  });

  app.get('/api/demo/library-resources', (req, res) => {
    res.json([
      {
        id: 1,
        title: "Introduction to Mathematics",
        type: "video",
        subject: "Mathematics",
        grade: "Grade 9",
        difficulty: "Beginner",
        duration: 45,
        thumbnailUrl: "/placeholder.jpg"
      },
      {
        id: 2,
        title: "Science Experiments",
        type: "interactive",
        subject: "Science",
        grade: "Grade 8",
        difficulty: "Intermediate",
        duration: 30,
        thumbnailUrl: "/placeholder.jpg"
      }
    ]);
  });

  app.get('/api/demo/locker-items', (req, res) => {
    res.json([
      {
        id: 1,
        title: "My Research Notes",
        type: "note",
        content: "Important research findings...",
        isFavorite: true,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: "Useful Website",
        type: "bookmark",
        url: "https://example.com",
        isFavorite: false,
        createdAt: new Date().toISOString()
      }
    ]);
  });

  // Tenant info endpoint
  app.get('/api/tenant/info', (req: TenantRequest, res) => {
    const tenant = req.tenant || {
      id: 'demo',
      name: 'Demo University',
      subdomain: 'demo',
      features: ['dashboard', 'analytics', 'library', 'locker', 'scheduling', 'family-controls', 'tutor-hub', 'school-management'],
      subscription: 'premium'
    };
    res.json(tenant);
  });

  // User settings endpoints
  app.get('/api/user/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settings = await storage.getUserSettings(userId) || {
        id: `settings-${userId}`,
        userId,
        theme: 'light',
        language: 'en',
        notifications: { email: true, push: true, sms: false },
        preferences: {}
      };
      res.json(settings);
    } catch (error) {
      console.error("Error fetching user settings:", error);
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  app.post('/api/user/settings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const settingsData = {
        id: `settings-${userId}`,
        userId,
        ...req.body
      };
      const settings = await storage.upsertUserSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error("Error updating user settings:", error);
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}