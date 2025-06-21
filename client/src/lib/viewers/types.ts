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

export interface ViewerConfig {
  enableTracking: boolean;
  enableInteractivity: boolean;
  enableAnnotations: boolean;
  enableDownload: boolean;
  enablePrint: boolean;
  enableFullscreen: boolean;
  pageTransition: 'fade' | 'slide' | 'flip';
  theme: 'light' | 'dark' | 'auto';
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  metadata: Record<string, any>;
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'hotspot' | 'annotation' | 'link';
  position: { x: number; y: number };
  data: Record<string, any>;
}