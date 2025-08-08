import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { isStudent } from "@/lib/roleUtils";
import { GraduationCap, BookOpen, Clock, Award, Target, TrendingUp } from "lucide-react";

export function AcademicTab() {
  const { user } = useAuth();

  if (!user || !isStudent(user.role)) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Academic information is only available for students.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Academic Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Academic Overview
          </CardTitle>
          <CardDescription>
            Your current academic status and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">3.8</p>
              <p className="text-sm text-muted-foreground">Current GPA</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-muted-foreground">Active Courses</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">92%</p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Current Courses
          </CardTitle>
          <CardDescription>
            Your enrolled courses for this semester
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Advanced Mathematics", grade: "A", progress: 85 },
            { name: "Physics", grade: "B+", progress: 78 },
            { name: "Chemistry", grade: "A-", progress: 92 },
            { name: "English Literature", grade: "B", progress: 76 },
            { name: "History", grade: "A", progress: 88 },
            { name: "Computer Science", grade: "A+", progress: 95 }
          ].map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{course.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{course.grade}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    {course.progress}% Complete
                  </div>
                </div>
              </div>
              <Progress value={course.progress} className="w-24" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Academic Achievements
          </CardTitle>
          <CardDescription>
            Your recent accomplishments and awards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "Honor Roll", description: "Q1 2024", date: "3 months ago" },
            { title: "Science Fair Winner", description: "1st Place - Chemistry Project", date: "6 months ago" },
            { title: "Perfect Attendance", description: "Fall 2023 Semester", date: "8 months ago" },
            { title: "Mathematics Excellence", description: "Top 5% in Advanced Calculus", date: "1 year ago" }
          ].map((achievement, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-medium">{achievement.title}</p>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">{achievement.date}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Study Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Study Goals
          </CardTitle>
          <CardDescription>
            Track your academic goals and targets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { goal: "Maintain 3.5+ GPA", progress: 76, target: "End of Semester" },
            { goal: "Complete 20 Library Books", progress: 60, target: "End of Year" },
            { goal: "95% Attendance Rate", progress: 92, target: "Ongoing" }
          ].map((goal, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-medium">{goal.goal}</p>
                <Badge variant="outline">{goal.target}</Badge>
              </div>
              <Progress value={goal.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">{goal.progress}% Complete</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
