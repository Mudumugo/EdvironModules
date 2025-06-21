import { WebSocketServer, WebSocket } from "ws";
import type { Server } from "http";
import { v4 as uuidv4 } from "uuid";

// WebSocket connection management
export interface ConnectedDevice {
  ws: WebSocket;
  userId: string;
  deviceId: string;
  sessionId?: string;
  deviceInfo: any;
  lastHeartbeat: Date;
}

export const connectedDevices = new Map<string, ConnectedDevice>();
export const sessionDevices = new Map<string, Set<string>>(); // sessionId -> Set<deviceId>

export function setupWebSocketServer(httpServer: Server): WebSocketServer {
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
            deviceInfo = await handleDeviceRegister(ws, data);
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
          case 'heartbeat':
            await handleHeartbeat(data);
            break;
        }
      } catch (error) {
        console.error('WebSocket message handling error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });

    ws.on('close', () => {
      if (deviceInfo) {
        connectedDevices.delete(deviceInfo.deviceId);
        if (deviceInfo.sessionId) {
          const devices = sessionDevices.get(deviceInfo.sessionId);
          if (devices) {
            devices.delete(deviceInfo.deviceId);
            if (devices.size === 0) {
              sessionDevices.delete(deviceInfo.sessionId);
            }
          }
        }
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

async function handleDeviceRegister(ws: WebSocket, data: any): Promise<ConnectedDevice> {
  const deviceId = data.deviceId || uuidv4();
  const device: ConnectedDevice = {
    ws,
    userId: data.userId,
    deviceId,
    deviceInfo: data.deviceInfo || {},
    lastHeartbeat: new Date()
  };
  
  connectedDevices.set(deviceId, device);
  
  ws.send(JSON.stringify({
    type: 'registered',
    deviceId,
    message: 'Device registered successfully'
  }));
  
  return device;
}

async function handleJoinSession(data: any) {
  const { deviceId, sessionId } = data;
  const device = connectedDevices.get(deviceId);
  
  if (!device) return;
  
  device.sessionId = sessionId;
  
  if (!sessionDevices.has(sessionId)) {
    sessionDevices.set(sessionId, new Set());
  }
  sessionDevices.get(sessionId)!.add(deviceId);
  
  // Notify other devices in the session
  broadcastToSession(sessionId, {
    type: 'device_joined',
    deviceId,
    userId: device.userId
  }, deviceId);
}

async function handleLeaveSession(data: any) {
  const { deviceId, sessionId } = data;
  const device = connectedDevices.get(deviceId);
  
  if (!device) return;
  
  device.sessionId = undefined;
  
  const devices = sessionDevices.get(sessionId);
  if (devices) {
    devices.delete(deviceId);
    if (devices.size === 0) {
      sessionDevices.delete(sessionId);
    }
  }
  
  broadcastToSession(sessionId, {
    type: 'device_left',
    deviceId,
    userId: device.userId
  }, deviceId);
}

async function handleScreenShareStart(data: any) {
  const { deviceId, sessionId } = data;
  
  broadcastToSession(sessionId, {
    type: 'screen_share_started',
    deviceId,
    shareData: data.shareData
  }, deviceId);
}

async function handleScreenShareStop(data: any) {
  const { deviceId, sessionId } = data;
  
  broadcastToSession(sessionId, {
    type: 'screen_share_stopped',
    deviceId
  }, deviceId);
}

async function handleHeartbeat(data: any) {
  const device = connectedDevices.get(data.deviceId);
  if (device) {
    device.lastHeartbeat = new Date();
  }
}

export function broadcastToSession(sessionId: string, message: any, excludeDeviceId?: string) {
  const devices = sessionDevices.get(sessionId);
  if (!devices) return;
  
  devices.forEach(deviceId => {
    if (deviceId === excludeDeviceId) return;
    
    const device = connectedDevices.get(deviceId);
    if (device && device.ws.readyState === WebSocket.OPEN) {
      device.ws.send(JSON.stringify(message));
    }
  });
}