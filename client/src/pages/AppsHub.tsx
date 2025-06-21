import { useAppsHub } from "@/hooks/useAppsHub";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function AppsHub() {
  const {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    showInstalled,
    setShowInstalled,
    apps,
    categories,
    appsLoading,
    categoriesLoading,
    installApp,
    uninstallApp,
    rateApp,
    isAppInstalled,
    isInstalling,
    isUninstalling
  } = useAppsHub();

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, any> = {
      'educational': <BookOpen className="h-5 w-5" />,
      'productivity': <Zap className="h-5 w-5" />,
      'communication': <MessageSquare className="h-5 w-5" />,
      'entertainment': <Play className="h-5 w-5" />,
      'utilities': <Settings className="h-5 w-5" />,
    };
    return icons[categoryId] || <Grid3X3 className="h-5 w-5" />;
  };

  if (appsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apps Hub</h1>
          <p className="text-gray-600">Discover and install educational applications</p>
        </div>
        
        <div className="flex items-center space-x-2">
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={showInstalled ? "default" : "outline"}
            size="sm"
            onClick={() => setShowInstalled(!showInstalled)}
          >
            Installed Only
          </Button>
        </div>
      </div>

      {/* App Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="featured" className="flex items-center space-x-2">
            <Crown className="h-4 w-4" />
            <span>Featured</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Trending</span>
          </TabsTrigger>
          <TabsTrigger value="recommended" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Recommended</span>
          </TabsTrigger>
          <TabsTrigger value="essential" className="flex items-center space-x-2">
            <Zap className="h-4 w-4" />
            <span>Essential</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {/* Apps Grid/List */}
          <div className={`grid gap-6 ${viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
          }`}>
            {apps.map(app => (
              <Card key={app.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {app.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{app.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-600 ml-1">{app.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{app.downloads}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      {app.featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                      {app.premium && <Badge variant="outline" className="text-xs">Premium</Badge>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">
                    {app.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {app.category}
                      </Badge>
                      <span className="text-sm font-medium text-green-600">
                        {app.price === "0" ? "Free" : app.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {isAppInstalled(app.id) ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => uninstallApp(app.id)}
                          disabled={isUninstalling}
                        >
                          Uninstall
                        </Button>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => installApp(app.id)}
                          disabled={isInstalling}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Install
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {apps.length === 0 && (
            <div className="text-center py-12">
              <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No apps found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or browse different categories.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}