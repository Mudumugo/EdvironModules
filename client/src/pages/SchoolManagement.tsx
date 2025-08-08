import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2 } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { StudentManagement } from "@/components/school/StudentManagement";
import { TeacherManagement } from "@/components/school/TeacherManagement";
import { SchoolStatistics } from "@/components/school/SchoolStatistics";
import { SearchAndFilter } from "@/components/school/SearchAndFilter";

export default function SchoolManagement() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [classesLoading, setClassesLoading] = useState(false);

  // Fetch all users from database  
  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/users'],
    retry: false
  });

  // Filter students and teachers from all users
  const students = (allUsers as any[])?.filter(user => 
    user.role?.includes('student')) || [];
  const teachers = (allUsers as any[])?.filter(user => 
    user.role === 'teacher') || [];
  
  const studentsLoading = usersLoading;
  const teachersLoading = usersLoading;

  const handleRefresh = () => {
    // This will be called when students/teachers are created
  };

  // Filter functions
  const filteredStudents = Array.isArray(students) ? students.filter((student: any) => {
    const matchesSearch = searchTerm === "" || 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = selectedGrade === "" || selectedGrade === "all" || 
      student.role?.includes(`student_${selectedGrade}`);
    
    return matchesSearch && matchesGrade;
  }) : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              School Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage students, teachers, and school operations
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <SchoolStatistics
          students={students}
          teachers={teachers}
          classes={classes}
          studentsLoading={studentsLoading}
          teachersLoading={teachersLoading}
          classesLoading={classesLoading}
        />

        {/* Search and Filter */}
        <SearchAndFilter
          searchTerm={searchTerm}
          selectedGrade={selectedGrade}
          onSearchChange={setSearchTerm}
          onGradeChange={setSelectedGrade}
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="students" className="flex items-center gap-2">
              Students
            </TabsTrigger>
            <TabsTrigger value="teachers" className="flex items-center gap-2">
              Teachers
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students" className="space-y-4">
            <StudentManagement
              students={students}
              filteredStudents={filteredStudents}
              studentsLoading={studentsLoading}
              onStudentCreated={handleRefresh}
            />
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teachers" className="space-y-4">
            <TeacherManagement
              teachers={teachers}
              teachersLoading={teachersLoading}
              onTeacherCreated={handleRefresh}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
