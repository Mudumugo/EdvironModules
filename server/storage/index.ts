import { UserStorage } from "./userStorage";
import { LibraryStorage } from "./libraryStorage";
import { CRMStorage } from "./crmStorage";
import { SecurityStorage } from "./securityStorage";
import { AppsHubStorage } from "./appsHubStorage";
import { IStorage } from "./types";

export class DatabaseStorage implements IStorage {
  private userStorage = new UserStorage();
  private libraryStorage = new LibraryStorage();
  private crmStorage = new CRMStorage();
  private securityStorage = new SecurityStorage();
  private appsHubStorage = new AppsHubStorage();

  // User operations - delegate to UserStorage
  async getUser(id: string) { return this.userStorage.getUser(id); }
  async upsertUser(user: any) { return this.userStorage.upsertUser(user); }
  async updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string) {
    return this.userStorage.updateUserRole(userId, role, gradeLevel, department);
  }
  async getUserByEmail(email: string) { return this.userStorage.getUserByEmail(email); }
  async getAllUsers() { return this.userStorage.getAllUsers(); }
  async getUsersByRole(role: string) { return this.userStorage.getUsersByRole(role); }
  async getUsersByGradeLevel(gradeLevel: string) { return this.userStorage.getUsersByGradeLevel(gradeLevel); }
  async getUsersByDepartment(department: string) { return this.userStorage.getUsersByDepartment(department); }
  async getUsersByTenant(tenantId: string) { return this.userStorage.getUsersByTenant(tenantId); }
  async updateUserGradeLevel(userId: string, gradeLevel: string) { return this.userStorage.updateUserGradeLevel(userId, gradeLevel); }
  async updateUserDepartment(userId: string, department: string) { return this.userStorage.updateUserDepartment(userId, department); }
  async deactivateUser(userId: string) { return this.userStorage.deactivateUser(userId); }
  async getUserSettings(userId: string) { return this.userStorage.getUserSettings(userId); }
  async updateUserSettings(userId: string, settings: any) { return this.userStorage.updateUserSettings(userId, settings); }
  async searchUsers(query: string) { return this.userStorage.searchUsers(query); }
  async getTenantUsers(tenantId: string) { return this.userStorage.getTenantUsers(tenantId); }

  // Library operations - delegate to LibraryStorage
  async getLibraryCategories(gradeLevel?: string) { return this.libraryStorage.getLibraryCategories(gradeLevel); }
  async getLibrarySubjects(gradeLevel?: string, categoryId?: string) { return this.libraryStorage.getLibrarySubjects(gradeLevel, categoryId); }
  async getLibraryResources(filters?: any) { return this.libraryStorage.getLibraryResources(filters); }
  async getLibraryResource(id: string) { return this.libraryStorage.getLibraryResource(id); }
  async createLibraryResource(resource: any) { return this.libraryStorage.createLibraryResource(resource); }
  async updateLibraryResource(id: string, updates: any) { return this.libraryStorage.updateLibraryResource(id, updates); }
  async deleteLibraryResource(id: string) { return this.libraryStorage.deleteLibraryResource(id); }
  async searchLibraryResources(query: string, filters?: any) { return this.libraryStorage.searchLibraryResources(query, filters); }
  async createLibraryResourceAccess(accessData: any) { return this.libraryStorage.createLibraryResourceAccess(accessData); }
  async updateResourceStats(resourceId: string, updateType: 'view' | 'download') { return this.libraryStorage.updateResourceStats(resourceId, updateType); }
  async getResourceCountsBySubject(gradeLevel: string) { return this.libraryStorage.getResourceCountsBySubject(gradeLevel); }

  // CRM operations - delegate to CRMStorage
  async getLeads(filters?: any) { return this.crmStorage.getLeads(filters); }
  async getLead(id: number) { return this.crmStorage.getLead(id); }
  async createLead(lead: any) { return this.crmStorage.createLead(lead); }
  async updateLead(id: number, updates: any) { return this.crmStorage.updateLead(id, updates); }
  async deleteLead(id: number) { return this.crmStorage.deleteLead(id); }
  async getLeadActivities(leadId?: number) { return this.crmStorage.getLeadActivities(leadId); }
  async createLeadActivity(activity: any) { return this.crmStorage.createLeadActivity(activity); }
  async getDemoRequests(filters?: any) { return this.crmStorage.getDemoRequests(filters); }
  async getDemoRequest(id: number) { return this.crmStorage.getDemoRequest(id); }
  async createDemoRequest(demo: any) { return this.crmStorage.createDemoRequest(demo); }
  async updateDemoRequest(id: number, updates: any) { return this.crmStorage.updateDemoRequest(id, updates); }

  // Security operations - delegate to SecurityStorage
  async getSecurityZones() { return this.securityStorage.getSecurityZones(); }
  async createSecurityZone(zone: any) { return this.securityStorage.createSecurityZone(zone); }
  async getSecurityCamerasByZone(zoneId: string) { return this.securityStorage.getSecurityCamerasByZone(zoneId); }
  async getSecurityCameras() { return this.securityStorage.getSecurityCameras(); }
  async createSecurityCamera(camera: any) { return this.securityStorage.createSecurityCamera(camera); }
  async getSecurityEvents(filters?: any) { return this.securityStorage.getSecurityEvents(filters); }
  async createSecurityEvent(event: any) { return this.securityStorage.createSecurityEvent(event); }
  async updateSecurityEvent(id: string, updates: any) { return this.securityStorage.updateSecurityEvent(id, updates); }
  async getVisitorRegistrations(filters?: any) { return this.securityStorage.getVisitorRegistrations(filters); }
  async createVisitorRegistration(registration: any) { return this.securityStorage.createVisitorRegistration(registration); }
  async checkoutVisitor(id: string) { return this.securityStorage.checkoutVisitor(id); }
  async getSecurityCalls(filters?: any) { return this.securityStorage.getSecurityCalls(filters); }
  async createSecurityCall(call: any) { return this.securityStorage.createSecurityCall(call); }
  async getSecurityMetrics() { return this.securityStorage.getSecurityMetrics(); }
  async getActiveThreats() { return this.securityStorage.getActiveThreats(); }

  // Live session operations (stub implementations)
  async registerDevice(sessionId: string, deviceData: any): Promise<any> { return { id: `device_${Date.now()}`, ...deviceData }; }
  async startScreenSharing(sessionId: string, data: any): Promise<any> { return { id: `screen_${Date.now()}`, ...data }; }
  async stopScreenSharing(sessionId: string): Promise<void> { console.log(`Stopped screen sharing for session ${sessionId}`); }
  async updateDeviceHeartbeat(deviceId: string): Promise<void> { console.log(`Updated heartbeat for device ${deviceId}`); }
  async getLiveSessionsByTeacher(teacherId: string): Promise<any[]> { return []; }
  async getSessionDevices(sessionId: string): Promise<any[]> { return []; }
  async getActiveScreenSharing(sessionId: string): Promise<any[]> { return []; }
  async updateDeviceControlStatus(deviceId: string, status: any): Promise<void> { console.log(`Updated device ${deviceId} status`); }

  // Calendar operations (stub implementations)
  async getEventsForUser(userId: string, filters?: any): Promise<any[]> { return []; }
  async getUpcomingEventsForUser(userId: string): Promise<any[]> { return []; }
  async getEvent(id: string): Promise<any> { return null; }
  async createEvent(event: any): Promise<any> { return { id: `event_${Date.now()}`, ...event }; }
  async updateEvent(id: string, updates: any): Promise<any> { return { id, ...updates }; }
  async deleteEvent(id: string): Promise<void> { console.log(`Deleted event ${id}`); }
  async updateParticipantRSVP(eventId: string, userId: string, status: string): Promise<void> { console.log(`Updated RSVP for ${userId}`); }
  async getEventsRequiringApproval(): Promise<any[]> { return []; }
  async getUserEventConflicts(userId: string, startTime: Date, endTime: Date): Promise<any[]> { return []; }
  async getEventsByDateRange(startDate: Date, endDate: Date, userId?: string): Promise<any[]> { return []; }

  // Analytics and notification operations (stub implementations)
  async getAnalytics(filters?: any): Promise<any> { return { totalUsers: 0, totalResources: 0 }; }
  async recordAnalyticEvent(event: any): Promise<void> { console.log(`Recorded analytics event:`, event); }
  async getActivityLogs(userId?: string, limit?: number): Promise<any[]> { return []; }
  async recordActivity(activity: any): Promise<void> { console.log(`Recorded activity:`, activity); }
  async getNotifications(userId: string): Promise<any[]> { return []; }
  async createNotification(notification: any): Promise<any> { return { id: `notification_${Date.now()}`, ...notification }; }
  async markNotificationRead(id: string): Promise<void> { console.log(`Marked notification ${id} as read`); }
  async deleteNotification(id: string): Promise<void> { console.log(`Deleted notification ${id}`); }
}

// Export types
export * from "./types";
export { UserStorage } from "./userStorage";
export { LibraryStorage } from "./libraryStorage";
export { CRMStorage } from "./crmStorage";
export { SecurityStorage } from "./securityStorage";