import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
import { storage } from "../storage";
import { PERMISSIONS } from "@shared/schema";

export function registerAdminRoutes(app: Express) {
  // Set grade rollover for a student
  app.post("/api/admin/grade-rollover", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_USERS), async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { userId, rolloverDate, nextGradeLevel } = req.body;
      
      if (!userId || !rolloverDate || !nextGradeLevel) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await storage.setGradeRollover(userId, new Date(rolloverDate), nextGradeLevel);
      res.json(user);
    } catch (error) {
      console.error("Error setting grade rollover:", error);
      res.status(500).json({ message: "Failed to set grade rollover" });
    }
  });

  // Process all pending grade rollovers
  app.post("/api/admin/process-rollovers", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_USERS), async (req: Request, res: Response) => {
    try {
      const rolledOverUsers = await storage.processGradeRollovers();
      res.json({ 
        message: `Processed ${rolledOverUsers.length} grade rollovers`,
        users: rolledOverUsers 
      });
    } catch (error) {
      console.error("Error processing grade rollovers:", error);
      res.status(500).json({ message: "Failed to process grade rollovers" });
    }
  });

  // Get users pending rollover
  app.get("/api/admin/pending-rollovers", isAuthenticated, requirePermission(PERMISSIONS.MANAGE_USERS), async (req: Request, res: Response) => {
    try {
      const pendingUsers = await storage.getUsersByRole("student");
      // const usersWithRollovers = pendingUsers.filter(user => user.gradeRolloverDate && user.nextGradeLevel);
      const usersWithRollovers = pendingUsers; // Temporary until grade rollover fields are added
      res.json(usersWithRollovers);
    } catch (error) {
      console.error("Error fetching pending rollovers:", error);
      res.status(500).json({ message: "Failed to fetch pending rollovers" });
    }
  });
}