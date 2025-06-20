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

export interface WorksheetConfig {
  id: string;
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
  hasAnswerKey: boolean;
  xapiEnabled: boolean;
  content: string;
  instructions: string;
  difficulty?: string;
  duration?: string;
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