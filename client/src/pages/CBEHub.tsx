import { useState, useMemo, memo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  GraduationCap, 
  Target, 
  Trophy, 
  BookOpen, 
  Star,
  Clock,
  Users,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  User,
  BookUser,
  Compass,
  TrendingDown,
  MessageCircleQuestion,
  Info,
  Map,
  Zap,
  Brain,
  Shield,
  PiggyBank,
  Users2,
  Heart,
  Building2,
  LineChart,
  Calculator,
  Lightbulb,
  BookOpenCheck,
  School,
  Globe
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import AssessmentBook from "@/components/AssessmentBook";

const CBEHub = memo(function CBEHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role || "parent");
  const [showAssessmentBook, setShowAssessmentBook] = useState(false);

  const competencies = useMemo(() => [
    {
      id: 1,
      title: "Mathematical Reasoning",
      category: "Mathematics",
      level: "Level 4",
      progress: 75,
      status: "in-progress",
      dueDate: "2025-08-15",
      assessments: 3,
      completed: 2
    },
    {
      id: 2,
      title: "Scientific Inquiry",
      category: "Science",
      level: "Level 3",
      progress: 90,
      status: "near-complete",
      dueDate: "2025-07-30",
      assessments: 4,
      completed: 4
    },
    {
      id: 3,
      title: "Written Communication",
      category: "Language Arts",
      level: "Level 5",
      progress: 60,
      status: "in-progress",
      dueDate: "2025-09-01",
      assessments: 5,
      completed: 3
    },
    {
      id: 4,
      title: "Critical Thinking",
      category: "Cross-Curricular",
      level: "Level 3",
      progress: 100,
      status: "completed",
      dueDate: "2025-06-30",
      assessments: 3,
      completed: 3
    }
  ], []);

  const portfolioItems = useMemo(() => [
    {
      id: 1,
      title: "Algebra Problem Solving Project",
      type: "project",
      subject: "Mathematics",
      date: "2025-07-10",
      competencies: ["Mathematical Reasoning", "Critical Thinking"],
      status: "submitted"
    },
    {
      id: 2,
      title: "Science Fair Experiment",
      type: "experiment",
      subject: "Science",
      date: "2025-07-05",
      competencies: ["Scientific Inquiry", "Written Communication"],
      status: "graded"
    },
    {
      id: 3,
      title: "Persuasive Essay on Climate Change",
      type: "essay",
      subject: "Language Arts",
      date: "2025-06-28",
      competencies: ["Written Communication", "Critical Thinking"],
      status: "in-review"
    }
  ], []);

  const upcomingAssessments = useMemo(() => [
    {
      id: 1,
      title: "Mathematical Reasoning Assessment #3",
      date: "2025-07-18",
      type: "performance-based",
      competency: "Mathematical Reasoning",
      duration: "90 minutes"
    },
    {
      id: 2,
      title: "Written Communication Portfolio Review",
      date: "2025-07-22",
      type: "portfolio",
      competency: "Written Communication",
      duration: "60 minutes"
    }
  ], []);

  // Role-based card data structure
  const roleCards = useMemo(() => ({
    parent: [
      {
        id: "p1",
        icon: <Compass className="h-6 w-6 text-indigo-600" />,
        title: "Pathway Explorer",
        description: "Interactive tool to compare STEM vs Arts vs Business tracks for your child's future",
        actionText: "Start Exploration",
        badge: "New Feature",
        progress: 0,
        completedModules: 0,
        totalModules: 5
      },
      {
        id: "p2", 
        icon: <LineChart className="h-6 w-6 text-emerald-600" />,
        title: "Progress Tracker",
        description: "Monitor your child's competency development across all subjects",
        actionText: "View Progress",
        badge: "Real-time",
        progress: 75,
        completedModules: 18,
        totalModules: 24
      },
      {
        id: "p3",
        icon: <Heart className="h-6 w-6 text-red-600" />,
        title: "Well-being Monitor",
        description: "Track your child's social-emotional learning and mental health indicators",
        actionText: "Check Status",
        badge: "Important",
        progress: 85,
        completedModules: 8,
        totalModules: 10
      },
      {
        id: "p4",
        icon: <Users2 className="h-6 w-6 text-blue-600" />,
        title: "Parent Community",
        description: "Connect with other parents and share experiences in CBC education",
        actionText: "Join Community",
        badge: "Popular",
        progress: 40,
        completedModules: 2,
        totalModules: 5
      },
      {
        id: "p5",
        icon: <PiggyBank className="h-6 w-6 text-yellow-600" />,
        title: "College & Career Planning",
        description: "Financial planning tools and career pathway guidance for your child",
        actionText: "Start Planning",
        badge: "Essential",
        progress: 20,
        completedModules: 1,
        totalModules: 8
      },
      {
        id: "p6",
        icon: <Shield className="h-6 w-6 text-purple-600" />,
        title: "Digital Safety",
        description: "Monitor and ensure your child's safe digital learning environment",
        actionText: "View Settings",
        badge: "Security",
        progress: 95,
        completedModules: 4,
        totalModules: 4
      }
    ],
    teacher: [
      {
        id: "t1",
        icon: <Brain className="h-6 w-6 text-indigo-600" />,
        title: "Competency Framework",
        description: "Design and track learning outcomes aligned with CBC standards",
        actionText: "Build Framework",
        badge: "Core",
        progress: 60,
        completedModules: 12,
        totalModules: 20
      },
      {
        id: "t2",
        icon: <BookOpenCheck className="h-6 w-6 text-emerald-600" />,
        title: "Assessment Designer",
        description: "Create authentic assessments that measure real-world competencies",
        actionText: "Create Assessment",
        badge: "Popular",
        progress: 80,
        completedModules: 16,
        totalModules: 20
      },
      {
        id: "t3",
        icon: <Users className="h-6 w-6 text-blue-600" />,
        title: "Student Portfolio",
        description: "Manage and review student work portfolios with competency alignment",
        actionText: "Review Portfolios",
        badge: "Active",
        progress: 45,
        completedModules: 156,
        totalModules: 350
      },
      {
        id: "t4",
        icon: <BarChart3 className="h-6 w-6 text-purple-600" />,
        title: "Learning Analytics",
        description: "Data-driven insights into student progress and competency development",
        actionText: "View Analytics",
        badge: "Insights",
        progress: 70,
        completedModules: 8,
        totalModules: 12
      },
      {
        id: "t5",
        icon: <Lightbulb className="h-6 w-6 text-yellow-600" />,
        title: "Curriculum Planning",
        description: "Plan interdisciplinary learning experiences with competency integration",
        actionText: "Plan Curriculum",
        badge: "Essential",
        progress: 55,
        completedModules: 24,
        totalModules: 40
      },
      {
        id: "t6",
        icon: <School className="h-6 w-6 text-cyan-600" />,
        title: "Professional Development",
        description: "CBC training modules and competency-based teaching strategies",
        actionText: "Continue Learning",
        badge: "Growth",
        progress: 30,
        completedModules: 6,
        totalModules: 20
      },
      {
        id: "assessment-book",
        icon: <FileText className="h-6 w-6 text-green-600" />,
        title: "Digital Assessment Book",
        description: "Create and manage competency-based assessment reports for students",
        actionText: "Open Report Book",
        badge: "New",
        progress: 85,
        completedModules: 42,
        totalModules: 50
      }
    ],
    student: [
      {
        id: "s1",
        icon: <Target className="h-6 w-6 text-indigo-600" />,
        title: "My Learning Goals",
        description: "Set and track your personal learning objectives and competency targets",
        actionText: "Set Goals",
        badge: "Personal",
        progress: 65,
        completedModules: 13,
        totalModules: 20
      },
      {
        id: "s2",
        icon: <Trophy className="h-6 w-6 text-yellow-600" />,
        title: "Achievement Showcase",
        description: "Display your completed projects, skills, and competency achievements",
        actionText: "View Showcase",
        badge: "Showcase",
        progress: 80,
        completedModules: 24,
        totalModules: 30
      },
      {
        id: "s3",
        icon: <Calculator className="h-6 w-6 text-emerald-600" />,
        title: "Skill Builder",
        description: "Interactive exercises to develop specific competencies and skills",
        actionText: "Practice Skills",
        badge: "Interactive",
        progress: 45,
        completedModules: 18,
        totalModules: 40
      },
      {
        id: "s4",
        icon: <Globe className="h-6 w-6 text-blue-600" />,
        title: "Real-World Projects",
        description: "Apply your learning to solve actual community and global challenges",
        actionText: "Join Project",
        badge: "Impact",
        progress: 35,
        completedModules: 7,
        totalModules: 20
      },
      {
        id: "s5",
        icon: <Users2 className="h-6 w-6 text-purple-600" />,
        title: "Peer Collaboration",
        description: "Work with classmates on group projects and peer learning activities",
        actionText: "Find Partners",
        badge: "Social",
        progress: 60,
        completedModules: 12,
        totalModules: 20
      },
      {
        id: "s6",
        icon: <Map className="h-6 w-6 text-cyan-600" />,
        title: "Career Pathways",
        description: "Explore future career options and plan your educational journey",
        actionText: "Explore Careers",
        badge: "Future",
        progress: 25,
        completedModules: 3,
        totalModules: 12
      }
    ]
  }), []);

  const learningPaths = useMemo(() => [
    {
      id: 1,
      title: "Advanced Mathematics Track",
      description: "Accelerated pathway for mathematics competencies",
      competencies: 8,
      completed: 5,
      estimatedCompletion: "December 2025"
    },
    {
      id: 2,
      title: "STEM Integration Pathway", 
      description: "Cross-curricular science, technology, engineering, and math",
      competencies: 12,
      completed: 7,
      estimatedCompletion: "March 2026"
    }
  ], []);

  const getStatusBadge = useMemo(() => (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600 hover:bg-green-700">Completed</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-600 hover:bg-blue-700">In Progress</Badge>;
      case "near-complete":
        return <Badge className="bg-orange-600 hover:bg-orange-700">Near Complete</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  }, []);

  // Show Assessment Book if selected
  if (showAssessmentBook) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto p-4 sm:p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowAssessmentBook(false)}
                className="mb-4"
              >
                ← Back to CBC Hub
              </Button>
            </div>
            <AssessmentBook />
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto p-4 sm:p-6 space-y-6">
          {/* Enhanced Header Section */}
          <header className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-6 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <BookOpen className="h-10 w-10 text-indigo-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    CBC Curriculum Hub
                    <Badge className="ml-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {user?.role === 'teacher' ? 'Teacher' : user?.role === 'student' ? 'Student' : 'Parent'} Mode
                    </Badge>
                  </h1>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Your personalized guide to Kenya's Competency-Based Curriculum
                  </p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </header>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Competencies</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                    <p className="text-sm text-green-600 dark:text-green-400">+3 this semester</p>
                  </div>
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">75% completion rate</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Portfolio Items</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">+12 this month</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Next Assessment</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">5 days</p>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Mathematical Reasoning</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Role Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="parent" className="flex gap-2">
                <User className="h-4 w-4" />
                Parents
              </TabsTrigger>
              <TabsTrigger value="teacher" className="flex gap-2">
                <GraduationCap className="h-4 w-4" />
                Teachers
              </TabsTrigger>
              <TabsTrigger value="student" className="flex gap-2">
                <BookUser className="h-4 w-4" />
                Students
              </TabsTrigger>
            </TabsList>
          
          {/* Parent Tab Content */}
          <TabsContent value="parent" className="space-y-6">
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              {roleCards.parent.map((card) => (
                <Card key={card.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        {card.badge && (
                          <Badge className="mt-1" variant="secondary">
                            {card.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{card.description}</p>
                    
                    {/* Progress Tracker */}
                    {card.progress > 0 && (
                      <div className="mb-4">
                        <Progress 
                          value={card.progress} 
                          className="h-2" 
                        />
                        <p className="text-xs mt-1 text-gray-500">
                          {card.completedModules}/{card.totalModules} modules explored
                        </p>
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full">
                      {card.actionText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Teacher Tab Content */}
          <TabsContent value="teacher" className="space-y-6">
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              {roleCards.teacher.map((card) => (
                <Card key={card.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        {card.badge && (
                          <Badge className="mt-1" variant="secondary">
                            {card.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{card.description}</p>
                    
                    {/* Progress Tracker */}
                    <div className="mb-4">
                      <Progress 
                        value={card.progress} 
                        className="h-2" 
                      />
                      <p className="text-xs mt-1 text-gray-500">
                        {card.completedModules}/{card.totalModules} items completed
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (card.id === "assessment-book") {
                          setShowAssessmentBook(true);
                        }
                      }}
                    >
                      {card.actionText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Student Tab Content */}
          <TabsContent value="student" className="space-y-6">
            <div className="grid gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
              {roleCards.student.map((card) => (
                <Card key={card.id} className="hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-indigo-50 dark:bg-indigo-950/50">
                        {card.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        {card.badge && (
                          <Badge className="mt-1" variant="secondary">
                            {card.badge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{card.description}</p>
                    
                    {/* Progress Tracker */}
                    <div className="mb-4">
                      <Progress 
                        value={card.progress} 
                        className="h-2" 
                      />
                      <p className="text-xs mt-1 text-gray-500">
                        {card.completedModules}/{card.totalModules} activities completed
                      </p>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      {card.actionText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          </Tabs>

          {/* Quick-Action Floating Button */}
          <div className="fixed bottom-6 right-6">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="rounded-full p-6 shadow-xl bg-indigo-600 hover:bg-indigo-700">
                  <MessageCircleQuestion className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Need help with CBC? Click for support</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default CBEHub;