import { useState } from "react";
import { Link } from "wouter";
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
  GraduationCap, 
  FileText,
  BarChart3,
  FlaskConical,
  Users,
  ArrowUpRight,
  Search,
  Filter,
  Grid3X3,
  List,
  Star
} from "lucide-react";
import { useXapiPageTracking } from "@/lib/xapiTracker";

const teacherModules = [
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
    description: "Personal workspace for files, assignments, and class materials",
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
    description: "View and manage school events, schedules, and important dates",
    icon: Calendar,
    color: "border-l-purple-500",
    category: "Management",
    features: ["Event Management", "Schedule Sync"],
    moreCount: 1,
    tag: "Management"
  },
  {
    id: "lesson-planning",
    title: "Lesson Planning",
    description: "AI-powered lesson planning and curriculum management tools",
    icon: GraduationCap,
    color: "border-l-blue-600",
    category: "Teaching",
    features: ["AI Lesson Generator", "Curriculum Alignment"],
    moreCount: 1,
    tag: "Teaching"
  },
  {
    id: "digital-notebooks",
    title: "Digital Notebooks",
    description: "Interactive digital notebooks for students and teachers",
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
    description: "Interactive science, technology, engineering, and mathematics tools",
    icon: FlaskConical,
    color: "border-l-cyan-500",
    category: "Learning",
    features: ["Virtual Experiments", "Interactive Simulations"],
    moreCount: 1,
    tag: "Learning"
  },
  {
    id: "class-management",
    title: "Class Management",
    description: "Manage your classes, attendance, and student progress",
    icon: Users,
    color: "border-l-orange-500",
    category: "Teaching",
    features: ["Student Tracking", "Grade Management"],
    moreCount: 2,
    tag: "Teaching"
  }
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Track page view with xAPI
  useXapiPageTracking("Teacher Dashboard", "teacher-tools");

  const categories = ["All Modules", "Core", "Personal", "Management", "Teaching", "Learning"];

  const filteredModules = teacherModules.filter(module => {
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

  const getUserTitle = () => {
    if (!user?.role) return "Teacher";
    return "Teacher";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Plan Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <Badge variant="outline" className="mb-1 text-xs">
                Free Basic Plan
              </Badge>
              <p className="text-xs sm:text-sm text-gray-600">
                Unlock all learning modules and advanced features with Premium
              </p>
            </div>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm">
            Upgrade to Premium
            <ArrowUpRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Welcome Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {getUserTitle()}!
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Manage your classes and access teaching tools to enhance learning.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search modules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[140px] h-10">
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
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="w-full sm:w-auto"
            >
              {viewMode === "grid" ? (
                <>
                  <List className="h-4 w-4 mr-2" />
                  List View
                </>
              ) : (
                <>
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Grid View
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Modules Grid */}
        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
            : "space-y-3"
        }>
          {filteredModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={`/${module.id}`}>
                <Card 
                  className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${module.color} border-l-4 ${
                    viewMode === "list" ? "flex items-center" : ""
                  }`}
                >
                  <CardContent className={viewMode === "grid" ? "p-3 sm:p-4 lg:p-6" : "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 flex-1"}>
                    <div className={`${viewMode === "grid" ? "mb-3 sm:mb-4" : ""} flex-shrink-0`}>
                      <Icon className={`h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 ${
                        module.color.includes('blue') ? 'text-blue-600' :
                        module.color.includes('green') ? 'text-green-600' :
                        module.color.includes('purple') ? 'text-purple-600' :
                        module.color.includes('indigo') ? 'text-indigo-600' :
                        module.color.includes('cyan') ? 'text-cyan-600' :
                        module.color.includes('orange') ? 'text-orange-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 line-clamp-2">
                        {module.description}
                      </p>
                      
                      {viewMode === "grid" && (
                        <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3 lg:mb-4">
                          {module.features.slice(0, 2).map((feature, index) => (
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
                      )}
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                          {module.tag}
                        </Badge>
                        <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 group-hover:text-blue-600 transition-colors ml-auto" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-3 sm:mb-4">
              <Search className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}