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

  // MDM Device Management API endpoints
  app.get('/api/mdm/devices', isAuthenticated, async (req: any, res) => {
    try {
      // Return mock devices with realistic MDM data
      const devices = [
        {
          id: "device-001",
          userId: "user-001",
          deviceName: "Sarah's iPad Pro",
          deviceType: "tablet",
          platform: "iOS",
          osVersion: "17.2.1",
          model: "iPad Pro 11-inch (4th generation)",
          serialNumber: "F9FY3K2LMNPQ",
          status: "active",
          enrollmentDate: "2024-01-10T08:00:00Z",
          lastSeen: "2024-01-15T14:30:00Z",
          location: { lat: 40.7128, lng: -74.0060, accuracy: 10, timestamp: "2024-01-15T14:30:00Z" },
          batteryLevel: 87,
          storageUsed: 34.2,
          storageTotal: 128,
          isSupervised: true,
          isCompliant: true,
          installedApps: [
            { name: "Khan Academy", version: "7.5.2", category: "Education" },
            { name: "Duolingo", version: "6.148.0", category: "Education" },
            { name: "Safari", version: "17.2", category: "Utility", isSystemApp: true }
          ],
          user: { name: "Sarah Johnson", email: "sarah.j@school.edu", role: "student" }
        },
        {
          id: "device-002",
          userId: "user-002",
          deviceName: "Math Lab Laptop 05",
          deviceType: "laptop",
          platform: "Windows",
          osVersion: "11 Pro",
          model: "Dell Latitude 5520",
          serialNumber: "3XK9MN7PQRST",
          status: "active",
          enrollmentDate: "2024-01-08T09:15:00Z",
          lastSeen: "2024-01-15T13:45:00Z",
          location: { lat: 40.7589, lng: -73.9851, accuracy: 5, timestamp: "2024-01-15T13:45:00Z" },
          batteryLevel: 42,
          storageUsed: 189.7,
          storageTotal: 256,
          isSupervised: true,
          isCompliant: false,
          complianceIssues: ["Unauthorized gaming application detected", "Screen time policy violation"],
          installedApps: [
            { name: "Microsoft Edge", version: "120.0.2210.91", category: "Browser", isSystemApp: true },
            { name: "GeoGebra", version: "6.0.762", category: "Education" },
            { name: "Steam", version: "3.5.91", category: "Gaming", isRestricted: true }
          ],
          user: { name: "Michael Chen", email: "m.chen@school.edu", role: "student" }
        },
        {
          id: "device-003",
          userId: "user-003",
          deviceName: "Teacher iPhone 14",
          deviceType: "smartphone",
          platform: "iOS",
          osVersion: "17.1.2",
          model: "iPhone 14",
          serialNumber: "F2GH4J5KLMNO",
          status: "lost",
          enrollmentDate: "2024-01-05T10:30:00Z",
          lastSeen: "2024-01-14T16:20:00Z",
          location: { lat: 40.7831, lng: -73.9712, accuracy: 50, timestamp: "2024-01-14T16:20:00Z" },
          batteryLevel: 8,
          storageUsed: 89.3,
          storageTotal: 128,
          isSupervised: true,
          isCompliant: true,
          installedApps: [
            { name: "ClassDojo", version: "5.65.2", category: "Education" },
            { name: "Google Classroom", version: "2.2023.47201", category: "Education" },
            { name: "Settings", version: "1.0", category: "System", isSystemApp: true }
          ],
          user: { name: "Emma Wilson", email: "e.wilson@school.edu", role: "teacher" }
        }
      ];
      
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.get('/api/mdm/violations', isAuthenticated, async (req: any, res) => {
    try {
      const violations = [
        {
          id: 1,
          deviceId: "device-002",
          deviceName: "Math Lab Laptop 05",
          violationType: "unauthorized_app",
          severity: "high",
          description: "Gaming application (Steam) detected during class hours. This violates the educational device usage policy.",
          detectedAt: "2024-01-15T10:30:00Z",
          status: "open",
          policyName: "Educational Device Usage Policy",
          user: { name: "Michael Chen", email: "m.chen@school.edu" }
        },
        {
          id: 2,
          deviceId: "device-001",
          deviceName: "Sarah's iPad Pro",
          violationType: "screen_time_exceeded",
          severity: "medium",
          description: "Daily screen time limit of 6 hours exceeded by 2.5 hours. Current usage: 8.5 hours.",
          detectedAt: "2024-01-14T20:15:00Z",
          status: "acknowledged",
          policyName: "Student Screen Time Policy",
          user: { name: "Sarah Johnson", email: "sarah.j@school.edu" }
        },
        {
          id: 3,
          deviceId: "device-003",
          deviceName: "Teacher iPhone 14",
          violationType: "location_violation",
          severity: "critical",
          description: "Device reported outside of authorized school premises for extended period. Current status: Lost/Stolen.",
          detectedAt: "2024-01-14T18:30:00Z",
          status: "open",
          policyName: "Device Location Tracking Policy",
          user: { name: "Emma Wilson", email: "e.wilson@school.edu" }
        }
      ];
      
      res.json(violations);
    } catch (error) {
      console.error("Error fetching violations:", error);
      res.status(500).json({ message: "Failed to fetch compliance violations" });
    }
  });

  app.post('/api/mdm/remote-action', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId, action, parameters } = req.body;
      const userId = req.user.claims.sub;
      
      // Simulate remote action execution
      const actionResult = {
        id: Date.now(),
        deviceId,
        actionType: action,
        initiatedBy: userId,
        status: "success",
        parameters,
        result: `${action} command executed successfully`,
        initiatedAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };

      console.log(`Remote action ${action} initiated for device ${deviceId} by user ${userId}`);
      
      res.json(actionResult);
    } catch (error) {
      console.error("Error executing remote action:", error);
      res.status(500).json({ message: "Failed to execute remote action" });
    }
  });

  app.get('/api/mdm/screen-time/:deviceId', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      
      // Mock screen time data
      const screenTimeData = {
        deviceId,
        date: new Date().toISOString().split('T')[0],
        totalScreenTime: 485, // 8 hours 5 minutes
        educationalTime: 320, // 5 hours 20 minutes
        entertainmentTime: 120, // 2 hours
        socialTime: 45, // 45 minutes
        appBreakdown: {
          "Khan Academy": 180,
          "Duolingo": 90,
          "Safari": 120,
          "YouTube": 60,
          "Messages": 35
        },
        categoryBreakdown: {
          "Education": 320,
          "Entertainment": 120,
          "Social": 45
        },
        peakUsageHours: [9, 10, 14, 15, 19, 20]
      };
      
      res.json(screenTimeData);
    } catch (error) {
      console.error("Error fetching screen time data:", error);
      res.status(500).json({ message: "Failed to fetch screen time data" });
    }
  });

  app.get('/api/mdm/policies', isAuthenticated, async (req: any, res) => {
    try {
      const policies = [
        {
          id: 1,
          name: "Student Device Usage Policy",
          description: "Standard policy for student-owned devices during school hours",
          targetType: "user_role",
          targetIds: ["student"],
          policyType: "app_restriction",
          rules: {
            allowedApps: ["Khan Academy", "Duolingo", "Safari", "Notes", "Calculator"],
            blockedCategories: ["Gaming", "Social Media"],
            screenTimeLimit: 360, // 6 hours
            allowedHours: { start: "07:00", end: "18:00" }
          },
          isActive: true,
          priority: 1,
          createdAt: "2024-01-01T00:00:00Z"
        },
        {
          id: 2,
          name: "Teacher Device Policy",
          description: "Enhanced permissions for teaching staff devices",
          targetType: "user_role",
          targetIds: ["teacher"],
          policyType: "content_filter",
          rules: {
            allowedCategories: ["Education", "Productivity", "Communication"],
            contentFilter: {
              enabled: true,
              strictness: "moderate",
              blockedDomains: ["facebook.com", "twitter.com", "instagram.com"]
            }
          },
          isActive: true,
          priority: 2,
          createdAt: "2024-01-01T00:00:00Z"
        },
        {
          id: 3,
          name: "Lab Equipment Security Policy",
          description: "Security and monitoring policy for shared lab devices",
          targetType: "device_type",
          targetIds: ["laptop"],
          policyType: "location",
          rules: {
            allowedLocations: [
              { name: "Main Campus", lat: 40.7589, lng: -73.9851, radius: 500 },
              { name: "Science Building", lat: 40.7590, lng: -73.9850, radius: 100 }
            ],
            locationTracking: true,
            alertOnLocationViolation: true
          },
          isActive: true,
          priority: 3,
          createdAt: "2024-01-01T00:00:00Z"
        }
      ];
      
      res.json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch device policies" });
    }
  });

  app.get('/api/mdm/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const analytics = {
        deviceDistribution: {
          tablets: 45,
          laptops: 32,
          smartphones: 28,
          desktops: 15
        },
        complianceStatus: {
          compliant: 95,
          nonCompliant: 15,
          pendingReview: 10
        },
        usagePatterns: {
          peakHours: [9, 10, 11, 14, 15, 16],
          averageScreenTime: 342, // minutes
          topApps: [
            { name: "Khan Academy", usage: 180 },
            { name: "Google Classroom", usage: 150 },
            { name: "Duolingo", usage: 120 },
            { name: "Safari", usage: 90 },
            { name: "Notes", usage: 75 }
          ]
        },
        securityAlerts: {
          high: 2,
          medium: 8,
          low: 15,
          resolved: 45
        }
      };
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching MDM analytics:", error);
      res.status(500).json({ message: "Failed to fetch MDM analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}