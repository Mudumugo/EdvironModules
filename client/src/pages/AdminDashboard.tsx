import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  GraduationCap, 
  Calendar,
  UserPlus,
  BarChart3,
  Settings,
  Shield
} from "lucide-react";
import {
  AlertsSection,
  KeyMetrics,
  PerformanceMetrics,
  QuickActions,
  RecentActivityCard,
  SystemStatus
} from "@/components/admin/modules";
import { DashboardStats, RecentActivity, QuickAction, SystemAlert } from "@/components/admin/types";



export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("thisMonth");

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/stats", selectedTimeframe],
  });

  const { data: recentActivity = [], isLoading: activityLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/activity"],
  });

  const { data: alerts = [], isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/admin/dashboard/alerts"],
  });

  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalStudents: 1247,
    totalTeachers: 89,
    totalStaff: 156,
    activeClasses: 52,
    pendingApplications: 23,
    monthlyRevenue: 245000,
    attendanceRate: 94.2,
    graduationRate: 97.8
  };

  const mockActivity: RecentActivity[] = [
    {
      id: "1",
      type: "enrollment",
      title: "New Student Enrollment",
      description: "Sarah Johnson enrolled in Grade 10",
      timestamp: "2 hours ago",
      priority: "low"
    },
    {
      id: "2",
      type: "incident",
      title: "Security Alert",
      description: "Unauthorized access attempt detected in IT lab",
      timestamp: "4 hours ago",
      priority: "high"
    },
    {
      id: "3",
      type: "achievement",
      title: "Academic Excellence",
      description: "Grade 12 class achieved 98% pass rate",
      timestamp: "1 day ago",
      priority: "medium"
    }
  ];

  const mockAlerts: SystemAlert[] = [
    {
      id: "1",
      type: "warning",
      title: "Low Attendance Alert",
      description: "Grade 8B has attendance below 85% this week",
      urgent: true
    },
    {
      id: "2",
      type: "info",
      title: "Parent-Teacher Meetings",
      description: "Scheduled for next week - 15 meetings pending confirmation",
      urgent: false
    }
  ];

  const stats = dashboardStats || mockStats;
  const activities = recentActivity.length > 0 ? recentActivity : mockActivity;
  const systemAlerts = alerts.length > 0 ? alerts : mockAlerts;

  const quickActions: QuickAction[] = [
    {
      id: "user-management",
      title: "User Management",
      description: "Manage students, teachers, and staff",
      icon: Users,
      path: "/users",
      color: "bg-blue-500"
    },
    {
      id: "school-management",
      title: "School Management",
      description: "Institutional settings and administration",
      icon: Settings,
      path: "/school-management",
      color: "bg-green-500"
    },
    {
      id: "parent-portal-admin",
      title: "Parent Portal Admin",
      description: "Manage parent-child relationships",
      icon: UserPlus,
      path: "/parent-portal-admin",
      color: "bg-purple-500"
    },
    {
      id: "analytics",
      title: "Analytics & Reports",
      description: "School performance analytics",
      icon: BarChart3,
      path: "/analytics",
      color: "bg-orange-500"
    },
    {
      id: "scheduling",
      title: "Scheduling",
      description: "Class schedules and timetables",
      icon: Calendar,
      path: "/scheduling",
      color: "bg-cyan-500"
    },
    {
      id: "security",
      title: "Security Dashboard",
      description: "Security monitoring and alerts",
      icon: Shield,
      path: "/security-dashboard",
      color: "bg-red-500"
    }
  ];



  if (statsLoading || activityLoading || alertsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Administration Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive overview of school operations and management
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
            <option value="thisQuarter">This Quarter</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      {/* Alerts Section */}
      <AlertsSection alerts={systemAlerts} />

      {/* Key Metrics */}
      <KeyMetrics stats={stats} />

      {/* Performance Metrics */}
      <PerformanceMetrics stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <QuickActions actions={quickActions} />
        </div>

        {/* Recent Activity */}
        <RecentActivityCard activities={activities} />
      </div>

      {/* System Status */}
      <SystemStatus />
    </div>
  );
}