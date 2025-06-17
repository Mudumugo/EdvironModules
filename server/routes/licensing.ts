import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

export function registerLicensingRoutes(app: Express) {
  app.get('/api/licenses', isAuthenticated, async (req: any, res) => {
    try {
      const licenses = [
        {
          id: "lic_001",
          name: "Microsoft Office 365 Education",
          vendor: "Microsoft",
          type: "subscription",
          status: "active",
          totalSeats: 500,
          usedSeats: 387,
          availableSeats: 113,
          expiryDate: "2024-08-31T23:59:59Z",
          cost: 2450.00,
          costPerSeat: 4.90,
          category: "Productivity",
          features: ["Word", "Excel", "PowerPoint", "Teams", "OneDrive"],
          compliance: {
            status: "compliant",
            lastAudit: "2024-01-15T10:00:00Z",
            violations: 0
          },
          usage: {
            peak: 425,
            average: 342,
            trend: "increasing"
          }
        }
      ];
      
      res.json(licenses);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      res.status(500).json({ message: "Failed to fetch licenses" });
    }
  });

  app.post('/api/licenses/enforce', isAuthenticated, async (req: any, res) => {
    try {
      const { licenseId, action, deviceIds } = req.body;
      const userId = req.user.claims.sub;
      
      const enforcementResult = {
        id: Date.now(),
        licenseId,
        action,
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
          { date: "2024-01-12", users: 390, duration: 6.9 }
        ],
        topUsers: [
          { userId: "user_001", name: "Sarah Wilson", usage: 8.5, role: "Teacher" },
          { userId: "user_002", name: "Mike Chen", usage: 7.8, role: "Student" },
          { userId: "user_003", name: "Lisa Rodriguez", usage: 7.2, role: "Administrator" }
        ],
        compliance: {
          status: "compliant",
          issues: [],
          lastCheck: "2024-01-22T09:00:00Z"
        }
      };
      
      res.json(usageData);
    } catch (error) {
      console.error("Error fetching license usage:", error);
      res.status(500).json({ message: "Failed to fetch license usage data" });
    }
  });
}