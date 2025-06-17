import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, AlertTriangle, Activity, Star, Timer, Monitor, Tablet, Smartphone, Globe } from "lucide-react";
import type { ActivityLog, Child } from "@/hooks/useFamilyControls";

interface ActivityLogItemProps {
  activity: ActivityLog;
  child?: Child;
}

export function ActivityLogItem({ activity, child }: ActivityLogItemProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "achievement": return <Award className="h-4 w-4 text-yellow-600" />;
      case "learning": return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "restriction": return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "computer": return <Monitor className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      case "phone": return <Smartphone className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getActivityIcon(activity.type)}
            <div>
              <div className="font-medium">{activity.activity}</div>
              <div className="text-sm text-muted-foreground">
                {child?.firstName} {child?.lastName} • {activity.subject}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {activity.score && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                <span>{activity.score}%</span>
              </div>
            )}
            {activity.duration > 0 && (
              <div className="flex items-center gap-1">
                <Timer className="h-3 w-3" />
                <span>{activity.duration}m</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              {getDeviceIcon(activity.device)}
              <span className="capitalize">{activity.device}</span>
            </div>
            <span>{format(parseISO(activity.timestamp), "MMM d, HH:mm")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}