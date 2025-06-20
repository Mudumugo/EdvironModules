import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";
import { DashboardHeader } from "@/components/dashboard/shared/DashboardHeader";
import { ModuleGrid } from "@/components/dashboard/shared/ModuleGrid";
import { Module } from "@/components/dashboard/shared/ModuleCard";
import { TechTutorCard } from "@/components/dashboard/shared/TechTutorCard";
import { 
  TeacherAssignmentStatusCard, 
  TeacherClassOverviewCard, 
  TeacherPerformanceCard 
} from "@/components/dashboard/shared/TeacherStatusCards";
import { NotificationsCard } from "@/components/dashboard/shared/StatusCards";
import { 
  BookOpen, 
  FolderOpen, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings, 
  GraduationCap, 
  FileText, 
  ClipboardList, 
  Presentation, 
  Video, 
  Globe, 
  Monitor, 
  MessageSquare,
  UserCheck,
  FlaskConical,
  PenTool,
  Camera,
  Headphones
} from "lucide-react";

export default function TeachersDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "All Modules", 
    "Teaching Tools", 
    "Assessment", 
    "Communication", 
    "Content Creation", 
    "Analytics", 
    "Administration"
  ];

  const modules: Module[] = [
    {
      id: "lesson-planning",
      title: "Lesson Planning",
      description: "Create comprehensive lesson plans with CBC curriculum alignment and interactive elements",
      icon: Presentation,
      color: "border-l-blue-500",
      category: "Teaching Tools",
      features: ["CBC Alignment", "Interactive Elements", "Resource Integration"],
      tag: "Popular"
    },
    {
      id: "digital-library",
      title: "Digital Library",
      description: "Access thousands of educational resources, books, and multimedia content for your classes",
      icon: BookOpen,
      color: "border-l-green-500",
      category: "Teaching Tools",
      features: ["Curated Content", "Grade-Level Filtering", "Offline Access"]
    },
    {
      id: "assignment-center",
      title: "Assignment Center",
      description: "Create, distribute, and grade assignments with automated feedback and plagiarism detection",
      icon: ClipboardList,
      color: "border-l-purple-500",
      category: "Assessment",
      features: ["Auto-Grading", "Plagiarism Check", "Rubric Builder"],
      tag: "Enhanced"
    },
    {
      id: "class-management",
      title: "Class Management",
      description: "Manage student attendance, behavior tracking, and classroom organization efficiently",
      icon: Users,
      color: "border-l-indigo-500",
      category: "Administration",
      features: ["Attendance Tracking", "Behavior Management", "Seating Charts"]
    },
    {
      id: "analytics-insights",
      title: "Analytics & Insights",
      description: "Comprehensive student performance analytics and learning progress tracking",
      icon: BarChart3,
      color: "border-l-cyan-500",
      category: "Analytics",
      features: ["Performance Metrics", "Progress Tracking", "Custom Reports"],
      tag: "Pro"
    },
    {
      id: "parent-communication",
      title: "Parent Communication",
      description: "Streamlined communication tools for parent-teacher collaboration and updates",
      icon: MessageSquare,
      color: "border-l-orange-500",
      category: "Communication",
      features: ["Automated Updates", "Meeting Scheduling", "Progress Reports"]
    },
    {
      id: "assessment-tools",
      title: "Assessment Tools",
      description: "Create quizzes, tests, and interactive assessments with instant feedback",
      icon: FileText,
      color: "border-l-red-500",
      category: "Assessment",
      features: ["Question Bank", "Instant Feedback", "Adaptive Testing"]
    },
    {
      id: "content-creator",
      title: "Content Creator",
      description: "Build interactive lessons, presentations, and multimedia content for engaging teaching",
      icon: PenTool,
      color: "border-l-pink-500",
      category: "Content Creation",
      features: ["Interactive Media", "Template Library", "Collaboration Tools"]
    },
    {
      id: "virtual-classroom",
      title: "Virtual Classroom",
      description: "Host live virtual classes with interactive whiteboards and breakout rooms",
      icon: Monitor,
      color: "border-l-teal-500",
      category: "Teaching Tools",
      features: ["Live Streaming", "Interactive Whiteboard", "Breakout Rooms"],
      tag: "Live"
    },
    {
      id: "student-portfolios",
      title: "Student Portfolios",
      description: "Track and showcase student work progress throughout the academic year",
      icon: FolderOpen,
      color: "border-l-violet-500",
      category: "Assessment",
      features: ["Progress Tracking", "Work Samples", "Reflection Tools"]
    },
    {
      id: "professional-development",
      title: "Professional Development",
      description: "Access training courses, workshops, and certification programs for teachers",
      icon: GraduationCap,
      color: "border-l-emerald-500",
      category: "Administration",
      features: ["Training Modules", "Certification Tracking", "Peer Learning"]
    },
    {
      id: "calendar-scheduling",
      title: "Calendar & Scheduling",
      description: "Manage your teaching schedule, meetings, and important academic dates",
      icon: Calendar,
      color: "border-l-amber-500",
      category: "Administration",
      features: ["Smart Scheduling", "Meeting Reminders", "Academic Calendar"]
    }
  ];

  const filteredModules = useMemo(() => {
    return modules.filter((module) => {
      const matchesSearch = searchTerm === "" || 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.features?.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === "All Modules" || module.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, modules]);

  return (
    <CollapsibleDashboardLayout 
      title="Teachers Dashboard"
      subtitle="Comprehensive teaching tools and classroom management"
    >
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title=""
          subtitle=""
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <TeacherAssignmentStatusCard />
          <TeacherClassOverviewCard />
          <NotificationsCard />
          <TeacherPerformanceCard />
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <ClipboardList className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-center">Create Assignment</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-center">Take Attendance</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-center">View Analytics</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <MessageSquare className="h-8 w-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-center">Message Parents</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <PenTool className="h-8 w-8 text-pink-600 mb-2" />
              <span className="text-sm font-medium text-center">Create Content</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <Calendar className="h-8 w-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-center">Schedule Meeting</span>
            </div>
          </div>
        </div>

        {/* Featured Tool Section */}
        <div className="mb-8">
          <TechTutorCard 
            variant="teacher"
            viewMode={viewMode}
            onClick={() => {
              console.log("Opening Tech Tutor external app with SSO...");
              // Future: Implement SSO redirect to Tech Tutor
            }}
          />
        </div>

        {/* Teaching Modules Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Teaching Modules</h2>
            <span className="text-sm text-gray-600">
              {filteredModules.length} of {modules.length} modules
            </span>
          </div>
          
          <ModuleGrid 
            modules={filteredModules}
            viewMode={viewMode}
            variant="teacher"
            onModuleClick={(moduleId) => {
              console.log(`Opening module: ${moduleId}`);
              // Future: Implement module navigation
            }}
          />
        </div>

        {filteredModules.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </CollapsibleDashboardLayout>
  );
}