import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FolderOpen, 
  BarChart3, 
  Target,
  Clock,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";

interface JuniorDashboardProps {
  user: any;
  stats: any;
}

export function JuniorDashboard({ user, stats }: JuniorDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Learning Dashboard</h1>
          <p className="text-xl text-gray-600">Track your progress and explore new topics</p>
          {user && (
            <Badge variant="secondary" className="mt-4 text-lg px-4 py-2">
              Welcome back, {user.firstName}!
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.completedLessons || 12}</div>
              <div className="text-sm text-gray-600">Lessons Complete</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-700 mb-3">
                <Target className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.currentStreak || 5}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 text-purple-700 mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.studyTime || 45}</div>
              <div className="text-sm text-gray-600">Minutes Today</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-700 mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{stats?.averageScore || 85}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/digital-library">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-2 border-blue-200 hover:border-blue-300">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 mb-4 mx-auto">
                  <BookOpen className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Digital Library</CardTitle>
                <CardDescription>Access books, videos, and interactive content</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/my-locker">
            <Card className="hover:scale-105 transition-transform cursor-pointer border-2 border-green-200 hover:border-green-300">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 mb-4 mx-auto">
                  <FolderOpen className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">My Locker</CardTitle>
                <CardDescription>Your saved materials and progress</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Card className="hover:scale-105 transition-transform cursor-pointer border-2 border-purple-200 hover:border-purple-300">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-700 mb-4 mx-auto">
                <BarChart3 className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Progress Reports</CardTitle>
              <CardDescription>Track your learning journey</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:scale-105 transition-transform cursor-pointer border-2 border-indigo-200 hover:border-indigo-300">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-700 mb-4 mx-auto">
                <Users className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Study Groups</CardTitle>
              <CardDescription>Collaborate with classmates</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:scale-105 transition-transform cursor-pointer border-2 border-cyan-200 hover:border-cyan-300">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 text-cyan-700 mb-4 mx-auto">
                <Calendar className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Schedule</CardTitle>
              <CardDescription>View upcoming classes and assignments</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}