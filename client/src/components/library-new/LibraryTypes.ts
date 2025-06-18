export interface LibraryResource {
  id: number;
  title: string;
  type: string;
  grade: string;
  curriculum: string;
  description: string;
  difficulty: string;
  duration: number;
  tags: string[];
  viewCount: number;
  rating: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  accessTier: string;
  isPublished: boolean;
  authorId: string;
  language: string;
}

export interface LibraryState {
  activeTab: string;
  searchQuery: string;
  viewMode: "grid" | "list";
  selectedResource: LibraryResource | null;
  showBookViewer: boolean;
  currentBook: any | null;
  showWorksheetViewer: boolean;
  currentWorksheet: any | null;
}