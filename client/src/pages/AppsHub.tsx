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
      <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] touch-manipulation ${
        isFeatured 
          ? "border-blue-200 dark:border-blue-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" 
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
      }`}
        onClick={() => handleAppOpen(app)}
      >
        <CardHeader className={isCompact ? "p-4 pb-3" : "p-4 sm:p-6 pb-3 sm:pb-4"}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
              <div className={`${isCompact ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl lg:text-5xl"} flex-shrink-0`}>
                {app.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className={`${isCompact ? "text-base sm:text-lg" : "text-lg sm:text-xl lg:text-2xl"} font-bold text-gray-900 dark:text-white truncate`}>
                    {app.name}
                  </CardTitle>
                  {app.internal && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 hidden sm:inline-flex bg-gray-100 dark:bg-gray-700">
                      Internal
                    </Badge>
                  )}
                  {app.premium && (
                    <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">{app.rating}</span>
                  </div>
                  <span className="text-gray-400 dark:text-gray-500">•</span>
                  <span className={`font-semibold ${getPriceColor(app.price)}`}>
                    {app.price}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 hidden md:inline">•</span>
                  <span className="text-gray-600 dark:text-gray-300 hidden md:inline font-medium">{app.downloads}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {app.featured && <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 dark:text-blue-400" />}
              {app.trending && <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 dark:text-green-400" />}
              {app.essential && <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500 dark:text-orange-400" />}
            </div>
          </div>
        </CardHeader>
        
        {!isCompact && (
          <CardContent className="pt-0 p-4 sm:p-6">
            <CardDescription className="text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed text-gray-600 dark:text-gray-300">
              {app.description}
            </CardDescription>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {app.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                  {tag}
                </Badge>
              ))}
              {app.tags.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                  +{app.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between gap-3">
              <Button 
                size="sm" 
                className="flex items-center gap-2 h-10 sm:h-11 px-4 sm:px-6 text-sm sm:text-base flex-shrink-0 font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppOpen(app);
                }}
              >
                {app.internal ? <Eye className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
                <span>{app.internal ? "Open" : "Go"}</span>
              </Button>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 sm:h-10 sm:w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Share2 className="h-4 w-4" />
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col space-y-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Apps Hub
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Discover and access educational applications
              </p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-9 w-9 sm:h-10 sm:w-auto sm:px-4 flex-shrink-0"
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Grid</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="h-9 w-9 sm:h-10 sm:w-auto sm:px-4 flex-shrink-0"
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">List</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {apps?.length || 0}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Total Apps
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                {featuredApps.length}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Featured
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {categories?.length || 0}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Categories
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                {essentialApps.length}
              </div>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 font-medium">
                Essential
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Apps Section */}
        {featuredApps.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
              <span>Featured Apps</span>
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {featuredApps.slice(0, 3).map((app) => (
                <AppCard key={app.id} app={app} variant="featured" />
              ))}
            </div>
          </div>
        )}

        {/* Trending Apps Section */}
        {trendingApps.length > 0 && (
          <div className="mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 dark:text-green-400 flex-shrink-0" />
              <span>Trending Now</span>
            </h2>
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
              {trendingApps.map((app) => (
                <div key={app.id} className="flex-shrink-0 w-64 sm:w-72">
                  <AppCard app={app} variant="compact" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search apps, categories, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 sm:h-14 text-base sm:text-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:shadow-md transition-shadow"
            />
          </div>
          
          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-11 sm:h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg">
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
              <SelectTrigger className="h-11 sm:h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg">
                <Filter className="h-4 w-4 mr-2 flex-shrink-0" />
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
              <SelectTrigger className="h-11 sm:h-12 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg">
                <SortAsc className="h-4 w-4 mr-2 flex-shrink-0" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured First</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="popularity">Most Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Apps Grid */}
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
            : "space-y-4 sm:space-y-6"
        }`}>
          {filteredAndSortedApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>

        {filteredAndSortedApps.length === 0 && (
          <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
              No apps found
            </h3>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}