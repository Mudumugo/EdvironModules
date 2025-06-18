import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ExternalLink, 
  Star, 
  Clock,
  Layers,
  TrendingUp,
  Award,
  Code,
  Calculator,
  Gamepad2,
  Users,
  Globe,
  Play,
  Video,
  BookOpen,
  MessageCircle,
  Palette
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
}

const mockApps: App[] = [
  {
    id: "1",
    name: "Khan Academy",
    description: "Free online courses, lessons and practice for students",
    category: "Education",
    rating: 4.8,
    downloads: "50M+",
    price: "Free",
    icon: "📚",
    featured: true,
    trending: false,
    recommended: true,
    popular: false,
    essential: false,
    premium: false,
    tags: ["Mathematics", "Science"],
    url: "https://khanacademy.org"
  },
  {
    id: "2", 
    name: "Scratch",
    description: "Visual programming language for kids and beginners",
    category: "Programming",
    rating: 4.7,
    downloads: "30M+",
    price: "Free",
    icon: "🎯",
    featured: true,
    trending: false,
    recommended: false,
    popular: true,
    essential: false,
    premium: false,
    tags: ["Programming", "Creativity"],
    url: "https://scratch.mit.edu"
  },
  {
    id: "3",
    name: "GeoGebra",
    description: "Interactive mathematics software for all levels",
    category: "Mathematics",
    rating: 4.6,
    downloads: "20M+",
    price: "Free",
    icon: "📐",
    featured: true,
    trending: true,
    recommended: false,
    popular: false,
    essential: false,
    premium: false,
    tags: ["Mathematics", "Geometry"],
    url: "https://geogebra.org"
  },
  {
    id: "4",
    name: "Canva for Education",
    description: "Design presentations, posters, and educational materials",
    category: "Design",
    rating: 4.5,
    downloads: "100M+",
    price: "Freemium",
    icon: "🎨",
    featured: false,
    trending: false,
    recommended: false,
    popular: true,
    essential: false,
    premium: false,
    tags: ["Design", "Presentations", "Graphics"],
    url: "https://canva.com/education"
  },
  {
    id: "5",
    name: "Zoom",
    description: "Video conferencing for virtual classrooms",
    category: "Communication",
    rating: 4.3,
    downloads: "500M+",
    price: "Freemium",
    icon: "📹",
    featured: false,
    trending: false,
    recommended: false,
    popular: false,
    essential: true,
    premium: false,
    tags: ["Video Calls", "Remote Learning", "Collaboration"],
    url: "https://zoom.us"
  },
  {
    id: "6",
    name: "Google Classroom",
    description: "Classroom management and assignment distribution",
    category: "Education",
    rating: 4.4,
    downloads: "100M+",
    price: "Free",
    icon: "🎓",
    featured: false,
    trending: false,
    recommended: true,
    popular: false,
    essential: false,
    premium: false,
    tags: ["Classroom Management", "Assignments", "Google Workspace"],
    url: "https://classroom.google.com"
  },
  {
    id: "7",
    name: "Duolingo",
    description: "Language learning made fun and effective",
    category: "Languages",
    rating: 4.7,
    downloads: "500M+",
    price: "Freemium",
    icon: "🗣️",
    featured: false,
    trending: false,
    recommended: false,
    popular: true,
    essential: false,
    premium: false,
    tags: ["Languages", "Interactive", "Gamified"],
    url: "https://duolingo.com"
  },
  {
    id: "8",
    name: "Minecraft Education",
    description: "Game-based learning platform for creativity and collaboration",
    category: "Gaming",
    rating: 4.6,
    downloads: "10M+",
    price: "Paid",
    icon: "🧱",
    featured: false,
    trending: false,
    recommended: false,
    popular: false,
    essential: false,
    premium: true,
    tags: ["Gaming", "STEM", "Collaboration"],
    url: "https://education.minecraft.net"
  }
];

const categories = ["All Apps", "Education", "Programming", "Mathematics", "Design", "Communication", "Languages", "Gaming"];

export default function AppsHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Apps");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: apps = [], isLoading } = useQuery({
    queryKey: ["/api/apps-hub"],
  });

  const typedApps = apps as App[];
  const totalApps = typedApps.length;
  const featuredApps = typedApps.filter(app => app.featured);
  const categoriesCount = categories.length - 1; // Exclude "All Apps"

  const filteredApps = typedApps.filter((app: App) => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All Apps" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAppIcon = (iconText: string, category: string) => {
    switch (category) {
      case "Education": return BookOpen;
      case "Programming": return Code;
      case "Mathematics": return Calculator;
      case "Design": return Palette;
      case "Communication": return MessageCircle;
      case "Languages": return Globe;
      case "Gaming": return Gamepad2;
      default: return Layers;
    }
  };

  const getBadgeVariant = (app: App) => {
    if (app.recommended) return { text: "Recommended", class: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" };
    if (app.popular) return { text: "Popular", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" };
    if (app.trending) return { text: "Trending", class: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400" };
    if (app.essential) return { text: "Essential", class: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400" };
    if (app.premium) return { text: "Premium", class: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" };
    return null;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Layers className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200">Apps Hub</h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Discover and access educational applications to enhance your learning experience
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Layers className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Apps</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{totalApps}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Featured</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{featuredApps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Categories</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{categoriesCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Updated</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">Daily</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search apps, features, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="flex border rounded-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Apps */}
        {featuredApps.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Featured Apps</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredApps.map((app: App) => {
                const IconComponent = getAppIcon(app.icon, app.category);
                const badge = getBadgeVariant(app);
                
                return (
                  <Card key={app.id} className="group hover:shadow-xl transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        {badge && (
                          <Badge className={`text-xs ${badge.class}`}>
                            {badge.text}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {app.description}
                      </p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(app.rating)}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400 ml-2">
                          {app.rating} • {app.downloads}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {app.tags.slice(0, 2).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs border-slate-200 dark:border-slate-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-green-600 dark:text-green-400">{app.price}</span>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                          <a href={app.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Apps */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-4">All Apps</h2>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredApps.map((app) => {
                const IconComponent = getAppIcon(app.icon, app.category);
                const badge = getBadgeVariant(app);
                
                return (
                  <Card key={app.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        {badge && (
                          <Badge className={`text-xs ${badge.class}`}>
                            {badge.text}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                        {app.description}
                      </p>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex items-center space-x-1">
                          {renderStars(app.rating)}
                        </div>
                        <span className="text-xs text-slate-600 dark:text-slate-400 ml-2">
                          {app.rating} • {app.downloads}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {app.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs border-slate-200 dark:border-slate-600">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">{app.price}</span>
                        <Button size="sm" variant="outline" className="border-slate-200 dark:border-slate-600" asChild>
                          <a href={app.url} target="_blank" rel="noopener noreferrer">
                            Open
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app: App) => {
                const IconComponent = getAppIcon(app.icon, app.category);
                const badge = getBadgeVariant(app);
                
                return (
                  <Card key={app.id} className="group hover:shadow-lg transition-shadow bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{app.name}</h3>
                              {badge && (
                                <Badge className={`text-xs ${badge.class}`}>
                                  {badge.text}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-sm font-semibold text-green-600 dark:text-green-400">{app.price}</span>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                                <a href={app.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Open
                                </a>
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {app.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                {renderStars(app.rating)}
                                <span className="text-sm text-slate-600 dark:text-slate-400 ml-1">
                                  {app.rating} • {app.downloads}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {app.tags.slice(0, 4).map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs border-slate-200 dark:border-slate-600">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">No apps found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}