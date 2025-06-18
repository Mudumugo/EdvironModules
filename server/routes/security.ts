import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
import { storage } from "../storage";

export function registerSecurityRoutes(app: Express) {
  // Get security zones
  app.get("/api/security/zones", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const zones = await storage.getSecurityZones();
      res.json(zones);
    } catch (error) {
      console.error("Error fetching security zones:", error);
      res.status(500).json({ message: "Failed to fetch security zones" });
    }
  });

  // Create security zone
  app.post("/api/security/zones", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const zone = await storage.createSecurityZone(req.body);
      res.json(zone);
    } catch (error) {
      console.error("Error creating security zone:", error);
      res.status(500).json({ message: "Failed to create security zone" });
    }
  });

  // Get cameras for a zone
  app.get("/api/security/zones/:zoneId/cameras", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const cameras = await storage.getSecurityCamerasByZone(req.params.zoneId);
      res.json(cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  // Get all cameras
  app.get("/api/security/cameras", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const cameras = await storage.getSecurityCameras();
      res.json(cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  // Create security camera
  app.post("/api/security/cameras", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const camera = await storage.createSecurityCamera(req.body);
      res.json(camera);
    } catch (error) {
      console.error("Error creating camera:", error);
      res.status(500).json({ message: "Failed to create camera" });
    }
  });

  // Get security events
  app.get("/api/security/events", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const { status, severity, zoneId, limit = 50 } = req.query;
      const events = await storage.getSecurityEvents({
        status: status as string,
        severity: severity as string, 
        zoneId: zoneId as string,
        limit: parseInt(limit as string),
      });
      res.json(events);
    } catch (error) {
      console.error("Error fetching security events:", error);
      res.status(500).json({ message: "Failed to fetch security events" });
    }
  });

  // Create security event
  app.post("/api/security/events", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const event = await storage.createSecurityEvent(req.body);
      res.json(event);
    } catch (error) {
      console.error("Error creating security event:", error);
      res.status(500).json({ message: "Failed to create security event" });
    }
  });

  // Update security event status
  app.patch("/api/security/events/:eventId", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const event = await storage.updateSecurityEvent(req.params.eventId, req.body);
      res.json(event);
    } catch (error) {
      console.error("Error updating security event:", error);
      res.status(500).json({ message: "Failed to update security event" });
    }
  });

  // Get visitor registrations
  app.get("/api/security/visitors", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const { status, date } = req.query;
      const visitors = await storage.getVisitorRegistrations({
        status: status as string,
        date: date as string,
      });
      res.json(visitors);
    } catch (error) {
      console.error("Error fetching visitor registrations:", error);
      res.status(500).json({ message: "Failed to fetch visitor registrations" });
    }
  });

  // Register visitor
  app.post("/api/security/visitors", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const registration = await storage.createVisitorRegistration(req.body);
      res.json(registration);
    } catch (error) {
      console.error("Error registering visitor:", error);
      res.status(500).json({ message: "Failed to register visitor" });
    }
  });

  // Check out visitor
  app.patch("/api/security/visitors/:visitorId/checkout", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const registration = await storage.checkoutVisitor(req.params.visitorId);
      res.json(registration);
    } catch (error) {
      console.error("Error checking out visitor:", error);
      res.status(500).json({ message: "Failed to check out visitor" });
    }
  });

  // Get security calls
  app.get("/api/security/calls", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const { status, priority } = req.query;
      const calls = await storage.getSecurityCalls({
        status: status as string,
        priority: priority as string,
      });
      res.json(calls);
    } catch (error) {
      console.error("Error fetching security calls:", error);
      res.status(500).json({ message: "Failed to fetch security calls" });
    }
  });

  // Initiate security call
  app.post("/api/security/calls", isAuthenticated, requirePermission("SECURITY_MANAGE"), async (req, res) => {
    try {
      const call = await storage.createSecurityCall(req.body);
      res.json(call);
    } catch (error) {
      console.error("Error initiating security call:", error);
      res.status(500).json({ message: "Failed to initiate security call" });
    }
  });

  // Get security metrics/dashboard data
  app.get("/api/security/metrics", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const metrics = await storage.getSecurityMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching security metrics:", error);
      res.status(500).json({ message: "Failed to fetch security metrics" });
    }
  });

  // Get active threats
  app.get("/api/security/threats", isAuthenticated, requirePermission("SECURITY_VIEW"), async (req, res) => {
    try {
      const threats = await storage.getActiveThreats();
      res.json(threats);
    } catch (error) {
      console.error("Error fetching active threats:", error);
      res.status(500).json({ message: "Failed to fetch active threats" });
    }
  });

          // Extract IP and location info
          const ip = log.ipAddress || '127.0.0.1';
          const location = ip.startsWith('192.168') ? 'Internal Network' : 
                          ip.startsWith('10.') ? 'Campus Network' : 'External';

          return {
            id: log.id.toString(),
            type,
            severity,
            user: log.userId || 'system',
            ip,
            location,
            timestamp: log.timestamp.toISOString(),
            description: description || 'System activity',
            status
          };
        });

        res.json(securityEvents);
      } catch (error) {
        console.error('Error fetching security events:', error);
        res.status(500).json({ error: 'Failed to fetch security events' });
      }
    }
  );

  // Get security metrics
  app.get('/api/security/metrics', 
    isAuthenticated, 
    requirePermission('MANAGE_SECURITY'),
    async (req: any, res) => {
      try {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

        // Get failed login attempts (last week vs previous week)
        const failedLoginsThisWeek = await db
          .select({ count: count() })
          .from(activityLogs)
          .where(and(
            sql`${activityLogs.action} LIKE '%failed%' OR ${activityLogs.action} LIKE '%unauthorized%'`,
            gte(activityLogs.timestamp, weekAgo)
          ));

        const failedLoginsLastWeek = await db
          .select({ count: count() })
          .from(activityLogs)
          .where(and(
            sql`${activityLogs.action} LIKE '%failed%' OR ${activityLogs.action} LIKE '%unauthorized%'`,
            gte(activityLogs.timestamp, twoWeeksAgo),
            sql`${activityLogs.timestamp} < ${weekAgo}`
          ));

        // Get active threats (critical events)
        const activeThreats = await db
          .select({ count: count() })
          .from(activityLogs)
          .where(and(
            sql`${activityLogs.action} LIKE '%suspicious%' OR ${activityLogs.action} LIKE '%blocked%'`,
            gte(activityLogs.timestamp, weekAgo)
          ));

        // Calculate metrics
        const thisWeekFailed = failedLoginsThisWeek[0]?.count || 0;
        const lastWeekFailed = failedLoginsLastWeek[0]?.count || 1; // Avoid division by zero
        const failedLoginChange = Math.round(((thisWeekFailed - lastWeekFailed) / lastWeekFailed) * 100);

        const activeThreatsCount = activeThreats[0]?.count || 0;

        // Calculate security score based on various factors
        let securityScore = 100;
        securityScore -= Math.min(thisWeekFailed * 2, 30); // Reduce score for failed logins
        securityScore -= Math.min(activeThreatsCount * 10, 40); // Reduce score for active threats
        securityScore = Math.max(securityScore, 0);

        const metrics = [
          {
            name: 'Failed Login Attempts',
            value: thisWeekFailed,
            change: failedLoginChange,
            status: failedLoginChange <= 0 ? 'good' : failedLoginChange < 50 ? 'warning' : 'critical'
          },
          {
            name: 'Active Threats',
            value: activeThreatsCount,
            change: 0, // Could calculate if we had historical data
            status: activeThreatsCount === 0 ? 'good' : activeThreatsCount < 5 ? 'warning' : 'critical'
          },
          {
            name: 'System Vulnerabilities',
            value: 0, // This would come from vulnerability scanning
            change: 0,
            status: 'good'
          },
          {
            name: 'Security Score',
            value: securityScore,
            change: 5, // Placeholder - would calculate from historical data
            status: securityScore >= 80 ? 'good' : securityScore >= 60 ? 'warning' : 'critical'
          }
        ];

        res.json(metrics);
      } catch (error) {
        console.error('Error fetching security metrics:', error);
        res.status(500).json({ error: 'Failed to fetch security metrics' });
      }
    }
  );

  // Get threat intelligence
  app.get('/api/security/threats', 
    isAuthenticated, 
    requirePermission('MANAGE_SECURITY'),
    async (req: any, res) => {
      try {
        const now = new Date();
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Get blocked IPs from activity logs
        const blockedIPs = await db
          .select({
            ip: activityLogs.ipAddress,
            attempts: count()
          })
          .from(activityLogs)
          .where(and(
            sql`${activityLogs.action} LIKE '%blocked%' OR ${activityLogs.action} LIKE '%failed%'`,
            gte(activityLogs.timestamp, dayAgo),
            sql`${activityLogs.ipAddress} IS NOT NULL`
          ))
          .groupBy(activityLogs.ipAddress)
          .orderBy(desc(count()))
          .limit(10);

        // Get threat types from recent activity
        const threatActivity = await db
          .select({
            action: activityLogs.action,
            count: count()
          })
          .from(activityLogs)
          .where(and(
            sql`${activityLogs.action} LIKE '%attack%' OR ${activityLogs.action} LIKE '%suspicious%' OR ${activityLogs.action} LIKE '%scan%'`,
            gte(activityLogs.timestamp, dayAgo)
          ))
          .groupBy(activityLogs.action);

        const threatIntel = {
          blockedIPs: blockedIPs.map(ip => ({
            ip: ip.ip,
            attempts: ip.attempts
          })),
          activeThreats: threatActivity.map(threat => ({
            type: threat.action,
            count: threat.count,
            severity: threat.action.includes('attack') ? 'high' : 
                     threat.action.includes('suspicious') ? 'medium' : 'low'
          })),
          summary: {
            totalBlockedIPs: blockedIPs.length,
            totalThreats: threatActivity.reduce((sum, t) => sum + t.count, 0),
            lastUpdated: now.toISOString()
          }
        };

        res.json(threatIntel);
      } catch (error) {
        console.error('Error fetching threat intelligence:', error);
        res.status(500).json({ error: 'Failed to fetch threat intelligence' });
      }
    }
  );

  // Log security event
  app.post('/api/security/events', 
    isAuthenticated, 
    requirePermission('MANAGE_SECURITY'),
    async (req: any, res) => {
      try {
        const { type, severity, description, ipAddress } = req.body;
        const userId = req.user?.id;

        // Create activity log entry for the security event
        await db.insert(activityLogs).values({
          action: `security_event_${type}`,
          userId: userId || 'system',
          ipAddress: ipAddress || req.ip,
          userAgent: req.get('User-Agent'),
          details: JSON.stringify({ 
            type, 
            severity, 
            description,
            reportedBy: userId 
          }),
          timestamp: new Date()
        });

        res.json({ success: true, message: 'Security event logged successfully' });
      } catch (error) {
        console.error('Error logging security event:', error);
        res.status(500).json({ error: 'Failed to log security event' });
      }
    }
  );

  // Get compliance status
  app.get('/api/security/compliance', 
    isAuthenticated, 
    requirePermission('MANAGE_SECURITY'),
    async (req: any, res) => {
      try {
        // In a real implementation, this would check actual compliance metrics
        const compliance = {
          standards: {
            ferpa: { status: 'compliant', lastAudit: '2024-01-01', nextAudit: '2024-07-01' },
            coppa: { status: 'compliant', lastAudit: '2024-01-15', nextAudit: '2024-07-15' },
            iso27001: { status: 'in_progress', lastAudit: '2023-12-01', nextAudit: '2024-06-01' },
            soc2: { status: 'certified', lastAudit: '2024-01-01', nextAudit: '2024-12-01' }
          },
          policies: {
            passwordPolicy: { status: 'enforced', lastReview: '2024-01-01', nextReview: '2024-04-01' },
            dataRetention: { status: 'active', lastReview: '2024-01-15', nextReview: '2024-04-15' },
            accessControl: { status: 'implemented', lastReview: '2024-01-01', nextReview: '2024-04-01' },
            incidentResponse: { status: 'review_due', lastReview: '2023-10-01', nextReview: '2024-01-01' }
          },
          score: 85,
          lastAssessment: new Date().toISOString()
        };

        res.json(compliance);
      } catch (error) {
        console.error('Error fetching compliance status:', error);
        res.status(500).json({ error: 'Failed to fetch compliance status' });
      }
    }
  );
}