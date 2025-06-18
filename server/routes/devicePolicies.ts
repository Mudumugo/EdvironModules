import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerDevicePolicyRoutes(app: Express) {
  // Get all device policies
  app.get('/api/device-policies', 
    isAuthenticated, 
    async (req: Request, res: Response) => {
      try {
        // Mock data for development - replace with actual database queries
        const policies = [
          {
            id: 1,
            name: "Student Device Restrictions",
            description: "Basic restrictions for student devices during school hours",
            targetType: "device_type",
            targetIds: ["tablet", "laptop"],
            policyType: "app_restriction",
            rules: {
              blockedApps: ["social_media", "games", "entertainment"],
              allowedApps: ["educational", "productivity"],
              timeRestrictions: {
                schoolHours: { start: "08:00", end: "15:30" },
                weekdays: true,
                weekends: false
              }
            },
            isActive: true,
            priority: 5,
            effectiveFrom: "2024-01-01T00:00:00Z",
            effectiveTo: "2024-12-31T23:59:59Z",
            createdBy: "admin",
            createdAt: "2024-01-01T10:00:00Z",
            updatedAt: "2024-01-15T14:30:00Z"
          },
          {
            id: 2,
            name: "Content Filter Policy",
            description: "Web content filtering for all devices",
            targetType: "all",
            targetIds: [],
            policyType: "content_filter",
            rules: {
              blockedCategories: ["adult", "violence", "illegal"],
              allowedDomains: ["*.edu", "khan academy.org", "wikipedia.org"],
              blockedDomains: ["facebook.com", "instagram.com", "tiktok.com"],
              safeSearch: true
            },
            isActive: true,
            priority: 8,
            effectiveFrom: "2024-01-01T00:00:00Z",
            effectiveTo: null,
            createdBy: "admin",
            createdAt: "2024-01-01T10:00:00Z",
            updatedAt: "2024-02-01T09:15:00Z"
          },
          {
            id: 3,
            name: "Screen Time Limits",
            description: "Daily screen time limits for elementary students",
            targetType: "group",
            targetIds: ["elementary_students"],
            policyType: "screen_time",
            rules: {
              dailyLimit: 4, // hours
              breaks: {
                frequency: 30, // minutes
                duration: 5 // minutes
              },
              bedtime: {
                start: "20:00",
                end: "07:00"
              }
            },
            isActive: true,
            priority: 6,
            effectiveFrom: "2024-01-01T00:00:00Z",
            effectiveTo: null,
            createdBy: "admin",
            createdAt: "2024-01-10T11:20:00Z",
            updatedAt: "2024-01-10T11:20:00Z"
          },
          {
            id: 4,
            name: "Location Services Policy",
            description: "Control location access for privacy protection",
            targetType: "all",
            targetIds: [],
            policyType: "location",
            rules: {
              locationTracking: false,
              geoFencing: {
                enabled: true,
                allowedAreas: ["school_campus", "library", "home"]
              },
              emergencyOverride: true
            },
            isActive: false,
            priority: 3,
            effectiveFrom: "2024-01-01T00:00:00Z",
            effectiveTo: null,
            createdBy: "admin",
            createdAt: "2024-01-05T16:45:00Z",
            updatedAt: "2024-01-20T10:30:00Z"
          }
        ];

        res.json(policies);
      } catch (error) {
        console.error('Error fetching device policies:', error);
        res.status(500).json({ error: 'Failed to fetch device policies' });
      }
    }
  );

  // Create new device policy
  app.post('/api/device-policies',
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const { name, description, targetType, targetIds, policyType, rules, priority, effectiveFrom, effectiveTo } = req.body;
        
        // Validate required fields
        if (!name || !policyType || !targetType) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Mock creation - replace with actual database insertion
        const newPolicy = {
          id: Math.floor(Math.random() * 1000) + 100,
          name,
          description: description || '',
          targetType,
          targetIds: targetIds || [],
          policyType,
          rules: rules || {},
          isActive: true,
          priority: priority || 1,
          effectiveFrom: effectiveFrom ? new Date(effectiveFrom).toISOString() : null,
          effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : null,
          createdBy: (req as any).user?.id || 'unknown',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        res.status(201).json(newPolicy);
      } catch (error) {
        console.error('Error creating device policy:', error);
        res.status(500).json({ error: 'Failed to create device policy' });
      }
    }
  );

  // Update device policy
  app.put('/api/device-policies/:id',
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const policyId = parseInt(req.params.id);
        const updateData = req.body;

        // Mock update - replace with actual database update
        const updatedPolicy = {
          ...updateData,
          id: policyId,
          updatedAt: new Date().toISOString()
        };

        res.json(updatedPolicy);
      } catch (error) {
        console.error('Error updating device policy:', error);
        res.status(500).json({ error: 'Failed to update device policy' });
      }
    }
  );

  // Toggle policy active status
  app.put('/api/device-policies/:id/toggle',
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const policyId = parseInt(req.params.id);
        const { isActive } = req.body;

        // Mock toggle - replace with actual database update
        const updatedPolicy = {
          id: policyId,
          isActive,
          updatedAt: new Date().toISOString()
        };

        res.json(updatedPolicy);
      } catch (error) {
        console.error('Error toggling policy status:', error);
        res.status(500).json({ error: 'Failed to toggle policy status' });
      }
    }
  );

  // Delete device policy
  app.delete('/api/device-policies/:id',
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const policyId = parseInt(req.params.id);

        // Mock deletion - replace with actual database deletion
        res.json({ success: true, message: 'Policy deleted successfully' });
      } catch (error) {
        console.error('Error deleting device policy:', error);
        res.status(500).json({ error: 'Failed to delete device policy' });
      }
    }
  );

  // Get compliance violations
  app.get('/api/compliance-violations',
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        // Mock violations data
        const violations = [
          {
            id: 1,
            deviceId: "dev_001",
            policyId: 1,
            violationType: "unauthorized_app",
            severity: "medium",
            description: "Student attempted to install blocked social media app",
            detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            resolvedAt: null,
            status: "open",
            resolvedBy: null,
            actionTaken: null,
            metadata: {
              app: "Instagram",
              user: "student_001",
              attempt_count: 3
            },
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            deviceId: "dev_002",
            policyId: 3,
            violationType: "usage_exceeded",
            severity: "low",
            description: "Screen time limit exceeded by 30 minutes",
            detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            resolvedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
            status: "resolved",
            resolvedBy: "teacher_001",
            actionTaken: "Device locked until next day",
            metadata: {
              dailyLimit: 4,
              actualUsage: 4.5,
              user: "student_002"
            },
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            deviceId: "dev_003",
            policyId: 2,
            violationType: "location_violation",
            severity: "high",
            description: "Device detected outside authorized area",
            detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            resolvedAt: null,
            status: "investigating",
            resolvedBy: null,
            actionTaken: "Security team notified",
            metadata: {
              location: "Unknown Area",
              authorized_areas: ["school_campus", "home"],
              user: "student_003"
            },
            createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ];

        res.json(violations);
      } catch (error) {
        console.error('Error fetching compliance violations:', error);
        res.status(500).json({ error: 'Failed to fetch compliance violations' });
      }
    }
  );

  // Resolve compliance violation
  app.put('/api/compliance-violations/:id/resolve',
    isAuthenticated,
    async (req: Request, res: Response) => {
      try {
        const violationId = parseInt(req.params.id);
        const { actionTaken } = req.body;

        // Mock resolution
        const resolvedViolation = {
          id: violationId,
          status: "resolved",
          resolvedAt: new Date().toISOString(),
          resolvedBy: (req as any).user?.id,
          actionTaken
        };

        res.json(resolvedViolation);
      } catch (error) {
        console.error('Error resolving violation:', error);
        res.status(500).json({ error: 'Failed to resolve violation' });
      }
    }
  );
}