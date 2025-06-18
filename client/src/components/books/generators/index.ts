// Re-export all generator functions for easy importing
export * from './CoverPageGenerator';
export * from './InteractivePageGenerator';
export * from './VideoPageGenerator';
export * from './SciencePageGenerator';

// Legacy exports for backward compatibility
export { generateCoverPage as generateMultimediaCoverPage } from './CoverPageGenerator';