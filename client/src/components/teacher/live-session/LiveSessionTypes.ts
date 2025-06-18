export interface LiveSessionControlProps {
  sessionId: string;
  onClose?: () => void;
}

export interface ConnectedDevice {
  id: string;
  deviceId: string;
  userId: string;
  deviceType: string;
  platform: string;
  browser?: string;
  screenResolution?: string;
  isConnected: boolean;
  lastSeen: string;
  status: string;
  isControlled: boolean;
  controlledBy?: string;
  capabilities: {
    camera?: boolean;
    microphone?: boolean;
    screenShare?: boolean;
    remoteControl?: boolean;
  };
}

export interface SessionParticipant {
  id: string;
  userId: string;
  deviceId: string;
  role: string;
  status: string;
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isScreenSharing: boolean;
  canBeControlled: boolean;
  connectionQuality: string;
  lastActivity: string;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  status: string;
  startTime: string;
  endTime?: string;
  teacherId: string;
  classId: string;
  participants: SessionParticipant[];
  devices: ConnectedDevice[];
  settings: {
    allowStudentVideo: boolean;
    allowStudentAudio: boolean;
    allowScreenSharing: boolean;
    recordSession: boolean;
  };
}

export interface ScreenSharingData {
  isActive: boolean;
  presenterId?: string;
  quality: string;
  viewers: string[];
}

export interface WebSocketMessage {
  type: string;
  sessionId?: string;
  deviceId?: string;
  userId?: string;
  data?: any;
  timestamp: string;
}