export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  activeClasses: number;
  pendingApplications: number;
  monthlyRevenue: number;
  attendanceRate: number;
  graduationRate: number;
}

export interface RecentActivity {
  id: string;
  type: "enrollment" | "graduation" | "incident" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  color: string;
}

export interface SystemAlert {
  id: string;
  type: "warning" | "info" | "error";
  title: string;
  description: string;
  urgent: boolean;
}