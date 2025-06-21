import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../../replitAuth";

export function registerDeviceRoutes(app: Express) {
  // Get all devices
  app.get('/api/it/devices', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const devices = Array.from({ length: 24 }, (_, i) => ({
        id: `device_${i + 1}`,
        name: `${['Lab-PC', 'Student-Laptop', 'Teacher-Tablet', 'Office-Desktop'][Math.floor(Math.random() * 4)]}-${String(i + 1).padStart(3, '0')}`,
        type: ['desktop', 'laptop', 'tablet', 'mobile'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.2 ? 'online' : Math.random() > 0.5 ? 'offline' : 'maintenance',
        location: ['Computer Lab A', 'Computer Lab B', 'Library', 'Classroom 101', 'Classroom 102', 'Staff Office', 'Principal Office'][Math.floor(Math.random() * 7)],
        zone: ['academic_zone', 'administrative_zone', 'library_zone', 'lab_zone'][Math.floor(Math.random() * 4)],
        user: `user_${i + 1}@school.edu`,
        ip: `192.168.1.${i + 10}`,
        os: ['Windows 11', 'macOS Ventura', 'Ubuntu 22.04', 'Chrome OS'][Math.floor(Math.random() * 4)],
        lastSeen: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        policies: ['basic_security', 'web_filtering', Math.random() > 0.5 ? 'exam_mode' : 'standard_mode'].slice(0, Math.floor(Math.random() * 3) + 1),
        isLocked: Math.random() > 0.85
      }));

      res.json({ devices });
    } catch (error) {
      console.error('Error fetching devices:', error);
      res.status(500).json({ message: 'Failed to fetch devices' });
    }
  });

  // Get device groups
  app.get('/api/it/device-groups', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const groups = [
        {
          id: 'group_1',
          name: 'Computer Lab A',
          description: 'Main computer laboratory for programming classes',
          devices: ['device_1', 'device_2', 'device_3', 'device_4', 'device_5'],
          zone: 'lab_zone',
          policies: ['basic_security', 'development_tools', 'web_filtering'],
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        },
        {
          id: 'group_2',
          name: 'Administrative Workstations',
          description: 'Office computers for administrative staff',
          devices: ['device_6', 'device_7', 'device_8'],
          zone: 'administrative_zone',
          policies: ['basic_security', 'office_suite', 'restricted_internet'],
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true
        }
      ];

      res.json({ groups });
    } catch (error) {
      console.error('Error fetching device groups:', error);
      res.status(500).json({ message: 'Failed to fetch device groups' });
    }
  });

  // Update device policy
  app.post('/api/it/devices/:deviceId/policy', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.params;
      const { policies } = req.body;

      // Simulate policy update
      res.json({ 
        success: true, 
        message: `Policies updated for device ${deviceId}`,
        appliedPolicies: policies
      });
    } catch (error) {
      console.error('Error updating device policy:', error);
      res.status(500).json({ message: 'Failed to update device policy' });
    }
  });

  // Lock/unlock device
  app.post('/api/it/devices/:deviceId/lock', isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { deviceId } = req.params;
      const { action } = req.body; // 'lock' or 'unlock'

      res.json({ 
        success: true, 
        message: `Device ${deviceId} ${action}ed successfully`,
        newStatus: action === 'lock' ? 'locked' : 'unlocked'
      });
    } catch (error) {
      console.error('Error updating device lock status:', error);
      res.status(500).json({ message: 'Failed to update device lock status' });
    }
  });
}