// Security module service - completely isolated
import { SecurityMetrics, ThreatAlert } from "@shared/types/security.types";
import { SecurityZone, SecurityCamera, SecurityEvent, VisitorRegistration, SecurityCall } from "@shared/schema";

export class SecurityService {
  private static instance: SecurityService;

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  async getSecurityZones(): Promise<SecurityZone[]> {
    // Mock data for demonstration - replace with actual database calls
    return [
      {
        id: "zone_001",
        name: "Main Entrance",
        description: "Primary school entrance and reception area",
        location: "Building A - Ground Floor",
        isActive: true,
        cameraCount: 4,
        lastActivity: new Date()
      },
      {
        id: "zone_002", 
        name: "Cafeteria",
        description: "Student dining and common area",
        location: "Building B - First Floor",
        isActive: true,
        cameraCount: 6,
        lastActivity: new Date()
      },
      {
        id: "zone_003",
        name: "Library",
        description: "Study area and resource center",
        location: "Building C - Second Floor", 
        isActive: true,
        cameraCount: 3,
        lastActivity: new Date()
      }
    ];
  }

  async getSecurityCameras(zoneId?: string): Promise<SecurityCamera[]> {
    const allCameras = [
      {
        id: "cam_001",
        name: "Main Gate Camera 1",
        zoneId: "zone_001",
        location: "North Entrance",
        status: "online" as const,
        streamUrl: "https://demo.stream/cam1",
        isRecording: true,
        lastPing: new Date()
      },
      {
        id: "cam_002", 
        name: "Reception Camera",
        zoneId: "zone_001",
        location: "Reception Desk",
        status: "online" as const,
        streamUrl: "https://demo.stream/cam2",
        isRecording: true,
        lastPing: new Date()
      },
      {
        id: "cam_003",
        name: "Cafeteria Overview",
        zoneId: "zone_002",
        location: "Center Ceiling",
        status: "offline" as const,
        streamUrl: "https://demo.stream/cam3", 
        isRecording: false,
        lastPing: new Date(Date.now() - 3600000)
      }
    ];

    return zoneId ? allCameras.filter(cam => cam.zoneId === zoneId) : allCameras;
  }

  async getSecurityEvents(filters?: { zoneId?: string; severity?: string }): Promise<SecurityEvent[]> {
    const allEvents = [
      {
        id: "event_001",
        type: "unauthorized_access" as const,
        severity: "high" as const,
        title: "Unauthorized Entry Detected",
        description: "Motion detected in restricted area after hours",
        zoneId: "zone_001",
        cameraId: "cam_001",
        timestamp: new Date(Date.now() - 1800000),
        status: "active" as const
      },
      {
        id: "event_002",
        type: "system_alert" as const,
        severity: "medium" as const,
        title: "Camera Offline",
        description: "Cafeteria camera lost connection",
        zoneId: "zone_002", 
        cameraId: "cam_003",
        timestamp: new Date(Date.now() - 3600000),
        status: "acknowledged" as const
      }
    ];

    let filteredEvents = allEvents;
    if (filters?.zoneId) {
      filteredEvents = filteredEvents.filter(event => event.zoneId === filters.zoneId);
    }
    if (filters?.severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === filters.severity);
    }

    return filteredEvents;
  }

  async getVisitorRegistrations(): Promise<VisitorRegistration[]> {
    return [
      {
        id: "visitor_001",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@example.com",
        phone: "+1234567890",
        purpose: "Parent Meeting",
        hostName: "Ms. Johnson",
        department: "Grade 3",
        checkInTime: new Date(Date.now() - 7200000),
        status: "checked_in" as const,
        badgeNumber: "V001"
      }
    ];
  }

  async getSecurityCalls(): Promise<SecurityCall[]> {
    return [
      {
        id: "call_001",
        type: "emergency" as const,
        caller: "Security Desk",
        location: "Main Entrance",
        description: "Medical emergency in lobby",
        priority: "critical" as const,
        timestamp: new Date(Date.now() - 900000),
        status: "in_progress" as const,
        assignedTo: "Nurse Station"
      }
    ];
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    return {
      totalZones: 3,
      activeCameras: 2,
      totalEvents: 2,
      activeVisitors: 1,
      threatsDetected: 1,
      systemStatus: "online" as const
    };
  }

  async createSecurityEvent(eventData: Partial<SecurityEvent>): Promise<SecurityEvent> {
    const newEvent: SecurityEvent = {
      id: `event_${Date.now()}`,
      type: eventData.type || "system_alert",
      severity: eventData.severity || "medium",
      title: eventData.title || "New Security Event",
      description: eventData.description || "",
      zoneId: eventData.zoneId || "zone_001",
      timestamp: new Date(),
      status: "active",
      ...eventData
    };
    return newEvent;
  }

  async createVisitorRegistration(visitorData: Partial<VisitorRegistration>): Promise<VisitorRegistration> {
    const newVisitor: VisitorRegistration = {
      id: `visitor_${Date.now()}`,
      firstName: visitorData.firstName || "",
      lastName: visitorData.lastName || "",
      purpose: visitorData.purpose || "",
      hostName: visitorData.hostName || "",
      department: visitorData.department || "",
      checkInTime: new Date(),
      status: "checked_in",
      badgeNumber: `V${String(Date.now()).slice(-3)}`,
      ...visitorData
    };
    return newVisitor;
  }

  async createSecurityCall(callData: Partial<SecurityCall>): Promise<SecurityCall> {
    const newCall: SecurityCall = {
      id: `call_${Date.now()}`,
      type: callData.type || "routine",
      caller: callData.caller || "Anonymous",
      location: callData.location || "Unknown",
      description: callData.description || "",
      priority: callData.priority || "medium",
      timestamp: new Date(),
      status: "open",
      ...callData
    };
    return newCall;
  }
}