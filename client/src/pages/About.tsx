import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import edvironsLogo from "@assets/edv-main-logo_1754150677721.png";

export default function About() {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-8">About EdVirons</h1>
          
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-xl text-gray-300 mb-8">
              EdVirons is a comprehensive, multi-tenant educational technology platform designed to serve multiple school tenants with centralized management for educational applications, digital libraries, school management tools, and various learning modules.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300">
                  To revolutionize education in Africa by providing comprehensive digital solutions that enhance learning experiences and streamline educational administration for schools across the continent.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Our Vision</h2>
                <p className="text-gray-300">
                  To become the leading educational technology platform in Africa, empowering institutions with innovative tools that foster excellence in teaching and learning.
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="text-3xl font-semibold text-white mb-6">What We Offer</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Multi-Tenant Platform</h3>
                  <p className="text-gray-300">
                    Robust tenant isolation with dedicated databases and networks for each school, accessed via subdomain-based URLs.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Educational Modules</h3>
                  <p className="text-gray-300">
                    Comprehensive school management, digital library with CBC-aligned resources, Tutor Hub, and analytics.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">Content Management</h3>
                  <p className="text-gray-300">
                    Tools for content creation, library resource categorization, media management, and personal Locker System.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-semibold text-white mb-6">Technology Stack</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Frontend</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• React + TypeScript with Vite</li>
                    <li>• Tailwind CSS with shadcn/ui components</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Backend</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Express.js with TypeScript</li>
                    <li>• PostgreSQL with Drizzle ORM</li>
                    <li>• WebSocket support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}