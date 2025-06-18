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
        riskLevel: "high",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "zone_002", 
        name: "Cafeteria",
        description: "Student dining and common area",
        location: "Building B - First Floor",
        isActive: true,
        riskLevel: "medium",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "zone_003",
        name: "Library",
        description: "Study area and resource center",
        location: "Building C - Second Floor", 
        isActive: true,
        riskLevel: "low",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getSecurityCameras(zoneId?: string): Promise<SecurityCamera[]> {
    const allCameras = [
      {
        id: "cam_001",
        name: "Main Gate Camera 1",
        createdAt: new Date(),
        updatedAt: new Date(),
        orientation: "north",
        zoneId: "zone_001",
        ipAddress: "192.168.1.101",
        streamUrl: "https://demo.stream/cam1",
        isOnline: true,
        isRecording: true,
        resolution: "1080p",
        lastPing: new Date()
      },
      {
        id: "cam_002", 
        name: "Reception Camera",
        createdAt: new Date(),
        updatedAt: new Date(),
        orientation: "south",
        zoneId: "zone_001",
        ipAddress: "192.168.1.102",
        streamUrl: "https://demo.stream/cam2",
        isOnline: true,
        isRecording: true,
        resolution: "720p",
        lastPing: new Date()
      },
      {
        id: "cam_003",
        name: "Cafeteria Overview",
        createdAt: new Date(),
        updatedAt: new Date(),
        orientation: "center",
        zoneId: "zone_002",
        ipAddress: "192.168.1.103",
        streamUrl: "https://demo.stream/cam3", 
        isOnline: false,
        isRecording: false,
        resolution: "1080p",
        lastPing: new Date(Date.now() - 3600000)
      }
    ];

    return zoneId ? allCameras.filter(cam => cam.zoneId === zoneId) : allCameras;
  }

  async getSecurityEvents(filters?: { zoneId?: string; severity?: string }): Promise<SecurityEvent[]> {
    const allEvents = [
      {
        id: "event_001",
        type: "unauthorized_access",
        severity: "high",
        title: "Unauthorized Entry Detected",
        description: "Motion detected in restricted area after hours",
        zoneId: "zone_001",
        cameraId: "cam_001",
        createdAt: new Date(Date.now() - 1800000),
        updatedAt: new Date(Date.now() - 1800000),
        status: "active",
        assignedTo: null,
        resolvedAt: null,
        alertTriggered: true,
        responseTime: null,
        incidentId: null,
        priority: "high",
        videoUrl: null,
        metadata: {},
        reportedBy: "system",
        occurredAt: new Date(Date.now() - 1800000),
        detectedAt: new Date(Date.now() - 1800000),
        imageUrl: null
      },
      {
        id: "event_002",
        type: "system_alert",
        severity: "medium",
        title: "Camera Offline",
        description: "Cafeteria camera lost connection",
        zoneId: "zone_002", 
        cameraId: "cam_003",
        createdAt: new Date(Date.now() - 3600000),
        updatedAt: new Date(Date.now() - 3600000),
        status: "acknowledged",
        assignedTo: null,
        resolvedAt: null,
        alertTriggered: true,
        responseTime: null,
        incidentId: null,
        priority: "medium",
        videoUrl: null,
        metadata: {},
        reportedBy: "system",
        occurredAt: new Date(Date.now() - 3600000),
        detectedAt: new Date(Date.now() - 3600000),
        imageUrl: null
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
        visitorName: "John Smith",
        visitorPhone: "+1234567890",
        visitorEmail: "john.smith@example.com",
        visitPurpose: "Parent Meeting",
        hostName: "Ms. Johnson",
        hostDepartment: "Grade 3",
        expectedDuration: 60,
        arrivalTime: new Date(Date.now() - 7200000),
        departureTime: null,
        badgeNumber: "V001",
        vehiclePlate: null,
        emergencyContact: "+1234567890",
        isVaccinated: true,
        status: "checked_in",
        securityNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
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
      cameraId: eventData.cameraId || null,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: null,
      resolvedAt: null,
      alertTriggered: true,
      responseTime: null,
      incidentId: null,
      priority: eventData.severity || "medium",
      videoUrl: null,
      metadata: {},
      reportedBy: "system",
      occurredAt: new Date(),
      detectedAt: new Date(),
      imageUrl: null
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