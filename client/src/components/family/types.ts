export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  role: 'parent' | 'child';
  age?: number;
  profileImage?: string;
  devices: Device[];
}

export interface Device {
  id: string;
  name: string;
  type: 'phone' | 'tablet' | 'laptop' | 'desktop';
  userId: string;
  isOnline: boolean;
  lastSeen: string;
  batteryLevel?: number;
  location?: string;
}

export interface TimeRestriction {
  id: string;
  deviceId: string;
  dayOfWeek: number; // 0-6, Sunday is 0
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  isActive: boolean;
}

export interface AppRestriction {
  id: string;
  deviceId: string;
  appName: string;
  packageName: string;
  isBlocked: boolean;
  timeLimit?: number; // minutes
  usedTime?: number; // minutes
}

export interface ContentFilter {
  id: string;
  deviceId: string;
  category: string;
  isBlocked: boolean;
  ageRating?: string;
}

export interface FamilyStats {
  totalDevices: number;
  onlineDevices: number;
  activeRestrictions: number;
  protectedDevices: number;
}

// Form types
export interface TimeRestrictionFormType {
  deviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface AppRestrictionFormType {
  deviceId: string;
  appName: string;
  packageName: string;
  isBlocked: boolean;
  timeLimit?: number;
}

export interface ContentFilterFormType {
  deviceId: string;
  category: string;
  isBlocked: boolean;
  ageRating?: string;
}