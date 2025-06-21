import React, { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Shield, 
  Smartphone, 
  BarChart3,
  GraduationCap,
  Library,
  UserCheck,
  Settings,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "Digital Library & Resources",
      description: "Comprehensive collection of educational materials aligned with curriculum standards",
      icon: BookOpen,
      image: "/api/placeholder/600/400",
      benefits: ["Interactive textbooks", "Video lessons", "Assessment tools", "Progress tracking"]
    },
    {
      title: "Student Management System", 
      description: "Complete student lifecycle management with academic tracking and reporting",
      icon: Users,
      image: "/api/placeholder/600/400", 
      benefits: ["Student profiles", "Academic records", "Attendance tracking", "Parent communication"]
    },
    {
      title: "Academic Calendar & Planning",
      description: "Integrated scheduling system for classes, exams, and school events",
      icon: Calendar,
      image: "/api/placeholder/600/400",
      benefits: ["Term planning", "Event scheduling", "Exam timetables", "Holiday management"]
    },
    {
      title: "Security & Device Management",
      description: "Comprehensive security framework with device monitoring and access control",
      icon: Shield, 
      image: "/api/placeholder/600/400",
      benefits: ["Device tracking", "Access control", "Security monitoring", "Policy enforcement"]
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Mwangi",
      role: "Principal, Nairobi International School",
      content: "Edvirons has transformed how we manage our school operations. The integrated platform makes everything seamless.",
      rating: 5
    },
    {
      name: "John Kariuki", 
      role: "ICT Coordinator, Mombasa Academy",
      content: "The digital library has revolutionized our teaching approach. Students are more engaged than ever.",
      rating: 5
    },
    {
      name: "Grace Wanjiku",
      role: "Parent, Karen Primary School", 
      content: "I love being able to track my child's progress in real-time. The communication tools are excellent.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mr-3" />
              <span className="text-2xl font-bold text-gray-900">Edvirons</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4">
              Transforming Education in Kenya
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Complete School
              <span className="text-blue-600"> Management</span>
              <br />Platform
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline your educational institution with our comprehensive platform featuring 
              digital library, student management, academic planning, and security solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-blue-100">Schools</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">150K+</div>
              <div className="text-blue-100">Students</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">12K+</div>
              <div className="text-blue-100">Teachers</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold">47</div>
              <div className="text-blue-100">Counties</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Run Your School
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform integrates all aspects of school management 
              into one seamless solution.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Card 
                      key={index}
                      className={`cursor-pointer transition-all duration-300 ${
                        activeFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                      }`}
                      onClick={() => setActiveFeature(index)}
                    >
                      <CardHeader>
                        <div className="flex items-center">
                          <div className={`p-2 rounded-lg mr-4 ${
                            activeFeature === index ? 'bg-blue-100' : 'bg-gray-100'
                          }`}>
                            <Icon className={`h-6 w-6 ${
                              activeFeature === index ? 'text-blue-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                          <ChevronRight className={`h-5 w-5 ml-auto transition-transform ${
                            activeFeature === index ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </CardHeader>
                      {activeFeature === index && (
                        <CardContent className="pt-0">
                          <div className="grid grid-cols-2 gap-2">
                            {feature.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span className="text-sm text-gray-600">{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="lg:pl-8">
              <div className="bg-gray-100 rounded-lg aspect-[4/3] flex items-center justify-center">
                <div className="text-center">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {features[activeFeature] && React.createElement(features[activeFeature].icon, {
                      className: "h-8 w-8 text-blue-600"
                    })}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {features[activeFeature]?.title}
                  </h3>
                  <p className="text-gray-600">
                    Interactive demo coming soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Educational Leaders
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about Edvirons
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of schools already using Edvirons to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Start Your Free Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <GraduationCap className="h-8 w-8 text-blue-400 mr-3" />
                <span className="text-2xl font-bold text-white">Edvirons</span>
              </div>
              <p className="text-gray-400">
                Transforming education through innovative technology solutions.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Edvirons. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}