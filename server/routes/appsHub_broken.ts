import type { Express, Response } from "express";
import { isAuthenticated } from "../roleMiddleware";

export function registerAppsHubRoutes(app: Express) {
  // Get all apps
  app.get('/api/apps-hub', isAuthenticated, async (req: any, res) => {
    try {
      const apps = [
        {
          id: "1",
          name: "Khan Academy",
          description: "Free online courses, lessons and practice",
          category: "education",
          rating: 4.8,
          downloads: "50M+",
          price: "Free",
          icon: "🎓",
          featured: true,
          trending: true,
          recommended: true,
          popular: true,
          essential: true,
          premium: false,
          tags: ["Education", "Math", "Science"],
          url: "https://khanacademy.org"
        },
        {
          id: "2",
          name: "Duolingo",
          description: "Learn languages for free",
          category: "languages",
          rating: 4.7,
          downloads: "100M+",
          price: "Freemium",
          icon: "🦜",
          featured: true,
          trending: false,
          recommended: true,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Languages", "Learning", "Fun"],
          url: "https://duolingo.com"
        },
        {
          id: "3",
          name: "Scratch",
          description: "Visual programming language for creating interactive stories",
          category: "programming",
          rating: 4.6,
          downloads: "80M+",
          price: "Free",
          icon: "🐱",
          featured: false,
          trending: true,
          recommended: false,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Programming", "Creative", "Kids"],
          url: "https://scratch.mit.edu"
        },
        {
          id: "4",
          name: "Photomath",
          description: "Solve math problems using camera",
          category: "mathematics",
          rating: 4.4,
          downloads: "220M+",
          price: "Freemium",
          icon: "📐",
          featured: false,
          trending: false,
          recommended: true,
          popular: true,
          essential: true,
          premium: false,
          tags: ["Math", "Camera", "Solutions"],
          url: "https://photomath.com"
        },
        {
          id: "5",
          name: "Canva",
          description: "Design anything. Publish anywhere.",
          category: "design",
          rating: 4.5,
          downloads: "500M+",
          price: "Freemium",
          icon: "🎨",
          featured: true,
          trending: false,
          recommended: false,
          popular: true,
          essential: false,
          premium: true,
          tags: ["Design", "Graphics", "Templates"],
          url: "https://canva.com"
        },
        {
          id: "6",
          name: "Zoom",
          description: "Video communications platform",
          category: "communication",
          rating: 4.3,
          downloads: "1B+",
          price: "Freemium",
          icon: "📹",
          featured: false,
          trending: false,
          recommended: true,
          popular: true,
          essential: true,
          premium: false,
          tags: ["Video", "Communication", "Meetings"],
          url: "https://zoom.us"
        },
        {
          id: "7",
          name: "Minecraft Education",
          description: "Game-based learning platform",
          category: "gaming",
          rating: 4.2,
          downloads: "35M+",
          price: "Paid",
          icon: "🎮",
          featured: false,
          trending: true,
          recommended: false,
          popular: false,
          essential: false,
          premium: true,
          tags: ["Gaming", "STEM", "Collaboration"],
          url: "https://education.minecraft.net"
        },
        {
          id: "8",
          name: "Google Classroom",
          description: "Teaching and learning platform",
          category: "education",
          rating: 4.1,
          downloads: "100M+",
          price: "Free",
          icon: "🏫",
          featured: false,
          trending: false,
          recommended: true,
          popular: true,
          essential: true,
          premium: false,
          tags: ["Education", "Classroom", "Assignments"],
          url: "https://classroom.google.com"
        },
        {
          id: "9",
          name: "EdVirons Digital Library",
          description: "Access thousands of educational resources and books",
          category: "education",
          rating: 4.9,
          downloads: "1M+",
          price: "Included",
          icon: "📚",
          featured: true,
          trending: false,
          recommended: true,
          popular: true,
          essential: true,
          premium: false,
          tags: ["Books", "Resources", "Reading"],
          url: "/digital-library",
          internal: true
        },
        {
          id: "10",
          name: "EdVirons Locker",
          description: "Personal cloud storage for assignments and projects",
          category: "productivity",
          rating: 4.8,
          downloads: "1M+",
          price: "Included",
          icon: "🗂️",
          featured: true,
          trending: false,
          recommended: true,
          popular: true,
          essential: true,
          premium: false,
          tags: ["Storage", "Files", "Organization"],
          url: "/my-locker",
          internal: true
        },
        {
          id: "11",
          name: "Notion",
          description: "All-in-one workspace for notes, projects, and collaboration",
          category: "productivity",
          rating: 4.6,
          downloads: "50M+",
          price: "Freemium",
          icon: "📝",
          featured: true,
          trending: true,
          recommended: true,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Notes", "Collaboration", "Planning"],
          url: "https://notion.so"
        },
        {
          id: "12",
          name: "Figma",
          description: "Collaborative design and prototyping tool",
          category: "design",
          rating: 4.7,
          downloads: "20M+",
          price: "Freemium",
          icon: "🎯",
          featured: false,
          trending: true,
          recommended: false,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Design", "Prototyping", "Collaboration"],
          url: "https://figma.com"
        }
      ];

        res.json(fallbackApps);
      } else {
        res.json(apps);
      }
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // Create new app (admin only)
  app.post('/api/apps-hub', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const validation = insertAppSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body);
      
      const appData = {
        ...validation,
        id: uuidv4(),
        tenantId: req.user.tenantId,
        createdBy: req.user.id,
        status: 'pending' // Requires approval
      };

      const app = await appsHubStorage.createApp(appData);
      res.status(201).json(app);
    } catch (error) {
      console.error("Error creating app:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create app" });
      }
    }
  });

  // Update app (admin only)
  app.put('/api/apps-hub/:id', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const { id } = req.params;
      const validation = insertAppSchema.partial().parse(req.body);
      
      const app = await appsHubStorage.updateApp(id, req.user.tenantId, validation);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      console.error("Error updating app:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update app" });
      }
    }
  });

  // Delete app (admin only)
  app.delete('/api/apps-hub/:id', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const app = await appsHubStorage.deleteApp(id, req.user.tenantId);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json({ message: "App deleted successfully" });
    } catch (error) {
      console.error("Error deleting app:", error);
      res.status(500).json({ message: "Failed to delete app" });
    }
  });

  // Approve app (admin only)
  app.patch('/api/apps-hub/:id/approve', isAuthenticated, requireRole(['school_admin']), async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const app = await appsHubStorage.updateApp(id, req.user.tenantId, {
        status: 'active',
        approvedBy: req.user.id,
        approvedAt: new Date()
      });
      
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      console.error("Error approving app:", error);
      res.status(500).json({ message: "Failed to approve app" });
    }
  });

  // Bulk update apps (admin only)
  app.patch('/api/apps-hub/bulk', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const { appIds, updates } = req.body;
      
      if (!Array.isArray(appIds) || appIds.length === 0) {
        return res.status(400).json({ message: "App IDs are required" });
      }
      
      const validation = insertAppSchema.partial().parse(updates);
      
      const apps = await appsHubStorage.bulkUpdateApps(appIds, req.user.tenantId, validation);
      res.json({ message: `Updated ${apps.length} apps`, apps });
    } catch (error) {
      console.error("Error bulk updating apps:", error);
      res.status(500).json({ message: "Failed to update apps" });
    }
  });

  // Get app categories with counts
  app.get('/api/apps-hub/categories', isAuthenticated, async (req: any, res) => {
    try {
      const categories = await appsHubStorage.getCategories(req.user.tenantId);
      
      // Fallback to hardcoded categories if database is empty
      if (categories.length <= 1) { // Only "All Apps" category
        const fallbackCategories = [
          { id: "all", name: "All Apps", count: 12 },
          { id: "education", name: "Education", count: 3 },
          { id: "productivity", name: "Productivity", count: 2 },
          { id: "programming", name: "Programming", count: 1 },
          { id: "mathematics", name: "Mathematics", count: 1 },
          { id: "design", name: "Design", count: 2 },
          { id: "communication", name: "Communication", count: 1 },
          { id: "languages", name: "Languages", count: 1 },
          { id: "gaming", name: "Gaming", count: 1 }
        ];
        res.json(fallbackCategories);
      } else {
        res.json(categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Create app category (admin only)
  app.post('/api/apps-hub/categories', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const validation = insertAppCategorySchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body);
      
      const categoryData = {
        ...validation,
        id: uuidv4(),
        tenantId: req.user.tenantId
      };

      const category = await appsHubStorage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Update app category (admin only)
  app.put('/api/apps-hub/categories/:id', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const { id } = req.params;
      const validation = insertAppCategorySchema.partial().parse(req.body);
      
      const category = await appsHubStorage.updateCategory(id, req.user.tenantId, validation);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Delete app category (admin only)
  app.delete('/api/apps-hub/categories/:id', isAuthenticated, requireRole(['school_admin', 'it_staff']), async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const category = await appsHubStorage.deleteCategory(id, req.user.tenantId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Track app usage
  app.post('/api/apps-hub/track-usage', isAuthenticated, async (req: any, res) => {
    try {
      const { appId, action, metadata = {} } = req.body;
      
      const usageData = {
        appId,
        userId: req.user.id,
        action,
        metadata,
        tenantId: req.user.tenantId
      };

      await appsHubStorage.trackUsage(usageData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking usage:", error);
      res.status(500).json({ message: "Failed to track usage" });
    }
  });

  // Get app usage analytics (admin only)
  app.get('/api/apps-hub/analytics', isAuthenticated, requireRole(['school_admin', 'teacher']), async (req: any, res) => {
    try {
      const { appId, period = 'week' } = req.query;
      
      const analytics = await appsHubStorage.getUsageAnalytics(
        req.user.tenantId, 
        appId as string, 
        period as 'day' | 'week' | 'month'
      );
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get popular apps
  app.get('/api/apps-hub/popular', isAuthenticated, async (req: any, res) => {
    try {
      const { limit = 10 } = req.query;
      
      const popularApps = await appsHubStorage.getPopularApps(req.user.tenantId, Number(limit));
      res.json(popularApps);
    } catch (error) {
      console.error("Error fetching popular apps:", error);
      res.status(500).json({ message: "Failed to fetch popular apps" });
    }
  });

  // Get app by ID
  app.get('/api/apps-hub/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const app = await appsHubStorage.getApp(id, req.user.tenantId);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      res.json(app);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });
}