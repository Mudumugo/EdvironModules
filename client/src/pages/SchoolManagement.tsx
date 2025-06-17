import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  GraduationCap,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
  Building2
} from "lucide-react";

// Form schemas
const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  grade: z.string().min(1, "Grade is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  parentEmail: z.string().email("Invalid parent email"),
  parentPhone: z.string().min(10, "Phone number must be at least 10 digits"),
});

const teacherSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  department: z.string().min(1, "Department is required"),
});

const classSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  subject: z.string().min(1, "Subject is required"),
  teacherId: z.string().min(1, "Teacher is required"),
  grade: z.string().min(1, "Grade is required"),
  capacity: z.string().min(1, "Capacity is required"),
  room: z.string().min(1, "Room is required"),
});

export default function SchoolManagement() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [isStudentDialogOpen, setIsStudentDialogOpen] = useState(false);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);

  // Sample data for demonstration
  const [students, setStudents] = useState([
    {
      id: 1,
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      grade: "9",
      dateOfBirth: "2008-05-15",
      parentEmail: "parent@email.com",
      parentPhone: "555-0123"
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      grade: "10",
      dateOfBirth: "2007-08-22",
      parentEmail: "parent2@email.com",
      parentPhone: "555-0124"
    }
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      firstName: "Dr. Michael",
      lastName: "Brown",
      email: "m.brown@demouniversity.edu",
      subject: "Mathematics",
      department: "Science",
      phone: "555-0125"
    },
    {
      id: 2,
      firstName: "Ms. Emily",
      lastName: "Davis",
      email: "e.davis@demouniversity.edu",
      subject: "English Literature",
      department: "Humanities",
      phone: "555-0126"
    }
  ]);

  const [classes, setClasses] = useState([
    {
      id: 1,
      name: "Algebra II",
      subject: "Mathematics",
      teacherId: 1,
      teacherName: "Dr. Michael Brown",
      grade: "9",
      capacity: 25,
      room: "Math-101"
    },
    {
      id: 2,
      name: "World Literature",
      subject: "English",
      teacherId: 2,
      teacherName: "Ms. Emily Davis",
      grade: "10",
      capacity: 20,
      room: "Eng-205"
    }
  ]);

  const studentsLoading = false;
  const teachersLoading = false;
  const classesLoading = false;
  const studentsError = null;
  const teachersError = null;
  const classesError = null;

  // Forms
  const studentForm = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      grade: "",
      dateOfBirth: "",
      parentEmail: "",
      parentPhone: "",
    },
  });

  const teacherForm = useForm({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      phone: "",
      department: "",
    },
  });

  const classForm = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: "",
      subject: "",
      teacherId: "",
      grade: "",
      capacity: "",
      room: "",
    },
  });

  // Local state mutations for demonstration
  const handleCreateStudent = (data: z.infer<typeof studentSchema>) => {
    const newStudent = {
      ...data,
      id: students.length + 1,
    };
    setStudents([...students, newStudent]);
    setIsStudentDialogOpen(false);
    studentForm.reset();
    toast({
      title: "Success",
      description: "Student created successfully",
    });
  };

  const handleCreateTeacher = (data: z.infer<typeof teacherSchema>) => {
    const newTeacher = {
      ...data,
      id: teachers.length + 1,
    };
    setTeachers([...teachers, newTeacher]);
    setIsTeacherDialogOpen(false);
    teacherForm.reset();
    toast({
      title: "Success",
      description: "Teacher created successfully",
    });
  };

  const handleCreateClass = (data: z.infer<typeof classSchema>) => {
    const teacher = teachers.find(t => t.id === parseInt(data.teacherId));
    const newClass = {
      ...data,
      id: classes.length + 1,
      capacity: parseInt(data.capacity),
      teacherId: parseInt(data.teacherId),
      teacherName: teacher ? `${teacher.firstName} ${teacher.lastName}` : 'TBD',
    };
    setClasses([...classes, newClass]);
    setIsClassDialogOpen(false);
    classForm.reset();
    toast({
      title: "Success",
      description: "Class created successfully",
    });
  };

  // Filter functions
  const filteredStudents = Array.isArray(students) ? students.filter((student: any) => {
    const matchesSearch = searchTerm === "" || 
      student.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === "" || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  }) : [];

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            School Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage students, teachers, and classes for Demo University
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
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
              {studentsLoading ? "..." : Array.isArray(students) ? students.length : 0}
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
              {teachersLoading ? "..." : Array.isArray(teachers) ? teachers.length : 0}
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
              {classesLoading ? "..." : Array.isArray(classes) ? classes.length : 0}
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
              {studentsLoading ? "..." : Array.isArray(students) ? 
                new Set(students.map((s: any) => s.grade)).size : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search students, teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="grade">Filter by Grade</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  <SelectItem value="1">Grade 1</SelectItem>
                  <SelectItem value="2">Grade 2</SelectItem>
                  <SelectItem value="3">Grade 3</SelectItem>
                  <SelectItem value="4">Grade 4</SelectItem>
                  <SelectItem value="5">Grade 5</SelectItem>
                  <SelectItem value="6">Grade 6</SelectItem>
                  <SelectItem value="7">Grade 7</SelectItem>
                  <SelectItem value="8">Grade 8</SelectItem>
                  <SelectItem value="9">Grade 9</SelectItem>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="students" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="teachers" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Teachers
          </TabsTrigger>
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Classes
          </TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Students</h2>
            <Dialog open={isStudentDialogOpen} onOpenChange={setIsStudentDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                </DialogHeader>
                <Form {...studentForm}>
                  <form onSubmit={studentForm.handleSubmit(handleCreateStudent)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={studentForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={studentForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={studentForm.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                                  <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={studentForm.control}
                        name="dateOfBirth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={studentForm.control}
                      name="parentEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={studentForm.control}
                      name="parentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Student
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Students List</CardTitle>
            </CardHeader>
            <CardContent>
              {studentsLoading ? (
                <div className="text-center py-8">Loading students...</div>
              ) : studentsError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading students. Please ensure you are logged in.
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found. Add your first student to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Parent Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student: any) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Grade {student.grade}</Badge>
                        </TableCell>
                        <TableCell>{student.parentEmail}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teachers Tab */}
        <TabsContent value="teachers" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Teachers</h2>
            <Dialog open={isTeacherDialogOpen} onOpenChange={setIsTeacherDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Teacher
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Teacher</DialogTitle>
                </DialogHeader>
                <Form {...teacherForm}>
                  <form onSubmit={teacherForm.handleSubmit(handleCreateTeacher)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={teacherForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={teacherForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={teacherForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teacherForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teacherForm.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={teacherForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      Create Teacher
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Teachers List</CardTitle>
            </CardHeader>
            <CardContent>
              {teachersLoading ? (
                <div className="text-center py-8">Loading teachers...</div>
              ) : teachersError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading teachers. Please ensure you are logged in.
                </div>
              ) : !Array.isArray(teachers) || teachers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teachers found. Add your first teacher to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teachers.map((teacher: any) => (
                      <TableRow key={teacher.id}>
                        <TableCell className="font-medium">
                          {teacher.firstName} {teacher.lastName}
                        </TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{teacher.subject}</Badge>
                        </TableCell>
                        <TableCell>{teacher.department}</TableCell>
                        <TableCell>{teacher.phone}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Classes Tab */}
        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Classes</h2>
            <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Class
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                <Form {...classForm}>
                  <form onSubmit={classForm.handleSubmit(handleCreateClass)} className="space-y-4">
                    <FormField
                      control={classForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={classForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={classForm.control}
                      name="teacherId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teacher</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select teacher" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.isArray(teachers) && teachers.map((teacher: any) => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                  {teacher.firstName} {teacher.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={classForm.control}
                        name="grade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Grade</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select grade" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[1,2,3,4,5,6,7,8,9,10,11,12].map(grade => (
                                  <SelectItem key={grade} value={grade.toString()}>Grade {grade}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={classForm.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={classForm.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Room</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createClass.isPending}>
                      {createClass.isPending ? "Creating..." : "Create Class"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Classes List</CardTitle>
            </CardHeader>
            <CardContent>
              {classesLoading ? (
                <div className="text-center py-8">Loading classes...</div>
              ) : classesError ? (
                <div className="text-center py-8 text-red-500">
                  Error loading classes. Please ensure you are logged in.
                </div>
              ) : !Array.isArray(classes) || classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No classes found. Add your first class to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Teacher</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((classItem: any) => (
                      <TableRow key={classItem.id}>
                        <TableCell className="font-medium">{classItem.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{classItem.subject}</Badge>
                        </TableCell>
                        <TableCell>{classItem.teacherName || 'TBD'}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Grade {classItem.grade}</Badge>
                        </TableCell>
                        <TableCell>{classItem.room}</TableCell>
                        <TableCell>{classItem.capacity}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}