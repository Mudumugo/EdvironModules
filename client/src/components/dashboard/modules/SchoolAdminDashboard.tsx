import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2,
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Calendar,
  FileText,
  GraduationCap,
  BookOpen,
  CreditCard,
  Monitor,
  UserCheck,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Activity,
  Bell,
  Clock,
  Search,
  Filter,
  Grid,
  List
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
// import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

interface SchoolAdminDashboardProps {
  user?: any;
  stats?: any;
}

const quickStats = [
  { title: "Total Students", value: "2,847", change: "+12%", icon: Users, color: "bg-blue-500" },
  { title: "Active Teachers", value: "143", change: "+5%", icon: GraduationCap, color: "bg-green-500" },
  { title: "System Health", value: "98.5%", change: "+0.2%", icon: Shield, color: "bg-emerald-500" },
  { title: "Monthly Revenue", value: "$47,230", change: "+8%", icon: CreditCard, color: "bg-purple-500" }
];

const adminModules = [
  { 
    id: "school-management", 
    title: "School Management", 
    description: "Comprehensive school administration and institutional settings", 
    icon: Building2, 
    href: "/school-management", 
    color: "bg-blue-600",
    category: "Core",
    features: ["Student Management", "Teacher Management", "Class Organization", "Academic Records"],
    isNew: true,
    priority: 1
  },
  { 
    id: "users", 
    title: "User Management", 
    description: "Manage students, teachers, and staff accounts", 
    icon: Users, 
    href: "/users", 
    color: "bg-indigo-500",
    category: "Core",
    features: ["User Accounts", "Role Assignment", "Permission Control"]
  },
  { 
    id: "analytics", 
    title: "Analytics & Reports", 
    description: "Comprehensive reporting and data analysis", 
    icon: BarChart3, 
    href: "/analytics", 
    color: "bg-purple-500",
    category: "Analytics",
    features: ["Performance Metrics", "Usage Reports", "Academic Analytics"]
  },
  { 
    id: "scheduling", 
    title: "Scheduling", 
    description: "Class schedules and timetable management", 
    icon: Calendar, 
    href: "/scheduling", 
    color: "bg-green-500",
    category: "Operations",
    features: ["Class Schedules", "Event Planning", "Resource Booking"]
  },
  { 
    id: "licensing", 
    title: "Licensing", 
    description: "Software licenses and subscription management", 
    icon: CreditCard, 
    href: "/licensing", 
    color: "bg-orange-500",
    category: "Finance",
    features: ["License Tracking", "Billing Management", "Renewals"]
  },
  { 
    id: "device-management", 
    title: "Device Management", 
    description: "Manage school devices and technical infrastructure", 
    icon: Monitor, 
    href: "/device-management", 
    color: "bg-cyan-500",
    category: "Technology",
    features: ["Device Inventory", "Maintenance", "Security"]
  },
];

const recentActivities = [
  { action: "New teacher registered", user: "Sarah Johnson", time: "2 minutes ago", type: "success" },
  { action: "Student enrollment completed", user: "Emma Wilson", time: "15 minutes ago", type: "success" },
  { action: "System backup completed", user: "System", time: "1 hour ago", type: "info" },
  { action: "Payment received", user: "Finance Dept", time: "2 hours ago", type: "success" },
  { action: "Class schedule updated", user: "Dr. Smith", time: "3 hours ago", type: "info" }
];

const systemAlerts = [
  { title: "License Renewal Due", description: "Educational software licenses expire in 30 days", priority: "high", time: "Today" },
  { title: "Server Maintenance", description: "Scheduled maintenance tonight 2-4 AM", priority: "medium", time: "Tomorrow" },
  { title: "New Feature Available", description: "Enhanced analytics dashboard is ready", priority: "low", time: "Yesterday" }
];

export function SchoolAdminDashboard({ user, stats }: SchoolAdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const categories = ["All Modules", "Core", "Analytics", "Operations", "Finance", "Technology"];

  const filteredModules = useMemo(() => {
    return adminModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Modules" || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">School Administrator Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your institution with comprehensive administrative tools
            </p>
          </div>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Admin Modules */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Administrative Modules
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredModules.map((module) => (
                      <Link key={module.id} href={module.href}>
                        <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer group relative overflow-hidden ${
                          module.id === 'school-management' ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-blue-100' : ''
                        }`}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`w-14 h-14 rounded-lg ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg ${
                                module.id === 'school-management' ? 'shadow-blue-300' : ''
                              }`}>
                                <module.icon className="h-7 w-7 text-white" />
                              </div>
                              {module.isNew && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
                                  New
                                </Badge>
                              )}
                            </div>
                            <h3 className={`font-semibold text-lg mb-2 group-hover:text-primary transition-colors ${
                              module.id === 'school-management' ? 'text-blue-700 font-bold' : ''
                            }`}>
                              {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              {module.description}
                            </p>
                            <div className="space-y-1">
                              {module.features.slice(0, 3).map((feature, index) => (
                                <div key={index} className="flex items-center text-xs text-muted-foreground">
                                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                  {feature}
                                </div>
                              ))}
                              {module.features.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  +{module.features.length - 3} more features
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredModules.map((module) => (
                      <Link key={module.id} href={module.href}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center`}>
                                <module.icon className="h-5 w-5 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold">{module.title}</h3>
                                  {module.isNew && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                      New
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{module.description}</p>
                              </div>
                              <Badge variant="outline">{module.category}</Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* System Alerts & Recent Activities */}
          <div className="space-y-6">
            {/* System Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  System Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className={`p-1 rounded-full ${
                        alert.priority === 'high' ? 'bg-red-100' :
                        alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                      }`}>
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.priority === 'high' ? 'text-red-600' :
                          alert.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.title}</p>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">by {activity.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}