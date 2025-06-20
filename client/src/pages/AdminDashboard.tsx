import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database, 
  Bell,
  UserCheck,
  GraduationCap,
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

const quickStats = [
  { title: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "bg-blue-500" },
  { title: "Active Sessions", value: "1,203", change: "+8%", icon: Activity, color: "bg-green-500" },
  { title: "System Health", value: "98.5%", change: "+0.2%", icon: Shield, color: "bg-emerald-500" },
  { title: "Storage Used", value: "67%", change: "+3%", icon: Database, color: "bg-orange-500" }
];

const adminActions = [
  { title: "Student Management", description: "Manage student enrollment and records", icon: Users, href: "/school-management", color: "bg-blue-500" },
  { title: "School Settings", description: "Configure school-specific settings", icon: Settings, href: "/school/settings", color: "bg-gray-500" },
  { title: "Analytics", description: "View school analytics and reports", icon: BarChart3, href: "/analytics", color: "bg-purple-500" },
  { title: "Security Center", description: "Monitor school security and access", icon: Shield, href: "/school/security", color: "bg-red-500" },
  { title: "Teacher Management", description: "Manage faculty and staff accounts", icon: UserCheck, href: "/school-management", color: "bg-indigo-500" },
  { title: "Course Management", description: "Oversee curriculum and courses", icon: GraduationCap, href: "/admin/courses", color: "bg-green-500" },
  { title: "Digital Library", description: "Manage educational resources", icon: BookOpen, href: "/digital-library", color: "bg-teal-500" },
  { title: "Events & Calendar", description: "Manage school events and schedules", icon: Calendar, href: "/calendar", color: "bg-yellow-500" },
  { title: "Communications", description: "Manage announcements and messages", icon: MessageSquare, href: "/admin/communications", color: "bg-pink-500" }
];

const recentActivities = [
  { action: "New teacher registered", user: "Sarah Johnson", time: "2 minutes ago", type: "success" },
  { action: "System backup completed", user: "System", time: "15 minutes ago", type: "info" },
  { action: "Security alert resolved", user: "Security Team", time: "1 hour ago", type: "warning" },
  { action: "Course material updated", user: "Dr. Smith", time: "2 hours ago", type: "info" },
  { action: "New student enrollment", user: "Emma Wilson", time: "3 hours ago", type: "success" }
];

const systemAlerts = [
  { title: "Server Maintenance Scheduled", description: "Maintenance window tonight 2-4 AM", priority: "medium", time: "Today" },
  { title: "Storage Usage Warning", description: "Storage is 85% full", priority: "high", time: "2 hours ago" },
  { title: "New Feature Update", description: "Enhanced analytics now available", priority: "low", time: "Yesterday" }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.firstName}! Here's your system overview.</p>
          </div>
          <div className="flex items-center space-x-4">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Administrative Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminActions.map((action) => (
                    <Link key={action.title} href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mx-auto mb-3`}>
                            <action.icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Alerts */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                      <div className={`p-1 rounded-full ${
                        alert.priority === 'high' ? 'bg-red-100' :
                        alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        {alert.priority === 'high' ? (
                          <AlertTriangle className={`h-4 w-4 ${
                            alert.priority === 'high' ? 'text-red-600' :
                            alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        ) : (
                          <Bell className={`h-4 w-4 ${
                            alert.priority === 'high' ? 'text-red-600' :
                            alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{alert.title}</p>
                        <p className="text-gray-600 text-xs">{alert.description}</p>
                        <p className="text-gray-500 text-xs mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">by {activity.user}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}