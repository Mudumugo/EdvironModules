import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "@/components/MarketingNav";
import { 
  BookOpen, 
  Users, 
  Shield, 
  BarChart3, 
  Zap, 
  Globe,
  ChevronRight,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Search,
  Filter,
  Target,
  Calendar,
  Presentation,
  Notebook,
  Settings,
  BookMarked,
  FileText,
  GraduationCap,
  Clock,
  ChevronDown,
  ChevronLeft,
  X
} from "lucide-react";

export function Landing() {

  const [activeFeature, setActiveFeature] = useState('dashboard');

  const renderDashboardPreview = () => {
    if (activeFeature === 'dashboard') {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Educational Modules Dashboard</h2>
              <p className="text-gray-600">Navigate through organized educational modules including shared libraries, personal lockers, calendars, lesson planning, and interactive learning tools.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Exploring Module 2</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Good Afternoon, Miss!</h3>
            </div>
            <p className="text-gray-600 mb-6">Manage your classes and access teaching tools to enhance learning.</p>
            
            <div className="flex items-center mb-6 space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search modules..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                All Modules
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Shared Library</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Access educational resources, documents, and learning materials.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>Resource Sharing</div>
                    <div>Document Management</div>
                    <div className="font-medium">+1 more</div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-blue-600 border-blue-300">Core</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Target className="h-6 w-6 text-green-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">My Locker</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Personal workspace for files, assignments, and notes.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>File Storage</div>
                    <div>Assignment Organization</div>
                    <div className="font-medium">+1 more</div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-green-600 border-green-300">Personal</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Calendar className="h-6 w-6 text-purple-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">School Calendar</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">View and manage school events, schedules, and important dates.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>Event Management</div>
                    <div>Schedule Sync</div>
                    <div className="font-medium">+1 more</div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="outline" className="text-purple-600 border-purple-300">Management</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Presentation className="h-6 w-6 text-gray-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Lesson Planning</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Advanced lesson planning and curriculum alignment tools.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>Curriculum Planning</div>
                    <div>Resource Integration</div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Play className="h-3 w-3 mr-1" />
                    <span className="text-xs">1</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Notebook className="h-6 w-6 text-blue-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Digital Notebooks</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Interactive notebooks for students and teachers with collaborative features.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>Digital Writing</div>
                    <div>Integration Tools</div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Play className="h-3 w-3 mr-1" />
                    <span className="text-xs">1</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Settings className="h-6 w-6 text-gray-600 mr-3" />
                    <h4 className="font-semibold text-gray-900">Apps Hub</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Discover and access educational applications and integrations.</p>
                  <div className="space-y-2 text-xs text-gray-500">
                    <div>App Discovery</div>
                    <div>Integration Tools</div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ChevronRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-6">
              <div className="text-sm text-gray-500">1 of 5</div>
            </div>
          </div>
        </div>
      );
    }

    if (activeFeature === 'library') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Interactive Digital Library</h2>
            <p className="text-gray-600">Access thousands of educational resources, books, and multimedia content curated for your curriculum.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <BookMarked className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Digital Books</h4>
                  <p className="text-sm text-gray-600">Access curriculum-aligned books and reading materials</p>
                  <div className="mt-3">
                    <Badge className="bg-blue-600">1,500+ Books</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <Play className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Video Library</h4>
                  <p className="text-sm text-gray-600">Educational videos and interactive content</p>
                  <div className="mt-3">
                    <Badge className="bg-green-600">500+ Videos</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <FileText className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Resources</h4>
                  <p className="text-sm text-gray-600">Worksheets, assessments, and teaching materials</p>
                  <div className="mt-3">
                    <Badge className="bg-purple-600">2,000+ Files</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <Target className="h-8 w-8 text-orange-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Interactive Tools</h4>
                  <p className="text-sm text-gray-600">Simulations, games, and interactive learning tools</p>
                  <div className="mt-3">
                    <Badge className="bg-orange-600">100+ Tools</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (activeFeature === 'management') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Management Tools</h2>
            <p className="text-gray-600">Comprehensive tools for administrators to manage students, teachers, and institutional operations.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <Users className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Student Management</h4>
                  <p className="text-sm text-gray-600">Enrollment, records, and student progress tracking</p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <GraduationCap className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Teacher Portal</h4>
                  <p className="text-sm text-gray-600">Staff management and professional development</p>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="p-4">
                  <BarChart3 className="h-8 w-8 text-purple-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics Dashboard</h4>
                  <p className="text-sm text-gray-600">Performance metrics and institutional insights</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (activeFeature === 'lockers') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Learning Lockers</h2>
            <p className="text-gray-600">Secure, personalized spaces for students and teachers to store and organize their digital assets.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Student Lockers</h4>
                  <p className="text-sm text-gray-600 mb-4">Personal space for assignments, projects, and study materials</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Assignment submission</li>
                    <li>• Project collaboration</li>
                    <li>• Personal notes and files</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <GraduationCap className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Teacher Lockers</h4>
                  <p className="text-sm text-gray-600 mb-4">Professional workspace for lesson plans and resources</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Lesson plan storage</li>
                    <li>• Grading and feedback</li>
                    <li>• Curriculum resources</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    if (activeFeature === 'calendar') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Academic Calendar & Planning</h2>
            <p className="text-gray-600">Integrated calendar system for academic scheduling, events, and institutional planning.</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-4">
                  <Calendar className="h-8 w-8 text-blue-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Academic Calendar</h4>
                  <p className="text-sm text-gray-600 mb-4">School-wide calendar with terms, holidays, and events</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      <span>Term Schedules</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                      <span>School Events</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                      <span>Exam Periods</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <Clock className="h-8 w-8 text-green-600 mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Class Scheduling</h4>
                  <p className="text-sm text-gray-600 mb-4">Automated timetables and class management</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                      <span>Time Tables</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
                      <span>Room Booking</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                      <span>Resource Planning</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const features = [
    {
      icon: BookOpen,
      title: "Comprehensive Learning Management",
      description: "Full-featured LMS with digital libraries, assignments, and progress tracking for all grade levels."
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description: "Seamlessly manage students, teachers, administrators, and IT staff with role-based access controls."
    },
    {
      icon: Shield,
      title: "Advanced Security",
      description: "Enterprise-grade security with visitor management, device tracking, and comprehensive monitoring."
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description: "Powerful analytics dashboard with real-time insights into learning progress and institutional metrics."
    },
    {
      icon: Zap,
      title: "AI-Powered Technology",
      description: "Integrated Tech Tutor with AI-powered personalized learning for technology skills development."
    },
    {
      icon: Globe,
      title: "Cloud-Native Platform",
      description: "Scalable cloud infrastructure with seamless deployment and automatic updates."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal, Riverside Elementary",
      content: "Edvirons has transformed how we manage our school. The comprehensive dashboard gives us insights we never had before.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "IT Director, Metro School District",
      content: "The security features and device management capabilities are exactly what we needed. Setup was incredibly smooth.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "6th Grade Teacher",
      content: "My students love the interactive modules, and I can track their progress in real-time. It's made teaching more effective.",
      rating: 5
    }
  ];

  const stats = [
    { number: "50K+", label: "Students Served" },
    { number: "1,200+", label: "Schools Using Edvirons" },
    { number: "99.9%", label: "Uptime Reliability" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              EdVirons Learning Ecosystem
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Precision Learning, Leaving no Kid behind.
            </p>
          </div>
          
          {/* Feature Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <button 
              onClick={() => setActiveFeature('dashboard')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeFeature === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Educational Modules Dashboard
            </button>
            <button 
              onClick={() => setActiveFeature('library')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeFeature === 'library' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Interactive Digital Library
            </button>
            <button 
              onClick={() => setActiveFeature('management')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeFeature === 'management' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              School Managers Tool
            </button>
            <button 
              onClick={() => setActiveFeature('lockers')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeFeature === 'lockers' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Teacher & Student Lockers
            </button>
            <button 
              onClick={() => setActiveFeature('calendar')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeFeature === 'calendar' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Academic Calendar & Planning
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-6xl mx-auto">
            {renderDashboardPreview()}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Education Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run a modern educational institution, 
              from learning management to security and analytics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of educators already using EdVirons to create better learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">EdVirons</h3>
              <p className="text-gray-400 mb-4">
                Empowering education through innovative technology solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/solutions" className="hover:text-white">Solutions</Link></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><a href="#careers" className="hover:text-white">Careers</a></li>
                <li><a href="#contact" className="hover:text-white">Contact</a></li>
                <li><a href="#blog" className="hover:text-white">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#help" className="hover:text-white">Help Center</a></li>
                <li><a href="#docs" className="hover:text-white">Documentation</a></li>
                <li><a href="#community" className="hover:text-white">Community</a></li>
                <li><a href="#status" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 EdVirons. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
              <a href="#terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
              <a href="#cookies" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}