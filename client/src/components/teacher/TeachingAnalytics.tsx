import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, BookOpen, Users, Award, Clock, Calendar, CheckCircle } from "lucide-react";

export default function TeachingAnalytics() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/teacher/analytics']
  });

  if (analyticsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Teaching Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const performanceData = analytics?.classPerformance?.map((cls: any) => ({
    name: `Class ${cls.classId.slice(-1)}`,
    grade: cls.averageGrade,
    trend: cls.trend
  })) || [];

  const weeklyData = [
    { day: 'Mon', lessons: 3, attendance: 94 },
    { day: 'Tue', lessons: 2, attendance: 96 },
    { day: 'Wed', lessons: 4, attendance: 92 },
    { day: 'Thu', lessons: 2, attendance: 95 },
    { day: 'Fri', lessons: 3, attendance: 89 }
  ];

  const assignmentStatusData = [
    { name: 'Graded', value: analytics?.weeklyStats?.assignmentsGraded || 45, color: '#22c55e' },
    { name: 'Pending', value: 12, color: '#f59e0b' },
    { name: 'Overdue', value: 3, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalClasses || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageAttendance || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Rating</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.studentRating || 0}/5</div>
            <p className="text-xs text-muted-foreground">
              Based on feedback
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Stats */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Activity</CardTitle>
          <CardDescription>Your teaching activity for the current week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics?.weeklyStats?.lessonsThisWeek || 0}</div>
              <p className="text-sm text-muted-foreground">Lessons Taught</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{analytics?.weeklyStats?.assignmentsGraded || 0}</div>
              <p className="text-sm text-muted-foreground">Assignments Graded</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics?.weeklyStats?.liveSessionsHeld || 0}</div>
              <p className="text-sm text-muted-foreground">Live Sessions</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{analytics?.weeklyStats?.averageAttendance || 0}%</div>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="lessons" fill="#3b82f6" name="Lessons" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Class Performance</CardTitle>
            <CardDescription>Average grades across your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="grade" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="mt-4 space-y-2">
              {analytics?.classPerformance?.map((cls: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">Class {cls.classId.slice(-1)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{cls.averageGrade}%</span>
                    {cls.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : cls.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Status</CardTitle>
            <CardDescription>Current grading workload</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={assignmentStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {assignmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Grading Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-green-600">45</div>
                  <div className="text-muted-foreground">Graded</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-600">12</div>
                  <div className="text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-red-600">3</div>
                  <div className="text-muted-foreground">Overdue</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teaching Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>Teaching Milestones</CardTitle>
          <CardDescription>Your achievements this semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <div className="font-bold">{analytics?.lessonsCompleted || 0}</div>
              <div className="text-sm text-muted-foreground">Lessons Completed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <div className="font-bold">{analytics?.assignmentsCreated || 0}</div>
              <div className="text-sm text-muted-foreground">Assignments Created</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <div className="font-bold">{analytics?.liveSessionsHeld || 0}</div>
              <div className="text-sm text-muted-foreground">Live Sessions</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <div className="font-bold">{analytics?.studentRating || 0}/5</div>
              <div className="text-sm text-muted-foreground">Student Rating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}