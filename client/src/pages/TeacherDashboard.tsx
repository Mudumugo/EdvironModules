import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Layout from "@/components/Layout";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Plus,
  Users,
  Video,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Play,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Award,
  Target
} from "lucide-react";

// Schema definitions
const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  subject: z.string().min(1, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  description: z.string().optional(),
  objectives: z.string().min(1, "Learning objectives are required"),
  scheduledDate: z.string().min(1, "Date is required"),
  duration: z.string().min(1, "Duration is required"),
  materials: z.string().optional(),
});

const assignmentSchema = z.object({
  title: z.string().min(1, "Assignment title is required"),
  subject: z.string().min(1, "Subject is required"),
  classId: z.string().min(1, "Class is required"),
  description: z.string().min(1, "Description is required"),
  instructions: z.string().min(1, "Instructions are required"),
  dueDate: z.string().min(1, "Due date is required"),
  totalPoints: z.string().min(1, "Total points is required"),
  assignmentType: z.string().min(1, "Assignment type is required"),
});

const liveSessionSchema = z.object({
  title: z.string().min(1, "Session title is required"),
  classId: z.string().min(1, "Class is required"),
  scheduledTime: z.string().min(1, "Scheduled time is required"),
  duration: z.string().min(1, "Duration is required"),
  sessionType: z.string().min(1, "Session type is required"),
  description: z.string().optional(),
});

export default function TeacherDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Dialog states
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isLiveSessionDialogOpen, setIsLiveSessionDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState("all");

  // Forms
  const lessonForm = useForm({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      title: "",
      subject: "",
      classId: "",
      description: "",
      objectives: "",
      scheduledDate: "",
      duration: "60",
      materials: "",
    },
  });

  const assignmentForm = useForm({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      subject: "",
      classId: "",
      description: "",
      instructions: "",
      dueDate: "",
      totalPoints: "100",
      assignmentType: "homework",
    },
  });

  const liveSessionForm = useForm({
    resolver: zodResolver(liveSessionSchema),
    defaultValues: {
      title: "",
      classId: "",
      scheduledTime: "",
      duration: "60",
      sessionType: "lecture",
      description: "",
    },
  });

  // Fetch teacher's classes
  const { data: teacherClasses = [], isLoading: classesLoading } = useQuery({
    queryKey: ['/api/teacher/classes'],
    queryFn: () => apiRequest('GET', '/api/teacher/classes').then(res => res.json())
  });

  // Fetch lessons
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ['/api/teacher/lessons'],
    queryFn: () => apiRequest('GET', '/api/teacher/lessons').then(res => res.json())
  });

  // Fetch assignments
  const { data: assignments = [], isLoading: assignmentsLoading } = useQuery({
    queryKey: ['/api/teacher/assignments'],
    queryFn: () => apiRequest('GET', '/api/teacher/assignments').then(res => res.json())
  });

  // Fetch live sessions
  const { data: liveSessions = [], isLoading: liveSessionsLoading } = useQuery({
    queryKey: ['/api/teacher/live-sessions'],
    queryFn: () => apiRequest('GET', '/api/teacher/live-sessions').then(res => res.json())
  });

  // Fetch attendance data
  const { data: attendanceData = [], isLoading: attendanceLoading } = useQuery({
    queryKey: ['/api/teacher/attendance'],
    queryFn: () => apiRequest('GET', '/api/teacher/attendance').then(res => res.json())
  });

  // Fetch teacher analytics
  const { data: teacherAnalytics = {}, isLoading: analyticsLoading } = useQuery({
    queryKey: ['/api/teacher/analytics'],
    queryFn: () => apiRequest('GET', '/api/teacher/analytics').then(res => res.json())
  });

  // Mutations
  const createLessonMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/teacher/lessons', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/lessons'] });
      setIsLessonDialogOpen(false);
      lessonForm.reset();
      toast({
        title: "Lesson Created",
        description: "Lesson plan has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/teacher/assignments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/assignments'] });
      setIsAssignmentDialogOpen(false);
      assignmentForm.reset();
      toast({
        title: "Assignment Created",
        description: "Assignment has been successfully created and distributed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create assignment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createLiveSessionMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/teacher/live-sessions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/live-sessions'] });
      setIsLiveSessionDialogOpen(false);
      liveSessionForm.reset();
      toast({
        title: "Live Session Scheduled",
        description: "Live session has been scheduled and students will be notified.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule live session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const markAttendanceMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/teacher/attendance', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/attendance'] });
      toast({
        title: "Attendance Updated",
        description: "Student attendance has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Form submission handlers
  const onLessonSubmit = (data: any) => {
    createLessonMutation.mutate(data);
  };

  const onAssignmentSubmit = (data: any) => {
    createAssignmentMutation.mutate(data);
  };

  const onLiveSessionSubmit = (data: any) => {
    createLiveSessionMutation.mutate(data);
  };

  const handleAttendanceUpdate = (studentId: string, status: string) => {
    markAttendanceMutation.mutate({
      studentId,
      status,
      date: new Date().toISOString().split('T')[0],
      classId: selectedClass !== "all" ? selectedClass : teacherClasses[0]?.id
    });
  };

  // Filter data by selected class
  const filteredLessons = selectedClass === "all" ? lessons : lessons.filter((l: any) => l.classId === selectedClass);
  const filteredAssignments = selectedClass === "all" ? assignments : assignments.filter((a: any) => a.classId === selectedClass);
  const filteredLiveSessions = selectedClass === "all" ? liveSessions : liveSessions.filter((s: any) => s.classId === selectedClass);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage lessons, assignments, and track student progress</p>
          </div>
          
          {/* Class Filter */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="class-filter">Class:</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {teacherClasses.map((cls: any) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} - {cls.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Classes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{teacherAnalytics.totalClasses || teacherClasses.length}</div>
              <p className="text-xs text-muted-foreground">Active this semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-blue-600">{teacherAnalytics.totalStudents || 89}</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Assignments Due</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{teacherAnalytics.assignmentsDue || 7}</div>
              <p className="text-xs text-muted-foreground">Need grading</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Avg. Attendance</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-600">{teacherAnalytics.averageAttendance || 94}%</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="lessons" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="lessons" className="text-xs sm:text-sm">Lessons</TabsTrigger>
            <TabsTrigger value="assignments" className="text-xs sm:text-sm">Assignments</TabsTrigger>
            <TabsTrigger value="live-sessions" className="text-xs sm:text-sm">Live Sessions</TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold">Lesson Plans</h2>
              <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Lesson
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Lesson</DialogTitle>
                    <DialogDescription>
                      Create a detailed lesson plan for your class
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...lessonForm}>
                    <form onSubmit={lessonForm.handleSubmit(onLessonSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={lessonForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Lesson Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Introduction to Algebra" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={lessonForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Mathematics" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={lessonForm.control}
                        name="classId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {teacherClasses.map((cls: any) => (
                                  <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name} - {cls.subject}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={lessonForm.control}
                        name="objectives"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Learning Objectives</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Students will be able to..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={lessonForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Lesson overview and activities" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={lessonForm.control}
                          name="scheduledDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Date</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={lessonForm.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="60" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={lessonForm.control}
                        name="materials"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Required Materials</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Textbook, calculator, worksheets..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsLessonDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createLessonMutation.isPending}>
                          {createLessonMutation.isPending ? "Creating..." : "Create Lesson"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Lessons List */}
            <div className="grid gap-4">
              {lessonsLoading ? (
                <div className="text-center py-8">Loading lessons...</div>
              ) : filteredLessons.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No lessons found. Create your first lesson plan to get started.
                </div>
              ) : (
                filteredLessons.map((lesson: any) => (
                  <Card key={lesson.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <CardTitle className="text-base sm:text-lg">{lesson.title}</CardTitle>
                          <CardDescription>
                            {lesson.subject} • {lesson.className} • {new Date(lesson.scheduledDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={lesson.status === 'completed' ? 'default' : 'secondary'}>
                            {lesson.status || 'Planned'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm">Learning Objectives:</h4>
                          <p className="text-sm text-muted-foreground">{lesson.objectives}</p>
                        </div>
                        {lesson.description && (
                          <div>
                            <h4 className="font-medium text-sm">Description:</h4>
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {lesson.duration} minutes
                          </span>
                          {lesson.materials && (
                            <span className="flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              Materials required
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold">Assignments</h2>
              <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assignment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Create New Assignment</DialogTitle>
                    <DialogDescription>
                      Create and distribute an assignment to your students
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...assignmentForm}>
                    <form onSubmit={assignmentForm.handleSubmit(onAssignmentSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={assignmentForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Assignment Title</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Chapter 5 Homework" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={assignmentForm.control}
                          name="assignmentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="homework">Homework</SelectItem>
                                  <SelectItem value="quiz">Quiz</SelectItem>
                                  <SelectItem value="project">Project</SelectItem>
                                  <SelectItem value="exam">Exam</SelectItem>
                                  <SelectItem value="lab">Lab Report</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={assignmentForm.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Mathematics" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={assignmentForm.control}
                          name="classId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select class" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {teacherClasses.map((cls: any) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                      {cls.name} - {cls.subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={assignmentForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Assignment overview and context" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={assignmentForm.control}
                        name="instructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Detailed instructions for students" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={assignmentForm.control}
                          name="dueDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={assignmentForm.control}
                          name="totalPoints"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Points</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="100" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createAssignmentMutation.isPending}>
                          {createAssignmentMutation.isPending ? "Creating..." : "Create & Distribute"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Assignments List */}
            <div className="grid gap-4">
              {assignmentsLoading ? (
                <div className="text-center py-8">Loading assignments...</div>
              ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No assignments found. Create your first assignment to get started.
                </div>
              ) : (
                filteredAssignments.map((assignment: any) => (
                  <Card key={assignment.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <CardTitle className="text-base sm:text-lg">{assignment.title}</CardTitle>
                          <CardDescription>
                            {assignment.subject} • {assignment.className} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={assignment.type === 'exam' ? 'destructive' : 'secondary'}>
                            {assignment.assignmentType || 'Homework'}
                          </Badge>
                          <Badge variant="outline">{assignment.totalPoints} pts</Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Submissions
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {assignment.submissionsReceived || 0}/{assignment.totalStudents || 25} submitted
                          </span>
                          <span className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {assignment.graded || 0} graded
                          </span>
                          <span className="flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            Avg: {assignment.averageScore || 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Live Sessions Tab */}
          <TabsContent value="live-sessions" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold">Live Sessions</h2>
              <Dialog open={isLiveSessionDialogOpen} onOpenChange={setIsLiveSessionDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Video className="h-4 w-4 mr-2" />
                    Schedule Live Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Live Session</DialogTitle>
                    <DialogDescription>
                      Create a live video session for your class
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...liveSessionForm}>
                    <form onSubmit={liveSessionForm.handleSubmit(onLiveSessionSubmit)} className="space-y-4">
                      <FormField
                        control={liveSessionForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Title</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Review Session for Chapter 5" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={liveSessionForm.control}
                        name="classId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Class</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {teacherClasses.map((cls: any) => (
                                  <SelectItem key={cls.id} value={cls.id}>
                                    {cls.name} - {cls.subject}
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
                          control={liveSessionForm.control}
                          name="scheduledTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Scheduled Time</FormLabel>
                              <FormControl>
                                <Input {...field} type="datetime-local" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={liveSessionForm.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (minutes)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="60" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={liveSessionForm.control}
                        name="sessionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Session Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lecture">Lecture</SelectItem>
                                <SelectItem value="review">Review Session</SelectItem>
                                <SelectItem value="office-hours">Office Hours</SelectItem>
                                <SelectItem value="lab">Lab Session</SelectItem>
                                <SelectItem value="presentation">Student Presentations</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={liveSessionForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Session agenda and topics" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => setIsLiveSessionDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={createLiveSessionMutation.isPending}>
                          {createLiveSessionMutation.isPending ? "Scheduling..." : "Schedule Session"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Live Sessions List */}
            <div className="grid gap-4">
              {liveSessionsLoading ? (
                <div className="text-center py-8">Loading live sessions...</div>
              ) : filteredLiveSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No live sessions scheduled. Schedule your first session to get started.
                </div>
              ) : (
                filteredLiveSessions.map((session: any) => (
                  <Card key={session.id}>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                          <CardTitle className="text-base sm:text-lg">{session.title}</CardTitle>
                          <CardDescription>
                            {session.className} • {new Date(session.scheduledTime).toLocaleString()}
                          </CardDescription>
                        </div>
                        <div className="flex space-x-2">
                          <Badge variant={session.status === 'live' ? 'destructive' : session.status === 'completed' ? 'default' : 'secondary'}>
                            {session.status || 'Scheduled'}
                          </Badge>
                          {session.status === 'scheduled' && (
                            <Button size="sm">
                              <Play className="h-4 w-4 mr-1" />
                              Start Session
                            </Button>
                          )}
                          {session.status === 'live' && (
                            <Button variant="destructive" size="sm">
                              <Video className="h-4 w-4 mr-1" />
                              Join Live
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {session.description && (
                          <p className="text-sm text-muted-foreground">{session.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {session.duration} minutes
                          </span>
                          <span className="flex items-center">
                            <Video className="h-4 w-4 mr-1" />
                            {session.sessionType || 'Lecture'}
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {session.attendees || 0} expected
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <h2 className="text-lg font-semibold">Attendance Tracking</h2>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {attendanceLoading ? (
              <div className="text-center py-8">Loading attendance data...</div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Today's Attendance</CardTitle>
                  <CardDescription>
                    Mark attendance for your current class session
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceData.map((student: any) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.firstName} {student.lastName}
                          </TableCell>
                          <TableCell>{student.studentId}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                student.attendanceStatus === 'present' ? 'default' :
                                student.attendanceStatus === 'late' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {student.attendanceStatus || 'Not marked'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant={student.attendanceStatus === 'present' ? 'default' : 'outline'}
                                onClick={() => handleAttendanceUpdate(student.id, 'present')}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={student.attendanceStatus === 'late' ? 'secondary' : 'outline'}
                                onClick={() => handleAttendanceUpdate(student.id, 'late')}
                              >
                                <Clock className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant={student.attendanceStatus === 'absent' ? 'destructive' : 'outline'}
                                onClick={() => handleAttendanceUpdate(student.id, 'absent')}
                              >
                                <AlertCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <h2 className="text-lg font-semibold">Teaching Analytics</h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Class Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacherClasses.map((cls: any) => (
                      <div key={cls.id} className="space-y-2 p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">{cls.name}</div>
                            <div className="text-xs text-muted-foreground">{cls.subject}</div>
                          </div>
                          <span className="text-sm font-bold">{cls.averageGrade || 85}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${cls.averageGrade || 85}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{cls.studentsEnrolled || 25} students</span>
                          <span>{cls.attendanceRate || 94}% attendance</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Teaching Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{teacherAnalytics.lessonsCompleted || 43}</div>
                        <div className="text-xs text-muted-foreground">Lessons Completed</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{teacherAnalytics.assignmentsCreated || 28}</div>
                        <div className="text-xs text-muted-foreground">Assignments Created</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{teacherAnalytics.liveSessionsHeld || 15}</div>
                        <div className="text-xs text-muted-foreground">Live Sessions</div>
                      </div>
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{teacherAnalytics.studentRating || 4.7}</div>
                        <div className="text-xs text-muted-foreground">Student Rating</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}