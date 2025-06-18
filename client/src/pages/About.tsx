import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNav } from "@/components/MarketingNav";
import { 
  GraduationCap,
  Eye,
  Target,
  BookOpen,
  Users,
  Shield,
  School,
  Award,
  Database,
  Zap,
  Globe,
  WifiOff,
  DollarSign,
  ChevronRight,
  User
} from "lucide-react";

const advantages = [
  {
    icon: BookOpen,
    title: "Learning Portal",
    description: "Personalized dashboards with age-first design ensuring every learner can thrive.",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: User,
    title: "My Tutor",
    description: "Offline-accessible personal designs for online learning resource and digital portfolios.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Shield,
    title: "EdVirons Cloud",
    description: "Secure online repository for institutional data and teaching design.",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: Eye,
    title: "EdVirons Sync",
    description: "Enabling seamless device and data management for schools.",
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  },
  {
    icon: School,
    title: "School Councils",
    description: "Safely govern instructional and school management systems.",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50"
  },
  {
    icon: Zap,
    title: "Instant Sync",
    description: "Seamless data synchronization when connectivity is available.",
    color: "text-red-600",
    bgColor: "bg-red-50"
  }
];

const impactStats = [
  {
    icon: School,
    title: "Schools",
    description: "Unlock your school's potential with comprehensive institutional tools."
  },
  {
    icon: Users,
    title: "Teachers",
    description: "Empower your teaching journey with intuitive educational tools."
  },
  {
    icon: GraduationCap,
    title: "Students",
    description: "Access digital resources that enable discovery, learn and achieve advanced educational experiences."
  },
  {
    icon: Globe,
    title: "Content Partners",
    description: "Partner with other great brands while we put your educational content completely."
  }
];

const whyEdVironsWins = [
  {
    icon: WifiOff,
    title: "Works Offline",
    description: "Full functionality via LAN or offline for uninterrupted learning.",
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description: "Best-in-class security and compliance protection.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: BookOpen,
    title: "Curriculum-First",
    description: "Deep education mapping to government-level and local curricula.",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: DollarSign,
    title: "Africa-Ready Pricing",
    description: "Flexible pan-African licensing model fit for Pan and SATC.",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export function About() {
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
                  <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Solutions</span>
                </Link>
                <Link href="/cbe-overview">
                  <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">CBE Overview</span>
                </Link>
                <Link href="/about">
                  <span className="text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer border-b-2 border-blue-600">About</span>
                </Link>
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-8">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">EdVirons</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-4">
            Powering Education Beyond Connectivity Barriers
          </p>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            EdVirons is Africa's premier offline-first edtech ecosystem, equipping schools with smart, scalable tools to 
            teach, learn, and thrive—with or without internet access.
          </p>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Purpose
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Driven by a clear vision and unwavering mission to transform education across 
            Africa.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To make personalized, curriculum-aligned education universally 
                  accessible across Africa's diverse learning landscapes, 
                  empowering every learner, regardless of their connectivity or 
                  geographic constraints.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Target className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To deliver an integrated digital school infrastructure that works 
                  seamlessly in both high-tech and low-bandwidth environments, 
                  providing robust educational tools that adapt to local contexts 
                  and needs.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* EdVirons Advantage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              The EdVirons Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive ecosystem of interconnected tools designed for the modern African 
              classroom.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => {
              const IconComponent = advantage.icon;
              return (
                <Card key={index} className={`${advantage.bgColor} border-2`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${advantage.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <IconComponent className={`h-6 w-6 ${advantage.color}`} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {advantage.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Built for Impact */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Empowering every stakeholder in the education ecosystem with tools designed for their 
              unique needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-blue-600" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {stat.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why EdVirons Wins */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why EdVirons Wins
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uniquely positioned to address Africa's educational challenges with innovative, practical 
              solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyEdVironsWins.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className={`${feature.bgColor} border-2 hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Education?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of schools across Africa already using EdVirons to power their educational journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
              Contact Us
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
                <li><Link href="/about" className="hover:text-white">About</Link></li>
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