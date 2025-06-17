import { useState, useMemo } from "react";
import { subWeeks } from "date-fns";

export interface EngagementData {
  date: string;
  activeUsers: number;
  sessionsCompleted: number;
  avgSessionLength: number;
  contentViews: number;
}

export interface PerformanceData {
  subject: string;
  avgScore: number;
  improvement: number;
  completionRate: number;
  studentsActive: number;
}

export interface ContentTypeData {
  type: string;
  views: number;
  engagement: number;
  avgDuration: number;
}

export interface InstitutionData {
  id: string;
  name: string;
  type: string;
  students: number;
  teachers: number;
}

export interface TeacherData {
  name: string;
  subject: string;
  studentsActive: number;
  avgScore: number;
  contentCreated: number;
}

export interface GradePerformanceData {
  grade: string;
  avgScore: number;
  engagement: number;
  hoursSpent: number;
}

export interface LearningPathData {
  path: string;
  enrolled: number;
  completed: number;
  avgProgress: number;
  difficulty: string;
}

export interface DeviceUsageData {
  device: string;
  usage: number;
  sessions: number;
  avgDuration: number;
}

const engagementData: EngagementData[] = [
  { date: "2024-01-08", activeUsers: 145, sessionsCompleted: 89, avgSessionLength: 28, contentViews: 267 },
  { date: "2024-01-09", activeUsers: 158, sessionsCompleted: 102, avgSessionLength: 31, contentViews: 294 },
  { date: "2024-01-10", activeUsers: 172, sessionsCompleted: 118, avgSessionLength: 29, contentViews: 318 },
  { date: "2024-01-11", activeUsers: 134, sessionsCompleted: 95, avgSessionLength: 26, contentViews: 251 },
  { date: "2024-01-12", activeUsers: 189, sessionsCompleted: 127, avgSessionLength: 33, contentViews: 342 },
  { date: "2024-01-13", activeUsers: 203, sessionsCompleted: 145, avgSessionLength: 35, contentViews: 378 },
  { date: "2024-01-14", activeUsers: 167, sessionsCompleted: 112, avgSessionLength: 30, contentViews: 301 }
];

const performanceData: PerformanceData[] = [
  { subject: "Mathematics", avgScore: 84.2, improvement: 5.8, completionRate: 92, studentsActive: 156 },
  { subject: "Science", avgScore: 87.1, improvement: 3.4, completionRate: 89, studentsActive: 142 },
  { subject: "English", avgScore: 81.7, improvement: 7.2, completionRate: 94, studentsActive: 178 },
  { subject: "History", avgScore: 79.3, improvement: 2.1, completionRate: 87, studentsActive: 134 },
  { subject: "Geography", avgScore: 82.9, improvement: 4.7, completionRate: 91, studentsActive: 98 },
  { subject: "Art", avgScore: 88.4, improvement: 1.9, completionRate: 96, studentsActive: 87 }
];

const institutionData: InstitutionData[] = [
  { id: "1", name: "Lincoln Middle School", type: "Middle School", students: 450, teachers: 28 },
  { id: "2", name: "Sunshine Elementary", type: "Elementary", students: 320, teachers: 22 },
  { id: "3", name: "Roosevelt High School", type: "High School", students: 680, teachers: 42 },
  { id: "4", name: "Oak Valley Academy", type: "Private", students: 180, teachers: 15 }
];

const teacherData: TeacherData[] = [
  { name: "Sarah Johnson", subject: "Mathematics", studentsActive: 28, avgScore: 86.4, contentCreated: 12 },
  { name: "Michael Chen", subject: "Science", studentsActive: 32, avgScore: 89.1, contentCreated: 18 },
  { name: "Emily Rodriguez", subject: "English", studentsActive: 35, avgScore: 83.7, contentCreated: 15 },
  { name: "David Wilson", subject: "History", studentsActive: 29, avgScore: 81.2, contentCreated: 9 }
];

const contentTypeData: ContentTypeData[] = [
  { type: "Videos", views: 1247, engagement: 78, avgDuration: 8.5 },
  { type: "Interactive Lessons", views: 892, engagement: 85, avgDuration: 15.2 },
  { type: "Quizzes", views: 634, engagement: 92, avgDuration: 12.1 },
  { type: "Reading Materials", views: 456, engagement: 71, avgDuration: 18.7 },
  { type: "Virtual Labs", views: 298, engagement: 88, avgDuration: 25.3 }
];

const gradePerformanceData: GradePerformanceData[] = [
  { grade: "K-2", avgScore: 91.2, engagement: 87, hoursSpent: 145 },
  { grade: "3-5", avgScore: 85.7, engagement: 83, hoursSpent: 198 },
  { grade: "6-8", avgScore: 82.4, engagement: 79, hoursSpent: 267 },
  { grade: "9-12", avgScore: 78.9, engagement: 75, hoursSpent: 312 }
];

const learningPathData: LearningPathData[] = [
  { path: "Algebra Fundamentals", enrolled: 89, completed: 67, avgProgress: 78, difficulty: "Intermediate" },
  { path: "Biology Basics", enrolled: 76, completed: 58, avgProgress: 82, difficulty: "Beginner" },
  { path: "Creative Writing", enrolled: 54, completed: 49, avgProgress: 91, difficulty: "Beginner" },
  { path: "Chemistry Lab", enrolled: 42, completed: 28, avgProgress: 65, difficulty: "Advanced" }
];

const deviceUsageData: DeviceUsageData[] = [
  { device: "Computer", usage: 45, sessions: 234, avgDuration: 32 },
  { device: "Tablet", usage: 35, sessions: 187, avgDuration: 28 },
  { device: "Phone", usage: 20, sessions: 98, avgDuration: 22 }
];

export function useAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subWeeks(new Date(), 1),
    to: new Date()
  });

  // Computed metrics
  const totalActiveUsers = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.activeUsers, 0) / engagementData.length
  , []);

  const totalSessions = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.sessionsCompleted, 0)
  , []);

  const avgSessionLength = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.avgSessionLength, 0) / engagementData.length
  , []);

  const totalContentViews = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.contentViews, 0)
  , []);

  const engagementTrend = useMemo(() => {
    if (engagementData.length < 2) return 0;
    const recent = engagementData.slice(-3).reduce((sum, day) => sum + day.activeUsers, 0) / 3;
    const previous = engagementData.slice(0, 3).reduce((sum, day) => sum + day.activeUsers, 0) / 3;
    return ((recent - previous) / previous) * 100;
  }, []);

  const filteredData = useMemo(() => {
    // Apply filters based on selected criteria
    let filteredEngagement = engagementData;
    let filteredPerformance = performanceData;
    let filteredInstitutions = institutionData;
    let filteredTeachers = teacherData;

    if (selectedInstitution !== "all") {
      filteredInstitutions = institutionData.filter(inst => inst.id === selectedInstitution);
    }

    if (selectedSubject !== "all") {
      filteredPerformance = performanceData.filter(perf => 
        perf.subject.toLowerCase() === selectedSubject
      );
      filteredTeachers = teacherData.filter(teacher => 
        teacher.subject.toLowerCase() === selectedSubject
      );
    }

    return {
      engagement: filteredEngagement,
      performance: filteredPerformance,
      institutions: filteredInstitutions,
      teachers: filteredTeachers,
      contentTypes: contentTypeData,
      gradePerformance: gradePerformanceData,
      learningPaths: learningPathData,
      deviceUsage: deviceUsageData
    };
  }, [selectedTimeframe, selectedInstitution, selectedGrade, selectedSubject]);

  return {
    // Data
    ...filteredData,
    
    // Filters
    selectedTimeframe,
    setSelectedTimeframe,
    selectedInstitution,
    setSelectedInstitution,
    selectedGrade,
    setSelectedGrade,
    selectedSubject,
    setSelectedSubject,
    dateRange,
    setDateRange,
    
    // Computed metrics
    totalActiveUsers,
    totalSessions,
    avgSessionLength,
    totalContentViews,
    engagementTrend,
    
    // Static data for dropdowns
    institutions: institutionData,
    allSubjects: ["mathematics", "science", "english", "history", "art"],
    allGrades: ["K-2", "3-5", "6-8", "9-12"]
  };
}