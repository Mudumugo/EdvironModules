import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Trophy,
  Star,
  Play,
  CheckCircle,
  Calendar,
  Bell,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { DashboardSwitcher, type EducationLevel } from "@/components/dashboard/DashboardSwitcher";
import { dashboardContentByLevel } from "@/data/dashboardContent";
import { LoadingDashboard } from "@/components/dashboard/LoadingDashboard";
import { Suspense } from "react";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<EducationLevel>('primary');
  
  const dashboardData = dashboardContentByLevel[currentLevel];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Suspense fallback={<LoadingDashboard />}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white truncate">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Ready to continue your learning journey?</p>
          </div>
          
          {/* Dashboard Switcher and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <DashboardSwitcher 
              currentLevel={currentLevel} 
              onLevelChange={setCurrentLevel} 
            />
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button size="sm" className="flex-1 sm:flex-none">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Ask Teacher</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Modules Accessed"
            value={dashboardData.stats.modulesAccessed.toString()}
            change="This week"
            icon={<BookOpen className="h-6 w-6" />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Resources Viewed"
            value={dashboardData.stats.resourcesViewed.toString()}
            change="This month"
            icon={<CheckCircle className="h-6 w-6" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Time Spent"
            value={dashboardData.stats.timeSpent}
            change="This week"
            icon={<Clock className="h-6 w-6" />}
            color="bg-purple-500"
          />
          <StatsCard
            title="Last Login"
            value={dashboardData.stats.lastLogin.split(' ')[0]}
            change={dashboardData.stats.lastLogin.split(' ').slice(1).join(' ')}
            icon={<Star className="h-6 w-6" />}
            color="bg-orange-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Edvirons Modules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Modules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.modules.map((module) => (
                    <Link key={module.id} href={module.href}>
                      <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 ${module.color} rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0`}>
                            {module.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {module.name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              {module.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {module.features.slice(0, 2).map((feature, index) => (
                                <span key={index} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                              {module.features.length > 2 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                                  +{module.features.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button size="sm" variant="outline" className="group-hover:bg-blue-50 group-hover:border-blue-200 dark:group-hover:bg-blue-900/20">
                            <Play className="h-3 w-3 mr-1" />
                            Open
                          </Button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                        activity.type === 'accessed' ? 'bg-blue-500' :
                        activity.type === 'created' ? 'bg-green-500' :
                        activity.type === 'completed' ? 'bg-purple-500' : 'bg-orange-500'
                      }`}>
                        {activity.type === 'accessed' ? '👁️' :
                         activity.type === 'created' ? '➕' :
                         activity.type === 'completed' ? '✅' : '📤'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{activity.module}</p>
                      </div>
                      <p className="text-xs text-gray-500 flex-shrink-0">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Announcements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.announcements.map((announcement) => (
                    <div key={announcement.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{announcement.title}</h4>
                        <Badge 
                          variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{announcement.content}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{announcement.author}</span>
                        <span>{announcement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </Suspense>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, value, change, icon, color }: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{change}</p>
          </div>
          <div className={`${color} rounded-full p-2 sm:p-3 text-white flex-shrink-0 ml-2`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}