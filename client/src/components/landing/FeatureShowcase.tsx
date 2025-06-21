import { ModuleCard } from "./ModuleCard";
import { 
  BookOpen, 
  FolderOpen,
  Calendar, 
  FileText,
  BarChart3,
  Users
} from "lucide-react";

interface FeatureShowcaseProps {
  activeTab: string;
}

export function FeatureShowcase({ activeTab }: FeatureShowcaseProps) {
  const modules = [
    {
      title: "Shared Library",
      description: "Access educational resources, documents, and learning materials",
      icon: BookOpen,
      color: "bg-blue-100",
      iconColor: "text-blue-600",
      badge: "Core",
      features: ["Resource Sharing", "Document Management"],
      moreCount: 1,
      href: "/library"
    },
    {
      title: "My Locker", 
      description: "Personal workspace for files, assignments, and notes",
      icon: FolderOpen,
      color: "bg-green-100",
      iconColor: "text-green-600", 
      badge: "Personal",
      features: ["File Storage", "Assignment Organization"],
      moreCount: 1,
      href: "/locker"
    },
    {
      title: "School Calendar",
      description: "View and manage school events, schedules, and important dates",
      icon: Calendar,
      color: "bg-purple-100",
      iconColor: "text-purple-600",
      badge: "Management", 
      features: ["Event Management", "Schedule Sync"],
      moreCount: 1,
      href: "/calendar"
    },
    {
      title: "Lesson Planning",
      description: "AI-powered lesson planning and curriculum management",
      icon: FileText,
      color: "bg-orange-100",
      iconColor: "text-orange-600",
      badge: "Teaching",
      features: ["CBC Curriculum", "AI Assistance"],
      moreCount: 2,
      href: "/teachers-dashboard"
    },
    {
      title: "Student Analytics",
      description: "Track progress, performance metrics, and learning outcomes",
      icon: BarChart3,
      color: "bg-indigo-100",
      iconColor: "text-indigo-600",
      badge: "Analytics",
      features: ["Progress Tracking", "Performance Reports"],
      moreCount: 1
    },
    {
      title: "Class Management",
      description: "Manage students, groups, and classroom activities",
      icon: Users,
      color: "bg-pink-100",
      iconColor: "text-pink-600",
      badge: "Management",
      features: ["Student Groups", "Activity Tracking"],
      moreCount: 1
    }
  ];

  const getTabDescription = (tab: string) => {
    switch (tab) {
      case "Educational Modules Dashboard":
        return "Comprehensive suite of educational tools designed for the modern classroom";
      case "Interactive Digital Library":
        return "Rich collection of digital resources aligned with Kenya's CBC curriculum";
      case "School Managers Tool":
        return "Administrative tools for efficient school management and operations";
      case "Teacher & Student Lockers":
        return "Personal storage spaces for assignments, projects, and resources";
      case "Academic Calendar & Planning":
        return "Integrated calendar system for academic planning and scheduling";
      default:
        return "Explore our comprehensive educational platform features";
    }
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {activeTab}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {getTabDescription(activeTab)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <ModuleCard
              key={index}
              {...module}
            />
          ))}
        </div>
      </div>
    </div>
  );
}