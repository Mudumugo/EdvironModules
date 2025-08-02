import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Eye, Target, Users, Globe, Award, TrendingUp } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
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
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center mx-auto mb-8">
            <span className="text-gray-900 font-bold text-3xl">E</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About Our Platform
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Powering Education Beyond Connectivity Barriers
          </p>
        </div>
      </div>

      {/* Platform Description */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            An innovative offline-first educational ecosystem, equipping schools with smart, scalable tools to 
            teach, learn, and thrive—with or without internet access.
          </p>
        </div>
      </div>

      {/* Our Purpose */}
      <div className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Target className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Purpose</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Driven by a clear vision and unwavering mission to transform education through innovative technology solutions.
            </p>
          </div>
        </div>
      </div>

      {/* Vision and Mission */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Our Vision */}
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
              <CardHeader className="text-center">
                <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-purple-800">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  To make personalized, curriculum-aligned education universally accessible across Africa's diverse 
                  learning landscapes, empowering every learner, regardless of their connectivity or geographic constraints.
                </p>
              </CardContent>
            </Card>

            {/* Our Mission */}
            <Card className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-2xl text-blue-800">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  To deliver an integrated digital school infrastructure that works seamlessly in both high-tech and 
                  low-bandwidth environments, providing educational tools that adapt to local contexts and needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <TrendingUp className="h-16 w-16 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-blue-100">Transforming education across Africa</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Schools Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Students Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2K+</div>
              <div className="text-blue-100">Teachers Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-100">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Advantages */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EdVirons</h2>
            <p className="text-xl text-gray-600">Our unique advantages in the educational technology space</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Offline-First Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Full functionality without internet dependency, perfect for areas with limited connectivity.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Local Context</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Curriculum-aligned content that respects and incorporates African educational standards and culture.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Scalable Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Designed to grow with your institution, from single classrooms to entire educational districts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}