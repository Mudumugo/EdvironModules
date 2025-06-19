import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Target,
  TrendingUp,
  Calendar,
  CheckCircle,
  PlayCircle,
  FileText,
  Users,
  Star,
  Download,
  Eye
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

const assignments = [
  { 
    id: 1, 
    title: "Mathematics Assignment - Fractions", 
    subject: "Mathematics", 
    dueDate: "2025-06-20", 
    status: "pending", 
    priority: "high",
    progress: 60
  },
  { 
    id: 2, 
    title: "Science Project - Solar System", 
    subject: "Science", 
    dueDate: "2025-06-22", 
    status: "in-progress", 
    priority: "medium",
    progress: 30
  },
  { 
    id: 3, 
    title: "English Essay - My Hero", 
    subject: "English", 
    dueDate: "2025-06-25", 
    status: "completed", 
    priority: "low",
    progress: 100
  }
];

const recentActivities = [
  { action: "Completed Math Quiz", subject: "Mathematics", time: "2 hours ago", score: 95 },
  { action: "Accessed Digital Library", subject: "Reading", time: "3 hours ago", score: null },
  { action: "Submitted Science Report", subject: "Science", time: "Yesterday", score: 88 },
  { action: "Participated in Discussion", subject: "Social Studies", time: "2 days ago", score: null }
];

const learningStats = [
  { title: "Assignments Completed", value: "12", change: "+3 this week", icon: CheckCircle, color: "text-green-600" },
  { title: "Study Hours", value: "24.5", change: "+2.5 this week", icon: Clock, color: "text-blue-600" },
  { title: "Average Score", value: "92%", change: "+5% improvement", icon: TrendingUp, color: "text-purple-600" },
  { title: "Reading Goals", value: "8/10", change: "2 books remaining", icon: BookOpen, color: "text-orange-600" }
];

const upcomingEvents = [
  { title: "Math Test", date: "Tomorrow", time: "10:00 AM", type: "test" },
  { title: "Science Fair", date: "Friday", time: "2:00 PM", type: "event" },
  { title: "Library Session", date: "Monday", time: "11:00 AM", type: "activity" }
];

const quickActions = [
  { title: "Digital Library", description: "Access books and resources", icon: BookOpen, href: "/digital-library", color: "bg-blue-500" },
  { title: "My Locker", description: "View saved content", icon: FileText, href: "/my-locker", color: "bg-green-500" },
  { title: "Apps Hub", description: "Educational apps", icon: PlayCircle, href: "/apps-hub", color: "bg-purple-500" },
  { title: "Calendar", description: "View schedule", icon: Calendar, href: "/calendar", color: "bg-orange-500" }
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filteredAssignments = assignments.filter(assignment => 
    selectedFilter === "all" || assignment.status === selectedFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.firstName || 'Student'}! 
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Download Progress</span>
              <span className="sm:hidden">Progress</span>
            </Button>
            <Button className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              View All Activities
            </Button>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {learningStats.map((stat) => (
            <Card key={stat.title} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-slate-700 flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Assignments */}
          <div className="xl:col-span-2">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <CardTitle className="flex items-center text-base sm:text-lg">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    My Assignments
                  </CardTitle>
                  <div className="flex space-x-2">
                    {["all", "pending", "in-progress", "completed"].map((filter) => (
                      <Button
                        key={filter}
                        variant={selectedFilter === filter ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter)}
                        className="text-xs capitalize"
                      >
                        {filter.replace("-", " ")}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className="p-3 sm:p-4 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base truncate">{assignment.title}</h3>
                            <Badge variant={assignment.priority === 'high' ? 'destructive' : assignment.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {assignment.priority}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2">{assignment.subject} • Due {assignment.dueDate}</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-500 dark:text-gray-400">Progress</span>
                              <span className="font-medium">{assignment.progress}%</span>
                            </div>
                            <Progress value={assignment.progress} className="h-2" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                          <Badge variant={assignment.status === 'completed' ? 'default' : 'outline'} className="text-xs">
                            {assignment.status.replace("-", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {quickActions.map((action) => (
                    <Link key={action.title} href={action.href}>
                      <div className="flex items-center p-3 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                        <div className={`p-2 rounded-full ${action.color} mr-3 flex-shrink-0`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{action.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.date} at {event.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs ml-2">
                        {event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center text-base sm:text-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{activity.action}</p>
                    {activity.score && (
                      <Badge variant="default" className="text-xs">
                        {activity.score}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-1">{activity.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}