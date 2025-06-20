import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Bell, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Star,
  ChevronRight,
  Users,
  GraduationCap,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";

interface TeacherAssignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'active' | 'draft' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  studentsAssigned: number;
  submissionsReceived: number;
  graded: number;
  description?: string;
}

export function TeacherAssignmentStatusCard() {
  const { data: assignments = [], isLoading } = useQuery<TeacherAssignment[]>({
    queryKey: ['/api/assignments/status'],
  });

  const activeAssignments = assignments.filter(a => a.status === 'active');
  const needsGrading = assignments.reduce((sum, a) => sum + (a.submissionsReceived - a.graded), 0);
  const totalSubmissions = assignments.reduce((sum, a) => sum + a.submissionsReceived, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Assignment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            Assignment Management
          </div>
          <Badge variant={needsGrading > 0 ? "destructive" : "secondary"} className="text-sm px-3 py-1">
            {needsGrading}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{activeAssignments.length}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">{totalSubmissions}</div>
            <div className="text-sm text-muted-foreground">Submissions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600 mb-2">{needsGrading}</div>
            <div className="text-sm text-muted-foreground">Need Grading</div>
          </div>
        </div>

        {assignments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Assignments</h4>
            {assignments.slice(0, 3).map((assignment) => {
              const submissionRate = (assignment.submissionsReceived / assignment.studentsAssigned) * 100;
              return (
                <div key={assignment.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(assignment.priority)}
                    <div>
                      <div className="text-sm font-medium">{assignment.title}</div>
                      <div className="text-xs text-muted-foreground">{assignment.subject}</div>
                      <div className="text-xs text-muted-foreground">
                        {assignment.submissionsReceived}/{assignment.studentsAssigned} submitted
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`text-xs ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      Due {format(new Date(assignment.dueDate), 'MMM d')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Button variant="outline" className="w-full py-3">
          View All Assignments
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function TeacherClassOverviewCard() {
  const classData = {
    totalStudents: 142,
    activeClasses: 6,
    avgAttendance: 94,
    upcomingClasses: 3
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <Users className="h-6 w-6 text-green-600" />
          Class Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{classData.totalStudents}</div>
            <div className="text-sm text-muted-foreground">Total Students</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600 mb-2">{classData.activeClasses}</div>
            <div className="text-sm text-muted-foreground">Active Classes</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-base">
            <span>Average Attendance</span>
            <span className="font-semibold text-lg">{classData.avgAttendance}%</span>
          </div>
          <Progress value={classData.avgAttendance} className="h-3" />
        </div>

        <div className="text-center">
          <div className="text-2xl font-semibold text-purple-600 mb-1">{classData.upcomingClasses}</div>
          <div className="text-sm text-muted-foreground">Classes Today</div>
        </div>

        <Button variant="outline" className="w-full py-3">
          View Class Details
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

export function TeacherPerformanceCard() {
  const performanceData = {
    weeklyHours: 28,
    lessonsCompleted: 15,
    studentSatisfaction: 4.7,
    gradingBacklog: 23
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <BarChart3 className="h-6 w-6 text-purple-600" />
          Teaching Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600 mb-2">{performanceData.weeklyHours}</div>
            <div className="text-sm text-muted-foreground">Hours This Week</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-600 mb-2">{performanceData.lessonsCompleted}</div>
            <div className="text-sm text-muted-foreground">Lessons Completed</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-base">Student Satisfaction</span>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="font-semibold text-xl">{performanceData.studentSatisfaction}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <span className="text-base">Grading Backlog</span>
          </div>
          <Badge variant="outline" className="text-yellow-700 border-yellow-300 text-sm px-3 py-1">
            {performanceData.gradingBacklog} items
          </Badge>
        </div>

        <Button variant="outline" className="w-full py-3">
          View Analytics
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}