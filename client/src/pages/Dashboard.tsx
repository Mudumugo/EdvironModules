import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  UserPlus,
  PlusCircle,
  CalendarPlus,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    retry: false,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/dashboard/recent-activity'],
    retry: false,
  });

  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const unreadNotifications = notifications?.filter((n: any) => !n.isRead).length || 0;

  const quickActions = [
    {
      icon: UserPlus,
      label: "Add New Student",
      description: "Register a new student",
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
    {
      icon: PlusCircle,
      label: "Create Content",
      description: "Add to digital library",
      color: "text-accent-600",
      bgColor: "bg-accent-50",
    },
    {
      icon: CalendarPlus,
      label: "Schedule Class",
      description: "Create new schedule",
      color: "text-secondary-600",
      bgColor: "bg-secondary-50",
    },
    {
      icon: TrendingUp,
      label: "View Reports",
      description: "Analytics dashboard",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  const moduleStatus = [
    { name: "School Management", status: "online", color: "bg-accent-500" },
    { name: "Digital Library", status: "online", color: "bg-accent-500" },
    { name: "Payment Gateway", status: "syncing", color: "bg-yellow-500" },
    { name: "Analytics", status: "online", color: "bg-accent-500" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Administrator Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening at your institution today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.totalStudents || 0}
                </p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Users className="text-primary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">All enrolled</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Modules</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg">
                <GraduationCap className="text-secondary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 font-medium">All systems operational</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Library Resources</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.totalResources || 0}
                </p>
              </div>
              <div className="bg-accent-50 p-3 rounded-lg">
                <BookOpen className="text-accent-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Content available</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {statsLoading ? "..." : stats?.activeSubscriptions || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <DollarSign className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Revenue active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activitiesLoading ? (
                  <div>Loading activities...</div>
                ) : activities && activities.length > 0 ? (
                  activities.slice(0, 4).map((activity: any) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <UserPlus className="text-primary-600 h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">
                          {activity.module} - {activity.resourceType}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className={`${action.bgColor} p-2 rounded-lg mr-3`}>
                      <action.icon className={`${action.color} h-4 w-4`} />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">{action.label}</div>
                      <div className="text-xs text-gray-500">{action.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Module Status */}
          <Card>
            <CardHeader>
              <CardTitle>Module Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moduleStatus.map((module, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 ${module.color} rounded-full`}></div>
                      <span className="text-sm font-medium text-gray-900">{module.name}</span>
                    </div>
                    <Badge 
                      variant={module.status === 'online' ? 'default' : 'secondary'}
                      className={
                        module.status === 'online' 
                          ? 'bg-accent-50 text-accent-600' 
                          : 'bg-yellow-50 text-yellow-600'
                      }
                    >
                      {module.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Analytics Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Analytics Overview</CardTitle>
            <select className="text-sm border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">94.5%</div>
              <div className="text-sm text-gray-600">System Uptime</div>
              <div className="mt-2">
                <Progress value={94.5} className="h-2" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.totalStudents || 0}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
              <div className="mt-2">
                <Progress value={78} className="h-2" />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">89.2%</div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
              <div className="mt-2">
                <Progress value={89.2} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
