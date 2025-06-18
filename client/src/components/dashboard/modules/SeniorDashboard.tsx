import { useState, useMemo } from "react";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  FolderOpen, 
  BarChart3, 
  GraduationCap,
  FileText,
  FlaskConical,
  Globe
} from "lucide-react";
import { DashboardHeader } from "../shared/DashboardHeader";
import { ModuleGrid } from "../shared/ModuleGrid";
import { Module } from "../shared/ModuleCard";
import { TechTutorCard } from "../shared/TechTutorCard";

interface SeniorDashboardProps {
  user?: any;
  stats?: any;
}

export function SeniorDashboard({ user, stats }: SeniorDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const techTutorModule = {
    id: "tech-tutor",
    title: "Tech Tutor",
    description: "Advanced technology training and digital literacy with AI-powered instruction",
    category: "Career",
    isExternal: true
  };

  const modules: Module[] = [
    {
      id: "advanced-library",
      title: "Advanced Library",
      description: "Access research databases, academic journals, and scholarly resources",
      icon: BookOpen,
      color: "border-l-blue-500",
      category: "Research",
      features: ["Academic Journals", "Research Papers", "Citation Tools"],
      moreCount: 12,
      tag: "Research"
    },
    {
      id: "college-prep",
      title: "College Preparation",
      description: "SAT/ACT prep, college applications, and career guidance",
      icon: GraduationCap,
      color: "border-l-purple-500",
      category: "Career",
      features: ["Test Prep", "Applications", "Scholarships"],
      moreCount: 8,
      tag: "Critical"
    },
    {
      id: "peer-collaboration",
      title: "Peer Collaboration",
      description: "Work on group projects and participate in academic discussions",
      icon: Users,
      color: "border-l-green-500",
      category: "Social",
      features: ["Group Projects", "Study Sessions", "Peer Review"],
      moreCount: 4,
      tag: "Collaborative"
    },
    {
      id: "advanced-analytics",
      title: "Advanced Analytics",
      description: "Detailed academic performance tracking and predictive insights",
      icon: BarChart3,
      color: "border-l-indigo-500",
      category: "Analytics",
      features: ["Performance Metrics", "Predictive Analysis", "Goal Tracking"],
      moreCount: 6,
      tag: "Insights"
    },
    {
      id: "academic-calendar",
      title: "Academic Calendar",
      description: "Manage complex schedules, deadlines, and exam periods",
      icon: Calendar,
      color: "border-l-orange-500",
      category: "Planning",
      features: ["Schedule Management", "Deadline Tracking", "Exam Planning"],
      moreCount: 3,
      tag: "Essential"
    },
    {
      id: "research-projects",
      title: "Research Projects",
      description: "Conduct independent research and create academic presentations",
      icon: FileText,
      color: "border-l-cyan-500",
      category: "Research",
      features: ["Research Tools", "Data Analysis", "Presentations"],
      moreCount: 7,
      tag: "Advanced"
    },
    {
      id: "laboratory-access",
      title: "Laboratory Access",
      description: "Advanced virtual labs and real-time experiment monitoring",
      icon: FlaskConical,
      color: "border-l-pink-500",
      category: "Science",
      features: ["Virtual Labs", "Real Experiments", "Data Collection"],
      moreCount: 5,
      tag: "Hands-on"
    },
    {
      id: "global-connections",
      title: "Global Connections",
      description: "Connect with international students and participate in global programs",
      icon: Globe,
      color: "border-l-teal-500",
      category: "Global",
      features: ["International Exchange", "Cultural Programs", "Language Learning"],
      moreCount: 4,
      tag: "Global"
    },
    {
      id: "portfolio-management",
      title: "Portfolio Management",
      description: "Professional portfolio creation for college and career applications",
      icon: FolderOpen,
      color: "border-l-yellow-500",
      category: "Career",
      features: ["Professional Portfolio", "Resume Builder", "Skill Showcase"],
      moreCount: 3,
      tag: "Professional"
    },
    {
      id: "account-settings",
      title: "Account Settings",
      description: "Manage your profile, privacy settings, and academic preferences",
      icon: Settings,
      color: "border-l-gray-500",
      category: "Settings",
      features: ["Profile Management", "Privacy Controls", "Notifications"],
      moreCount: 2,
      tag: "Personal"
    }
  ];

  const categories = ["All Modules", "Research", "Career", "Social", "Analytics", "Planning", "Science", "Global", "Settings"];

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader
          title="Senior Student Dashboard"
          subtitle="Advanced tools for academic excellence and college preparation"
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

        <div className={
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          <TechTutorCard 
            variant="senior"
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
          onModuleClick={(moduleId) => {
            console.log(`Opening module: ${moduleId}`);
          }}
        />

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
    </div>
  );
}