import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
import { PERMISSIONS } from "@shared/schema";
import { storage } from "../storage";

export function registerLibraryRoutes(app: Express) {

  // Get library resources
  app.get("/api/library/resources", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const filters = req.query as {
        category?: string;
        subject?: string;
        gradeLevel?: string;
        type?: string;
      };
      // Mock library resources for now
      const resources = [
        {
          id: "resource_001",
          title: "Introduction to Mathematics",
          author: "Dr. Smith",
          type: "book",
          category: "Textbook",
          subject: "Mathematics",
          gradeLevel: "elementary",
          description: "Basic mathematics concepts for young learners"
        }
      ];
      res.json(resources);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch library resources" });
    }
  });

  // Get user's locker items
  app.get("/api/library/locker/:userId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      // Mock locker items for now
      const items = [
        {
          id: "locker_001",
          userId,
          resourceId: 1,
          resourceType: "book",
          title: "Saved Math Book",
          resourceData: { notes: "Chapter 5 is important" },
          lastAccessed: new Date(),
          savedAt: new Date(),
          tags: ["math", "important"],
          notes: "Review for exam",
          isStarred: true,
          gradeLevel: "elementary"
        }
      ];
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
      // Mock save to locker
      const item = {
        id: `locker_${Date.now()}`,
        userId,
        resourceId,
        resourceType: resourceData.type || "document",
        title: resourceData.title || "Untitled Resource",
        resourceData,
        savedAt: new Date(),
        tags: resourceData.tags || [],
        notes: "",
        isStarred: false,
        gradeLevel: resourceData.gradeLevel
      };
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to save to locker" });
    }
  });

  // Remove from locker
  app.delete("/api/library/locker/:userId/:itemId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, itemId } = req.params;
      // Mock remove from locker
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from locker" });
    }
  });

  // Update locker item
  app.patch("/api/library/locker/:userId/:itemId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { userId, itemId } = req.params;
      // Mock update locker item
      const item = {
        id: itemId,
        userId,
        resourceId: 1,
        resourceType: "book",
        title: "Updated Item",
        resourceData: {},
        savedAt: new Date(),
        tags: [],
        isStarred: false,
        ...req.body
      };
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to update locker item" });
    }
  });
}