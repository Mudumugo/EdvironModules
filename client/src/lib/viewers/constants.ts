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

// Resource types that should use the VideoViewer
export const VIDEO_VIEWER_TYPES = [
  'video',
  'movie',
  'documentary',
  'tutorial',
  'lecture',
  'animation',
  'educational_video'
];

// Resource types that should use the PDFViewer
export const PDF_VIEWER_TYPES = [
  'pdf',
  'document',
  'presentation',
  'slides'
];

// Supported file formats
export const SUPPORTED_FORMATS = {
  images: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  videos: ['mp4', 'webm', 'ogg', 'avi', 'mov'],
  audio: ['mp3', 'wav', 'ogg', 'aac'],
  documents: ['pdf', 'doc', 'docx', 'ppt', 'pptx']
};

// Default viewer configurations
export const DEFAULT_BOOK_CONFIG = {
  enableTracking: true,
  enableInteractivity: true,
  enableAnnotations: true,
  enableDownload: false,
  enablePrint: true,
  enableFullscreen: true,
  pageTransition: 'slide' as const,
  theme: 'auto' as const
};

export const DEFAULT_WORKSHEET_CONFIG = {
  enableTracking: true,
  enableInteractivity: true,
  enableAnnotations: true,
  enableDownload: true,
  enablePrint: true,
  enableFullscreen: true,
  pageTransition: 'fade' as const,
  theme: 'light' as const
};