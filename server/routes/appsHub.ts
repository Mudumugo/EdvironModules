import type { Express } from "express";
import { isAuthenticated } from "../replitAuth";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
    claims?: any;
  };
  session?: any;
}

export function registerAppsHubRoutes(app: Express) {
  // Get all external learning applications
  app.get('/api/apps-hub', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      // In production, this would fetch from a database
      // For now, return curated external learning applications
      const apps = [
        {
          id: "1",
          name: "Khan Academy",
          description: "Free online courses, lessons and practice for students",
          category: "Education",
          icon: "🎓",
          url: "https://khanacademy.org",
          rating: 4.8,
          downloads: "50M+",
          price: "Free",
          featured: true,
          trending: false,
          recommended: true,
          popular: false,
          essential: false,
          premium: false,
          tags: ["Mathematics", "Science"]
        },
        {
          id: "2",
          name: "Scratch",
          description: "Visual programming language for kids and beginners",
          category: "Programming",
          icon: "🎨",
          url: "https://scratch.mit.edu",
          rating: 4.7,
          downloads: "30M+",
          price: "Free",
          featured: true,
          trending: false,
          recommended: false,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Programming", "Creativity"]
        },
        {
          id: "3",
          name: "GeoGebra",
          description: "Interactive mathematics software for all levels",
          category: "Mathematics",
          icon: "📐",
          url: "https://geogebra.org",
          rating: 4.6,
          downloads: "20M+",
          price: "Free",
          featured: true,
          trending: true,
          recommended: false,
          popular: false,
          essential: false,
          premium: false,
          tags: ["Mathematics", "Geometry"]
        },
        {
          id: "4",
          name: "Canva for Education",
          description: "Design presentations, posters, and educational content",
          category: "Design",
          icon: "🎨",
          url: "https://canva.com/education",
          rating: 4.5,
          downloads: "100M+",
          price: "Premium",
          featured: false,
          trending: false,
          recommended: false,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Design", "Presentations", "Graphics"]
        },
        {
          id: "5",
          name: "Zoom",
          description: "Video conferencing for virtual classrooms",
          category: "Communication",
          icon: "📹",
          url: "https://zoom.us",
          rating: 4.3,
          downloads: "500M+",
          price: "Freemium",
          featured: false,
          trending: false,
          recommended: false,
          popular: false,
          essential: true,
          premium: false,
          tags: ["Video Calls", "Remote Learning", "Collaboration"]
        },
        {
          id: "6",
          name: "Google Classroom",
          description: "Classroom management and assignment distribution",
          category: "Education",
          icon: "📚",
          url: "https://classroom.google.com",
          rating: 4.4,
          downloads: "100M+",
          price: "Free",
          featured: false,
          trending: false,
          recommended: true,
          popular: false,
          essential: false,
          premium: false,
          tags: ["Classroom Management", "Assignments", "Google Workspace"]
        },
        {
          id: "7",
          name: "Duolingo",
          description: "Language learning made fun and effective",
          category: "Languages",
          icon: "🦜",
          url: "https://duolingo.com",
          rating: 4.7,
          downloads: "500M+",
          price: "Freemium",
          featured: false,
          trending: false,
          recommended: false,
          popular: true,
          essential: false,
          premium: false,
          tags: ["Languages", "Interactive", "Gamified"]
        },
        {
          id: "8",
          name: "Minecraft Education",
          description: "Game-based learning platform for creativity and collaboration",
          category: "Gaming",
          icon: "🎮",
          url: "https://education.minecraft.net",
          rating: 4.6,
          downloads: "10M+",
          price: "Paid",
          featured: false,
          trending: false,
          recommended: false,
          popular: false,
          essential: false,
          premium: true,
          tags: ["Gaming", "STEM", "Collaboration"]
        }
      ];

      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  // Get app categories
  app.get('/api/apps-hub/categories', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const categories = [
        { id: "all", name: "All Apps", count: 8 },
        { id: "education", name: "Education", count: 2 },
        { id: "programming", name: "Programming", count: 1 },
        { id: "mathematics", name: "Mathematics", count: 1 },
        { id: "design", name: "Design", count: 1 },
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
  app.post('/api/apps-hub/track-usage', isAuthenticated, async (req: AuthenticatedRequest, res) => {
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
          description: "Visual programming language for creating interactive stories and games",
          category: "programming",
          icon: "🐱",
          url: "https://scratch.mit.edu",
          rating: 4.6,
          users: "80M+",
          lastUpdated: "2024-01-10",
          features: ["Visual Programming", "Project Sharing", "Community", "Tutorials"],
          platforms: ["Web", "Offline"],
          pricing: "free",
          ageGroup: "8-16",
          subjects: ["Programming", "Creative Arts"]
        },
        {
          id: "4",
          name: "Coursera",
          description: "Online courses from top universities and companies worldwide",
          category: "university",
          icon: "🏛️",
          url: "https://coursera.org",
          rating: 4.5,
          users: "100M+",
          lastUpdated: "2024-01-18",
          features: ["University Courses", "Certificates", "Specializations", "Degrees"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "freemium",
          ageGroup: "College, Adult",
          subjects: ["Technology", "Business", "Science", "Arts"]
        },
        {
          id: "5",
          name: "Photomath",
          description: "Solve math problems using camera and get step-by-step explanations",
          category: "math",
          icon: "📐",
          url: "https://photomath.com",
          rating: 4.4,
          users: "220M+",
          lastUpdated: "2024-01-12",
          features: ["Camera Solving", "Step-by-step Solutions", "Graphing", "Multiple Methods"],
          platforms: ["iOS", "Android"],
          pricing: "freemium",
          ageGroup: "Middle School, High School",
          subjects: ["Math"]
        },
        {
          id: "6",
          name: "Quizlet",
          description: "Study tools including flashcards, games, and practice tests",
          category: "study",
          icon: "📚",
          url: "https://quizlet.com",
          rating: 4.3,
          users: "60M+",
          lastUpdated: "2024-01-16",
          features: ["Flashcards", "Study Games", "Practice Tests", "Collaborative Sets"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "freemium",
          ageGroup: "All Ages",
          subjects: ["All Subjects"]
        },
        {
          id: "7",
          name: "Codecademy",
          description: "Interactive coding lessons and programming courses",
          category: "programming",
          icon: "💻",
          url: "https://codecademy.com",
          rating: 4.4,
          users: "50M+",
          lastUpdated: "2024-01-14",
          features: ["Interactive Coding", "Projects", "Career Paths", "Certificates"],
          platforms: ["Web"],
          pricing: "freemium",
          ageGroup: "High School, College, Adult",
          subjects: ["Programming", "Web Development", "Data Science"]
        },
        {
          id: "8",
          name: "Brilliant",
          description: "Build quantitative skills in math, science, and computer science",
          category: "math",
          icon: "⚡",
          url: "https://brilliant.org",
          rating: 4.5,
          users: "10M+",
          lastUpdated: "2024-01-19",
          features: ["Interactive Problems", "Visual Learning", "Daily Challenges", "Guided Courses"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "freemium",
          ageGroup: "High School, College, Adult",
          subjects: ["Math", "Science", "Computer Science"]
        },
        {
          id: "9",
          name: "edX",
          description: "University-level courses from Harvard, MIT, and other top institutions",
          category: "university",
          icon: "🎯",
          url: "https://edx.org",
          rating: 4.3,
          users: "40M+",
          lastUpdated: "2024-01-17",
          features: ["University Courses", "MicroMasters", "Professional Education", "Certificates"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "freemium",
          ageGroup: "College, Adult",
          subjects: ["Computer Science", "Business", "Engineering", "Humanities"]
        },
        {
          id: "10",
          name: "Memrise",
          description: "Language learning with spaced repetition and video from native speakers",
          category: "language",
          icon: "🧠",
          url: "https://memrise.com",
          rating: 4.2,
          users: "35M+",
          lastUpdated: "2024-01-13",
          features: ["Spaced Repetition", "Native Speaker Videos", "Offline Mode", "Community Courses"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "freemium",
          ageGroup: "All Ages",
          subjects: ["Languages"]
        }
      ];

      res.json(apps);
    } catch (error) {
      console.error("Error fetching apps hub data:", error);
      res.status(500).json({ message: "Failed to fetch external applications" });
    }
  });

  // Get app categories
  app.get('/api/apps-hub/categories', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const categories = [
        { id: "general", name: "General Education", description: "Comprehensive educational platforms" },
        { id: "language", name: "Languages", description: "Language learning applications" },
        { id: "programming", name: "Programming", description: "Coding and development tools" },
        { id: "math", name: "Mathematics", description: "Math learning and problem solving" },
        { id: "study", name: "Study Tools", description: "Flashcards, notes, and study aids" },
        { id: "university", name: "University", description: "Higher education and professional courses" }
      ];

      res.json(categories);
    } catch (error) {
      console.error("Error fetching app categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Track app usage for analytics
  app.post('/api/apps-hub/track-usage', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const { appId, action } = req.body;
      const userId = req.user?.id;

      // In production, this would store usage analytics
      console.log(`User ${userId} performed ${action} on app ${appId}`);

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking app usage:", error);
      res.status(500).json({ message: "Failed to track usage" });
    }
  });
}