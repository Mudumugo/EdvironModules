import { Express } from "express";
import { isAuthenticated, requireRole } from "../roleMiddleware";
import { GlobalAppsHubStorage } from "../storage/globalAppsHubStorage";
import { z } from "zod";
import { insertGlobalAppSchema, insertGlobalAppCategorySchema } from "../../shared/schema";
import { v4 as uuidv4 } from 'uuid';

const globalAppsStorage = new GlobalAppsHubStorage();

export function registerAppsHubRoutes(app: Express) {
  // Get apps available to tenant (student/teacher view)
  app.get('/api/apps-hub', isAuthenticated, async (req: any, res) => {
    try {
      const { 
        category, 
        featured, 
        trending, 
        recommended, 
        essential, 
        premium,
        search,
        sortBy = 'featured',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        category,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        trending: trending === 'true' ? true : trending === 'false' ? false : undefined,
        recommended: recommended === 'true' ? true : recommended === 'false' ? false : undefined,
        essential: essential === 'true' ? true : essential === 'false' ? false : undefined,
        premium: premium === 'true' ? true : premium === 'false' ? false : undefined,
        search,
        sortBy,
        sortOrder
      };

      const apps = await globalAppsStorage.getTenantApps(req.user.tenantId, filters);

      // Fallback to hardcoded apps if database is empty (for demo purposes)
      if (apps.length === 0) {
        const fallbackApps = [
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

  // EdVirons team: Get all global apps for management
  app.get('/api/global-apps-hub', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { 
        category, 
        featured, 
        trending, 
        recommended, 
        essential, 
        premium,
        status,
        minimumPlan,
        search,
        sortBy = 'featured',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        category,
        featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
        trending: trending === 'true' ? true : trending === 'false' ? false : undefined,
        recommended: recommended === 'true' ? true : recommended === 'false' ? false : undefined,
        essential: essential === 'true' ? true : essential === 'false' ? false : undefined,
        premium: premium === 'true' ? true : premium === 'false' ? false : undefined,
        status,
        minimumPlan,
        search,
        sortBy,
        sortOrder
      };

      const apps = await globalAppsStorage.getGlobalApps(filters);
      res.json(apps);
    } catch (error) {
      console.error("Error fetching global apps:", error);
      res.status(500).json({ message: "Failed to fetch global apps" });
    }
  });

  // EdVirons team: Create new global app
  app.post('/api/global-apps-hub', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const validation = insertGlobalAppSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body);
      
      const appData = {
        ...validation,
        id: uuidv4(),
        createdBy: req.user.id,
        status: 'active'
      };

      const app = await globalAppsStorage.createGlobalApp(appData);
      res.status(201).json(app);
    } catch (error) {
      console.error("Error creating global app:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create global app" });
      }
    }
  });

  // EdVirons team: Update global app
  app.put('/api/global-apps-hub/:id', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { id } = req.params;
      const validation = insertGlobalAppSchema.partial().parse(req.body);
      
      const app = await globalAppsStorage.updateGlobalApp(id, validation);
      if (!app) {
        return res.status(404).json({ message: "Global app not found" });
      }
      
      res.json(app);
    } catch (error) {
      console.error("Error updating global app:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update global app" });
      }
    }
  });

  // EdVirons team: Delete global app
  app.delete('/api/global-apps-hub/:id', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const app = await globalAppsStorage.deleteGlobalApp(id);
      if (!app) {
        return res.status(404).json({ message: "Global app not found" });
      }
      
      res.json({ message: "Global app deleted successfully" });
    } catch (error) {
      console.error("Error deleting global app:", error);
      res.status(500).json({ message: "Failed to delete global app" });
    }
  });

  // EdVirons team: Manage tenant app access
  app.post('/api/tenant-app-access', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { tenantId, appId, isEnabled, customName, customDescription, customIcon } = req.body;
      
      const access = await globalAppsStorage.setTenantAppAccess(tenantId, appId, {
        isEnabled,
        customName,
        customDescription,
        customIcon,
        enabledBy: req.user.id
      });
      
      res.json(access);
    } catch (error) {
      console.error("Error managing tenant app access:", error);
      res.status(500).json({ message: "Failed to manage tenant app access" });
    }
  });

  // EdVirons team: Bulk enable/disable apps for tenant
  app.post('/api/tenant-app-access/bulk', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { tenantId, appIds, isEnabled } = req.body;
      
      if (!Array.isArray(appIds) || appIds.length === 0) {
        return res.status(400).json({ message: "App IDs are required" });
      }
      
      const results = await globalAppsStorage.bulkSetTenantAppAccess(tenantId, appIds, isEnabled, req.user.id);
      res.json({ message: `Updated access for ${results.length} apps`, results });
    } catch (error) {
      console.error("Error bulk updating tenant app access:", error);
      res.status(500).json({ message: "Failed to update tenant app access" });
    }
  });

  // Get tenant app access status (EdVirons team)
  app.get('/api/tenant-app-access/:tenantId', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { tenantId } = req.params;
      
      const access = await globalAppsStorage.getTenantAppAccess(tenantId);
      res.json(access);
    } catch (error) {
      console.error("Error fetching tenant app access:", error);
      res.status(500).json({ message: "Failed to fetch tenant app access" });
    }
  });

  // Get global app categories
  app.get('/api/apps-hub/categories', isAuthenticated, async (req: any, res) => {
    try {
      const categories = await globalAppsStorage.getGlobalCategories();
      
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

  // EdVirons team: Create global category
  app.post('/api/global-categories', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const validation = insertGlobalAppCategorySchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body);
      
      const categoryData = {
        ...validation,
        id: uuidv4()
      };

      const category = await globalAppsStorage.createGlobalCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating global category:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create global category" });
      }
    }
  });

  // EdVirons team: Update global category
  app.put('/api/global-categories/:id', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { id } = req.params;
      const validation = insertGlobalAppCategorySchema.partial().parse(req.body);
      
      const category = await globalAppsStorage.updateGlobalCategory(id, validation);
      if (!category) {
        return res.status(404).json({ message: "Global category not found" });
      }
      
      res.json(category);
    } catch (error) {
      console.error("Error updating global category:", error);
      res.status(500).json({ message: "Failed to update global category" });
    }
  });

  // Track app usage (all users)
  app.post('/api/apps-hub/track-usage', isAuthenticated, async (req: any, res) => {
    try {
      const { appId, action, metadata = {} } = req.body;
      
      // Store usage data for analytics
      console.log(`User ${req.user?.id} from tenant ${req.user.tenantId} performed ${action} on app ${appId}`);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking usage:", error);
      res.status(500).json({ message: "Failed to track usage" });
    }
  });

  // EdVirons team: Get global usage analytics
  app.get('/api/global-analytics', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { period = 'week' } = req.query;
      
      const analytics = await globalAppsStorage.getGlobalUsageAnalytics(period as 'day' | 'week' | 'month');
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching global analytics:", error);
      res.status(500).json({ message: "Failed to fetch global analytics" });
    }
  });

  // EdVirons team: Get globally popular apps
  app.get('/api/global-popular-apps', isAuthenticated, requireRole(['edvirons_admin', 'edvirons_content_manager']), async (req: any, res) => {
    try {
      const { limit = 10 } = req.query;
      
      const popularApps = await globalAppsStorage.getGlobalPopularApps(Number(limit));
      res.json(popularApps);
    } catch (error) {
      console.error("Error fetching global popular apps:", error);
      res.status(500).json({ message: "Failed to fetch global popular apps" });
    }
  });
}