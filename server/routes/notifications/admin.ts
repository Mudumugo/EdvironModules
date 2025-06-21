import type { Express } from "express";
import { isAuthenticated, requirePermission, requireRole } from "../../roleMiddleware";
import { storage } from "../../storage";
import type { AuthenticatedRequest } from "../../roleMiddleware";
import { PERMISSIONS, USER_ROLES } from "@shared/schema";
import type { NotificationData } from "./core";

export function registerNotificationAdminRoutes(app: Express) {
  // Send notification to specific users
  app.post("/api/notifications/send", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_COMMUNICATIONS), async (req: AuthenticatedRequest, res) => {
    try {
      const { userIds, title, message, type = 'info', category, priority = 'medium', actionUrl, actionText, expiresAt } = req.body;
      
      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "userIds array is required" });
      }

      if (!title || !message) {
        return res.status(400).json({ error: "title and message are required" });
      }

      const notifications = [];
      
      for (const userId of userIds) {
        const notification: Partial<NotificationData> = {
          id: crypto.randomUUID(),
          userId,
          title,
          message,
          type,
          category: category || 'general',
          priority,
          isRead: false,
          actionUrl,
          actionText,
          metadata: {
            sentBy: req.user!.id,
            sentAt: new Date()
          },
          createdAt: new Date(),
          expiresAt: expiresAt ? new Date(expiresAt) : undefined
        };

        const created = await storage.createNotification(notification as NotificationData);
        notifications.push(created);
      }

      res.json({
        success: true,
        sent: notifications.length,
        notifications
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      res.status(500).json({ error: "Failed to send notifications" });
    }
  });

  // Send broadcast notification
  app.post("/api/notifications/broadcast", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_COMMUNICATIONS), async (req: AuthenticatedRequest, res) => {
    try {
      const { title, message, type = 'info', category, priority = 'medium', targetRoles, actionUrl, actionText, expiresAt } = req.body;
      
      if (!title || !message) {
        return res.status(400).json({ error: "title and message are required" });
      }

      // Get all users (optionally filtered by roles)
      const filters: any = {};
      if (targetRoles && Array.isArray(targetRoles)) {
        filters.roles = targetRoles;
      }

      const users = await storage.getUsers(filters);
      const notifications = [];
      
      for (const user of users) {
        const notification: Partial<NotificationData> = {
          id: crypto.randomUUID(),
          userId: user.id,
          title,
          message,
          type,
          category: category || 'announcement',
          priority,
          isRead: false,
          actionUrl,
          actionText,
          metadata: {
            broadcast: true,
            sentBy: req.user!.id,
            sentAt: new Date(),
            targetRoles
          },
          createdAt: new Date(),
          expiresAt: expiresAt ? new Date(expiresAt) : undefined
        };

        const created = await storage.createNotification(notification as NotificationData);
        notifications.push(created);
      }

      res.json({
        success: true,
        sent: notifications.length,
        targetUsers: users.length
      });
    } catch (error) {
      console.error("Error broadcasting notification:", error);
      res.status(500).json({ error: "Failed to broadcast notification" });
    }
  });

  // Get all notifications (admin view)
  app.get("/api/notifications/all", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_COMMUNICATIONS), async (req: AuthenticatedRequest, res) => {
    try {
      const { page = 1, limit = 50, category, type, priority, isRead, userId } = req.query;
      
      const filters: any = {};
      
      if (category) filters.category = category;
      if (type) filters.type = type;
      if (priority) filters.priority = priority;
      if (isRead !== undefined) filters.isRead = isRead === 'true';
      if (userId) filters.userId = userId;
      
      const notifications = await storage.getNotifications(filters, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching all notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Delete multiple notifications
  app.delete("/api/notifications/bulk", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_COMMUNICATIONS), async (req: AuthenticatedRequest, res) => {
    try {
      const { notificationIds } = req.body;
      
      if (!notificationIds || !Array.isArray(notificationIds)) {
        return res.status(400).json({ error: "notificationIds array is required" });
      }

      let deleted = 0;
      for (const id of notificationIds) {
        try {
          await storage.deleteNotification(id);
          deleted++;
        } catch (error) {
          console.error(`Failed to delete notification ${id}:`, error);
        }
      }

      res.json({
        success: true,
        deleted,
        total: notificationIds.length
      });
    } catch (error) {
      console.error("Error bulk deleting notifications:", error);
      res.status(500).json({ error: "Failed to delete notifications" });
    }
  });

  // Get notification analytics
  app.get("/api/notifications/analytics", isAuthenticated, requirePermission(PERMISSIONS.VIEW_REPORTS), async (req: AuthenticatedRequest, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      const filters: any = {};
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);
      
      const analytics = await storage.getNotificationAnalytics(filters);
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching notification analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });
}