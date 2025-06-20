export interface MediaContent {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'image' | 'document' | 'interactive' | 'simulation';
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  size: number;
  format: string;
  description?: string;
  tags: string[];
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
  metadata: MediaMetadata;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  bitrate?: number;
  fps?: number;
  codec?: string;
  chapters?: MediaChapter[];
  captions?: MediaCaption[];
  annotations?: MediaAnnotation[];
  interactiveElements?: InteractiveElement[];
}

export interface MediaChapter {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  description?: string;
  thumbnailUrl?: string;
}

export interface MediaCaption {
  id: string;
  language: string;
  url: string;
  label: string;
  isDefault: boolean;
}

export interface MediaAnnotation {
  id: string;
  type: 'note' | 'highlight' | 'question' | 'link';
  timestamp: number;
  duration?: number;
  position?: { x: number; y: number };
  content: string;
  authorId: string;
  isPublic: boolean;
  createdAt: string;
}

export interface InteractiveElement {
  id: string;
  type: 'quiz' | 'poll' | 'hotspot' | 'overlay' | 'link';
  timestamp: number;
  duration?: number;
  position?: { x: number; y: number; width?: number; height?: number };
  data: any;
  isActive: boolean;
}

export interface ViewerSettings {
  autoplay: boolean;
  volume: number;
  playbackSpeed: number;
  quality: string;
  captions: boolean;
  captionLanguage: string;
  fullscreen: boolean;
  annotations: boolean;
  chapters: boolean;
}

export interface ViewerProgress {
  contentId: string;
  userId: string;
  currentTime: number;
  totalDuration: number;
  percentageWatched: number;
  completed: boolean;
  lastWatched: string;
  bookmarks: ViewerBookmark[];
  interactions: ViewerInteraction[];
}

export interface ViewerBookmark {
  id: string;
  timestamp: number;
  title: string;
  note?: string;
  createdAt: string;
}

export interface ViewerInteraction {
  id: string;
  type: 'play' | 'pause' | 'seek' | 'volume' | 'quality' | 'fullscreen' | 'annotation' | 'quiz_answer';
  timestamp: number;
  data?: any;
  sessionId: string;
  createdAt: string;
}

export const MEDIA_TYPES = [
  { value: 'video', label: 'Video', icon: 'Play', color: 'blue' },
  { value: 'audio', label: 'Audio', icon: 'Volume2', color: 'green' },
  { value: 'image', label: 'Image', icon: 'Image', color: 'purple' },
  { value: 'document', label: 'Document', icon: 'FileText', color: 'orange' },
  { value: 'interactive', label: 'Interactive', icon: 'MousePointer', color: 'pink' },
  { value: 'simulation', label: 'Simulation', icon: 'Zap', color: 'yellow' }
];

export const QUALITY_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: '720p', label: '720p HD' },
  { value: '480p', label: '480p' },
  { value: '360p', label: '360p' },
  { value: '240p', label: '240p' }
];

export const PLAYBACK_SPEEDS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' }
];