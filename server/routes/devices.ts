import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerDeviceRoutes(app: Express) {
  app.get('/api/devices', isAuthenticated, async (req: any, res) => {
    try {
      const devices = [
        {
          id: "dev_001",
          name: "iPad Pro 12.9 #1",
          type: "tablet",
          model: "iPad Pro 12.9-inch (6th generation)",
          serialNumber: "F9FD8J3K2L",
          status: "active",
          assignedTo: "Emma Johnson",
          location: "Classroom A-201",
          lastSeen: "2024-01-22T10:30:00Z",
          batteryLevel: 85,
          osVersion: "iPadOS 17.2.1",
          complianceStatus: "compliant",
          restrictions: ["app_store_disabled", "camera_restricted"],
          installedApps: 23,
          storage: { used: 45.2, total: 128 }
        }
      ];
      
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.post('/api/devices/:deviceId/lock', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      const { reason } = req.body;
      
      console.log(`Device ${deviceId} locked. Reason: ${reason}`);
      
      res.json({ 
        success: true, 
        message: "Device locked successfully",
        deviceId,
        action: "lock",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error locking device:", error);
      res.status(500).json({ message: "Failed to lock device" });
    }
  });

  app.post('/api/devices/:deviceId/wipe', isAuthenticated, async (req: any, res) => {
    try {
      const { deviceId } = req.params;
      const { confirmation } = req.body;
      
      if (confirmation !== "CONFIRM_WIPE") {
        return res.status(400).json({ message: "Invalid confirmation" });
      }
      
      console.log(`Device ${deviceId} wipe initiated`);
      
      res.json({
        success: true,
        message: "Device wipe initiated",
        deviceId,
        action: "wipe",
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error wiping device:", error);
      res.status(500).json({ message: "Failed to wipe device" });
    }
  });

  app.get('/api/policies', isAuthenticated, async (req: any, res) => {
    try {
      const policies = [
        {
          id: "pol_001",
          name: "Student Device Policy",
          description: "Standard restrictions for student devices",
          type: "restriction",
          status: "active",
          appliedDevices: 142,
          restrictions: {
            appStore: false,
            camera: true,
            microphone: true,
            bluetooth: false,
            airDrop: false,
            screenTime: { enabled: true, maxHours: 6 }
          },
          allowedApps: ["Safari", "Books", "Calculator", "Notes"],
          blockedApps: ["Games", "Social Media", "Entertainment"]
        }
      ];
      
      res.json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch policies" });
    }
  });

  app.post('/api/policies', isAuthenticated, async (req: any, res) => {
    try {
      const newPolicy = {
        id: `pol_${Date.now()}`,
        ...req.body,
        status: "draft",
        appliedDevices: 0,
        createdAt: new Date().toISOString()
      };
      
      console.log(`New policy created: ${newPolicy.name}`);
      
      res.json(newPolicy);
    } catch (error) {
      console.error("Error creating policy:", error);
      res.status(500).json({ message: "Failed to create policy" });
    }
  });

  app.post('/api/compliance/scan', isAuthenticated, async (req: any, res) => {
    try {
      const scanResult = {
        id: Date.now(),
        initiatedAt: new Date().toISOString(),
        status: "running",
        devicesScanned: 0,
        totalDevices: 156,
        violations: [],
        estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000).toISOString()
      };
      
      console.log("Compliance scan initiated");
      
      res.json(scanResult);
    } catch (error) {
      console.error("Error running compliance scan:", error);
      res.status(500).json({ message: "Failed to run compliance scan" });
    }
  });
}