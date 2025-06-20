import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  Calendar,
  Award,
  GraduationCap,
  School,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Database,
  BarChart,
  Settings,
  MapPin,
  Star,
  CheckCircle
} from "lucide-react";

export function Landing() {
  // EdVirons Platform Modules based on the actual system
  const platformModules = [
    {
      icon: School,
      title: "School Management",
      description: "Centralized system for student records, exams, fees, attendance, timetables, and staff management.",
      package: "Institution",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Monitor,
      title: "MDM & Surveillance (Nexus)",
      description: "IT/admin tool to manage student devices, deploy content, enforce usage policies, and monitor security feeds.",
      package: "Institution",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: BookOpen,
      title: "Digital Library",
      description: "Curriculum-aligned repository of interactive books, videos, quizzes, and learning resources.",
      package: "All (tiered access)",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Users,
      title: "Tutor Hub",
      description: "Personalized workspace for tutors: schedule classes, track learner progress, and share resources.",
      package: "Tutor",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Shield,
      title: "Family & Parental Controls",
      description: "Parent dashboard to monitor child activity, set usage limits, and receive performance reports.",
      package: "Family",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: GraduationCap,
      title: "Self-Learning Toolkit",
      description: "AI-powered learning paths, certification tracking, and progress analytics for independent learners (18+).",
      package: "Individual",
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      icon: Zap,
      title: "Virtual Labs",
      description: "Interactive STEM/ICT/Science simulations for CBC/IGCSE curricula.",
      package: "All (plan-dependent)",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Calendar,
      title: "Scheduling & Events",
      description: "Unified calendar for lessons, exams, and notifications.",
      package: "Institution, Tutor, Family",
      color: "bg-pink-100 text-pink-600"
    },
    {
      icon: Award,
      title: "Certification & Skills Tracking",
      description: "Tracks competency milestones and generates verifiable digital certificates.",
      package: "Tutor, Individual, Institution",
      color: "bg-teal-100 text-teal-600"
    },
    {
      icon: BarChart,
      title: "Analytics & Reporting",
      description: "Custom dashboards for performance trends, engagement metrics, and resource utilization.",
      package: "Admin, Tutor, Parent",
      color: "bg-cyan-100 text-cyan-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Companion App",
      description: "Lightweight sync for lockers, schedules, and communication.",
      package: "All",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: Globe,
      title: "Offline Sync & LAN Mode",
      description: "Low-bandwidth solution for offline content access and local network deployment.",
      package: "Institution",
      color: "bg-slate-100 text-slate-600"
    }
  ];

  const packages = [
    {
      name: "Institution Package",
      price: "Contact for Pricing",
      description: "Complete school management solution",
      features: [
        "School Management System",
        "MDM & Surveillance",
        "Digital Library (Full Access)",
        "Scheduling & Events",
        "Analytics & Reporting",
        "Offline Sync & LAN Mode",
        "Mobile App",
        "24/7 Support"
      ],
      popular: true
    },
    {
      name: "Family Package",
      price: "KES 2,500/month",
      description: "Perfect for homeschooling families",
      features: [
        "Digital Library (Tiered)",
        "Parental Controls",
        "Progress Tracking",
        "Mobile App",
        "Virtual Labs (Limited)",
        "Email Support"
      ],
      popular: false
    },
    {
      name: "Individual Package",
      price: "KES 1,000/month",
      description: "For independent learners 18+",
      features: [
        "Self-Learning Toolkit",
        "Digital Library Access",
        "Certification & Skills Tracking",
        "Virtual Labs",
        "Mobile App",
        "Community Support"
      ],
      popular: false
    },
    {
      name: "Tutor Package",
      price: "KES 1,500/month",
      description: "Professional tutoring workspace",
      features: [
        "Tutor Hub",
        "Scheduling & Events",
        "Progress Tracking",
        "Digital Resources",
        "Certification Tools",
        "Priority Support"
      ],
      popular: false
    }
  ];

  const keyFeatures = [
    {
      title: "Offline-First Design",
      description: "Works seamlessly with or without internet connectivity, perfect for Kenya's infrastructure."
    },
    {
      title: "CBC & IGCSE Aligned",
      description: "Curriculum-specific content designed for Kenyan educational standards."
    },
    {
      title: "Multi-Language Support",
      description: "Available in English, Kiswahili, and local languages."
    },
    {
      title: "Affordable Pricing",
      description: "Designed for African markets with flexible payment options including M-Pesa."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-900">EdVirons</span>
                </div>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About
              </Link>
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="/solutions" className="text-gray-600 hover:text-blue-600 transition-colors">
                Solutions
              </Link>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 flex justify-center">
            <Badge className="bg-yellow-500 text-yellow-900 px-4 py-2">
              🇰🇪 Built for Kenya's Educational Landscape
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Kenya's Premier
            <br />
            <span className="text-yellow-300">Educational Platform</span>
          </h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            An innovative offline-first educational ecosystem, equipping schools with smart, 
            scalable tools to teach, learn, and thrive—with or without internet access.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/interactive-signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </Link>
          </div>

          <div className="mt-16">
            <img
              src="/api/placeholder/800/450"
              alt="EdVirons Platform Dashboard"
              className="mx-auto rounded-lg shadow-2xl"
              width={800}
              height={450}
            />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why EdVirons?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for African educational environments with unique challenges and opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Modules */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Educational Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Integrated modules that work together to provide a comprehensive educational platform
              for schools, tutors, families, and individual learners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformModules.map((module, index) => {
              const Icon = module.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${module.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <Badge variant="outline" className="w-fit text-xs">
                      {module.package}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{module.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing designed for different educational needs across Kenya.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-blue-500 scale-105' : ''}`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="text-2xl font-bold text-blue-600 mt-2">{pkg.price}</div>
                  <p className="text-sm text-gray-600 mt-2">{pkg.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/interactive-signup">
                    <Button className={`w-full mt-6 ${pkg.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
                      {pkg.price.includes('Contact') ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Education in Your Institution?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join schools across Kenya that are already using EdVirons to enhance 
            their educational delivery and student outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/interactive-signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-4">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EdVirons</span>
              </div>
              <p className="text-gray-400 text-sm">
                Powering Education Beyond Connectivity Barriers in Kenya and across Africa.
              </p>
              <div className="flex items-center mt-4 text-sm text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                Nairobi, Kenya
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/solutions" className="hover:text-white">Solutions</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link href="/status" className="hover:text-white">System Status</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © 2024 EdVirons. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy</Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">Terms</Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}