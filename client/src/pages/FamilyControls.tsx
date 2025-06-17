import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Shield, 
  Clock, 
  BookOpen,
  AlertTriangle,
  CheckCircle,
  Settings,
  Eye,
  Timer,
  Activity
} from "lucide-react";

export default function FamilyControls() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [timeRestrictions, setTimeRestrictions] = useState(true);
  const [contentFiltering, setContentFiltering] = useState(true);
  const [reportNotifications, setReportNotifications] = useState(true);

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

  const { data: students, isLoading: studentsLoading } = useQuery({
    queryKey: ['/api/students'],
    retry: false,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['/api/dashboard/recent-activity'],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  // Mock data for family controls - in real implementation this would come from API
  const childrenData = [
    {
      id: 1,
      name: "Emma Johnson",
      grade: "Grade 8",
      screenTime: "2h 30m",
      todayActivity: "Mathematics, Science",
      status: "online",
      restrictions: ["Social Media Blocked", "Study Mode Active"]
    },
    {
      id: 2,
      name: "Michael Johnson",
      grade: "Grade 5",
      screenTime: "1h 45m",
      todayActivity: "Reading, Art",
      status: "offline",
      restrictions: ["Gaming Limited", "Homework Focus"]
    }
  ];

  const weeklyReports = [
    {
      child: "Emma Johnson",
      totalTime: "18h 20m",
      studyTime: "12h 40m",
      performance: 92,
      improvements: ["Math scores up 15%", "Completed all assignments"]
    },
    {
      child: "Michael Johnson",
      totalTime: "12h 15m",
      studyTime: "8h 30m",
      performance: 88,
      improvements: ["Reading level improved", "Science project completed"]
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family & Parental Controls</h1>
          <p className="text-gray-600 mt-1">
            Parent dashboard to monitor child activity, set usage limits, and receive performance reports
          </p>
        </div>
        <Button className="bg-primary-600 hover:bg-primary-700">
          <Settings className="h-4 w-4 mr-2" />
          Control Settings
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Children Monitored</p>
                <p className="text-2xl font-bold text-gray-900">{childrenData.length}</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Users className="text-primary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">All active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Daily Screen Time</p>
                <p className="text-2xl font-bold text-gray-900">4h 15m</p>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg">
                <Timer className="text-secondary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-yellow-600 font-medium">Within limits</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Restrictions</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
              <div className="bg-accent-50 p-3 rounded-lg">
                <Shield className="text-accent-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Protecting</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Study Progress</p>
                <p className="text-2xl font-bold text-gray-900">90%</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <Activity className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">On track</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Children Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Children Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {childrenData.map((child) => (
                      <div key={child.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-50 p-2 rounded-lg">
                            <Users className="text-primary-600 h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{child.name}</p>
                            <p className="text-sm text-gray-500">{child.grade}</p>
                            <p className="text-xs text-gray-400">
                              Today: {child.todayActivity}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={child.status === 'online' ? 'default' : 'secondary'}>
                            {child.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">
                            Screen time: {child.screenTime}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Controls */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="time-restrictions" className="text-sm font-medium">
                          Time Restrictions
                        </Label>
                        <p className="text-xs text-gray-500">Limit daily usage</p>
                      </div>
                      <Switch
                        id="time-restrictions"
                        checked={timeRestrictions}
                        onCheckedChange={setTimeRestrictions}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="content-filtering" className="text-sm font-medium">
                          Content Filtering
                        </Label>
                        <p className="text-xs text-gray-500">Block inappropriate content</p>
                      </div>
                      <Switch
                        id="content-filtering"
                        checked={contentFiltering}
                        onCheckedChange={setContentFiltering}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="report-notifications" className="text-sm font-medium">
                          Report Notifications
                        </Label>
                        <p className="text-xs text-gray-500">Receive weekly reports</p>
                      </div>
                      <Switch
                        id="report-notifications"
                        checked={reportNotifications}
                        onCheckedChange={setReportNotifications}
                      />
                    </div>

                    <Button className="w-full mt-4">
                      <Shield className="h-4 w-4 mr-2" />
                      Emergency Lock All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {childrenData.map((child) => (
              <Card key={child.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {child.name}
                    <Badge>{child.grade}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Active Restrictions</Label>
                      <div className="mt-2 space-y-2">
                        {child.restrictions.map((restriction, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{restriction}</span>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Daily Screen Time Limit</Label>
                      <div className="mt-2 flex items-center space-x-2">
                        <Progress value={65} className="flex-1" />
                        <span className="text-sm text-gray-600">{child.screenTime} / 4h</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm">
                        <Timer className="h-4 w-4 mr-2" />
                        Set Limits
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Activity
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyReports.map((report, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">{report.child}</h3>
                      <Badge className="bg-accent-50 text-accent-600">
                        Performance: {report.performance}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Screen Time</p>
                        <p className="text-lg font-semibold">{report.totalTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Study Time</p>
                        <p className="text-lg font-semibold">{report.studyTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Study Efficiency</p>
                        <Progress value={75} className="mt-1" />
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Key Improvements</p>
                      <div className="space-y-1">
                        {report.improvements.map((improvement, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-accent-600" />
                            <span className="text-sm text-gray-700">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts & Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Screen Time Limit Approaching</p>
                    <p className="text-sm text-gray-600">Emma has 30 minutes remaining for today</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border-l-4 border-green-400 bg-green-50 rounded">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Assignment Completed</p>
                    <p className="text-sm text-gray-600">Michael completed his math homework</p>
                    <p className="text-xs text-gray-400">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 border-l-4 border-red-400 bg-red-50 rounded">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Inappropriate Content Blocked</p>
                    <p className="text-sm text-gray-600">Blocked access to restricted website</p>
                    <p className="text-xs text-gray-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
