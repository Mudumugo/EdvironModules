import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle } from "lucide-react";
import { DashboardStats } from "../types";

interface PerformanceMetricsProps {
  stats: DashboardStats;
}

export function PerformanceMetrics({ stats }: PerformanceMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Attendance Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Overall Attendance</span>
              <span className="text-sm text-muted-foreground">{stats.attendanceRate}%</span>
            </div>
            <Progress value={stats.attendanceRate} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Target: 95% | Current: {stats.attendanceRate}%
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Graduation Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Success Rate</span>
              <span className="text-sm text-muted-foreground">{stats.graduationRate}%</span>
            </div>
            <Progress value={stats.graduationRate} className="w-full" />
            <p className="text-xs text-muted-foreground">
              Above national average of 94.5%
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}