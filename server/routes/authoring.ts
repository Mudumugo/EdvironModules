import type { Express, Request, Response } from "express";
import { isAuthenticated } from "../roleMiddleware";
import { requirePermission } from "../roleMiddleware";
// Using existing permissions for now - will extend schema later
import { storage } from "../storage";

export function registerAuthoringRoutes(app: Express) {
  
  // Check if authoring routes should be enabled (only in global builds)
  const buildType = process.env.BUILD_TYPE || 'development';
  if (buildType === 'tenant') {
    // Skip registering authoring routes for tenant builds
    console.log('[INFO] Authoring routes disabled for tenant build');
    return;
  }
  
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

  // Book project management endpoints
  app.get("/api/authoring/book-projects", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const projects = [
        {
          id: 'proj1',
          title: 'Advanced Chemistry Textbook',
          description: 'Comprehensive chemistry textbook for Grade 11-12 students',
          subject: 'Chemistry',
          gradeLevel: 'Grade 11-12',
          targetWords: 50000,
          currentWords: 12450,
          deadline: '2024-08-15',
          status: 'writing',
          chaptersCount: 15,
          collaborators: ['Dr. Sarah Chen', 'Prof. Mike Johnson'],
          created: '2024-05-01',
          modified: '2024-06-18',
          templateId: 'textbook',
          authorId: (req.user as any)?.id
        },
        {
          id: 'proj2',
          title: 'Introduction to Biology',
          description: 'Interactive biology textbook with multimedia content',
          subject: 'Biology',
          gradeLevel: 'Grade 9-10',
          targetWords: 35000,
          currentWords: 8200,
          status: 'planning',
          chaptersCount: 12,
          collaborators: ['Dr. Lisa Wang'],
          created: '2024-06-10',
          modified: '2024-06-17',
          templateId: 'interactive',
          authorId: (req.user as any)?.id
        }
      ];
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching book projects:", error);
      res.status(500).json({ message: "Failed to fetch book projects" });
    }
  });

  app.post("/api/authoring/book-projects", isAuthenticated, async (req: Request, res: Response) => {
    try {
      console.log("Book project creation request:", {
        body: req.body,
        user: req.user,
        timestamp: new Date().toISOString()
      });
      
      const projectData = req.body;
      
      // Validate required fields
      if (!projectData.title || !projectData.subject || !projectData.gradeLevel) {
        console.error("Missing required fields:", {
          title: projectData.title,
          subject: projectData.subject,
          gradeLevel: projectData.gradeLevel
        });
        return res.status(400).json({ 
          message: "Missing required fields: title, subject, and gradeLevel are required" 
        });
      }
      
      const newProject = {
        id: `proj_${Date.now()}`,
        title: projectData.title,
        subject: projectData.subject,
        gradeLevel: projectData.gradeLevel,
        description: projectData.description || '',
        targetWords: projectData.targetWords || 10000,
        deadline: projectData.deadline || null,
        templateId: projectData.templateId || 'textbook',
        authorId: (req.user as any)?.id,
        currentWords: 0,
        status: 'planning',
        chaptersCount: 0,
        collaborators: [(req.user as any)?.firstName + ' ' + (req.user as any)?.lastName].filter(Boolean),
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      };
      
      console.log("Created project:", newProject);
      res.json(newProject);
    } catch (error) {
      console.error("Error creating book project:", error);
      res.status(500).json({ message: "Failed to create book project", error: error.message });
    }
  });

  app.get("/api/authoring/book-templates", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const templates = [
        {
          id: 'textbook',
          name: 'Academic Textbook',
          description: 'Structured textbook with chapters, exercises, and assessments',
          structure: [
            'Table of Contents',
            'Introduction',
            'Chapter 1: Fundamentals',
            'Chapter 2: Core Concepts',
            'Chapter 3: Applications',
            'Exercises & Practice',
            'Assessment Materials',
            'Glossary',
            'References'
          ],
          targetAudience: 'High School & College',
          estimatedPages: 200
        },
        {
          id: 'interactive',
          name: 'Interactive Learning Book',
          description: 'Modern interactive book with multimedia elements',
          structure: [
            'Welcome & Navigation',
            'Learning Objectives',
            'Interactive Modules',
            'Simulations & Labs',
            'Progress Tracking',
            'Knowledge Checks',
            'Resources & Links'
          ],
          targetAudience: 'Middle & High School',
          estimatedPages: 150
        },
        {
          id: 'workbook',
          name: 'Student Workbook',
          description: 'Practice-focused workbook with exercises and activities',
          structure: [
            'Instructions for Use',
            'Skill Building Exercises',
            'Practice Problems',
            'Review Activities',
            'Self-Assessment',
            'Answer Key'
          ],
          targetAudience: 'Elementary & Middle School',
          estimatedPages: 100
        }
      ];
      
      res.json(templates);
    } catch (error) {
      console.error("Error fetching book templates:", error);
      res.status(500).json({ message: "Failed to fetch book templates" });
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