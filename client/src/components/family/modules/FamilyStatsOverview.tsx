import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Clock, Activity } from "lucide-react";
import { FamilyStats } from "../types";

interface FamilyStatsOverviewProps {
  stats: FamilyStats;
}

export function FamilyStatsOverview({ stats }: FamilyStatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDevices}</div>
          <p className="text-xs text-muted-foreground">
            {stats.onlineDevices} currently online
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs">
              {stats.onlineDevices} online
            </Badge>
            {stats.totalDevices - stats.onlineDevices > 0 && (
              <Badge variant="secondary" className="text-xs">
                {stats.totalDevices - stats.onlineDevices} offline
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Restrictions</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeRestrictions}</div>
          <p className="text-xs text-muted-foreground">
            Across all devices
          </p>
          <Badge variant={stats.activeRestrictions > 0 ? "default" : "secondary"} className="text-xs mt-2">
            {stats.activeRestrictions > 0 ? "Protected" : "No restrictions"}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protected Devices</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.protectedDevices}</div>
          <p className="text-xs text-muted-foreground">
            Child devices with controls
          </p>
          <Badge variant="outline" className="text-xs mt-2">
            {Math.round((stats.protectedDevices / stats.totalDevices) * 100)}% coverage
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Family Safety</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">Secure</div>
          <p className="text-xs text-muted-foreground">
            All children protected
          </p>
          <Badge variant="default" className="text-xs mt-2 bg-green-600">
            All systems active
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}