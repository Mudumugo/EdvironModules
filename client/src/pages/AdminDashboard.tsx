import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  UserPlus,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Shield
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  activeClasses: number;
  pendingApplications: number;
  monthlyRevenue: number;
  attendanceRate: number;
  graduationRate: number;
}

interface RecentActivity {
  id: string;
  type: "enrollment" | "graduation" | "incident" | "achievement";
  title: string;
  description: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  path: string;
  color: string;
}

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

  const mockAlerts = [
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "enrollment": return <UserPlus className="h-4 w-4" />;
      case "graduation": return <GraduationCap className="h-4 w-4" />;
      case "incident": return <AlertTriangle className="h-4 w-4" />;
      case "achievement": return <CheckCircle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-50";
      case "medium": return "text-yellow-600 bg-yellow-50";
      case "low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

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
      {systemAlerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systemAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${alert.urgent ? 'border-l-red-500' : 'border-l-blue-500'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.urgent ? 'text-red-500' : 'text-blue-500'}`} />
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    </div>
                  </div>
                  {alert.urgent && (
                    <Badge variant="destructive" className="text-xs">Urgent</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Staff</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTeachers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalStaff} total staff members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClasses}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingApplications} pending applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Attendance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Attendance</span>
                <span className="text-sm text-muted-foreground">{stats.attendanceRate}%</span>
              </div>
              <Progress value={stats.attendanceRate} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Target: 95% | Current: {stats.attendanceRate}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Graduation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-sm text-muted-foreground">{stats.graduationRate}%</span>
              </div>
              <Progress value={stats.graduationRate} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Above national average of 94.5%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Access key administrative functions
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.id} href={action.path}>
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${action.color} text-white`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{action.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-1.5 rounded-full ${getPriorityColor(activity.priority)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Learning Management System</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Student Information System</p>
                <p className="text-xs text-muted-foreground">Operational</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">Parent Portal</p>
                <p className="text-xs text-muted-foreground">Maintenance Mode</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}