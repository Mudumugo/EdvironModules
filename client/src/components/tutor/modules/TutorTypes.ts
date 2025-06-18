export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  subjects: string[];
  rating: number;
  experience: string;
  hourlyRate: string;
  languages: string[];
  availability: string;
  verified: boolean;
  featured: boolean;
  responseTime: string;
  lessonsCompleted: number;
  description: string;
  specializations: string[];
  education: string;
  teachingStyle: string[];
  sessionTypes: string[];
}

export interface TutorSession {
  id: string;
  tutorId: string;
  tutorName: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  studentName: string;
  price: number;
  meetingLink?: string;
  notes?: string;
}

export interface SessionRequest {
  id: string;
  tutorId: string;
  studentName: string;
  subject: string;
  preferredDate: string;
  preferredTime: string;
  duration: number;
  message: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}