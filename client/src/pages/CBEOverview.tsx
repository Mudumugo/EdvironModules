import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  BarChart3, 
  Wifi,
  GraduationCap,
  School,
  Building2,
  Check,
  Users,
  Shield,
  Rocket,
  FileText,
  Clock,
  TrendingUp,
  Settings,
  Database,
  Award,
  Target,
  Zap,
  Quote
} from "lucide-react";

const keyFeatures = [
  {
    icon: BookOpen,
    title: "Curriculum-Aligned",
    subtitle: "All resources pre-mapped to CBE strands & sub-strands.",
    description: "Our AI automatically tags content to your grade's competencies.",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    subtitle: "Track individual and class competency mastery",
    description: "Identify learning gaps before exams with our dashboard.",
    highlight: "Data-Driven Teaching",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Wifi,
    title: "Africa-Ready",
    subtitle: "Works offline and on low-bandwidth connections",
    description: "Full functionality via LAN or mobile data",
    highlight: "No Internet? No Problem",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50"
  }
];

const cbeStructure = [
  {
    level: "Early Years",
    grades: "Grade 1-3",
    icon: GraduationCap,
    features: [
      "Foundational skill builders",
      "Interactive literacy games", 
      "Parent engagement tools"
    ],
    tools: "Digital portfolios • Phonics apps • Teacher observation tools",
    iconColor: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200"
  },
  {
    level: "Middle School", 
    grades: "Grade 4-9",
    icon: School,
    features: [
      "Subject-specific modules",
      "Project-based learning kits",
      "Automated assessments"
    ],
    tools: "Competency trackers • Virtual labs • Peer review systems",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-50", 
    borderColor: "border-blue-200"
  },
  {
    level: "Senior School",
    grades: "Grade 10-12", 
    icon: Building2,
    features: [
      "Pathway-specific resources",
      "Career readiness programs",
      "University prep materials"
    ],
    tools: "Pathway advisor • Digital transcripts • Industry partnerships",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  }
];

const teacherBenefits = [
  {
    number: "1",
    title: "AI lesson planner saves 8+ hours weekly",
    color: "bg-blue-600"
  },
  {
    number: "2", 
    title: "Auto-generated CBE reports for parents",
    color: "bg-blue-600"
  },
  {
    number: "3",
    title: "15,000+ pre-approved digital resources",
    color: "bg-blue-600"
  }
];

const adminBenefits = [
  {
    number: "1",
    title: "Real-time compliance monitoring", 
    color: "bg-blue-600"
  },
  {
    number: "2",
    title: "Integrated fee and LMS systems",
    color: "bg-blue-600"
  },
  {
    number: "3",
    title: "Government reporting automation",
    color: "bg-blue-600"
  }
];

export function CBEOverview() {
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
                  <span className="text-blue-600 px-3 py-2 text-sm font-medium cursor-pointer border-b-2 border-blue-600">CBE Overview</span>
                </Link>
                <a href="#about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">About</a>
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

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-lg flex items-center justify-center mx-auto mb-6`}>
                    <IconComponent className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {feature.subtitle}
                  </p>
                  {feature.highlight && (
                    <div className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-3">
                      {feature.highlight}
                    </div>
                  )}
                  <p className="text-sm text-gray-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CBE Structure Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                CBE Structure Simplified with EdVirons
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {cbeStructure.map((level, index) => {
              const IconComponent = level.icon;
              return (
                <Card key={index} className={`${level.bgColor} ${level.borderColor} border-2`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <IconComponent className={`h-6 w-6 ${level.iconColor} mr-3`} />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {level.level}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {level.grades}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-6">
                      {level.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <Check className={`h-4 w-4 mr-2 ${level.iconColor}`} />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">
                        EdVirons Tools:
                      </p>
                      <p className="text-sm text-gray-600">
                        {level.tools}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Schools Choose Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Rocket className="h-8 w-8 text-pink-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Why Schools Choose EdVirons for CBE
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* For Teachers */}
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Users className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    For Teachers
                  </h3>
                </div>

                <ul className="space-y-4">
                  {teacherBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`w-8 h-8 ${benefit.color} rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1`}>
                        {benefit.number}
                      </div>
                      <p className="text-gray-700 text-lg">
                        {benefit.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* For Administrators */}
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <Shield className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-900">
                    For Administrators
                  </h3>
                </div>

                <ul className="space-y-4">
                  {adminBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`w-8 h-8 ${benefit.color} rounded-full flex items-center justify-center text-white font-bold text-sm mr-4 mt-1`}>
                        {benefit.number}
                      </div>
                      <p className="text-gray-700 text-lg">
                        {benefit.title}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-blue-50 border-l-4 border-blue-600">
            <CardContent className="p-8">
              <Quote className="h-8 w-8 text-blue-600 mb-4" />
              <blockquote className="text-lg text-gray-700 italic mb-6">
                "EdVirons reduced our CBE planning time by 70% while improving learner outcomes. Our 
                teachers now focus on teaching, not paperwork."
              </blockquote>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  — St. Anne's Academy, Nairobi
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="h-8 w-8 text-yellow-300 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Your School's CBE Transformation
            </h2>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Complete onboarding in 48 hours • Priority pilot program support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Demo
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-blue-600">
              Schedule Demo
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
                <li><a href="#about" className="hover:text-white">About</a></li>
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