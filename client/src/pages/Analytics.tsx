import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen,
  Clock,
  Activity,
  Target,
  Award
} from "lucide-react";

export default function Analytics() {
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

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Mock analytics data - in real implementation this would come from API
  const performanceMetrics = [
    { subject: "Mathematics", average: 87, improvement: 12, students: 45 },
    { subject: "Science", average: 82, improvement: 8, students: 42 },
    { subject: "English", average: 91, improvement: 5, students: 48 },
    { subject: "History", average: 78, improvement: 15, students: 35 },
    { subject: "Geography", average: 85, improvement: -3, students: 38 }
  ];

  const engagementData = [
    { module: "Digital Library", usage: 95, trend: "up" },
    { module: "School Management", usage: 88, trend: "up" },
    { module: "Scheduling", usage: 76, trend: "stable" },
    { module: "Virtual Labs", usage: 67, trend: "up" },
    { module: "Certification", usage: 45, trend: "down" }
  ];

  const systemMetrics = {
    uptime: 99.8,
    responseTime: 120,
    activeUsers: stats?.totalStudents || 0,
    totalSessions: 1247,
    errorRate: 0.2
  };

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-600 mt-1">
            Custom dashboards for performance trends, engagement metrics, and resource utilization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="7days">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.uptime}%</p>
              </div>
              <div className="bg-accent-50 p-3 rounded-lg">
                <Activity className="text-accent-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={systemMetrics.uptime} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.activeUsers}</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Users className="text-primary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">+12% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-gray-900">89.2%</p>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg">
                <TrendingUp className="text-secondary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={89.2} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.responseTime}ms</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Clock className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Excellent</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Error Rate</p>
                <p className="text-2xl font-bold text-gray-900">{systemMetrics.errorRate}%</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <Target className="text-red-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={systemMetrics.errorRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subject Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{subject.subject}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{subject.average}%</span>
                          <Badge 
                            variant={subject.improvement > 0 ? "default" : subject.improvement < 0 ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {subject.improvement > 0 ? "+" : ""}{subject.improvement}%
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={subject.average} className="flex-1 h-2" />
                        <span className="text-xs text-gray-500">{subject.students} students</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Grade Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">A (90-100%)</span>
                    <span className="text-sm text-gray-600">32%</span>
                  </div>
                  <Progress value={32} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">B (80-89%)</span>
                    <span className="text-sm text-gray-600">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">C (70-79%)</span>
                    <span className="text-sm text-gray-600">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">D (60-69%)</span>
                    <span className="text-sm text-gray-600">12%</span>
                  </div>
                  <Progress value={12} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">F (Below 60%)</span>
                    <span className="text-sm text-gray-600">3%</span>
                  </div>
                  <Progress value={3} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Module Engagement */}
            <Card>
              <CardHeader>
                <CardTitle>Module Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementData.map((module, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{module.module}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{module.usage}%</span>
                          <Badge 
                            variant={module.trend === "up" ? "default" : module.trend === "down" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {module.trend}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={module.usage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle>User Activity Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Peak Hours</span>
                      <span className="text-sm text-gray-600">9 AM - 11 AM</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Average Session</span>
                      <span className="text-sm text-gray-600">45 minutes</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Return Rate</span>
                      <span className="text-sm text-gray-600">94%</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Mobile Usage</span>
                      <span className="text-sm text-gray-600">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Resource Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Digital Library</span>
                    <span className="text-sm text-gray-600">3,456 views</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Virtual Labs</span>
                    <span className="text-sm text-gray-600">1,234 sessions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Assignments</span>
                    <span className="text-sm text-gray-600">2,890 submissions</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Certificates</span>
                    <span className="text-sm text-gray-600">567 generated</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Most Viewed</span>
                    <span className="text-sm text-gray-600">Math Algebra</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Top Rated</span>
                    <span className="text-sm text-gray-600">Science Labs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Most Downloaded</span>
                    <span className="text-sm text-gray-600">History Notes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Completion Rate</span>
                    <span className="text-sm text-gray-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Device Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Desktop</span>
                      <span className="text-sm text-gray-600">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Mobile</span>
                      <span className="text-sm text-gray-600">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Tablet</span>
                      <span className="text-sm text-gray-600">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Server Uptime</span>
                    <Badge className="bg-accent-50 text-accent-600">99.8%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Database Performance</span>
                    <Badge className="bg-accent-50 text-accent-600">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">API Response Time</span>
                    <Badge className="bg-accent-50 text-accent-600">120ms</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Storage Usage</span>
                    <Badge className="bg-yellow-50 text-yellow-600">78%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">CPU Usage</span>
                      <span className="text-sm text-gray-600">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Memory Usage</span>
                      <span className="text-sm text-gray-600">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Network I/O</span>
                      <span className="text-sm text-gray-600">38%</span>
                    </div>
                    <Progress value={38} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">Disk Usage</span>
                      <span className="text-sm text-gray-600">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
