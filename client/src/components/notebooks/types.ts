export interface Notebook {
  id: string;
  title: string;
  description?: string;
  coverImage?: string;
  tags: string[];
  subject: string;
  isPublic: boolean;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  authorName: string;
  pages: NotebookPage[];
  collaborators: NotebookCollaborator[];
  viewCount: number;
  likeCount: number;
  isLiked: boolean;
  template?: string;
}

export interface NotebookPage {
  id: string;
  title: string;
  content: PageContent[];
  order: number;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
  comments: PageComment[];
}

export interface PageContent {
  id: string;
  type: 'text' | 'image' | 'drawing' | 'equation' | 'table' | 'embed' | 'attachment';
  data: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
  order: number;
  style?: ContentStyle;
}

export interface ContentStyle {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export interface PageComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  position?: { x: number; y: number };
  isResolved: boolean;
}

export interface NotebookCollaborator {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  role: 'viewer' | 'editor' | 'owner';
  addedAt: string;
}

export interface NotebookTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  pages: Partial<NotebookPage>[];
  isPublic: boolean;
}

export interface NotebookFilter {
  subject?: string;
  tags?: string[];
  author?: string;
  isPublic?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export const NOTEBOOK_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Geography',
  'Art',
  'Music',
  'Physical Education',
  'Computer Science',
  'Foreign Languages',
  'Other'
];

export const CONTENT_TYPES = [
  { value: 'text', label: 'Text', icon: 'Type' },
  { value: 'image', label: 'Image', icon: 'Image' },
  { value: 'drawing', label: 'Drawing', icon: 'Pen' },
  { value: 'equation', label: 'Equation', icon: 'Calculator' },
  { value: 'table', label: 'Table', icon: 'Table' },
  { value: 'embed', label: 'Embed', icon: 'Link' },
  { value: 'attachment', label: 'Attachment', icon: 'Paperclip' }
];

export const COLLABORATOR_ROLES = [
  { value: 'viewer', label: 'Viewer', description: 'Can view notebook' },
  { value: 'editor', label: 'Editor', description: 'Can edit notebook' },
  { value: 'owner', label: 'Owner', description: 'Full control' }
];