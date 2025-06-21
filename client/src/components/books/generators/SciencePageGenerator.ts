import { useSciencePageGenerator } from "@/hooks/useSciencePageGenerator";

// Export the main generator function for backward compatibility
export const generateScienceExperimentPage = (title: string, experiment: any) => {
  // Use the hook's generator function
  const { generateExperimentPage } = useSciencePageGenerator();
  return generateExperimentPage();
};

// Export utility functions
export const createSafetyGuidelines = (notes: string[]) => {
  return notes.map(note => `⚠️ ${note}`).join('\n');
};

export const formatProcedureSteps = (steps: string[]) => {
  return steps.map((step, index) => `${index + 1}. ${step}`).join('\n');
};

export const generateMaterialsList = (materials: string[]) => {
  return materials.map(material => `• ${material}`).join('\n');
};

// Export experiment templates
export const SCIENCE_EXPERIMENT_TEMPLATES = [
  {
    title: "Density and Buoyancy",
    grade: "7",
    subject: "Physics",
    materials: ["Water", "Oil", "Various objects", "Measuring cylinder"],
    objective: "To investigate the relationship between density and buoyancy",
    safetyNotes: ["Handle glass equipment carefully", "Clean up spills immediately"]
  },
  {
    title: "Plant Photosynthesis",
    grade: "6", 
    subject: "Biology",
    materials: ["Aquatic plants", "Test tubes", "Water", "Light source"],
    objective: "To observe oxygen production during photosynthesis",
    safetyNotes: ["Do not touch electrical equipment with wet hands"]
  },
  {
    title: "Chemical Reactions",
    grade: "8",
    subject: "Chemistry", 
    materials: ["Baking soda", "Vinegar", "Test tubes", "pH strips"],
    objective: "To observe and identify different types of chemical reactions",
    safetyNotes: ["Wear safety goggles", "Do not taste any chemicals"]
  }
];

// Difficulty level constants
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate', 
  ADVANCED: 'advanced'
} as const;

// Subject area constants
export const SCIENCE_SUBJECTS = {
  PHYSICS: 'Physics',
  CHEMISTRY: 'Chemistry',
  BIOLOGY: 'Biology',
  EARTH_SCIENCE: 'Earth Science'
} as const;