import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  FolderOpen, 
  BarChart3, 
  GraduationCap,
  FileText,
  FlaskConical,
  Globe,
  ArrowUpRight,
  Search,
  Filter,
  Grid3X3,
  List,
  Star
} from "lucide-react";
import { Link } from "wouter";

const seniorModules = [
  {
    id: "shared-library",
    title: "Shared Library",
    description: "Access academic resources, research materials, and scholarly content",
    icon: BookOpen,
    color: "border-l-blue-500",
    category: "Core",
    features: ["Academic Resources", "Research Materials"],
    moreCount: 1,
    tag: "Core"
  },
  {
    id: "my-workspace",
    title: "My Workspace", 
    description: "Organize projects, research notes, and academic materials",
    icon: FolderOpen,
    color: "border-l-green-500",
    category: "Personal",
    features: ["Project Organization", "Research Notes"],
    moreCount: 1,
    tag: "Personal"
  },
  {
    id: "academic-calendar",
    title: "Academic Calendar",
    description: "Track important dates, deadlines, and academic schedules",
    icon: Calendar,
    color: "border-l-purple-500",
    category: "Management",
    features: ["Academic Schedule", "Deadline Tracking"],
    moreCount: 1,
    tag: "Management"
  },
  {
    id: "research-tools",
    title: "Research Tools",
    description: "Advanced tools for academic research and thesis development",
    icon: GraduationCap,
    color: "border-l-blue-600",
    category: "Academic",
    features: ["Research Support", "Citation Tools"],
    moreCount: 2,
    tag: "Academic"
  },
  {
    id: "digital-portfolios",
    title: "Digital Portfolios",
    description: "Showcase your academic work and professional achievements",
    icon: FileText,
    color: "border-l-indigo-500",
    category: "Academic",
    features: ["Portfolio Creation", "Achievement Tracking"],
    moreCount: 1,
    tag: "Academic"
  },
  {
    id: "analytics-hub",
    title: "Analytics Hub",
    description: "Track academic progress and performance metrics",
    icon: BarChart3,
    color: "border-l-purple-600",
    category: "Analytics",
    features: ["Performance Analytics", "Progress Tracking"],
    moreCount: 1,
    tag: "Analytics"
  },
  {
    id: "lab-simulations",
    title: "Lab Simulations",
    description: "Advanced virtual laboratory and research simulations",
    icon: FlaskConical,
    color: "border-l-cyan-500",
    category: "Academic",
    features: ["Virtual Labs", "Research Simulations"],
    moreCount: 2,
    tag: "Academic"
  },
  {
    id: "study-groups",
    title: "Study Groups",
    description: "Collaborate with peers on research projects and coursework",
    icon: Users,
    color: "border-l-orange-500",
    category: "Collaboration",
    features: ["Peer Collaboration", "Group Projects"],
    moreCount: 1,
    tag: "Collaboration"
  }
];

interface SeniorDashboardProps {
  user: any;
  stats: any;
}

export function SeniorDashboard({ user, stats }: SeniorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = ["All Modules", "Core", "Personal", "Management", "Academic", "Analytics", "Collaboration"];

  const filteredModules = seniorModules.filter(module => {
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
    if (!user?.role) return "Student";
    const roleMap: Record<string, string> = {
      'student_high': 'Student',
      'student_college': 'Student',
      'teacher': 'Teacher',
      'admin': 'Administrator'
    };
    return roleMap[user.role] || 'Student';
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
                Unlock all academic modules and research tools with Premium
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
            {getGreeting()}, {getUserTitle()}!
          </h1>
          <p className="text-gray-600 text-lg">
            Access advanced learning tools and track your academic journey.
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