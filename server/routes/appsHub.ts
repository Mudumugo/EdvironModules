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

      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // Get app categories
  app.get('/api/apps-hub/categories', isAuthenticated, async (req: any, res) => {
    try {
      const categories = [
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

      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Track app usage
  app.post('/api/apps-hub/track-usage', isAuthenticated, async (req: any, res) => {
    try {
      const { appId, action } = req.body;
      
      // In production, this would track usage analytics
      console.log(`User ${req.user?.id} performed ${action} on app ${appId}`);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking usage:", error);
      res.status(500).json({ message: "Failed to track usage" });
    }
  });
}