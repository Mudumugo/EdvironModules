// Security module types - isolated from other modules
export interface SecurityZone {
  id: string;
  name: string;
  description: string;
  location: string;
  isActive: boolean;
  cameraCount: number;
  lastActivity?: Date;
}

export interface SecurityCamera {
  id: string;
  name: string;
  zoneId: string;
  location: string;
  status: 'online' | 'offline' | 'maintenance';
  streamUrl: string;
  lastPing?: Date;
  isRecording: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'intrusion' | 'unauthorized_access' | 'emergency' | 'maintenance' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  zoneId: string;
  cameraId?: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  assignedTo?: string;
}

export interface VisitorRegistration {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  purpose: string;
  hostName: string;
  department: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'checked_in' | 'checked_out' | 'expired';
  badgeNumber?: string;
  photoId?: string;
}

export interface SecurityCall {
  id: string;
  type: 'emergency' | 'routine' | 'maintenance' | 'alert';
  caller: string;
  location: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;
  responseTime?: number;
}

export interface SecurityMetrics {
  totalZones: number;
  activeCameras: number;
  offlineCameras: number;
  activeAlerts: number;
  todayVisitors: number;
  todayIncidents: number;
  averageResponseTime: number;
  systemHealth: 'excellent' | 'good' | 'fair' | 'poor';
}