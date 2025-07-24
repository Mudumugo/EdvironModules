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
  Award
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

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

  // Fetch students for the teacher
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/assessment-book/students"],
    enabled: user?.role === "teacher",
  });

  // Fetch subjects
  const { data: subjects = [] } = useQuery<Subject[]>({
    queryKey: ["/api/assessment-book/subjects", "Grade 6"],
    queryFn: async () => {
      const response = await fetch("/api/assessment-book/subjects?gradeLevel=Grade 6");
      if (!response.ok) throw new Error('Failed to fetch subjects');
      return response.json();
    },
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
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Subjects
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
          {selectedSubject && assessmentBook && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {selectedSubject.name} Activities - {selectedTerm.toUpperCase()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Strand/Substrand</TableHead>
                      <TableHead>Performance Level</TableHead>
                      <TableHead>Teacher Comment</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessmentBook.entries?.map((entry: AssessmentEntry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.strand}</div>
                            {entry.subStrand && (
                              <div className="text-sm text-gray-500">{entry.subStrand}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select defaultValue={entry.performanceLevel}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {performanceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            defaultValue={entry.teacherComment}
                            placeholder="Enter comment..."
                            className="w-full"
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            onClick={() => {
                              saveAssessmentEntry.mutate({
                                assessmentBookId: assessmentBook.id,
                                strand: entry.strand,
                                subStrand: entry.subStrand,
                                performanceLevel: entry.performanceLevel,
                                teacherComment: entry.teacherComment
                              });
                            }}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
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