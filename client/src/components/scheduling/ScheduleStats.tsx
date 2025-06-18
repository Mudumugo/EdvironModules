import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Calendar, Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react";

interface ScheduleStatsProps {
  totalEntries: number;
  totalHours: number;
  activeTeachers: number;
  activeClasses: number;
  conflicts?: number;
  upcomingEvents?: number;
}

export function ScheduleStats({
  totalEntries,
  totalHours,
  activeTeachers,
  activeClasses,
  conflicts = 0,
  upcomingEvents = 0
}: ScheduleStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalEntries}</div>
          <p className="text-xs text-muted-foreground">
            This week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHours}h</div>
          <p className="text-xs text-muted-foreground">
            Total scheduled
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeTeachers}</div>
          <p className="text-xs text-muted-foreground">
            Teaching this week
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeClasses}</div>
          <p className="text-xs text-muted-foreground">
            With sessions
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingEvents}</div>
          <p className="text-xs text-muted-foreground">
            Next 24 hours
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
          <AlertCircle className={`h-4 w-4 ${conflicts > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${conflicts > 0 ? 'text-red-600' : ''}`}>
            {conflicts}
          </div>
          <p className="text-xs text-muted-foreground">
            Scheduling conflicts
          </p>
        </CardContent>
      </Card>
    </div>
  );
}