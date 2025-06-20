export interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  articles: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  rating: number;
  helpful: number;
  lastUpdated: string;
}

export interface ContactOption {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: string;
  availability: string;
}

export interface RoleContent {
  title: string;
  description: string;
  quickStart: string[];
  features: string[];
  tutorials: string[];
}

export interface InteractiveFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}