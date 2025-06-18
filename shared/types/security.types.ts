// Security-related type definitions
export interface SecurityMetrics {
  totalZones: number;
  activeCameras: number;
  totalEvents: number;
  activeVisitors: number;
  threatsDetected: number;
  systemStatus: 'online' | 'offline' | 'maintenance';
}

export interface ThreatAlert {
  id: string;
  type: 'intrusion' | 'unauthorized_access' | 'system_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  timestamp: Date;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface SecurityDashboardData {
  zones: any[];
  cameras: any[];
  events: any[];
  visitors: any[];
  metrics: SecurityMetrics;
  threats: ThreatAlert[];
}