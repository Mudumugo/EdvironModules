import type { Express } from "express";
import { isAuthenticated } from "../../replitAuth";
import { requirePermission } from "../../roleMiddleware";

export function registerPBXAdminRoutes(app: Express) {
  // Get all extensions (admin only)
  app.get('/api/pbx/extensions', isAuthenticated, requirePermission('MANAGE_PBX'), async (req, res) => {
    try {
      // Mock extensions data
      const extensions = Array.from({ length: 50 }, (_, i) => {
        const extNum = `10${String(i + 1).padStart(2, '0')}`;
        return {
          id: extNum,
          name: `Extension ${extNum}`,
          userId: `user_${i + 1}`,
          status: Math.random() > 0.6 ? 'available' : Math.random() > 0.3 ? 'busy' : 'offline',
          department: ['Admin', 'Teaching', 'Support', 'Security'][Math.floor(Math.random() * 4)],
          location: ['Office', 'Classroom', 'Library', 'Reception'][Math.floor(Math.random() * 4)],
          lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
        };
      });

      res.json({ extensions });
    } catch (error) {
      console.error('Error fetching extensions:', error);
      res.status(500).json({ message: 'Failed to fetch extensions' });
    }
  });

  // Get call analytics
  app.get('/api/pbx/analytics', isAuthenticated, requirePermission('MANAGE_PBX'), async (req, res) => {
    try {
      const analytics = {
        totalCalls: Math.floor(Math.random() * 1000) + 500,
        missedCalls: Math.floor(Math.random() * 50) + 10,
        averageCallDuration: Math.floor(Math.random() * 300) + 120,
        peakHours: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
        departmentStats: {
          admin: { calls: Math.floor(Math.random() * 100) + 50, duration: Math.floor(Math.random() * 1000) + 500 },
          teaching: { calls: Math.floor(Math.random() * 200) + 100, duration: Math.floor(Math.random() * 2000) + 1000 },
          support: { calls: Math.floor(Math.random() * 150) + 75, duration: Math.floor(Math.random() * 1500) + 750 },
          security: { calls: Math.floor(Math.random() * 50) + 25, duration: Math.floor(Math.random() * 500) + 250 }
        },
        dailyStats: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          calls: Math.floor(Math.random() * 100) + 20,
          duration: Math.floor(Math.random() * 5000) + 1000
        }))
      };

      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  // Emergency broadcast
  app.post('/api/pbx/emergency-broadcast', isAuthenticated, requirePermission('EMERGENCY_BROADCAST'), async (req, res) => {
    try {
      const { message, targetZones, priority } = req.body;

      // In real implementation, this would trigger emergency announcements
      const broadcastId = `emergency_${Date.now()}`;
      
      res.json({
        success: true,
        broadcastId,
        message: 'Emergency broadcast initiated',
        targetZones: targetZones || ['all'],
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error initiating emergency broadcast:', error);
      res.status(500).json({ message: 'Failed to initiate emergency broadcast' });
    }
  });
}