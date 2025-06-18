import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../replitAuth";
import { requirePermission } from "../roleMiddleware";
// Using existing permissions for now - will extend schema later
import { storage } from "../storage";

export function registerAuthoringRoutes(app: Express) {
  
  // Content authoring dashboard routes
  app.get("/api/authoring/dashboard", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const authorStats = {
        totalContent: 45,
        published: 32,
        inReview: 8,
        drafts: 5,
        viewsThisMonth: 15420,
        downloadsThisMonth: 3240,
        avgRating: 4.6,
        revenue: 2840.50
      };
      
      const recentContent = [
        {
          id: "content_001",
          title: "Advanced Mathematics: Calculus Fundamentals",
          status: "published",
          type: "interactive_book",
          subject: "Mathematics",
          grade: "Grade 12",
          views: 1240,
          rating: 4.8,
          lastModified: "2024-06-15T10:30:00Z",
          publishedDate: "2024-06-10T09:00:00Z"
        },
        {
          id: "content_002", 
          title: "Chemistry Lab Experiments - Virtual Edition",
          status: "in_review",
          type: "interactive_simulation",
          subject: "Chemistry", 
          grade: "Grade 11",
          views: 0,
          rating: null,
          lastModified: "2024-06-17T14:22:00Z",
          submittedDate: "2024-06-17T14:22:00Z"
        }
      ];

      res.json({ stats: authorStats, recentContent });
    } catch (error) {
      console.error("Error fetching authoring dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  // Create new content
  app.post("/api/authoring/content", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const contentData = req.body;
      const newContent = {
        id: `content_${Date.now()}`,
        ...contentData,
        authorId: (req.user as any)?.claims?.sub,
        status: "draft",
        createdAt: new Date(),
        lastModified: new Date(),
        version: "1.0.0"
      };
      
      res.json(newContent);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  // Update content
  app.patch("/api/authoring/content/:contentId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { contentId } = req.params;
      const updates = req.body;
      
      const updatedContent = {
        id: contentId,
        ...updates,
        lastModified: new Date(),
        modifiedBy: (req.user as any)?.claims?.sub
      };
      
      res.json(updatedContent);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Submit content for review
  app.post("/api/authoring/content/:contentId/submit", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { contentId } = req.params;
      
      const submission = {
        contentId,
        status: "in_review",
        submittedAt: new Date(),
        submittedBy: (req.user as any)?.claims?.sub,
        reviewNotes: req.body.notes || ""
      };
      
      res.json(submission);
    } catch (error) {
      console.error("Error submitting content:", error);
      res.status(500).json({ message: "Failed to submit content for review" });
    }
  });

  // Content review endpoints (for reviewers/editors)
  app.get("/api/authoring/review-queue", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const reviewQueue = [
        {
          id: "content_002",
          title: "Chemistry Lab Experiments - Virtual Edition",
          author: "Dr. Sarah Johnson",
          authorId: "author_123",
          type: "interactive_simulation",
          subject: "Chemistry",
          grade: "Grade 11",
          submittedDate: "2024-06-17T14:22:00Z",
          priority: "high",
          estimatedReviewTime: "2-3 hours",
          reviewNotes: "Comprehensive virtual chemistry lab with 15 experiments"
        }
      ];
      
      res.json(reviewQueue);
    } catch (error) {
      console.error("Error fetching review queue:", error);
      res.status(500).json({ message: "Failed to fetch review queue" });
    }
  });

  // Approve/reject content
  app.post("/api/authoring/content/:contentId/review", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { contentId } = req.params;
      const { action, feedback, publishDate } = req.body; // action: 'approve' or 'reject'
      
      const reviewResult = {
        contentId,
        action,
        reviewedBy: (req.user as any)?.claims?.sub,
        reviewedAt: new Date(),
        feedback,
        status: action === 'approve' ? 'approved' : 'rejected',
        ...(action === 'approve' && publishDate && { scheduledPublishDate: publishDate })
      };
      
      res.json(reviewResult);
    } catch (error) {
      console.error("Error reviewing content:", error);
      res.status(500).json({ message: "Failed to process content review" });
    }
  });

  // Global content statistics
  app.get("/api/authoring/global-stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const globalStats = {
        totalAuthors: 1247,
        totalContent: 8934,
        publishedContent: 7821,
        contentInReview: 234,
        totalViews: 2840394,
        totalDownloads: 892134,
        avgContentRating: 4.3,
        topSubjects: [
          { subject: "Mathematics", contentCount: 1847, avgRating: 4.5 },
          { subject: "Science", contentCount: 1592, avgRating: 4.4 },
          { subject: "English", contentCount: 1203, avgRating: 4.2 },
          { subject: "History", contentCount: 987, avgRating: 4.1 }
        ],
        recentPublications: 45,
        qualityScore: 94.2
      };
      
      res.json(globalStats);
    } catch (error) {
      console.error("Error fetching global stats:", error);
      res.status(500).json({ message: "Failed to fetch global statistics" });
    }
  });

  // Content categories and taxonomy
  app.get("/api/authoring/taxonomy", async (req: Request, res: Response) => {
    try {
      const taxonomy = {
        subjects: [
          "Mathematics", "Science", "English", "History", "Geography", 
          "Physics", "Chemistry", "Biology", "Literature", "Art", "Music"
        ],
        gradelevels: [
          "Kindergarten", "Grade 1", "Grade 2", "Grade 3", "Grade 4", 
          "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", 
          "Grade 10", "Grade 11", "Grade 12"
        ],
        contentTypes: [
          "textbook", "video", "interactive", "simulation", "assessment", 
          "worksheet", "lesson_plan", "multimedia", "audio", "game"
        ],
        difficultyLevels: ["beginner", "intermediate", "advanced"],
        languages: ["English", "Spanish", "French", "German", "Mandarin"],
        curricula: ["CBE", "IB", "AP", "Cambridge", "Common Core", "Custom"]
      };
      
      res.json(taxonomy);
    } catch (error) {
      console.error("Error fetching taxonomy:", error);
      res.status(500).json({ message: "Failed to fetch content taxonomy" });
    }
  });
}