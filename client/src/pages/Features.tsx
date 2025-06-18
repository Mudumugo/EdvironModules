import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  BarChart3,
  BookOpen,
  GraduationCap,
  School,
  Check,
  ChevronRight,
  Award,
  Target,
  Zap,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Settings,
  Star
} from "lucide-react";

const navigationTabs = [
  { id: "all", label: "All in One", active: true },
  { id: "offline", label: "Offline First", active: false },
  { id: "ai", label: "AI-Powered", active: false },
  { id: "mobile", label: "Mobile", active: false },
  { id: "cloud", label: "Cloud Ready", active: false }
];

const roleFilters = [
  { id: "students", label: "Students", active: true },
  { id: "teachers", label: "Teachers", active: false },
  { id: "administrators", label: "Administrators", active: false },
  { id: "parents", label: "Parents", active: false },
  { id: "school-boards", label: "School Boards", active: false }
];

const teacherFeatures = [
  {
    title: "AI-Based Lesson Plans",
    description: "Built specifically for teachers who use curriculum",
    completed: true
  },
  {
    title: "Auto-Graded Quizzes",
    description: "Generate different questions for each student automatically",
    completed: true
  },
  {
    title: "Shared Reference Tools",
    description: "Reference tools that all teachers can share easily",
    completed: true
  },
  {
    title: "Class Analytics",
    description: "Monitor your class's engagement, with real-time insights",
    completed: false
  }
];

const teacherMetrics = [
  {
    title: "Teacher Efficiency Metrics",
    items: [
      { label: "Content Planning Time", value: "40%", desc: "Reduced lesson planning time by 40%" },
      { label: "Assignment Grading Time", value: "60%", desc: "Faster grading with automated tools" },
      { label: "Administrative Time", value: "25%", desc: "Less time on administrative tasks to focus on teaching" }
    ]
  }
];

const pilotRewards = [
  {
    icon: Users,
    title: "For Educators",
    benefits: [
      "Free curriculum modules from leading local publishers",
      "Priority access to new features & training sessions"
    ]
  },
  {
    icon: School,
    title: "For Schools",
    benefits: [
      "Digital devices and capacity to run content & curriculum offline",
      "Performance tracking & fitness solutions"
    ]
  },
  {
    icon: Award,
    title: "For Top Contributors",
    benefits: [
      "Permanent licensing & training course access",
      "Recognition through national & regional opportunities"
    ]
  }
];

const joinSteps = [
  {
    id: 1,
    title: "Schools",
    description: "Have a representative speak with our education specialists to see how EdVirons can transform your school.",
    action: "Book a Demo",
    color: "bg-blue-50 border-blue-200",
    buttonColor: "bg-blue-600"
  },
  {
    id: 2,
    title: "Teachers & Tutors",
    description: "Join our educator community to help shape the future of your program. Selected participants receive comprehensive training & ongoing support.",
    action: "Learn More",
    color: "bg-green-50 border-green-200",
    buttonColor: "bg-green-600"
  },
  {
    id: 3,
    title: "Students",
    description: "Limited school administrations to join the EdVirons pilot program. For students for platform features.",
    action: "Learn about Student Access",
    color: "bg-purple-50 border-purple-200",
    buttonColor: "bg-purple-600"
  }
];

export function Features() {
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
                <Link href="/features">
                  <span className="text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer border-b-2 border-blue-600">Features</span>
                </Link>
                <Link href="/solutions">
                  <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">Solutions</span>
                </Link>
                <Link href="/cbe-overview">
                  <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">CBE Overview</span>
                </Link>
                <Link href="/about">
                  <span className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer">About</span>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="text-blue-600">EdVirons</span> Features
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your school's all-in-one digital learning ecosystem designed for the modern classroom.
          </p>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {navigationTabs.map((tab, index) => (
              <Badge 
                key={tab.id} 
                variant={tab.active ? "default" : "secondary"}
                className={`px-4 py-2 text-sm ${tab.active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {tab.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Pilot Program Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">
                  Join Our Pilot Program
                </h2>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <p className="text-gray-700">
                    For 5 schools working with dedicated expert support
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <p className="text-gray-700">
                    Early adopter pricing with complete curriculum data and content features
                  </p>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <p className="text-gray-700">
                    Scheduled onboarding by our support team until June 30th, 2025
                  </p>
                </div>
              </div>
              
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Apply for Pilot Program
              </Button>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pilot Program Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">Applications</p>
                    <p className="text-sm text-gray-600">Open through March 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">School & Training</p>
                    <p className="text-sm text-gray-600">April-May 2025</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-4"></div>
                  <div>
                    <p className="font-semibold">Active Implementation</p>
                    <p className="text-sm text-gray-600">June 2025 onwards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-Based Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Every Role in Education
            </h2>
            <p className="text-xl text-gray-600">
              Discover how EdVirons adapts to your specific needs.
            </p>
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {roleFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={filter.active ? "default" : "outline"}
                className={filter.active ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Teacher Features (Active) */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Tools designed to save time and enhance teaching effectiveness.
              </h3>
              
              <div className="space-y-4">
                {teacherFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start p-4 bg-white rounded-lg border">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-0.5 ${
                      feature.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {feature.completed ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-lg border">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Teacher Efficiency Metrics
              </h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Content Planning Time</span>
                    <span className="text-sm font-bold text-green-600">40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Reduced lesson planning time by 40%</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Assignment Grading Time</span>
                    <span className="text-sm font-bold text-blue-600">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Faster grading with automated tools</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Administrative Time</span>
                    <span className="text-sm font-bold text-purple-600">25%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Less time on administrative tasks to focus on teaching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pilot Program Rewards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pilot Program Rewards & Recognition
            </h2>
            <p className="text-xl text-gray-600">
              Beyond free access, our pilot partners receive exclusive benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pilotRewards.map((reward, index) => {
              const IconComponent = reward.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {reward.title}
                    </h3>
                    
                    <ul className="space-y-3 text-left">
                      {reward.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start">
                          <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">
                            {benefit}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How to Join the Pilot Program
            </h2>
          </div>

          <div className="space-y-8">
            {joinSteps.map((step, index) => (
              <Card key={step.id} className={`${step.color} border-2`}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className={`w-8 h-8 ${step.buttonColor} text-white rounded-full flex items-center justify-center font-bold mr-4`}>
                          {step.id}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-700 text-lg mb-6 max-w-3xl">
                        {step.description}
                      </p>
                    </div>
                    <Button className={`${step.buttonColor} hover:opacity-90 ml-8`}>
                      {step.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              Limited to first 50 institutions
            </p>
            <p className="text-gray-600">
              Applications close June 30, 2025
            </p>
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
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
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