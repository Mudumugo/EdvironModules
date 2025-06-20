export interface StudentDevice {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  status: 'online' | 'offline' | 'restricted';
  batteryLevel?: number;
  lastActivity: string;
  restrictions: DeviceRestriction[];
  apps: InstalledApp[];
  screenTime: ScreenTimeData;
  location: string;
}

export interface DeviceRestriction {
  id: string;
  type: 'app_block' | 'website_block' | 'time_limit' | 'feature_disable';
  name: string;
  description: string;
  isActive: boolean;
  schedule?: {
    startTime: string;
    endTime: string;
    days: string[];
  };
  targets: string[];
}

export interface InstalledApp {
  id: string;
  name: string;
  category: 'educational' | 'productivity' | 'entertainment' | 'social' | 'utility';
  isBlocked: boolean;
  timeUsed: number;
  lastUsed: string;
  icon?: string;
}

export interface ScreenTimeData {
  today: number;
  thisWeek: number;
  dailyLimit: number;
  weeklyLimit: number;
  categoryBreakdown: {
    [category: string]: number;
  };
  history: ScreenTimeEntry[];
}

export interface ScreenTimeEntry {
  date: string;
  totalTime: number;
  categories: {
    [category: string]: number;
  };
}

export interface DeviceActivity {
  id: string;
  type: 'app_launch' | 'website_visit' | 'file_access' | 'system_event';
  title: string;
  timestamp: string;
  duration?: number;
  category: string;
}

export interface DeviceNotification {
  id: string;
  type: 'restriction' | 'warning' | 'info' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface BreakRequest {
  id: string;
  reason: string;
  duration: number;
  status: 'pending' | 'approved' | 'denied';
  timestamp: string;
  approvedBy?: string;
}

export const APP_CATEGORIES = [
  { value: 'educational', label: 'Educational', color: 'green' },
  { value: 'productivity', label: 'Productivity', color: 'blue' },
  { value: 'entertainment', label: 'Entertainment', color: 'purple' },
  { value: 'social', label: 'Social', color: 'pink' },
  { value: 'utility', label: 'Utility', color: 'gray' }
];

export const RESTRICTION_TYPES = [
  { value: 'app_block', label: 'App Block', icon: 'Ban' },
  { value: 'website_block', label: 'Website Block', icon: 'Globe' },
  { value: 'time_limit', label: 'Time Limit', icon: 'Clock' },
  { value: 'feature_disable', label: 'Feature Disable', icon: 'ShieldOff' }
];