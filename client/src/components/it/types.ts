export interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  zone: string;
  user: string;
  ip: string;
  os: string;
  lastSeen: string;
  policies: string[];
  isLocked: boolean;
  screenSharingActive?: boolean;
  batteryLevel?: number;
  lastActivity?: string;
  applications?: string[];
  restrictions?: string[];
}

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
  policies: string[];
  createdAt: string;
  color?: string;
  schedule?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
}

export interface DevicePolicy {
  id: string;
  name: string;
  description: string;
  type: 'restriction' | 'permission' | 'configuration';
  rules: {
    apps?: {
      blocked: string[];
      allowed: string[];
    };
    websites?: {
      blocked: string[];
      allowed: string[];
    };
    timeRestrictions?: {
      enabled: boolean;
      schedule: {
        [day: string]: { start: string; end: string }[];
      };
    };
    features?: {
      camera: boolean;
      microphone: boolean;
      usb: boolean;
      printing: boolean;
      screenSharing: boolean;
    };
  };
  isActive: boolean;
  priority: number;
}

export interface DeviceAction {
  id: string;
  type: 'lock' | 'unlock' | 'restart' | 'shutdown' | 'refresh' | 'screenshot' | 'policy_update';
  deviceIds: string[];
  groupIds?: string[];
  status: 'pending' | 'executing' | 'completed' | 'failed';
  timestamp: string;
  executedBy: string;
  results?: {
    [deviceId: string]: {
      success: boolean;
      message?: string;
      timestamp: string;
    };
  };
}

export const DEVICE_TYPES = [
  { value: 'desktop', label: 'Desktop', icon: 'Monitor' },
  { value: 'laptop', label: 'Laptop', icon: 'Laptop' },
  { value: 'tablet', label: 'Tablet', icon: 'Tablet' },
  { value: 'mobile', label: 'Mobile', icon: 'Smartphone' }
];

export const DEVICE_STATUSES = [
  { value: 'online', label: 'Online', color: 'green' },
  { value: 'offline', label: 'Offline', color: 'gray' },
  { value: 'maintenance', label: 'Maintenance', color: 'orange' }
];

export const POLICY_TYPES = [
  { value: 'restriction', label: 'Restriction', color: 'red' },
  { value: 'permission', label: 'Permission', color: 'green' },
  { value: 'configuration', label: 'Configuration', color: 'blue' }
];