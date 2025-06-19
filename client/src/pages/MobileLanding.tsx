import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import { 
  BookOpen, 
  Users, 
  Calendar,
  Award,
  PlayCircle,
  Smartphone,
  Menu,
  X,
  ChevronRight,
  Star
} from 'lucide-react';

export default function MobileLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Access courses and materials optimized for mobile learning"
    },
    {
      icon: Users,
      title: "Connect Anywhere",
      description: "Join classes and collaborate with peers on the go"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Manage your learning schedule with mobile-friendly tools"
    },
    {
      icon: Award,
      title: "Track Progress",
      description: "Monitor achievements and milestones from your phone"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Students" },
    { number: "500+", label: "Courses" },
    { number: "98%", label: "Success Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <Logo size="sm" />
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-6 space-y-4">
            <Link href="/signup">
              <Button className="w-full" onClick={() => setIsMenuOpen(false)}>
                Get Started
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" className="w-full" onClick={() => setIsMenuOpen(false)}>
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <Badge variant="secondary" className="inline-flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            Mobile Optimized
          </Badge>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
            Learn Anywhere, 
            <span className="text-blue-600 dark:text-blue-400"> Anytime</span>
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Your complete learning platform designed for mobile-first education
          </p>

          <div className="space-y-3 pt-4">
            <Link href="/signup">
              <Button size="lg" className="w-full">
                Start Learning Free
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            
            <Link href="/signin">
              <Button variant="outline" size="lg" className="w-full">
                Sign In to Continue
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-8">
            {stats.slice(0, 2).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            Everything You Need
          </h2>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <feature.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            See It In Action
          </h2>
          
          <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button size="lg" variant="secondary" className="gap-2">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            2-minute overview of the platform
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-12 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <blockquote className="text-gray-700 dark:text-gray-300 italic">
            "The mobile experience is incredible. I can learn during my commute and never miss a class."
          </blockquote>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            — Sarah K., Student
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            {stats.slice(2).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-12">
        <div className="max-w-md mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Ready to Start?
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300">
            Join thousands of learners already using our platform
          </p>

          <div className="space-y-3">
            <Link href="/signup">
              <Button size="lg" className="w-full">
                Create Free Account
              </Button>
            </Link>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              No credit card required • Free trial included
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-md mx-auto text-center space-y-4">
          <Logo size="sm" />
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <a href="#" className="block py-1 hover:text-blue-600 dark:hover:text-blue-400">
                About
              </a>
              <a href="#" className="block py-1 hover:text-blue-600 dark:hover:text-blue-400">
                Contact
              </a>
            </div>
            <div>
              <a href="#" className="block py-1 hover:text-blue-600 dark:hover:text-blue-400">
                Privacy
              </a>
              <a href="#" className="block py-1 hover:text-blue-600 dark:hover:text-blue-400">
                Terms
              </a>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Learning Portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}