import { useState, useMemo } from "react";
import { 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  FileText, 
  FlaskConical,
  Gamepad2,
  Users,
  BarChart3
} from "lucide-react";
import { DashboardHeader } from "../shared/DashboardHeader";
import { ModuleGrid } from "../shared/ModuleGrid";
import { Module } from "../shared/ModuleCard";

interface JuniorDashboardProps {
  user?: any;
  stats?: any;
}

export function JuniorDashboard({ user, stats }: JuniorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const modules: Module[] = [
    {
      id: "digital-library",
      title: "Digital Library",
      description: "Access thousands of books, research materials, and educational content",
      icon: BookOpen,
      color: "border-l-blue-500",
      category: "Learning",
      features: ["E-books", "Audio Books", "Research Papers"],
      moreCount: 5,
      tag: "Popular"
    },
    {
      id: "my-portfolio",
      title: "My Portfolio",
      description: "Showcase your best work and track your learning progress",
      icon: FolderOpen,
      color: "border-l-green-500",
      category: "Personal",
      features: ["Projects", "Achievements", "Certificates"],
      moreCount: 3,
      tag: "New"
    },
    {
      id: "class-schedule",
      title: "Class Schedule",
      description: "View your timetable, assignments, and upcoming events",
      icon: Calendar,
      color: "border-l-purple-500",
      category: "Academic",
      features: ["Timetable", "Assignments", "Events"],
      moreCount: 2,
      tag: "Essential"
    },
    {
      id: "assignments",
      title: "Assignments",
      description: "Complete and submit your homework and projects",
      icon: FileText,
      color: "border-l-orange-500",
      category: "Academic",
      features: ["Homework", "Projects", "Submissions"],
      moreCount: 4,
      tag: "Due Soon"
    },
    {
      id: "science-lab",
      title: "Science Lab",
      description: "Conduct virtual experiments and explore scientific concepts",
      icon: FlaskConical,
      color: "border-l-cyan-500",
      category: "Learning",
      features: ["Virtual Labs", "Experiments", "Simulations"],
      moreCount: 6,
      tag: "Interactive"
    },
    {
      id: "study-groups",
      title: "Study Groups",
      description: "Collaborate with classmates on projects and study sessions",
      icon: Users,
      color: "border-l-pink-500",
      category: "Social",
      features: ["Group Chat", "Video Calls", "Shared Notes"],
      moreCount: 2,
      tag: "Collaborative"
    },
    {
      id: "progress-tracker",
      title: "Progress Tracker",
      description: "Monitor your academic performance and set learning goals",
      icon: BarChart3,
      color: "border-l-indigo-500",
      category: "Analytics",
      features: ["Grade Reports", "Goal Setting", "Performance Insights"],
      moreCount: 3,
      tag: "Insights"
    },
    {
      id: "educational-games",
      title: "Educational Games",
      description: "Learn through fun, interactive games and challenges",
      icon: Gamepad2,
      color: "border-l-yellow-500",
      category: "Learning",
      features: ["Math Games", "Language Puzzles", "Science Quizzes"],
      moreCount: 8,
      tag: "Fun"
    }
  ];

  const categories = ["All Modules", "Learning", "Academic", "Personal", "Social", "Analytics"];

  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Modules" || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="Junior Student Dashboard"
          subtitle="Explore your subjects and enhance your learning journey"
          user={user}
          showSearch={true}
          showFilters={true}
          showPlanInfo={true}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <ModuleGrid 
          modules={filteredModules}
          viewMode={viewMode}
          onModuleClick={(moduleId) => {
            console.log(`Opening module: ${moduleId}`);
          }}
        />
      </div>
    </div>
  );
}