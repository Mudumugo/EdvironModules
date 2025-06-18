import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
import { PERMISSIONS } from "@shared/schema";
import { LibraryService } from "../modules/library/library.service";

export function registerLibraryRoutes(app: Express) {
  const libraryService = LibraryService.getInstance();

  // Get library resources
  app.get("/api/library/resources", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const filters = req.query as {
        category?: string;
        subject?: string;
        gradeLevel?: string;
        type?: string;
      };
      const resources = await libraryService.getLibraryResources(filters);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch library resources" });
    }
  });

  // Get user's locker items
  app.get("/api/library/locker/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const items = await libraryService.getLockerItems(userId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch locker items" });
    }
  });

  // Save resource to locker
  app.post("/api/library/locker/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { resourceId, resourceData } = req.body;
      const item = await libraryService.saveToLocker(userId, resourceId, resourceData);
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to save to locker" });
    }
  });

  // Remove from locker
  app.delete("/api/library/locker/:userId/:itemId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, itemId } = req.params;
      const success = await libraryService.removeFromLocker(userId, itemId);
      res.json({ success });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from locker" });
    }
  });

  // Update locker item
  app.patch("/api/library/locker/:userId/:itemId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, itemId } = req.params;
      const item = await libraryService.updateLockerItem(userId, itemId, req.body);
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update locker item" });
    }
  });
}