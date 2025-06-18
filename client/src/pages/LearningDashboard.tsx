import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  Brain, 
  Notebook, 
  Layers, 
  FlaskConical, 
  GraduationCap,
  Star,
  ArrowUpRight,
  Plus
} from "lucide-react";
import { Link } from "wouter";

const moduleCards = [
  {
    id: "shared-library",
    title: "Shared Library",
    description: "Access educational resources, documents, and learning materials",
    icon: BookOpen,
    color: "border-l-blue-500",
    features: ["Resource Sharing", "Document Management"],
    moreCount: 1,
    category: "Core",
    route: "/digital-library"
  },
  {
    id: "my-locker",
    title: "My Locker", 
    description: "Personal workspace for files, assignments, and notes",
    icon: FolderOpen,
    color: "border-l-green-500",
    features: ["File Storage", "Assignment Organization"],
    moreCount: 1,
    category: "Personal",
    route: "/my-locker"
  },
  {
    id: "school-calendar",
    title: "School Calendar",
    description: "View and manage school events, schedules, and important dates",
    icon: Calendar,
    color: "border-l-purple-500",
    features: ["Event Management", "Schedule Sync"],
    moreCount: 1,
    category: "Management",
    route: "/scheduling"
  },
  {
    id: "lesson-planning",
    title: "Lesson Planning",
    description: "AI-powered lesson planning and curriculum management",
    icon: Brain,
    color: "border-l-indigo-500",
    features: ["AI Lesson Generator", "Curriculum Alignment"],
    moreCount: 1,
    category: "Teaching",
    route: "/teacher-dashboard"
  },
  {
    id: "digital-notebooks",
    title: "Digital Notebooks", 
    description: "Interactive digital notebooks for students and teachers",
    icon: Notebook,
    color: "border-l-cyan-500",
    features: ["Digital Writing", "Collaboration"],
    moreCount: 1,
    category: "Learning",
    route: "/my-locker"
  },
  {
    id: "apps-hub",
    title: "Apps Hub",
    description: "Discover and access educational applications and tools",
    icon: Layers,
    color: "border-l-violet-500",
    features: ["App Discovery", "Integration Tools"],
    moreCount: 1,
    category: "Core",
    route: "/apps-hub"
  },
  {
    id: "stem-lab",
    title: "STEM Lab",
    description: "Interactive science, technology, engineering, and mathematics",
    icon: FlaskConical,
    color: "border-l-emerald-500",
    features: ["Virtual Experiments", "Interactive Simulations"],
    moreCount: 1,
    category: "Learning",
    route: "/digital-library"
  },
  {
    id: "techtutor-app",
    title: "TechTutor App",
    description: "AI-powered personalized tutoring and learning assistant platform",
    icon: GraduationCap,
    color: "border-l-pink-500",
    features: ["AI Tutoring", "Personalized Learning"],
    moreCount: 2,
    category: "Learning",
    route: "/tutor-hub"
  }
];

export default function LearningDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All Modules", "Core", "Personal", "Management", "Teaching", "Learning"];

  const filteredModules = moduleCards.filter(module => {
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
    if (!user?.role) return "User";
    
    const roleMap: Record<string, string> = {
      'student_elementary': 'Student',
      'student_middle': 'Student', 
      'student_high': 'Student',
      'student_college': 'Student',
      'teacher': 'Teacher',
      'principal': 'Principal',
      'vice_principal': 'Vice Principal',
      'school_admin': 'Administrator',
      'parent': 'Parent'
    };
    
    return roleMap[user.role] || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 px-3 py-1 rounded-full border">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Free Basic Plan</span>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
              {getGreeting()}, {getUserTitle()}!
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your classes and access teaching tools to enhance learning.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-2 text-sm"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center border rounded-md bg-white dark:bg-slate-800">
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
        </div>

        {/* Modules Grid */}
        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"}`}>
          {filteredModules.map((module) => {
            const IconComponent = module.icon;
            return (
              <Link key={module.id} href={module.route}>
                <Card className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-l-4 ${module.color} bg-white dark:bg-slate-800`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-600 transition-colors">
                        <IconComponent className="h-6 w-6 text-slate-600 dark:text-slate-300" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {module.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                      {module.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {module.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:border-blue-200 dark:group-hover:border-blue-800"
                      >
                        {module.category}
                        <ArrowUpRight className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">No modules found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link href="/my-locker">
                <Plus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Create Notebook</div>
                  <div className="text-xs text-slate-500">Start writing</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link href="/digital-library">
                <BookOpen className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Browse Library</div>
                  <div className="text-xs text-slate-500">Find resources</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link href="/scheduling">
                <Calendar className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">View Schedule</div>
                  <div className="text-xs text-slate-500">Check calendar</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="justify-start h-auto p-4" asChild>
              <Link href="/apps-hub">
                <Layers className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Explore Apps</div>
                  <div className="text-xs text-slate-500">Discover tools</div>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}