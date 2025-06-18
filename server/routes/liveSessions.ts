import type { Express } from "express";
import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import type { AuthenticatedRequest } from "../roleMiddleware";
import { requirePermission, requireRole } from "../roleMiddleware";
import { PERMISSIONS, USER_ROLES } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

// WebSocket connection management
interface ConnectedDevice {
  ws: WebSocket;
  userId: string;
  deviceId: string;
  sessionId?: string;
  deviceInfo: any;
  lastHeartbeat: Date;
}

const connectedDevices = new Map<string, ConnectedDevice>();
const sessionDevices = new Map<string, Set<string>>(); // sessionId -> Set<deviceId>

export function registerLiveSessionRoutes(app: Express, httpServer: Server) {
  // WebSocket server for real-time communication
  const wss = new WebSocketServer({ 
    server: httpServer, 
    path: '/ws/live-sessions'
  });

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection for live sessions');
    
    let deviceInfo: ConnectedDevice | null = null;

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        switch (data.type) {
          case 'register':
            await handleDeviceRegister(ws, data);
            break;
          case 'join_session':
            await handleJoinSession(data);
            break;
          case 'leave_session':
            await handleLeaveSession(data);
            break;
          case 'screen_share_start':
            await handleScreenShareStart(data);
            break;
          case 'screen_share_stop':
            await handleScreenShareStop(data);
            break;
          case 'device_control':
            await handleDeviceControl(data);
            break;
          case 'heartbeat':
            await handleHeartbeat(data);
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      if (deviceInfo) {
        connectedDevices.delete(deviceInfo.deviceId);
        if (deviceInfo.sessionId) {
          const sessionDeviceSet = sessionDevices.get(deviceInfo.sessionId);
          if (sessionDeviceSet) {
            sessionDeviceSet.delete(deviceInfo.deviceId);
          }
        }
        console.log(`Device ${deviceInfo.deviceId} disconnected`);
      }
    });

    async function handleDeviceRegister(ws: WebSocket, data: any) {
      const deviceId = data.deviceId || uuidv4();
      deviceInfo = {
        ws,
        userId: data.userId,
        deviceId,
        deviceInfo: data.deviceInfo,
        lastHeartbeat: new Date()
      };
      
      connectedDevices.set(deviceId, deviceInfo);
      
      // Register device in database
      await storage.registerDevice({
        id: uuidv4(),
        deviceId,
        userId: data.userId,
        deviceType: data.deviceInfo.type || 'desktop',
        platform: data.deviceInfo.platform || 'unknown',
        browser: data.deviceInfo.browser,
        ipAddress: req.socket.remoteAddress,
        userAgent: req.headers['user-agent'],
        screenResolution: data.deviceInfo.screenResolution,
        capabilities: data.deviceInfo.capabilities || {},
        tenantId: data.tenantId
      });

      ws.send(JSON.stringify({
        type: 'registered',
        deviceId,
        message: 'Device registered successfully'
      }));
    }

    async function handleJoinSession(data: any) {
      const { sessionId, userId, deviceId } = data;
      
      if (!connectedDevices.has(deviceId)) {
        return;
      }

      const device = connectedDevices.get(deviceId)!;
      device.sessionId = sessionId;
      
      // Add to session devices
      if (!sessionDevices.has(sessionId)) {
        sessionDevices.set(sessionId, new Set());
      }
      sessionDevices.get(sessionId)!.add(deviceId);

      // Add participant to database
      await storage.addSessionParticipant({
        id: uuidv4(),
        sessionId,
        userId,
        deviceId,
        role: data.role || 'student',
        status: 'online',
        joinedAt: new Date(),
        deviceInfo: device.deviceInfo
      });

      // Notify other participants
      broadcastToSession(sessionId, {
        type: 'participant_joined',
        userId,
        deviceId,
        deviceInfo: device.deviceInfo
      }, deviceId);

      device.ws.send(JSON.stringify({
        type: 'session_joined',
        sessionId,
        message: 'Successfully joined session'
      }));
    }

    async function handleLeaveSession(data: any) {
      const { sessionId, deviceId } = data;
      const device = connectedDevices.get(deviceId);
      
      if (device && device.sessionId === sessionId) {
        device.sessionId = undefined;
        
        const sessionDeviceSet = sessionDevices.get(sessionId);
        if (sessionDeviceSet) {
          sessionDeviceSet.delete(deviceId);
        }

        broadcastToSession(sessionId, {
          type: 'participant_left',
          deviceId
        }, deviceId);
      }
    }

    async function handleScreenShareStart(data: any) {
      const { sessionId, deviceId, shareType, quality } = data;
      
      const screenShare = await storage.startScreenSharing({
        id: uuidv4(),
        sessionId,
        presenterId: data.userId,
        presenterDeviceId: deviceId,
        shareType: shareType || 'screen',
        quality: quality || 'medium',
        viewers: [],
        streamUrl: data.streamUrl
      });

      broadcastToSession(sessionId, {
        type: 'screen_share_started',
        screenShareId: screenShare.id,
        presenterId: data.userId,
        shareType,
        streamUrl: data.streamUrl
      });
    }

    async function handleScreenShareStop(data: any) {
      const { screenShareId, sessionId } = data;
      
      await storage.stopScreenSharing(screenShareId);
      
      broadcastToSession(sessionId, {
        type: 'screen_share_stopped',
        screenShareId
      });
    }

    async function handleDeviceControl(data: any) {
      const { sessionId, targetDeviceId, actionType, actionData } = data;
      
      const controlAction = await storage.createDeviceControlAction({
        id: uuidv4(),
        sessionId,
        controllerId: data.userId,
        targetDeviceId,
        targetUserId: data.targetUserId,
        actionType,
        actionData: actionData || {}
      });

      // Send control command to target device
      const targetDevice = connectedDevices.get(targetDeviceId);
      if (targetDevice) {
        targetDevice.ws.send(JSON.stringify({
          type: 'device_control_command',
          actionId: controlAction.id,
          actionType,
          actionData,
          controllerId: data.userId
        }));
      }
    }

    async function handleHeartbeat(data: any) {
      const { deviceId } = data;
      const device = connectedDevices.get(deviceId);
      
      if (device) {
        device.lastHeartbeat = new Date();
        await storage.updateDeviceHeartbeat(deviceId);
      }
    }
  });

  // Utility function to broadcast to all devices in a session
  function broadcastToSession(sessionId: string, message: any, excludeDeviceId?: string) {
    const sessionDeviceSet = sessionDevices.get(sessionId);
    if (!sessionDeviceSet) return;

    sessionDeviceSet.forEach(deviceId => {
      if (deviceId === excludeDeviceId) return;
      
      const device = connectedDevices.get(deviceId);
      if (device && device.ws.readyState === WebSocket.OPEN) {
        device.ws.send(JSON.stringify(message));
      }
    });
  }

  // REST API endpoints for live sessions
  app.post('/api/teacher/live-sessions', isAuthenticated, requireRole(USER_ROLES.TEACHER), async (req: AuthenticatedRequest, res) => {
    try {
      const sessionData = {
        id: uuidv4(),
        ...req.body,
        teacherId: req.user!.id,
        tenantId: req.user!.tenantId
      };

      const session = await storage.createLiveSession(sessionData);
      
      res.json({
        success: true,
        session,
        message: 'Live session created successfully'
      });
    } catch (error) {
      console.error('Error creating live session:', error);
      res.status(500).json({ message: 'Failed to create live session' });
    }
  });

  app.get('/api/teacher/live-sessions', isAuthenticated, requireRole(USER_ROLES.TEACHER), async (req: AuthenticatedRequest, res) => {
    try {
      const sessions = await storage.getLiveSessionsByTeacher(req.user!.id);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      res.status(500).json({ message: 'Failed to fetch live sessions' });
    }
  });

  app.get('/api/live-sessions/:sessionId', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const session = await storage.getLiveSession(req.params.sessionId);
      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }
      res.json(session);
    } catch (error) {
      console.error('Error fetching live session:', error);
      res.status(500).json({ message: 'Failed to fetch live session' });
    }
  });

  app.patch('/api/live-sessions/:sessionId/status', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { status } = req.body;
      const updates: any = { status };
      
      if (status === 'live') {
        updates.actualStartTime = new Date();
      } else if (status === 'ended') {
        updates.actualEndTime = new Date();
      }

      const session = await storage.updateLiveSession(req.params.sessionId, updates);
      
      // Broadcast status change to all participants
      broadcastToSession(req.params.sessionId, {
        type: 'session_status_changed',
        sessionId: req.params.sessionId,
        status,
        timestamp: new Date()
      });

      res.json({
        success: true,
        session,
        message: `Session status updated to ${status}`
      });
    } catch (error) {
      console.error('Error updating session status:', error);
      res.status(500).json({ message: 'Failed to update session status' });
    }
  });

  app.get('/api/live-sessions/:sessionId/participants', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const participants = await storage.getSessionParticipants(req.params.sessionId);
      res.json(participants);
    } catch (error) {
      console.error('Error fetching session participants:', error);
      res.status(500).json({ message: 'Failed to fetch session participants' });
    }
  });

  app.get('/api/live-sessions/:sessionId/devices', isAuthenticated, requireRole(USER_ROLES.TEACHER), async (req: AuthenticatedRequest, res) => {
    try {
      const devices = await storage.getSessionDevices(req.params.sessionId);
      
      // Add real-time connection status
      const devicesWithStatus = devices.map(device => ({
        ...device,
        isConnected: connectedDevices.has(device.deviceId),
        lastSeen: connectedDevices.get(device.deviceId)?.lastHeartbeat || device.lastHeartbeat
      }));
      
      res.json(devicesWithStatus);
    } catch (error) {
      console.error('Error fetching session devices:', error);
      res.status(500).json({ message: 'Failed to fetch session devices' });
    }
  });

  app.post('/api/live-sessions/:sessionId/device-control', isAuthenticated, requireRole(USER_ROLES.TEACHER), async (req: AuthenticatedRequest, res) => {
    try {
      const { targetDeviceId, actionType, actionData, targetUserId } = req.body;
      
      const controlAction = await storage.createDeviceControlAction({
        id: uuidv4(),
        sessionId: req.params.sessionId,
        controllerId: req.user!.id,
        targetDeviceId,
        targetUserId,
        actionType,
        actionData: actionData || {}
      });

      // Send control command to target device
      const targetDevice = connectedDevices.get(targetDeviceId);
      if (targetDevice) {
        targetDevice.ws.send(JSON.stringify({
          type: 'device_control_command',
          actionId: controlAction.id,
          actionType,
          actionData,
          controllerId: req.user!.id
        }));
        
        res.json({
          success: true,
          actionId: controlAction.id,
          message: 'Control command sent successfully'
        });
      } else {
        res.status(404).json({ message: 'Target device not connected' });
      }
    } catch (error) {
      console.error('Error sending device control command:', error);
      res.status(500).json({ message: 'Failed to send device control command' });
    }
  });

  app.get('/api/live-sessions/:sessionId/screen-sharing', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const screenSharing = await storage.getActiveScreenSharing(req.params.sessionId);
      res.json(screenSharing);
    } catch (error) {
      console.error('Error fetching screen sharing info:', error);
      res.status(500).json({ message: 'Failed to fetch screen sharing info' });
    }
  });

  app.post('/api/device/control-response', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { actionId, status, responseData } = req.body;
      
      await storage.updateDeviceControlStatus(actionId, status, responseData);
      
      res.json({
        success: true,
        message: 'Control response recorded'
      });
    } catch (error) {
      console.error('Error recording control response:', error);
      res.status(500).json({ message: 'Failed to record control response' });
    }
  });

  // Cleanup disconnected devices periodically
  setInterval(() => {
    const now = new Date();
    const timeout = 30000; // 30 seconds timeout
    
    connectedDevices.forEach((device, deviceId) => {
      if (now.getTime() - device.lastHeartbeat.getTime() > timeout) {
        console.log(`Removing stale device connection: ${deviceId}`);
        connectedDevices.delete(deviceId);
        
        if (device.sessionId) {
          const sessionDeviceSet = sessionDevices.get(device.sessionId);
          if (sessionDeviceSet) {
            sessionDeviceSet.delete(deviceId);
          }
        }
        
        if (device.ws.readyState === WebSocket.OPEN) {
          device.ws.close();
        }
      }
    });
  }, 10000); // Check every 10 seconds
}