import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@shared/schema";
import ITDashboard from "./ITDashboard";
import SecurityDashboard from "./SecurityDashboard";
import { PrimaryDashboard, JuniorDashboard, SeniorDashboard } from "@/components/dashboard/modules";

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
    
    if (user.role === 'teacher' || user.role === 'demo_teacher') return 'senior';
    if (user.role === 'admin') return 'senior';
    return 'junior';
  };

  const academicLevel = getAcademicLevel();

  // Render specialized dashboards for specific roles
  if (user?.role === "school_it_staff") {
    return <ITDashboard />;
  }
  
  if (user?.role === "school_security") {
    return <SecurityDashboard />;
  }

  // Return appropriate dashboard based on academic level
  if (academicLevel === 'primary') return <PrimaryDashboard user={user} />;
  if (academicLevel === 'junior') return <JuniorDashboard user={user} stats={stats} />;
  if (academicLevel === 'senior' || academicLevel === 'college') return <SeniorDashboard user={user} stats={stats} />;
  
  return <JuniorDashboard user={user} stats={stats} />; // fallback
}