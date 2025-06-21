import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Target,
  Calendar,
  TrendingUp,
  Play,
  Pause
} from "lucide-react";

interface CourseProgress {
  id: string;
  courseName: string;
  subject: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  estimatedTimeLeft: string;
  lastAccessed: string;
  status: 'active' | 'completed' | 'paused';
  nextLesson?: string;
}

interface LearningGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface ProgressStatusCardProps {
  courses: CourseProgress[];
  goals: LearningGoal[];
  weeklyProgress: number;
  totalStudyTime: string;
  loading?: boolean;
  onViewProgress?: () => void;
  onResumeCourse?: (course: CourseProgress) => void;
}

export function ProgressStatusCard({ 
  courses, 
  goals, 
  weeklyProgress, 
  totalStudyTime, 
  loading = false, 
  onViewProgress, 
  onResumeCourse 
}: ProgressStatusCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-orange-500" />;
      default:
        return <Play className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'paused':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Paused</Badge>;
      default:
        return <Badge variant="outline" className="border-blue-200 text-blue-800">Active</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-green-500 bg-green-50';
    }
  };

  const activeCourses = courses.filter(c => c.status === 'active');
  const completedCourses = courses.filter(c => c.status === 'completed');
  const averageProgress = courses.length > 0 
    ? courses.reduce((sum, course) => sum + course.progress, 0) / courses.length
    : 0;

  const urgentGoals = goals.filter(g => {
    const daysLeft = Math.ceil((new Date(g.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && g.progress < 100;
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Progress
          </CardTitle>
          {onViewProgress && (
            <Button variant="ghost" size="sm" onClick={onViewProgress}>
              View Details
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{averageProgress.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Avg Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedCourses.length}</div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Weekly Goal</span>
            <span>{weeklyProgress}%</span>
          </div>
          <Progress value={weeklyProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Active Courses */}
          {activeCourses.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Continue Learning
              </h4>
              <div className="space-y-2">
                {activeCourses.slice(0, 2).map((course) => (
                  <div 
                    key={course.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => onResumeCourse?.(course)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm truncate">{course.courseName}</h5>
                        {getStatusBadge(course.status)}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                        <span>{course.subject}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.estimatedTimeLeft}
                        </span>
                        <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      </div>
                      <Progress value={course.progress} className="h-1" />
                    </div>
                    
                    <div className="ml-3 flex items-center gap-2">
                      <span className="text-sm font-medium">{course.progress}%</span>
                      {getStatusIcon(course.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Goals */}
          {goals.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Learning Goals
              </h4>
              <div className="space-y-2">
                {goals.slice(0, 2).map((goal) => (
                  <div 
                    key={goal.id}
                    className={`p-3 border-l-4 rounded-r ${getPriorityColor(goal.priority)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-medium text-sm">{goal.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {goal.priority} priority
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{goal.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                      <span>{goal.category}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {new Date(goal.targetDate).toLocaleDateString()}
                      </span>
                    </div>
                    <Progress value={goal.progress} className="h-1" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Statistics */}
          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">{activeCourses.length}</div>
                <div className="text-xs text-gray-500">Active Courses</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">{totalStudyTime}</div>
                <div className="text-xs text-gray-500">Study Time</div>
              </div>
            </div>
          </div>

          {/* Urgent Goals Alert */}
          {urgentGoals.length > 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Urgent Goals</span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                {urgentGoals.length} goal{urgentGoals.length > 1 ? 's' : ''} due within 7 days. 
                Focus on completing these first.
              </p>
            </div>
          )}

          {courses.length === 0 && goals.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No active courses or goals</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={onViewProgress}>
                Start Learning
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}