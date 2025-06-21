import { useState, useEffect } from "react";
import { MobileLanding } from "./MobileLanding";
import { HeroSection } from "@/components/landing/HeroSection";
import { NavigationTabs } from "@/components/landing/NavigationTabs";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { ContactSection } from "@/components/landing/ContactSection";
import { useLandingAutoPlay } from "@/hooks/useLandingAutoPlay";

export function Landing() {
  const [isMobile, setIsMobile] = useState(false);

  const navigationTabs = [
    "Educational Modules Dashboard",
    "Interactive Digital Library", 
    "School Managers Tool",
    "Teacher & Student Lockers",
    "Academic Calendar & Planning"
  ];

  const { activeTab, setActiveTab, isAutoPlaying, setIsAutoPlaying } = useLandingAutoPlay(navigationTabs);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileLanding />;
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroSection 
        isAutoPlaying={isAutoPlaying}
        setIsAutoPlaying={setIsAutoPlaying}
      />
      
      <NavigationTabs 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigationTabs={navigationTabs}
      />
      
      <FeatureShowcase activeTab={activeTab} />
      
      <ContactSection />
    </div>
  );
}
    {
      title: "Shared Library",
      description: "Access educational resources, documents, and learning materials",
      icon: BookOpen,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "Core",
      features: ["Resource Sharing", "Document Management"],
      moreCount: 1
    },
    {
      title: "My Locker", 
      description: "Personal workspace for files, assignments, and notes",
      icon: FolderOpen,
      color: "bg-green-100",
      iconColor: "text-green-600", 
      badge: "Personal",
      features: ["File Storage", "Assignment Organization"],
      moreCount: 1
    },
    {
      title: "School Calendar",
      description: "View and manage school events, schedules, and important dates",
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: "Management", 
      features: ["Event Management", "Schedule Sync"],
      moreCount: 1
    },
    {
      title: "Lesson Planning",
      description: "AI-powered lesson planning and curriculum management",
      icon: FileText,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: "Teaching",
      features: ["AI Lesson Generator", "Curriculum Alignment"],
      moreCount: 2
    },
    {
      title: "Digital Notebooks", 
      description: "Interactive digital notebooks for students and teachers",
      icon: BookOpen,
      color: "bg-pink-100",
      iconColor: "text-pink-600",
      badge: "Learning",
      features: ["Digital Writing", "Collaboration"],
      moreCount: 1
    },
    {
      title: "Apps Hub",
      description: "Discover and access educational applications and tools", 
      icon: Grid3X3,
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
      badge: "Tools",
      features: ["App Discovery", "Integration Tools"],
      moreCount: 2
    }
  ];

  // Show mobile version on small screens
  if (isMobile) {
    return <MobileLanding />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">EdVirons</span>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Link href="/solutions" className="text-gray-600 hover:text-gray-900">
                Solutions
              </Link>
              <Link href="/cbe-overview" className="text-gray-600 hover:text-gray-900">
                CBE Overview
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Button variant="outline" size="sm">
                Request Demo
              </Button>
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">EdVirons Learning Portal</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Education Reimagined: Local Needs, Global Standards.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {navigationTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => {
                  setActiveTab(tab);
                  setIsAutoPlaying(false); // Pause auto-play when user manually selects
                }}
                className="text-sm"
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Auto-play Controls */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause Slideshow
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play Slideshow
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-2">
              {navigationTabs.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    navigationTabs[index] === activeTab 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
            {activeTab === "Educational Modules Dashboard" && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Educational Modules Dashboard
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                    Navigate through organized educational modules including shared libraries, personal 
                    lockers, calendars, lesson planning, and interactive learning tools.
                  </p>
                </div>

                {/* Dashboard Interface */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">Good Afternoon, Miss!</h3>
                      <p className="text-gray-600">Manage your classes and access teaching tools to enhance learning.</p>
                    </div>
                  </div>

                  {/* Search and Controls */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search modules..."
                        className="pl-10"
                      />
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-sm text-gray-600">All Modules</span>
                      <Button variant="outline" size="sm">
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Modules Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((module, index) => {
                      const Icon = module.icon;
                      return (
                        <Card key={index} className="group hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`p-3 rounded-lg ${module.color}`}>
                                <Icon className={`h-6 w-6 ${module.iconColor}`} />
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                            </div>
                            
                            <h3 className="font-semibold text-lg text-gray-900 mb-2">{module.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{module.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {module.features.map((feature, featureIndex) => (
                                <span key={featureIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                              {module.moreCount && (
                                <span className="text-xs text-gray-500">+{module.moreCount} more</span>
                              )}
                            </div>
                            
                            <Badge variant="secondary" className="text-xs">
                              {module.badge}
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  <div className="text-center mt-8">
                    <span className="text-sm text-gray-500">1 of 5</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Interactive Digital Library" && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Interactive Digital Library
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                    Access thousands of educational resources, interactive books, multimedia content, 
                    and curriculum-aligned materials designed for modern learning.
                  </p>
                </div>

                {/* Library Interface */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  {/* Library Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">Digital Library</h3>
                      <p className="text-gray-600">Browse and access educational content across all subjects</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      12,450+ Resources
                    </Badge>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search books, videos, articles..."
                        className="pl-10"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">All Subjects</Button>
                      <Button variant="outline" size="sm">Grade Level</Button>
                      <Button variant="outline" size="sm">Content Type</Button>
                    </div>
                  </div>

                  {/* Featured Collections */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Featured Collections</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <BookOpen className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">CBC Mathematics</h5>
                              <p className="text-sm text-gray-600">Grade 1-8 Resources</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">847 items</p>
                        </CardContent>
                      </Card>

                      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">Science Experiments</h5>
                              <p className="text-sm text-gray-600">Interactive Labs</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">324 items</p>
                        </CardContent>
                      </Card>

                      <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                              <BookOpen className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">Kiswahili Resources</h5>
                              <p className="text-sm text-gray-600">Language Learning</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">562 items</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Recent & Popular */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recently Added</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Interactive Geometry</h5>
                            <p className="text-sm text-gray-600">Grade 7 Mathematics</p>
                            <Badge variant="outline" className="text-xs">Interactive</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Kenya History Timeline</h5>
                            <p className="text-sm text-gray-600">Social Studies</p>
                            <Badge variant="outline" className="text-xs">Document</Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Data Analysis Basics</h5>
                            <p className="text-sm text-gray-600">Grade 8 Mathematics</p>
                            <Badge variant="outline" className="text-xs">Video</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Most Popular</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">English Grammar Guide</h5>
                            <p className="text-sm text-gray-600">Grade 4-6 English</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">eBook</Badge>
                              <span className="text-xs text-gray-500">2.4k views</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-6 w-6 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Fractions Made Easy</h5>
                            <p className="text-sm text-gray-600">Grade 3-5 Mathematics</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Interactive</Badge>
                              <span className="text-xs text-gray-500">1.8k views</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-6 w-6 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Animal Classification</h5>
                            <p className="text-sm text-gray-600">Grade 5 Science</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">Video</Badge>
                              <span className="text-xs text-gray-500">1.6k views</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Access */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">Quick Access</h4>
                        <p className="text-sm text-gray-600">Jump to frequently used resources</p>
                      </div>
                      <Button variant="outline" size="sm">
                        View All Categories
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "School Managers Tool" && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    School Managers Tool
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                    Comprehensive school administration platform for managing students, staff, 
                    academics, finances, and operations in one integrated system.
                  </p>
                </div>

                {/* School Management Interface */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  {/* Management Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">School Administration</h3>
                      <p className="text-gray-600">Centralized management dashboard for all school operations</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-800">All Systems Online</Badge>
                      <Badge className="bg-blue-100 text-blue-800">Term 2, 2024</Badge>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">1,247</div>
                        <div className="text-sm text-gray-600">Total Students</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">89</div>
                        <div className="text-sm text-gray-600">Teaching Staff</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">95.2%</div>
                        <div className="text-sm text-gray-600">Attendance Rate</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">KES 2.4M</div>
                        <div className="text-sm text-gray-600">Monthly Revenue</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Management Modules */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="h-6 w-6 text-blue-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Student Management</h3>
                        <p className="text-gray-600 text-sm mb-4">Enrollment, records, academic progress, and parent communication</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Admissions</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Records</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Core Module</Badge>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-green-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Timetable & Scheduling</h3>
                        <p className="text-gray-600 text-sm mb-4">Class schedules, exam timetables, and resource allocation</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Auto-Schedule</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Conflict Detection</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Academic</Badge>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-purple-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Financial Management</h3>
                        <p className="text-gray-600 text-sm mb-4">Fee collection, budgeting, payroll, and financial reporting</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">M-Pesa Integration</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Invoicing</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Finance</Badge>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <FileText className="h-6 w-6 text-orange-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Examination System</h3>
                        <p className="text-gray-600 text-sm mb-4">Exam creation, grading, result processing, and report generation</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Auto-Grading</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Analytics</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Assessment</Badge>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-red-100 rounded-lg">
                            <Users className="h-6 w-6 text-red-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Staff Management</h3>
                        <p className="text-gray-600 text-sm mb-4">HR records, payroll, attendance, and performance tracking</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Payroll</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Leave Management</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Human Resources</Badge>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-indigo-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-indigo-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Communication Hub</h3>
                        <p className="text-gray-600 text-sm mb-4">SMS, email, notices, and parent-teacher communication</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Bulk SMS</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">Notices</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">Communication</Badge>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activities & Alerts */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Term 2 Results Published</h5>
                            <p className="text-sm text-gray-600">Grade 8 examination results now available</p>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Fee Collection Update</h5>
                            <p className="text-sm text-gray-600">98% fee collection rate achieved this month</p>
                            <span className="text-xs text-gray-500">4 hours ago</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">New Staff Onboarded</h5>
                            <p className="text-sm text-gray-600">3 new teachers joined the Mathematics department</p>
                            <span className="text-xs text-gray-500">1 day ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Attendance Warning</h5>
                            <p className="text-sm text-gray-600">23 students below 85% attendance threshold</p>
                            <span className="text-xs text-gray-500">Requires attention</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Fee Arrears</h5>
                            <p className="text-sm text-gray-600">KES 340,000 in outstanding fees this term</p>
                            <span className="text-xs text-gray-500">Action required</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">System Backup</h5>
                            <p className="text-sm text-gray-600">Daily backup completed successfully</p>
                            <span className="text-xs text-gray-500">All systems secure</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Generate Reports
                      </Button>
                      <Button size="sm" variant="outline">
                        Send Bulk SMS
                      </Button>
                      <Button size="sm" variant="outline">
                        Process Fees
                      </Button>
                      <Button size="sm" variant="outline">
                        Create Timetable
                      </Button>
                      <Button size="sm" variant="outline">
                        Staff Meeting
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Teacher & Student Lockers" && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Teacher & Student Lockers
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                    Personal digital workspaces for organizing files, assignments, resources, 
                    and collaborative content with secure access and sharing capabilities.
                  </p>
                </div>

                {/* Lockers Interface */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  {/* Header with User Toggle */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">Digital Lockers</h3>
                      <p className="text-gray-600">Secure personal storage for educational content and collaboration</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600">Teacher View</Button>
                      <Button size="sm" variant="outline">Student View</Button>
                    </div>
                  </div>

                  {/* Storage Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">2.4 GB</div>
                        <div className="text-sm text-gray-600">Used Storage</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">847</div>
                        <div className="text-sm text-gray-600">Total Files</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">156</div>
                        <div className="text-sm text-gray-600">Shared Items</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">23</div>
                        <div className="text-sm text-gray-600">Collaborations</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Locker Categories */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText className="h-6 w-6 text-blue-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Lesson Materials</h3>
                        <p className="text-gray-600 text-sm mb-4">Teaching resources, presentations, and lesson plans</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">234 files</Badge>
                          <span className="text-xs text-gray-500">Last updated: 2h ago</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-green-100 rounded-lg">
                            <FolderOpen className="h-6 w-6 text-green-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Student Assignments</h3>
                        <p className="text-gray-600 text-sm mb-4">Submitted work, graded assignments, and feedback</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">89 submissions</Badge>
                          <span className="text-xs text-gray-500">Due: Today</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-purple-100 rounded-lg">
                            <Users className="h-6 w-6 text-purple-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Shared Resources</h3>
                        <p className="text-gray-600 text-sm mb-4">Collaborative folders and team projects</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">12 shared</Badge>
                          <span className="text-xs text-gray-500">3 collaborators</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-orange-100 rounded-lg">
                            <BookOpen className="h-6 w-6 text-orange-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Personal Notes</h3>
                        <p className="text-gray-600 text-sm mb-4">Private notes, reflections, and personal documents</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">67 notes</Badge>
                          <span className="text-xs text-gray-500">Private</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-red-100 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-red-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Assessment Data</h3>
                        <p className="text-gray-600 text-sm mb-4">Grades, rubrics, and performance analytics</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">45 assessments</Badge>
                          <span className="text-xs text-gray-500">Confidential</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-indigo-100 rounded-lg">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-2">Class Archives</h3>
                        <p className="text-gray-600 text-sm mb-4">Previous term materials and historical records</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">2023-2024</Badge>
                          <span className="text-xs text-gray-500">Archived</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity & Quick Access */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Mathematics Quiz - Grade 7</h5>
                            <p className="text-sm text-gray-600">Uploaded to Lesson Materials</p>
                            <span className="text-xs text-gray-500">15 minutes ago</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FolderOpen className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Essay Submissions</h5>
                            <p className="text-sm text-gray-600">12 new submissions received</p>
                            <span className="text-xs text-gray-500">1 hour ago</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Science Project Folder</h5>
                            <p className="text-sm text-gray-600">Shared with Grade 8 students</p>
                            <span className="text-xs text-gray-500">2 hours ago</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">Lesson Plan Notes</h5>
                            <p className="text-sm text-gray-600">Updated personal teaching notes</p>
                            <span className="text-xs text-gray-500">3 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h4>
                      <div className="space-y-3">
                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">Today's Lesson Plan</h5>
                                  <p className="text-xs text-gray-600">Grade 7 Mathematics</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">PDF</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                  <FolderOpen className="h-4 w-4 text-green-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">Pending Assignments</h5>
                                  <p className="text-xs text-gray-600">23 submissions to grade</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-600">Urgent</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                                  <Users className="h-4 w-4 text-purple-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">Team Resources</h5>
                                  <p className="text-xs text-gray-600">Shared with Math Dept.</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">Shared</Badge>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                                  <BookOpen className="h-4 w-4 text-orange-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-sm">Personal Folder</h5>
                                  <p className="text-xs text-gray-600">Private teaching notes</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">Private</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Storage Usage */}
                      <div className="mt-6 p-4 bg-white rounded-lg border">
                        <h5 className="font-medium text-sm mb-3">Storage Usage</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Used Storage</span>
                            <span>2.4 GB / 10 GB</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
                          </div>
                          <p className="text-xs text-gray-600">7.6 GB available</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Locker Actions</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Upload Files
                      </Button>
                      <Button size="sm" variant="outline">
                        Create Folder
                      </Button>
                      <Button size="sm" variant="outline">
                        Share Resource
                      </Button>
                      <Button size="sm" variant="outline">
                        Manage Access
                      </Button>
                      <Button size="sm" variant="outline">
                        Archive Old Files
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Academic Calendar & Planning" && (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Academic Calendar & Planning
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-3xl mx-auto">
                    Comprehensive academic scheduling system for managing terms, exams, events, 
                    and institutional planning with automated conflict detection and resource allocation.
                  </p>
                </div>

                {/* Calendar Interface */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">Academic Calendar 2024</h3>
                      <p className="text-gray-600">Term 2 • Week 8 of 13 • June 2024</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Month View</Button>
                      <Button size="sm" className="bg-blue-600">Term View</Button>
                      <Button size="sm" variant="outline">Year View</Button>
                    </div>
                  </div>

                  {/* Calendar Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">156</div>
                        <div className="text-sm text-gray-600">School Days</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">23</div>
                        <div className="text-sm text-gray-600">Exam Days</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">87</div>
                        <div className="text-sm text-gray-600">Events Planned</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">12</div>
                        <div className="text-sm text-gray-600">Holidays</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Current Term Overview */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Term 2 Progress</h4>
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Term Completion</span>
                        <span className="text-sm text-gray-600">8 of 13 weeks</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div className="bg-blue-600 h-3 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">May 6</div>
                          <div className="text-xs text-gray-600">Term Started</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">June 20</div>
                          <div className="text-xs text-gray-600">Today</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-gray-900">Aug 2</div>
                          <div className="text-xs text-gray-600">Term Ends</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Events & Planning Modules */}
                  <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h4>
                      <div className="space-y-3">
                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">Grade 8 KCPE Mock Exams</h5>
                                <p className="text-sm text-gray-600">Mathematics, English, Kiswahili, Science</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-red-50 text-red-600">Exam</Badge>
                                  <span className="text-xs text-gray-500">June 24-28, 2024</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">Parent-Teacher Conference</h5>
                                <p className="text-sm text-gray-600">Mid-term progress discussions</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-green-50 text-green-600">Meeting</Badge>
                                  <span className="text-xs text-gray-500">July 5, 2024</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">Science Fair & Exhibition</h5>
                                <p className="text-sm text-gray-600">Student project presentations</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">Event</Badge>
                                  <span className="text-xs text-gray-500">July 12, 2024</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-sm transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">Mid-Term Break</h5>
                                <p className="text-sm text-gray-600">School closure for mid-term holidays</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">Holiday</Badge>
                                  <span className="text-xs text-gray-500">July 15-19, 2024</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Planning Tools</h4>
                      <div className="grid gap-4">
                        <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">Exam Scheduler</h5>
                            <p className="text-sm text-gray-600">Automated exam timetable generation</p>
                          </CardContent>
                        </Card>

                        <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <Users className="h-5 w-5 text-green-600" />
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">Event Manager</h5>
                            <p className="text-sm text-gray-600">Plan and coordinate school events</p>
                          </CardContent>
                        </Card>

                        <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-purple-600" />
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                            </div>
                            <h5 className="font-medium text-gray-900 mb-1">Resource Planner</h5>
                            <p className="text-sm text-gray-600">Allocate facilities and resources</p>
                          </CardContent>
                        </Card>

                        

                        
                      </div>
                    </div>
                  </div>

                  {/* Term Schedule Overview */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">2024 Academic Year Overview</h4>
                    <div className="bg-white rounded-lg border overflow-hidden">
                      <div className="grid grid-cols-3 divide-x">
                        <div className="p-4">
                          <div className="text-center">
                            <h5 className="font-medium text-gray-900 mb-2">Term 1</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Jan 15 - Apr 12</div>
                              <div className="text-green-600 font-medium">Completed</div>
                              <div>12 weeks • 156 days</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-blue-50">
                          <div className="text-center">
                            <h5 className="font-medium text-gray-900 mb-2">Term 2</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>May 6 - Aug 2</div>
                              <div className="text-blue-600 font-medium">Current</div>
                              <div>13 weeks • 8 completed</div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-center">
                            <h5 className="font-medium text-gray-900 mb-2">Term 3</h5>
                            <div className="text-sm text-gray-600 space-y-1">
                              <div>Sep 2 - Nov 22</div>
                              <div className="text-gray-500 font-medium">Upcoming</div>
                              <div>12 weeks • KCPE Prep</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Planning Actions */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Quick Actions</h4>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Schedule Event
                      </Button>
                      <Button size="sm" variant="outline">
                        Create Exam Timetable
                      </Button>
                      <Button size="sm" variant="outline">
                        Plan Term 3
                      </Button>
                      <Button size="sm" variant="outline">
                        Generate Reports
                      </Button>
                      <Button size="sm" variant="outline">
                        Notify Parents
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to transform your learning experience?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="text-lg px-8 py-3">
                Access Portal
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Request Demo
            </Button>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">E</span>
                </div>
                <span className="text-xl font-semibold">EdVirons</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Empowering education through innovative technology solutions designed for the 
                Kenyan education system.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900">Features</Link></li>
                <li><Link href="/digital-library" className="hover:text-gray-900">Digital Library</Link></li>
                <li><Link href="/school-management" className="hover:text-gray-900">School Management</Link></li>
                <li><Link href="/learning-analytics" className="hover:text-gray-900">Learning Analytics</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/careers" className="hover:text-gray-900">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/press" className="hover:text-gray-900">Press</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-gray-900">Help Center</Link></li>
              </ul>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-2">Contact</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    hello@edvirons.com
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    +254 700 000 000
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Nairobi, Kenya
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2024 EdVirons Learning Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}