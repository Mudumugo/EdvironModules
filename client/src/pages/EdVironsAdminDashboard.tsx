import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  Users, 
  Settings, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle,
  Server,
  Headphones,
  CreditCard,
  Globe,
  BarChart3,
  Activity
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import CBEHubCard from "@/components/CBEHubCard";

export default function EdVironsAdminDashboard() {
  const { user } = useAuth();

  const globalStats = [
    {
      title: "Active Tenants",
      value: "12",
      change: "+2 this month",
      icon: Building,
      color: "text-blue-600"
    },
    {
      title: "Total Users",
      value: "5,847",
      change: "+234 this week",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Platform Uptime",
      value: "99.9%",
      change: "Last 30 days",
      icon: Activity,
      color: "text-purple-600"
    },
    {
      title: "Support Tickets",
      value: "23",
      change: "8 pending",
      icon: Headphones,
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Apps Hub Management",
      description: "Manage global educational applications",
      icon: Settings,
      href: "/apps-hub-admin",
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
    },
    {
      title: "Global Support",
      description: "Handle support tickets from all tenants",
      icon: Headphones,
      href: "/global-support",
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
    },
    {
      title: "Global Licensing",
      description: "Manage licenses and tenant allocations",
      icon: CreditCard,
      href: "/global-licensing",
      color: "bg-green-50 border-green-200 hover:bg-green-100"
    },
    {
      title: "Tenant Management",
      description: "Manage school infrastructure and provisioning",
      icon: Building,
      href: "/tenant-management",
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
    }
  ];

  const recentActivity = [
    {
      action: "New tenant provisioned",
      details: "Pine Valley Academy - Basic tier",
      time: "2 hours ago",
      icon: Building,
      color: "text-green-600"
    },
    {
      action: "Support ticket resolved",
      details: "Khan Academy access issue - Greenwood High",
      time: "4 hours ago",
      icon: CheckCircle,
      color: "text-blue-600"
    },
    {
      action: "License allocation updated",
      details: "Microsoft Office 365 - Metro College Prep",
      time: "6 hours ago",
      icon: CreditCard,
      color: "text-purple-600"
    },
    {
      action: "High priority alert",
      details: "Database connection timeout - Riverside Elementary",
      time: "8 hours ago",
      icon: AlertCircle,
      color: "text-red-600"
    }
  ];

  const systemHealth = [
    { service: "Apps Hub API", status: "operational", uptime: "99.9%" },
    { service: "Global Database", status: "operational", uptime: "100%" },
    { service: "File Storage", status: "operational", uptime: "99.8%" },
    { service: "Authentication", status: "operational", uptime: "100%" },
    { service: "Monitoring", status: "degraded", uptime: "98.5%" }
  ];

  return (
    <div className="space-y-6">
      {/* CBE Hub Card - Persistent for all users */}
      <CBEHubCard />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">EdVirons Global Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName} {user?.lastName} - Managing the global educational platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-blue-600">
            {user?.role.replace('edvirons_', '').replace('_', ' ').toUpperCase()}
          </Badge>
          <Badge variant="outline">
            Global Tenant: {user?.tenantId}
          </Badge>
        </div>
      </div>

      {/* Global Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {globalStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Global Management
            </CardTitle>
            <CardDescription>Quick access to global platform features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className={`cursor-pointer transition-colors ${action.color}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <action.icon className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">{action.title}</h4>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest platform events and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-600">{activity.details}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Platform services status and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {systemHealth.map((service, index) => (
              <div key={index} className="text-center p-4 rounded-lg border">
                <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                  service.status === 'operational' ? 'bg-green-500' : 
                  service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <h4 className="font-medium text-sm">{service.service}</h4>
                <p className="text-xs text-gray-600 capitalize">{service.status}</p>
                <p className="text-xs text-gray-500">{service.uptime}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Most Popular Apps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Khan Academy</span>
              <span className="font-medium">2,341 users</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Google Classroom</span>
              <span className="font-medium">1,987 users</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Duolingo</span>
              <span className="font-medium">1,642 users</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tenant Growth</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>This Month</span>
              <span className="font-medium text-green-600">+2 tenants</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>This Quarter</span>
              <span className="font-medium text-green-600">+5 tenants</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>This Year</span>
              <span className="font-medium text-green-600">+12 tenants</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">License Utilization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Microsoft Office</span>
              <span className="font-medium">75% used</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Adobe Creative</span>
              <span className="font-medium">85% used</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Khan Academy</span>
              <span className="font-medium text-yellow-600">93% used</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}