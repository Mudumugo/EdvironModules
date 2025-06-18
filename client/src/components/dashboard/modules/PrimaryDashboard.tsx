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

export function PrimaryDashboard({ user }: { user?: any }) {
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
    description: "Play exciting games while learning new things",
    icon: Gamepad2,
    color: "border-l-purple-500",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600"
  },
  {
    id: "my-progress",
    title: "My Progress",
    description: "See all the amazing things you've learned!",
    icon: Heart,
    color: "border-l-pink-500",
    bgColor: "bg-pink-50",
    iconColor: "text-pink-600"
  },
  {
    id: "my-calendar",
    title: "My Calendar",
    description: "See what fun activities are coming up",
    icon: Calendar,
    color: "border-l-orange-500",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600"
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

interface PrimaryDashboardProps {
  user: any;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="My Learning Adventure"
          subtitle="Explore fun activities and learn new things!"
          user={user}
        />

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