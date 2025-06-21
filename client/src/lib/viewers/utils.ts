import { 
  BOOK_VIEWER_TYPES, 
  WORKSHEET_VIEWER_TYPES, 
  VIDEO_VIEWER_TYPES, 
  PDF_VIEWER_TYPES,
  SUPPORTED_FORMATS 
} from './constants';
import type { BookConfig, ViewerConfig } from './types';

export function shouldUseBookViewer(resourceType: string): boolean {
  return BOOK_VIEWER_TYPES.includes(resourceType.toLowerCase());
}

export function getViewerType(resourceType: string, fileExtension?: string): string {
  const lowerType = resourceType.toLowerCase();
  const lowerExt = fileExtension?.toLowerCase();

  if (BOOK_VIEWER_TYPES.includes(lowerType)) {
    return 'book';
  }
  
  if (WORKSHEET_VIEWER_TYPES.includes(lowerType)) {
    return 'worksheet';
  }
  
  if (VIDEO_VIEWER_TYPES.includes(lowerType)) {
    return 'video';
  }
  
  if (PDF_VIEWER_TYPES.includes(lowerType)) {
    return 'pdf';
  }

  // Fallback to file extension
  if (lowerExt) {
    if (SUPPORTED_FORMATS.images.includes(lowerExt)) {
      return 'image';
    }
    if (SUPPORTED_FORMATS.videos.includes(lowerExt)) {
      return 'video';
    }
    if (SUPPORTED_FORMATS.audio.includes(lowerExt)) {
      return 'audio';
    }
    if (SUPPORTED_FORMATS.documents.includes(lowerExt)) {
      return 'pdf';
    }
  }

  return 'generic';
}

export function validateBookConfig(config: Partial<BookConfig>): string[] {
  const errors: string[] = [];

  if (!config.id || typeof config.id !== 'number') {
    errors.push('Book ID is required and must be a number');
  }

  if (!config.title || typeof config.title !== 'string') {
    errors.push('Book title is required');
  }

  if (!config.author || typeof config.author !== 'string') {
    errors.push('Book author is required');
  }

  if (!Array.isArray(config.pages) || config.pages.length === 0) {
    errors.push('Book must have at least one page');
  }

  if (config.totalPages && config.totalPages !== config.pages?.length) {
    errors.push('Total pages count does not match pages array length');
  }

  return errors;
}

export function generateBookPages(content: string, pageSize = 1000): string[] {
  if (!content || typeof content !== 'string') {
    return [''];
  }

  const pages: string[] = [];
  const words = content.split(/\s+/);
  let currentPage = '';
  let wordCount = 0;

  for (const word of words) {
    if (wordCount >= pageSize && currentPage.length > 0) {
      pages.push(currentPage.trim());
      currentPage = '';
      wordCount = 0;
    }
    
    currentPage += (currentPage ? ' ' : '') + word;
    wordCount++;
  }

  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }

  return pages.length > 0 ? pages : [''];
}

export function extractFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.slice(lastDot + 1) : '';
}

export function mergeViewerConfig(base: ViewerConfig, overrides: Partial<ViewerConfig>): ViewerConfig {
  return { ...base, ...overrides };
}

export function sanitizeContent(content: string): string {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '');
}

export function convertResourceToBookConfig(resource: any): BookConfig {
  return {
    id: resource.id || 0,
    title: resource.title || 'Untitled',
    author: resource.author || 'Unknown',
    pages: resource.pages || generateBookPages(resource.content || ''),
    totalPages: resource.totalPages || resource.pages?.length || 0,
    thumbnailUrl: resource.thumbnailUrl,
    description: resource.description || '',
    grade: resource.grade || '',
    subject: resource.subject || '',
    language: resource.language || 'English',
    type: resource.type || 'book',
    isInteractive: resource.isInteractive || false,
    hasVideo: resource.hasVideo || false,
    hasAudio: resource.hasAudio || false,
    xapiEnabled: resource.xapiEnabled || false,
    content: resource.content || '',
    mediaAssets: resource.mediaAssets || [],
    interactiveElements: resource.interactiveElements || [],
    trackingConfig: resource.trackingConfig || {
      trackPageViews: true,
      trackReadingTime: true,
      trackCompletionRate: true
    }
  };
}

export function getBookOpenMessage(resourceType: string): string {
  const messages = {
    book: 'Opening book...',
    ebook: 'Loading e-book...',
    textbook: 'Opening textbook...',
    worksheet: 'Loading worksheet...',
    document: 'Opening document...',
    pdf: 'Loading PDF...',
  };
  
  return messages[resourceType as keyof typeof messages] || 'Opening resource...';
}

export function generateBookMetadata(config: BookConfig) {
  return {
    title: config.title,
    author: config.author,
    pageCount: config.totalPages,
    language: config.language,
    subject: config.subject,
    grade: config.grade,
    hasInteractivity: config.isInteractive,
    hasMultimedia: config.hasVideo || config.hasAudio,
    estimatedReadTime: Math.ceil(config.totalPages * 2), // 2 minutes per page estimate
  };
}

export function shouldUseWorksheetViewer(resourceType: string): boolean {
  return WORKSHEET_VIEWER_TYPES.includes(resourceType.toLowerCase());
}

export function convertResourceToWorksheetConfig(resource: any) {
  return {
    id: resource.id || 0,
    title: resource.title || 'Untitled Worksheet',
    type: resource.type || 'worksheet',
    content: resource.content || '',
    instructions: resource.instructions || '',
    exercises: resource.exercises || [],
    grade: resource.grade || '',
    subject: resource.subject || '',
    difficulty: resource.difficulty || 'medium'
  };
}