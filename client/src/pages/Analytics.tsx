import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, subDays, subWeeks, subMonths, parseISO, startOfWeek, endOfWeek, eachDayOfInterval, isWithinInterval } from "date-fns";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Award,
  Activity,
  PieChart,
  LineChart,
  FileText,
  Download,
  Filter,
  Calendar as CalendarIcon,
  Target,
  Star,
  GraduationCap,
  School,
  User,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  MessageSquare,
  Video,
  HeadphonesIcon,
  FileImage,
  Brain,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

export default function Analytics() {
  const { toast } = useToast();
  
  // State management
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [selectedMetric, setSelectedMetric] = useState("engagement");
  const [selectedInstitution, setSelectedInstitution] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subWeeks(new Date(), 1),
    to: new Date()
  });

  // Sample data for comprehensive analytics
  const institutionData = [
    { id: "1", name: "Lincoln Middle School", type: "Middle School", students: 450, teachers: 28 },
    { id: "2", name: "Sunshine Elementary", type: "Elementary", students: 320, teachers: 22 },
    { id: "3", name: "Roosevelt High School", type: "High School", students: 680, teachers: 42 },
    { id: "4", name: "Oak Valley Academy", type: "Private", students: 180, teachers: 15 }
  ];

  const engagementData = [
    { date: "2024-01-08", activeUsers: 145, sessionsCompleted: 89, avgSessionLength: 28, contentViews: 267 },
    { date: "2024-01-09", activeUsers: 158, sessionsCompleted: 102, avgSessionLength: 31, contentViews: 294 },
    { date: "2024-01-10", activeUsers: 172, sessionsCompleted: 118, avgSessionLength: 29, contentViews: 318 },
    { date: "2024-01-11", activeUsers: 134, sessionsCompleted: 95, avgSessionLength: 26, contentViews: 251 },
    { date: "2024-01-12", activeUsers: 189, sessionsCompleted: 127, avgSessionLength: 33, contentViews: 342 },
    { date: "2024-01-13", activeUsers: 203, sessionsCompleted: 145, avgSessionLength: 35, contentViews: 378 },
    { date: "2024-01-14", activeUsers: 167, sessionsCompleted: 112, avgSessionLength: 30, contentViews: 301 }
  ];

  const performanceData = [
    { subject: "Mathematics", avgScore: 84.2, improvement: 5.8, completionRate: 92, studentsActive: 156 },
    { subject: "Science", avgScore: 87.1, improvement: 3.4, completionRate: 89, studentsActive: 142 },
    { subject: "English", avgScore: 81.7, improvement: 7.2, completionRate: 94, studentsActive: 178 },
    { subject: "History", avgScore: 79.3, improvement: 2.1, completionRate: 87, studentsActive: 134 },
    { subject: "Geography", avgScore: 82.9, improvement: 4.7, completionRate: 91, studentsActive: 98 },
    { subject: "Art", avgScore: 88.4, improvement: 1.9, completionRate: 96, studentsActive: 87 }
  ];

  const deviceUsageData = [
    { device: "Computer", usage: 45, sessions: 234, avgDuration: 32 },
    { device: "Tablet", usage: 35, sessions: 187, avgDuration: 28 },
    { device: "Phone", usage: 20, sessions: 98, avgDuration: 22 }
  ];

  const contentTypeData = [
    { type: "Videos", views: 1247, engagement: 78, avgDuration: 8.5 },
    { type: "Interactive Lessons", views: 892, engagement: 85, avgDuration: 15.2 },
    { type: "Quizzes", views: 634, engagement: 92, avgDuration: 12.1 },
    { type: "Reading Materials", views: 456, engagement: 71, avgDuration: 18.7 },
    { type: "Virtual Labs", views: 298, engagement: 88, avgDuration: 25.3 }
  ];

  const gradePerformanceData = [
    { grade: "K-2", avgScore: 91.2, engagement: 87, hoursSpent: 145 },
    { grade: "3-5", avgScore: 85.7, engagement: 83, hoursSpent: 198 },
    { grade: "6-8", avgScore: 82.4, engagement: 79, hoursSpent: 267 },
    { grade: "9-12", avgScore: 78.9, engagement: 75, hoursSpent: 312 }
  ];

  const teacherData = [
    { name: "Sarah Johnson", subject: "Mathematics", studentsActive: 28, avgScore: 86.4, contentCreated: 12 },
    { name: "Michael Chen", subject: "Science", studentsActive: 32, avgScore: 89.1, contentCreated: 18 },
    { name: "Emily Rodriguez", subject: "English", studentsActive: 35, avgScore: 83.7, contentCreated: 15 },
    { name: "David Wilson", subject: "History", studentsActive: 29, avgScore: 81.2, contentCreated: 9 }
  ];

  const learningPathData = [
    { path: "Algebra Fundamentals", enrolled: 89, completed: 67, avgProgress: 78, difficulty: "Intermediate" },
    { path: "Biology Basics", enrolled: 76, completed: 58, avgProgress: 82, difficulty: "Beginner" },
    { path: "Creative Writing", enrolled: 54, completed: 49, avgProgress: 91, difficulty: "Beginner" },
    { path: "Chemistry Lab", enrolled: 42, completed: 28, avgProgress: 65, difficulty: "Advanced" }
  ];

  // Computed metrics
  const totalActiveUsers = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.activeUsers, 0) / engagementData.length
  , [engagementData]);

  const totalSessions = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.sessionsCompleted, 0)
  , [engagementData]);

  const avgSessionLength = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.avgSessionLength, 0) / engagementData.length
  , [engagementData]);

  const totalContentViews = useMemo(() => 
    engagementData.reduce((sum, day) => sum + day.contentViews, 0)
  , [engagementData]);

  const overallPerformance = useMemo(() => 
    performanceData.reduce((sum, subject) => sum + subject.avgScore, 0) / performanceData.length
  , [performanceData]);

  const engagementTrend = useMemo(() => {
    if (engagementData.length < 2) return 0;
    const recent = engagementData.slice(-3).reduce((sum, day) => sum + day.activeUsers, 0) / 3;
    const previous = engagementData.slice(0, 3).reduce((sum, day) => sum + day.activeUsers, 0) / 3;
    return ((recent - previous) / previous) * 100;
  }, [engagementData]);

  // Helper functions
  const getTrendIcon = (value: number) => {
    if (value > 2) return <ArrowUpRight className="h-4 w-4 text-green-600" />;
    if (value < -2) return <ArrowDownRight className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getPerformanceBadge = (score: number) => {
    if (score >= 85) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (score >= 65) return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "text-green-600";
      case "Intermediate": return "text-yellow-600";
      case "Advanced": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Computer": return <Monitor className="h-4 w-4" />;
      case "Tablet": return <Tablet className="h-4 w-4" />;
      case "Phone": return <Smartphone className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Analytics & Reporting
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into learning progress, engagement, and institutional performance
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="institution">Institution</Label>
              <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                <SelectTrigger>
                  <SelectValue placeholder="All Institutions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Institutions</SelectItem>
                  {institutionData.map((institution) => (
                    <SelectItem key={institution.id} value={institution.id}>
                      {institution.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade">Grade Level</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  <SelectItem value="K-2">K-2</SelectItem>
                  <SelectItem value="3-5">3-5</SelectItem>
                  <SelectItem value="6-8">6-8</SelectItem>
                  <SelectItem value="9-12">9-12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(totalActiveUsers)}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {getTrendIcon(engagementTrend)}
              <span>{Math.abs(engagementTrend).toFixed(1)}% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span>8.2% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Session Length
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(avgSessionLength)}m</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span>4.7% vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Content Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalContentViews}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span>12.1% vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="engagement" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="institutions">Institutions</TabsTrigger>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementData.map((day, index) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {format(parseISO(day.date), "MMM d")}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32">
                          <Progress value={(day.activeUsers / 250) * 100} className="h-2" />
                        </div>
                        <span className="text-sm font-bold w-12">{day.activeUsers}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Device Usage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deviceUsageData.map((device) => (
                    <div key={device.device} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device.device)}
                          <span className="text-sm font-medium">{device.device}</span>
                        </div>
                        <span className="text-sm font-bold">{device.usage}%</span>
                      </div>
                      <Progress value={device.usage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {device.sessions} sessions • {device.avgDuration}m avg
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Session Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {engagementData.map((day) => (
                    <div key={day.date} className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {format(parseISO(day.date), "MMM d")}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <Progress value={(day.sessionsCompleted / day.activeUsers) * 100} className="h-2" />
                        </div>
                        <span className="text-sm font-bold">
                          {Math.round((day.sessionsCompleted / day.activeUsers) * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Content Type Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contentTypeData.map((content) => (
                    <div key={content.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{content.type}</span>
                        <span className="text-sm font-bold">{content.engagement}%</span>
                      </div>
                      <Progress value={content.engagement} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {content.views} views • {content.avgDuration}m avg duration
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Subject Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.map((subject) => (
                    <div key={subject.subject} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{subject.subject}</span>
                          <div className="text-xs text-muted-foreground">
                            {subject.studentsActive} active students
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">{subject.avgScore}%</div>
                          <div className="text-xs text-green-600">
                            +{subject.improvement}% improvement
                          </div>
                        </div>
                      </div>
                      <Progress value={subject.avgScore} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span>{subject.completionRate}% completion rate</span>
                        {getPerformanceBadge(subject.avgScore)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Grade Level Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradePerformanceData.map((grade) => (
                    <div key={grade.grade} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{grade.grade}</span>
                        <span className="text-sm font-bold">{grade.avgScore}%</span>
                      </div>
                      <Progress value={grade.avgScore} className="h-2" />
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>Engagement: {grade.engagement}%</span>
                        <span>Hours: {grade.hoursSpent}h</span>
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
                  Learning Paths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningPathData.map((path) => (
                    <div key={path.path} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">{path.path}</span>
                          <div className="text-xs text-muted-foreground">
                            <span className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-bold">{path.avgProgress}%</span>
                      </div>
                      <Progress value={path.avgProgress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{path.enrolled} enrolled</span>
                        <span>{path.completed} completed</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Overall Improvement</div>
                      <div className="text-xs text-muted-foreground">Across all subjects</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">+4.2%</div>
                      <div className="text-xs text-muted-foreground">vs last month</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Completion Rate</div>
                      <div className="text-xs text-muted-foreground">Average across paths</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">91.2%</div>
                      <div className="text-xs text-muted-foreground">+2.1% improvement</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Study Time</div>
                      <div className="text-xs text-muted-foreground">Per student weekly</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-purple-600">5.4h</div>
                      <div className="text-xs text-muted-foreground">+18 min increase</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Most Popular Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Algebra Basics: Linear Equations", views: 234, rating: 4.8, type: "Video" },
                    { title: "Cell Biology Interactive Lab", views: 198, rating: 4.9, type: "Interactive" },
                    { title: "American History Timeline", views: 176, rating: 4.6, type: "Reading" },
                    { title: "Chemistry Periodic Table Quiz", views: 145, rating: 4.7, type: "Quiz" },
                    { title: "Creative Writing Workshop", views: 132, rating: 4.5, type: "Activity" }
                  ].map((content, index) => (
                    <div key={content.title} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{content.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {content.type} • {content.views} views
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{content.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Content Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {contentTypeData.map((content) => (
                    <div key={content.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{content.type}</span>
                        <div className="text-right">
                          <div className="text-sm font-bold">{content.engagement}%</div>
                          <div className="text-xs text-muted-foreground">effectiveness</div>
                        </div>
                      </div>
                      <Progress value={content.engagement} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {content.views} total views • {content.avgDuration}m avg time
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Content Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">3,247</div>
                    <div className="text-sm text-muted-foreground">Total Content Items</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">87.3%</div>
                    <div className="text-sm text-muted-foreground">Avg Completion Rate</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">4.7</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm text-muted-foreground">New This Week</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Content Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { feedback: "More interactive examples needed", category: "Enhancement", votes: 23 },
                    { feedback: "Great visual explanations", category: "Positive", votes: 45 },
                    { feedback: "Audio quality could be better", category: "Technical", votes: 12 },
                    { feedback: "Perfect difficulty level", category: "Positive", votes: 34 },
                    { feedback: "Add more practice problems", category: "Enhancement", votes: 18 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm">{item.feedback}</div>
                        <Badge variant={item.category === 'Positive' ? 'default' : 'secondary'} className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">{item.votes} votes</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="institutions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5" />
                  Institution Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {institutionData.map((institution) => (
                    <div key={institution.id} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{institution.name}</div>
                          <div className="text-xs text-muted-foreground">{institution.type}</div>
                        </div>
                        <Badge variant="outline">{institution.students} students</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {institution.teachers} teachers
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Institutional Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {institutionData.map((institution) => {
                    const performance = 75 + Math.random() * 20; // Simulated performance
                    return (
                      <div key={institution.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{institution.name}</span>
                          <span className="text-sm font-bold">{performance.toFixed(1)}%</span>
                        </div>
                        <Progress value={performance} className="h-2" />
                        <div className="text-xs text-muted-foreground">
                          Overall student performance score
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teachers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Teacher Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teacherData.map((teacher) => (
                    <div key={teacher.name} className="space-y-2 p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{teacher.name}</div>
                          <div className="text-xs text-muted-foreground">{teacher.subject}</div>
                        </div>
                        <span className="text-sm font-bold">{teacher.avgScore}%</span>
                      </div>
                      <Progress value={teacher.avgScore} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{teacher.studentsActive} active students</span>
                        <span>{teacher.contentCreated} content items</span>
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
                  Teacher Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">92%</div>
                      <div className="text-xs text-muted-foreground">Active This Week</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">67</div>
                      <div className="text-xs text-muted-foreground">Content Created</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Top Content Creators</div>
                    {teacherData
                      .sort((a, b) => b.contentCreated - a.contentCreated)
                      .slice(0, 3)
                      .map((teacher, index) => (
                        <div key={teacher.name} className="flex items-center justify-between text-sm">
                          <span>#{index + 1} {teacher.name}</span>
                          <span className="font-medium">{teacher.contentCreated} items</span>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Peak Learning Hours</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Students are most active between 2-4 PM on weekdays
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">High Retention</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Interactive content shows 40% higher completion rates
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Attention Needed</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Math performance shows decline in advanced topics
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
                    <div className="text-sm font-medium mb-1">Increase Interactive Content</div>
                    <div className="text-xs text-muted-foreground">
                      Add more hands-on activities for science subjects
                    </div>
                  </div>
                  <div className="p-3 border-l-4 border-green-500 bg-green-50">
                    <div className="text-sm font-medium mb-1">Expand Mobile Support</div>
                    <div className="text-xs text-muted-foreground">
                      20% of students prefer mobile learning
                    </div>
                  </div>
                  <div className="p-3 border-l-4 border-purple-500 bg-purple-50">
                    <div className="text-sm font-medium mb-1">Teacher Training</div>
                    <div className="text-xs text-muted-foreground">
                      Focus on digital content creation skills
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Review math curriculum difficulty", priority: "High", status: "pending" },
                    { task: "Increase video content for history", priority: "Medium", status: "in-progress" },
                    { task: "Optimize mobile app performance", priority: "High", status: "pending" },
                    { task: "Teacher workshop on engagement", priority: "Low", status: "completed" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm">{item.task}</div>
                        <div className="flex gap-1">
                          <Badge 
                            variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {item.priority}
                          </Badge>
                          <Badge 
                            variant={item.status === 'completed' ? 'default' : 'outline'}
                            className="text-xs"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}