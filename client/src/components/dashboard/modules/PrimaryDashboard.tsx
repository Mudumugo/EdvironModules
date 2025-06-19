import { 
  BookOpen, 
  FolderOpen, 
  Gamepad2, 
  Heart, 
  Star,
  Calendar,
  Users
} from "lucide-react";
import { DashboardHeader } from "../shared/DashboardHeader";
import { ModuleGrid } from "../shared/ModuleGrid";
import { Module } from "../shared/ModuleCard";
import { TechTutorCard } from "../shared/TechTutorCard";

interface PrimaryDashboardProps {
  user?: any;
}

export function PrimaryDashboard({ user }: PrimaryDashboardProps) {
  const modules: Module[] = [
    {
      id: "story-library",
      title: "Story Library",
      description: "Fun books, videos, and interactive stories just for you!",
      icon: BookOpen,
      color: "border-l-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      id: "my-backpack",
      title: "My Backpack", 
      description: "Keep all your favorite lessons and drawings safe here",
      icon: FolderOpen,
      color: "border-l-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      id: "fun-games",
      title: "Fun Games",
      description: "Play educational games and puzzles that help you learn",
      icon: Gamepad2,
      color: "border-l-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      id: "daily-goals",
      title: "Daily Goals",
      description: "Complete fun challenges and earn stars every day",
      icon: Star,
      color: "border-l-yellow-500",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600"
    },
    {
      id: "my-calendar",
      title: "My Calendar",
      description: "See your schedule and upcoming fun activities",
      icon: Calendar,
      color: "border-l-indigo-500",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      id: "kindness-corner",
      title: "Kindness Corner",
      description: "Learn about being kind and helping others",
      icon: Heart,
      color: "border-l-red-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      id: "friends",
      title: "My Friends",
      description: "Learn and play together with your classmates",
      icon: Users,
      color: "border-l-cyan-500",
      bgColor: "bg-cyan-50",
      iconColor: "text-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="My Learning Adventure"
          subtitle="Explore fun activities and learn new things!"
          user={user}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <TechTutorCard 
            variant="primary"
            onClick={() => {
              console.log("Opening Tech Tutor external app with SSO...");
              // Future: Implement SSO redirect to Tech Tutor
            }}
          />
        </div>
        
        <ModuleGrid 
          modules={modules}
          onModuleClick={(moduleId) => {
            console.log(`Opening module: ${moduleId}`);
          }}
        />
      </div>
    </div>
  );
}