import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { requireRole } from "../roleMiddleware";

export function registerSecurityRoutes(app: Express) {
  // Security metrics endpoint - only accessible by security staff and school admins
  app.get('/api/security/metrics', 
    isAuthenticated, 
    requireRole(['school_security', 'school_admin']), 
    async (req, res) => {
      try {
        // Simulate real-time security data collection
        const currentTime = new Date();
        const timeOffset = Math.floor(Math.random() * 360); // Random time variations

        const securityMetrics = {
          accessControl: {
            totalAccessPoints: 45,
            securePoints: Math.floor(Math.random() * 2) === 0 ? 43 : 45, // Occasionally show issues
            alertsActive: Math.floor(Math.random() * 3), // 0-2 active alerts
            lastIncident: `${Math.floor(Math.random() * 12) + 1} hours ago`
          },
          surveillance: {
            cameras: {
              total: 32,
              online: 30 + Math.floor(Math.random() * 3), // 30-32 online
              offline: Math.floor(Math.random() * 3), // 0-2 offline
              alerts: Math.floor(Math.random() * 2) // 0-1 alerts
            },
            coverage: 92 + Math.floor(Math.random() * 6), // 92-97% coverage
            recordingStatus: Math.random() > 0.1 ? "active" : "maintenance"
          },
          incidents: {
            today: Math.floor(Math.random() * 5), // 0-4 incidents today
            thisWeek: 15 + Math.floor(Math.random() * 10), // 15-24 this week
            resolved: 15 + Math.floor(Math.random() * 8), // Most resolved
            pending: Math.floor(Math.random() * 4) // 0-3 pending
          },
          personnel: {
            onDuty: 6 + Math.floor(Math.random() * 4), // 6-9 on duty
            totalStaff: 12,
            locations: ["Main Building", "Library", "Sports Complex", "Parking", "Perimeter"],
            lastRollCall: `${Math.floor(Math.random() * 4) + 1} hours ago`
          },
          systemHealth: {
            firewallStatus: Math.random() > 0.05 ? "secure" : "updating",
            intrusion: {
              attempts: 20 + Math.floor(Math.random() * 15), // 20-34 attempts
              blocked: function() { 
                const attempts = this.attempts;
                return attempts - Math.floor(Math.random() * 2); // Most blocked
              }(),
              success: Math.floor(Math.random() * 2) // 0-1 successful
            },
            compliance: 94 + Math.floor(Math.random() * 5) // 94-98% compliance
          },
          recentEvents: [
            {
              id: 1,
              type: "patrol_completed",
              message: "Perimeter check completed - North gate",
              timestamp: new Date(currentTime.getTime() - (15 * 60 * 1000)), // 15 min ago
              severity: "info"
            },
            {
              id: 2,
              type: "access_denied",
              message: "Unauthorized access attempt - Side entrance",
              timestamp: new Date(currentTime.getTime() - (32 * 60 * 1000)), // 32 min ago
              severity: "warning"
            },
            {
              id: 3,
              type: "patrol_completed",
              message: "Security patrol completed - Building A",
              timestamp: new Date(currentTime.getTime() - (60 * 60 * 1000)), // 1 hour ago
              severity: "info"
            },
            {
              id: 4,
              type: "maintenance",
              message: "Camera maintenance completed - Parking lot",
              timestamp: new Date(currentTime.getTime() - (120 * 60 * 1000)), // 2 hours ago
              severity: "info"
            }
          ],
          accessLogs: [
            {
              id: 1,
              user: "John Smith (Staff)",
              location: "Main Entrance",
              status: "authorized",
              timestamp: new Date(currentTime.getTime() - (5 * 60 * 1000))
            },
            {
              id: 2,
              user: "Unknown Card",
              location: "Emergency Exit A",
              status: "denied",
              timestamp: new Date(currentTime.getTime() - (12 * 60 * 1000))
            },
            {
              id: 3,
              user: "Maria Garcia (Teacher)",
              location: "Staff Entrance",
              status: "authorized",
              timestamp: new Date(currentTime.getTime() - (18 * 60 * 1000))
            }
          ],
          activeIncidents: [
            {
              id: 1,
              title: "Unauthorized Access Attempt",
              description: "Emergency Exit A - Card swipe denied",
              priority: "high",
              timestamp: new Date(currentTime.getTime() - (32 * 60 * 1000)),
              status: "active"
            },
            {
              id: 2,
              title: "Camera Malfunction",
              description: "Parking lot camera offline",
              priority: "medium",
              timestamp: new Date(currentTime.getTime() - (60 * 60 * 1000)),
              status: "investigating"
            }
          ].filter(() => Math.random() > 0.3), // Sometimes no active incidents
          cameraGrid: Array.from({ length: 16 }, (_, i) => ({
            id: i + 1,
            name: `Cam ${i + 1}`,
            status: i === 5 || i === 12 ? "offline" : (i === 8 ? "alert" : "online"),
            location: `Zone ${Math.floor(i / 4) + 1}`
          }))
        };

        // Fix the intrusion data structure
        securityMetrics.systemHealth.intrusion.blocked = 
          securityMetrics.systemHealth.intrusion.attempts - 
          Math.floor(Math.random() * 2);

        res.json(securityMetrics);
      } catch (error) {
        console.error("Error fetching security metrics:", error);
        res.status(500).json({ message: "Failed to fetch security metrics" });
      }
    }
  );

  // Security alerts endpoint
  app.get('/api/security/alerts', 
    isAuthenticated, 
    requireRole(['school_security', 'school_admin']), 
    async (req, res) => {
      try {
        const alerts = [
          {
            id: 1,
            type: "access_violation",
            title: "Unauthorized Access Attempt",
            message: "Multiple failed card swipes at Emergency Exit A",
            severity: "high",
            timestamp: new Date(),
            acknowledged: false
          },
          {
            id: 2,
            type: "equipment_failure",
            title: "Camera Offline",
            message: "Parking lot surveillance camera not responding",
            severity: "medium",
            timestamp: new Date(Date.now() - 60 * 60 * 1000),
            acknowledged: false
          }
        ].filter(() => Math.random() > 0.5); // Sometimes no alerts

        res.json({ alerts });
      } catch (error) {
        console.error("Error fetching security alerts:", error);
        res.status(500).json({ message: "Failed to fetch security alerts" });
      }
    }
  );

  // Incident management endpoints
  app.post('/api/security/incidents', 
    isAuthenticated, 
    requireRole(['school_security', 'school_admin']), 
    async (req, res) => {
      try {
        const { title, description, priority, location } = req.body;
        
        const newIncident = {
          id: Date.now(),
          title,
          description,
          priority,
          location,
          status: "active",
          reportedBy: req.user?.id,
          timestamp: new Date(),
          updates: []
        };

        // In a real implementation, this would save to database
        res.json({ success: true, incident: newIncident });
      } catch (error) {
        console.error("Error creating incident:", error);
        res.status(500).json({ message: "Failed to create incident" });
      }
    }
  );

  // Emergency alert endpoint
  app.post('/api/security/emergency-alert', 
    isAuthenticated, 
    requireRole(['school_security', 'school_admin']), 
    async (req, res) => {
      try {
        const { type, message, severity } = req.body;
        
        // In a real implementation, this would trigger emergency protocols
        console.log(`EMERGENCY ALERT: ${type} - ${message} (${severity})`);
        
        res.json({ 
          success: true, 
          message: "Emergency alert broadcasted",
          alertId: Date.now()
        });
      } catch (error) {
        console.error("Error sending emergency alert:", error);
        res.status(500).json({ message: "Failed to send emergency alert" });
      }
    }
  );

  // Access control status endpoint
  app.get('/api/security/access-control', 
    isAuthenticated, 
    requireRole(['school_security', 'school_admin']), 
    async (req, res) => {
      try {
        const accessPoints = [
          { name: "Main Entrance", status: "secure", lastActivity: "5 min ago" },
          { name: "Staff Entrance", status: "secure", lastActivity: "12 min ago" },
          { name: "Emergency Exit A", status: "alert", lastActivity: "32 min ago" },
          { name: "Parking Gate", status: "secure", lastActivity: "45 min ago" },
          { name: "Service Entrance", status: "maintenance", lastActivity: "2 hours ago" }
        ];

        res.json({ accessPoints });
      } catch (error) {
        console.error("Error fetching access control status:", error);
        res.status(500).json({ message: "Failed to fetch access control status" });
      }
    }
  );
}