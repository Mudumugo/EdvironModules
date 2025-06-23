import { db } from "./db";
import { globalAppsHub, globalAppCategories } from "../shared/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

export async function seedAppsData(tenantId: string = "default") {
  console.log("Seeding Apps Hub data...");

  try {
    // Check if data already exists
    const existingApps = await db.select().from(globalAppsHub).limit(1);
    
    if (existingApps.length > 0) {
      console.log("Apps Hub data already exists, skipping seed");
      return;
    }

    // Seed categories first
    const categories = [
      {
        id: "education",
        name: "Education",
        description: "Educational learning platforms and tools",
        icon: "🎓",
        color: "#3B82F6",
        sortOrder: 1,
        tenantId
      },
      {
        id: "productivity", 
        name: "Productivity",
        description: "Tools for productivity and organization",
        icon: "⚡",
        color: "#10B981",
        sortOrder: 2,
        tenantId
      },
      {
        id: "programming",
        name: "Programming", 
        description: "Coding and development tools",
        icon: "💻",
        color: "#8B5CF6",
        sortOrder: 3,
        tenantId
      },
      {
        id: "mathematics",
        name: "Mathematics",
        description: "Math learning and calculation tools", 
        icon: "📐",
        color: "#F59E0B",
        sortOrder: 4,
        tenantId
      },
      {
        id: "design",
        name: "Design",
        description: "Creative design and visual tools",
        icon: "🎨", 
        color: "#EF4444",
        sortOrder: 5,
        tenantId
      },
      {
        id: "communication",
        name: "Communication",
        description: "Video calls and messaging platforms",
        icon: "📱",
        color: "#06B6D4",
        sortOrder: 6,
        tenantId
      },
      {
        id: "languages",
        name: "Languages", 
        description: "Language learning applications",
        icon: "🌍",
        color: "#84CC16",
        sortOrder: 7,
        tenantId
      },
      {
        id: "gaming",
        name: "Gaming",
        description: "Educational games and entertainment",
        icon: "🎮",
        color: "#F97316", 
        sortOrder: 8,
        tenantId
      }
    ];

    await db.insert(globalAppCategories).values(categories);
    console.log("Seeded app categories");

    // Seed apps
    const apps = [
      {
        id: uuidv4(),
        name: "Khan Academy",
        description: "Free online courses, lessons and practice for math, science, and more",
        category: "education",
        rating: "4.8",
        downloads: "50M+",
        price: "Free",
        icon: "🎓",
        url: "https://khanacademy.org",
        internal: false,
        featured: true,
        trending: true,
        recommended: true,
        popular: true,
        essential: true,
        premium: false,
        tags: ["Education", "Math", "Science", "Free"],
        targetAudience: ["student", "teacher"],
        gradeLevel: ["elementary", "middle", "high"],
        status: "active"
      },
      {
        id: uuidv4(),
        name: "Duolingo", 
        description: "Learn languages for free with fun, bite-sized lessons",
        category: "languages",
        rating: "4.7",
        downloads: "100M+", 
        price: "Freemium",
        icon: "🦜",
        url: "https://duolingo.com",
        internal: false,
        featured: true,
        trending: false,
        recommended: true,
        popular: true,
        essential: false,
        premium: false,
        tags: ["Languages", "Learning", "Fun", "Interactive"],
        targetAudience: ["student"],
        gradeLevel: ["elementary", "middle", "high", "college"],
        status: "active"
      },
      {
        id: uuidv4(),
        name: "EdVirons Digital Library",
        description: "Access thousands of educational resources, books, and interactive content",
        category: "education",
        rating: "4.9",
        downloads: "1M+",
        price: "Included", 
        icon: "📚",
        url: "/digital-library",
        internal: true,
        featured: true,
        trending: false,
        recommended: true,
        popular: true,
        essential: true,
        premium: false,
        tags: ["Books", "Resources", "Reading", "Research"],
        targetAudience: ["student", "teacher"],
        gradeLevel: ["elementary", "middle", "high", "college"],
        status: "active",
        tenantId
      },
      {
        id: uuidv4(),
        name: "EdVirons Locker",
        description: "Personal cloud storage for assignments, projects, and school files",
        category: "productivity",
        rating: "4.8",
        downloads: "1M+",
        price: "Included",
        icon: "🗂️", 
        url: "/my-locker",
        internal: true,
        featured: true,
        trending: false,
        recommended: true,
        popular: true,
        essential: true,
        premium: false,
        tags: ["Storage", "Files", "Organization", "Cloud"],
        targetAudience: ["student", "teacher"],
        gradeLevel: ["elementary", "middle", "high", "college"],
        status: "active",
        tenantId
      },
      {
        id: uuidv4(),
        name: "Scratch",
        description: "Visual programming language for creating interactive stories and games",
        category: "programming",
        rating: "4.6",
        downloads: "80M+",
        price: "Free",
        icon: "🐱",
        url: "https://scratch.mit.edu",
        internal: false,
        featured: false,
        trending: true,
        recommended: false,
        popular: true,
        essential: false,
        premium: false,
        tags: ["Programming", "Creative", "Kids", "Visual"],
        targetAudience: ["student"],
        gradeLevel: ["elementary", "middle"],
        status: "active",
        tenantId
      },
      {
        id: uuidv4(),
        name: "Photomath",
        description: "Solve math problems using your camera with step-by-step explanations",
        category: "mathematics",
        rating: "4.4", 
        downloads: "220M+",
        price: "Freemium",
        icon: "📐",
        url: "https://photomath.com",
        internal: false,
        featured: false,
        trending: false,
        recommended: true,
        popular: true,
        essential: true,
        premium: false,
        tags: ["Math", "Camera", "Solutions", "Step-by-step"],
        targetAudience: ["student"],
        gradeLevel: ["middle", "high", "college"],
        status: "active",
        tenantId
      },
      {
        id: uuidv4(),
        name: "Canva",
        description: "Design anything and publish anywhere with professional templates",
        category: "design",
        rating: "4.5",
        downloads: "500M+",
        price: "Freemium",
        icon: "🎨",
        url: "https://canva.com",
        internal: false,
        featured: true,
        trending: false,
        recommended: false,
        popular: true,
        essential: false,
        premium: true,
        tags: ["Design", "Graphics", "Templates", "Creative"],
        targetAudience: ["student", "teacher"],
        gradeLevel: ["middle", "high", "college"],
        status: "active",
        tenantId
      },
      {
        id: uuidv4(),
        name: "Zoom",
        description: "Video communications platform for online classes and meetings",
        category: "communication",
        rating: "4.3",
        downloads: "1B+",
        price: "Freemium", 
        icon: "📹",
        url: "https://zoom.us",
        internal: false,
        featured: false,
        trending: false,
        recommended: true,
        popular: true,
        essential: true,
        premium: false,
        tags: ["Video", "Communication", "Meetings", "Online Classes"],
        targetAudience: ["student", "teacher"],
        gradeLevel: ["elementary", "middle", "high", "college"],
        status: "active",
        tenantId
      }
    ];

    await db.insert(globalAppsHub).values(apps);
    console.log("Seeded apps data");
    console.log("Apps Hub data seeding completed successfully");

  } catch (error) {
    console.error("Error seeding Apps Hub data:", error);
    throw error;
  }
}