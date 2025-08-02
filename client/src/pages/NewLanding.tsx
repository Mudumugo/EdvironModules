import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Play, 
  Star, 
  Check, 
  GraduationCap,
  BookOpen,
  Users,
  Award,
  BarChart3,
  Shield,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  ChevronDown,
  Menu,
  X,
  Server,
  Laptop,
  Lock,
  Database,
  Headphones,
  Monitor
} from "lucide-react";

export function NewLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white fade-in">
      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                    <img 
                      src="/attached_assets/edv-main-logo_1754150677721.png" 
                      alt="EdVirons Logo" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xl font-semibold text-white">EdVirons</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features">
                <span className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  Features
                </span>
              </Link>
              <Link href="/solutions">
                <span className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  Solutions
                </span>
              </Link>
              <Link href="/cbe-overview">
                <span className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  CBC Overview
                </span>
              </Link>
              <Link href="/about">
                <span className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  About
                </span>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/demo">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6">
                  Get Started for Institutions
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700 px-6">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700 py-4">
              <div className="flex flex-col space-y-2">
                <span className="block px-3 py-2 text-gray-300 hover:text-orange-400 cursor-pointer">Complete Infrastructure</span>
                <span className="block px-3 py-2 text-gray-300 hover:text-orange-400 cursor-pointer">Learning Support</span>
                <Link href="/cbe-overview">
                  <span className="block px-3 py-2 text-gray-300 hover:text-orange-400 cursor-pointer">CBC Overview</span>
                </Link>
                <div className="pt-4 border-t border-slate-700">
                  <Link href="/demo">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-2">
                      Get Started for Institutions
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-gray-400 text-gray-200">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/attached_assets/edvirons_logo_1754153234855.jpg" 
            alt="EdVirons Educational Background" 
            className="w-full h-full object-cover"
          />
        </div>
        

        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              EdVirons Learning Ecosystem
            </h1>
            <h2 className="text-xl md:text-2xl text-orange-400 font-semibold mb-8">
              A Complete Learning Ecosystem: Infrastructure, Apps, Security, Content, Data & OS Licensing
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
              Complete learning ecosystem designed for African learning institutions—aligned to CBE & IGCSE.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/demo">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg">
                  Get Started for Institutions
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-800 px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Try Free Parent Mode
                </Button>
              </Link>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-center p-4">
                <div className="flex flex-col items-center">
                  <Server className="h-8 w-8 text-orange-400 mb-2" />
                  <h3 className="font-semibold text-white text-sm">Infrastructure</h3>
                  <p className="text-xs text-gray-300 mt-1">Offline-capable, low-bandwidth environments.</p>
                </div>
              </Card>
              
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-center p-4">
                <div className="flex flex-col items-center">
                  <Laptop className="h-8 w-8 text-orange-400 mb-2" />
                  <h3 className="font-semibold text-white text-sm">Applications</h3>
                  <p className="text-xs text-gray-300 mt-1">Integrated suite of educational applications.</p>
                </div>
              </Card>
              
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-center p-4">
                <div className="flex flex-col items-center">
                  <Lock className="h-8 w-8 text-orange-400 mb-2" />
                  <h3 className="font-semibold text-white text-sm">Security</h3>
                  <p className="text-xs text-gray-300 mt-1">Enterprise-grade, GDPR-compliant security.</p>
                </div>
              </Card>
              
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-center p-4">
                <div className="flex flex-col items-center">
                  <Database className="h-8 w-8 text-orange-400 mb-2" />
                  <h3 className="font-semibold text-white text-sm">Data & Analytics</h3>
                  <p className="text-xs text-gray-300 mt-1">Real-time insights and learning optimization.</p>
                </div>
              </Card>
              
              <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-center p-4">
                <div className="flex flex-col items-center">
                  <Monitor className="h-8 w-8 text-orange-400 mb-2" />
                  <h3 className="font-semibold text-white text-sm">OS Licensing</h3>
                  <p className="text-xs text-gray-300 mt-1">Transform existing computer labs.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Institutions Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by leading African learning institutions
            </h2>
            <p className="text-lg text-gray-600">
              Empowering educational excellence across the continent
            </p>
          </div>
          
          {/* Institutions Carousel */}
          <div className="relative overflow-hidden">
            <div className="animate-scroll-institutions flex space-x-16 py-8">
              {/* First set of institutions */}
              <div className="flex space-x-16 min-w-max">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">BS</span>
                  </div>
                  <p className="text-gray-700 font-medium">Brookhouse School</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">NP</span>
                  </div>
                  <p className="text-gray-700 font-medium">Nova Pioneer</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">AKA</span>
                  </div>
                  <p className="text-gray-700 font-medium">Aga Khan Academy</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">HI</span>
                  </div>
                  <p className="text-gray-700 font-medium">Hillcrest International</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">SMS</span>
                  </div>
                  <p className="text-gray-700 font-medium">St. Mary's School</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">ISK</span>
                  </div>
                  <p className="text-gray-700 font-medium">International School Kenya</p>
                </div>
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex space-x-16 min-w-max">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">BS</span>
                  </div>
                  <p className="text-gray-700 font-medium">Brookhouse School</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">NP</span>
                  </div>
                  <p className="text-gray-700 font-medium">Nova Pioneer</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">AKA</span>
                  </div>
                  <p className="text-gray-700 font-medium">Aga Khan Academy</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">HI</span>
                  </div>
                  <p className="text-gray-700 font-medium">Hillcrest International</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">SMS</span>
                  </div>
                  <p className="text-gray-700 font-medium">St. Mary's School</p>
                </div>
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-3 mx-auto shadow-sm">
                    <span className="text-gray-700 font-bold text-xl">ISK</span>
                  </div>
                  <p className="text-gray-700 font-medium">International School Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seven Pillars Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Seven Pillars of a Conducive Learning Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Every component works together seamlessly to create the ideal conditions for focused, effective learning across African educational institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Infrastructure */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Server className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Infrastructure</h3>
                <p className="text-gray-600 mb-4">
                  Robust offline-capable platform for low-bandwidth environments.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Built to work seamlessly even in challenging connectivity conditions across Africa
                </p>
              </div>
            </Card>

            {/* Applications Suite */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Laptop className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Applications Suite</h3>
                <p className="text-gray-600 mb-4">
                  Integrated educational and management applications.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Complete Mobile Device Management (MDM) with learning apps and school tools
                </p>
              </div>
            </Card>

            {/* Enterprise Security */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Enterprise Security</h3>
                <p className="text-gray-600 mb-4">
                  Advanced security with GDPR compliance and data protection.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Role-based access, single sign-on, and comprehensive privacy controls
                </p>
              </div>
            </Card>

            {/* Educational Content */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Educational Content</h3>
                <p className="text-gray-600 mb-4">
                  10K+ curriculum-aligned videos, ebooks, and resources.
                </p>
                <p className="text-sm text-gray-500 italic">
                  CBE and IGCSE aligned content library with interactive assessments
                </p>
              </div>
            </Card>

            {/* Data Analytics */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Real-time insights and learning optimization.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Comprehensive analytics for student progress, engagement, and institutional performance
                </p>
              </div>
            </Card>

            {/* End-User Computing */}
            <Card className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Headphones className="h-8 w-8 text-indigo-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">End-User Computing</h3>
                <p className="text-gray-600 mb-4">
                  24/7 proactive support with issue resolution.
                </p>
                <p className="text-sm text-gray-500 italic">
                  Complete technical support ecosystem with issues fixed before users realize
                </p>
              </div>
            </Card>
          </div>

          {/* EdVirons OS License Card */}
          <div className="max-w-md mx-auto">
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Monitor className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">EdVirons OS License</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Transform existing computer labs into multipurpose, shareable learning environments.
                </p>
                <p className="text-xs text-gray-500 italic">
                  Licensed operating system designed to maximize existing hardware investments and enable collaborative learning
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 mb-8">
              Get started in minutes with our simple three-step process
            </p>
            <Button variant="outline" className="mb-12">
              <Play className="mr-2 h-4 w-4" />
              See it in action
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Step 1 */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">1</span>
              </div>
              <div className="mb-6">
                <Users className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h3>
              <p className="text-blue-600 font-medium mb-4">School or parent selects plan</p>
              <p className="text-sm text-gray-600">
                Choose the plan that fits your needs - from individual parent accounts to enterprise school solutions.
              </p>
            </Card>

            {/* Step 2 */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">2</span>
              </div>
              <div className="mb-6">
                <Award className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Onboard</h3>
              <p className="text-blue-600 font-medium mb-4">Bulk-upload students or sync with SIMS</p>
              <p className="text-sm text-gray-600">
                Seamlessly integrate with your existing systems or quickly import student data.
              </p>
            </Card>

            {/* Step 3 */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold">3</span>
              </div>
              <div className="mb-6">
                <ArrowRight className="h-16 w-16 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Launch</h3>
              <p className="text-blue-600 font-medium mb-4">Teachers assign lessons; admins monitor devices</p>
              <p className="text-sm text-gray-600">
                Start teaching immediately with our intuitive interface and comprehensive monitoring tools.
              </p>
            </Card>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-full px-6 py-3">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-gray-700">Sign Up</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-gray-700">Onboard</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="ml-2 text-sm font-medium text-gray-700">Launch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-lg font-medium text-blue-600 mb-4">
              Trusted by leading African learning institutions
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-16">
            {[
              { name: "Brookhouse School", abbr: "BS" },
              { name: "Nova Pioneer", abbr: "NP" },
              { name: "Aga Khan Academy", abbr: "AKA" },
              { name: "Hillcrest International", abbr: "HI" },
              { name: "St. Mary's School", abbr: "SMS" },
              { name: "International School Kenya", abbr: "ISK" }
            ].map((school, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-medium text-gray-600">{school.abbr}</span>
                </div>
                <p className="text-xs text-gray-500">{school.name}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators Across Africa
            </h2>
            <p className="text-xl text-gray-600">
              See how EdVirons is transforming education in learning institutions across the continent
            </p>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                "Our students' focus improved by 60% after implementing EdVirons. The device control features eliminated distractions completely."
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">Dr. Sarah Mwangi</p>
                <p className="text-sm text-gray-500">School Administrator</p>
                <p className="text-sm text-orange-500">Nairobi, Kenya</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                "Finally, an African platform that works offline! Our rural school now has access to quality educational content despite connectivity issues."
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">Michael Adebayo</p>
                <p className="text-sm text-gray-500">Head Teacher</p>
                <p className="text-sm text-orange-500">Lagos, Nigeria</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-gray-600 mb-4 italic">
                "The curriculum alignment with CBE and IGCSE systems saved us months of content preparation. Highly recommended!"
              </blockquote>
              <div>
                <p className="font-semibold text-gray-900">Grace Nalwanga</p>
                <p className="text-sm text-gray-500">Mathematics Teacher</p>
                <p className="text-sm text-orange-500">Kampala, Uganda</p>
              </div>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">300+</div>
              <p className="text-gray-600">Institutions Trust Us</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">50,000+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">60%</div>
              <p className="text-gray-600">Improved Focus</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">15+</div>
              <p className="text-gray-600">African Countries</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that fits your needs. Start free, scale as you grow.
            </p>
            
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <Button variant="ghost" className="bg-white shadow-sm">For Parents</Button>
                <Button className="bg-orange-500 text-white">For Institutions</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Institution Plan */}
            <Card className="relative p-8 border-2 border-orange-500">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500">
                Most Popular
              </Badge>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Institution</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">KSh 500</span>
                  <span className="text-gray-500">/student/term</span>
                </div>
                <p className="text-gray-600">Complete institutional solution</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Unlimited devices per student",
                  "Full curriculum library",
                  "Institution management tools",
                  "Attendance tracking",
                  "Parent portal access",
                  "Training & support"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Start Institution Trial
              </Button>
            </Card>

            {/* EdVirons OS Plan */}
            <Card className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">EdVirons OS</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">KSh 200</span>
                  <span className="text-gray-500">/device/year</span>
                </div>
                <p className="text-gray-600">Transform existing computer labs</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Multipurpose lab transformation",
                  "Maximize hardware ROI",
                  "Collaborative learning features",
                  "Seamless ecosystem integration",
                  "Reduced infrastructure costs",
                  "Future-ready platform"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full">
                License OS
              </Button>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Enterprise</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-gray-600">Custom MDM + API access</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Custom integrations",
                  "Advanced analytics",
                  "Multi-institution management",
                  "Dedicated support manager",
                  "Custom training",
                  "SLA guarantee"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="outline" className="w-full">
                Contact Sales
              </Button>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Compare All Plans
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-xl font-semibold">EdVirons</span>
              </div>
              <p className="text-gray-400 mb-4">
                Africa's leading learning platform, empowering learning institutions with secure, engaging, and offline-ready educational technology.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-gray-400">help@edvirons.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-gray-400">+254 700 123 456</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-orange-500 mr-2" />
                  <span className="text-gray-400">Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link href="/cbe-overview" className="text-gray-400 hover:text-white transition-colors">CBC Overview</Link></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Training Resources</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">System Status</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400">Language: EN | SW | FR</p>
              </div>
              <div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Phone className="mr-2 h-4 w-4" />
                  WhatsApp Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}