import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  TrendingUp
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function CBEHub() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const competencies = [
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
  ];

  const portfolioItems = [
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
  ];

  const upcomingAssessments = [
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
  ];

  const learningPaths = [
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
  ];

  const getStatusBadge = (status: string) => {
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
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CBE Hub</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Competency-Based Education Center for {user?.firstName} {user?.lastName}
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="competencies">Competencies</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="assessments">Assessments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {competencies.slice(0, 3).map((comp) => (
                    <div key={comp.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{comp.title}</span>
                        <span className="text-sm text-gray-600">{comp.progress}%</span>
                      </div>
                      <Progress value={comp.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Learning Paths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Learning Paths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {learningPaths.map((path) => (
                    <div key={path.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{path.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm">{path.completed}/{path.competencies} completed</span>
                        <span className="text-sm text-gray-500">{path.estimatedCompletion}</span>
                      </div>
                      <Progress value={(path.completed / path.competencies) * 100} className="h-2 mt-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="competencies" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {competencies.map((comp) => (
                <Card key={comp.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{comp.title}</h3>
                          {getStatusBadge(comp.status)}
                        </div>
                        <p className="text-gray-600 mb-3">{comp.category} • {comp.level}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{comp.progress}%</span>
                          </div>
                          <Progress value={comp.progress} className="h-2" />
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                          <span>Due: {comp.dueDate}</span>
                          <span>Assessments: {comp.completed}/{comp.assessments}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              {portfolioItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <Badge variant="outline">{item.type}</Badge>
                          <Badge variant={item.status === "graded" ? "default" : "secondary"}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{item.subject} • {item.date}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.competencies.map((comp, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="assessments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAssessments.map((assessment) => (
                  <div key={assessment.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{assessment.title}</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          {assessment.competency} • {assessment.duration}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{assessment.date}</span>
                          <Badge variant="outline" className="text-xs">
                            {assessment.type}
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">
                        Prepare
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}