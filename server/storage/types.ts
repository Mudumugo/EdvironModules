import {
  type User,
  type UpsertUser,
  type UserSettings,
  type InsertUserSettings,
  type LibraryCategory,
  type LibraryResource,
  type Lead,
  type InsertLead,
  type LeadActivity,
  type InsertLeadActivity,
  type DemoRequest,
  type InsertDemoRequest
} from "@shared/schema";

export interface IUserStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByGradeLevel(gradeLevel: string): Promise<User[]>;
  getUsersByDepartment(department: string): Promise<User[]>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  updateUserGradeLevel(userId: string, gradeLevel: string): Promise<User>;
  updateUserDepartment(userId: string, department: string): Promise<User>;
  deactivateUser(userId: string): Promise<User>;
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: Partial<InsertUserSettings>): Promise<UserSettings>;
  searchUsers(query: string): Promise<User[]>;
  getTenantUsers(tenantId: string): Promise<User[]>;
}

export interface ILibraryStorage {
  getLibraryCategories(gradeLevel?: string): Promise<LibraryCategory[]>;
  getLibrarySubjects(gradeLevel?: string, categoryId?: string): Promise<any[]>;
  getLibraryResources(filters?: any): Promise<LibraryResource[]>;
  getLibraryResource(id: string): Promise<LibraryResource | undefined>;
  createLibraryResource(resource: any): Promise<LibraryResource>;
  updateLibraryResource(id: string, updates: any): Promise<LibraryResource>;
  deleteLibraryResource(id: string): Promise<void>;
  searchLibraryResources(query: string, filters?: any): Promise<LibraryResource[]>;
  createLibraryResourceAccess(accessData: any): Promise<any>;
  updateResourceStats(resourceId: string, updateType: 'view' | 'download'): Promise<void>;
  getResourceCountsBySubject(gradeLevel: string): Promise<{ [subjectId: string]: { books: number, worksheets: number, quizzes: number } }>;
}

export interface ICRMStorage {
  getLeads(filters?: any): Promise<any[]>;
  getLead(id: number): Promise<any>;
  createLead(lead: any): Promise<any>;
  updateLead(id: number, updates: any): Promise<any>;
  deleteLead(id: number): Promise<void>;
  getLeadActivities(leadId?: number): Promise<any[]>;
  createLeadActivity(activity: any): Promise<any>;
  getDemoRequests(filters?: any): Promise<any[]>;
  getDemoRequest(id: number): Promise<any>;
  createDemoRequest(demo: any): Promise<any>;
  updateDemoRequest(id: number, updates: any): Promise<any>;
}

export interface ISecurityStorage {
  getSecurityZones(): Promise<any[]>;
  createSecurityZone(zone: any): Promise<any>;
  getSecurityCamerasByZone(zoneId: string): Promise<any[]>;
  getSecurityCameras(): Promise<any[]>;
  createSecurityCamera(camera: any): Promise<any>;
  getSecurityEvents(filters?: any): Promise<any[]>;
  createSecurityEvent(event: any): Promise<any>;
  updateSecurityEvent(id: string, updates: any): Promise<any>;
  getVisitorRegistrations(filters?: any): Promise<any[]>;
  createVisitorRegistration(registration: any): Promise<any>;
  checkoutVisitor(id: string): Promise<any>;
  getSecurityCalls(filters?: any): Promise<any[]>;
  createSecurityCall(call: any): Promise<any>;
  getSecurityMetrics(): Promise<any>;
  getActiveThreats(): Promise<any[]>;
}

export interface ILiveSessionStorage {
  registerDevice(sessionId: string, deviceData: any): Promise<any>;
  startScreenSharing(sessionId: string, data: any): Promise<any>;
  stopScreenSharing(sessionId: string): Promise<void>;
  updateDeviceHeartbeat(deviceId: string): Promise<void>;
  getLiveSessionsByTeacher(teacherId: string): Promise<any[]>;
  getSessionDevices(sessionId: string): Promise<any[]>;
  getActiveScreenSharing(sessionId: string): Promise<any[]>;
  updateDeviceControlStatus(deviceId: string, status: any): Promise<void>;
}

export interface ICalendarStorage {
  getEventsForUser(userId: string, filters?: any): Promise<any[]>;
  getUpcomingEventsForUser(userId: string): Promise<any[]>;
  getEvent(id: string): Promise<any>;
  createEvent(event: any): Promise<any>;
  updateEvent(id: string, updates: any): Promise<any>;
  deleteEvent(id: string): Promise<void>;
  updateParticipantRSVP(eventId: string, userId: string, status: string): Promise<void>;
  getEventsRequiringApproval(): Promise<any[]>;
  getUserEventConflicts(userId: string, startTime: Date, endTime: Date): Promise<any[]>;
  getEventsByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<any[]>;
}

export interface IStorage extends 
  IUserStorage, 
  ILibraryStorage, 
  ICRMStorage, 
  ISecurityStorage, 
  ILiveSessionStorage, 
  ICalendarStorage {
  // Additional methods that don't fit into specific domains
  getAnalytics(filters?: any): Promise<any>;
  recordAnalyticEvent(event: any): Promise<void>;
  getActivityLogs(userId?: string, limit?: number): Promise<any[]>;
  recordActivity(activity: any): Promise<void>;
  getNotifications(userId: string): Promise<any[]>;
  createNotification(notification: any): Promise<any>;
  markNotificationRead(id: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
}