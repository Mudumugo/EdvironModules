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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Edit,
  Trash2,
  X,
  Info
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import ReportCard from "./ReportCard";


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

// SubjectEditor Component
function SubjectEditor({ subject, isOpen, onClose, onUpdate }: {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setCode(subject.code);
      setCategory(subject.category);
    }
  }, [subject]);

  const saveChanges = async () => {
    if (!subject) return;
    
    try {
      const response = await fetch(`/api/assessment-book/subjects/${subject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code, category })
      });
      
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        alert('Failed to update subject. Please try again.');
      }
    } catch (error) {
      console.error('Error updating subject:', error);
      alert('Error updating subject. Please try again.');
    }
  };

  if (!subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 md:mx-0">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <Edit className="h-4 w-4 md:h-5 md:w-5" />
            Edit Subject
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 md:space-y-4">
          <div>
            <label className="text-xs md:text-sm font-medium mb-2 block">Subject Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter subject name"
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs md:text-sm font-medium mb-2 block">Subject Code</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter subject code"
              className="text-sm"
            />
          </div>
          
          <div>
            <label className="text-xs md:text-sm font-medium mb-2 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="core">Core</SelectItem>
                <SelectItem value="religious">Religious</SelectItem>
                <SelectItem value="practical">Practical</SelectItem>
                <SelectItem value="co-curricular">Co-curricular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="order-2 sm:order-1" size="sm">
              Cancel
            </Button>
            <Button onClick={saveChanges} className="bg-blue-600 hover:bg-blue-700 order-1 sm:order-2" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// StrandManager Component
function StrandManager({ subject, isOpen, onClose, onUpdate }: {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [strands, setStrands] = useState<string[]>([]);
  const [newStrand, setNewStrand] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  useEffect(() => {
    if (subject) {
      setStrands(subject.strands || []);
    }
  }, [subject]);

  const addStrand = () => {
    if (newStrand.trim() && !strands.includes(newStrand.trim())) {
      setStrands([...strands, newStrand.trim()]);
      setNewStrand("");
    }
  };

  const removeStrand = (index: number) => {
    setStrands(strands.filter((_, i) => i !== index));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(strands[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingValue.trim()) {
      const newStrands = [...strands];
      newStrands[editingIndex] = editingValue.trim();
      setStrands(newStrands);
      setEditingIndex(null);
      setEditingValue("");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue("");
  };

  const saveChanges = async () => {
    if (!subject) return;
    
    try {
      const response = await fetch(`/api/assessment-book/subjects/${subject.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strands })
      });
      
      if (response.ok) {
        onUpdate();
        onClose();
      } else {
        alert('Failed to update strands. Please try again.');
      }
    } catch (error) {
      console.error('Error updating strands:', error);
      alert('Error updating strands. Please try again.');
    }
  };

  if (!subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl mx-4 md:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base md:text-lg">
            <List className="h-4 w-4 md:h-5 md:w-5" />
            Manage Strands: {subject.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Add New Strand */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter new strand name..."
              value={newStrand}
              onChange={(e) => setNewStrand(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addStrand()}
              className="flex-1 text-sm"
            />
            <Button onClick={addStrand} disabled={!newStrand.trim()} size="sm" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>

          {/* Current Strands */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Current Strands ({strands.length})</h3>
            {strands.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No strands added yet</p>
            ) : (
              <div className="space-y-2">
                {strands.map((strand, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    {editingIndex === index ? (
                      <>
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                          className="flex-1"
                          autoFocus
                        />
                        <Button size="sm" onClick={saveEdit}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 font-medium">{strand}</span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeStrand(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="order-2 sm:order-1" size="sm">
              Cancel
            </Button>
            <Button onClick={saveChanges} className="bg-blue-600 hover:bg-blue-700 order-1 sm:order-2" size="sm">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AssessmentBook() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedTerm, setSelectedTerm] = useState("term2");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [academicYear] = useState("2025");
  const [showReportCard, setShowReportCard] = useState(false);
  const [manageStrandsSubject, setManageStrandsSubject] = useState<Subject | null>(null);
  const [showStrandsManager, setShowStrandsManager] = useState(false);
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [showEditSubject, setShowEditSubject] = useState(false);

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
    <div className="space-y-4 md:space-y-6 px-2 md:px-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
              Digital Assessment Book
            </h1>
            <p className="opacity-90 text-sm md:text-base">Competency-Based Education Assessment</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {selectedStudent && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-lg p-3">
                <Avatar className="w-10 h-10 md:w-12 md:h-12">
                  <AvatarImage src={selectedStudent.profileImageUrl} />
                  <AvatarFallback className="bg-white/20 text-white text-sm">
                    {getInitials(selectedStudent.firstName, selectedStudent.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm md:text-base">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                  <p className="text-xs md:text-sm opacity-75">UPI: {selectedStudent.upi}</p>
                </div>
              </div>
            )}
            {selectedStudent && (
              <Button 
                onClick={() => setShowReportCard(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto"
                variant="outline"
                size="sm"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Generate Report Card</span>
                <span className="sm:hidden">Report Card</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Student and Subject Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base">Select Student</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base">Select Subject</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base">Select Term</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="dashboard" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-2">
            <BarChart3 className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Home</span>
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-2">
            <User className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Behavior</span>
            <span className="sm:hidden">Behavior</span>
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-1 md:gap-2 text-xs md:text-sm px-2 md:px-3 py-2">
            <FileText className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Summary</span>
            <span className="sm:hidden">Summary</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button 
                  onClick={() => {
                    // Scroll to competency logging section
                    setActiveTab("dashboard");
                    setTimeout(() => {
                      const element = document.getElementById("competency-logging");
                      element?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="bg-green-600 hover:bg-green-700 w-full justify-start"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Log Competencies</span>
                  <span className="sm:hidden">Log Skills</span>
                </Button>
                <Button 
                  onClick={() => setActiveTab("behavior")}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 w-full justify-start"
                  size="sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Manage Behavior
                </Button>
                <Button 
                  onClick={() => setActiveTab("summary")}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 w-full justify-start"
                  size="sm"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">View Report Card</span>
                  <span className="sm:hidden">Report Card</span>
                </Button>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs md:text-sm text-blue-800">
                    <p className="font-medium mb-1">📚 Integrated with EdVirons Portal</p>
                    <p>Students and subjects are automatically loaded from your school's management system. Select a student and subject above, then click "Log Competencies" to record CBC performance levels.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedStudent && (
            <>
              {/* Student Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Profile</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
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

              {/* Competency Logging Section */}
              {selectedSubject && (
                <Card id="competency-logging" className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      Log Competencies: {selectedSubject.name}
                    </CardTitle>
                    <p className="text-sm text-green-700">
                      Record student performance using CBC standards (EE, ME, AE, BE) for each learning strand
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Learning Strands */}
                      {selectedSubject.strands && selectedSubject.strands.length > 0 ? (
                        <div className="grid gap-4">
                          {selectedSubject.strands.map((strand: string, index: number) => (
                            <div key={index} className="bg-white p-4 rounded-lg border border-green-100">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-800 mb-1">{strand}</h4>
                                  <p className="text-xs text-gray-600">
                                    Learning Strand {index + 1} of {selectedSubject.strands.length}
                                  </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {['EE', 'ME', 'AE', 'BE'].map((level) => (
                                    <Button
                                      key={level}
                                      size="sm"
                                      variant={
                                        assessmentBook?.strands?.[strand] === level ? "default" : "outline"
                                      }
                                      className={`
                                        ${level === 'EE' ? 'border-green-500 text-green-700 hover:bg-green-50' : ''}
                                        ${level === 'ME' ? 'border-blue-500 text-blue-700 hover:bg-blue-50' : ''}
                                        ${level === 'AE' ? 'border-orange-500 text-orange-700 hover:bg-orange-50' : ''}
                                        ${level === 'BE' ? 'border-red-500 text-red-700 hover:bg-red-50' : ''}
                                        ${assessmentBook?.strands?.[strand] === level ? 'bg-gray-800 text-white' : ''}
                                      `}
                                      onClick={async () => {
                                        try {
                                          const response = await fetch('/api/assessment-book/entries', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              studentId: selectedStudent.id,
                                              subjectId: selectedSubject.id,
                                              term: selectedTerm,
                                              strand: strand,
                                              competencyLevel: level,
                                              assessmentDate: new Date().toISOString(),
                                              notes: `${level} assessment for ${strand}`
                                            })
                                          });
                                          
                                          if (response.ok) {
                                            // Refresh assessment data
                                            queryClient.invalidateQueries({ 
                                              queryKey: ["/api/assessment-book", selectedStudent.id, selectedSubject.id, selectedTerm] 
                                            });
                                            
                                            // Show success feedback
                                            const successMsg = document.createElement('div');
                                            successMsg.textContent = `✅ Logged ${level} for ${strand}`;
                                            successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg z-50';
                                            document.body.appendChild(successMsg);
                                            setTimeout(() => document.body.removeChild(successMsg), 2000);
                                          }
                                        } catch (error) {
                                          console.error('Error logging competency:', error);
                                        }
                                      }}
                                    >
                                      {level}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Current Assessment Display */}
                              {assessmentBook?.strands?.[strand] && (
                                <div className="mt-3 p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                      Current: <span className={`font-bold ${getPerformanceColor(assessmentBook.strands[strand])}`}>
                                        {assessmentBook.strands[strand]}
                                      </span>
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(assessmentBook.lastUpdated || new Date()).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p className="text-sm">No learning strands defined for this subject.</p>
                          <p className="text-xs mt-1">Go to <strong>Subjects</strong> tab to add strands.</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Competency Guide */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        CBC Performance Levels
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span><strong>EE:</strong> Exceeds Expectations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span><strong>ME:</strong> Meets Expectations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded"></div>
                          <span><strong>AE:</strong> Approaching Expectations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span><strong>BE:</strong> Below Expectations</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-4">
          {/* Subject Management Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Subject & Strand Management</h2>
              <p className="text-gray-600 text-sm md:text-base">Manage CBC subjects and their learning strands</p>
            </div>
            <Button onClick={async () => {
              // Show custom subject form
              const subjectName = prompt('Enter subject name (e.g., "Physical Education"):');
              if (!subjectName) return;
              
              const subjectCode = prompt('Enter subject code (e.g., "PE"):');
              if (!subjectCode) return;
              
              const category = prompt('Enter category (core/religious/practical/co-curricular):');
              if (!category) return;
              
              const strandsInput = prompt('Enter learning strands separated by commas (e.g., "Athletics, Team Sports, Health"):');
              const strands = strandsInput ? strandsInput.split(',').map(s => s.trim()) : [];
              
              try {
                const response = await fetch('/api/assessment-book/subjects', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: subjectName,
                    code: subjectCode.toUpperCase(),
                    category: category.toLowerCase(),
                    strands: strands
                  })
                });
                
                if (response.ok) {
                  alert(`✅ Subject "${subjectName}" added successfully!`);
                  window.location.reload();
                } else {
                  alert('❌ Failed to add subject. Please try again.');
                }
              } catch (error) {
                console.error('Error adding subject:', error);
                alert('❌ Error adding subject. Please try again.');
              }
            }} className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
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
              <CardTitle className="text-lg md:text-xl">Current Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs md:text-sm">Subject</TableHead>
                      <TableHead className="text-xs md:text-sm">Code</TableHead>
                      <TableHead className="text-xs md:text-sm">Category</TableHead>
                      <TableHead className="text-xs md:text-sm">Strands</TableHead>
                      <TableHead className="text-xs md:text-sm">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {subjects.map((subject: Subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium text-xs md:text-sm">{subject.name}</TableCell>
                      <TableCell className="text-xs md:text-sm">{subject.code}</TableCell>
                      <TableCell>
                        <Badge variant={subject.category === 'Core' ? 'default' : 'secondary'} className="text-xs">
                          {subject.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {subject.strands?.slice(0, 2).map((strand: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {strand.length > 10 ? strand.substring(0, 10) + '...' : strand}
                            </Badge>
                          ))}
                          {subject.strands?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{subject.strands.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setManageStrandsSubject(subject);
                              setShowStrandsManager(true);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            <List className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Manage Strands</span>
                            <span className="sm:hidden">Strands</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditSubject(subject);
                              setShowEditSubject(true);
                            }}
                            className="text-xs px-2 py-1"
                          >
                            <Edit className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                            <span className="sm:hidden">Edit</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
              </div>
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

      {/* SubjectEditor Modal */}
      <SubjectEditor
        subject={editSubject}
        isOpen={showEditSubject}
        onClose={() => {
          setShowEditSubject(false);
          setEditSubject(null);
        }}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/assessment-book/subjects"] });
        }}
      />

      {/* StrandManager Modal */}
      <StrandManager
        subject={manageStrandsSubject}
        isOpen={showStrandsManager}
        onClose={() => {
          setShowStrandsManager(false);
          setManageStrandsSubject(null);
        }}
        onUpdate={() => {
          queryClient.invalidateQueries({ queryKey: ["/api/assessment-book/subjects"] });
        }}
      />
    </div>
  );
}
