import type { LibraryResource } from "@/pages/DigitalLibraryNew";
import { BookConfig, WorksheetConfig } from "./types";
import { DEFAULT_MEDIA_ASSETS, DEFAULT_INTERACTIVE_ELEMENTS } from "./mediaAssets";
import { generateBookPages } from "./pageGenerators";
import { generateWorksheetPages, generateWorksheetInstructions } from "./worksheetGenerators";
import { calculatePageCount, extractSubjectFromCurriculum } from "./utils";

// Convert a resource to BookConfig format
export function convertResourceToBookConfig(resource: any): BookConfig {
  return {
    id: parseInt(resource.id.replace('lib_', '')) || 1,
    title: resource.title || 'Untitled',
    author: resource.author || 'Digital Learning Team',
    pages: generateBookPages(resource),
    totalPages: 15,
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description || '',
    grade: resource.grade || '',
    subject: resource.subject || '',
    language: resource.language || 'English',
    type: resource.resourceType || resource.type || 'book',
    isInteractive: true,
    hasVideo: true,
    hasAudio: true,
    xapiEnabled: true,
    content: resource.content || generateBookContent(resource),
    mediaAssets: DEFAULT_MEDIA_ASSETS,
    interactiveElements: DEFAULT_INTERACTIVE_ELEMENTS,
    trackingConfig: {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true,
    }
  };
}

// Convert a library resource to worksheet configuration
export function convertResourceToWorksheetConfig(resource: LibraryResource): WorksheetConfig {
  return {
    id: resource.id,
    title: resource.title,
    author: resource.authorId || 'Unknown Author',
    pages: generateWorksheetPages(resource),
    totalPages: calculatePageCount(resource),
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description,
    grade: resource.grade,
    subject: extractSubjectFromCurriculum(resource.curriculum),
    language: resource.language,
    type: resource.type,
    isInteractive: true,
    hasAnswerKey: true,
    xapiEnabled: true,
    content: resource.description || 'Interactive worksheet content',
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

// Generate book content based on resource
function generateBookContent(resource: any): string {
  return `
    <div class="book-content">
      <h1>${resource.title || 'Interactive Learning Content'}</h1>
      <p>${resource.description || 'Explore interactive educational content designed to enhance your learning experience.'}</p>
      
      <div class="content-features">
        <ul>
          <li>Interactive exercises and quizzes</li>
          <li>Multimedia content with videos and audio</li>
          <li>Progress tracking and analytics</li>
          <li>Personalized learning paths</li>
        </ul>
      </div>
    </div>
  `;
}