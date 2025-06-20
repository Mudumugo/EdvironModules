import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Mail, 
  AlertTriangle, 
  Archive, 
  TrendingUp,
  Clock,
  Users,
  Target
} from "lucide-react";
import { NotificationStats as StatsType, NOTIFICATION_CATEGORIES, NOTIFICATION_TYPES } from "./types";

interface NotificationStatsProps {
  stats: StatsType;
}

export function NotificationStats({ stats }: NotificationStatsProps) {
  const getCategoryInfo = (category: string) => {
    return NOTIFICATION_CATEGORIES.find(c => c.value === category) || NOTIFICATION_CATEGORIES[0];
  };

  const getTypeInfo = (type: string) => {
    return NOTIFICATION_TYPES.find(t => t.value === type) || NOTIFICATION_TYPES[0];
  };

  const unreadPercentage = stats.total > 0 ? (stats.unread / stats.total) * 100 : 0;
  const urgentPercentage = stats.total > 0 ? (stats.urgent / stats.total) * 100 : 0;

  const topCategories = Object.entries(stats.byCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topTypes = Object.entries(stats.byType)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.unread}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.urgent}</div>
            <div className="text-sm text-gray-600">Urgent</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Archive className="h-6 w-6 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600">{stats.archived}</div>
            <div className="text-sm text-gray-600">Archived</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Unread Notifications</span>
              <span className="text-sm text-gray-600">
                {stats.unread} of {stats.total} ({unreadPercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={unreadPercentage} className="h-2" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Urgent Notifications</span>
              <span className="text-sm text-gray-600">
                {stats.urgent} of {stats.total} ({urgentPercentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={urgentPercentage} className="h-2 bg-orange-200" />
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            By Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topCategories.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications to categorize</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topCategories.map(([category, count]) => {
                const categoryInfo = getCategoryInfo(category);
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-${categoryInfo.color}-500`} />
                        <span className="text-sm font-medium">{categoryInfo.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{count}</span>
                        <Badge variant="outline" className="text-xs">
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}

              {Object.keys(stats.byCategory).length > 3 && (
                <div className="text-xs text-gray-500 pt-2">
                  +{Object.keys(stats.byCategory).length - 3} more categories
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Type Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            By Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topTypes.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications to analyze</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {topTypes.map(([type, count]) => {
                const typeInfo = getTypeInfo(type);
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full bg-${typeInfo.color}-100 flex items-center justify-center`}>
                        <div className={`w-2 h-2 rounded-full bg-${typeInfo.color}-500`} />
                      </div>
                      <span className="font-medium">{typeInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">{count}</span>
                      <Badge variant="outline">
                        {percentage.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {stats.unread > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <Mail className="h-4 w-4" />
                <span>You have {stats.unread} unread notification{stats.unread !== 1 ? 's' : ''}</span>
              </div>
            )}
            
            {stats.urgent > 0 && (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                <span>{stats.urgent} urgent notification{stats.urgent !== 1 ? 's' : ''} need attention</span>
              </div>
            )}
            
            {stats.unread === 0 && stats.urgent === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <Users className="h-4 w-4" />
                <span>All caught up! No urgent notifications.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}