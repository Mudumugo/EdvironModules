import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  BookOpen,
  Plus,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  FileText,
  Video,
  MessageSquare,
  Star,
  Award,
  Target,
  BarChart3,
  Edit,
  Trash2,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  PlayCircle
} from "lucide-react";

// Form schemas
const classSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  studentLimit: z.string().min(1, "Student limit is required"),
});

const resourceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  url: z.string().optional(),
});

export default function TutorHub() {
  const { toast } = useToast();
  
  // Dialog states
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isResourceDialogOpen, setIsResourceDialogOpen] = useState(false);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  // Sample data for demonstration
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: "Advanced Calculus",
      subject: "Mathematics",
      description: "Differential and integral calculus concepts",
      startTime: "2024-01-20T10:00",
      endTime: "2024-01-20T11:30",
      location: "Room 201",
      studentLimit: 15,
      enrolled: 12,
      status: "scheduled"
    },
    {
      id: 2,
      title: "Physics Lab Session",
      subject: "Physics", 
      description: "Hands-on experiments with mechanics",
      startTime: "2024-01-22T14:00",
      endTime: "2024-01-22T16:00",
      location: "Physics Lab",
      studentLimit: 10,
      enrolled: 8,
      status: "scheduled"
    },
    {
      id: 3,
      title: "Chemistry Review",
      subject: "Chemistry",
      description: "Organic chemistry fundamentals",
      startTime: "2024-01-18T09:00",
      endTime: "2024-01-18T10:30",
      location: "Online",
      studentLimit: 20,
      enrolled: 18,
      status: "completed"
    }
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Emma Wilson",
      grade: "Grade 11",
      subjects: ["Mathematics", "Physics"],
      progress: 92,
      attendance: 95,
      lastActive: "2024-01-19",
      performance: "excellent"
    },
    {
      id: 2,
      name: "James Chen",
      grade: "Grade 10", 
      subjects: ["Chemistry", "Mathematics"],
      progress: 87,
      attendance: 88,
      lastActive: "2024-01-19",
      performance: "good"
    },
    {
      id: 3,
      name: "Sofia Rodriguez",
      grade: "Grade 12",
      subjects: ["Physics", "Chemistry"],
      progress: 94,
      attendance: 97,
      lastActive: "2024-01-18",
      performance: "excellent"
    },
    {
      id: 4,
      name: "Marcus Johnson",
      grade: "Grade 9",
      subjects: ["Mathematics"],
      progress: 78,
      attendance: 82,
      lastActive: "2024-01-17",
      performance: "satisfactory"
    }
  ]);

  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Calculus Study Guide",
      type: "PDF",
      subject: "Mathematics",
      description: "Comprehensive guide covering derivatives and integrals",
      downloads: 45,
      created: "2024-01-15"
    },
    {
      id: 2,
      title: "Physics Experiment Videos",
      type: "Video",
      subject: "Physics",
      description: "Step-by-step laboratory procedures",
      downloads: 32,
      created: "2024-01-12"
    },
    {
      id: 3,
      title: "Chemistry Practice Problems",
      type: "Worksheet",
      subject: "Chemistry",
      description: "Practice exercises with solutions",
      downloads: 28,
      created: "2024-01-10"
    }
  ]);

  // Form handlers
  const classForm = useForm({
    resolver: zodResolver(classSchema),
    defaultValues: {
      title: "",
      subject: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      studentLimit: "",
    },
  });

  const resourceForm = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      type: "",
      subject: "",
      description: "",
      url: "",
    },
  });

  const handleCreateClass = (data: z.infer<typeof classSchema>) => {
    const newClass = {
      ...data,
      id: classes.length + 1,
      studentLimit: parseInt(data.studentLimit),
      enrolled: 0,
      status: "scheduled",
      description: data.description || "",
      location: data.location || ""
    };
    setClasses([...classes, newClass]);
    setIsClassDialogOpen(false);
    classForm.reset();
    toast({
      title: "Success",
      description: "Class scheduled successfully",
    });
  };

  const handleCreateResource = (data: z.infer<typeof resourceSchema>) => {
    const newResource = {
      ...data,
      id: resources.length + 1,
      downloads: 0,
      created: new Date().toISOString().split('T')[0],
      description: data.description || ""
    };
    setResources([...resources, newResource]);
    setIsResourceDialogOpen(false);
    resourceForm.reset();
    toast({
      title: "Success",
      description: "Resource created successfully",
    });
  };

  // Calculate statistics
  const totalStudents = students.length;
  const upcomingClasses = classes.filter(c => new Date(c.startTime) > new Date());
  const completedClasses = classes.filter(c => c.status === "completed");
  const averageProgress = Math.round(students.reduce((acc, student) => acc + student.progress, 0) / students.length);

  // Filter functions
  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = searchTerm === "" || 
      classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || classItem.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchTerm === "" || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Tutor Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Personalized workspace for tutors: schedule classes, track learner progress, and share resources
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isResourceDialogOpen} onOpenChange={setIsResourceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Learning Resource</DialogTitle>
              </DialogHeader>
              <Form {...resourceForm}>
                <form onSubmit={resourceForm.handleSubmit(handleCreateResource)} className="space-y-4">
                  <FormField
                    control={resourceForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resource Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter resource title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={resourceForm.control}
                      name="type"
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
                              <SelectItem value="PDF">PDF Document</SelectItem>
                              <SelectItem value="Video">Video</SelectItem>
                              <SelectItem value="Worksheet">Worksheet</SelectItem>
                              <SelectItem value="Presentation">Presentation</SelectItem>
                              <SelectItem value="Quiz">Quiz</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={resourceForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="History">History</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={resourceForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe the resource..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resourceForm.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Resource
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Class</DialogTitle>
              </DialogHeader>
              <Form {...classForm}>
                <form onSubmit={classForm.handleSubmit(handleCreateClass)} className="space-y-4">
                  <FormField
                    control={classForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter class title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={classForm.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select subject" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Mathematics">Mathematics</SelectItem>
                              <SelectItem value="Physics">Physics</SelectItem>
                              <SelectItem value="Chemistry">Chemistry</SelectItem>
                              <SelectItem value="Biology">Biology</SelectItem>
                              <SelectItem value="English">English</SelectItem>
                              <SelectItem value="History">History</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={classForm.control}
                      name="studentLimit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student Limit</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="Max students" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={classForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Class description..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={classForm.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="datetime-local" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={classForm.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="datetime-local" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={classForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Room 101 or Online" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Schedule Class
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Active learners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedClasses.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Average Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress}%</div>
            <p className="text-xs text-muted-foreground">Student performance</p>
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
                  placeholder="Search classes, students, resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="subject">Filter by Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredClasses.map((classItem) => (
                  <div key={classItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <Clock className="text-primary-600 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{classItem.title}</p>
                        <p className="text-sm text-gray-500">{classItem.subject}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(classItem.startTime).toLocaleString()} • {classItem.location}
                        </p>
                        <p className="text-xs text-gray-400">
                          {classItem.enrolled}/{classItem.studentLimit} students enrolled
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={classItem.status === "completed" ? "default" : "secondary"}>
                        {classItem.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredClasses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                    <p>Try adjusting your search or create a new class.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        <GraduationCap className="text-primary-600 h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.grade}</p>
                        <p className="text-xs text-gray-400">
                          Subjects: {student.subjects.join(", ")}
                        </p>
                        <p className="text-xs text-gray-400">
                          Last active: {student.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Progress: {student.progress}%</p>
                        <Progress value={student.progress} className="w-20 h-2" />
                        <p className="text-xs text-gray-500 mt-1">Attendance: {student.attendance}%</p>
                      </div>
                      <Badge variant={
                        student.performance === "excellent" ? "default" :
                        student.performance === "good" ? "secondary" : "outline"
                      }>
                        {student.performance}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                    <p>Students will appear here once they enroll in your classes.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="bg-primary-50 p-2 rounded-lg">
                        {resource.type === "Video" ? (
                          <Video className="text-primary-600 h-4 w-4" />
                        ) : resource.type === "PDF" ? (
                          <FileText className="text-primary-600 h-4 w-4" />
                        ) : (
                          <BookOpen className="text-primary-600 h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{resource.title}</p>
                        <p className="text-sm text-gray-500">{resource.subject} • {resource.type}</p>
                        <p className="text-xs text-gray-400">{resource.description}</p>
                        <p className="text-xs text-gray-400">
                          Created: {resource.created} • Downloads: {resource.downloads}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredResources.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                    <p>Create your first learning resource to get started.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Excellent Performance</span>
                    <span className="text-sm text-gray-500">
                      {students.filter(s => s.performance === "excellent").length} students
                    </span>
                  </div>
                  <Progress value={students.filter(s => s.performance === "excellent").length / students.length * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Good Performance</span>
                    <span className="text-sm text-gray-500">
                      {students.filter(s => s.performance === "good").length} students
                    </span>
                  </div>
                  <Progress value={students.filter(s => s.performance === "good").length / students.length * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Needs Improvement</span>
                    <span className="text-sm text-gray-500">
                      {students.filter(s => s.performance === "satisfactory").length} students
                    </span>
                  </div>
                  <Progress value={students.filter(s => s.performance === "satisfactory").length / students.length * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Class Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Total Classes</span>
                    </div>
                    <span className="text-xl font-bold">{classes.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <span className="text-xl font-bold">{completedClasses.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">Upcoming</span>
                    </div>
                    <span className="text-xl font-bold">{upcomingClasses.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-purple-500" />
                      <span className="text-sm font-medium">Avg. Enrollment</span>
                    </div>
                    <span className="text-xl font-bold">
                      {Math.round(classes.reduce((acc, c) => acc + (c.enrolled || 0), 0) / classes.length)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <span>Chemistry Review class completed with 18 students</span>
                  <span className="text-gray-400 text-xs ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-blue-100 p-1 rounded-full">
                    <Upload className="h-3 w-3 text-blue-600" />
                  </div>
                  <span>New resource "Physics Experiment Videos" uploaded</span>
                  <span className="text-gray-400 text-xs ml-auto">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="bg-orange-100 p-1 rounded-full">
                    <Calendar className="h-3 w-3 text-orange-600" />
                  </div>
                  <span>Advanced Calculus class scheduled for tomorrow</span>
                  <span className="text-gray-400 text-xs ml-auto">2 days ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}