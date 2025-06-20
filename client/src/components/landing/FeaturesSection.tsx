import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Shield,
  Smartphone,
  Globe,
  Zap
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Digital Library",
    description: "Vast collection of digital textbooks, interactive worksheets, and multimedia content aligned with curriculum standards.",
    benefits: ["10,000+ Resources", "Offline Access", "Progress Tracking"],
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Users,
    title: "Classroom Management",
    description: "Comprehensive tools for teachers to manage classes, track student progress, and facilitate collaborative learning.",
    benefits: ["Real-time Monitoring", "Assignment Management", "Grade Analytics"],
    color: "bg-green-50 text-green-600"
  },
  {
    icon: MessageSquare,
    title: "Communication Hub",
    description: "Seamless communication between teachers, students, and parents through integrated messaging and announcements.",
    benefits: ["Multi-channel Messaging", "Translation Support", "Automated Notifications"],
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Intelligent calendar system that manages school events, class schedules, and important deadlines.",
    benefits: ["Automated Scheduling", "Conflict Detection", "Mobile Sync"],
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Powerful analytics tools that provide actionable insights into student performance and engagement.",
    benefits: ["Performance Dashboards", "Predictive Analytics", "Custom Reports"],
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Enterprise-grade security with comprehensive privacy controls and compliance with educational standards.",
    benefits: ["FERPA Compliant", "Data Encryption", "Access Controls"],
    color: "bg-red-50 text-red-600"
  }
];

const additionalFeatures = [
  { icon: Smartphone, label: "Mobile Apps" },
  { icon: Globe, label: "Multi-language" },
  { icon: Zap, label: "Real-time Sync" }
];

export function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">
            Everything You Need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Comprehensive Educational Platform
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform brings together all the tools and resources schools need to create 
            engaging, effective, and efficient educational experiences.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.benefits.map((benefit) => (
                        <Badge key={benefit} variant="secondary" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        
        {/* Additional Features */}
        <div className="mt-16 border-t border-gray-200 pt-16">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-8">
              Plus many more features to enhance your educational experience
            </h3>
            <div className="flex justify-center items-center gap-8">
              {additionalFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.label} className="flex items-center gap-2 text-gray-600">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{feature.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}