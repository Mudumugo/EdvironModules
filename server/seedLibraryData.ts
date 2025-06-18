import { db } from "./db";
import { libraryCategories, librarySubjects, libraryResources } from "@shared/schema";

// Seed data for different grade levels
export async function seedLibraryData() {
  console.log("Seeding library data...");

  // Primary Categories
  const primaryCategories = [
    {
      id: 'primary_math',
      name: 'Mathematics',
      description: 'Numbers and basic calculations',
      gradeLevel: 'primary',
      icon: '🔢',
      color: 'from-blue-500 to-blue-600',
      sortOrder: 1
    },
    {
      id: 'primary_english',
      name: 'English',
      description: 'Reading and language development',
      gradeLevel: 'primary',
      icon: '📚',
      color: 'from-green-500 to-green-600',
      sortOrder: 2
    },
    {
      id: 'primary_kiswahili',
      name: 'Kiswahili',
      description: 'National language learning',
      gradeLevel: 'primary',
      icon: '🗣️',
      color: 'from-orange-500 to-orange-600',
      sortOrder: 3
    },
    {
      id: 'primary_science',
      name: 'Science & Technology',
      description: 'Explore the world around us',
      gradeLevel: 'primary',
      icon: '🔬',
      color: 'from-purple-500 to-purple-600',
      sortOrder: 4
    },
    {
      id: 'primary_social',
      name: 'Social Studies',
      description: 'Community and environment',
      gradeLevel: 'primary',
      icon: '🌍',
      color: 'from-teal-500 to-teal-600',
      sortOrder: 5
    },
    {
      id: 'primary_religious',
      name: 'Religious Education',
      description: 'Moral and spiritual development',
      gradeLevel: 'primary',
      icon: '🕊️',
      color: 'from-red-500 to-red-600',
      sortOrder: 6
    },
    {
      id: 'primary_creative',
      name: 'Creative Arts',
      description: 'Music, art and creativity',
      gradeLevel: 'primary',
      icon: '🎨',
      color: 'from-pink-500 to-pink-600',
      sortOrder: 7
    }
  ];

  // Junior Secondary Categories
  const juniorSecondaryCategories = [
    {
      id: 'js_mathematics',
      name: 'Mathematics',
      description: 'Advanced mathematical concepts',
      gradeLevel: 'junior_secondary',
      icon: '📐',
      color: 'from-green-500 to-green-600',
      sortOrder: 1
    },
    {
      id: 'js_english',
      name: 'English Language',
      description: 'Communication and literature',
      gradeLevel: 'junior_secondary',
      icon: '📖',
      color: 'from-blue-500 to-blue-600',
      sortOrder: 2
    },
    {
      id: 'js_kiswahili',
      name: 'Kiswahili',
      description: 'Advanced Kiswahili studies',
      gradeLevel: 'junior_secondary',
      icon: '🗣️',
      color: 'from-purple-500 to-purple-600',
      sortOrder: 3
    },
    {
      id: 'js_science',
      name: 'Integrated Science',
      description: 'Physics, Chemistry, Biology',
      gradeLevel: 'junior_secondary',
      icon: '⚗️',
      color: 'from-teal-500 to-teal-600',
      sortOrder: 4
    },
    {
      id: 'js_computer',
      name: 'Computer Science',
      description: 'Digital literacy and programming',
      gradeLevel: 'junior_secondary',
      icon: '💻',
      color: 'from-red-500 to-red-600',
      sortOrder: 5
    },
    {
      id: 'js_creative',
      name: 'Creative Arts & PE',
      description: 'Arts, music and physical education',
      gradeLevel: 'junior_secondary',
      icon: '🎭',
      color: 'from-orange-500 to-orange-600',
      sortOrder: 6
    },
    {
      id: 'js_social',
      name: 'Social Studies',
      description: 'History, Geography, Civics',
      gradeLevel: 'junior_secondary',
      icon: '🌍',
      color: 'from-indigo-500 to-indigo-600',
      sortOrder: 7
    },
    {
      id: 'js_skills',
      name: 'Pre-Technical & Vocational',
      description: 'Practical skills development',
      gradeLevel: 'junior_secondary',
      icon: '🔧',
      color: 'from-yellow-500 to-yellow-600',
      sortOrder: 8
    }
  ];

  // Senior Secondary Categories
  const seniorSecondaryCategories = [
    {
      id: 'ss_mathematics',
      name: 'Mathematics',
      description: 'Advanced calculus and statistics',
      gradeLevel: 'senior_secondary',
      icon: '∫',
      color: 'from-blue-500 to-blue-600',
      sortOrder: 1
    },
    {
      id: 'ss_english',
      name: 'English Language',
      description: 'Literature and advanced communication',
      gradeLevel: 'senior_secondary',
      icon: '📚',
      color: 'from-green-500 to-green-600',
      sortOrder: 2
    },
    {
      id: 'ss_kiswahili',
      name: 'Kiswahili',
      description: 'Advanced Kiswahili and literature',
      gradeLevel: 'senior_secondary',
      icon: '📜',
      color: 'from-purple-500 to-purple-600',
      sortOrder: 3
    },
    {
      id: 'ss_physics',
      name: 'Physics',
      description: 'Advanced physics concepts',
      gradeLevel: 'senior_secondary',
      icon: '⚛️',
      color: 'from-blue-500 to-blue-600',
      sortOrder: 4
    },
    {
      id: 'ss_chemistry',
      name: 'Chemistry',
      description: 'Organic and inorganic chemistry',
      gradeLevel: 'senior_secondary',
      icon: '🧪',
      color: 'from-teal-500 to-teal-600',
      sortOrder: 5
    },
    {
      id: 'ss_biology',
      name: 'Biology',
      description: 'Life sciences and ecology',
      gradeLevel: 'senior_secondary',
      icon: '🧬',
      color: 'from-green-500 to-green-600',
      sortOrder: 6
    },
    {
      id: 'ss_history',
      name: 'History & Government',
      description: 'Historical studies and civics',
      gradeLevel: 'senior_secondary',
      icon: '🏛️',
      color: 'from-red-500 to-red-600',
      sortOrder: 7
    },
    {
      id: 'ss_geography',
      name: 'Geography',
      description: 'Physical and human geography',
      gradeLevel: 'senior_secondary',
      icon: '🗺️',
      color: 'from-orange-500 to-orange-600',
      sortOrder: 8
    }
  ];

  try {
    // Insert categories
    const allCategories = [...primaryCategories, ...juniorSecondaryCategories, ...seniorSecondaryCategories];
    
    for (const category of allCategories) {
      await db.insert(libraryCategories).values(category).onConflictDoNothing();
    }

    // Sample resources for each category
    const sampleResources = [
      // Primary Math Resources
      {
        id: 'primary_math_counting',
        title: 'Counting and Numbers 1-100',
        description: 'Learn to count from 1 to 100 with fun activities and games',
        categoryId: 'primary_math',
        resourceType: 'book',
        gradeLevel: 'primary',
        difficulty: 'beginner',
        thumbnailUrl: '/api/placeholder/200/150',
        tags: ['counting', 'numbers', 'basic math'],
        isFeatured: true,
        viewCount: 150,
        rating: '4.8'
      },
      {
        id: 'primary_math_shapes',
        title: 'Shapes and Patterns Worksheet',
        description: 'Interactive worksheet for learning basic shapes and patterns',
        categoryId: 'primary_math',
        resourceType: 'worksheet',
        gradeLevel: 'primary',
        difficulty: 'beginner',
        thumbnailUrl: '/api/placeholder/200/150',
        tags: ['shapes', 'patterns', 'geometry'],
        viewCount: 89,
        rating: '4.5'
      },
      
      // Junior Secondary Science
      {
        id: 'js_science_chemistry',
        title: 'Introduction to Chemical Reactions',
        description: 'Understanding basic chemical reactions and equations',
        categoryId: 'js_science',
        resourceType: 'video',
        gradeLevel: 'junior_secondary',
        difficulty: 'intermediate',
        duration: 25,
        thumbnailUrl: '/api/placeholder/200/150',
        tags: ['chemistry', 'reactions', 'equations'],
        isFeatured: true,
        viewCount: 234,
        rating: '4.7'
      },
      
      // Senior Secondary Physics
      {
        id: 'ss_physics_mechanics',
        title: 'Advanced Mechanics: Forces and Motion',
        description: 'Comprehensive guide to Newtonian mechanics',
        categoryId: 'ss_physics',
        resourceType: 'book',
        gradeLevel: 'senior_secondary',
        difficulty: 'advanced',
        thumbnailUrl: '/api/placeholder/200/150',
        tags: ['physics', 'mechanics', 'newton', 'forces'],
        isFeatured: true,
        viewCount: 345,
        rating: '4.9'
      }
    ];

    for (const resource of sampleResources) {
      await db.insert(libraryResources).values({
        ...resource,
        publishedDate: new Date(),
        isPublic: true,
        downloadCount: 0,
        ratingCount: Math.floor(Math.random() * 50) + 10
      }).onConflictDoNothing();
    }

    console.log("Library data seeded successfully!");
  } catch (error) {
    console.error("Error seeding library data:", error);
  }
}