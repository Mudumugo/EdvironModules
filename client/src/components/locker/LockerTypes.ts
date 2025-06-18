export interface LockerItem {
  id: number;
  userId: string;
  itemType: 'notebook' | 'resource' | 'bookmark';
  title: string;
  description?: string;
  originalResourceId?: number;
  content?: string;
  annotations?: any;
  metadata?: any;
  fileUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  gradeLevel: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  shareSettings?: any;
  isArchived: boolean;
  viewCount: number;
  isFavorite: boolean;
}

export interface LockerStats {
  totalItems: number;
  notebooks: number;
  resources: number;
  bookmarks: number;
  storageUsed: string;
  storageLimit: string;
  gradeProgression: {
    grade: string;
    itemCount: number;
    completionRate: number;
  }[];
}

export interface LockerSearchFilters {
  type: string;
  subject: string;
  grade: string;
  tags: string[];
  dateRange: string;
  favorites: boolean;
  archived: boolean;
}