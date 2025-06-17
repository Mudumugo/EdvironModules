import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  GraduationCap,
  Plus,
  Search,
  Filter
} from "lucide-react";

export default function SchoolManagement() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

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

  const { data: teachers, isLoading: teachersLoading } = useQuery({
    queryKey: ['/api/teachers'],
    retry: false,
  });

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    retry: false,
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['/api/subjects'],
    retry: false,
  });

  const createStudentMutation = useMutation({
    mutationFn: async (studentData: any) => {
      await apiRequest("POST", "/api/students", studentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      toast({
        title: "Success",
        description: "Student created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create student",
        variant: "destructive",
      });
    },
  });

  const createTeacherMutation = useMutation({
    mutationFn: async (teacherData: any) => {
      await apiRequest("POST", "/api/teachers", teacherData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teachers'] });
      toast({
        title: "Success",
        description: "Teacher created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create teacher",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const filteredStudents = students?.filter((student: any) => {
    const matchesSearch = student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = !selectedGrade || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">School Management</h1>
          <p className="text-gray-600 mt-1">
            Manage students, teachers, classes, and academic records
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Student</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createStudentMutation.mutate({
                  userId: formData.get('userId'),
                  studentId: formData.get('studentId'),
                  grade: formData.get('grade'),
                  class: formData.get('class'),
                  enrollmentDate: formData.get('enrollmentDate'),
                });
              }} className="space-y-4">
                <div>
                  <Label htmlFor="userId">User ID</Label>
                  <Input id="userId" name="userId" required />
                </div>
                <div>
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" name="studentId" required />
                </div>
                <div>
                  <Label htmlFor="grade">Grade</Label>
                  <Select name="grade">
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-1">Grade 1</SelectItem>
                      <SelectItem value="grade-2">Grade 2</SelectItem>
                      <SelectItem value="grade-3">Grade 3</SelectItem>
                      <SelectItem value="grade-4">Grade 4</SelectItem>
                      <SelectItem value="grade-5">Grade 5</SelectItem>
                      <SelectItem value="grade-6">Grade 6</SelectItem>
                      <SelectItem value="grade-7">Grade 7</SelectItem>
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                      <SelectItem value="grade-11">Grade 11</SelectItem>
                      <SelectItem value="grade-12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Input id="class" name="class" />
                </div>
                <div>
                  <Label htmlFor="enrollmentDate">Enrollment Date</Label>
                  <Input id="enrollmentDate" name="enrollmentDate" type="date" required />
                </div>
                <Button type="submit" disabled={createStudentMutation.isPending}>
                  {createStudentMutation.isPending ? "Creating..." : "Create Student"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">
                  {studentsLoading ? "..." : students?.length || 0}
                </p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <Users className="text-primary-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teachers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {teachersLoading ? "..." : teachers?.length || 0}
                </p>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg">
                <UserCheck className="text-secondary-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {classesLoading ? "..." : classes?.length || 0}
                </p>
              </div>
              <div className="bg-accent-50 p-3 rounded-lg">
                <GraduationCap className="text-accent-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subjectsLoading ? "..." : subjects?.length || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <BookOpen className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Grades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Grades</SelectItem>
                      <SelectItem value="grade-1">Grade 1</SelectItem>
                      <SelectItem value="grade-2">Grade 2</SelectItem>
                      <SelectItem value="grade-3">Grade 3</SelectItem>
                      <SelectItem value="grade-4">Grade 4</SelectItem>
                      <SelectItem value="grade-5">Grade 5</SelectItem>
                      <SelectItem value="grade-6">Grade 6</SelectItem>
                      <SelectItem value="grade-7">Grade 7</SelectItem>
                      <SelectItem value="grade-8">Grade 8</SelectItem>
                      <SelectItem value="grade-9">Grade 9</SelectItem>
                      <SelectItem value="grade-10">Grade 10</SelectItem>
                      <SelectItem value="grade-11">Grade 11</SelectItem>
                      <SelectItem value="grade-12">Grade 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students List */}
          <Card>
            <CardHeader>
              <CardTitle>Students</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div>Loading students...</div>
              ) : filteredStudents && filteredStudents.length > 0 ? (
                <div className="space-y-4">
                  {filteredStudents.map((student: any) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-primary-50 p-2 rounded-lg">
                          <Users className="text-primary-600 h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Student ID: {student.studentId}</p>
                          <p className="text-sm text-gray-500">
                            Grade: {student.grade} | Class: {student.class || 'Not assigned'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={student.isActive ? "default" : "secondary"}>
                          {student.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Teachers</CardTitle>
            </CardHeader>
            <CardContent>
              {teachersLoading ? (
                <div>Loading teachers...</div>
              ) : teachers && teachers.length > 0 ? (
                <div className="space-y-4">
                  {teachers.map((teacher: any) => (
                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-secondary-50 p-2 rounded-lg">
                          <UserCheck className="text-secondary-600 h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Employee ID: {teacher.employeeId}</p>
                          <p className="text-sm text-gray-500">
                            Subjects: {teacher.subjects?.join(', ') || 'Not assigned'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qualifications: {teacher.qualifications || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={teacher.isActive ? "default" : "secondary"}>
                          {teacher.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No teachers found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {classesLoading ? (
                <div>Loading classes...</div>
              ) : classes && classes.length > 0 ? (
                <div className="space-y-4">
                  {classes.map((classItem: any) => (
                    <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-accent-50 p-2 rounded-lg">
                          <GraduationCap className="text-accent-600 h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{classItem.name}</p>
                          <p className="text-sm text-gray-500">
                            Grade: {classItem.grade} | Section: {classItem.section || 'Default'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Max Students: {classItem.maxStudents}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={classItem.isActive ? "default" : "secondary"}>
                          {classItem.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No classes found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              {subjectsLoading ? (
                <div>Loading subjects...</div>
              ) : subjects && subjects.length > 0 ? (
                <div className="space-y-4">
                  {subjects.map((subject: any) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="bg-yellow-50 p-2 rounded-lg">
                          <BookOpen className="text-yellow-600 h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{subject.name}</p>
                          <p className="text-sm text-gray-500">
                            Code: {subject.code} | Grade: {subject.grade || 'All'}
                          </p>
                          <p className="text-xs text-gray-400">
                            Curriculum: {subject.curriculum || 'Standard'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={subject.isActive ? "default" : "secondary"}>
                          {subject.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No subjects found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
