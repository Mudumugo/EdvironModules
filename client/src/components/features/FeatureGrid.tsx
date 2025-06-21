import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  Users,
  Video,
  Shield,
  Smartphone,
  Cloud,
  Zap,
  Heart
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Digital Library",
    description: "Access thousands of educational resources, e-books, and interactive content aligned with CBC curriculum.",
    category: "Content",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: FolderOpen,
    title: "Personal Lockers",
    description: "Secure cloud storage for students and teachers to organize assignments, projects, and personal files.",
    category: "Storage",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Calendar,
    title: "Smart Calendar",
    description: "Integrated scheduling system with automatic reminders, event management, and academic planning.",
    category: "Planning",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: FileText,
    title: "AI Lesson Planning",
    description: "Create engaging lesson plans with AI assistance, curriculum mapping, and assessment tools.",
    category: "Teaching",
    color: "bg-orange-100 text-orange-600"
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Real-time insights into student performance, engagement metrics, and learning outcomes.",
    category: "Analytics",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Users,
    title: "Collaboration Tools",
    description: "Foster teamwork with group projects, peer reviews, and collaborative learning spaces.",
    category: "Social",
    color: "bg-pink-100 text-pink-600"
  },
  {
    icon: Video,
    title: "Live Sessions",
    description: "Interactive virtual classrooms with video conferencing, screen sharing, and real-time collaboration.",
    category: "Communication",
    color: "bg-red-100 text-red-600"
  },
  {
    icon: Shield,
    title: "Advanced Security",
    description: "Enterprise-grade security with role-based access, data encryption, and privacy protection.",
    category: "Security",
    color: "bg-gray-100 text-gray-600"
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Fully responsive design works seamlessly across all devices - phones, tablets, and desktops.",
    category: "Technology",
    color: "bg-cyan-100 text-cyan-600"
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Reliable cloud hosting with 99.9% uptime, automatic backups, and scalable performance.",
    category: "Infrastructure",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance delivers instant loading times and smooth user experience.",
    category: "Performance",
    color: "bg-yellow-100 text-yellow-600"
  },
  {
    icon: Heart,
    title: "Student Wellbeing",
    description: "Mental health resources, counseling tools, and wellness tracking for holistic student care.",
    category: "Wellness",
    color: "bg-rose-100 text-rose-600"
  }
];

export function FeatureGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From classroom management to student analytics, EdVirons provides comprehensive tools to enhance every aspect of the educational experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${feature.color} transition-transform duration-200 group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
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
  );
}