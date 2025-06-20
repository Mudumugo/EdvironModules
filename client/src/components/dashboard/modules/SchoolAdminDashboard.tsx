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
  { title: "Total Students", value: "847", change: "+12%", icon: Users, color: "bg-blue-500" },
  { title: "Teaching Staff", value: "43", change: "+5%", icon: GraduationCap, color: "bg-green-500" },
  { title: "Attendance Rate", value: "94.2%", change: "+2.1%", icon: CheckCircle, color: "bg-emerald-500" },
  { title: "Active Classes", value: "32", change: "+3%", icon: BookOpen, color: "bg-purple-500" }
];

// School-level management modules (accessible by school administrators)
const schoolAdminModules = [
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
    id: "school-analytics", 
    title: "School Analytics", 
    description: "School performance metrics and academic reports", 
    icon: BarChart3, 
    href: "/analytics", 
    color: "bg-purple-500",
    category: "Analytics",
    features: ["Academic Performance", "Attendance Reports", "Grade Analytics"]
  },
  { 
    id: "scheduling", 
    title: "Class Scheduling", 
    description: "Manage class schedules, timetables and school events", 
    icon: Calendar, 
    href: "/scheduling", 
    color: "bg-green-500",
    category: "Operations",
    features: ["Class Schedules", "Event Planning", "Resource Booking"]
  },
  { 
    id: "school-devices", 
    title: "School Devices", 
    description: "Manage school-owned devices and classroom technology", 
    icon: Monitor, 
    href: "/device-management", 
    color: "bg-cyan-500",
    category: "Technology",
    features: ["Device Inventory", "Classroom Tech", "Maintenance Requests"]
  },
  { 
    id: "digital-library", 
    title: "Library Management", 
    description: "Manage school's digital library and educational resources", 
    icon: BookOpen, 
    href: "/digital-library", 
    color: "bg-emerald-500",
    category: "Academic",
    features: ["Resource Management", "Content Approval", "Usage Analytics"]
  },
  { 
    id: "parent-communication", 
    title: "Parent Portal", 
    description: "Manage parent communications and school announcements", 
    icon: MessageSquare, 
    href: "/parent-portal-admin", 
    color: "bg-pink-500",
    category: "Communication",
    features: ["Parent Updates", "Announcements", "Communication Tools"]
  }
];

// Super-admin/Edvirons support modules (restricted to Edvirons team)
const superAdminModules = [
  { 
    id: "global-users", 
    title: "Global User Management", 
    description: "Manage all users across the Edvirons platform", 
    icon: Users, 
    href: "/users", 
    color: "bg-indigo-500",
    category: "Global",
    features: ["Platform Users", "Role Assignment", "Global Permissions"],
    restricted: true
  },
  { 
    id: "crm", 
    title: "CRM Management", 
    description: "Customer relationship management for Edvirons clients", 
    icon: UserCheck, 
    href: "/crm", 
    color: "bg-red-500",
    category: "Business",
    features: ["Lead Management", "Client Relations", "Sales Pipeline"],
    restricted: true
  },
  { 
    id: "platform-licensing", 
    title: "Platform Licensing", 
    description: "Manage Edvirons software licenses and subscriptions", 
    icon: CreditCard, 
    href: "/licensing", 
    color: "bg-orange-500",
    category: "Business",
    features: ["License Management", "Billing", "Subscription Control"],
    restricted: true
  },
  { 
    id: "system-settings", 
    title: "System Settings", 
    description: "Global platform configuration and system management", 
    icon: Settings, 
    href: "/admin/settings", 
    color: "bg-gray-500",
    category: "System",
    features: ["Platform Config", "System Health", "Global Settings"],
    restricted: true
  }
];

const recentActivities = [
  { action: "New student enrolled", user: "Emma Wilson", time: "2 minutes ago", type: "success" },
  { action: "Teacher profile updated", user: "Sarah Johnson", time: "15 minutes ago", type: "info" },
  { action: "Class schedule modified", user: "Dr. Smith", time: "1 hour ago", type: "info" },
  { action: "Parent meeting scheduled", user: "Admin Office", time: "2 hours ago", type: "success" },
  { action: "Library book added", user: "Ms. Chen", time: "3 hours ago", type: "info" }
];

const systemAlerts = [
  { title: "Parent-Teacher Conferences", description: "Schedule meetings for next week", priority: "high", time: "Today" },
  { title: "System Update", description: "New features available for teachers", priority: "medium", time: "2 hours ago" },
  { title: "Library Resources", description: "New digital books added to collection", priority: "low", time: "Yesterday" }
];

export function SchoolAdminDashboard({ user, stats }: SchoolAdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Modules");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const categories = ["All Modules", "Core", "Analytics", "Operations", "Technology", "Academic", "Communication"];

  // Determine which modules to show based on user role
  const availableModules = useMemo(() => {
    // For now, show only school-level modules for school administrators
    // In the future, you could check user.role === 'super_admin' to show superAdminModules
    return schoolAdminModules;
  }, []);

  const filteredModules = useMemo(() => {
    // Always show School Management first, regardless of filters
    const schoolManagement = availableModules.find(m => m.id === 'school-management');
    const otherModules = availableModules.filter(m => m.id !== 'school-management');
    
    const filtered = otherModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           module.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Modules" || module.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    
    // If search term matches school management or category is Core/All, include it
    const shouldShowSchoolManagement = 
      (selectedCategory === "All Modules" || selectedCategory === "Core") &&
      (searchTerm === "" || 
       schoolManagement?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       schoolManagement?.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return shouldShowSchoolManagement ? [schoolManagement, ...filtered].filter(Boolean) : filtered;
  }, [searchTerm, selectedCategory, availableModules]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">School Administrator Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your school with comprehensive administrative tools and insights
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
                    <Building2 className="h-5 w-5 mr-2" />
                    School Management Modules
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