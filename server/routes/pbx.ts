// Legacy PBX routes - use modular routes from pbx/index.ts
export { registerPBXRoutes } from "./pbx/index";
  // User-specific extension data
  app.get('/api/pbx/user-extension/:extension', isAuthenticated, async (req: any, res) => {
    try {
      const { extension } = req.params;
      const userId = req.user?.id;

      // Verify user owns this extension or is IT staff
      const userExtension = `10${userId?.slice(-2) || '01'}`;
      const isITStaff = req.user?.role === 'school_it_staff' || req.user?.role === 'school_admin';
      
      if (extension !== userExtension && !isITStaff) {
        return res.status(403).json({ message: 'Access denied to this extension' });
      }

      // Mock extension data - in real implementation, this would come from Asterisk
      const extensionData = {
        extension: {
          id: extension,
          name: `${req.user?.firstName || 'User'} ${req.user?.lastName || 'Extension'}`,
          status: Math.random() > 0.3 ? 'available' : 'busy',
          currentCall: Math.random() > 0.8 ? {
            id: `call_${Date.now()}`,
            direction: Math.random() > 0.5 ? 'inbound' : 'outbound',
            number: Math.random() > 0.5 ? '1023' : '+15551234567',
            duration: `${Math.floor(Math.random() * 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
          } : null,
          forwardingEnabled: false,
          forwardingNumber: null
        }
      };

      res.json(extensionData);
    } catch (error) {
      console.error('Error fetching user extension:', error);
      res.status(500).json({ message: 'Failed to fetch extension data' });
    }
  });

  // User-specific call logs
  app.get('/api/pbx/user-call-logs/:extension', isAuthenticated, async (req: any, res) => {
    try {
      const { extension } = req.params;
      const userId = req.user?.id;

      // Verify user owns this extension or is IT staff
      const userExtension = `10${userId?.slice(-2) || '01'}`;
      const isITStaff = req.user?.role === 'school_it_staff' || req.user?.role === 'school_admin';
      
      if (extension !== userExtension && !isITStaff) {
        return res.status(403).json({ message: 'Access denied to call logs' });
      }

      // Mock call logs specific to user's extension
      const callLogs = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        callId: `call_user_${extension}_${i + 1}`,
        fromNumber: Math.random() > 0.5 ? extension : `102${Math.floor(Math.random() * 10)}`,
        toNumber: Math.random() > 0.5 ? extension : `102${Math.floor(Math.random() * 10)}`,
        direction: Math.random() > 0.6 ? 'inbound' : Math.random() > 0.3 ? 'outbound' : 'missed',
        status: Math.random() > 0.2 ? 'completed' : 'missed',
        startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(Date.now() - Math.random() * 23 * 60 * 60 * 1000).toISOString(),
        duration: `${Math.floor(Math.random() * 15)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
      })).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

      res.json({ callLogs });
    } catch (error) {
      console.error('Error fetching user call logs:', error);
      res.status(500).json({ message: 'Failed to fetch call logs' });
    }
  });

  // Call forwarding control
  app.post('/api/pbx/call-forward', isAuthenticated, async (req: any, res) => {
    try {
      const { extension, forwardTo, enabled } = req.body;
      const userId = req.user?.id;

      // Verify user owns this extension or is IT staff
      const userExtension = `10${userId?.slice(-2) || '01'}`;
      const isITStaff = req.user?.role === 'school_it_staff' || req.user?.role === 'school_admin';
      
      if (extension !== userExtension && !isITStaff) {
        return res.status(403).json({ message: 'Access denied to modify call forwarding' });
      }

      // In real implementation, this would configure Asterisk call forwarding
      console.log(`Call forwarding ${enabled ? 'enabled' : 'disabled'} for extension ${extension}${enabled ? ` to ${forwardTo}` : ''}`);

      res.json({
        success: true,
        message: `Call forwarding ${enabled ? 'enabled' : 'disabled'} for extension ${extension}`,
        extension,
        forwardingEnabled: enabled,
        forwardingNumber: enabled ? forwardTo : null
      });
    } catch (error) {
      console.error('Error configuring call forwarding:', error);
      res.status(500).json({ message: 'Failed to configure call forwarding' });
    }
  });
  // Get PBX dashboard overview
  app.get('/api/pbx/dashboard', 
    isAuthenticated, 
    async (req, res) => {
      try {
        const pbxData = {
          system: {
            status: "online",
            totalExtensions: 45,
            activeExtensions: 32,
            activeCalls: 3,
            serverLoad: 15,
            uptime: "7 days, 14 hours"
          },
          extensions: [
            { extension: "1001", user: "John Smith", department: "Administration", status: "online", location: "Office A-102" },
            { extension: "1002", user: "Maria Garcia", department: "Teaching", status: "busy", location: "Classroom B-201" },
            { extension: "1003", user: "David Chen", department: "IT Support", status: "online", location: "IT Room" },
            { extension: "1004", user: "Sarah Johnson", department: "Security", status: "offline", location: "Security Office" },
            { extension: "1005", user: "Mike Brown", department: "Maintenance", status: "dnd", location: "Maintenance Shop" }
          ],
          activeCalls: [
            { 
              id: "call_001", 
              from: "1001", 
              to: "1003", 
              fromUser: "John Smith", 
              toUser: "David Chen", 
              startTime: new Date(Date.now() - 180000), 
              type: "internal" 
            },
            { 
              id: "call_002", 
              from: "1002", 
              to: "external", 
              fromUser: "Maria Garcia", 
              toUser: "Parent Conference", 
              startTime: new Date(Date.now() - 420000), 
              type: "external" 
            }
          ],
          recentBroadcasts: [
            {
              id: 1,
              title: "Emergency Drill Announcement",
              timestamp: new Date(Date.now() - 3600000),
              initiator: "Security Office",
              status: "completed"
            },
            {
              id: 2,
              title: "End of Day Announcement",
              timestamp: new Date(Date.now() - 7200000),
              initiator: "Administration",
              status: "completed"
            }
          ],
          conferenceRooms: [
            { roomNumber: "5001", name: "Staff Meeting", participants: 4, maxParticipants: 10, status: "active" },
            { roomNumber: "5002", name: "Parent Conference", participants: 0, maxParticipants: 6, status: "inactive" }
          ]
        };

        res.json(pbxData);
      } catch (error) {
        console.error("Error fetching PBX dashboard:", error);
        res.status(500).json({ message: "Failed to fetch PBX dashboard" });
      }
    }
  );

  // Get all extensions
  app.get('/api/pbx/extensions', 
    isAuthenticated, 
    async (req, res) => {
      try {
        const extensions = [
          // Emergency Extensions
          { id: 1, extension: '911', name: 'Emergency Services', department: 'Emergency', status: 'available', location: 'External', type: 'emergency', priority: 'high', description: 'Local emergency services' },
          { id: 2, extension: '999', name: 'Campus Security Emergency', department: 'Security', status: 'available', location: 'Security Office', type: 'emergency', priority: 'high', description: 'Campus emergency hotline' },
          { id: 3, extension: '105', name: 'Nurse Station Emergency', department: 'Health', status: 'available', location: 'Health Center', type: 'emergency', priority: 'high', description: 'Medical emergency line' },
          
          // Department Extensions
          { id: 4, extension: '100', name: 'Reception', department: 'Front Office', status: 'available', location: 'Main Building', type: 'department', priority: 'high', description: 'Main reception desk' },
          { id: 5, extension: '101', name: 'Principal Office', department: 'Administration', status: 'busy', location: 'Admin Block', type: 'department', priority: 'high', description: 'Principal\'s office' },
          { id: 6, extension: '102', name: 'Vice Principal', department: 'Administration', status: 'available', location: 'Admin Block', type: 'department', priority: 'high', description: 'Vice Principal\'s office' },
          { id: 7, extension: '103', name: 'IT Support', department: 'Technology', status: 'available', location: 'IT Lab', type: 'department', priority: 'medium', description: 'Technical support helpdesk' },
          { id: 8, extension: '104', name: 'Library', department: 'Academic', status: 'available', location: 'Library Building', type: 'department', priority: 'medium', description: 'Library information desk' },
          { id: 9, extension: '106', name: 'Security Office', department: 'Safety', status: 'available', location: 'Security Office', type: 'department', priority: 'high', description: 'Campus security office' },
          { id: 10, extension: '107', name: 'Maintenance', department: 'Facilities', status: 'dnd', location: 'Maintenance Shop', type: 'department', priority: 'medium', description: 'Facilities maintenance' },
          { id: 11, extension: '110', name: 'Admissions Office', department: 'Enrollment', status: 'available', location: 'Admin Block', type: 'department', priority: 'medium', description: 'Student admissions' },
          { id: 12, extension: '111', name: 'Finance Office', department: 'Finance', status: 'available', location: 'Admin Block', type: 'department', priority: 'medium', description: 'Financial services' },
          
          // Key Personnel
          { id: 13, extension: '201', name: 'Dr. Sarah Johnson', department: 'Administration', status: 'available', location: 'Principal Office', type: 'user', priority: 'high', description: 'School Principal' },
          { id: 14, extension: '202', name: 'Mr. Michael Chen', department: 'Administration', status: 'busy', location: 'Vice Principal Office', type: 'user', priority: 'high', description: 'Vice Principal' },
          { id: 15, extension: '203', name: 'Ms. Emily Davis', department: 'Technology', status: 'available', location: 'IT Department', type: 'user', priority: 'high', description: 'IT Director' },
          { id: 16, extension: '204', name: 'Dr. Robert Wilson', department: 'Academic', status: 'available', location: 'Faculty Office', type: 'user', priority: 'high', description: 'Academic Dean' },
          { id: 17, extension: '205', name: 'Ms. Lisa Thompson', department: 'Health', status: 'offline', location: 'Health Center', type: 'user', priority: 'high', description: 'School Nurse' },
          
          // External Numbers
          { id: 18, extension: '301', name: 'District Office', department: 'Administration', status: 'available', location: 'External', type: 'external', priority: 'medium', description: 'School district headquarters' },
          { id: 19, extension: '302', name: 'Transportation', department: 'Transport', status: 'available', location: 'External', type: 'external', priority: 'medium', description: 'Bus transportation services' },
          { id: 20, extension: '303', name: 'Food Services', department: 'Cafeteria', status: 'available', location: 'External', type: 'external', priority: 'low', description: 'Catering services' },
          
          // Conference and Meeting Rooms
          { id: 21, extension: '108', name: 'Conference Room A', department: 'Meeting', status: 'available', location: 'Admin Block', type: 'department', priority: 'low', description: 'Main conference room' },
          { id: 22, extension: '109', name: 'Teacher Lounge', department: 'Faculty', status: 'available', location: 'Faculty Building', type: 'department', priority: 'low', description: 'Faculty meeting space' },
          { id: 23, extension: '112', name: 'Board Room', department: 'Administration', status: 'dnd', location: 'Admin Block', type: 'department', priority: 'medium', description: 'School board meeting room' }
        ];

        res.json({ extensions });
      } catch (error) {
        console.error("Error fetching extensions:", error);
        res.status(500).json({ message: "Failed to fetch extensions" });
      }
    }
  );

  // Create new extension
  app.post('/api/pbx/extensions', 
    isAuthenticated, 
    requirePermission('MANAGE_PBX'),
    async (req, res) => {
      try {
        const { userId, displayName, department, location, deviceType } = req.body;
        
        // Generate next available extension number
        const nextExtension = (1000 + Math.floor(Math.random() * 8999)).toString();
        
        const newExtension = {
          id: Date.now(),
          extension: nextExtension,
          userId,
          displayName,
          department,
          location,
          deviceType: deviceType || "softphone",
          status: "offline",
          isActive: true,
          permissions: { recording: false, international: false },
          createdAt: new Date()
        };

        // In a real implementation, this would create the extension in Asterisk
        console.log(`Creating Asterisk extension ${nextExtension} for user ${userId}`);

        res.json({ success: true, extension: newExtension });
      } catch (error) {
        console.error("Error creating extension:", error);
        res.status(500).json({ message: "Failed to create extension" });
      }
    }
  );

  // Update extension
  app.put('/api/pbx/extensions/:extensionId', 
    isAuthenticated, 
    requirePermission('MANAGE_PBX'),
    async (req, res) => {
      try {
        const { extensionId } = req.params;
        const updateData = req.body;

        // In a real implementation, this would update the Asterisk configuration
        console.log(`Updating extension ${extensionId}:`, updateData);

        res.json({ success: true, message: "Extension updated successfully" });
      } catch (error) {
        console.error("Error updating extension:", error);
        res.status(500).json({ message: "Failed to update extension" });
      }
    }
  );

  // Emergency broadcast endpoint
  app.post('/api/pbx/emergency-broadcast', 
    isAuthenticated, 
    requirePermission('EMERGENCY_BROADCAST'),
    async (req, res) => {
      try {
        const { title, message, priority, targetExtensions, targetDepartments } = req.body;
        
        const broadcast = {
          id: Date.now(),
          title,
          message,
          priority: priority || "high",
          broadcastType: "emergency",
          targetExtensions: targetExtensions || [],
          targetDepartments: targetDepartments || [],
          initiatedBy: req.user?.id,
          status: "active",
          startTime: new Date(),
          tenantId: "demo_school"
        };

        // In a real implementation, this would trigger Asterisk to broadcast
        console.log(`EMERGENCY BROADCAST: ${title} - ${message}`);
        console.log(`Targeting extensions: ${targetExtensions?.join(', ') || 'ALL'}`);
        console.log(`Targeting departments: ${targetDepartments?.join(', ') || 'ALL'}`);

        res.json({ 
          success: true, 
          message: "Emergency broadcast initiated",
          broadcastId: broadcast.id,
          broadcast
        });
      } catch (error) {
        console.error("Error initiating emergency broadcast:", error);
        res.status(500).json({ message: "Failed to initiate emergency broadcast" });
      }
    }
  );

  // Page specific extensions or departments
  app.post('/api/pbx/page', 
    isAuthenticated, 
    requirePermission('PAGE_DEVICES'),
    async (req, res) => {
      try {
        const { targetExtensions, targetDepartments, message } = req.body;
        
        const pageRequest = {
          id: Date.now(),
          message: message || "Please report to the main office",
          targetExtensions: targetExtensions || [],
          targetDepartments: targetDepartments || [],
          initiatedBy: req.user?.id,
          timestamp: new Date()
        };

        // In a real implementation, this would use Asterisk's paging functionality
        console.log(`PAGE REQUEST: ${message}`);
        console.log(`Paging extensions: ${targetExtensions?.join(', ') || 'NONE'}`);
        console.log(`Paging departments: ${targetDepartments?.join(', ') || 'NONE'}`);

        res.json({ 
          success: true, 
          message: "Page request sent",
          pageId: pageRequest.id
        });
      } catch (error) {
        console.error("Error sending page:", error);
        res.status(500).json({ message: "Failed to send page" });
      }
    }
  );

  // Get call logs
  app.get('/api/pbx/call-logs', 
    isAuthenticated, 
    async (req, res) => {
      try {
        const { limit = 50, offset = 0 } = req.query;
        
        const callLogs = [
          {
            id: 1,
            callId: "call_001",
            fromExtension: "1001",
            toExtension: "1003",
            fromUser: "John Smith",
            toUser: "David Chen",
            callType: "internal",
            startTime: new Date(Date.now() - 180000),
            endTime: new Date(Date.now() - 60000),
            duration: 120,
            status: "answered"
          },
          {
            id: 2,
            callId: "call_002",
            fromExtension: "1002",
            toNumber: "+1234567890",
            fromUser: "Maria Garcia",
            callType: "external",
            startTime: new Date(Date.now() - 420000),
            endTime: new Date(Date.now() - 300000),
            duration: 120,
            status: "answered"
          },
          {
            id: 3,
            callId: "call_003",
            fromExtension: "1004",
            toExtension: "1001",
            fromUser: "Sarah Johnson",
            toUser: "John Smith",
            callType: "internal",
            startTime: new Date(Date.now() - 600000),
            endTime: null,
            duration: 0,
            status: "missed"
          }
        ];

        res.json({ 
          callLogs: callLogs.slice(Number(offset), Number(offset) + Number(limit)),
          total: callLogs.length
        });
      } catch (error) {
        console.error("Error fetching call logs:", error);
        res.status(500).json({ message: "Failed to fetch call logs" });
      }
    }
  );

  // Initiate call between extensions
  app.post('/api/pbx/initiate-call', 
    isAuthenticated, 
    async (req, res) => {
      try {
        const { fromExtension, toExtension } = req.body;
        
        const call = {
          id: `call_${Date.now()}`,
          fromExtension,
          toExtension,
          startTime: new Date(),
          status: "ringing"
        };

        // In a real implementation, this would use Asterisk Manager Interface (AMI)
        console.log(`Initiating call from ${fromExtension} to ${toExtension}`);

        res.json({ 
          success: true, 
          message: "Call initiated",
          callId: call.id
        });
      } catch (error) {
        console.error("Error initiating call:", error);
        res.status(500).json({ message: "Failed to initiate call" });
      }
    }
  );

  // Conference room management
  app.get('/api/pbx/conference-rooms', 
    isAuthenticated, 
    async (req, res) => {
      try {
        const conferenceRooms = [
          {
            id: 1,
            roomNumber: "5001",
            name: "Staff Meeting",
            description: "Weekly staff meetings and important announcements",
            maxParticipants: 10,
            currentParticipants: 4,
            requirePin: true,
            isRecorded: false,
            status: "active",
            createdBy: "admin"
          },
          {
            id: 2,
            roomNumber: "5002",
            name: "Parent Conference",
            description: "Parent-teacher conferences and consultations",
            maxParticipants: 6,
            currentParticipants: 0,
            requirePin: false,
            isRecorded: true,
            status: "inactive",
            createdBy: "admin"
          }
        ];

        res.json({ conferenceRooms });
      } catch (error) {
        console.error("Error fetching conference rooms:", error);
        res.status(500).json({ message: "Failed to fetch conference rooms" });
      }
    }
  );

  // Create conference room
  app.post('/api/pbx/conference-rooms', 
    isAuthenticated, 
    requirePermission('MANAGE_PBX'),
    async (req, res) => {
      try {
        const { name, description, maxParticipants, requirePin, pin, isRecorded } = req.body;
        
        const roomNumber = (5000 + Math.floor(Math.random() * 999)).toString();
        
        const conferenceRoom = {
          id: Date.now(),
          roomNumber,
          name,
          description,
          maxParticipants: maxParticipants || 10,
          requirePin: requirePin || false,
          pin: requirePin ? (pin || Math.floor(1000 + Math.random() * 9000).toString()) : null,
          isRecorded: isRecorded || false,
          status: "inactive",
          createdBy: req.user?.id,
          tenantId: "demo_school",
          createdAt: new Date()
        };

        // In a real implementation, this would create the conference room in Asterisk
        console.log(`Creating conference room ${roomNumber}: ${name}`);

        res.json({ success: true, conferenceRoom });
      } catch (error) {
        console.error("Error creating conference room:", error);
        res.status(500).json({ message: "Failed to create conference room" });
      }
    }
  );

  // PBX system status
  app.get('/api/pbx/system-status', 
    isAuthenticated, 
    async (req, res) => {
      try {
        const systemStatus = {
          asteriskVersion: "18.15.0",
          status: "running",
          uptime: "7 days, 14 hours, 32 minutes",
          totalChannels: 64,
          activeChannels: 3,
          registeredEndpoints: 45,
          sipTrunkStatus: "connected",
          serverLoad: {
            cpu: 15,
            memory: 32,
            diskSpace: 78
          },
          networkStatus: {
            lanInterface: "up",
            internetConnection: "connected",
            latency: "12ms"
          },
          emergencyServices: {
            e911Service: "active",
            emergencyRouting: "configured",
            testStatus: "passed"
          }
        };

        res.json(systemStatus);
      } catch (error) {
        console.error("Error fetching system status:", error);
        res.status(500).json({ message: "Failed to fetch system status" });
      }
    }
  );
}