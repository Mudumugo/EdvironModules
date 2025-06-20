export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'system' | 'academic' | 'administrative' | 'social' | 'emergency';
  isRead: boolean;
  isArchived: boolean;
  timestamp: string;
  expiresAt?: string;
  actionRequired?: boolean;
  actionUrl?: string;
  actionText?: string;
  senderId?: string;
  senderName?: string;
  targetAudience: string[];
  attachments?: NotificationAttachment[];
  metadata?: {
    [key: string]: any;
  };
}

export interface NotificationAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface NotificationFilter {
  type?: string;
  priority?: string;
  category?: string;
  isRead?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  urgent: number;
  archived: number;
  byCategory: {
    [category: string]: number;
  };
  byType: {
    [type: string]: number;
  };
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  categories: {
    [category: string]: {
      enabled: boolean;
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
}

export const NOTIFICATION_TYPES = [
  { value: 'info', label: 'Information', color: 'blue', icon: 'Info' },
  { value: 'success', label: 'Success', color: 'green', icon: 'CheckCircle' },
  { value: 'warning', label: 'Warning', color: 'yellow', icon: 'AlertTriangle' },
  { value: 'error', label: 'Error', color: 'red', icon: 'XCircle' },
  { value: 'announcement', label: 'Announcement', color: 'purple', icon: 'Megaphone' }
];

export const NOTIFICATION_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
];

export const NOTIFICATION_CATEGORIES = [
  { value: 'system', label: 'System', color: 'gray', icon: 'Settings' },
  { value: 'academic', label: 'Academic', color: 'blue', icon: 'GraduationCap' },
  { value: 'administrative', label: 'Administrative', color: 'purple', icon: 'FileText' },
  { value: 'social', label: 'Social', color: 'green', icon: 'Users' },
  { value: 'emergency', label: 'Emergency', color: 'red', icon: 'AlertCircle' }
];