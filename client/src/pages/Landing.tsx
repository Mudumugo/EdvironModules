import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TenantInfo from "@/components/TenantInfo";
import { GraduationCap, Users, BookOpen, Calendar, BarChart3, Shield, Crown, Building2, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  // Direct API call to get tenant data
  const { data: tenantData, isLoading: tenantLoading } = useQuery<{
    id: string;
    subdomain: string;
    name: string;
    features: string[];
    subscription: string;
  }>({
    queryKey: ["/api/tenant"],
    retry: false,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Edvirons</h1>
              <span className="text-sm text-gray-500 border-l border-gray-200 pl-4">Learning Portal</span>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => window.location.href = "/school"} 
                variant="outline"
                className="border-primary-600 text-primary-600 hover:bg-primary-50"
              >
                School Management
              </Button>
              <Button 
                onClick={() => window.location.href = "/tutor-hub"} 
                variant="outline"
                className="border-accent-600 text-accent-600 hover:bg-accent-50"
              >
                Tutor Hub
              </Button>
              <Button 
                onClick={() => window.location.href = "/my-locker"} 
                variant="outline"
                className="border-secondary-600 text-secondary-600 hover:bg-secondary-50"
              >
                My Locker
              </Button>
              <Button onClick={handleLogin} className="bg-primary-600 hover:bg-primary-700">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Educational Technology Platform
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive learning portal with interconnected modules for school management, 
            digital learning, tutoring, and family engagement.
          </p>
          <div className="mt-10">
            <Button 
              onClick={handleLogin}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 text-lg px-8 py-3"
            >
              Get Started
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Platform Modules</h2>
            <p className="mt-4 text-lg text-gray-600">
              Integrated solutions for modern educational institutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-50 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">School Management</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Student records, attendance, exams, and staff management
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-secondary-50 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Digital Library</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Curriculum-aligned interactive content and resources
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-accent-50 p-3 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Tutor Hub</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized workspace for tutors and educators
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Scheduling & Events</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Unified calendar for classes, exams, and notifications
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Analytics & Reporting</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Performance dashboards and detailed insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Family Controls</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Parent dashboard for monitoring and engagement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tenant Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <Crown className="h-8 w-8 text-yellow-600" />
              Demo University Access
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              You are accessing the Demo University tenant with basic subscription features
            </p>
          </div>
          {/* Static Demo University Information */}
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-gray-600" />
                Demo University
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Subscription:</span>
                <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800 border-blue-200">
                  <Shield className="h-3 w-3" />
                  Basic
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tenant ID:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">demo</code>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Available Features:</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">School Management</Badge>
                  <Badge variant="outline" className="text-xs">Digital Library</Badge>
                  <Badge variant="outline" className="text-xs">Analytics</Badge>
                </div>
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Status:</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-green-700">Active and accessible</span>
                </div>
              </div>

              {tenantData && (
                <div className="pt-2 border-t">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Live API Data:</h4>
                  <div className="bg-gray-100 p-3 rounded text-xs font-mono">
                    <pre>{JSON.stringify(tenantData, null, 2)}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Transform Education?</h2>
          <p className="mt-4 text-lg text-primary-100">
            Join thousands of educators and institutions using Edvirons
          </p>
          <div className="mt-8">
            <Button 
              onClick={handleLogin}
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Edvirons Learning Portal</span>
          </div>
          <p className="mt-4 text-center text-gray-400">
            © 2025 Edvirons. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
