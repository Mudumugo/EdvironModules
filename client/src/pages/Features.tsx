import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { CheckCircle, Users, Brain, Smartphone, Cloud, Target } from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
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
      <div className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-blue-400">EdVirons</span> Features
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your school's all-in-one digital learning ecosystem designed for the modern classroom.
          </p>
        </div>
      </div>

      {/* Feature Categories */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Badge variant="default" className="text-sm py-2 px-4">All in One</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Offline First</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">AI-Powered</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Mobile</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Cloud Ready</Badge>
          </div>
        </div>
      </div>

      {/* Pilot Program Section */}
      <div className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Our Pilot Program</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">For 5 schools working with dedicated expert support</h3>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Early adopter pricing with complete curriculum data and content features</h3>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Scheduled onboarding by our support team until June 30th, 2025</h3>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Apply for Pilot Program
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-6">Pilot Program Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Applications</p>
                    <p className="text-sm text-gray-600">Open through March 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">School & Training</p>
                    <p className="text-sm text-gray-600">April-May 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-4"></div>
                  <div>
                    <p className="font-medium">Active Implementation</p>
                    <p className="text-sm text-gray-600">June 2025 onwards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Based Features */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Designed for Every Role in Education</h2>
            <p className="text-xl text-gray-600">Discover how EdVirons adapts to your specific needs.</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="default" className="text-sm py-2 px-4">Students</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Teachers</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Administrators</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">Parents</Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">School Boards</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Tools designed to save time and enhance teaching effectiveness</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Brain className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI-Powered Lesson Planning</h4>
                    <p className="text-gray-600">Automated curriculum alignment and resource recommendations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Class Management</h4>
                    <p className="text-gray-600">Streamlined attendance, grading, and progress tracking</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Smartphone className="h-6 w-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mobile-First Design</h4>
                    <p className="text-gray-600">Full functionality on any device, anywhere</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Teacher Efficiency Metrics</h3>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600">40%</div>
                    <div className="text-sm text-gray-600">Time Saved on Planning</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">25%</div>
                    <div className="text-sm text-gray-600">Faster Grading</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">60%</div>
                    <div className="text-sm text-gray-600">Improved Parent Engagement</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-600">Teacher Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}