import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../roleMiddleware";
import { storage } from "../storage";

export function registerSecurityRoutes(app: Express) {
  // Get security zones
  app.get("/api/security/zones", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const zones = await storage.getSecurityZones();
      res.json(zones);
    } catch (error) {
      console.error("Error fetching security zones:", error);
      res.status(500).json({ message: "Failed to fetch security zones" });
    }
  });

  // Create security zone
  app.post("/api/security/zones", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const zone = await storage.createSecurityZone(req.body);
      res.json(zone);
    } catch (error) {
      console.error("Error creating security zone:", error);
      res.status(500).json({ message: "Failed to create security zone" });
    }
  });

  // Get cameras for a zone
  app.get("/api/security/zones/:zoneId/cameras", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const cameras = await storage.getSecurityCamerasByZone(req.params.zoneId);
      res.json(cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  // Get all cameras
  app.get("/api/security/cameras", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const cameras = await storage.getSecurityCameras();
      res.json(cameras);
    } catch (error) {
      console.error("Error fetching cameras:", error);
      res.status(500).json({ message: "Failed to fetch cameras" });
    }
  });

  // Create security camera
  app.post("/api/security/cameras", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const camera = await storage.createSecurityCamera(req.body);
      res.json(camera);
    } catch (error) {
      console.error("Error creating camera:", error);
      res.status(500).json({ message: "Failed to create camera" });
    }
  });

  // Get security events
  app.get("/api/security/events", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { status, severity, zoneId, limit = 50 } = req.query;
      const events = await storage.getSecurityEvents({
        status: status as string,
        severity: severity as string,
        zoneId: zoneId as string,
        limit: parseInt(limit as string)
      });
      res.json(events);
    } catch (error) {
      console.error("Error fetching security events:", error);
      res.status(500).json({ message: "Failed to fetch security events" });
    }
  });

  // Create security event
  app.post("/api/security/events", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const event = await storage.createSecurityEvent(req.body);
      res.json(event);
    } catch (error) {
      console.error("Error creating security event:", error);
      res.status(500).json({ message: "Failed to create security event" });
    }
  });

  // Update security event
  app.put("/api/security/events/:eventId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const event = await storage.updateSecurityEvent(req.params.eventId, req.body);
      res.json(event);
    } catch (error) {
      console.error("Error updating security event:", error);
      res.status(500).json({ message: "Failed to update security event" });
    }
  });

  // Get visitor registrations
  app.get("/api/security/visitors", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { status, date } = req.query;
      const visitors = await storage.getVisitorRegistrations({
        status: status as string,
        date: date as string
      });
      res.json(visitors);
    } catch (error) {
      console.error("Error fetching visitor registrations:", error);
      res.status(500).json({ message: "Failed to fetch visitor registrations" });
    }
  });

  // Create visitor registration
  app.post("/api/security/visitors", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const visitor = await storage.createVisitorRegistration(req.body);
      res.json(visitor);
    } catch (error) {
      console.error("Error creating visitor registration:", error);
      res.status(500).json({ message: "Failed to create visitor registration" });
    }
  });

  // Checkout visitor
  app.put("/api/security/visitors/:visitorId/checkout", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const visitor = await storage.checkoutVisitor(req.params.visitorId);
      res.json(visitor);
    } catch (error) {
      console.error("Error checking out visitor:", error);
      res.status(500).json({ message: "Failed to checkout visitor" });
    }
  });

  // Get security calls
  app.get("/api/security/calls", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { status, type } = req.query;
      const calls = await storage.getSecurityCalls({
        status: status as string,
        type: type as string
      });
      res.json(calls);
    } catch (error) {
      console.error("Error fetching security calls:", error);
      res.status(500).json({ message: "Failed to fetch security calls" });
    }
  });

  // Create security call
  app.post("/api/security/calls", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const call = await storage.createSecurityCall(req.body);
      res.json(call);
    } catch (error) {
      console.error("Error creating security call:", error);
      res.status(500).json({ message: "Failed to create security call" });
    }
  });

  // Get security metrics
  app.get("/api/security/metrics", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const metrics = await storage.getSecurityMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching security metrics:", error);
      res.status(500).json({ message: "Failed to fetch security metrics" });
    }
  });

  // Get active threats
  app.get("/api/security/threats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const threats = await storage.getActiveThreats();
      res.json(threats);
    } catch (error) {
      console.error("Error fetching active threats:", error);
      res.status(500).json({ message: "Failed to fetch active threats" });
    }
  });
}