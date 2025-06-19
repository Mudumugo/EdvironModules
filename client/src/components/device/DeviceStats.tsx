import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Monitor, Wifi, Shield, AlertTriangle, TrendingUp, Users } from "lucide-react";

interface DeviceStatsProps {
  stats: {
    total: number;
    online: number;
    offline: number;
    active: number;
    restricted: number;
    maintenance: number;
    batteryLow: number;
    lastUpdate: string;
  };
}

export default function DeviceStats({ stats }: DeviceStatsProps) {
  const onlinePercentage = (stats.online / stats.total) * 100;
  const activePercentage = (stats.active / stats.total) * 100;
  const restrictedPercentage = (stats.restricted / stats.total) * 100;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium truncate">Total Devices</CardTitle>
          <Monitor className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Managed devices
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium truncate">Online</CardTitle>
          <Wifi className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.online}</div>
          <div className="flex items-center gap-2">
            <Progress value={onlinePercentage} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">
              {Math.round(onlinePercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          <div className="flex items-center gap-2">
            <Progress value={activePercentage} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">
              {Math.round(activePercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Restricted</CardTitle>
          <Shield className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.restricted}</div>
          <div className="flex items-center gap-2">
            <Progress value={restrictedPercentage} className="h-1 flex-1" />
            <span className="text-xs text-muted-foreground">
              {Math.round(restrictedPercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stats.maintenance}</div>
          <p className="text-xs text-muted-foreground">
            Need attention
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Low Battery</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.batteryLow}</div>
          <p className="text-xs text-muted-foreground">
            Need charging
          </p>
        </CardContent>
      </Card>
    </div>
  );
}