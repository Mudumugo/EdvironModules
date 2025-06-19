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
      <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
        isFeatured ? "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50" : "hover:border-gray-300"
      } ${isCompact ? "p-3" : ""}`}
        onClick={() => handleAppOpen(app)}
      >
        <CardHeader className={isCompact ? "p-3 pb-2" : "pb-3"}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`text-2xl ${isCompact ? "text-xl" : "text-3xl"} flex-shrink-0`}>
                {app.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className={`${isCompact ? "text-sm" : "text-lg"} truncate`}>
                    {app.name}
                  </CardTitle>
                  {app.internal && (
                    <Badge variant="secondary" className="text-xs">Internal</Badge>
                  )}
                  {app.premium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">{app.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className={`text-xs font-medium ${getPriceColor(app.price)}`}>
                    {app.price}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{app.downloads}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {app.featured && <Sparkles className="h-4 w-4 text-blue-500" />}
              {app.trending && <TrendingUp className="h-4 w-4 text-green-500" />}
              {app.essential && <Zap className="h-4 w-4 text-orange-500" />}
            </div>
          </div>
        </CardHeader>
        
        {!isCompact && (
          <CardContent className="pt-0">
            <CardDescription className="text-sm mb-3 line-clamp-2">
              {app.description}
            </CardDescription>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {app.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {app.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{app.tags.length - 3}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAppOpen(app);
                }}
              >
                {app.internal ? <Eye className="h-3 w-3" /> : <ExternalLink className="h-3 w-3" />}
                {app.internal ? "Open" : "Launch"}
              </Button>
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Apps Hub</h1>
          <p className="text-gray-600">Discover and access educational applications</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{apps?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Total Apps</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{featuredApps.length}</div>
            <p className="text-sm text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{categories?.length || 0}</div>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{essentialApps.length}</div>
            <p className="text-sm text-muted-foreground">Essential</p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Apps Section */}
      {featuredApps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Featured Apps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredApps.slice(0, 3).map((app) => (
              <AppCard key={app.id} app={app} variant="featured" />
            ))}
          </div>
        </div>
      )}

      {/* Trending Apps Section */}
      {trendingApps.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Trending Now
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trendingApps.map((app) => (
              <div key={app.id} className="flex-shrink-0 w-64">
                <AppCard app={app} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search apps, categories, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
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
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
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
            <SelectTrigger className="w-32">
              <SortAsc className="h-4 w-4 mr-2" />
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
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
          : "space-y-4"
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
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No apps found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search terms or filters
          </p>
          <Button 
            variant="outline"
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