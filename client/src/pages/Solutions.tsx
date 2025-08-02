import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Users, Users2, BarChart3, Calendar, BookOpen, Shield, ArrowRight } from "lucide-react";

export default function Solutions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                  </div>
                  <span className="text-xl font-semibold text-gray-900">Learning Portal</span>
                </div>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  Features
                </span>
              </Link>
              <Link href="/solutions">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  Solutions
                </span>
              </Link>
              <Link href="/cbe-overview">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  CBE Overview
                </span>
              </Link>
              <Link href="/about">
                <span className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer transition-colors">
                  About
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline">Get Started</Button>
              <Button>Login</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Complete Solutions for <span className="text-yellow-300">Modern Education</span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto mb-8">
            Transform your educational institution with our comprehensive suite of digital tools designed for the future of learning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Get Demo →
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-purple-600">
              View Pricing
            </Button>
          </div>
        </div>
      </div>

      {/* Solutions Overview */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our integrated platform can streamline operations and enhance the educational experience for everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Student Management */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <Badge className="bg-blue-100 text-blue-800">Core</Badge>
                </div>
                <CardTitle className="text-xl">Student Management</CardTitle>
                <CardDescription>
                  Comprehensive student information system with enrollment, tracking, and reporting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Student Enrollment
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Grade Tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Attendance Management
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Parent Portal
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Staff Management */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Users2 className="h-8 w-8 text-purple-600 mr-3" />
                  <Badge className="bg-purple-100 text-purple-800">Core</Badge>
                </div>
                <CardTitle className="text-xl">Staff Management</CardTitle>
                <CardDescription>
                  Complete HR solution for educational institutions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Staff Profiles
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Scheduling
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Performance Tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Payroll Integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Analytics & Reporting */}
            <Card className="border-2 border-green-200 hover:border-green-400 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
                  <Badge className="bg-green-100 text-green-800">Advanced</Badge>
                </div>
                <CardTitle className="text-xl">Analytics & Reporting</CardTitle>
                <CardDescription>
                  Data-driven insights to improve educational outcomes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Performance Analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Custom Reports
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Predictive Insights
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Data Export
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Academic Calendar */}
            <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                  <Badge className="bg-orange-100 text-orange-800">Core</Badge>
                </div>
                <CardTitle className="text-xl">Academic Calendar</CardTitle>
                <CardDescription>
                  Centralized scheduling and event management.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button variant="outline" size="sm" className="mt-4">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Digital Library */}
            <Card className="border-2 border-indigo-200 hover:border-indigo-400 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <BookOpen className="h-8 w-8 text-indigo-600 mr-3" />
                  <Badge className="bg-indigo-100 text-indigo-800">Premium</Badge>
                </div>
                <CardTitle className="text-xl">Digital Library</CardTitle>
                <CardDescription>
                  Comprehensive resource management and access.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button variant="outline" size="sm" className="mt-4">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security & Compliance */}
            <Card className="border-2 border-red-200 hover:border-red-400 transition-colors">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Shield className="h-8 w-8 text-red-600 mr-3" />
                  <Badge className="bg-red-100 text-red-800">Enterprise</Badge>
                </div>
                <CardTitle className="text-xl">Security & Compliance</CardTitle>
                <CardDescription>
                  Enterprise-grade security and regulatory compliance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button variant="outline" size="sm" className="mt-4">
                    Learn More <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}