import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Cpu, Activity, CheckCircle } from "lucide-react";
import { SystemMetrics } from "../types";

interface PerformanceTabProps {
  systemData: SystemMetrics;
}

export function PerformanceTab({ systemData }: PerformanceTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>CPU Usage</span>
              <span>{systemData.performance.cpuUsage}%</span>
            </div>
            <Progress value={systemData.performance.cpuUsage} className="mt-1" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Memory Usage</span>
              <span>{systemData.performance.memoryUsage}%</span>
            </div>
            <Progress value={systemData.performance.memoryUsage} className="mt-1" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Disk Usage</span>
              <span>{systemData.performance.diskUsage}%</span>
            </div>
            <Progress value={systemData.performance.diskUsage} className="mt-1" />
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Network Load</span>
              <span>{systemData.performance.networkLoad}%</span>
            </div>
            <Progress value={systemData.performance.networkLoad} className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Real-time Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Users</span>
              <Badge variant="outline">247 online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Database Connections</span>
              <Badge variant="outline">45/100</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Email Queue</span>
              <Badge variant="outline">12 pending</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Backup Status</span>
              <Badge variant="default">
                <CheckCircle className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}