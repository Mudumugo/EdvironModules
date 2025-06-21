import { Card, CardContent } from "@/components/ui/card";
import { 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  FileText, 
  BarChart3, 
  Users,
  ChevronRight 
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Digital Library",
    description: "Access thousands of educational resources aligned with CBC curriculum",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: FolderOpen,
    title: "My Locker",
    description: "Personal workspace for assignments, projects, and notes",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Calendar,
    title: "School Calendar",
    description: "Stay organized with events, deadlines, and schedules",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: FileText,
    title: "Lesson Planning",
    description: "AI-powered tools for creating engaging lesson plans",
    color: "bg-orange-100 text-orange-600"
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description: "Monitor student performance and learning outcomes",
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Connect teachers, students, and parents seamlessly",
    color: "bg-pink-100 text-pink-600"
  }
];

export function MobileFeatures() {
  return (
    <div className="px-6 py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Everything You Need
        </h2>
        <p className="text-gray-600">
          Powerful tools designed for modern education
        </p>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}