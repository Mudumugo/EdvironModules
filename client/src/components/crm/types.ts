export interface Lead {
  id: number;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  source: string;
  notes?: string;
  estimatedValue?: number;
  expectedCloseDate?: string;
  lastContactDate?: string;
  nextFollowUp?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: number;
  leadId: number;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'note';
  description: string;
  date: string;
  userId: string;
  outcome?: string;
  nextAction?: string;
  createdAt: string;
}

export interface DemoRequest {
  id: number;
  schoolName: string;
  contactName: string;
  email: string;
  phone: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requestedDate?: string;
  scheduledDate?: string;
  demoType: 'virtual' | 'in_person' | 'hybrid';
  requirements?: string;
  followUpNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const LEAD_STATUSES = [
  { value: 'new', label: 'New Lead', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'indigo' },
  { value: 'qualified', label: 'Qualified', color: 'purple' },
  { value: 'proposal', label: 'Proposal Sent', color: 'orange' },
  { value: 'negotiation', label: 'In Negotiation', color: 'yellow' },
  { value: 'closed_won', label: 'Closed Won', color: 'green' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'red' }
];

export const LEAD_SOURCES = [
  'Website',
  'Referral',
  'Cold Call',
  'Trade Show',
  'Marketing Campaign',
  'Social Media',
  'Partner',
  'Other'
];

export const ACTIVITY_TYPES = [
  { value: 'call', label: 'Phone Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'demo', label: 'Demo', icon: '🖥️' },
  { value: 'proposal', label: 'Proposal', icon: '📋' },
  { value: 'note', label: 'Note', icon: '📝' }
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'red' }
];