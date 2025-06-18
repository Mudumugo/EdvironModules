import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Timer, Bell } from "lucide-react";

interface SchedulingStatsProps {
  stats: {
    totalEvents: number;
    todayEvents: number;
    thisWeekEvents: number;
    upcomingEvents: number;
  };
}

export function SchedulingStats({ stats }: SchedulingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalEvents}</p>
            </div>
            <CalendarDays className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Events</p>
              <p className="text-2xl font-bold text-green-600">{stats.todayEvents}</p>
            </div>
            <Timer className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-purple-600">{stats.thisWeekEvents}</p>
            </div>
            <Timer className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-orange-600">{stats.upcomingEvents}</p>
            </div>
            <Bell className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}