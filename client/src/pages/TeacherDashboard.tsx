import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Calendar, TrendingUp, Award, Clock } from "lucide-react";
import { useXapiPageTracking } from "@/lib/xapiTracker";
import LessonManagement from "@/components/teacher/LessonManagement";
import AssignmentTracker from "@/components/teacher/AssignmentTracker";
import AttendanceManager from "@/components/teacher/AttendanceManager";
import LiveSessionPanel from "@/components/teacher/LiveSessionPanel";
import TeachingAnalytics from "@/components/teacher/TeachingAnalytics";

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Track page view with xAPI
  useXapiPageTracking("Teacher Dashboard", "teacher-tools");

  // Quick stats for overview
  const quickStats = [
    { label: "Active Classes", value: "3", icon: BookOpen, color: "text-blue-600" },
    { label: "Total Students", value: "75", icon: Users, color: "text-green-600" },
    { label: "Upcoming Sessions", value: "2", icon: Calendar, color: "text-purple-600" },
    { label: "Avg Performance", value: "87%", icon: TrendingUp, color: "text-orange-600" }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Calculus Review Session",
      type: "live-session",
      time: "Today, 3:00 PM",
      class: "Grade 12 - Calculus I",
      status: "scheduled"
    },
    {
      id: 2,
      title: "Assignment Due: Derivatives",
      type: "assignment",
      time: "Tomorrow, 11:59 PM",
      class: "Grade 12 - Calculus I",
      status: "pending"
    },
    {
      id: 3,
      title: "Parent-Teacher Conference",
      type: "meeting",
      time: "Thursday, 2:00 PM",
      class: "Grade 11 - Advanced Math",
      status: "confirmed"
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes, lessons, and student progress</p>
        </div>
        <Button>
          <Award className="h-4 w-4 mr-2" />
          View Report Card
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="sessions">Live Sessions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index}>
                  <CardContent className="flex items-center p-6">
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                    <div className="ml-4">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your classes and activities for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Advanced Mathematics</div>
                      <div className="text-sm text-muted-foreground">Grade 11 • Room Math-201</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">9:00 AM</div>
                      <Badge variant="outline">In Progress</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Calculus I</div>
                      <div className="text-sm text-muted-foreground">Grade 12 • Room Math-203</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">10:30 AM</div>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Statistics</div>
                      <div className="text-sm text-muted-foreground">Grade 10 • Room Math-105</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">2:00 PM</div>
                      <Badge variant="outline">Scheduled</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Important deadlines and appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-muted-foreground">{event.class}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{event.time}</div>
                        <Badge 
                          variant={event.status === 'confirmed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Assignment submitted: "Derivative Practice"</div>
                    <div className="text-sm text-muted-foreground">Emma Johnson • Calculus I • 2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Lesson completed: "Linear Equations Systems"</div>
                    <div className="text-sm text-muted-foreground">Advanced Mathematics • 4 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="font-medium">Student question: "Help with integration"</div>
                    <div className="text-sm text-muted-foreground">Michael Chen • Calculus I • 6 hours ago</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lessons">
          <LessonManagement />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentTracker />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceManager />
        </TabsContent>

        <TabsContent value="sessions">
          <LiveSessionPanel />
        </TabsContent>

        <TabsContent value="analytics">
          <TeachingAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}