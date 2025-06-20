import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'urgent';
  category: 'academic' | 'system' | 'social' | 'security' | 'assignment' | 'event';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sender?: string;
  metadata?: any;
}

interface NotificationPreferences {
  userId: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    academic: boolean;
    system: boolean;
    social: boolean;
    security: boolean;
    assignment: boolean;
    event: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

// Sample data for demonstration
let notifications: Notification[] = [
  {
    id: "notif_001",
    userId: "demo_student_elementary",
    type: "info",
    category: "assignment",
    title: "Math Assignment Due Tomorrow",
    message: "Don't forget to complete your Math Problem Set #5. Due tomorrow at 11:59 PM.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: true,
    priority: "high"
  },
  {
    id: "notif_002",
    userId: "demo_student_elementary",
    type: "success",
    category: "academic",
    title: "Great Job on Science Project!",
    message: "Your teacher has graded your science lab report. You received an A! Keep up the excellent work.",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: false,
    priority: "medium"
  },
  {
    id: "notif_003",
    userId: "demo_student_elementary",
    type: "info",
    category: "event",
    title: "School Assembly Tomorrow",
    message: "Join us for the monthly school assembly in the main auditorium at 9:00 AM.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionRequired: false,
    priority: "low"
  },
  {
    id: "notif_004",
    userId: "demo_student_elementary",
    type: "warning",
    category: "academic",
    title: "Library Book Due Soon",
    message: "Your library book 'The Magic Tree House' is due in 2 days. Please return or renew it.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionRequired: true,
    priority: "medium",
    sender: "Assignment System",
    metadata: { assignmentId: "assign_001", studentCount: 3 }
  },
  {
    id: "notif_002",
    userId: "demo-teacher-1",
    type: "warning",
    category: "assignment",
    title: "Assignment Due Tomorrow",
    message: "Math Assignment #6 is due tomorrow. 5 students haven't started yet.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    read: false,
    actionRequired: false,
    priority: "high",
    sender: "Assignment Tracker",
    metadata: { assignmentId: "assign_002", pendingStudents: 5 }
  },
  {
    id: "notif_003",
    userId: "demo-teacher-1",
    type: "success",
    category: "event",
    title: "Parent-Teacher Conference Scheduled",
    message: "Your conference with Sarah Johnson's parents has been confirmed for Friday at 2:00 PM.",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    read: true,
    actionRequired: false,
    priority: "medium",
    sender: "Scheduling System"
  },
  {
    id: "notif_004",
    userId: "demo-teacher-1",
    type: "urgent",
    category: "security",
    title: "Security Alert",
    message: "Unusual login activity detected on your account from a new device. Please verify this was you.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    read: false,
    actionRequired: true,
    priority: "urgent",
    sender: "Security Team"
  },
  {
    id: "notif_005",
    userId: "demo-teacher-1",
    type: "info",
    category: "system",
    title: "System Maintenance Scheduled",
    message: "The learning platform will undergo maintenance this Sunday from 2:00 AM to 4:00 AM EST.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    actionRequired: false,
    priority: "low",
    sender: "IT Team"
  },
  {
    id: "notif_006",
    userId: "demo-teacher-1",
    type: "info",
    category: "social",
    title: "New Message from Principal",
    message: "You have a new message regarding the upcoming faculty meeting. Please check your inbox.",
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    read: false,
    actionRequired: false,
    priority: "medium",
    sender: "Principal Smith"
  }
];

let userPreferences: NotificationPreferences[] = [
  {
    userId: "demo-teacher-1",
    email: true,
    push: true,
    inApp: true,
    categories: {
      academic: true,
      system: true,
      social: true,
      security: true,
      assignment: true,
      event: true
    },
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00"
    }
  }
];

export function registerNotificationRoutes(app: Express) {
  // Get all notifications for the authenticated user
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userNotifications = notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.json(userNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark a notification as read
  app.post('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const notificationIndex = notifications.findIndex(n => n.id === id && n.userId === userId);
      if (notificationIndex === -1) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      notifications[notificationIndex].read = true;
      res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  app.post('/api/notifications/mark-all-read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      notifications = notifications.map(n => 
        n.userId === userId ? { ...n, read: true } : n
      );
      
      res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to mark all notifications as read" });
    }
  });

  // Delete a notification
  app.delete('/api/notifications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const notificationIndex = notifications.findIndex(n => n.id === id && n.userId === userId);
      if (notificationIndex === -1) {
        return res.status(404).json({ message: "Notification not found" });
      }
      
      notifications.splice(notificationIndex, 1);
      res.json({ success: true, message: "Notification deleted" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Get notification preferences
  app.get('/api/notifications/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const preferences = userPreferences.find(p => p.userId === userId) || {
        userId,
        email: true,
        push: true,
        inApp: true,
        categories: {
          academic: true,
          system: true,
          social: true,
          security: true,
          assignment: true,
          event: true
        },
        quietHours: {
          enabled: false,
          start: "22:00",
          end: "08:00"
        }
      };
      
      res.json(preferences);
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      res.status(500).json({ message: "Failed to fetch notification preferences" });
    }
  });

  // Update notification preferences
  app.put('/api/notifications/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updates = req.body;
      
      const existingIndex = userPreferences.findIndex(p => p.userId === userId);
      
      if (existingIndex >= 0) {
        userPreferences[existingIndex] = { 
          ...userPreferences[existingIndex], 
          ...updates 
        };
      } else {
        userPreferences.push({
          userId,
          email: true,
          push: true,
          inApp: true,
          categories: {
            academic: true,
            system: true,
            social: true,
            security: true,
            assignment: true,
            event: true
          },
          quietHours: {
            enabled: false,
            start: "22:00",
            end: "08:00"
          },
          ...updates
        });
      }
      
      res.json({ success: true, message: "Preferences updated successfully" });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      res.status(500).json({ message: "Failed to update notification preferences" });
    }
  });

  // Create a new notification (for system use)
  app.post('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const { 
        type, 
        category, 
        title, 
        message, 
        actionRequired = false, 
        priority = 'medium', 
        sender,
        metadata,
        targetUserId
      } = req.body;
      
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        userId: targetUserId || req.user.id,
        type,
        category,
        title,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        actionRequired,
        priority,
        sender,
        metadata
      };
      
      notifications.push(notification);
      
      res.json({ success: true, notification });
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  // Get notification statistics
  app.get('/api/notifications/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const userNotifications = notifications.filter(n => n.userId === userId);
      
      const stats = {
        total: userNotifications.length,
        unread: userNotifications.filter(n => !n.read).length,
        urgent: userNotifications.filter(n => n.priority === 'urgent' && !n.read).length,
        actionRequired: userNotifications.filter(n => n.actionRequired && !n.read).length,
        byCategory: {
          academic: userNotifications.filter(n => n.category === 'academic').length,
          assignment: userNotifications.filter(n => n.category === 'assignment').length,
          event: userNotifications.filter(n => n.category === 'event').length,
          social: userNotifications.filter(n => n.category === 'social').length,
          security: userNotifications.filter(n => n.category === 'security').length,
          system: userNotifications.filter(n => n.category === 'system').length
        }
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      res.status(500).json({ message: "Failed to fetch notification stats" });
    }
  });
}