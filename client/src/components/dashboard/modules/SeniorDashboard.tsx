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
  Award,
  Globe,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { UserRole } from "@shared/schema";

interface SeniorDashboardProps {
  user: any;
  stats: any;
}

export function SeniorDashboard({ user, stats }: SeniorDashboardProps) {
  const isTeacher = user?.role === UserRole.TEACHER;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isTeacher ? 'Teacher Dashboard' : isAdmin ? 'Admin Dashboard' : 'Academic Dashboard'}
            </h1>
            <p className="text-xl text-gray-600">
              {isTeacher ? 'Manage your classes and track student progress' : 
               isAdmin ? 'Oversee school operations and analytics' : 
               'Advanced learning and research tools'}
            </p>
          </div>
          {user && (
            <div className="text-right">
              <Badge variant="outline" className="text-lg px-4 py-2 mb-2">
                {user.firstName} {user.lastName}
              </Badge>
              <div className="text-sm text-gray-600">{user.role}</div>
            </div>
          )}
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isTeacher ? 'Active Students' : isAdmin ? 'Total Users' : 'Courses Enrolled'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.activeUsers || 147}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">+12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isTeacher ? 'Assignments Graded' : isAdmin ? 'Content Items' : 'Assignments Completed'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.completedAssignments || 89}</p>
                </div>
                <Award className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <Target className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-blue-600">On track this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isTeacher ? 'Class Average' : isAdmin ? 'System Performance' : 'Average Score'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.averagePerformance || 92}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-600">Above target</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {isTeacher ? 'Hours Taught' : isAdmin ? 'Active Sessions' : 'Study Hours'}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalHours || 156}</p>
                </div>
                <Globe className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-gray-600">This semester</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <Link href="/digital-library">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 text-blue-700 mb-3 mx-auto">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Digital Library</CardTitle>
                <CardDescription>Access academic resources and research materials</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/my-locker">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-green-700 mb-3 mx-auto">
                  <FolderOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">My Workspace</CardTitle>
                <CardDescription>Organize projects, notes, and research</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 text-purple-700 mb-3 mx-auto">
                <BarChart3 className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Analytics</CardTitle>
              <CardDescription>
                {isTeacher ? 'Student performance insights' : 
                 isAdmin ? 'System and usage analytics' : 
                 'Track your academic progress'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 mb-3 mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">
                {isTeacher ? 'My Classes' : isAdmin ? 'User Management' : 'Study Groups'}
              </CardTitle>
              <CardDescription>
                {isTeacher ? 'Manage your classes and students' : 
                 isAdmin ? 'Manage users and permissions' : 
                 'Collaborate with peers'}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center pb-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 mb-3 mx-auto">
                <Calendar className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">Schedule</CardTitle>
              <CardDescription>
                {isTeacher ? 'Class timetables and events' : 
                 isAdmin ? 'School calendar management' : 
                 'Academic calendar and deadlines'}
              </CardDescription>
            </CardHeader>
          </Card>

          {(isTeacher || isAdmin) && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 text-gray-700 mb-3 mx-auto">
                  <Settings className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>
                  {isAdmin ? 'System configuration' : 'Account and preferences'}
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}