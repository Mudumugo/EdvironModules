export interface Communication {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'newsletter' | 'alert' | 'reminder';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'scheduled' | 'sent' | 'archived';
  targetAudience: string[];
  channels: string[];
  createdAt: string;
  sentAt?: string;
  scheduledAt?: string;
  createdBy: string;
  readCount?: number;
  totalRecipients?: number;
}

export interface CommunicationFormData {
  title: string;
  content: string;
  type: string;
  priority: string;
  targetAudience: string[];
  channels: string[];
  scheduledAt?: string;
}

export const COMMUNICATION_TYPES = [
  { value: 'announcement', label: 'Announcement', icon: '📢', color: 'blue' },
  { value: 'newsletter', label: 'Newsletter', icon: '📰', color: 'green' },
  { value: 'alert', label: 'Alert', icon: '⚠️', color: 'red' },
  { value: 'reminder', label: 'Reminder', icon: '⏰', color: 'yellow' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
];

export const TARGET_AUDIENCES = [
  { value: 'all_students', label: 'All Students', icon: '👨‍🎓' },
  { value: 'all_parents', label: 'All Parents', icon: '👨‍👩‍👧‍👦' },
  { value: 'all_staff', label: 'All Staff', icon: '👨‍🏫' },
  { value: 'grade_1', label: 'Grade 1', icon: '1️⃣' },
  { value: 'grade_2', label: 'Grade 2', icon: '2️⃣' },
  { value: 'grade_3', label: 'Grade 3', icon: '3️⃣' },
  { value: 'grade_4', label: 'Grade 4', icon: '4️⃣' },
  { value: 'grade_5', label: 'Grade 5', icon: '5️⃣' },
  { value: 'grade_6', label: 'Grade 6', icon: '6️⃣' },
  { value: 'teachers', label: 'Teachers', icon: '👨‍🏫' },
  { value: 'administrators', label: 'Administrators', icon: '👔' }
];

export const DELIVERY_CHANNELS = [
  { value: 'email', label: 'Email', icon: '✉️', description: 'Send via email' },
  { value: 'sms', label: 'SMS', icon: '📱', description: 'Send text message' },
  { value: 'app_notification', label: 'App Notification', icon: '🔔', description: 'Push notification' },
  { value: 'website', label: 'Website Banner', icon: '🌐', description: 'Display on website' }
];