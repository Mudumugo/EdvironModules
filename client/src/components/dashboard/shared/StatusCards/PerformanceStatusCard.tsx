import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle
} from "lucide-react";

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  period: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedDate: string;
  category: string;
  points: number;
}

interface PerformanceStatusCardProps {
  metrics: PerformanceMetric[];
  achievements: Achievement[];
  overallScore: number;
  loading?: boolean;
  onViewAnalytics?: () => void;
  onViewAchievements?: () => void;
}

export function PerformanceStatusCard({ 
  metrics, 
  achievements, 
  overallScore, 
  loading = false, 
  onViewAnalytics, 
  onViewAchievements 
}: PerformanceStatusCardProps) {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string, change: number) => {
    if (trend === 'up' && change > 0) return 'text-green-600';
    if (trend === 'down' && change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const recentAchievements = achievements.slice(0, 2);
  const completedMetrics = metrics.filter(m => m.value >= m.target).length;
  const metricsProgress = metrics.length > 0 ? (completedMetrics / metrics.length) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance
          </CardTitle>
          {onViewAnalytics && (
            <Button variant="ghost" size="sm" onClick={onViewAnalytics}>
              View Analytics
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}
            </div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{completedMetrics}</div>
            <div className="text-sm text-gray-500">Goals Met</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Goal Progress</span>
            <span>{completedMetrics}/{metrics.length}</span>
          </div>
          <Progress value={metricsProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Key Metrics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Key Metrics
            </h4>
            <div className="space-y-2">
              {metrics.slice(0, 3).map((metric) => (
                <div key={metric.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{metric.name}</span>
                      {metric.value >= metric.target && (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {metric.value} / {metric.target} {metric.unit}
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-1 mt-1" 
                    />
                  </div>
                  
                  <div className="ml-3 flex items-center gap-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs ${getTrendColor(metric.trend, metric.change)}`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recent Achievements
                </h4>
                {onViewAchievements && (
                  <Button variant="ghost" size="sm" onClick={onViewAchievements}>
                    View All
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                {recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2 border rounded">
                    <div className="p-1 rounded bg-yellow-100 dark:bg-yellow-900">
                      <Award className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{achievement.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{achievement.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(achievement.earnedDate).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{achievement.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Summary */}
          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">{achievements.length}</div>
                <div className="text-xs text-gray-500">Total Achievements</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {achievements.reduce((sum, a) => sum + a.points, 0)}
                </div>
                <div className="text-xs text-gray-500">Total Points</div>
              </div>
            </div>
          </div>

          {overallScore < 70 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 text-orange-800">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Performance Alert</span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                Consider reviewing study habits and seeking additional support to improve performance.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}