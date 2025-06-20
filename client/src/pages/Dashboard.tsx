import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@shared/schema";
import ITDashboard from "./ITDashboard";
import SecurityDashboard from "./SecurityDashboard";
import { PrimaryDashboard, JuniorDashboard, SeniorDashboard, TeacherDashboard, SchoolAdminDashboard } from "@/components/dashboard/modules";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Determine academic level based on user profile
  const getAcademicLevel = () => {
    if (!user) return 'primary';
    
    // Handle specific demo roles and student roles
    if (user.role === 'demo_student_elementary' || user.role === 'student_elementary') {
      return 'primary';
    }
    if (user.role === 'demo_student_middle' || user.role === 'student_middle') {
      return 'junior';
    }
    if (user.role === 'demo_student_high' || user.role === 'student_high') {
      return 'senior';
    }
    if (user.role === 'demo_student_college' || user.role === 'student_college') {
      return 'senior'; // Use senior dashboard for college students too
    }
    
    // General student role fallback
    if (user.role === 'student') {
      // This would come from student profile in real implementation
      const grade = 5; // Example grade
      if (grade <= 3) return 'primary';
      if (grade <= 8) return 'junior';
      if (grade <= 12) return 'senior';
      return 'senior';
    }
    
    if (user.role === 'teacher' || user.role === 'demo_teacher') return 'teacher';
    if (user.role === 'admin') return 'senior';
    return 'junior';
  };

  const academicLevel = getAcademicLevel();

  // Render specialized dashboards for specific roles with responsive containers
  if (user?.role === "school_it_staff") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <ITDashboard />
        </div>
      </div>
    );
  }
  
  if (user?.role === "school_security") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <SecurityDashboard />
        </div>
      </div>
    );
  }

  if (user?.role === "school_admin" || user?.role === "demo_school_admin") {
    return <SchoolAdminDashboard user={user} stats={stats} />;
  }

  // Return appropriate dashboard based on academic level
  if (academicLevel === 'primary') return <PrimaryDashboard user={user} />;
  if (academicLevel === 'junior') return <JuniorDashboard user={user} stats={stats} />;
  if (academicLevel === 'teacher') return <TeacherDashboard user={user} stats={stats} />;
  if (academicLevel === 'senior' || academicLevel === 'college') return <SeniorDashboard user={user} stats={stats} />;
  
  return <JuniorDashboard user={user} stats={stats} />; // fallback
}