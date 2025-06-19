import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";

export function registerUserRoutes(app: Express) {

  // Get user profile
  app.get("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get users by role
  app.get("/api/users", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { role, tenantId } = req.query;
      const users = await storage.getUsersByRole(role as string, tenantId as string);
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Update user role
  app.patch("/api/users/:id/role", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { role, gradeLevel, department } = req.body;
      const user = await storage.updateUserRole(id, role, gradeLevel, department);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Get user settings
  app.get("/api/users/:id/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const settings = await storage.getUserSettings(id);
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user settings" });
    }
  });

  // Update user settings
  app.patch("/api/users/:id/settings", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const settings = await storage.upsertUserSettings({ userId: id, ...req.body });
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user settings" });
    }
  });

  // Set grade rollover
  app.post("/api/users/:id/grade-rollover", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const { rolloverDate, nextGradeLevel } = req.body;
      const user = await storage.setGradeRollover(id, new Date(rolloverDate), nextGradeLevel);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to set grade rollover" });
    }
  });

  // Process grade rollovers
  app.post("/api/admin/process-rollovers", isAuthenticated, async (req: any, res: Response) => {
    try {
      const rollovers = await storage.processGradeRollovers();
      res.json(rollovers);
    } catch (error) {
      res.status(500).json({ message: "Failed to process grade rollovers" });
    }
  });
}