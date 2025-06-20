import { ISecurityStorage } from "./types";

export class SecurityStorage implements ISecurityStorage {
  async getSecurityZones(): Promise<any[]> {
    return [
      { id: 'main_entrance', name: 'Main Entrance', type: 'entrance', cameras: 2, status: 'active' },
      { id: 'library', name: 'Library', type: 'indoor', cameras: 3, status: 'active' },
      { id: 'playground', name: 'Playground', type: 'outdoor', cameras: 4, status: 'active' }
    ];
  }

  async createSecurityZone(zone: any): Promise<any> {
    return { id: `zone_${Date.now()}`, ...zone, createdAt: new Date() };
  }

  async getSecurityCamerasByZone(zoneId: string): Promise<any[]> {
    return [
      { id: `cam_${zoneId}_1`, name: `Camera 1 - ${zoneId}`, status: 'online', zoneId }
    ];
  }

  async getSecurityCameras(): Promise<any[]> {
    return [
      { id: 'cam_1', name: 'Main Gate Camera', zoneId: 'main_entrance', status: 'online' },
      { id: 'cam_2', name: 'Library Camera 1', zoneId: 'library', status: 'online' }
    ];
  }

  async createSecurityCamera(camera: any): Promise<any> {
    return { id: `cam_${Date.now()}`, ...camera, createdAt: new Date() };
  }

  async getSecurityEvents(filters?: any): Promise<any[]> {
    return [
      { id: 'evt_1', type: 'motion_detected', zoneId: 'main_entrance', timestamp: new Date(), severity: 'low' }
    ];
  }

  async createSecurityEvent(event: any): Promise<any> {
    return { id: `evt_${Date.now()}`, ...event, timestamp: new Date() };
  }

  async updateSecurityEvent(id: string, updates: any): Promise<any> {
    return { id, ...updates, updatedAt: new Date() };
  }

  async getVisitorRegistrations(filters?: any): Promise<any[]> {
    return [
      { id: 'vis_1', name: 'John Smith', purpose: 'Parent Meeting', checkedIn: new Date(), status: 'active' }
    ];
  }

  async createVisitorRegistration(registration: any): Promise<any> {
    return { id: `vis_${Date.now()}`, ...registration, checkedIn: new Date() };
  }

  async checkoutVisitor(id: string): Promise<any> {
    return { id, checkedOut: new Date(), status: 'checked_out' };
  }

  async getSecurityCalls(filters?: any): Promise<any[]> {
    return [
      { id: 'call_1', caller: 'Security Guard 1', type: 'assistance', timestamp: new Date(), status: 'resolved' }
    ];
  }

  async createSecurityCall(call: any): Promise<any> {
    return { id: `call_${Date.now()}`, ...call, timestamp: new Date() };
  }

  async getSecurityMetrics(): Promise<any> {
    return {
      totalZones: 5,
      activeCameras: 12,
      totalCameras: 15,
      recentEvents: 8,
      activeVisitors: 3
    };
  }

  async getActiveThreats(): Promise<any[]> {
    return [
      { id: 'threat_1', type: 'unauthorized_access', zoneId: 'library', severity: 'medium', timestamp: new Date() }
    ];
  }
}