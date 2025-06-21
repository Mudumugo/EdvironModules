import type { Express, Response } from "express";
import { isAuthenticated } from "../../replitAuth";
import { requirePermission } from "../../roleMiddleware";

export function registerPBXCoreRoutes(app: Express) {
  // User-specific extension data
  app.get('/api/pbx/user-extension/:extension', isAuthenticated, async (req: any, res) => {
    try {
      const { extension } = req.params;
      const userId = req.user?.id;

      // Verify user owns this extension or is IT staff
      const userExtension = `10${userId?.slice(-2) || '01'}`;
      const isITStaff = req.user?.role === 'school_it_staff' || req.user?.role === 'school_admin';
      
      if (extension !== userExtension && !isITStaff) {
        return res.status(403).json({ message: 'Access denied to this extension' });
      }

      // Mock extension data - in real implementation, this would come from Asterisk
      const extensionData = {
        extension: {
          id: extension,
          name: `${req.user?.firstName || 'User'} ${req.user?.lastName || 'Extension'}`,
          status: Math.random() > 0.3 ? 'available' : 'busy',
          currentCall: Math.random() > 0.8 ? {
            id: `call_${Date.now()}`,
            direction: Math.random() > 0.5 ? 'inbound' : 'outbound',
            number: Math.random() > 0.5 ? '1023' : '+15551234567',
            duration: `${Math.floor(Math.random() * 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
          } : null,
          forwardingEnabled: false,
          forwardingNumber: null
        }
      };

      res.json(extensionData);
    } catch (error) {
      console.error('Error fetching user extension:', error);
      res.status(500).json({ message: 'Failed to fetch extension data' });
    }
  });

  // User-specific call logs
  app.get('/api/pbx/user-call-logs/:extension', isAuthenticated, async (req: any, res) => {
    try {
      const { extension } = req.params;
      const userId = req.user?.id;

      // Verify user owns this extension or is IT staff
      const userExtension = `10${userId?.slice(-2) || '01'}`;
      const isITStaff = req.user?.role === 'school_it_staff' || req.user?.role === 'school_admin';
      
      if (extension !== userExtension && !isITStaff) {
        return res.status(403).json({ message: 'Access denied to this extension' });
      }

      // Mock call logs
      const callLogs = Array.from({ length: 20 }, (_, i) => ({
        id: `call_${Date.now()}_${i}`,
        timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        direction: Math.random() > 0.5 ? 'inbound' : 'outbound',
        number: Math.random() > 0.7 ? `102${Math.floor(Math.random() * 10)}` : `+1555${Math.floor(Math.random() * 9000000) + 1000000}`,
        duration: Math.floor(Math.random() * 300),
        status: Math.random() > 0.8 ? 'missed' : 'completed'
      })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      res.json({ callLogs });
    } catch (error) {
      console.error('Error fetching call logs:', error);
      res.status(500).json({ message: 'Failed to fetch call logs' });
    }
  });
}