import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingNav } from "@/components/MarketingNav";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/Logo";
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
    title: "Cloud Platform",
    description: "Secure online repository for institutional data and teaching design.",
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    icon: Eye,
    title: "Sync Technology",
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

const whyPlatformWins = [
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
    description: "Flexible pricing model designed for educational institutions.",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNav />

      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Logo size="xl" className="mx-auto" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Our Platform
          </h1>
          
          <p className="text-xl text-gray-600 mb-4">
            Powering Education Beyond Connectivity Barriers
          </p>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            An innovative offline-first educational ecosystem, equipping schools with smart, scalable tools to 
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
            Driven by a clear vision and unwavering mission to transform education through 
            innovative technology solutions.
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

      {/* Platform Advantage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Platform Advantage
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive ecosystem of interconnected tools designed for the modern 
              classroom environment.
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

      {/* Why We Win */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Our Platform Wins
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uniquely positioned to address educational challenges with innovative, practical 
              solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyPlatformWins.map((feature, index) => {
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
            Join thousands of schools across Africa already using our platform to power their educational journey.
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

      <Footer />
    </div>
  );
}