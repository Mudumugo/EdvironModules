// Re-export everything from the modular viewer system
export * from './viewers/types';
export * from './viewers/constants';
export * from './viewers/utils';

// Legacy exports for backward compatibility
export { 
  BOOK_VIEWER_TYPES, 
  WORKSHEET_VIEWER_TYPES 
} from './viewers/constants';

export type { 
  BookConfig, 
  ViewerConfig, 
  MediaAsset, 
  InteractiveElement 
} from './viewers/types';