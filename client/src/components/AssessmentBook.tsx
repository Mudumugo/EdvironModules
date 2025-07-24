import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  BookOpen, 
  User, 
  FileText, 
  BarChart3, 
  Save,
  Plus,
  Calendar,
  Trophy,
  Target,
  Star,
  CheckCircle,
  BookUser,
  Award,
  Printer,
  GraduationCap,
  List,
  Edit
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import ReportCard from "./ReportCard";
import SubjectManager from "./SubjectManager";

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  admissionNumber: string;
  upi: string;
  gradeLevel: string;
  className: string;
  profileImageUrl?: string;
  age: number;
}

interface Subject {
  id: number;
  name: string;
  code: string;
  category: string;
  strands: string[];
}

interface AssessmentEntry {
  id: string;
  strand: string;
  subStrand?: string;
  performanceLevel: string;
  score: number;
  teacherComment?: string;
}

interface BehaviorReport {
  id: string;
  respectForSelf: boolean;
  respectForOthers: boolean;
  respectForProperty: boolean;
  respectForEnvironment: boolean;
  teacherComments?: string;
}

const performanceLevels = [
  { value: "EE", label: "EE - Exceeds Expectations", score: 4, color: "bg-green-500" },
  { value: "ME", label: "ME - Meets Expectations", score: 3, color: "bg-blue-500" },
  { value: "AE", label: "AE - Approaches Expectations", score: 2, color: "bg-yellow-500" },
  { value: "BE", label: "BE - Below Expectations", score: 1, color: "bg-red-500" },
];

export default function AssessmentBook() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTerm, setSelectedTerm] = useState("term2");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [academicYear] = useState("2025");
  const [showReportCard, setShowReportCard] = useState(false);

  // Fetch students for the teacher
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/assessment-book/students"],
    enabled: user?.role === "teacher",
    retry: false,
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/assessment-book/subjects", "Grade 6"],
    queryFn: async () => {
      const response = await fetch("/api/assessment-book/subjects?gradeLevel=Grade 6");
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json();
    },
    enabled: !!user,
    retry: false,
  });

  // Fetch assessment book data
  const { data: assessmentBook } = useQuery<any>({
    queryKey: ["/api/assessment-book", selectedStudent?.id, selectedSubject?.id, selectedTerm],
    queryFn: async () => {
      const response = await fetch(`/api/assessment-book/${selectedStudent?.id}/${selectedSubject?.id}/${selectedTerm}?academicYear=${academicYear}`);
      if (!response.ok) throw new Error('Failed to fetch assessment book');
      return response.json();
    },
    enabled: !!selectedStudent && !!selectedSubject,
  });

  // Fetch behavior report
  const { data: behaviorReport } = useQuery<BehaviorReport>({
    queryKey: ["/api/assessment-book/behavior", selectedStudent?.id, selectedTerm],
    queryFn: async () => {
      const response = await fetch(`/api/assessment-book/behavior/${selectedStudent?.id}/${selectedTerm}?academicYear=${academicYear}`);
      if (!response.ok) throw new Error('Failed to fetch behavior report');
      return response.json();
    },
    enabled: !!selectedStudent,
  });

  // Fetch assessment summary
  const { data: assessmentSummary } = useQuery<any>({
    queryKey: ["/api/assessment-book/summary", selectedStudent?.id, selectedTerm],  
    queryFn: async () => {
      const response = await fetch(`/api/assessment-book/summary/${selectedStudent?.id}/${selectedTerm}?academicYear=${academicYear}`);
      if (!response.ok) throw new Error('Failed to fetch assessment summary');
      return response.json();
    },
    enabled: !!selectedStudent,
  });

  // Mutations for saving data
  const saveAssessmentEntry = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/assessment-book/entry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save assessment entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment-book"] });
    },
  });

  const saveBehaviorReport = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/assessment-book/behavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save behavior report');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessment-book/behavior"] });
    },
  });

  // Set default selections
  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0]);
    }
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0]);
    }
  }, [students, subjects, selectedStudent, selectedSubject]);

  const getPerformanceColor = (level: string) => {
    return performanceLevels.find(p => p.value === level)?.color || "bg-gray-500";
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const calculateProgress = (entries: AssessmentEntry[]) => {
    if (!entries?.length) return 0;
    const totalScore = entries.reduce((sum, entry) => sum + entry.score, 0);
    const maxPossibleScore = entries.length * 4;
    return Math.round((totalScore / maxPossibleScore) * 100);
  };

  if (user?.role !== "teacher") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BookUser className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">Teacher Access Required</h3>
          <p className="text-gray-500">This assessment book is only available for teachers.</p>
        </div>
      </div>
    );
  }

  // Show report card if requested
  if (showReportCard && selectedStudent) {
    return (
      <ReportCard 
        student={selectedStudent}
        term={selectedTerm}
        academicYear={academicYear}
        onClose={() => setShowReportCard(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-8 h-8" />
              Grade 6 Digital Assessment Book
            </h1>
            <p className="opacity-90">Competency-Based Education Assessment</p>
          </div>
          <div className="flex items-center gap-4">
            {selectedStudent && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedStudent.profileImageUrl} />
                  <AvatarFallback className="bg-white/20 text-white">
                    {getInitials(selectedStudent.firstName, selectedStudent.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  <p className="text-sm opacity-75">UPI: {selectedStudent.upi}</p>
                </div>
              </div>
            )}
            {selectedStudent && (
              <Button 
                onClick={() => setShowReportCard(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                variant="outline"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Generate Report Card
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Student and Subject Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Student</CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedStudent?.id.toString()} 
              onValueChange={(value) => {
                const student = students.find((s: Student) => s.id.toString() === value);
                setSelectedStudent(student || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose student" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student: Student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    {student.firstName} {student.lastName} - {student.className}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Subject</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedSubject?.id.toString()}
              onValueChange={(value) => {
                const subject = subjects.find((s: Subject) => s.id.toString() === value);
                setSelectedSubject(subject || null);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject: Subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Select Term</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="term1">Term 1</SelectItem>
                <SelectItem value="term2">Term 2</SelectItem>
                <SelectItem value="term3">Term 3</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2 relative">
            <BookOpen className="w-4 h-4" />
            Subjects
            <Badge variant="secondary" className="ml-1 text-xs px-1 py-0">
              Manage
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Behavior
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Quick Actions Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Target className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => setActiveTab("subjects")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Subjects
                </Button>
                <Button 
                  onClick={() => setActiveTab("subjects")}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Quick Add CBC Subjects
                </Button>
                <Button 
                  onClick={() => setActiveTab("behavior")}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <User className="h-4 w-4 mr-2" />
                  Manage Behavior
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Tip:</strong> Use the <strong>Subjects</strong> tab to add new subjects and manage CBC learning strands.
              </p>
            </CardContent>
          </Card>

          {selectedStudent && (
            <>
              {/* Student Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name:</label>
                    <p className="font-semibold">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Level:</label>
                    <p className="font-semibold">{selectedStudent.gradeLevel}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Age:</label>
                    <p className="font-semibold">{selectedStudent.age}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">UPI:</label>
                    <p className="font-semibold">{selectedStudent.upi}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Assessments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {assessmentSummary?.subjects?.map((subject: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-gray-800 mb-2">{subject.subjectName}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Current Term:</span>
                            <Badge className={getPerformanceColor(subject.term2)}>
                              {subject.term2}
                            </Badge>
                          </div>
                          <Progress value={subject.term2 === "EE" ? 90 : subject.term2 === "ME" ? 75 : subject.term2 === "AE" ? 60 : 40} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          {/* Subject Management Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Subject & Strand Management</h2>
              <p className="text-gray-600">Manage CBC subjects and their learning strands</p>
            </div>
            <Button onClick={() => {
              // Show custom subject form
              const subjectName = prompt('Enter subject name:');
              const subjectCode = prompt('Enter subject code:');
              const category = prompt('Enter category (Core/Religious/Practical/Co-curricular):');
              
              if (subjectName && subjectCode && category) {
                fetch('/api/assessment-book/subjects', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: subjectName,
                    code: subjectCode,
                    category: category.toLowerCase(),
                    strands: []
                  })
                }).then(() => window.location.reload()).catch(console.error);
              }
            }} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </div>

          {/* Quick Add CBC Subjects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Quick Add CBC Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">Add standard CBC subjects with pre-defined strands:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Mathematics", code: "MATH", category: "Core", strands: ["Numbers", "Measurement", "Geometry", "Data Handling", "Money"] },
                  { name: "English", code: "ENG", category: "Core", strands: ["Listening and Speaking", "Reading", "Writing", "Language Use"] },
                  { name: "Kiswahili", code: "KIS", category: "Core", strands: ["Kusoma", "Kuandika", "Kusikiliza na Kuzungumza", "Matumizi ya Lugha"] },
                  { name: "Science & Technology", code: "SCI", category: "Core", strands: ["Living Things", "Non-living Things", "Energy", "Technology"] },
                  { name: "Social Studies", code: "SST", category: "Core", strands: ["Geography", "History", "Citizenship", "Economics"] },
                  { name: "CRE", code: "CRE", category: "Religious", strands: ["Biblical Stories", "Christian Values", "Prayer and Worship", "Christian Living"] },
                  { name: "Home Science", code: "HOME", category: "Practical", strands: ["Food and Nutrition", "Clothing", "Home Management", "Family Life"] },
                  { name: "Agriculture", code: "AGRI", category: "Practical", strands: ["Crop Production", "Animal Husbandry", "Environmental Conservation", "Farm Tools"] }
                ].map((subject) => (
                  <Button
                    key={subject.code}
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/assessment-book/subjects', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(subject)
                        });
                        if (response.ok) {
                          // Refresh subjects list
                          window.location.reload();
                        }
                      } catch (error) {
                        console.error('Error adding subject:', error);
                      }
                    }}
                    disabled={subjects.some((s: Subject) => s.code === subject.code)}
                  >
                    {subjects.some((s: Subject) => s.code === subject.code) ? "✓ Added" : `+ ${subject.name}`}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current Subjects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Strands</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects.map((subject: Subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">{subject.name}</TableCell>
                      <TableCell>{subject.code}</TableCell>
                      <TableCell>
                        <Badge variant={subject.category === 'Core' ? 'default' : 'secondary'}>
                          {subject.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.strands?.slice(0, 3).map((strand: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {strand}
                            </Badge>
                          ))}
                          {subject.strands?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{subject.strands.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('Managing strands for:', subject.name);
                            }}
                          >
                            <List className="h-4 w-4" />
                            Manage Strands
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('Editing subject:', subject.name);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4">
          {behaviorReport && (
            <Card>
              <CardHeader>
                <CardTitle>Behavior Report - {selectedTerm.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Behavior Aspect</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Respect for Self</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={behaviorReport.respectForSelf ? "default" : "outline"}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant={!behaviorReport.respectForSelf ? "default" : "outline"}
                            className="flex-1"
                          >
                            No
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Respect for Others</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={behaviorReport.respectForOthers ? "default" : "outline"}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant={!behaviorReport.respectForOthers ? "default" : "outline"}
                            className="flex-1"
                          >
                            No
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Respect for Property</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={behaviorReport.respectForProperty ? "default" : "outline"}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant={!behaviorReport.respectForProperty ? "default" : "outline"}
                            className="flex-1"
                          >
                            No
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Respect for Environment</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={behaviorReport.respectForEnvironment ? "default" : "outline"}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant={!behaviorReport.respectForEnvironment ? "default" : "outline"}
                            className="flex-1"
                          >
                            No
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Teacher Comments</label>
                  <Textarea
                    defaultValue={behaviorReport.teacherComments}
                    placeholder="Enter behavior comments..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button
                  onClick={() => {
                    saveBehaviorReport.mutate({
                      studentId: selectedStudent?.id,
                      term: selectedTerm,
                      academicYear,
                      ...behaviorReport
                    });
                  }}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Behavior Report
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          {assessmentSummary && (
            <Card>
              <CardHeader>
                <CardTitle>Assessment Summary - {academicYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Term 1</TableHead>
                      <TableHead>Term 2</TableHead>
                      <TableHead>Term 3</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessmentSummary.subjects?.map((subject: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{subject.subjectName}</TableCell>
                        <TableCell>
                          <Badge className={getPerformanceColor(subject.term1)}>
                            {subject.term1}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPerformanceColor(subject.term2)}>
                            {subject.term2}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPerformanceColor(subject.term3)}>
                            {subject.term3}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}