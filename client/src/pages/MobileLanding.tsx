import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FolderOpen,
  FileText,
  BarChart3,
  Search,
  Menu,
  X,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Grid3X3,
  Play,
  Pause
} from "lucide-react";

export function MobileLanding() {
  const [activeTab, setActiveTab] = useState("Educational Modules Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const navigationTabs = [
    "Modules",
    "Library", 
    "Manager",
    "Lockers",
    "Calendar"
  ];

  const tabMapping = {
    "Modules": "Educational Modules Dashboard",
    "Library": "Interactive Digital Library",
    "Manager": "School Managers Tool", 
    "Lockers": "Teacher & Student Lockers",
    "Calendar": "Academic Calendar & Planning"
  };

  const fullNavigationTabs = [
    "Educational Modules Dashboard",
    "Interactive Digital Library", 
    "School Managers Tool",
    "Teacher & Student Lockers",
    "Academic Calendar & Planning"
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveTab(currentTab => {
        const currentIndex = fullNavigationTabs.indexOf(currentTab);
        const nextIndex = (currentIndex + 1) % fullNavigationTabs.length;
        return fullNavigationTabs[nextIndex];
      });
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const modules = [
    {
      title: "Shared Library",
      description: "Educational resources and materials",
      icon: BookOpen,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "Core"
    },
    {
      title: "My Locker", 
      description: "Personal workspace for files",
      icon: FolderOpen,
      color: "bg-green-100",
      iconColor: "text-green-600", 
      badge: "Personal"
    },
    {
      title: "School Calendar",
      description: "Events and schedules",
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: "Management"
    },
    {
      title: "Lesson Planning",
      description: "AI-powered lesson plans",
      icon: FileText,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: "Teaching"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">EdVirons</span>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/demo">
                <Button size="sm" variant="outline" className="text-xs px-2 py-1">
                  Demo
                </Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="text-xs px-3 py-1">
                  Login
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="pb-4 border-t border-gray-200 mt-2 pt-2">
              <div className="space-y-2">
                <Link href="/features" className="block text-gray-600 py-2">Features</Link>
                <Link href="/solutions" className="block text-gray-600 py-2">Solutions</Link>
                <Link href="/about" className="block text-gray-600 py-2">About</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white py-6 px-4 sm:py-8">
        <div className="max-w-sm mx-auto text-center sm:max-w-md">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            EdVirons Learning Ecosystem
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            Education Reimagined: Local Needs, Global Standards.
          </p>

          {/* Mobile Tab Navigation */}
          <div className="flex overflow-x-auto gap-2 mb-4 sm:mb-6 pb-2 scrollbar-hide">
            {navigationTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tabMapping[tab] ? "default" : "outline"}
                onClick={() => {
                  setActiveTab(tabMapping[tab]);
                  setIsAutoPlaying(false);
                }}
                className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 px-3 py-2 min-w-fit"
                size="sm"
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Mobile Auto-play Controls */}
          <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="flex items-center gap-2 text-xs sm:text-sm px-4 py-2"
            >
              {isAutoPlaying ? (
                <>
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                  Play
                </>
              )}
            </Button>
            
            <div className="flex items-center gap-1">
              {fullNavigationTabs.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    fullNavigationTabs[index] === activeTab 
                      ? 'bg-blue-600' 
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            {activeTab === "Educational Modules Dashboard" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Educational Modules
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Navigate through organized educational tools and resources.
                  </p>
                </div>

                {/* Mobile Dashboard */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Good Afternoon!</h3>
                    <p className="text-sm text-gray-600">Access your teaching tools</p>
                  </div>

                  {/* Mobile Search */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Mobile Modules Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {modules.map((module, index) => {
                      const Icon = module.icon;
                      return (
                        <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-3">
                            <div className={`p-2 rounded-lg ${module.color} mb-2 w-fit`}>
                              <Icon className={`h-4 w-4 ${module.iconColor}`} />
                            </div>
                            <h3 className="font-medium text-sm text-gray-900 mb-1">{module.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">{module.description}</p>
                            <Badge variant="secondary" className="text-xs">
                              {module.badge}
                            </Badge>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {activeTab === "Interactive Digital Library" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Digital Library
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Access educational resources and interactive content.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Browse Content</h3>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">12K+ Resources</Badge>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search books, videos..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">CBC Mathematics</h5>
                        <p className="text-xs text-gray-600">Grade 1-8 Resources</p>
                        <Badge variant="outline" className="text-xs mt-1">847 items</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">Science Experiments</h5>
                        <p className="text-xs text-gray-600">Interactive Labs</p>
                        <Badge variant="outline" className="text-xs mt-1">324 items</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "School Managers Tool" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    School Management
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Comprehensive administration tools for school operations.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">1,247</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-green-600">89</div>
                        <div className="text-xs text-gray-600">Staff</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <Card className="cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">Student Management</h5>
                            <p className="text-xs text-gray-600">Records & progress tracking</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <BarChart3 className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">Financial Management</h5>
                            <p className="text-xs text-gray-600">Fees & M-Pesa integration</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Teacher & Student Lockers" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Digital Lockers
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Personal storage for files and assignments.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-blue-600">2.4 GB</div>
                        <div className="text-xs text-gray-600">Used</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3 text-center">
                        <div className="text-lg font-bold text-green-600">847</div>
                        <div className="text-xs text-gray-600">Files</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-3">
                    <Card className="cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">Lesson Materials</h5>
                            <p className="text-xs text-gray-600">234 files</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FolderOpen className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">Assignments</h5>
                            <p className="text-xs text-gray-600">89 submissions</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}

            {activeTab === "Academic Calendar & Planning" && (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    Academic Calendar
                  </h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Academic scheduling and planning tools.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Term 2 Progress</h3>
                    <p className="text-sm text-gray-600">Week 8 of 13 • June 2024</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 border mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Term Completion</span>
                      <span>62%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Calendar className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">KCPE Mock Exams</h5>
                            <p className="text-xs text-gray-600">June 24-28, 2024</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-sm">Parent Conference</h5>
                            <p className="text-xs text-gray-600">July 5, 2024</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <section className="bg-white py-6 sm:py-8 px-4">
        <div className="max-w-sm mx-auto text-center sm:max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
            Ready to transform learning?
          </h2>
          <div className="space-y-2 sm:space-y-3">
            <Link href="/dashboard" className="block">
              <Button className="w-full py-3 text-sm sm:text-base font-medium touch-target active:scale-95 transition-transform">
                Access Portal
              </Button>
            </Link>
            <Link href="/demo" className="block">
              <Button variant="outline" className="w-full py-3 text-sm sm:text-base font-medium touch-target active:scale-95 transition-transform">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8 px-4">
        <div className="max-w-sm mx-auto sm:max-w-md">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">E</span>
              </div>
              <span className="text-base sm:text-lg font-semibold">EdVirons</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Empowering education in Kenya through innovative technology.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Product</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li><Link href="/features" className="hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="/digital-library" className="hover:text-gray-900 transition-colors">Digital Library</Link></li>
                <li><Link href="/school-management" className="hover:text-gray-900 transition-colors">School Management</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 sm:mb-3 text-xs sm:text-sm">Support</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                <li><Link href="/help" className="hover:text-gray-900 transition-colors">Help Center</Link></li>
                <li><Link href="/about" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="text-center space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-4">
            <div className="flex items-center justify-center">
              <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              hello@edvirons.com
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Nairobi, Kenya
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-4 sm:mt-6 pt-3 sm:pt-4 text-center text-xs text-gray-600">
            © 2024 EdVirons Learning Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}