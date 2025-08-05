import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@shared/schema";
import ITDashboard from "./ITDashboard";
import SecurityDashboard from "./SecurityDashboard";
import StudentDashboard from "./StudentDashboard";
import { PrimaryDashboard, JuniorDashboard, SeniorDashboard, TeacherDashboard, SchoolAdminDashboard } from "@/components/dashboard/modules";
import CBEHubCard from "@/components/CBEHubCard";
import { CollapsibleDashboardLayout } from "@/components/dashboard/CollapsibleDashboardLayout";

export default function Dashboard() {
  const { user } = useAuth();

  // Check if user is a student role - if so, use the original StudentDashboard
  const isStudentRole = user?.role?.includes('student') || user?.role?.includes('demo_student');
  
  if (isStudentRole) {
    return <StudentDashboard />;
  }

  // Fetch dashboard stats for non-student roles
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Handle special admin/staff roles
  if (user?.role === "school_it_staff") {
    return (
      <CollapsibleDashboardLayout title="IT Dashboard">
        <div className="mb-6">
          <CBEHubCard />
        </div>
        <ITDashboard />
      </CollapsibleDashboardLayout>
    );
  }
  
  if (user?.role === "school_security") {
    return (
      <CollapsibleDashboardLayout title="Security Dashboard">
        <div className="mb-6">
          <CBEHubCard />  
        </div>
        <SecurityDashboard />
      </CollapsibleDashboardLayout>
    );
  }

  if (user?.role === "school_admin" || user?.role === "demo_school_admin") {
    return (
      <CollapsibleDashboardLayout title="School Administration">
        <SchoolAdminDashboard user={user} stats={stats} />
      </CollapsibleDashboardLayout>
    );
  }

  // Teacher dashboard
  if (user?.role === "teacher" || user?.role === "demo_teacher") {
    return (
      <CollapsibleDashboardLayout title="Teacher Dashboard">
        <div className="mb-6">
          <CBEHubCard />
        </div>
        <TeacherDashboard user={user} stats={stats} />
      </CollapsibleDashboardLayout>
    );
  }

  // Default dashboard
  return (
    <CollapsibleDashboardLayout title="Dashboard">
      <div className="mb-6">
        <CBEHubCard />
      </div>
      <JuniorDashboard user={user} stats={stats} />
    </CollapsibleDashboardLayout>
  );
}