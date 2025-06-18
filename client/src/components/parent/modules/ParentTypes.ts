export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  verified: boolean;
  joinDate: string;
  lastActive: string;
  children: Child[];
  emergencyContact: string;
  preferences: ParentPreferences;
}

export interface Child {
  id: string;
  name: string;
  grade: string;
  class: string;
  dateOfBirth: string;
  avatar: string;
  parentId: string;
  emergencyContacts: EmergencyContact[];
  medicalInfo: MedicalInfo;
  academicInfo: AcademicInfo;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
}

export interface MedicalInfo {
  allergies: string[];
  medications: string[];
  conditions: string[];
  doctor: string;
  doctorPhone: string;
  emergencyMedicalContact: string;
}

export interface AcademicInfo {
  currentGrade: string;
  currentClass: string;
  teacher: string;
  subjects: string[];
  specialNeeds: string[];
  notes: string;
}

export interface ParentPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  communicationLanguage: string;
  emergencyNotifications: boolean;
  academicUpdates: boolean;
  eventReminders: boolean;
}

export interface ParentActivity {
  id: string;
  parentId: string;
  action: string;
  description: string;
  timestamp: string;
  childId?: string;
  category: 'communication' | 'academic' | 'emergency' | 'system';
}

export interface CommunicationRecord {
  id: string;
  parentId: string;
  childId?: string;
  type: 'email' | 'sms' | 'call' | 'meeting' | 'message';
  subject: string;
  content: string;
  sentBy: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'read' | 'replied';
  priority: 'low' | 'medium' | 'high' | 'urgent';
}