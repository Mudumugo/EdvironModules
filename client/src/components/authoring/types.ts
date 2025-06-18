export interface AuthoringStats {
  totalContent: number;
  published: number;
  inReview: number;
  drafts: number;
  viewsThisMonth: number;
  downloadsThisMonth: number;
  avgRating: number;
  revenue: number;
}

export interface ContentItem {
  id: string;
  title: string;
  status: string;
  type: string;
  subject: string;
  grade: string;
  views: number;
  rating: number | null;
  lastModified: string;
  publishedDate?: string;
  submittedDate?: string;
}

export interface ContentFormData {
  title: string;
  type: string;
  subject: string;
  grade: string;
  description: string;
}

export interface Taxonomy {
  subjects: string[];
  grades: string[];
  contentTypes: string[];
}