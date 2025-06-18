import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingNav } from "@/components/MarketingNav";
import { 
  Users, 
  UserCheck, 
  BarChart3, 
  Calendar, 
  BookOpen, 
  Shield,
  ArrowRight,
  Check,
  ChevronRight
} from "lucide-react";

const solutions = [
  {
    id: "student-management",
    title: "Student Management",
    description: "Comprehensive student information system with enrollment, tracking, and reporting.",
    tier: "Core",
    tierColor: "bg-blue-100 text-blue-700",
    icon: Users,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      "Student Enrollment",
      "Grade Tracking", 
      "Attendance Management",
      "Parent Portal"
    ]
  },
  {
    id: "staff-management",
    title: "Staff Management", 
    description: "Complete HR solution for educational institutions.",
    tier: "Core",
    tierColor: "bg-blue-100 text-blue-700",
    icon: UserCheck,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      "Staff Profiles",
      "Scheduling",
      "Performance Tracking",
      "Payroll Integration"
    ]
  },
  {
    id: "analytics-reporting",
    title: "Analytics & Reporting",
    description: "Data-driven insights to improve educational outcomes.",
    tier: "Advanced",
    tierColor: "bg-green-100 text-green-700",
    icon: BarChart3,
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    features: [
      "Performance Analytics",
      "Custom Reports",
      "Predictive Insights",
      "Data Export"
    ]
  },
  {
    id: "academic-calendar",
    title: "Academic Calendar",
    description: "Integrated calendar system for academic planning.",
    tier: "Core",
    tierColor: "bg-blue-100 text-blue-700",
    icon: Calendar,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    features: [
      "Event Management",
      "Class Scheduling",
      "Exam Planning",
      "Holiday Tracking"
    ]
  },
  {
    id: "digital-library",
    title: "Digital Library",
    description: "Modern digital library with interactive learning resources.",
    tier: "Premium",
    tierColor: "bg-purple-100 text-purple-700",
    icon: BookOpen,
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    features: [
      "E-Books",
      "Interactive Content",
      "Search & Discovery",
      "Usage Analytics"
    ]
  },
  {
    id: "security-compliance",
    title: "Security & Compliance",
    description: "Enterprise-grade security and compliance features.",
    tier: "Enterprise",
    tierColor: "bg-gray-100 text-gray-700",
    icon: Shield,
    iconColor: "text-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    features: [
      "Data Encryption",
      "GDPR Compliance",
      "Audit Trails",
      "Role-based Access"
    ]
  }
];

export function Solutions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">E</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">EdVirons</span>
                </div>
              </Link>
              
              <div className="hidden md:flex ml-8 space-x-8">
                <a href="#features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</a>
                <Link href="/solutions">
                  <span className="text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Solutions</span>
                </Link>
                <Link href="/cbe-overview">
                  <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">CBE Overview</span>
                </Link>
                <a href="#about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">About</a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/demo">
                <Button variant="outline">Request Demo</Button>
              </Link>
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Complete Solutions for
            <br />
            <span className="text-yellow-300">Modern Education</span>
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Transform your educational institution with our comprehensive 
            suite of digital tools designed for the future of learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Solutions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our integrated platform can streamline operations and 
              enhance the educational experience for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon;
              return (
                <Card key={solution.id} className={`${solution.bgColor} ${solution.borderColor} border-2 hover:shadow-lg transition-shadow duration-300`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 ${solution.bgColor} rounded-lg flex items-center justify-center`}>
                        <IconComponent className={`h-6 w-6 ${solution.iconColor}`} />
                      </div>
                      <Badge className={solution.tierColor}>
                        {solution.tier}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {solution.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm">
                      {solution.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <Check className={`h-4 w-4 mr-2 ${solution.iconColor}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full group hover:bg-blue-600 hover:text-white"
                    >
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Institution?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join thousands of schools worldwide that trust EdVirons to power their educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Schedule Demo
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
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><Link href="/solutions" className="hover:text-white">Solutions</Link></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white">About</a></li>
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