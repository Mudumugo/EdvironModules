import type { LibraryResource } from "@/pages/DigitalLibraryNew";

export interface BookConfig {
  id: number;
  title: string;
  author: string;
  pages: string[];
  totalPages: number;
  thumbnailUrl?: string;
  description: string;
  grade: string;
  subject: string;
  language: string;
  type: string;
  isInteractive: boolean;
  hasVideo: boolean;
  hasAudio: boolean;
  xapiEnabled: boolean;
  content: string;
  mediaAssets: any[];
  interactiveElements: any[];
  trackingConfig: {
    trackPageViews: boolean;
    trackReadingTime: boolean;
    trackCompletionRate: boolean;
  };
}

// Resource types that should use the enhanced BookViewer
export const BOOK_VIEWER_TYPES = [
  'book',
  'ebook',
  'textbook',
  'storybook',
  'interactive_book',
  'flipbook',
  'digital_book',
  'reading_material'
];

// Resource types that should use the WorksheetViewer
export const WORKSHEET_VIEWER_TYPES = [
  'worksheet',
  'workbook',
  'exercise',
  'practice',
  'assignment',
  'activity',
  'quiz',
  'test'
];

// Check if a resource should use the enhanced BookViewer
export function shouldUseBookViewer(resource: LibraryResource): boolean {
  return BOOK_VIEWER_TYPES.includes(resource.type.toLowerCase());
}

// Check if a resource should use the WorksheetViewer
export function shouldUseWorksheetViewer(resource: LibraryResource): boolean {
  return WORKSHEET_VIEWER_TYPES.includes(resource.type.toLowerCase());
}

// Convert a library resource to book configuration
export function convertResourceToBookConfig(resource: LibraryResource): BookConfig {
  return {
    id: resource.id,
    title: resource.title,
    author: resource.authorId || 'Unknown Author',
    pages: generateSamplePages(resource),
    totalPages: calculatePageCount(resource),
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description,
    grade: resource.grade,
    subject: resource.curriculum,
    language: resource.language,
    type: resource.type,
    isInteractive: resource.type.includes('interactive') || resource.tags?.includes('interactive') || false,
    hasVideo: resource.tags?.includes('video') || resource.tags?.includes('multimedia') || false,
    hasAudio: resource.tags?.includes('audio') || resource.tags?.includes('sound') || false,
    xapiEnabled: true, // Enable learning analytics for all books
    content: resource.description,
    mediaAssets: [],
    interactiveElements: [],
    trackingConfig: {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true
    }
  };
}

// Generate sample book pages based on the resource
function generateSamplePages(resource: LibraryResource): string[] {
  const pageCount = calculatePageCount(resource);
  const pages = [];
  
  for (let i = 1; i <= pageCount; i++) {
    pages.push(`data:image/svg+xml,${encodeURIComponent(
      `<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#pageGradient)" stroke="#e9ecef" stroke-width="1"/>
        
        <!-- Header -->
        <text x="50%" y="8%" text-anchor="middle" font-family="Georgia, serif" font-size="28" font-weight="bold" fill="#2c3e50">${resource.title}</text>
        <line x1="10%" y1="10%" x2="90%" y2="10%" stroke="#3498db" stroke-width="2"/>
        
        <!-- Grade and Subject Badge -->
        <rect x="75%" y="12%" width="20%" height="6%" fill="#3498db" rx="8"/>
        <text x="85%" y="16%" text-anchor="middle" font-family="Arial" font-size="12" fill="white">Grade ${resource.grade}</text>
        
        <!-- Content Area -->
        <text x="10%" y="25%" font-family="Georgia, serif" font-size="16" font-weight="bold" fill="#2c3e50">Chapter ${i}: Educational Content</text>
        
        <text x="10%" y="32%" font-family="Arial" font-size="14" fill="#34495e">This page contains curriculum-aligned content from the CBE framework.</text>
        <text x="10%" y="38%" font-family="Arial" font-size="14" fill="#34495e">Subject: ${resource.curriculum || 'General Studies'}</text>
        <text x="10%" y="44%" font-family="Arial" font-size="14" fill="#34495e">Language: ${resource.language || 'English'}</text>
        
        <!-- Sample Content -->
        <rect x="10%" y="50%" width="80%" height="35%" fill="#ecf0f1" stroke="#bdc3c7" stroke-width="1" rx="4"/>
        <text x="12%" y="55%" font-family="Arial" font-size="13" fill="#2c3e50">Learning Objectives:</text>
        <text x="12%" y="60%" font-family="Arial" font-size="12" fill="#34495e">• Understand key concepts in ${resource.curriculum}</text>
        <text x="12%" y="65%" font-family="Arial" font-size="12" fill="#34495e">• Apply knowledge to real-world scenarios</text>
        <text x="12%" y="70%" font-family="Arial" font-size="12" fill="#34495e">• Develop critical thinking skills</text>
        
        <text x="12%" y="78%" font-family="Arial" font-size="13" fill="#2c3e50">Page ${i} Content:</text>
        <text x="12%" y="83%" font-family="Arial" font-size="12" fill="#34495e">Interactive learning material designed for ${resource.grade} students</text>
        
        <!-- Footer -->
        <line x1="10%" y1="92%" x2="90%" y2="92%" stroke="#95a5a6" stroke-width="1"/>
        <text x="10%" y="96%" font-family="Arial" font-size="11" fill="#7f8c8d">© Edvirons Digital Library</text>
        <text x="90%" y="96%" text-anchor="end" font-family="Arial" font-size="11" fill="#7f8c8d">Page ${i} of ${pageCount}</text>
      </svg>`
    )}`);
  }
  
  return pages;
}

// Calculate appropriate page count based on resource properties
function calculatePageCount(resource: LibraryResource): number {
  // Base page count on resource type and grade level
  const basePages = {
    'book': 15,
    'ebook': 12,
    'textbook': 20,
    'storybook': 8,
    'interactive_book': 10,
    'flipbook': 6,
    'digital_book': 12,
    'reading_material': 5
  };
  
  const gradeMultiplier = {
    'Pre-K': 0.3,
    'K': 0.4,
    'Grade 1': 0.5,
    'Grade 2': 0.6,
    'Grade 3': 0.7,
    'Grade 4': 0.8,
    'Grade 5': 0.9,
    'Grade 6': 1.0,
    'Grade 7': 1.1,
    'Grade 8': 1.2,
    'Grade 9': 1.3,
    'Grade 10': 1.4,
    'Grade 11': 1.5,
    'Grade 12': 1.6
  };
  
  const base = basePages[resource.type.toLowerCase() as keyof typeof basePages] || 10;
  const multiplier = gradeMultiplier[resource.grade as keyof typeof gradeMultiplier] || 1.0;
  
  return Math.max(5, Math.min(25, Math.round(base * multiplier)));
}

// Convert a library resource to worksheet configuration
export function convertResourceToWorksheetConfig(resource: LibraryResource): any {
  return {
    id: resource.id,
    title: resource.title,
    author: resource.authorId || 'Unknown Author',
    pages: generateSamplePages(resource.type, calculatePageCount(resource)),
    totalPages: calculatePageCount(resource),
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description,
    grade: resource.grade,
    subject: extractSubjectFromCurriculum(resource.curriculum),
    language: resource.language,
    type: resource.type,
    isInteractive: resource.isInteractive,
    hasAnswerKey: true, // Most worksheets have answer keys
    xapiEnabled: resource.xapiEnabled,
    content: resource.content,
    instructions: generateWorksheetInstructions(resource),
    difficulty: resource.difficulty,
    duration: resource.duration,
    trackingConfig: {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true,
    }
  };
}

// Generate worksheet-specific instructions
function generateWorksheetInstructions(resource: LibraryResource): string {
  const baseInstructions = [
    "Read each question carefully before answering.",
    "Show your work where applicable.",
    "Use the answer key to check your responses when finished."
  ];
  
  if (resource.type === 'quiz' || resource.type === 'test') {
    baseInstructions.push("Time limit applies - work efficiently.");
  }
  
  if (resource.difficulty === 'hard') {
    baseInstructions.push("Take your time with complex problems.");
  }
  
  return baseInstructions.join(' ');
}

// Get appropriate toast message for all resource types
export function getBookOpenMessage(resource: LibraryResource): { title: string; description: string } {
  if (shouldUseBookViewer(resource)) {
    return {
      title: "Opening Immersive Reader",
      description: `Loading ${resource.type} with enhanced reading features`
    };
  }
  
  if (shouldUseWorksheetViewer(resource)) {
    return {
      title: "Opening Interactive Worksheet",
      description: `Loading ${resource.type} with worksheet tools and answer key`
    };
  }
  
  return {
    title: "Opening Preview",
    description: `Loading preview for ${resource.title}`
  };
}