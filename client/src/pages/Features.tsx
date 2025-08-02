import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import edvironsLogo from "@assets/edv-main-logo_1754150677721.png";
import { BookOpen, Users, BarChart3, Shield, Globe, Zap } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Digital Library",
      description: "CBC-aligned educational resources with comprehensive categorization and search capabilities."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "School Management",
      description: "Complete student records, attendance tracking, timetables, and administrative tools."
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics & Insights",
      description: "Comprehensive learning analytics and reporting for data-driven educational decisions."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Multi-Tenant Security",
      description: "Robust tenant isolation with dedicated databases and secure access controls."
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Apps Hub",
      description: "Global app catalog with school-specific customization and branding options."
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Real-time Features",
      description: "Live sessions, instant messaging, and real-time collaboration tools."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <nav className="relative z-50 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <img src={edvironsLogo} alt="EdVirons" className="h-12 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">Platform Features</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover the comprehensive suite of tools and features that make EdVirons the leading educational technology platform in Africa.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
                <div className="text-orange-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Detailed Features */}
          <div className="space-y-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-semibold text-white mb-6">Educational Modules</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Tutor Hub</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Interactive learning sessions</li>
                    <li>• Personalized tutoring support</li>
                    <li>• Progress tracking and assessment</li>
                    <li>• Virtual classroom environments</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Family Controls</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Parent dashboard and monitoring</li>
                    <li>• Student progress reports</li>
                    <li>• Communication tools</li>
                    <li>• Access controls and permissions</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-semibold text-white mb-6">Content Management</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Library Resources</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• CBC curriculum alignment</li>
                    <li>• Advanced categorization system</li>
                    <li>• Multi-format content support</li>
                    <li>• Search and discovery tools</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Personal Locker</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Personal file storage</li>
                    <li>• Media management tools</li>
                    <li>• Sharing and collaboration</li>
                    <li>• Version control and backup</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-semibold text-white mb-6">Platform Architecture</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Multi-Tenant Design</h3>
                  <p className="text-gray-300">
                    Each school operates on isolated infrastructure with dedicated databases and networks, ensuring complete data separation and security.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Scalable Infrastructure</h3>
                  <p className="text-gray-300">
                    Infrastructure provisioned and scaled automatically using Infrastructure as Code, supporting growth from single classrooms to entire districts.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Role-Based Access</h3>
                  <p className="text-gray-300">
                    Granular permission system with both global EdVirons roles and tenant-specific roles for precise access control.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-semibold text-white mb-6">Ready to Transform Your School?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join the leading African learning institutions already using EdVirons.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  Get Started for Institutions
                </Button>
              </Link>
              <Link href="/cbe-overview">
                <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700 px-8 py-3 text-lg">
                  View CBC Overview
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}