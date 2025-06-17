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

  // License Compliance Management API endpoints
  app.get('/api/licenses', isAuthenticated, async (req: any, res) => {
    try {
      const licenses = [
        {
          id: 1,
          softwareName: "Microsoft Office 365 Education",
          vendor: "Microsoft",
          licenseType: "subscription",
          totalSeats: 500,
          usedSeats: 387,
          availableSeats: 113,
          expirationDate: "2024-08-31T23:59:59Z",
          purchaseDate: "2023-09-01T00:00:00Z",
          cost: 12500.00,
          complianceStatus: "compliant",
          isActive: true,
          metadata: {
            contactEmail: "licensing@microsoft.com",
            renewalReminder: 60 // days before expiration
          }
        },
        {
          id: 2,
          softwareName: "Adobe Creative Suite Educational",
          vendor: "Adobe",
          licenseType: "educational",
          totalSeats: 50,
          usedSeats: 52,
          availableSeats: -2,
          expirationDate: "2024-06-30T23:59:59Z",
          purchaseDate: "2023-07-01T00:00:00Z",
          cost: 8950.00,
          complianceStatus: "over_licensed",
          isActive: true,
          metadata: {
            department: "Art & Design",
            overageAlert: true
          }
        },
        {
          id: 3,
          softwareName: "Mathematica Educational License",
          vendor: "Wolfram Research",
          licenseType: "perpetual",
          totalSeats: 25,
          usedSeats: 18,
          availableSeats: 7,
          expirationDate: null,
          purchaseDate: "2022-03-15T00:00:00Z",
          cost: 3750.00,
          complianceStatus: "compliant",
          isActive: true,
          metadata: {
            department: "Mathematics",
            supportExpiry: "2024-03-15T23:59:59Z"
          }
        },
        {
          id: 4,
          softwareName: "AutoCAD Educational",
          vendor: "Autodesk",
          licenseType: "subscription",
          totalSeats: 30,
          usedSeats: 28,
          availableSeats: 2,
          expirationDate: "2024-02-28T23:59:59Z",
          purchaseDate: "2023-03-01T00:00:00Z",
          cost: 5400.00,
          complianceStatus: "expired",
          isActive: false,
          metadata: {
            department: "Engineering",
            renewalRequired: true
          }
        }
      ];
      
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      res.status(500).json({ message: "Failed to fetch software licenses" });
    }
  });

  app.get('/api/licenses/violations', isAuthenticated, async (req: any, res) => {
    try {
      const violations = [
        {
          id: 1,
          licenseId: 2,
          softwareName: "Adobe Creative Suite Educational",
          deviceId: "device-005",
          deviceName: "Design Lab PC 12",
          violationType: "seat_exceeded",
          severity: "high",
          description: "License seat count exceeded by 2 installations. Current usage: 52/50 seats.",
          detectedAt: "2024-01-14T14:30:00Z",
          status: "open",
          estimatedCost: 1200.00,
          user: { name: "Art Department", email: "art@school.edu" }
        },
        {
          id: 2,
          licenseId: 4,
          softwareName: "AutoCAD Educational",
          deviceId: "device-006",
          deviceName: "Engineering Lab Workstation 08",
          violationType: "expired_license",
          severity: "critical",
          description: "Software license expired on 2024-02-28. Continued usage violates licensing terms.",
          detectedAt: "2024-03-01T09:15:00Z",
          status: "open",
          estimatedCost: 5400.00,
          user: { name: "Engineering Department", email: "engineering@school.edu" }
        },
        {
          id: 3,
          licenseId: null,
          softwareName: "Unauthorized Software: Steam",
          deviceId: "device-002",
          deviceName: "Math Lab Laptop 05",
          violationType: "unauthorized_software",
          severity: "medium",
          description: "Unauthorized gaming software detected on educational device.",
          detectedAt: "2024-01-15T10:30:00Z",
          status: "acknowledged",
          estimatedCost: 0,
          user: { name: "Michael Chen", email: "m.chen@school.edu" }
        }
      ];
      
      res.json(violations);
    } catch (error) {
      console.error("Error fetching license violations:", error);
      res.status(500).json({ message: "Failed to fetch license violations" });
    }
  });

  app.get('/api/licenses/installations', isAuthenticated, async (req: any, res) => {
    try {
      const installations = [
        {
          id: 1,
          deviceId: "device-001",
          deviceName: "Sarah's iPad Pro",
          licenseId: 1,
          softwareName: "Microsoft Office 365",
          version: "16.0.17328.20068",
          installDate: "2024-01-10T08:00:00Z",
          lastUsed: "2024-01-15T14:30:00Z",
          usageMinutes: 2850,
          isLicensed: true,
          complianceStatus: "licensed",
          user: { name: "Sarah Johnson", email: "sarah.j@school.edu" }
        },
        {
          id: 2,
          deviceId: "device-005",
          deviceName: "Design Lab PC 12",
          licenseId: 2,
          softwareName: "Adobe Photoshop",
          version: "25.0.0",
          installDate: "2023-09-15T10:30:00Z",
          lastUsed: "2024-01-15T16:45:00Z",
          usageMinutes: 4200,
          isLicensed: false,
          complianceStatus: "over_limit",
          user: { name: "Art Department", email: "art@school.edu" }
        },
        {
          id: 3,
          deviceId: "device-006",
          deviceName: "Engineering Lab Workstation 08",
          licenseId: 4,
          softwareName: "AutoCAD",
          version: "2024.1",
          installDate: "2023-03-01T12:00:00Z",
          lastUsed: "2024-03-01T09:00:00Z",
          usageMinutes: 8900,
          isLicensed: false,
          complianceStatus: "expired",
          user: { name: "Engineering Department", email: "engineering@school.edu" }
        }
      ];
      
      res.json(installations);
    } catch (error) {
      console.error("Error fetching software installations:", error);
      res.status(500).json({ message: "Failed to fetch software installations" });
    }
  });

  app.get('/api/licenses/requests', isAuthenticated, async (req: any, res) => {
    try {
      const requests = [
        {
          id: 1,
          requestedBy: "user-004",
          requesterName: "Dr. Emily Watson",
          softwareName: "MATLAB Educational License",
          vendor: "MathWorks",
          justification: "Required for advanced statistical analysis in research projects and graduate coursework.",
          requestType: "new_license",
          estimatedCost: 2500.00,
          urgency: "high",
          status: "pending",
          requestedAt: "2024-01-12T10:30:00Z",
          department: "Mathematics & Statistics"
        },
        {
          id: 2,
          requestedBy: "user-005",
          requesterName: "Prof. James Rodriguez",
          softwareName: "Adobe Creative Suite Educational",
          vendor: "Adobe",
          justification: "Need additional seats for expanded digital media program enrollment.",
          requestType: "additional_seats",
          estimatedCost: 1200.00,
          urgency: "medium",
          status: "approved",
          approvedBy: "user-admin",
          approvalDate: "2024-01-14T15:45:00Z",
          requestedAt: "2024-01-10T14:20:00Z",
          department: "Art & Design"
        },
        {
          id: 3,
          requestedBy: "user-006",
          requesterName: "Dr. Sarah Kim",
          softwareName: "AutoCAD Educational Renewal",
          vendor: "Autodesk",
          justification: "Critical renewal required for engineering coursework continuity.",
          requestType: "renewal",
          estimatedCost: 5400.00,
          urgency: "critical",
          status: "approved",
          approvedBy: "user-admin",
          approvalDate: "2024-01-15T09:00:00Z",
          requestedAt: "2024-01-14T16:30:00Z",
          department: "Engineering"
        }
      ];
      
      res.json(requests);
    } catch (error) {
      console.error("Error fetching software requests:", error);
      res.status(500).json({ message: "Failed to fetch software requests" });
    }
  });

  app.post('/api/licenses/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = req.body;
      
      const newRequest = {
        id: Date.now(),
        requestedBy: userId,
        requesterName: req.user.claims.first_name + " " + req.user.claims.last_name,
        ...requestData,
        status: "pending",
        requestedAt: new Date().toISOString()
      };
      
      res.json(newRequest);
    } catch (error) {
      console.error("Error creating software request:", error);
      res.status(500).json({ message: "Failed to create software request" });
    }
  });

  app.post('/api/licenses/compliance/scan', isAuthenticated, async (req: any, res) => {
    try {
      // Simulate compliance scan results
      const scanResults = {
        scanId: Date.now(),
        initiatedBy: req.user.claims.sub,
        scanType: "full_compliance_audit",
        status: "completed",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 300000).toISOString(),
        results: {
          totalLicenses: 4,
          compliantLicenses: 2,
          violatingLicenses: 2,
          devicesScanned: 120,
          softwareDetected: 45,
          unlicensedSoftware: 3,
          expiredLicenses: 1,
          overAllocatedLicenses: 1,
          estimatedRisk: 12100.00
        },
        recommendations: [
          "Renew AutoCAD Educational license immediately",
          "Purchase 2 additional Adobe Creative Suite seats",
          "Remove unauthorized gaming software from educational devices",
          "Implement automated license usage monitoring"
        ]
      };
      
      res.json(scanResults);
    } catch (error) {
      console.error("Error running compliance scan:", error);
      res.status(500).json({ message: "Failed to run compliance scan" });
    }
  });

  app.post('/api/licenses/enforce', isAuthenticated, async (req: any, res) => {
    try {
      const { licenseId, action, deviceIds } = req.body;
      const userId = req.user.claims.sub;
      
      // Simulate license enforcement action
      const enforcementResult = {
        id: Date.now(),
        licenseId,
        action, // "block_usage", "uninstall_software", "disable_features", "send_notification"
        targetDevices: deviceIds,
        initiatedBy: userId,
        status: "success",
        executedAt: new Date().toISOString(),
        affectedDevices: deviceIds.length,
        result: `License enforcement action '${action}' executed successfully on ${deviceIds.length} devices`
      };
      
      console.log(`License enforcement: ${action} executed by ${userId} for license ${licenseId}`);
      
      res.json(enforcementResult);
    } catch (error) {
      console.error("Error enforcing license compliance:", error);
      res.status(500).json({ message: "Failed to enforce license compliance" });
    }
  });

  app.get('/api/licenses/usage/:licenseId', isAuthenticated, async (req: any, res) => {
    try {
      const { licenseId } = req.params;
      
      // Mock detailed usage data for the specific license
      const usageData = {
        licenseId: parseInt(licenseId),
        currentUsage: {
          activeUsers: 387,
          peakUsers: 425,
          averageDailyUsage: 342,
          utilizationRate: 77.4
        },
        usageTrends: [
          { date: "2024-01-08", users: 380, duration: 6.2 },
          { date: "2024-01-09", users: 395, duration: 6.8 },
          { date: "2024-01-10", users: 410, duration: 7.1 },
          { date: "2024-01-11", users: 425, duration: 7.5 },
          { date: "2024-01-12", users: 390, duration: 6.9 },
          { date: "2024-01-13", users: 385, duration: 6.5 },
          { date: "2024-01-14", users: 387, duration: 6.7 }
        ],
        topUsers: [
          { name: "Mathematics Department", usage: 45, avgSession: 3.2 },
          { name: "Science Department", usage: 38, avgSession: 2.8 },
          { name: "English Department", usage: 32, avgSession: 2.1 },
          { name: "Art Department", usage: 28, avgSession: 4.5 }
        ],
        features: [
          { name: "Word", usage: 85, users: 320 },
          { name: "PowerPoint", usage: 68, users: 265 },
          { name: "Excel", usage: 45, users: 175 },
          { name: "OneNote", usage: 72, users: 280 },
          { name: "Teams", usage: 92, users: 356 }
        ]
      };
      
      res.json(usageData);
    } catch (error) {
      console.error("Error fetching license usage data:", error);
      res.status(500).json({ message: "Failed to fetch license usage data" });
    }
  });

  // Media Delivery System API endpoints
  app.get('/api/media/content', isAuthenticated, async (req: any, res) => {
    try {
      const mediaContent = [
        {
          id: 1,
          contentName: "Introduction to Algebra - Chapter 1",
          contentType: "video",
          category: "educational",
          fileSize: 250.5,
          duration: 1800,
          format: "mp4",
          storageLocation: "educational/math/algebra-intro-ch1.mp4",
          thumbnailUrl: "thumbnails/algebra-ch1-thumb.jpg",
          description: "Comprehensive introduction to algebraic concepts and problem-solving techniques",
          tags: ["mathematics", "algebra", "grade-9", "fundamentals"],
          contentRating: "G",
          gradeLevel: "9-12",
          subject: "Mathematics",
          isActive: true,
          isRestricted: false,
          createdAt: "2024-01-01T10:00:00Z",
          syncStatus: "synced",
          downloadSize: 250.5,
          streamingQuality: ["720p", "1080p"],
          estimatedBandwidth: 5.2
        },
        {
          id: 2,
          contentName: "Chemistry Lab Safety Protocols",
          contentType: "document",
          category: "educational",
          fileSize: 15.2,
          duration: null,
          format: "pdf",
          storageLocation: "educational/science/chem-safety-protocols.pdf",
          thumbnailUrl: "thumbnails/chem-safety-thumb.jpg",
          description: "Essential safety procedures for chemistry laboratory work",
          tags: ["chemistry", "safety", "laboratory", "protocols"],
          contentRating: "G",
          gradeLevel: "9-12",
          subject: "Chemistry",
          isActive: true,
          isRestricted: false,
          createdAt: "2024-01-05T14:30:00Z",
          syncStatus: "synced",
          downloadSize: 15.2,
          accessCount: 156
        },
        {
          id: 3,
          contentName: "World History Interactive Timeline",
          contentType: "application",
          category: "educational",
          fileSize: 450.8,
          duration: null,
          format: "apk",
          storageLocation: "educational/history/world-history-timeline.apk",
          thumbnailUrl: "thumbnails/history-timeline-thumb.jpg",
          description: "Interactive application covering major world historical events",
          tags: ["history", "interactive", "timeline", "world-events"],
          contentRating: "PG",
          gradeLevel: "10-12",
          subject: "History",
          isActive: true,
          isRestricted: true,
          createdAt: "2024-01-10T09:15:00Z",
          syncStatus: "pending",
          downloadSize: 450.8,
          installCount: 28,
          requiredStorageSpace: 520.0
        },
        {
          id: 4,
          contentName: "Shakespeare's Complete Works",
          contentType: "ebook",
          category: "educational",
          fileSize: 89.4,
          duration: null,
          format: "epub",
          storageLocation: "educational/literature/shakespeare-complete-works.epub",
          thumbnailUrl: "thumbnails/shakespeare-thumb.jpg",
          description: "Complete collection of William Shakespeare's plays and sonnets",
          tags: ["literature", "shakespeare", "classic", "english"],
          contentRating: "PG-13",
          gradeLevel: "11-12",
          subject: "English Literature",
          isActive: true,
          isRestricted: false,
          createdAt: "2024-01-08T16:45:00Z",
          syncStatus: "synced",
          downloadSize: 89.4,
          readingProgress: 67,
          bookmarks: 12
        }
      ];
      
      res.json(mediaContent);
    } catch (error) {
      console.error("Error fetching media content:", error);
      res.status(500).json({ message: "Failed to fetch media content" });
    }
  });

  app.get('/api/media/delivery/:deviceId', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      
      const deliveryQueue = [
        {
          id: 1,
          contentId: 1,
          contentName: "Introduction to Algebra - Chapter 1",
          deviceId,
          deliveryMethod: "download",
          deliveryStatus: "completed",
          startTime: "2024-01-15T08:30:00Z",
          completionTime: "2024-01-15T08:45:00Z",
          bytesTransferred: 262.144,
          transferSpeed: 12.5,
          networkType: "wifi",
          qualitySettings: { resolution: "1080p", bitrate: "5000kbps" },
          progress: 100
        },
        {
          id: 2,
          contentId: 3,
          contentName: "World History Interactive Timeline",
          deviceId,
          deliveryMethod: "download",
          deliveryStatus: "in_progress",
          startTime: "2024-01-15T14:20:00Z",
          completionTime: null,
          bytesTransferred: 180.5,
          transferSpeed: 8.2,
          networkType: "wifi",
          qualitySettings: {},
          progress: 40,
          estimatedTimeRemaining: 420
        },
        {
          id: 3,
          contentId: 4,
          contentName: "Shakespeare's Complete Works",
          deviceId,
          deliveryMethod: "cache",
          deliveryStatus: "pending",
          startTime: null,
          completionTime: null,
          bytesTransferred: 0,
          transferSpeed: 0,
          networkType: "wifi",
          qualitySettings: {},
          progress: 0,
          priority: 3
        }
      ];
      
      res.json(deliveryQueue);
    } catch (error) {
      console.error("Error fetching delivery queue:", error);
      res.status(500).json({ message: "Failed to fetch content delivery queue" });
    }
  });

  app.post('/api/media/distribute', isAuthenticated, async (req: any, res) => {
    try {
      const { contentId, targetDevices, deliveryMethod, priority } = req.body;
      const userId = req.user.claims.sub;
      
      const distributionResult = {
        id: Date.now(),
        contentId,
        targetDevices,
        deliveryMethod,
        priority: priority || 5,
        initiatedBy: userId,
        status: "initiated",
        estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        distributionJobs: targetDevices.map((deviceId: string, index: number) => ({
          deviceId,
          status: "queued",
          estimatedStart: new Date(Date.now() + index * 60 * 1000).toISOString(),
          bandwidth: "10 Mbps"
        }))
      };
      
      console.log(`Content distribution initiated: Content ${contentId} to ${targetDevices.length} devices`);
      
      res.json(distributionResult);
    } catch (error) {
      console.error("Error initiating content distribution:", error);
      res.status(500).json({ message: "Failed to initiate content distribution" });
    }
  });

  app.get('/api/media/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const mediaAnalytics = {
        contentLibrary: {
          totalContent: 247,
          contentByType: {
            video: 89,
            document: 76,
            ebook: 45,
            application: 23,
            audio: 14
          },
          totalSize: 15840.5, // GB
          averageFileSize: 64.2 // MB
        },
        delivery: {
          dailyDeliveries: 342,
          successRate: 94.8,
          averageSpeed: 15.2, // Mbps
          totalBandwidthUsed: 2840.5, // GB this month
          peakDeliveryHours: [9, 10, 14, 15, 20]
        },
        usage: {
          activeUsers: 1247,
          topContent: [
            { name: "Introduction to Algebra - Chapter 1", views: 892, downloads: 456 },
            { name: "Chemistry Lab Safety Protocols", views: 724, downloads: 689 },
            { name: "Shakespeare's Complete Works", views: 567, downloads: 334 },
            { name: "World History Interactive Timeline", views: 445, downloads: 289 }
          ],
          deviceDistribution: {
            tablets: 45,
            laptops: 32,
            smartphones: 18,
            desktops: 5
          }
        },
        compliance: {
          policiesActive: 3,
          violationsToday: 2,
          contentBlocked: 15,
          quotaExceeded: 8
        },
        network: {
          totalBandwidthAvailable: 1000, // Mbps
          currentUsage: 342, // Mbps
          peakUsage: 856, // Mbps
          efficiency: 89.2 // percentage
        }
      };
      
      res.json(mediaAnalytics);
    } catch (error) {
      console.error("Error fetching media analytics:", error);
      res.status(500).json({ message: "Failed to fetch media analytics" });
    }
  });

  app.post('/api/media/distribute', isAuthenticated, async (req: any, res) => {
    try {
      const { contentId, targetDevices, deliveryMethod, priority } = req.body;
      const userId = req.user.claims.sub;
      
      const distributionResult = {
        id: Date.now(),
        contentId,
        targetDevices,
        deliveryMethod,
        priority: priority || 5,
        initiatedBy: userId,
        status: "initiated",
        estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        distributionJobs: targetDevices.map((deviceId: string, index: number) => ({
          deviceId,
          status: "queued",
          estimatedStart: new Date(Date.now() + index * 60 * 1000).toISOString(),
          bandwidth: "10 Mbps"
        }))
      };
      
      console.log(`Content distribution initiated: Content ${contentId} to ${targetDevices.length} devices`);
      
      res.json(distributionResult);
    } catch (error) {
      console.error("Error initiating content distribution:", error);
      res.status(500).json({ message: "Failed to initiate content distribution" });
    }
  });

  // xAPI and Learning Analytics endpoints
  app.post('/api/xapi/statements', async (req: any, res) => {
    try {
      const statement = req.body;
      const userId = req.user?.claims?.sub || 'anonymous';
      const tenantId = req.tenant?.id || 'default';
      
      // Generate unique statement ID if not provided
      const statementId = statement.id || crypto.randomUUID();
      
      // Store xAPI statement in learning record store
      const xapiRecord = {
        statementId,
        actor: statement.actor,
        verb: statement.verb,
        object: statement.object,
        result: statement.result || null,
        context: statement.context || null,
        timestamp: statement.timestamp || new Date().toISOString(),
        stored: new Date().toISOString(),
        authority: statement.authority || statement.actor,
        version: "1.0.3",
        attachments: statement.attachments || null,
        voided: false,
        tenantId
      };
      
      console.log(`xAPI Statement recorded: ${statement.verb.display['en-US']} - ${statement.object.definition.name['en-US']}`);
      
      // Update learning analytics aggregations
      await updateLearningAnalytics(statement, userId, tenantId);
      
      res.status(200).json({ 
        success: true, 
        statementId,
        stored: xapiRecord.stored
      });
    } catch (error) {
      console.error("Error storing xAPI statement:", error);
      res.status(500).json({ message: "Failed to store xAPI statement" });
    }
  });

  app.get('/api/xapi/statements', isAuthenticated, async (req: any, res) => {
    try {
      const { agent, verb, activity, since, until, limit = 100 } = req.query;
      const tenantId = req.tenant?.id || 'default';
      
      // Mock filtered xAPI statements based on query parameters
      const statements = [
        {
          id: "stmt_001",
          actor: {
            objectType: "Agent",
            name: "Emma Johnson",
            mbox: "mailto:emma.johnson@school.edu"
          },
          verb: {
            id: "http://adlnet.gov/expapi/verbs/completed",
            display: { "en-US": "completed" }
          },
          object: {
            objectType: "Activity",
            id: "https://school.edvirons.com/activities/lesson/math_001",
            definition: {
              name: { "en-US": "Introduction to Algebra" },
              type: "http://adlnet.gov/expapi/activities/lesson"
            }
          },
          result: {
            completion: true,
            duration: "PT45M30S",
            score: { scaled: 0.89, raw: 89, max: 100 }
          },
          timestamp: "2024-01-22T14:30:00Z",
          stored: "2024-01-22T14:30:01Z"
        },
        {
          id: "stmt_002", 
          actor: {
            objectType: "Agent",
            name: "Liam Smith",
            mbox: "mailto:liam.smith@school.edu"
          },
          verb: {
            id: "https://w3id.org/xapi/video/verbs/watched",
            display: { "en-US": "watched" }
          },
          object: {
            objectType: "Activity",
            id: "https://school.edvirons.com/activities/video/calculus_intro",
            definition: {
              name: { "en-US": "Calculus Introduction Video" },
              type: "https://w3id.org/xapi/video/activity-type/video"
            }
          },
          result: {
            completion: true,
            duration: "PT22M15S"
          },
          context: {
            extensions: {
              "https://w3id.org/xapi/video/extensions/time": 1335
            }
          },
          timestamp: "2024-01-22T15:45:00Z",
          stored: "2024-01-22T15:45:02Z"
        }
      ];
      
      console.log(`Retrieved ${statements.length} xAPI statements for tenant ${tenantId}`);
      
      res.json({
        statements,
        more: ""
      });
    } catch (error) {
      console.error("Error retrieving xAPI statements:", error);
      res.status(500).json({ message: "Failed to retrieve xAPI statements" });
    }
  });

  app.get('/api/learning-analytics/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { timeframe = '7d' } = req.query;
      
      const analytics = {
        overview: {
          totalLearningTime: 2847, // minutes
          activitiesCompleted: 23,
          averageScore: 87.3,
          streakDays: 5,
          competenciesAchieved: 8
        },
        recentActivity: [
          {
            date: "2024-01-22",
            activitiesCompleted: 4,
            learningTime: 185,
            averageScore: 89
          },
          {
            date: "2024-01-21", 
            activitiesCompleted: 3,
            learningTime: 142,
            averageScore: 91
          },
          {
            date: "2024-01-20",
            activitiesCompleted: 5,
            learningTime: 201,
            averageScore: 84
          }
        ],
        topActivities: [
          {
            activityId: "lesson_math_001",
            name: "Introduction to Algebra",
            type: "lesson",
            completions: 156,
            averageScore: 87.2,
            averageDuration: 2730 // seconds
          },
          {
            activityId: "video_calculus_intro",
            name: "Calculus Introduction",
            type: "video", 
            completions: 203,
            averageScore: 92.1,
            averageDuration: 1335
          }
        ],
        learningPaths: [
          {
            pathId: "path_mathematics",
            name: "Mathematics Mastery",
            progress: 67.5,
            completedActivities: 27,
            totalActivities: 40,
            estimatedCompletion: "2024-02-15"
          }
        ],
        competencyProgress: [
          {
            competencyId: "comp_algebra",
            name: "Algebraic Thinking",
            masteryLevel: 78.5,
            isAchieved: false,
            relatedActivities: 12
          },
          {
            competencyId: "comp_geometry",
            name: "Geometric Reasoning",
            masteryLevel: 92.3,
            isAchieved: true,
            relatedActivities: 8
          }
        ]
      };
      
      console.log(`Learning analytics retrieved for user ${userId} (${timeframe} timeframe)`);
      
      res.json(analytics);
    } catch (error) {
      console.error("Error retrieving learning analytics:", error);
      res.status(500).json({ message: "Failed to retrieve learning analytics" });
    }
  });

  app.get('/api/learning-analytics/competencies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const competencies = [
        {
          id: "comp_001",
          competencyId: "algebra_fundamentals",
          name: "Algebra Fundamentals",
          description: "Understanding basic algebraic concepts and operations",
          category: "Mathematics",
          level: "beginner",
          masteryThreshold: 80,
          currentMastery: 78.5,
          isAchieved: false,
          evidence: [
            {
              statementId: "stmt_algebra_001",
              activity: "Linear Equations Quiz",
              score: 85,
              timestamp: "2024-01-20T10:30:00Z"
            },
            {
              statementId: "stmt_algebra_002", 
              activity: "Polynomial Basics Test",
              score: 72,
              timestamp: "2024-01-21T14:15:00Z"
            }
          ],
          relatedActivities: [
            "lesson_linear_equations",
            "quiz_polynomial_basics",
            "assignment_algebra_practice"
          ]
        },
        {
          id: "comp_002",
          competencyId: "geometric_reasoning",
          name: "Geometric Reasoning",
          description: "Spatial reasoning and geometric problem solving",
          category: "Mathematics",
          level: "intermediate",
          masteryThreshold: 80,
          currentMastery: 92.3,
          isAchieved: true,
          achievedAt: "2024-01-18T16:45:00Z",
          evidence: [
            {
              statementId: "stmt_geometry_001",
              activity: "Triangle Properties Assessment",
              score: 94,
              timestamp: "2024-01-18T15:30:00Z"
            },
            {
              statementId: "stmt_geometry_002",
              activity: "Area and Perimeter Quiz", 
              score: 91,
              timestamp: "2024-01-19T11:20:00Z"
            }
          ],
          relatedActivities: [
            "lesson_triangle_properties",
            "interactive_area_calculator",
            "project_geometric_design"
          ]
        }
      ];
      
      console.log(`Retrieved ${competencies.length} competencies for user ${userId}`);
      
      res.json(competencies);
    } catch (error) {
      console.error("Error retrieving competencies:", error);
      res.status(500).json({ message: "Failed to retrieve competencies" });
    }
  });

  app.get('/api/learning-analytics/paths', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const learningPaths = [
        {
          id: "path_001",
          pathId: "mathematics_foundation",
          name: "Mathematics Foundation",
          description: "Core mathematical concepts for academic success",
          totalActivities: 25,
          completedActivities: 17,
          progress: 68.0,
          estimatedDuration: 1800, // minutes
          timeSpent: 1224, // minutes
          currentActivityIndex: 17,
          activities: [
            {
              activityId: "lesson_numbers",
              name: "Number Systems",
              type: "lesson",
              status: "completed",
              score: 89,
              completedAt: "2024-01-15T10:30:00Z"
            },
            {
              activityId: "quiz_arithmetic", 
              name: "Arithmetic Operations Quiz",
              type: "assessment",
              status: "completed",
              score: 92,
              completedAt: "2024-01-16T14:20:00Z"
            },
            {
              activityId: "lesson_algebra_intro",
              name: "Introduction to Algebra",
              type: "lesson", 
              status: "in_progress",
              score: null,
              startedAt: "2024-01-22T09:15:00Z"
            }
          ],
          nextRecommendation: {
            activityId: "lesson_algebra_intro",
            name: "Introduction to Algebra",
            estimatedDuration: 45
          }
        },
        {
          id: "path_002",
          pathId: "digital_literacy", 
          name: "Digital Literacy Essentials",
          description: "Essential digital skills for modern learning",
          totalActivities: 18,
          completedActivities: 5,
          progress: 27.8,
          estimatedDuration: 1200,
          timeSpent: 345,
          currentActivityIndex: 5,
          activities: [
            {
              activityId: "lesson_computer_basics",
              name: "Computer Fundamentals",
              type: "lesson",
              status: "completed", 
              score: 95,
              completedAt: "2024-01-18T11:30:00Z"
            },
            {
              activityId: "interactive_typing",
              name: "Typing Skills Practice",
              type: "interactive",
              status: "in_progress",
              score: null,
              startedAt: "2024-01-22T13:45:00Z"
            }
          ],
          nextRecommendation: {
            activityId: "interactive_typing",
            name: "Typing Skills Practice",
            estimatedDuration: 30
          }
        }
      ];
      
      console.log(`Retrieved ${learningPaths.length} learning paths for user ${userId}`);
      
      res.json(learningPaths);
    } catch (error) {
      console.error("Error retrieving learning paths:", error);
      res.status(500).json({ message: "Failed to retrieve learning paths" });
    }
  });

  // Helper function to update learning analytics
  async function updateLearningAnalytics(statement: any, userId: string, tenantId: string) {
    try {
      // Extract key information from xAPI statement
      const activityId = statement.object.id;
      const verb = statement.verb.id;
      const result = statement.result;
      
      // Update aggregated analytics based on statement type
      console.log(`Updating analytics for user ${userId}: ${verb} on ${activityId}`);
      
      // This would typically update database records for:
      // - Total interaction counts
      // - Learning time tracking  
      // - Score aggregations
      // - Completion tracking
      // - Competency progress
      
    } catch (error) {
      console.error("Error updating learning analytics:", error);
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}