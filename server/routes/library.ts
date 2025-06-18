import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
import { PERMISSIONS } from "@shared/schema";
import { storage } from "../storage";

export function registerLibraryRoutes(app: Express) {

  // Get library resources - public access for library browsing
  app.get("/api/library/resources", async (req: Request, res: Response) => {
    try {
      const filters = req.query as {
        category?: string;
        subject?: string;
        gradeLevel?: string;
        type?: string;
      };
      // Library resources with comprehensive educational content
      const resources = [
        {
          id: "resource_001",
          title: "Introduction to Mathematics",
          author: "Dr. Smith",
          type: "book",
          category: "Textbook",
          subject: "Mathematics",
          grade: "Grade 5",
          curriculum: "CBE",
          description: "Basic mathematics concepts for young learners",
          thumbnail: "/api/placeholder/200/150",
          fileUrl: "#",
          difficulty: "medium",
          duration: 45,
          tags: ["mathematics", "grade5", "textbook"],
          viewCount: 150,
          rating: "4.5"
        },
        {
          id: "resource_002",
          title: "Science Experiments for Kids",
          author: "Prof. Johnson",
          type: "video",
          category: "Educational Video",
          subject: "Science",
          grade: "Grade 4",
          curriculum: "CBE",
          description: "Interactive science experiments and demonstrations",
          thumbnail: "/api/placeholder/200/150",
          fileUrl: "#",
          difficulty: "easy",
          duration: 30,
          tags: ["science", "experiments", "grade4"],
          viewCount: 89,
          rating: "4.8"
        },
        {
          id: "resource_003",
          title: "English Literature Classics",
          author: "Dr. Williams",
          type: "book",
          category: "Literature",
          subject: "English",
          grade: "Grade 6",
          curriculum: "CBE",
          description: "Classic and modern literature for young readers",
          thumbnail: "/api/placeholder/200/150",
          fileUrl: "#",
          difficulty: "medium",
          duration: 60,
          tags: ["english", "literature", "grade6"],
          viewCount: 234,
          rating: "4.3"
        },
        {
          id: "resource_004",
          title: "Interactive Geography",
          author: "Earth Sciences Team",
          type: "interactive",
          category: "Interactive Content",
          subject: "Geography",
          grade: "Grade 5",
          curriculum: "CBE",
          description: "Explore world geography through interactive maps and quizzes",
          thumbnail: "/api/placeholder/200/150",
          fileUrl: "#",
          difficulty: "medium",
          duration: 40,
          tags: ["geography", "interactive", "grade5"],
          viewCount: 312,
          rating: "4.7"
        }
      ];
      res.json({ resources });
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