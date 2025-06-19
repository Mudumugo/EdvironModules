import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search, 
  Grid3X3, 
  List, 
  Star, 
  Download, 
  ExternalLink,
  TrendingUp,
  Crown,
  Zap,
  Filter,
  SortAsc,
  Eye,
  Heart,
  Share2,
  Play,
  Sparkles
} from "lucide-react";

interface App {
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
  internal?: boolean;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

export default function AppsHub() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [filterBy, setFilterBy] = useState("all");

  // Fetch apps
  const { data: apps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ["/api/apps-hub"],
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/apps-hub/categories"],
  });

  // Track app usage
  const trackUsageMutation = useMutation({
    mutationFn: async ({ appId, action }: { appId: string; action: string }) => {
      return apiRequest("/api/apps-hub/track-usage", {
        method: "POST",
        body: { appId, action }
      });
    },
    onSuccess: () => {
      // Optionally show success message
    }
  });

  const handleAppOpen = (app: App) => {
    trackUsageMutation.mutate({ appId: app.id, action: "open" });
    
    if (app.internal) {
      // Internal app - navigate to route
      window.location.href = app.url;
    } else {
      // External app - open in new tab
      window.open(app.url, '_blank', 'noopener,noreferrer');
    }
  };

  const filteredAndSortedApps = (apps || [])
    .filter((app: App) => {
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || app.category === selectedCategory;
      const matchesFilter = filterBy === "all" || 
                           (filterBy === "featured" && app.featured) ||
                           (filterBy === "trending" && app.trending) ||
                           (filterBy === "recommended" && app.recommended) ||
                           (filterBy === "essential" && app.essential) ||
                           (filterBy === "premium" && app.premium) ||
                           (filterBy === "free" && !app.premium);
      return matchesSearch && matchesCategory && matchesFilter;
    })
    .sort((a: App, b: App) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.rating - a.rating;
        case "popularity":
          return b.popular ? 1 : -1;
        case "featured":
        default:
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.rating - a.rating;
      }
    });

  const featuredApps = (apps || []).filter(app => app.featured);
  const trendingApps = (apps || []).filter(app => app.trending);
  const essentialApps = (apps || []).filter(app => app.essential);

  const getPriceColor = (price: string) => {
    if (price === "Free" || price === "Included") return "text-green-600";
    if (price === "Freemium") return "text-blue-600";
    return "text-orange-600";
  };

  const AppCard = ({ app, variant = "default" }: { app: App; variant?: "default" | "featured" | "compact" }) => {
    const isCompact = variant === "compact";
    const isFeatured = variant === "featured";
    
    return (
      <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] sm:hover:scale-[1.02] touch-manipulation ${
        isFeatured ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50" : "hover:border-gray-300"
      }`}
        onClick={() => handleAppOpen(app)}
      >
        <CardHeader className={isCompact ? "p-3 pb-2" : "p-3 sm:p-4 pb-2 sm:pb-3"}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className={`${isCompact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl lg:text-3xl"} flex-shrink-0`}>
                {app.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1 sm:gap-2 mb-1">
                  <CardTitle className={`${isCompact ? "text-sm sm:text-base" : "text-sm sm:text-base lg:text-lg"} truncate`}>
                    {app.name}
                  </CardTitle>
                  {app.internal && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5 hidden sm:inline-flex">Internal</Badge>
                  )}
                  {app.premium && (
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 text-xs">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{app.rating}</span>
                  </div>
                  <span className="text-muted-foreground hidden sm:inline">•</span>
                  <span className={`font-medium ${getPriceColor(app.price)} truncate`}>
                    {app.price}
                  </span>
                  <span className="text-muted-foreground hidden md:inline">•</span>
                  <span className="text-muted-foreground hidden md:inline truncate">{app.downloads}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              {app.featured && <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />}
              {app.trending && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />}
              {app.essential && <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />}
            </div>
          </div>
        </CardHeader>
        
        {!isCompact && (
          <CardContent className="pt-0 p-3 sm:p-4">
            <CardDescription className="text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
              {app.description}
            </CardDescription>
            
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
              {app.tags.slice(0, isCompact ? 2 : 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-1.5 py-0.5">
                  {tag}
                </Badge>
              ))}
              {app.tags.length > (isCompact ? 2 : 3) && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{app.tags.length - (isCompact ? 2 : 3)}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <Button 
                size="sm" 
                className="flex items-center gap-1.5 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppOpen(app);
                }}
              >
                {app.internal ? <Eye className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
                <span className="hidden sm:inline">{app.internal ? "Open" : "Launch"}</span>
                <span className="sm:hidden">{app.internal ? "Open" : "Go"}</span>
              </Button>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                  <Heart className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  if (appsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">Apps Hub</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Discover and access educational applications</p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
          >
            <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-2">Grid</span>
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
          >
            <List className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline ml-2">List</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-center">{apps?.length || 0}</div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Total Apps</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-center">{featuredApps.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Featured</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-center">{categories?.length || 0}</div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Categories</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-center">{essentialApps.length}</div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">Essential</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Apps Section */}
      {featuredApps.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 px-1">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
            <span className="truncate">Featured Apps</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {featuredApps.slice(0, 3).map((app) => (
              <AppCard key={app.id} app={app} variant="featured" />
            ))}
          </div>
        </div>
      )}

      {/* Trending Apps Section */}
      {trendingApps.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2 px-1">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
            <span className="truncate">Trending Now</span>
          </h2>
          <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {trendingApps.map((app) => (
              <div key={app.id} className="flex-shrink-0 w-56 sm:w-64">
                <AppCard app={app} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search apps, categories, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10 sm:h-11 text-sm sm:text-base"
          />
        </div>
        
        {/* Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-9 sm:h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="h-9 sm:h-10">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="essential">Essential</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-9 sm:h-10">
              <SortAsc className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Apps Grid/List */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4" 
          : "space-y-3 sm:space-y-4"
      }>
        {filteredAndSortedApps.map((app) => (
          <AppCard 
            key={app.id} 
            app={app} 
            variant={viewMode === "list" ? "compact" : "default"} 
          />
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedApps.length === 0 && (
        <div className="text-center py-8 sm:py-12 px-4">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
          <h3 className="text-base sm:text-lg font-medium mb-2">No apps found</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 max-w-md mx-auto">
            Try adjusting your search terms or filters to find what you're looking for
          </p>
          <Button 
            variant="outline"
            size="sm"
            className="h-9 sm:h-10 px-4 sm:px-6"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setFilterBy("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}