import type { Express } from "express";
import { isAuthenticated, requirePermission, requireRole } from "../roleMiddleware";
import { storage } from "../../storage";
import type { AuthenticatedRequest } from "../roleMiddleware";
import { PERMISSIONS, USER_ROLES } from "@shared/schema";
import { connectedDevices, sessionDevices, broadcastToSession } from "./core";

export function registerLiveSessionAPIRoutes(app: Express) {
  // Create a new live session
  app.post("/api/live-sessions", isAuthenticated, requireRole([USER_ROLES.TEACHER, USER_ROLES.SCHOOL_ADMIN]), async (req: AuthenticatedRequest, res) => {
    try {
      const { title, description, type, scheduledFor, maxParticipants } = req.body;
      
      const session = await storage.createLiveSession({
        id: crypto.randomUUID(),
        title,
        description,
        type: type || 'lesson',
        hostId: req.user!.id,
        status: 'scheduled',
        scheduledFor: scheduledFor ? new Date(scheduledFor) : new Date(),
        maxParticipants: maxParticipants || 50,
        participants: [],
        settings: {
          allowScreenShare: true,
          allowChat: true,
          recordSession: false,
          requireApproval: false
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.json(session);
    } catch (error) {
      console.error("Error creating live session:", error);
      res.status(500).json({ error: "Failed to create live session" });
    }
  });

  // Get user's live sessions
  app.get("/api/live-sessions", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const sessions = await storage.getLiveSessionsByUser(req.user!.id);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching live sessions:", error);
      res.status(500).json({ error: "Failed to fetch live sessions" });
    }
  });

  // Join a live session
  app.post("/api/live-sessions/:sessionId/join", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId } = req.params;
      const { deviceId } = req.body;
      
      const session = await storage.getLiveSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Check if user can join
      if (session.participants.length >= session.maxParticipants) {
        return res.status(400).json({ error: "Session is full" });
      }

      // Add participant if not already in session
      if (!session.participants.some(p => p.userId === req.user!.id)) {
        session.participants.push({
          userId: req.user!.id,
          joinedAt: new Date(),
          role: session.hostId === req.user!.id ? 'host' : 'participant',
          deviceId
        });

        await storage.updateLiveSession(sessionId, session);
      }

      // Notify other participants
      broadcastToSession(sessionId, {
        type: 'participant_joined',
        participant: {
          userId: req.user!.id,
          name: `${req.user!.firstName} ${req.user!.lastName}`,
          role: session.hostId === req.user!.id ? 'host' : 'participant'
        }
      });

      res.json({ success: true, session });
    } catch (error) {
      console.error("Error joining live session:", error);
      res.status(500).json({ error: "Failed to join session" });
    }
  });

  // Leave a live session
  app.post("/api/live-sessions/:sessionId/leave", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.getLiveSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Remove participant
      session.participants = session.participants.filter(p => p.userId !== req.user!.id);
      await storage.updateLiveSession(sessionId, session);

      // Notify other participants
      broadcastToSession(sessionId, {
        type: 'participant_left',
        userId: req.user!.id
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error leaving live session:", error);
      res.status(500).json({ error: "Failed to leave session" });
    }
  });

  // Update session status
  app.patch("/api/live-sessions/:sessionId/status", isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId } = req.params;
      const { status } = req.body;
      
      const session = await storage.getLiveSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      // Only host can change status
      if (session.hostId !== req.user!.id) {
        return res.status(403).json({ error: "Only host can change session status" });
      }

      session.status = status;
      session.updatedAt = new Date();

      if (status === 'active') {
        session.startedAt = new Date();
      } else if (status === 'ended') {
        session.endedAt = new Date();
      }

      await storage.updateLiveSession(sessionId, session);

      // Notify all participants
      broadcastToSession(sessionId, {
        type: 'session_status_changed',
        status,
        timestamp: new Date()
      });

      res.json(session);
    } catch (error) {
      console.error("Error updating session status:", error);
      res.status(500).json({ error: "Failed to update session status" });
    }
  });

  // Get session statistics
  app.get("/api/live-sessions/:sessionId/stats", isAuthenticated, requirePermission(PERMISSIONS.VIEW_REPORTS), async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.getLiveSession(sessionId);
      if (!session) {
        return res.status(404).json({ error: "Session not found" });
      }

      const connectedCount = sessionDevices.get(sessionId)?.size || 0;
      
      const stats = {
        participantCount: session.participants.length,
        connectedDevices: connectedCount,
        duration: session.startedAt && session.endedAt 
          ? Math.floor((session.endedAt.getTime() - session.startedAt.getTime()) / 1000)
          : session.startedAt 
            ? Math.floor((new Date().getTime() - session.startedAt.getTime()) / 1000)
            : 0,
        status: session.status
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching session stats:", error);
      res.status(500).json({ error: "Failed to fetch session stats" });
    }
  });

  // Get connected devices for admin
  app.get("/api/live-sessions/devices", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_SECURITY), async (req: AuthenticatedRequest, res) => {
    try {
      const devices = Array.from(connectedDevices.values()).map(device => ({
        deviceId: device.deviceId,
        userId: device.userId,
        sessionId: device.sessionId,
        lastHeartbeat: device.lastHeartbeat,
        deviceInfo: device.deviceInfo
      }));

      res.json(devices);
    } catch (error) {
      console.error("Error fetching connected devices:", error);
      res.status(500).json({ error: "Failed to fetch devices" });
    }
  });
}