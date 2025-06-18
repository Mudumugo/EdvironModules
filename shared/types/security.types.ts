export interface SecurityZone {
  id: string;
  name: string;
  description?: string;
  location: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityCamera {
  id: string;
  name: string;
  zoneId: string;
  location: string;
  ipAddress: string;
  status: 'online' | 'offline' | 'maintenance';
  isRecording: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityEvent {
  id: string;
  type: 'intrusion' | 'unauthorized_access' | 'equipment_failure' | 'maintenance' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  zoneId?: string;
  cameraId?: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo?: string;
  occurredAt: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisitorRegistration {
  id: string;
  visitorName: string;
  visitorPhone?: string;
  visitorEmail?: string;
  purpose: string;
  hostName: string;
  hostDepartment?: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'checked_in' | 'checked_out' | 'expired';
  badgeNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityCall {
  id: string;
  caller: string;
  callerPhone?: string;
  type: 'emergency' | 'maintenance' | 'visitor' | 'general' | 'security_concern';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  location?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  assignedTo?: string;
  response?: string;
  callTime: Date;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityMetrics {
  totalZones: number;
  activeCameras: number;
  offlineCameras: number;
  openEvents: number;
  criticalEvents: number;
  activeVisitors: number;
  pendingCalls: number;
  monthlyIncidents: number;
}

export interface ThreatAlert {
  id: string;
  type: 'unauthorized_access' | 'equipment_tampering' | 'intrusion' | 'system_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  detectedAt: Date;
  status: 'active' | 'investigating' | 'resolved';
  assignedTo?: string;
}

export type SecurityModuleData = {
  zones: SecurityZone[];
  cameras: SecurityCamera[];
  events: SecurityEvent[];
  visitors: VisitorRegistration[];
  calls: SecurityCall[];
  metrics: SecurityMetrics;
  threats: ThreatAlert[];
};