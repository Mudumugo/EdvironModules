import type { LibraryResource } from "@/pages/DigitalLibraryNew";
import { BOOK_VIEWER_TYPES, WORKSHEET_VIEWER_TYPES } from "./types";

// Check if a resource should use the enhanced BookViewer
export function shouldUseBookViewer(resource: any): boolean {
  const resourceType = resource.resourceType || resource.type || '';
  return BOOK_VIEWER_TYPES.includes(resourceType.toLowerCase());
}

// Check if a resource should use the WorksheetViewer
export function shouldUseWorksheetViewer(resource: any): boolean {
  const resourceType = resource.resourceType || resource.type || '';
  return WORKSHEET_VIEWER_TYPES.includes(resourceType.toLowerCase());
}

// Calculate appropriate page count based on resource properties
export function calculatePageCount(resource: LibraryResource): number {
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

// Extract subject from curriculum string
export function extractSubjectFromCurriculum(curriculum: string | null): string {
  if (!curriculum) return 'General';
  
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Art', 'Music'];
  const found = subjects.find(subject => 
    curriculum.toLowerCase().includes(subject.toLowerCase())
  );
  
  return found || curriculum.split(' ')[0] || 'General';
}