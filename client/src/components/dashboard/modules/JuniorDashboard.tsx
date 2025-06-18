import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  FileText, 
  FlaskConical,
  Gamepad2,
  Users,
  BarChart3,
  ArrowUpRight,
  Search,
  Filter,
  Grid3X3,
  List,
  Star
} from "lucide-react";
import { Link } from "wouter";

const studentModules = [
  {
    id: "shared-library",
    title: "Shared Library",
    description: "Access educational resources, documents, and learning materials",
    icon: BookOpen,
    color: "border-l-blue-500",
    category: "Core",
    features: ["Resource Sharing", "Document Management"],
    moreCount: 1,
    tag: "Core"
  },
  {
    id: "my-locker",
    title: "My Locker", 
    description: "Personal workspace for files, assignments, and saved materials",
    icon: FolderOpen,
    color: "border-l-green-500",
    category: "Personal",
    features: ["File Storage", "Assignment Organization"],
    moreCount: 1,
    tag: "Personal"
  },
  {
    id: "school-calendar",
    title: "School Calendar",
    description: "View school events, schedules, and important dates",
    icon: Calendar,
    color: "border-l-purple-500",
    category: "Management",
    features: ["Event Management", "Schedule Sync"],
    moreCount: 1,
    tag: "Management"
  },
  {
    id: "digital-notebooks",
    title: "Digital Notebooks",
    description: "Interactive digital notebooks for taking notes and assignments",
    icon: FileText,
    color: "border-l-indigo-500",
    category: "Learning",
    features: ["Digital Writing", "Collaboration"],
    moreCount: 1,
    tag: "Learning"
  },
  {
    id: "apps-hub",
    title: "Apps Hub",
    description: "Discover and access educational applications and tools", 
    icon: Grid3X3,
    color: "border-l-purple-600",
    category: "Core",
    features: ["App Discovery", "Integration Tools"],
    moreCount: 1,
    tag: "Core"
  },
  {
    id: "stem-lab",
    title: "STEM Lab",
    description: "Interactive science, technology, engineering, and mathematics experiments",
    icon: FlaskConical,
    color: "border-l-cyan-500",
    category: "Learning",
    features: ["Virtual Experiments", "Interactive Simulations"],
    moreCount: 1,
    tag: "Learning"
  },
  {
    id: "learning-games",
    title: "Learning Games",
    description: "Educational games and interactive learning activities",
    icon: Gamepad2,
    color: "border-l-pink-500",
    category: "Learning",
    features: ["Educational Games", "Interactive Activities"],
    moreCount: 2,
    tag: "Learning"
  },
  {
    id: "study-groups",
    title: "Study Groups",
    description: "Collaborate with classmates and join study sessions",
    icon: Users,
    color: "border-l-orange-500",
    category: "Learning",
    features: ["Group Collaboration", "Peer Learning"],
    moreCount: 1,
    tag: "Learning"
  }
];

interface JuniorDashboardProps {
  user: any;
  stats: any;
}

export function JuniorDashboard({ user, stats }: JuniorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All Modules", "Core", "Personal", "Management", "Learning"];

  const filteredModules = studentModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Modules" || module.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Plan Info */}
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <Badge variant="outline" className="mb-1">
                Free Basic Plan
              </Badge>
              <p className="text-sm text-gray-600">
                Unlock all learning modules and advanced features with Premium
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            Upgrade to Premium
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {user?.firstName || "Student"}!
          </h1>
          <p className="text-gray-600 text-lg">
            Explore learning modules and track your educational progress.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card 
                key={module.id} 
                className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${module.color} border-l-4 ${
                  viewMode === "list" ? "flex items-center p-4" : ""
                }`}
              >
                <CardContent className={viewMode === "grid" ? "p-6" : "flex items-center gap-4 p-0 flex-1"}>
                  <div className={`${viewMode === "grid" ? "mb-4" : ""}`}>
                    <Icon className={`h-8 w-8 ${
                      module.color.includes('blue') ? 'text-blue-600' :
                      module.color.includes('green') ? 'text-green-600' :
                      module.color.includes('purple') ? 'text-purple-600' :
                      module.color.includes('indigo') ? 'text-indigo-600' :
                      module.color.includes('cyan') ? 'text-cyan-600' :
                      module.color.includes('pink') ? 'text-pink-600' :
                      module.color.includes('orange') ? 'text-orange-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {module.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {module.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {module.moreCount > 0 && (
                        <Badge variant="outline" className="text-xs">
                          +{module.moreCount} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {module.tag}
                      </Badge>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}