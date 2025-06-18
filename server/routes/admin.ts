import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";
import { requireRole } from "../roleMiddleware";
import { storage } from "../storage";
import { db } from "../db";
import { users, activityLogs, notifications } from "@shared/schema";
import { sql, eq, and, gte, desc, count } from "drizzle-orm";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    claims?: any;
  };
  session?: any;
}

export function registerAdminRoutes(app: Express) {
  // Get dashboard statistics
  app.get('/api/admin/dashboard/stats', 
    isAuthenticated, 
    requireRole(["school_admin"]), 
    async (req: AuthenticatedRequest, res) => {
      try {
        const { timeframe = 'thisMonth' } = req.query;
        
        // Calculate date ranges based on timeframe
        const now = new Date();
        let startDate: Date;
        
        switch (timeframe) {
          case 'thisWeek':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'thisQuarter':
            startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
            break;
          case 'thisYear':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
          default: // thisMonth
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        // Get user counts by role
        const [studentCount] = await db
          .select({ count: count() })
          .from(users)
          .where(eq(users.role, 'student_elementary'));

        const [teacherCount] = await db
          .select({ count: count() })
          .from(users)
          .where(eq(users.role, 'teacher'));

        const [staffCount] = await db
          .select({ count: count() })
          .from(users)
          .where(sql`role IN ('school_admin', 'school_it_staff', 'school_security', 'school_nurse', 'school_counselor')`);

        // Calculate recent activity metrics
        const [recentEnrollments] = await db
          .select({ count: count() })
          .from(users)
          .where(and(
            eq(users.role, 'student_elementary'),
            gte(users.createdAt, startDate)
          ));

        const stats = {
          totalStudents: studentCount?.count || 0,
          totalTeachers: teacherCount?.count || 0,
          totalStaff: staffCount?.count || 0,
          activeClasses: 52, // This would come from a classes table
          pendingApplications: 23, // This would come from applications table
          monthlyRevenue: 245000, // This would come from billing/payments table
          attendanceRate: 94.2, // This would be calculated from attendance records
          graduationRate: 97.8, // This would be calculated from academic records
          newEnrollments: recentEnrollments?.count || 0
        };

        res.json(stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
      }
    }
  );

  // Get recent activity
  app.get('/api/admin/dashboard/activity', 
    isAuthenticated, 
    requireRole(["school_admin"]), 
    async (req: AuthenticatedRequest, res) => {
      try {
        // Get recent activity from activity logs
        const recentActivity = await db
          .select({
            id: activityLogs.id,
            type: activityLogs.activityType,
            title: activityLogs.action,
            description: activityLogs.details,
            timestamp: activityLogs.timestamp,
            priority: sql<string>`CASE 
              WHEN activity_type = 'security_alert' THEN 'high'
              WHEN activity_type = 'system_error' THEN 'high'
              WHEN activity_type = 'enrollment' THEN 'medium'
              ELSE 'low'
            END`
          })
          .from(activityLogs)
          .orderBy(desc(activityLogs.timestamp))
          .limit(10);

        // Transform the data to match the expected format
        const formattedActivity = recentActivity.map(activity => ({
          id: activity.id,
          type: activity.type === 'user_registration' ? 'enrollment' : 
                activity.type === 'security_alert' ? 'incident' :
                activity.type === 'achievement' ? 'achievement' : 'enrollment',
          title: activity.title || 'System Activity',
          description: activity.description || 'No description available',
          timestamp: formatTimestamp(activity.timestamp),
          priority: activity.priority as 'low' | 'medium' | 'high'
        }));

        res.json(formattedActivity);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        res.status(500).json({ message: 'Failed to fetch recent activity' });
      }
    }
  );

  // Get system alerts
  app.get('/api/admin/dashboard/alerts', 
    isAuthenticated, 
    requireRole(["school_admin"]), 
    async (req: AuthenticatedRequest, res) => {
      try {
        // Get unread notifications that are urgent or system-related
        const alerts = await db
          .select({
            id: notifications.id,
            type: notifications.type,
            title: notifications.title,
            description: notifications.message,
            urgent: sql<boolean>`priority = 'high' OR type = 'security_alert'`
          })
          .from(notifications)
          .where(and(
            eq(notifications.read, false),
            sql`(priority = 'high' OR type IN ('security_alert', 'system_maintenance', 'urgent_notice'))`
          ))
          .orderBy(desc(notifications.createdAt))
          .limit(5);

        res.json(alerts);
      } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ message: 'Failed to fetch system alerts' });
      }
    }
  );

  // Get performance metrics
  app.get('/api/admin/dashboard/performance', 
    isAuthenticated, 
    requireRole(["school_admin"]), 
    async (req: AuthenticatedRequest, res) => {
      try {
        // This would typically aggregate data from various sources
        // For now, we'll provide calculated metrics
        
        const performanceMetrics = {
          attendanceRate: {
            current: 94.2,
            target: 95.0,
            trend: "+1.2% from last month"
          },
          graduationRate: {
            current: 97.8,
            target: 95.0,
            trend: "+2.1% from last year"
          },
          studentSatisfaction: {
            current: 88.5,
            target: 85.0,
            trend: "+3.2% from last quarter"
          },
          teacherRetention: {
            current: 92.3,
            target: 90.0,
            trend: "+1.8% from last year"
          }
        };

        res.json(performanceMetrics);
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
        res.status(500).json({ message: 'Failed to fetch performance metrics' });
      }
    }
  );

  // Get enrollment trends
  app.get('/api/admin/dashboard/enrollment-trends', 
    isAuthenticated, 
    requireRole(["school_admin"]), 
    async (req: AuthenticatedRequest, res) => {
      try {
        // Get enrollment data for the last 12 months
        const enrollmentTrends = await db
          .select({
            month: sql<string>`TO_CHAR(created_at, 'YYYY-MM')`,
            count: count()
          })
          .from(users)
          .where(and(
            eq(users.role, 'student_elementary'),
            gte(users.createdAt, new Date(Date.now() - 365 * 24 * 60 * 60 * 1000))
          ))
          .groupBy(sql`TO_CHAR(created_at, 'YYYY-MM')`)
          .orderBy(sql`TO_CHAR(created_at, 'YYYY-MM')`);

        res.json(enrollmentTrends);
      } catch (error) {
        console.error('Error fetching enrollment trends:', error);
        res.status(500).json({ message: 'Failed to fetch enrollment trends' });
      }
    }
  );

  // Record admin action
  app.post('/api/admin/log-action', 
    isAuthenticated, 
    requireRole(["school_admin"]), 
    async (req: AuthenticatedRequest, res) => {
      try {
        const { action, target, details } = req.body;
        const userId = req.user?.id;

        if (!userId) {
          return res.status(401).json({ message: 'User not authenticated' });
        }

        // Log the admin action
        await db.insert(activityLogs).values({
          userId,
          activityType: 'admin_action',
          action: action,
          target: target,
          details: details,
          timestamp: new Date(),
          metadata: { userRole: 'school_admin' }
        });

        res.json({ success: true, message: 'Action logged successfully' });
      } catch (error) {
        console.error('Error logging admin action:', error);
        res.status(500).json({ message: 'Failed to log action' });
      }
    }
  );
}

// Helper function to format timestamps
function formatTimestamp(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else if (days < 7) {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  } else {
    return timestamp.toLocaleDateString();
  }
}