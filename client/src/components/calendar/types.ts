export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  location?: string;
  organizer?: string;
  attendees?: string[];
  eventType: 'class' | 'meeting' | 'exam' | 'event' | 'holiday' | 'break';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'tentative' | 'confirmed' | 'cancelled';
  requiresRSVP: boolean;
  maxAttendees?: number;
  currentAttendees?: number;
  tags?: string[];
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: string;
  };
  color?: string;
  visibility: 'public' | 'private' | 'confidential';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  currentDate: Date;
}

export interface TimeSlot {
  start: string;
  end: string;
  available: boolean;
  event?: CalendarEvent;
}

export const EVENT_TYPES = [
  { value: 'class', label: 'Class', icon: '📚', color: 'blue' },
  { value: 'meeting', label: 'Meeting', icon: '🤝', color: 'green' },
  { value: 'exam', label: 'Exam', icon: '📝', color: 'red' },
  { value: 'event', label: 'Event', icon: '🎉', color: 'purple' },
  { value: 'holiday', label: 'Holiday', icon: '🏖️', color: 'orange' },
  { value: 'break', label: 'Break', icon: '☕', color: 'gray' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'normal', label: 'Normal', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
];

export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];