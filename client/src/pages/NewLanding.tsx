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
  X
} from "lucide-react";

export function NewLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white fade-in">
      {/* Fixed Navigation Header */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">EdVirons</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features">
                <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  Features
                </span>
              </Link>
              <Link href="/solutions">
                <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  Solutions
                </span>
              </Link>
              <Link href="/cbe-overview">
                <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  CBE Overview
                </span>
              </Link>
              <Link href="/about">
                <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  About
                </span>
              </Link>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/interactive-signup">
                <Button variant="outline" size="sm">Get Started</Button>
              </Link>
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/features">
                <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">
                  Features
                </span>
              </Link>
              <Link href="/solutions">
                <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">
                  Solutions
                </span>
              </Link>
              <Link href="/cbe-overview">
                <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">
                  CBE Overview
                </span>
              </Link>
              <Link href="/about">
                <span className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 cursor-pointer">
                  About
                </span>
              </Link>
              <div className="px-3 py-2 space-y-2">
                <Link href="/interactive-signup">
                  <Button variant="outline" size="sm" className="w-full">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button size="sm" className="w-full">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
            style={{
              backgroundImage: `url('/api/placeholder/1920/1080')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-indigo-900/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* EdVirons Logo (White/Transparent) */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center border border-white/20">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">EdVirons</h1>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur border border-white/20 text-white">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium">Trusted by 10,000+ schools worldwide</span>
            </div>
          </div>

          {/* Main Headlines */}
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Edvirons Learning
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400">
              Ecosystem
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Education Reimagined: Local Needs, Global Standards.
            <br />
            Comprehensive digital platform connecting students, teachers, and parents.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/interactive-signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-4 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Trust Badges/Value Propositions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Secure & Compliant</h3>
              <p className="text-blue-100 text-sm">Enterprise-grade security with full data privacy compliance</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <Globe className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Global Standards</h3>
              <p className="text-blue-100 text-sm">Aligned with international educational frameworks</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Multi-Tenant</h3>
              <p className="text-blue-100 text-sm">Scalable platform serving multiple institutions</p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center">
            <div className="animate-bounce">
              <ChevronDown className="h-6 w-6 text-white/60" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comprehensive Educational Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform your educational institution with cutting-edge technology and proven methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <GraduationCap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold">CBC Hub</CardTitle>
                <CardDescription>
                  Complete Competency-Based Curriculum management with digital assessment tools and progress tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-green-200">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold">Digital Library</CardTitle>
                <CardDescription>
                  Interactive digital resources aligned with Kenyan curriculum standards and international best practices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold">School Management</CardTitle>
                <CardDescription>
                  Comprehensive administrative tools for student records, staff management, and institutional operations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-200">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition-colors">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold">Learning Analytics</CardTitle>
                <CardDescription>
                  Data-driven insights into student performance, learning patterns, and institutional effectiveness.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-xl font-bold">Assessment Engine</CardTitle>
                <CardDescription>
                  Advanced assessment tools with automated grading, rubrics, and competency-based evaluation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-indigo-200">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-bold">Family Controls</CardTitle>
                <CardDescription>
                  Parent dashboard for monitoring student progress, communication, and collaborative learning support.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How EdVirons Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, powerful, and designed for educational excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Setup & Configure</h3>
              <p className="text-gray-600">
                Quick institutional setup with customizable modules, user roles, and curriculum alignment based on your specific needs.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Engage & Learn</h3>
              <p className="text-gray-600">
                Students and teachers interact through digital tools, assessments, and collaborative learning environments with real-time feedback.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Track & Improve</h3>
              <p className="text-gray-600">
                Comprehensive analytics and reporting provide insights for continuous improvement and educational excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Educational Leaders
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of institutions already transforming education with EdVirons
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "EdVirons has revolutionized our approach to competency-based education. The CBC Hub makes assessment and tracking incredibly efficient."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">MK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Mary Kiprotich</p>
                    <p className="text-gray-600 text-sm">Principal, Nairobi Academy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "The digital library resources are exceptional. Our students are more engaged than ever with the interactive learning materials."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">JO</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">James Ochieng</p>
                    <p className="text-gray-600 text-sm">Head Teacher, Mombasa Primary</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  "Parent engagement has improved dramatically. The family controls give parents real insight into their children's learning journey."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold">AN</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Alice Nyong'o</p>
                    <p className="text-gray-600 text-sm">Director, Kisumu International School</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10K+</div>
              <p className="text-gray-600">Schools Served</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">500K+</div>
              <p className="text-gray-600">Active Students</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">25K+</div>
              <p className="text-gray-600">Teachers</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-2">98%</div>
              <p className="text-gray-600">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your institution's needs. All plans include 24/7 support and regular updates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <Card className="border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Basic</CardTitle>
                <CardDescription>Perfect for small schools</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">Up to 200 students</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Digital Library Access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Basic Assessment Tools</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Student Management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Parent Portal</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Email Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Start Free Trial</Button>
              </CardFooter>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-blue-500 hover:border-blue-600 transition-colors relative">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Premium</CardTitle>
                <CardDescription>Best for medium schools</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-500">Up to 1,000 students</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Everything in Basic</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>CBC Hub Complete</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Advanced Analytics</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom Branding</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Priority Support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Start Free Trial</Button>
              </CardFooter>
            </Card>

            {/* Enterprise Plan */}
            <Card className="border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <CardDescription>For large institutions</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                </div>
                <p className="text-sm text-gray-500">Unlimited students</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Everything in Premium</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Multi-Campus Support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>API Access</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Dedicated Support</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    <span>Custom Integrations</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand & Contact */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold">EdVirons</span>
              </div>
              <p className="text-blue-200 mb-6">
                Transforming education through innovative technology solutions designed for African educational systems.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-3" />
                  <span className="text-blue-200">+254 700 000 000</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-3" />
                  <span className="text-blue-200">info@edvirons.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-3" />
                  <span className="text-blue-200">Nairobi, Kenya</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-blue-200 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/solutions" className="text-blue-200 hover:text-white transition-colors">Solutions</Link></li>
                <li><Link href="/cbe-overview" className="text-blue-200 hover:text-white transition-colors">CBC Overview</Link></li>
                <li><Link href="/about" className="text-blue-200 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-blue-200 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-blue-200 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/documentation" className="text-blue-200 hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/training" className="text-blue-200 hover:text-white transition-colors">Training</Link></li>
                <li><Link href="/support" className="text-blue-200 hover:text-white transition-colors">Contact Support</Link></li>
                <li><Link href="/status" className="text-blue-200 hover:text-white transition-colors">System Status</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-blue-200 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-blue-200 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/security" className="text-blue-200 hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/compliance" className="text-blue-200 hover:text-white transition-colors">Compliance</Link></li>
                <li><Link href="/blog" className="text-blue-200 hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>

          {/* Language Selector & Social */}
          <div className="border-t border-blue-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <select className="bg-blue-800 text-white border border-blue-700 rounded px-2 py-1 text-sm">
                  <option value="en">English</option>
                  <option value="sw">Kiswahili</option>
                </select>
              </div>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                WhatsApp Support
              </Button>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200">
              © 2025 EdVirons. All rights reserved. | Empowering African Education Through Technology
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Bar (Optional) */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link href="/interactive-signup">
          <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
            <ArrowRight className="mr-2 h-5 w-5" />
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  );
}