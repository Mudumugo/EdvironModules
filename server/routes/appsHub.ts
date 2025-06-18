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
          description: "Free online courses, lessons and practice for students of all ages",
          category: "general",
          icon: "🎓",
          url: "https://khanacademy.org",
          rating: 4.8,
          users: "120M+",
          lastUpdated: "2024-01-15",
          features: ["Video Lessons", "Practice Exercises", "Progress Tracking", "Personalized Learning"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "free",
          ageGroup: "K-12, College",
          subjects: ["Math", "Science", "Programming", "History"]
        },
        {
          id: "2",
          name: "Duolingo",
          description: "Learn languages through gamified lessons and daily practice",
          category: "language",
          icon: "🦜",
          url: "https://duolingo.com",
          rating: 4.7,
          users: "500M+",
          lastUpdated: "2024-01-20",
          features: ["Gamification", "Speaking Practice", "Streak System", "Community"],
          platforms: ["Web", "iOS", "Android"],
          pricing: "freemium",
          ageGroup: "All Ages",
          subjects: ["Languages"]
        },
        {
          id: "3",
          name: "Scratch",
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