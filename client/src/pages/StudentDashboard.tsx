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
import { DashboardSwitcher, type EducationLevel } from "@/components/dashboard/DashboardSwitcher";
import { dashboardContentByLevel } from "@/data/dashboardContent";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [currentLevel, setCurrentLevel] = useState<EducationLevel>('primary');
  
  const dashboardData = dashboardContentByLevel[currentLevel];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
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
            title="Total Subjects"
            value={dashboardData.stats.totalSubjects.toString()}
            change={currentLevel === 'primary' ? '+1 this semester' : currentLevel === 'junior_secondary' ? '+2 this year' : '+3 this year'}
            icon={<BookOpen className="h-6 w-6" />}
            color="bg-blue-500"
          />
          <StatsCard
            title="Completed Lessons"
            value={dashboardData.stats.completedLessons.toString()}
            change={currentLevel === 'primary' ? '+5 this week' : currentLevel === 'junior_secondary' ? '+8 this week' : '+12 this week'}
            icon={<CheckCircle className="h-6 w-6" />}
            color="bg-green-500"
          />
          <StatsCard
            title="Average Grade"
            value={dashboardData.stats.averageGrade}
            change={currentLevel === 'primary' ? '+0.2 improvement' : currentLevel === 'junior_secondary' ? '+0.3 improvement' : '+0.1 improvement'}
            icon={<Star className="h-6 w-6" />}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Study Hours"
            value={`${dashboardData.stats.studyHours}h`}
            change="This week"
            icon={<Clock className="h-6 w-6" />}
            color="bg-purple-500"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Current Subjects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Your Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.subjects.map((subject) => (
                    <div key={subject.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 ${subject.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                          {subject.icon}
                        </div>
                        <div>
                          <h4 className="font-medium">{subject.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {subject.completed}/{subject.lessons} lessons completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{subject.progress}%</p>
                          <Progress value={subject.progress} className="w-20 h-2" />
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Upcoming Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{assignment.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{assignment.subject}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge 
                          variant={assignment.status === 'completed' ? 'default' : assignment.status === 'overdue' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {assignment.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{assignment.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.achievements.map((achievement) => (
                    <div key={achievement.id} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.earned ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'opacity-60'}`}>
                      <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                        {achievement.earned && achievement.date && (
                          <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Earned on {achievement.date}</p>
                        )}
                      </div>
                      {achievement.earned && <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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