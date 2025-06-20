import { useState, useMemo } from "react";
import { 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  GraduationCap, 
  FileText,
  BarChart3,
  FlaskConical,
  Users,
  Presentation,
  ClipboardList,
  Video,
  Settings
} from "lucide-react";
import { DashboardHeader } from "../shared/DashboardHeader";
import { ModuleGrid } from "../shared/ModuleGrid";
import { Module } from "../shared/ModuleCard";
import { TechTutorCard } from "../shared/TechTutorCard";
import { NotificationsCard, NextEventCard, LibraryRecommendationsCard } from "../shared/StatusCards";
import { TeacherAssignmentStatusCard, TeacherClassOverviewCard, TeacherPerformanceCard } from "../shared/TeacherStatusCards";

interface TeacherDashboardProps {
  user?: any;
  stats?: any;
}

export function TeacherDashboard({ user, stats }: TeacherDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const techTutorModule = {
    id: "tech-tutor",
    title: "Tech Tutor",
    description: "Advanced teaching technology tools and digital classroom management",
    category: "Professional",
    isExternal: true
  };

  const modules: Module[] = [
    {
      id: "teaching-center",
      title: "Teaching Center",
      description: "Comprehensive classroom management and lesson delivery tools",
      icon: Presentation,
      color: "border-l-blue-500",
      category: "Core",
      features: ["Lesson Delivery", "Student Interaction", "Real-time Assessment"],
      moreCount: 8,
      tag: "Essential"
    },
    {
      id: "digital-library",
      title: "Educational Resources",
      description: "Access and manage teaching materials, textbooks, and multimedia content",
      icon: BookOpen,
      color: "border-l-green-500",
      category: "Core",
      features: ["Curriculum Materials", "Multimedia Library", "Resource Sharing"],
      moreCount: 12,
      tag: "Popular"
    },
    {
      id: "assignment-center",
      title: "Assignment Center",
      description: "Create, distribute, and grade assignments with automated workflows",
      icon: ClipboardList,
      color: "border-l-orange-500",
      category: "Assessment",
      features: ["Assignment Creation", "Auto-grading", "Progress Tracking"],
      moreCount: 6,
      tag: "Powerful"
    },
    {
      id: "student-analytics",
      title: "Student Analytics",
      description: "Monitor student progress and identify learning gaps with detailed insights",
      icon: BarChart3,
      color: "border-l-purple-500",
      category: "Analytics",
      features: ["Performance Metrics", "Learning Analytics", "Progress Reports"],
      moreCount: 9,
      tag: "Insights"
    },
    {
      id: "lesson-planning",
      title: "Lesson Planning",
      description: "AI-powered lesson planning with curriculum alignment and standards mapping",
      icon: GraduationCap,
      color: "border-l-cyan-500",
      category: "Planning",
      features: ["AI Lesson Generator", "Standards Alignment", "Resource Suggestions"],
      moreCount: 7,
      tag: "AI-Powered"
    },
    {
      id: "class-management",
      title: "Class Management",
      description: "Manage student rosters, attendance, and classroom organization",
      icon: Users,
      color: "border-l-indigo-500",
      category: "Management",
      features: ["Student Roster", "Attendance Tracking", "Behavior Management"],
      moreCount: 5,
      tag: "Essential"
    },
    {
      id: "virtual-classroom",
      title: "Virtual Classroom",
      description: "Conduct live online classes with interactive tools and engagement features",
      icon: Video,
      color: "border-l-red-500",
      category: "Teaching",
      features: ["Live Streaming", "Interactive Whiteboard", "Breakout Rooms"],
      moreCount: 10,
      tag: "Live"
    },
    {
      id: "stem-lab",
      title: "STEM Lab",
      description: "Virtual science lab with simulations and interactive experiments",
      icon: FlaskConical,
      color: "border-l-emerald-500",
      category: "Subject",
      features: ["Lab Simulations", "Experiment Designer", "Data Analysis"],
      moreCount: 15,
      tag: "Interactive"
    },
    {
      id: "school-calendar",
      title: "School Calendar",
      description: "Manage academic calendar, events, and important dates",
      icon: Calendar,
      color: "border-l-pink-500",
      category: "Planning",
      features: ["Event Management", "Academic Calendar", "Reminder System"],
      moreCount: 4,
      tag: "Organization"
    },
    {
      id: "teacher-workspace",
      title: "Teacher Workspace",
      description: "Personal workspace for files, notes, and teaching materials",
      icon: FolderOpen,
      color: "border-l-yellow-500",
      category: "Personal",
      features: ["File Management", "Personal Notes", "Material Organization"],
      moreCount: 3,
      tag: "Personal"
    },
    {
      id: "digital-notebooks",
      title: "Digital Notebooks",
      description: "Create and share interactive digital notebooks with students",
      icon: FileText,
      color: "border-l-teal-500",
      category: "Teaching",
      features: ["Interactive Content", "Student Collaboration", "Rich Media"],
      moreCount: 6,
      tag: "Collaborative"
    },
    {
      id: "teacher-settings",
      title: "Teaching Preferences",
      description: "Customize your teaching environment and notification preferences",
      icon: Settings,
      color: "border-l-gray-500",
      category: "Settings",
      features: ["Profile Settings", "Notification Preferences", "Classroom Setup"],
      moreCount: 4,
      tag: "Customize"
    }
  ];

  const categories = ["All Modules", "Core", "Teaching", "Assessment", "Analytics", "Planning", "Management", "Subject", "Personal", "Settings"];

  const filteredModules = useMemo(() => {
    const allModules = [techTutorModule, ...modules];
    return allModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Modules" || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, modules]);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="Teacher Dashboard"
          subtitle="Empower your teaching with comprehensive classroom management tools"
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

        {/* Status Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <TeacherAssignmentStatusCard />
          <TeacherClassOverviewCard />
          <NotificationsCard />
          <TeacherPerformanceCard />
        </div>

        <div className="mb-4 sm:mb-6">
          <TechTutorCard 
            variant="teacher"
            viewMode={viewMode}
            onClick={() => {
              console.log("Opening Tech Tutor external app with SSO...");
              // Future: Implement SSO redirect to Tech Tutor
            }}
          />
        </div>

        <ModuleGrid 
          modules={filteredModules.filter(m => m.id !== "tech-tutor")}
          viewMode={viewMode}
          variant="teacher"
          onModuleClick={(moduleId) => {
            console.log(`Opening module: ${moduleId}`);
          }}
        />

        {filteredModules.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 mx-auto" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}