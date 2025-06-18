import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { requireRole } from "../roleMiddleware";

export function registerITRoutes(app: Express) {
  // IT Metrics endpoint - accessible by IT staff and school admins
  app.get('/api/it/metrics', 
    isAuthenticated, 
    requireRole(['school_it_staff', 'school_admin']), 
    async (req, res) => {
      try {
        // In a real implementation, this would fetch actual system metrics
        // from monitoring tools, server APIs, network devices, etc.
        const metrics = {
          serverStatus: {
            total: 15,
            online: 13,
            offline: 1,
            maintenance: 1
          },
          networkStatus: {
            bandwidth: Math.floor(Math.random() * (95 - 75) + 75), // 75-95%
            latency: Math.floor(Math.random() * (20 - 8) + 8), // 8-20ms
            uptime: 99.7,
            connectedDevices: Math.floor(Math.random() * (300 - 200) + 200) // 200-300 devices
          },
          storage: {
            total: 10240, // 10TB
            used: Math.floor(Math.random() * (8000 - 6000) + 6000), // 6-8TB used
            available: 0, // Will be calculated
            backupStatus: "completed"
          },
          security: {
            threats: Math.floor(Math.random() * 5), // 0-4 threats
            updates: Math.floor(Math.random() * 10), // 0-9 updates
            vulnerabilities: Math.floor(Math.random() * 3), // 0-2 vulnerabilities
            lastScan: "2 hours ago"
          },
          performance: {
            cpuUsage: Math.floor(Math.random() * (80 - 50) + 50), // 50-80%
            memoryUsage: Math.floor(Math.random() * (85 - 60) + 60), // 60-85%
            diskUsage: Math.floor(Math.random() * (75 - 50) + 50), // 50-75%
            networkLoad: Math.floor(Math.random() * (60 - 30) + 30) // 30-60%
          },
          timestamp: new Date().toISOString()
        };

        // Calculate available storage
        metrics.storage.available = metrics.storage.total - metrics.storage.used;

        res.json(metrics);
      } catch (error: any) {
        console.error("Error fetching IT metrics:", error);
        res.status(500).json({ message: "Failed to fetch IT metrics" });
      }
    }
  );

  // System health check endpoint
  app.get('/api/it/health', 
    isAuthenticated, 
    requireRole(['school_it_staff', 'school_admin']), 
    async (req, res) => {
      try {
        const healthStatus = {
          database: "healthy",
          fileStorage: "healthy",
          emailService: "healthy",
          backupService: "healthy",
          webServer: "healthy",
          loadBalancer: "healthy",
          timestamp: new Date().toISOString(),
          overallStatus: "healthy"
        };

        res.json(healthStatus);
      } catch (error: any) {
        console.error("Error checking system health:", error);
        res.status(500).json({ message: "Failed to check system health" });
      }
    }
  );

  // Network devices status endpoint
  app.get('/api/it/network-devices', 
    isAuthenticated, 
    requireRole(['school_it_staff', 'school_admin']), 
    async (req, res) => {
      try {
        const devices = [
          { id: 1, name: "Main Router", type: "router", status: "online", ip: "192.168.1.1" },
          { id: 2, name: "Core Switch 1", type: "switch", status: "online", ip: "192.168.1.10" },
          { id: 3, name: "Core Switch 2", type: "switch", status: "online", ip: "192.168.1.11" },
          { id: 4, name: "WiFi AP - Building A", type: "access_point", status: "online", ip: "192.168.1.20" },
          { id: 5, name: "WiFi AP - Building B", type: "access_point", status: "online", ip: "192.168.1.21" },
          { id: 6, name: "WiFi AP - Library", type: "access_point", status: "online", ip: "192.168.1.22" },
          { id: 7, name: "Firewall", type: "firewall", status: "online", ip: "192.168.1.2" },
          { id: 8, name: "Backup Router", type: "router", status: "standby", ip: "192.168.1.3" }
        ];

        res.json(devices);
      } catch (error: any) {
        console.error("Error fetching network devices:", error);
        res.status(500).json({ message: "Failed to fetch network devices" });
      }
    }
  );

  // Server status endpoint
  app.get('/api/it/servers', 
    isAuthenticated, 
    requireRole(['school_it_staff', 'school_admin']), 
    async (req, res) => {
      try {
        const servers = [
          { id: 1, name: "Web Server 1", type: "web", status: "online", cpu: 45, memory: 68, uptime: "15 days" },
          { id: 2, name: "Web Server 2", type: "web", status: "online", cpu: 52, memory: 73, uptime: "15 days" },
          { id: 3, name: "Database Primary", type: "database", status: "online", cpu: 38, memory: 82, uptime: "45 days" },
          { id: 4, name: "Database Replica", type: "database", status: "online", cpu: 25, memory: 65, uptime: "45 days" },
          { id: 5, name: "App Server 1", type: "application", status: "online", cpu: 61, memory: 75, uptime: "12 days" },
          { id: 6, name: "App Server 2", type: "application", status: "online", cpu: 58, memory: 71, uptime: "12 days" },
          { id: 7, name: "File Server", type: "file", status: "online", cpu: 22, memory: 45, uptime: "67 days" },
          { id: 8, name: "Backup Server", type: "backup", status: "maintenance", cpu: 0, memory: 15, uptime: "0 days" }
        ];

        res.json(servers);
      } catch (error: any) {
        console.error("Error fetching server status:", error);
        res.status(500).json({ message: "Failed to fetch server status" });
      }
    }
  );

  // Security events endpoint
  app.get('/api/it/security-events', 
    isAuthenticated, 
    requireRole(['school_it_staff', 'school_admin']), 
    async (req, res) => {
      try {
        const events = [
          {
            id: 1,
            type: "blocked_attempt",
            severity: "medium",
            message: "Suspicious login attempt blocked",
            source: "192.168.1.150",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
          },
          {
            id: 2,
            type: "scan_complete",
            severity: "info",
            message: "Security scan completed successfully",
            source: "security_scanner",
            timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
          },
          {
            id: 3,
            type: "firewall_update",
            severity: "info",
            message: "Firewall rules updated successfully",
            source: "admin_system",
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
          }
        ];

        res.json(events);
      } catch (error: any) {
        console.error("Error fetching security events:", error);
        res.status(500).json({ message: "Failed to fetch security events" });
      }
    }
  );
}