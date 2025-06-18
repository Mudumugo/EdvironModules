import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";

export function registerPBXRoutes(app: Express) {
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
          { id: 1, extension: "1001", userId: "john_smith", displayName: "John Smith", department: "Administration", location: "Office A-102", status: "online", deviceType: "desk_phone", lastActivity: new Date() },
          { id: 2, extension: "1002", userId: "maria_garcia", displayName: "Maria Garcia", department: "Teaching", location: "Classroom B-201", status: "busy", deviceType: "softphone", lastActivity: new Date() },
          { id: 3, extension: "1003", userId: "david_chen", displayName: "David Chen", department: "IT Support", location: "IT Room", status: "online", deviceType: "desk_phone", lastActivity: new Date() },
          { id: 4, extension: "1004", userId: "sarah_johnson", displayName: "Sarah Johnson", department: "Security", location: "Security Office", status: "offline", deviceType: "mobile", lastActivity: new Date(Date.now() - 3600000) },
          { id: 5, extension: "1005", userId: "mike_brown", displayName: "Mike Brown", department: "Maintenance", location: "Maintenance Shop", status: "dnd", deviceType: "softphone", lastActivity: new Date() }
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
    requirePermission('manage_pbx'),
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
    requirePermission('manage_pbx'),
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
    requirePermission('emergency_broadcast'),
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
    requirePermission('page_devices'),
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
    requirePermission('manage_pbx'),
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