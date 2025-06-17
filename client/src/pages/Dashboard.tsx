import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Settings, 
  FolderOpen, 
  BarChart3, 
  Gamepad2, 
  Heart, 
  Star,
  Target,
  Clock,
  TrendingUp,
  Award,
  Globe
} from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
  });

  // Determine academic level based on user profile
  const getAcademicLevel = () => {
    if (!user) return 'primary';
    
    // Determine from user's role and grade
    if (user.role === 'student') {
      // This would come from student profile in real implementation
      const grade = 5; // Example grade
      if (grade <= 3) return 'primary';
      if (grade <= 8) return 'junior';
      if (grade <= 12) return 'senior';
      return 'college';
    }
    
    if (user.role === 'teacher') return 'senior';
    if (user.role === 'admin') return 'college';
    return 'junior';
  };

  const academicLevel = getAcademicLevel();

  // Primary Dashboard (Ages 5-8)
  const renderPrimaryDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Learning Space</h1>
          <p className="text-xl text-gray-600">Let's learn and have fun!</p>
          {user && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold text-gray-700">Hello, {user.firstName}!</span>
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link href="/my-locker">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-blue-200 hover:border-blue-300 bg-blue-50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-blue-700 mb-4">
                  <FolderOpen className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">My Backpack</h3>
                <p className="text-gray-600 text-lg">Save your favorite lessons and stories</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/digital-library">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-green-200 hover:border-green-300 bg-green-50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-700 mb-4">
                  <BookOpen className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Story Library</h3>
                <p className="text-gray-600 text-lg">Books, videos, and fun activities</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-purple-200 hover:border-purple-300 bg-purple-50">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 text-purple-700 mb-4">
                <Gamepad2 className="h-10 w-10" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Learning Games</h3>
              <p className="text-gray-600 text-lg">Play and learn together</p>
            </CardContent>
          </Card>

          <Link href="/family-controls">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-4 border-pink-200 hover:border-pink-300 bg-pink-50">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-pink-100 text-pink-700 mb-4">
                  <Heart className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Family Corner</h3>
                <p className="text-gray-600 text-lg">Share with mom and dad</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );

  // Junior Secondary Dashboard (Ages 9-14)
  const renderJuniorDashboard = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Dashboard</h1>
          <p className="text-lg text-gray-600">Explore subjects and build knowledge</p>
          {user && (
            <p className="text-lg text-gray-500 mt-2">Welcome back, {user.firstName}!</p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-700">12</p>
              <p className="text-sm text-blue-600">Resources Saved</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4 text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">85%</p>
              <p className="text-sm text-green-600">Assignment Score</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-700">2.5h</p>
              <p className="text-sm text-purple-600">Study Time</p>
            </CardContent>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4 text-center">
              <Award className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-700">7</p>
              <p className="text-sm text-orange-600">Achievements</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/my-locker">
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-green-50 border-2 border-green-200 hover:border-green-300">
              <CardContent className="p-6 text-center">
                <FolderOpen className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800">My Locker</h3>
                <p className="text-gray-600 text-sm mt-1">Personal study space</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/digital-library">
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-purple-50 border-2 border-purple-200 hover:border-purple-300">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800">Library</h3>
                <p className="text-gray-600 text-sm mt-1">Educational resources</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/scheduling">
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-orange-50 border-2 border-orange-200 hover:border-orange-300">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800">Schedule</h3>
                <p className="text-gray-600 text-sm mt-1">Classes and events</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/tutor-hub">
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-teal-50 border-2 border-teal-200 hover:border-teal-300">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800">Get Help</h3>
                <p className="text-gray-600 text-sm mt-1">Tutoring support</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/family-controls">
            <Card className="hover:shadow-lg transition-all cursor-pointer bg-pink-50 border-2 border-pink-200 hover:border-pink-300">
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 text-pink-600 mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-gray-800">Family</h3>
                <p className="text-gray-600 text-sm mt-1">Parent portal</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-all cursor-pointer bg-blue-50 border-2 border-blue-200 hover:border-blue-300">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold text-gray-800">Progress</h3>
              <p className="text-gray-600 text-sm mt-1">Track learning</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Senior Secondary Dashboard (Ages 15-18)
  const renderSeniorDashboard = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Portal</h1>
            <p className="text-gray-600">Prepare for your future</p>
          </div>
          {user && (
            <div className="text-right">
              <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-gray-500">Grade 11 Student</p>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overall GPA</CardDescription>
              <CardTitle className="text-2xl">3.8</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">+0.2 this term</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Assignments Due</CardDescription>
              <CardTitle className="text-2xl">3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-600">2 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Study Hours</CardDescription>
              <CardTitle className="text-2xl">24h</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-600">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>College Prep</CardDescription>
              <CardTitle className="text-2xl">78%</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-600">Applications ready</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Access Modules */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Link href="/">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </Button>
          </Link>

          <Link href="/my-locker">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <FolderOpen className="h-5 w-5" />
              <span className="text-sm font-medium">My Locker</span>
            </Button>
          </Link>

          <Link href="/digital-library">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <BookOpen className="h-5 w-5" />
              <span className="text-sm font-medium">Library</span>
            </Button>
          </Link>

          <Link href="/scheduling">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Schedule</span>
            </Button>
          </Link>

          <Link href="/tutor-hub">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <Users className="h-5 w-5" />
              <span className="text-sm font-medium">Tutoring</span>
            </Button>
          </Link>

          <Link href="/analytics">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">Progress</span>
            </Button>
          </Link>

          <Link href="/settings">
            <Button variant="outline" className="h-24 flex-col gap-2 hover:bg-gray-100 w-full">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // College Dashboard (Ages 18+)
  const renderCollegeDashboard = () => (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">EdVirons Portal</h1>
            <p className="text-sm text-gray-500">Advanced learning management</p>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-gray-500">{user.role || 'Student'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2 px-4 py-2 border-b-2 border-blue-500">
              <BarChart3 className="h-4 w-4" />
              Overview
            </Button>
          </Link>

          <Link href="/my-locker">
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <FolderOpen className="h-4 w-4" />
              Workspace
            </Button>
          </Link>

          <Link href="/digital-library">
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <BookOpen className="h-4 w-4" />
              Library
            </Button>
          </Link>

          <Link href="/scheduling">
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <Calendar className="h-4 w-4" />
              Calendar
            </Button>
          </Link>

          <Link href="/tutor-hub">
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <Users className="h-4 w-4" />
              Support
            </Button>
          </Link>

          <Link href="/analytics">
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>

          <Link href="/school-management">
            <Button variant="ghost" className="gap-2 px-4 py-2">
              <Settings className="h-4 w-4" />
              Management
            </Button>
          </Link>
        </div>
        
        {/* Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Academic Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">4.2</p>
                    <p className="text-sm text-gray-600">Current GPA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">18</p>
                    <p className="text-sm text-gray-600">Credits Earned</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">92%</p>
                    <p className="text-sm text-gray-600">Attendance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Submitted assignment for Advanced Calculus</p>
                    <Badge variant="outline" className="ml-auto">2h ago</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm">Joined study group session</p>
                    <Badge variant="outline" className="ml-auto">1d ago</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <p className="text-sm">Downloaded research materials</p>
                    <Badge variant="outline" className="ml-auto">2d ago</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Access Library
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Find Tutor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Physics Lab Report</p>
                    <Badge variant="destructive">Tomorrow</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Literature Essay</p>
                    <Badge variant="secondary">3 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">Math Problem Set</p>
                    <Badge variant="outline">1 week</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  // Return appropriate dashboard based on academic level
  if (academicLevel === 'primary') return renderPrimaryDashboard();
  if (academicLevel === 'junior') return renderJuniorDashboard();
  if (academicLevel === 'senior') return renderSeniorDashboard();
  if (academicLevel === 'college') return renderCollegeDashboard();
  
  return renderJuniorDashboard(); // fallback
}