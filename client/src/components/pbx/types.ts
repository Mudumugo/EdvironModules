export interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'internal';
  from: string;
  to: string;
  status: 'ringing' | 'active' | 'hold' | 'ended';
  startTime: string;
  duration?: number;
  direction: 'inbound' | 'outbound';
}

export interface Extension {
  id: string;
  number: string;
  name: string;
  status: 'available' | 'busy' | 'offline' | 'dnd';
  department: string;
  location: string;
  lastActivity: string;
}

export interface CallLog {
  id: string;
  callId: string;
  from: string;
  to: string;
  duration: number;
  timestamp: string;
  type: 'incoming' | 'outgoing' | 'internal';
  status: 'completed' | 'missed' | 'busy' | 'failed';
  recording?: string;
}

export interface Conference {
  id: string;
  name: string;
  participants: string[];
  moderator: string;
  startTime: string;
  status: 'active' | 'scheduled' | 'ended';
  pin?: string;
  maxParticipants: number;
}

export interface VoicemailMessage {
  id: string;
  from: string;
  to: string;
  duration: number;
  timestamp: string;
  transcription?: string;
  audioUrl: string;
  isRead: boolean;
  priority: 'normal' | 'urgent';
}

export interface PBXSettings {
  autoAnswer: boolean;
  callForwarding: {
    enabled: boolean;
    number?: string;
    conditions: ('busy' | 'no-answer' | 'unavailable')[];
  };
  voicemail: {
    enabled: boolean;
    greeting?: string;
    transcription: boolean;
  };
  dnd: {
    enabled: boolean;
    schedule?: {
      start: string;
      end: string;
      days: string[];
    };
  };
  recording: {
    enabled: boolean;
    announcement: boolean;
  };
}

export const CALL_STATUSES = [
  { value: 'ringing', label: 'Ringing', color: 'blue' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'hold', label: 'On Hold', color: 'yellow' },
  { value: 'ended', label: 'Ended', color: 'gray' }
];

export const EXTENSION_STATUSES = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'busy', label: 'Busy', color: 'red' },
  { value: 'offline', label: 'Offline', color: 'gray' },
  { value: 'dnd', label: 'Do Not Disturb', color: 'orange' }
];