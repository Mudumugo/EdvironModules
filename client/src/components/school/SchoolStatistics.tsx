import { Users, UserCheck, BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SchoolStatisticsProps {
  students: any[];
  teachers: any[];
  classes: any[];
  studentsLoading: boolean;
  teachersLoading: boolean;
  classesLoading: boolean;
}

export function SchoolStatistics({
  students,
  teachers,
  classes,
  studentsLoading,
  teachersLoading,
  classesLoading
}: SchoolStatisticsProps) {
  const studentCount = Array.isArray(students) ? students.length : 0;
  const teacherCount = Array.isArray(teachers) ? teachers.length : 0;
  const classCount = Array.isArray(classes) ? classes.length : 0;
  const gradeCount = Array.isArray(students) ? 
    new Set(students.map((s: any) => s.grade)).size : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Students
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {studentsLoading ? "..." : studentCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Total Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {teachersLoading ? "..." : teacherCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Total Classes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {classesLoading ? "..." : classCount}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Active Grades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {studentsLoading ? "..." : gradeCount}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}