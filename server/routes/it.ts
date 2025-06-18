import type { Express, Request, Response, NextFunction } from "express";
import { isAuthenticated } from "../replitAuth";
import { requireRole } from "../roleMiddleware";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    claims?: any;
  };
  session?: any;
}

export function registerITRoutes(app: Express) {
  // Device management routes
  app.get('/api/it/devices', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      // Mock device data - in real implementation, this would come from MDM/device management system
      const devices = Array.from({ length: 24 }, (_, i) => ({
        id: `device_${i + 1}`,
        name: `${['Lab-PC', 'Student-Laptop', 'Teacher-Tablet', 'Office-Desktop'][Math.floor(Math.random() * 4)]}-${String(i + 1).padStart(3, '0')}`,
        type: ['desktop', 'laptop', 'tablet', 'mobile'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.2 ? 'online' : Math.random() > 0.5 ? 'offline' : 'maintenance',
        location: ['Computer Lab A', 'Computer Lab B', 'Library', 'Classroom 101', 'Classroom 102', 'Staff Office', 'Principal Office'][Math.floor(Math.random() * 7)],
        zone: ['academic_zone', 'administrative_zone', 'library_zone', 'lab_zone'][Math.floor(Math.random() * 4)],
        user: `user_${i + 1}@school.edu`,
        ip: `192.168.1.${i + 10}`,
        os: ['Windows 11', 'macOS Ventura', 'Ubuntu 22.04', 'Chrome OS'][Math.floor(Math.random() * 4)],
        lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        policies: ['basic_security', 'web_filtering', Math.random() > 0.5 ? 'exam_mode' : 'standard_mode'].slice(0, Math.floor(Math.random() * 3) + 1),
        isLocked: Math.random() > 0.85
      }));

      res.json({ devices });
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ message: 'Failed to fetch devices' });
    }
  });

  app.get('/api/it/device-groups', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const groups = [
        {
          id: 'group_1',
          name: 'Computer Lab A',
          description: 'Main computer laboratory for programming classes',
          devices: ['device_1', 'device_2', 'device_3', 'device_4', 'device_5'],
          zone: 'lab_zone',
          policies: ['basic_security', 'development_tools', 'web_filtering'],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: 'group_2',
          name: 'Administrative Workstations',
          description: 'Office computers for administrative staff',
          devices: ['device_6', 'device_7', 'device_8'],
          zone: 'administrative_zone',
          policies: ['basic_security', 'office_suite', 'strict_access'],
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: 'group_3',
          name: 'Student Tablets',
          description: 'Tablets for classroom activities and reading',
          devices: ['device_9', 'device_10', 'device_11', 'device_12'],
          zone: 'academic_zone',
          policies: ['basic_security', 'educational_apps', 'parental_controls'],
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      ];

      res.json({ groups });
    } catch (error) {
      console.error('Error fetching device groups:', error);
      res.status(500).json({ message: 'Failed to fetch device groups' });
    }
  });

  app.get('/api/it/zones', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const zones = [
        {
          id: 'academic_zone',
          name: 'Academic Zone',
          description: 'Classrooms and teaching areas',
          deviceCount: 45,
          restrictions: ['Social Media Blocked', 'Gaming Restricted', 'Educational Content Only']
        },
        {
          id: 'administrative_zone',
          name: 'Administrative Zone',
          description: 'Office and administrative areas',
          deviceCount: 12,
          restrictions: ['Full Internet Access', 'VPN Required', 'Advanced Security']
        },
        {
          id: 'library_zone',
          name: 'Library Zone',
          description: 'Library and research areas',
          deviceCount: 20,
          restrictions: ['Research Access', 'Quiet Mode', 'Extended Hours']
        },
        {
          id: 'lab_zone',
          name: 'Computer Labs',
          description: 'Technical and programming laboratories',
          deviceCount: 30,
          restrictions: ['Development Tools', 'Code Repositories', 'Technical Resources']
        }
      ];

      res.json({ zones });
    } catch (error) {
      console.error('Error fetching zones:', error);
      res.status(500).json({ message: 'Failed to fetch zones' });
    }
  });

  app.get('/api/it/policies', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const policies = [
        {
          id: 'basic_security',
          name: 'Basic Security Policy',
          description: 'Standard security settings for all devices',
          rules: ['Firewall enabled', 'Antivirus active', 'Auto-updates enabled']
        },
        {
          id: 'web_filtering',
          name: 'Web Content Filtering',
          description: 'Blocks inappropriate content for students',
          rules: ['Social media blocked', 'Gaming sites blocked', 'Educational sites allowed']
        },
        {
          id: 'exam_mode',
          name: 'Examination Mode',
          description: 'Lockdown policy for examinations',
          rules: ['Browser locked', 'Apps disabled', 'Network restricted']
        },
        {
          id: 'development_tools',
          name: 'Development Environment',
          description: 'Access to programming tools and repositories',
          rules: ['IDEs allowed', 'Git access', 'Package managers enabled']
        }
      ];

      res.json({ policies });
    } catch (error) {
      console.error('Error fetching policies:', error);
      res.status(500).json({ message: 'Failed to fetch policies' });
    }
  });

  app.post('/api/it/device-groups', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, description, devices, zone } = req.body;

      // Validate input
      if (!name || !devices || devices.length === 0) {
        return res.status(400).json({ message: 'Name and devices are required' });
      }

      const newGroup = {
        id: `group_${Date.now()}`,
        name,
        description: description || '',
        devices,
        zone: zone || 'academic_zone',
        policies: ['basic_security'],
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // In real implementation, save to database
      console.log('Creating device group:', newGroup);

      res.json({
        success: true,
        message: 'Device group created successfully',
        group: newGroup
      });
    } catch (error) {
      console.error('Error creating device group:', error);
      res.status(500).json({ message: 'Failed to create device group' });
    }
  });

  app.post('/api/it/devices/bulk-action', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { action, deviceIds, groupIds } = req.body;

      if (!action || (!deviceIds?.length && !groupIds?.length)) {
        return res.status(400).json({ message: 'Action and target devices/groups are required' });
      }

      // In real implementation, this would interact with MDM systems
      const actionResults = {
        'apply-policy': 'Policies applied successfully',
        'restart': 'Restart command sent to devices',
        'shutdown': 'Shutdown command sent to devices',
        'update-software': 'Software update initiated',
        'clear-cache': 'Cache cleared on devices',
        'enable-monitoring': 'Monitoring enabled',
        'disable-monitoring': 'Monitoring disabled'
      };

      const result = actionResults[action as keyof typeof actionResults] || 'Action completed';

      console.log(`Bulk action ${action} applied to:`, { deviceIds, groupIds });

      res.json({
        success: true,
        message: result,
        action,
        targets: { deviceIds, groupIds },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error executing bulk action:', error);
      res.status(500).json({ message: 'Failed to execute bulk action' });
    }
  });

  app.post('/api/it/devices/exam-lock', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { deviceIds, groupIds, lockDuration = 180 } = req.body;

      if (!deviceIds?.length && !groupIds?.length) {
        return res.status(400).json({ message: 'Device IDs or Group IDs are required' });
      }

      // In real implementation, this would activate exam mode via MDM
      console.log(`Exam lock activated for ${lockDuration} minutes:`, { deviceIds, groupIds });

      res.json({
        success: true,
        message: `Exam mode activated for ${lockDuration} minutes`,
        lockDuration,
        targets: { deviceIds, groupIds },
        unlockTime: new Date(Date.now() + lockDuration * 60 * 1000).toISOString()
      });
    } catch (error) {
      console.error('Error activating exam lock:', error);
      res.status(500).json({ message: 'Failed to activate exam lock' });
    }
  });
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