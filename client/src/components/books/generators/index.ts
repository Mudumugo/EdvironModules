// Re-export all generator functions for easy importing
export * from './CoverPageGenerator';
export * from './InteractivePageGenerator';

// Legacy exports for backward compatibility
export { generateMultimediaCoverPage } from './CoverPageGenerator';
export { generateQuizPage, generateClickableImagePage, generateDragDropPage } from './InteractivePageGenerator';