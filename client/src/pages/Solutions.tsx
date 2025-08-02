import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import edvironsLogo from "@assets/edv-main-logo_1754150677721.png";
import { GraduationCap, Building2, Users2, BookOpen, BarChart3, Globe } from "lucide-react";

export default function Solutions() {
  const solutions = [
    {
      icon: <Building2 className="h-12 w-12" />,
      title: "For Schools & Institutions",
      description: "Complete digital transformation with integrated learning management, student information systems, and administrative tools.",
      features: [
        "Student Management System",
        "Digital Library & Resources",
        "Attendance & Timetabling",
        "Parent Communication Portal",
        "Academic Analytics Dashboard"
      ]
    },
    {
      icon: <GraduationCap className="h-12 w-12" />,
      title: "For Teachers & Educators",
      description: "Empower educators with tools for lesson planning, assessment, student tracking, and professional development.",
      features: [
        "Lesson Planning Tools",
        "Assessment & Grading",
        "Student Progress Tracking",
        "Resource Library Access",
        "Professional Development Hub"
      ]
    },
    {
      icon: <Users2 className="h-12 w-12" />,
      title: "For Students & Families",
      description: "Engaging learning experiences with parental oversight, progress monitoring, and educational resources.",
      features: [
        "Interactive Learning Platform",
        "Progress Reports & Analytics",
        "Family Communication Tools",
        "Digital Homework Platform",
        "Personalized Learning Paths"
      ]
    }
  ];

  const industries = [
    {
      title: "Primary Schools",
      description: "Foundation learning with CBC-aligned curriculum and interactive educational content."
    },
    {
      title: "Secondary Schools",
      description: "Advanced learning modules with exam preparation and career guidance tools."
    },
    {
      title: "Technical Institutes",
      description: "Specialized training programs with practical skills development and certification tracking."
    },
    {
      title: "Universities",
      description: "Higher education management with research tools and academic collaboration platforms."
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
            <h1 className="text-5xl font-bold text-white mb-6">Solutions for Every Educational Need</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              EdVirons provides tailored solutions for educational institutions, educators, students, and families across Africa.
            </p>
          </div>

          {/* Solutions Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-8 hover:bg-white/15 transition-colors">
                <div className="text-orange-500 mb-6">
                  {solution.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4">{solution.title}</h3>
                <p className="text-gray-300 mb-6">{solution.description}</p>
                <ul className="space-y-2">
                  {solution.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Industries Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Industries We Serve</h2>
              <p className="text-xl text-gray-300">
                From primary schools to universities, EdVirons adapts to your educational environment.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {industries.map((industry, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-3">{industry.title}</h3>
                  <p className="text-gray-300 text-sm">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Implementation Process */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Implementation Process</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-lg font-semibold text-white mb-2">Assessment</h3>
                <p className="text-gray-300 text-sm">We evaluate your current systems and educational needs.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-lg font-semibold text-white mb-2">Customization</h3>
                <p className="text-gray-300 text-sm">Platform configured to match your institutional requirements.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-lg font-semibold text-white mb-2">Training</h3>
                <p className="text-gray-300 text-sm">Comprehensive training for administrators, teachers, and staff.</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-lg font-semibold text-white mb-2">Launch</h3>
                <p className="text-gray-300 text-sm">Go-live with ongoing support and optimization.</p>
              </div>
            </div>
          </div>

          {/* ROI Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-20">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Return on Investment</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">40%</div>
                <h3 className="text-xl font-semibold text-white mb-2">Cost Reduction</h3>
                <p className="text-gray-300">Average reduction in administrative costs through automation.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">60%</div>
                <h3 className="text-xl font-semibold text-white mb-2">Time Savings</h3>
                <p className="text-gray-300">Reduction in time spent on manual administrative tasks.</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">85%</div>
                <h3 className="text-xl font-semibold text-white mb-2">User Satisfaction</h3>
                <p className="text-gray-300">Of users report improved educational outcomes.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-white mb-6">Ready to Transform Your Institution?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Schedule a personalized demo to see how EdVirons can benefit your educational environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg">
                  Schedule Demo
                </Button>
              </Link>
              <Link href="/features">
                <Button variant="outline" className="border-gray-400 text-gray-200 hover:bg-gray-700 px-8 py-3 text-lg">
                  View All Features
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}