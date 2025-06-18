export interface DocumentNode {
  id: string;
  title: string;
  type: 'folder' | 'chapter' | 'scene' | 'note' | 'character' | 'research';
  content?: string;
  children?: DocumentNode[];
  expanded?: boolean;
  wordCount?: number;
  target?: number;
  status?: 'draft' | 'first-edit' | 'final' | 'complete';
  labels?: string[];
  created?: Date;
  modified?: Date;
}

export interface ResearchItem {
  id: string;
  title: string;
  type: 'web' | 'pdf' | 'image' | 'note' | 'reference';
  content: string;
  url?: string;
  tags: string[];
  created: Date;
}

export interface Character {
  id: string;
  name: string;
  role: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
  description: string;
  traits: string[];
  notes: string;
  avatar?: string;
}

export interface ProjectInfo {
  title: string;
  target: number;
  current: number;
  deadline: string;
}

export interface EditorState {
  activeDocument: string | null;
  viewMode: 'editor' | 'corkboard' | 'outline';
  editorMode: 'compose' | 'edit';
  splitView: boolean;
  showInspector: boolean;
  searchQuery: string;
}