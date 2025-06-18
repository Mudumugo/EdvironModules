import {
  users,
  userSettings,
  type User,
  type UpsertUser,
  type UserSettings,
  type InsertUserSettings,
  liveSessions,
  type LiveSession,
  type InsertLiveSession,
  sessionParticipants,
  type SessionParticipant,
  type InsertSessionParticipant,
  deviceSessions,
  type DeviceSession,
  type InsertDeviceSession,
  screenSharingSessions,
  type ScreenSharingSession,
  type InsertScreenSharingSession,
  deviceControlActions,
  type DeviceControlAction,
  type InsertDeviceControlAction,
  calendarEvents,
  type CalendarEvent,
  type InsertCalendarEvent,
  eventParticipants,
  type EventParticipant,
  type InsertEventParticipant,
  eventRoleTargets,
  type EventRoleTarget,
  type InsertEventRoleTarget,
  eventReminders,
  type EventReminder,
  type InsertEventReminder,
  eventTemplates,
  type EventTemplate,
  type InsertEventTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, lte, gte, isNotNull, desc, asc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User>;
  setGradeRollover(userId: string, rolloverDate: Date, nextGradeLevel: string): Promise<User>;
  processGradeRollovers(): Promise<User[]>;
  getUsersByRole(role: string, tenantId?: string): Promise<User[]>;
  getUsersByTenant(tenantId: string): Promise<User[]>;
  
  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;

  // Security operations
  getSecurityZones(): Promise<any[]>;
  createSecurityZone(data: any): Promise<any>;
  getSecurityCameras(): Promise<any[]>;
  getSecurityCamerasByZone(zoneId: string): Promise<any[]>;
  createSecurityCamera(data: any): Promise<any>;
  getSecurityEvents(filters: any): Promise<any[]>;
  createSecurityEvent(data: any): Promise<any>;
  updateSecurityEvent(eventId: string, data: any): Promise<any>;
  getVisitorRegistrations(filters: any): Promise<any[]>;
  createVisitorRegistration(data: any): Promise<any>;
  checkoutVisitor(visitorId: string): Promise<any>;
  getSecurityCalls(filters: any): Promise<any[]>;
  createSecurityCall(data: any): Promise<any>;
  getSecurityMetrics(): Promise<any>;
  getActiveThreats(): Promise<any[]>;

  // Live session operations
  createLiveSession(session: InsertLiveSession): Promise<LiveSession>;
  updateLiveSession(sessionId: string, updates: Partial<LiveSession>): Promise<LiveSession>;
  getLiveSession(sessionId: string): Promise<LiveSession | undefined>;
  getLiveSessionsByTeacher(teacherId: string): Promise<LiveSession[]>;
  getActiveLiveSessions(tenantId?: string): Promise<LiveSession[]>;
  deleteLiveSession(sessionId: string): Promise<void>;

  // Session participants
  addSessionParticipant(participant: InsertSessionParticipant): Promise<SessionParticipant>;
  updateParticipantStatus(participantId: string, status: string): Promise<SessionParticipant>;
  getSessionParticipants(sessionId: string): Promise<SessionParticipant[]>;
  removeSessionParticipant(participantId: string): Promise<void>;

  // Device management
  registerDevice(device: InsertDeviceSession): Promise<DeviceSession>;
  updateDeviceStatus(deviceId: string, status: string): Promise<DeviceSession>;
  getSessionDevices(sessionId: string): Promise<DeviceSession[]>;
  getDevicesByUser(userId: string): Promise<DeviceSession[]>;
  updateDeviceHeartbeat(deviceId: string): Promise<void>;

  // Screen sharing
  startScreenSharing(screenShare: InsertScreenSharingSession): Promise<ScreenSharingSession>;
  stopScreenSharing(screenShareId: string): Promise<void>;
  getActiveScreenSharing(sessionId: string): Promise<ScreenSharingSession | undefined>;
  updateScreenSharingViewers(screenShareId: string, viewers: string[]): Promise<ScreenSharingSession>;

  // Device control
  createDeviceControlAction(action: InsertDeviceControlAction): Promise<DeviceControlAction>;
  updateDeviceControlStatus(actionId: string, status: string, responseData?: any): Promise<DeviceControlAction>;
  getDeviceControlActions(sessionId: string): Promise<DeviceControlAction[]>;
  getPendingControlActions(deviceId: string): Promise<DeviceControlAction[]>;

  // Calendar operations
  createEvent(eventData: InsertCalendarEvent): Promise<CalendarEvent>;
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent>;
  getEvent(eventId: string): Promise<CalendarEvent | undefined>;
  getEventsForUser(userId: string, startDate: Date, endDate: Date, tenantId?: string): Promise<CalendarEvent[]>;
  getEventsByDateRange(startDate: Date, endDate: Date, tenantId?: string): Promise<CalendarEvent[]>;
  deleteEvent(eventId: string): Promise<void>;
  
  // Event participants
  addEventParticipant(participant: InsertEventParticipant): Promise<EventParticipant>;
  updateParticipantRSVP(participantId: string, rsvpStatus: string, response?: string): Promise<EventParticipant>;
  getEventParticipants(eventId: string): Promise<EventParticipant[]>;
  removeEventParticipant(participantId: string): Promise<void>;
  
  // Event role targets
  addEventRoleTarget(roleTarget: InsertEventRoleTarget): Promise<EventRoleTarget>;
  getEventRoleTargets(eventId: string): Promise<EventRoleTarget[]>;
  removeEventRoleTarget(roleTargetId: string): Promise<void>;
  
  // Event templates
  createEventTemplate(template: InsertEventTemplate): Promise<EventTemplate>;
  getEventTemplates(tenantId: string): Promise<EventTemplate[]>;
  updateEventTemplate(templateId: string, updates: Partial<EventTemplate>): Promise<EventTemplate>;
  deleteEventTemplate(templateId: string): Promise<void>;
  
  // Advanced calendar queries
  getUpcomingEventsForUser(userId: string, limit: number): Promise<CalendarEvent[]>;
  getEventsRequiringApproval(tenantId: string): Promise<CalendarEvent[]>;
  getUserEventConflicts(userId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(userId: string, role: string, gradeLevel?: string, department?: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        role,
        gradeLevel,
        department,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async setGradeRollover(userId: string, rolloverDate: Date, nextGradeLevel: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async processGradeRollovers(): Promise<User[]> {
    // Grade rollover functionality to be implemented when schema includes rollover fields
    return [];
  }

  async getUsersByRole(role: string, tenantId?: string): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByTenant(tenantId: string): Promise<User[]> {
    return await db.select().from(users);
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settingsData: InsertUserSettings): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(settingsData)
      .onConflictDoUpdate({
        target: userSettings.id,
        set: {
          ...settingsData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  // Security operations implementation
  async getSecurityZones(): Promise<any[]> {
    return [
      {
        id: "zone_001",
        name: "Main Entrance",
        description: "Primary school entrance and reception area",
        location: "Building A - Ground Floor",
        isActive: true,
        riskLevel: "high",
        cameraCount: 3,
        lastIncident: "2024-06-17T10:30:00Z",
      },
      {
        id: "zone_002", 
        name: "Playground",
        description: "Outdoor playground and sports area",
        location: "Outdoor - East Side",
        isActive: true,
        riskLevel: "medium",
        cameraCount: 5,
        lastIncident: null,
      },
      {
        id: "zone_003",
        name: "Parking Lot",
        description: "Staff and visitor parking area",
        location: "Outdoor - North Side",
        isActive: true,
        riskLevel: "low",
        cameraCount: 2,
        lastIncident: "2024-06-15T14:20:00Z",
      },
      {
        id: "zone_004",
        name: "Laboratory Wing",
        description: "Science laboratories and equipment storage",
        location: "Building B - Second Floor",
        isActive: true,
        riskLevel: "medium",
        cameraCount: 4,
        lastIncident: null,
      }
    ];
  }

  async createSecurityZone(data: any): Promise<any> {
    return {
      id: `zone_${Date.now()}`,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getSecurityCameras(): Promise<any[]> {
    return [
      {
        id: "cam_001",
        name: "Main Entrance Camera 1",
        zoneId: "zone_001",
        zoneName: "Main Entrance",
        ipAddress: "192.168.1.101",
        streamUrl: "rtsp://192.168.1.101:554/stream1",
        isOnline: true,
        isRecording: true,
        resolution: "1080p",
        orientation: "horizontal",
        hasAudio: true,
        lastPing: new Date().toISOString(),
      },
      {
        id: "cam_002",
        name: "Playground Overview",
        zoneId: "zone_002",
        zoneName: "Playground",
        ipAddress: "192.168.1.102",
        streamUrl: "rtsp://192.168.1.102:554/stream1",
        isOnline: true,
        isRecording: true,
        resolution: "4K",
        orientation: "horizontal",
        hasAudio: false,
        lastPing: new Date().toISOString(),
      },
      {
        id: "cam_003",
        name: "Parking Entrance",
        zoneId: "zone_003",
        zoneName: "Parking Lot",
        ipAddress: "192.168.1.103",
        streamUrl: "rtsp://192.168.1.103:554/stream1",
        isOnline: false,
        isRecording: false,
        resolution: "720p",
        orientation: "horizontal",
        hasAudio: false,
        lastPing: "2024-06-17T08:30:00Z",
      }
    ];
  }

  async getSecurityCamerasByZone(zoneId: string): Promise<any[]> {
    const cameras = await this.getSecurityCameras();
    return cameras.filter(camera => camera.zoneId === zoneId);
  }

  async createSecurityCamera(data: any): Promise<any> {
    return {
      id: `cam_${Date.now()}`,
      ...data,
      isOnline: false,
      isRecording: false,
      lastPing: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getSecurityEvents(filters: any): Promise<any[]> {
    const events = [
      {
        id: "event_001",
        type: "intrusion",
        severity: "high",
        status: "investigating",
        zoneId: "zone_001",
        zoneName: "Main Entrance",
        cameraId: "cam_001",
        cameraName: "Main Entrance Camera 1",
        description: "Unauthorized person detected after hours",
        detectedAt: "2024-06-17T22:30:00Z",
        resolvedAt: null,
        assignedTo: "Security Officer Johnson",
        imageUrl: "/security/captures/event_001.jpg",
        metadata: { confidence: 0.92, personCount: 1 },
      },
      {
        id: "event_002",
        type: "suspicious_activity",
        severity: "medium",
        status: "resolved",
        zoneId: "zone_002",
        zoneName: "Playground",
        cameraId: "cam_002",
        cameraName: "Playground Overview",
        description: "Individual loitering in playground area",
        detectedAt: "2024-06-17T18:45:00Z",
        resolvedAt: "2024-06-17T19:15:00Z",
        assignedTo: "Security Officer Smith",
        imageUrl: "/security/captures/event_002.jpg",
        metadata: { confidence: 0.78, personCount: 1 },
      },
      {
        id: "event_003",
        type: "vandalism",
        severity: "medium",
        status: "active",
        zoneId: "zone_003",
        zoneName: "Parking Lot",
        cameraId: "cam_003",
        cameraName: "Parking Entrance",
        description: "Damage to vehicle detected",
        detectedAt: "2024-06-17T15:20:00Z",
        resolvedAt: null,
        assignedTo: null,
        imageUrl: "/security/captures/event_003.jpg",
        metadata: { confidence: 0.85, damaged_vehicles: 1 },
      }
    ];

    let filteredEvents = events;
    if (filters.status) {
      filteredEvents = filteredEvents.filter(event => event.status === filters.status);
    }
    if (filters.severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === filters.severity);
    }
    if (filters.zoneId) {
      filteredEvents = filteredEvents.filter(event => event.zoneId === filters.zoneId);
    }

    return filteredEvents.slice(0, filters.limit || 50);
  }

  async createSecurityEvent(data: any): Promise<any> {
    return {
      id: `event_${Date.now()}`,
      ...data,
      status: "active",
      detectedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async updateSecurityEvent(eventId: string, data: any): Promise<any> {
    return {
      id: eventId,
      ...data,
      updatedAt: new Date().toISOString(),
    };
  }

  async getVisitorRegistrations(filters: any): Promise<any[]> {
    const registrations = [
      {
        id: "visitor_001",
        visitorName: "John Smith",
        visitorPhone: "+1-555-0123",
        visitorEmail: "john.smith@example.com",
        visitPurpose: "Parent Meeting",
        hostName: "Ms. Johnson",
        hostDepartment: "Grade 3",
        checkInTime: "2024-06-18T09:30:00Z",
        checkOutTime: null,
        expectedDuration: 60,
        status: "checked_in",
        idType: "drivers_license",
        idNumber: "DL123456789",
        badgeNumber: "V001",
        gateUsed: "Main Gate",
        securityNotes: "Visitor verified, ID checked",
      },
      {
        id: "visitor_002",
        visitorName: "Sarah Wilson",
        visitorPhone: "+1-555-0456",
        visitorEmail: "sarah.wilson@contractor.com",
        visitPurpose: "Equipment Maintenance",
        hostName: "Facilities Manager",
        hostDepartment: "Maintenance",
        checkInTime: "2024-06-18T08:00:00Z",
        checkOutTime: "2024-06-18T12:30:00Z",
        expectedDuration: 240,
        status: "checked_out",
        idType: "company_id",
        idNumber: "CONT789",
        badgeNumber: "V002",
        gateUsed: "Service Gate",
        securityNotes: "Contractor with proper credentials",
      }
    ];

    let filteredRegistrations = registrations;
    if (filters.status) {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === filters.status);
    }
    if (filters.date) {
      const filterDate = new Date(filters.date).toDateString();
      filteredRegistrations = filteredRegistrations.filter(reg => 
        new Date(reg.checkInTime).toDateString() === filterDate
      );
    }

    return filteredRegistrations;
  }

  async createVisitorRegistration(data: any): Promise<any> {
    return {
      id: `visitor_${Date.now()}`,
      ...data,
      checkInTime: new Date().toISOString(),
      status: "checked_in",
      badgeNumber: `V${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async checkoutVisitor(visitorId: string): Promise<any> {
    return {
      id: visitorId,
      checkOutTime: new Date().toISOString(),
      status: "checked_out",
      updatedAt: new Date().toISOString(),
    };
  }

  async getSecurityCalls(filters: any): Promise<any[]> {
    const calls = [
      {
        id: "call_001",
        callType: "emergency",
        fromExtension: "3001",
        toExtension: "3000",
        fromZone: "zone_001",
        toZone: null,
        duration: 185,
        status: "completed",
        priority: "emergency",
        notes: "Medical emergency reported in main entrance",
        startedAt: "2024-06-18T10:15:00Z",
        endedAt: "2024-06-18T10:18:05Z",
      },
      {
        id: "call_002",
        callType: "routine",
        fromExtension: "3002",
        toExtension: "3003",
        fromZone: "zone_002",
        toZone: "zone_004",
        duration: 45,
        status: "completed",
        priority: "normal",
        notes: "Coordination between zones",
        startedAt: "2024-06-18T09:30:00Z",
        endedAt: "2024-06-18T09:30:45Z",
      },
      {
        id: "call_003",
        callType: "maintenance",
        fromExtension: "3004",
        toExtension: "3000",
        fromZone: "zone_003",
        toZone: null,
        duration: null,
        status: "ringing",
        priority: "high",
        notes: "Camera malfunction reported",
        startedAt: "2024-06-18T11:20:00Z",
        endedAt: null,
      }
    ];

    let filteredCalls = calls;
    if (filters.status) {
      filteredCalls = filteredCalls.filter(call => call.status === filters.status);
    }
    if (filters.priority) {
      filteredCalls = filteredCalls.filter(call => call.priority === filters.priority);
    }

    return filteredCalls;
  }

  async createSecurityCall(data: any): Promise<any> {
    return {
      id: `call_${Date.now()}`,
      ...data,
      status: "ringing",
      startedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  }

  async getSecurityMetrics(): Promise<any> {
    return {
      totalZones: 4,
      activeCameras: 8,
      offlineCameras: 2,
      activeEvents: 2,
      resolvedEvents: 15,
      checkedInVisitors: 3,
      todayVisitors: 12,
      emergencyCalls: 1,
      routineCalls: 8,
      riskLevels: {
        low: 1,
        medium: 2,
        high: 1,
        critical: 0
      },
      eventTypes: {
        intrusion: 3,
        suspicious_activity: 8,
        vandalism: 2,
        theft: 1,
        violence: 0
      },
      lastUpdate: new Date().toISOString(),
    };
  }

  async getActiveThreats(): Promise<any[]> {
    return [
      {
        id: "threat_001",
        type: "intrusion",
        severity: "high",
        zone: "Main Entrance",
        description: "Unauthorized access attempt detected",
        detectedAt: "2024-06-18T10:45:00Z",
        confidence: 0.92,
        status: "investigating",
      },
      {
        id: "threat_002",
        type: "suspicious_activity",
        severity: "medium",
        zone: "Parking Lot",
        description: "Individual loitering near vehicles",
        detectedAt: "2024-06-18T11:20:00Z",
        confidence: 0.78,
        status: "monitoring",
      }
    ];
  }

  // Live session operations
  async createLiveSession(sessionData: InsertLiveSession): Promise<LiveSession> {
    const [session] = await db
      .insert(liveSessions)
      .values(sessionData)
      .returning();
    return session;
  }

  async updateLiveSession(sessionId: string, updates: Partial<LiveSession>): Promise<LiveSession> {
    const [session] = await db
      .update(liveSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(liveSessions.id, sessionId))
      .returning();
    return session;
  }

  async getLiveSession(sessionId: string): Promise<LiveSession | undefined> {
    const [session] = await db
      .select()
      .from(liveSessions)
      .where(eq(liveSessions.id, sessionId));
    return session;
  }

  async getLiveSessionsByTeacher(teacherId: string): Promise<LiveSession[]> {
    return await db
      .select()
      .from(liveSessions)
      .where(eq(liveSessions.teacherId, teacherId))
      .orderBy(desc(liveSessions.scheduledTime));
  }

  async getActiveLiveSessions(tenantId?: string): Promise<LiveSession[]> {
    const conditions = [eq(liveSessions.status, "live")];
    if (tenantId) {
      conditions.push(eq(liveSessions.tenantId, tenantId));
    }
    
    return await db
      .select()
      .from(liveSessions)
      .where(and(...conditions))
      .orderBy(asc(liveSessions.scheduledTime));
  }

  async deleteLiveSession(sessionId: string): Promise<void> {
    await db
      .delete(liveSessions)
      .where(eq(liveSessions.id, sessionId));
  }

  // Session participants
  async addSessionParticipant(participantData: InsertSessionParticipant): Promise<SessionParticipant> {
    const [participant] = await db
      .insert(sessionParticipants)
      .values(participantData)
      .returning();
    return participant;
  }

  async updateParticipantStatus(participantId: string, status: string): Promise<SessionParticipant> {
    const [participant] = await db
      .update(sessionParticipants)
      .set({ status, lastActivity: new Date() })
      .where(eq(sessionParticipants.id, participantId))
      .returning();
    return participant;
  }

  async getSessionParticipants(sessionId: string): Promise<SessionParticipant[]> {
    return await db
      .select()
      .from(sessionParticipants)
      .where(eq(sessionParticipants.sessionId, sessionId))
      .orderBy(asc(sessionParticipants.joinedAt));
  }

  async removeSessionParticipant(participantId: string): Promise<void> {
    await db
      .delete(sessionParticipants)
      .where(eq(sessionParticipants.id, participantId));
  }

  // Device management
  async registerDevice(deviceData: InsertDeviceSession): Promise<DeviceSession> {
    const [device] = await db
      .insert(deviceSessions)
      .values(deviceData)
      .returning();
    return device;
  }

  async updateDeviceStatus(deviceId: string, status: string): Promise<DeviceSession> {
    const [device] = await db
      .update(deviceSessions)
      .set({ status, lastHeartbeat: new Date(), updatedAt: new Date() })
      .where(eq(deviceSessions.deviceId, deviceId))
      .returning();
    return device;
  }

  async getSessionDevices(sessionId: string): Promise<DeviceSession[]> {
    return await db
      .select()
      .from(deviceSessions)
      .where(eq(deviceSessions.sessionId, sessionId))
      .orderBy(desc(deviceSessions.lastHeartbeat));
  }

  async getDevicesByUser(userId: string): Promise<DeviceSession[]> {
    return await db
      .select()
      .from(deviceSessions)
      .where(eq(deviceSessions.userId, userId))
      .orderBy(desc(deviceSessions.lastHeartbeat));
  }

  async updateDeviceHeartbeat(deviceId: string): Promise<void> {
    await db
      .update(deviceSessions)
      .set({ lastHeartbeat: new Date() })
      .where(eq(deviceSessions.deviceId, deviceId));
  }

  // Screen sharing
  async startScreenSharing(screenShareData: InsertScreenSharingSession): Promise<ScreenSharingSession> {
    const [screenShare] = await db
      .insert(screenSharingSessions)
      .values(screenShareData)
      .returning();
    return screenShare;
  }

  async stopScreenSharing(screenShareId: string): Promise<void> {
    await db
      .update(screenSharingSessions)
      .set({ isActive: false, endedAt: new Date() })
      .where(eq(screenSharingSessions.id, screenShareId));
  }

  async getActiveScreenSharing(sessionId: string): Promise<ScreenSharingSession | undefined> {
    const [screenShare] = await db
      .select()
      .from(screenSharingSessions)
      .where(and(
        eq(screenSharingSessions.sessionId, sessionId),
        eq(screenSharingSessions.isActive, true)
      ));
    return screenShare;
  }

  async updateScreenSharingViewers(screenShareId: string, viewers: string[]): Promise<ScreenSharingSession> {
    const [screenShare] = await db
      .update(screenSharingSessions)
      .set({ viewers })
      .where(eq(screenSharingSessions.id, screenShareId))
      .returning();
    return screenShare;
  }

  // Device control
  async createDeviceControlAction(actionData: InsertDeviceControlAction): Promise<DeviceControlAction> {
    const [action] = await db
      .insert(deviceControlActions)
      .values(actionData)
      .returning();
    return action;
  }

  async updateDeviceControlStatus(actionId: string, status: string, responseData?: any): Promise<DeviceControlAction> {
    const updateData: any = { status };
    if (status === "executed") {
      updateData.executedAt = new Date();
    }
    if (responseData) {
      updateData.responseData = responseData;
    }

    const [action] = await db
      .update(deviceControlActions)
      .set(updateData)
      .where(eq(deviceControlActions.id, actionId))
      .returning();
    return action;
  }

  async getDeviceControlActions(sessionId: string): Promise<DeviceControlAction[]> {
    return await db
      .select()
      .from(deviceControlActions)
      .where(eq(deviceControlActions.sessionId, sessionId))
      .orderBy(desc(deviceControlActions.createdAt));
  }

  async getPendingControlActions(deviceId: string): Promise<DeviceControlAction[]> {
    return await db
      .select()
      .from(deviceControlActions)
      .where(and(
        eq(deviceControlActions.targetDeviceId, deviceId),
        eq(deviceControlActions.status, "pending")
      ))
      .orderBy(asc(deviceControlActions.createdAt));
  }



  // Calendar operations
  async createEvent(eventData: InsertCalendarEvent): Promise<CalendarEvent> {
    const [event] = await db
      .insert(calendarEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const [event] = await db
      .update(calendarEvents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(calendarEvents.id, eventId))
      .returning();
    return event;
  }

  async getEvent(eventId: string): Promise<CalendarEvent | undefined> {
    const [event] = await db
      .select()
      .from(calendarEvents)
      .where(eq(calendarEvents.id, eventId));
    return event;
  }

  async getEventsForUser(userId: string, startDate: Date, endDate: Date, tenantId?: string): Promise<CalendarEvent[]> {
    // Get user info first to determine their role and permissions
    const user = await this.getUser(userId);
    if (!user) return [];

    // Build conditions for events the user should see
    const conditions = [
      and(
        lte(calendarEvents.startDateTime, endDate),
        gte(calendarEvents.endDateTime, startDate),
        eq(calendarEvents.status, 'active')
      )
    ];

    if (tenantId) {
      conditions.push(eq(calendarEvents.tenantId, tenantId));
    }

    // Get events based on visibility and role
    let events = await db
      .select()
      .from(calendarEvents)
      .where(and(...conditions))
      .orderBy(asc(calendarEvents.startDateTime));

    // Filter events based on user permissions and targeting
    const filteredEvents = [];
    
    for (const event of events) {
      let canView = false;

      // Check visibility
      if (event.visibility === 'public') {
        canView = true;
      } else if (event.visibility === 'private' && event.organizerId === userId) {
        canView = true;
      } else if (event.visibility === 'restricted') {
        // Check if user is targeted or is a participant
        const isParticipant = await db
          .select()
          .from(eventParticipants)
          .where(and(
            eq(eventParticipants.eventId, event.id),
            eq(eventParticipants.userId, userId)
          ))
          .limit(1);

        if (isParticipant.length > 0) {
          canView = true;
        } else {
          // Check role targeting
          const roleTargets = await db
            .select()
            .from(eventRoleTargets)
            .where(eq(eventRoleTargets.eventId, event.id));

          for (const target of roleTargets) {
            if (target.targetType === 'role' && target.targetValue === user.role) {
              canView = true;
              break;
            } else if (target.targetType === 'grade' && target.targetValue === user.gradeLevel) {
              canView = true;
              break;
            } else if (target.targetType === 'department' && target.targetValue === user.department) {
              canView = true;
              break;
            }
          }
        }
      }

      // Check target audience
      if (canView && event.targetAudience !== 'all') {
        if (event.targetAudience === 'staff' && !['teacher', 'admin', 'staff'].includes(user.role)) {
          canView = false;
        } else if (event.targetAudience === 'students' && user.role !== 'student') {
          canView = false;
        } else if (event.targetAudience === 'parents' && user.role !== 'parent') {
          canView = false;
        }
      }

      if (canView) {
        filteredEvents.push(event);
      }
    }

    return filteredEvents;
  }

  async getEventsByDateRange(startDate: Date, endDate: Date, tenantId?: string): Promise<CalendarEvent[]> {
    const conditions = [
      and(
        lte(calendarEvents.startDateTime, endDate),
        gte(calendarEvents.endDateTime, startDate),
        eq(calendarEvents.status, 'active')
      )
    ];

    if (tenantId) {
      conditions.push(eq(calendarEvents.tenantId, tenantId));
    }

    return await db
      .select()
      .from(calendarEvents)
      .where(and(...conditions))
      .orderBy(asc(calendarEvents.startDateTime));
  }

  async deleteEvent(eventId: string): Promise<void> {
    await db
      .delete(calendarEvents)
      .where(eq(calendarEvents.id, eventId));
  }

  // Event participants
  async addEventParticipant(participantData: InsertEventParticipant): Promise<EventParticipant> {
    const [participant] = await db
      .insert(eventParticipants)
      .values(participantData)
      .returning();
    return participant;
  }

  async updateParticipantRSVP(participantId: string, rsvpStatus: string, response?: string): Promise<EventParticipant> {
    const [participant] = await db
      .update(eventParticipants)
      .set({ 
        rsvpStatus, 
        rsvpResponse: response, 
        rsvpAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(eventParticipants.id, participantId))
      .returning();
    return participant;
  }

  async getEventParticipants(eventId: string): Promise<EventParticipant[]> {
    return await db
      .select()
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId))
      .orderBy(asc(eventParticipants.createdAt));
  }

  async removeEventParticipant(participantId: string): Promise<void> {
    await db
      .delete(eventParticipants)
      .where(eq(eventParticipants.id, participantId));
  }

  // Event role targets
  async addEventRoleTarget(roleTargetData: InsertEventRoleTarget): Promise<EventRoleTarget> {
    const [roleTarget] = await db
      .insert(eventRoleTargets)
      .values(roleTargetData)
      .returning();
    return roleTarget;
  }

  async getEventRoleTargets(eventId: string): Promise<EventRoleTarget[]> {
    return await db
      .select()
      .from(eventRoleTargets)
      .where(eq(eventRoleTargets.eventId, eventId));
  }

  async removeEventRoleTarget(roleTargetId: string): Promise<void> {
    await db
      .delete(eventRoleTargets)
      .where(eq(eventRoleTargets.id, roleTargetId));
  }

  // Event templates
  async createEventTemplate(templateData: InsertEventTemplate): Promise<EventTemplate> {
    const [template] = await db
      .insert(eventTemplates)
      .values(templateData)
      .returning();
    return template;
  }

  async getEventTemplates(tenantId: string): Promise<EventTemplate[]> {
    return await db
      .select()
      .from(eventTemplates)
      .where(eq(eventTemplates.tenantId, tenantId))
      .orderBy(asc(eventTemplates.name));
  }

  async updateEventTemplate(templateId: string, updates: Partial<EventTemplate>): Promise<EventTemplate> {
    const [template] = await db
      .update(eventTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(eventTemplates.id, templateId))
      .returning();
    return template;
  }

  async deleteEventTemplate(templateId: string): Promise<void> {
    await db
      .delete(eventTemplates)
      .where(eq(eventTemplates.id, templateId));
  }

  // Advanced calendar queries
  async getUpcomingEventsForUser(userId: string, limit: number = 10): Promise<CalendarEvent[]> {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const events = await this.getEventsForUser(userId, now, oneWeekFromNow);
    return events.slice(0, limit);
  }

  async getEventsRequiringApproval(tenantId: string): Promise<CalendarEvent[]> {
    return await db
      .select()
      .from(calendarEvents)
      .where(and(
        eq(calendarEvents.tenantId, tenantId),
        eq(calendarEvents.approvalStatus, 'pending')
      ))
      .orderBy(asc(calendarEvents.createdAt));
  }

  async getUserEventConflicts(userId: string, startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    // Get all events where user is a participant during the specified time
    const userEvents = await db
      .select({ event: calendarEvents })
      .from(calendarEvents)
      .innerJoin(eventParticipants, eq(eventParticipants.eventId, calendarEvents.id))
      .where(and(
        eq(eventParticipants.userId, userId),
        lte(calendarEvents.startDateTime, endDate),
        gte(calendarEvents.endDateTime, startDate),
        eq(calendarEvents.status, 'active')
      ));

    return userEvents.map(row => row.event);
  }
}

export const storage = new DatabaseStorage();