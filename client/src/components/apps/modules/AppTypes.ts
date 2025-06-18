export interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  price: string;
  icon: string;
  featured: boolean;
  trending: boolean;
  recommended: boolean;
  popular: boolean;
  essential: boolean;
  premium: boolean;
  tags: string[];
  url: string;
}

export interface AppStatsProps {
  totalApps: number;
  featuredApps: number;
  categoriesCount: number;
}

export interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  categories: string[];
}

export interface AppCardProps {
  app: App;
  variant?: "featured" | "regular";
}

export interface AppGridProps {
  apps: App[];
  viewMode: "grid" | "list";
  isLoading?: boolean;
}