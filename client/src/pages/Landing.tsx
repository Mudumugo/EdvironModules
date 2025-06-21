import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Folder,
  Search,
  Grid3X3,
  List,
  ChevronRight,
  FileText,
  NotebookPen,
  AppWindow,
  GraduationCap,
  Clock,
  Star,
  Play
} from "lucide-react";

export default function Landing() {
  const [activeTab, setActiveTab] = useState("Educational Modules Dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const navigationTabs = [
    "Educational Modules Dashboard",
    "Interactive Digital Library", 
    "School Managers Tool",
    "Teacher & Student Lockers",
    "Academic Calendar & Planning"
  ];

  const modules = [
    {
      id: 1,
      title: "Shared Library",
      description: "Access educational resources, documents, and learning materials",
      icon: BookOpen,
      color: "bg-blue-500",
      features: ["Resource Sharing", "Document Management"],
      category: "Core",
      moreFeatures: 1
    },
    {
      id: 2,
      title: "My Locker", 
      description: "Personal workspace for files, assignments, and notes",
      icon: Folder,
      color: "bg-green-500",
      features: ["File Storage", "Assignment Organization"],
      category: "Personal",
      moreFeatures: 1
    },
    {
      id: 3,
      title: "School Calendar",
      description: "View and manage school events, schedules, and important dates",
      icon: Calendar,
      color: "bg-purple-500",
      features: ["Event Management", "Schedule Sync"],
      category: "Management",
      moreFeatures: 1
    },
    {
      id: 4,
      title: "Lesson Planning",
      description: "AI-powered lesson planning and curriculum management",
      icon: FileText,
      color: "bg-orange-500",
      features: ["AI Lesson Generator", "Curriculum Alignment"],
      category: "Core",
      moreFeatures: 2
    },
    {
      id: 5,
      title: "Digital Notebooks",
      description: "Interactive digital notebooks for students and teachers",
      icon: NotebookPen,
      color: "bg-pink-500",
      features: ["Digital Writing", "Collaboration"],
      category: "Personal",
      moreFeatures: 1
    },
    {
      id: 6,
      title: "Apps Hub",
      description: "Discover and access educational applications and tools",
      icon: AppWindow,
      color: "bg-blue-600",
      features: ["App Discovery", "Integration Tools"],
      category: "Management",
      moreFeatures: 2
    }
  ];

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-rotate through tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(prev => {
        const currentIndex = navigationTabs.indexOf(prev);
        const nextIndex = (currentIndex + 1) % navigationTabs.length;
        return navigationTabs[nextIndex];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getTabContent = () => {
    switch (activeTab) {
      case "Educational Modules Dashboard":
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Educational Modules Dashboard</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Navigate through organized educational modules including shared libraries, personal lockers, calendars,
                lesson planning, and interactive learning tools.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-8">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Good Afternoon, Miss!</h3>
                <p className="text-gray-600">Manage your classes and access teaching tools to enhance learning.</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search modules..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">All Modules</span>
                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="px-3"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="px-3"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
                {filteredModules.map((module) => {
                  const Icon = module.icon;
                  return (
                    <Card key={module.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-lg ${module.color} text-white w-fit`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {module.features.map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {module.moreFeatures > 0 && (
                              <Badge variant="outline" className="text-xs">
                                +{module.moreFeatures} more
                              </Badge>
                            )}
                          </div>
                          <div className="pt-2 border-t">
                            <span className="text-xs text-gray-500 font-medium">{module.category}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "Interactive Digital Library":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Interactive Digital Library</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Access a comprehensive collection of digital resources, e-books, research materials, and interactive content 
              aligned with your curriculum standards.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-12">
              <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Digital Resources Hub</h3>
              <p className="text-gray-600">Explore thousands of educational materials and interactive content.</p>
            </div>
          </div>
        );

      case "School Managers Tool":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">School Managers Tool</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive management dashboard for administrators to oversee operations, track performance, 
              and manage institutional resources effectively.
            </p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-12">
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Administrative Dashboard</h3>
              <p className="text-gray-600">Complete oversight and management capabilities for your institution.</p>
            </div>
          </div>
        );

      case "Teacher & Student Lockers":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Teacher & Student Lockers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Personal digital workspaces for both teachers and students to store, organize, and share 
              educational materials, assignments, and personal resources.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-12">
              <Folder className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Digital Lockers</h3>
              <p className="text-gray-600">Secure personal storage for all your educational materials.</p>
            </div>
          </div>
        );

      case "Academic Calendar & Planning":
        return (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Academic Calendar & Planning</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Integrated scheduling system for managing academic terms, events, examinations, and important 
              institutional dates with collaborative planning tools.
            </p>
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-12">
              <Calendar className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Academic Planning</h3>
              <p className="text-gray-600">Comprehensive calendar and planning tools for your institution.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gray-900 text-white p-2 rounded-lg mr-3">
                <span className="font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">EdVirons</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition-colors">Solutions</a>
              <a href="#cbe" className="text-gray-600 hover:text-blue-600 transition-colors">CBE Overview</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#demo" className="text-gray-600 hover:text-blue-600 transition-colors">Request Demo</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            EdVirons Learning Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Education Reimagined: Local Needs, Global Standards.
          </p>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {navigationTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 ${
                  activeTab === tab 
                    ? "bg-blue-500 text-white" 
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {getTabContent()}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-white text-gray-900 p-2 rounded-lg mr-3">
                  <span className="font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-semibold text-white">EdVirons</span>
              </div>
              <p className="text-gray-400">
                Transforming education through innovative technology solutions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">CBE Overview</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Request Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EdVirons. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}