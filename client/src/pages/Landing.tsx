import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  FolderOpen,
  FileText,
  BarChart3,
  Search,
  Grid3X3,
  List,
  ArrowRight,
  ChevronRight,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export function Landing() {
  const [activeTab, setActiveTab] = useState("Educational Modules Dashboard");

  const navigationTabs = [
    "Educational Modules Dashboard",
    "Interactive Digital Library", 
    "School Managers Tool",
    "Teacher & Student Lockers",
    "Academic Calendar & Planning"
  ];

  const modules = [
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
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            EdVirons Learning Ecosystem
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Precision Learning, Leaving no Kid behind.
          </p>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {navigationTabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className="text-sm"
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Main Content Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-6xl mx-auto">
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