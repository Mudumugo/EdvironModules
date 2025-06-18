import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { GraduationCap, Plus, Upload } from "lucide-react";

import { TutorStatistics } from "@/components/tutor/TutorStatistics";
import { ClassManagement } from "@/components/tutor/ClassManagement";
import { StudentProgress } from "@/components/tutor/StudentProgress";
import { ResourceLibrary } from "@/components/tutor/ResourceLibrary";
import { TutorSearchAndFilter } from "@/components/tutor/TutorSearchAndFilter";

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

function TutorHub() {
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
      startDate: "2024-01-20",
      endDate: "2024-01-20",
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
      startDate: "2024-01-22",
      endDate: "2024-01-22",
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
      startDate: "2024-01-18",
      endDate: "2024-01-18",
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
      location: data.location || "",
      startDate: data.startTime.split('T')[0],
      endDate: data.endTime.split('T')[0],
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
                            <Input {...field} type="number" placeholder="25" />
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
                          <Textarea {...field} placeholder="Describe the class..." rows={3} />
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
                          <Input {...field} placeholder="Room 201 or Online" />
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

      {/* Statistics */}
      <TutorStatistics
        totalStudents={totalStudents}
        upcomingClasses={upcomingClasses}
        completedClasses={completedClasses}
        averageProgress={averageProgress}
      />

      {/* Search and Filter */}
      <TutorSearchAndFilter
        searchTerm={searchTerm}
        selectedSubject={selectedSubject}
        onSearchChange={setSearchTerm}
        onSubjectChange={setSelectedSubject}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="classes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="classes">
          <ClassManagement
            classes={classes}
            filteredClasses={filteredClasses}
          />
        </TabsContent>

        <TabsContent value="students">
          <StudentProgress
            students={students}
            filteredStudents={filteredStudents}
          />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceLibrary
            resources={resources}
            filteredResources={filteredResources}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default TutorHub;