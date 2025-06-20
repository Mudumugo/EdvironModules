import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Target, Calendar } from "lucide-react";
import { ScreenTimeData, APP_CATEGORIES } from "./types";

interface ScreenTimeChartProps {
  screenTimeData: ScreenTimeData;
}

export function ScreenTimeChart({ screenTimeData }: ScreenTimeChartProps) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const getDailyProgress = () => {
    return Math.min((screenTimeData.today / screenTimeData.dailyLimit) * 100, 100);
  };

  const getWeeklyProgress = () => {
    return Math.min((screenTimeData.thisWeek / screenTimeData.weeklyLimit) * 100, 100);
  };

  const getCategoryInfo = (category: string) => {
    return APP_CATEGORIES.find(cat => cat.value === category) || APP_CATEGORIES[0];
  };

  const sortedCategories = Object.entries(screenTimeData.categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const recentHistory = screenTimeData.history.slice(-7);
  const averageDaily = recentHistory.reduce((sum, entry) => sum + entry.totalTime, 0) / recentHistory.length;

  const isOverLimit = screenTimeData.today >= screenTimeData.dailyLimit;
  const timeRemaining = Math.max(0, screenTimeData.dailyLimit - screenTimeData.today);

  return (
    <div className="space-y-4">
      {/* Today's Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Today's Screen Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Daily Usage</span>
              <span className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-600'}`}>
                {formatTime(screenTimeData.today)} / {formatTime(screenTimeData.dailyLimit)}
              </span>
            </div>
            <Progress 
              value={getDailyProgress()} 
              className={`h-3 ${isOverLimit ? 'bg-red-200' : ''}`}
            />
            {isOverLimit ? (
              <p className="text-xs text-red-600">Daily limit exceeded</p>
            ) : (
              <p className="text-xs text-gray-600">
                {formatTime(timeRemaining)} remaining today
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Weekly Usage</span>
              <span className="text-sm text-gray-600">
                {formatTime(screenTimeData.thisWeek)} / {formatTime(screenTimeData.weeklyLimit)}
              </span>
            </div>
            <Progress value={getWeeklyProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedCategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No usage data available</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([category, time]) => {
                const categoryInfo = getCategoryInfo(category);
                const percentage = (time / screenTimeData.today) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${categoryInfo.color}-500`} />
                        <span className="text-sm font-medium">{categoryInfo.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">{formatTime(time)}</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {recentHistory.map((entry, index) => {
                const dayName = new Date(entry.date).toLocaleDateString('en', { weekday: 'short' });
                const isToday = new Date(entry.date).toDateString() === new Date().toDateString();
                const height = Math.max((entry.totalTime / screenTimeData.dailyLimit) * 60, 8);
                
                return (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-600 mb-2">{dayName}</div>
                    <div className="flex items-end justify-center h-16">
                      <div
                        className={`w-6 rounded-t ${
                          isToday ? 'bg-blue-500' : 'bg-gray-300'
                        } transition-all duration-300`}
                        style={{ height: `${height}px` }}
                        title={`${formatTime(entry.totalTime)} on ${dayName}`}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatTime(entry.totalTime)}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <div className="text-sm font-medium">7-day average</div>
                <div className="text-xs text-gray-600">{formatTime(averageDaily)}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Trend</div>
                <div className={`text-xs ${
                  averageDaily > screenTimeData.dailyLimit ? 'text-red-600' : 'text-green-600'
                }`}>
                  {averageDaily > screenTimeData.dailyLimit ? 'Above limit' : 'Within limit'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}