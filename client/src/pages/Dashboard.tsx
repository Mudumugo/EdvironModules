import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@shared/schema";
import ITDashboard from "./ITDashboard";
import SecurityDashboard from "./SecurityDashboard";
import { PrimaryDashboard, JuniorDashboard, SeniorDashboard, TeacherDashboard, SchoolAdminDashboard } from "@/components/dashboard/modules";
import CBEHubCard from "@/components/CBEHubCard";
import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

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

  // Get dashboard title based on user role
  const getDashboardTitle = () => {
    if (user?.role === "school_it_staff") return "IT Dashboard";
    if (user?.role === "school_security") return "Security Dashboard";
    if (user?.role === "school_admin" || user?.role === "demo_school_admin") return "School Administration";
    if (academicLevel === 'teacher') return "Teacher Dashboard";
    return "Dashboard";
  };

  // Render content based on role
  const renderContent = () => {
    if (user?.role === "school_it_staff") {
      return (
        <>
          <div className="mb-6">
            <CBEHubCard />
          </div>
          <ITDashboard />
        </>
      );
    }
    
    if (user?.role === "school_security") {
      return (
        <>
          <div className="mb-6">
            <CBEHubCard />  
          </div>
          <SecurityDashboard />
        </>
      );
    }

    if (user?.role === "school_admin" || user?.role === "demo_school_admin") {
      return <SchoolAdminDashboard user={user} stats={stats} />;
    }

    // Return appropriate dashboard based on academic level with CBE Hub
    return (
      <>
        <div className="mb-6">
          <CBEHubCard />
        </div>
        {academicLevel === 'primary' && <PrimaryDashboard user={user} />}
        {academicLevel === 'junior' && <JuniorDashboard user={user} stats={stats} />}
        {academicLevel === 'teacher' && <TeacherDashboard user={user} stats={stats} />}
        {academicLevel === 'senior' && <SeniorDashboard user={user} stats={stats} />}
        {!['primary', 'junior', 'teacher', 'senior'].includes(academicLevel) && <JuniorDashboard user={user} stats={stats} />}
      </>
    );
  };

  return (
    <CollapsibleDashboardLayout title={getDashboardTitle()}>
      {renderContent()}
    </CollapsibleDashboardLayout>
  );
}