import type { Express } from "express";
import { isAuthenticated, requirePermission } from "../roleMiddleware";
import { storage } from "../storage";
import type { AuthenticatedRequest } from "../roleMiddleware";
import { PERMISSIONS } from "@shared/schema";

export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  expiresAt?: Date;
}

export function registerNotificationCoreRoutes(app: Express) {
  // Get user notifications
  app.get("/api/notifications", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { page = 1, limit = 20, category, isRead, priority } = req.query;
      
      const filters: any = { userId: req.user!.id };
      
      if (category) filters.category = category;
      if (isRead !== undefined) filters.isRead = isRead === 'true';
      if (priority) filters.priority = priority;
      
      const notifications = await storage.getNotifications(filters, {
        page: parseInt(page as string),
        limit: parseInt(limit as string)
      });

      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:notificationId/read", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { notificationId } = req.params;
      
      const notification = await storage.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      if (notification.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.updateNotification(notificationId, { isRead: true });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  // Mark all notifications as read
  app.patch("/api/notifications/read-all", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      await storage.markAllNotificationsAsRead(req.user!.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ error: "Failed to update notifications" });
    }
  });

  // Delete notification
  app.delete("/api/notifications/:notificationId", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { notificationId } = req.params;
      
      const notification = await storage.getNotification(notificationId);
      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      if (notification.userId !== req.user!.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      await storage.deleteNotification(notificationId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Get notification statistics
  app.get("/api/notifications/stats", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await storage.getNotificationStats(req.user!.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching notification stats:", error);
      res.status(500).json({ error: "Failed to fetch notification stats" });
    }
  });
}