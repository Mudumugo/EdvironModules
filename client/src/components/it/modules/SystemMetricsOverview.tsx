import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Network, 
  HardDrive, 
  Shield,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { SystemMetrics } from "../types";

interface SystemMetricsOverviewProps {
  systemData: SystemMetrics;
}

export function SystemMetricsOverview({ systemData }: SystemMetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Server Status</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemData.serverStatus.online}/{systemData.serverStatus.total}</div>
          <p className="text-xs text-muted-foreground">
            {systemData.serverStatus.offline} offline, {systemData.serverStatus.maintenance} maintenance
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Online
            </Badge>
            {systemData.serverStatus.offline > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Issues
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Network Health</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{systemData.networkStatus.uptime}%</div>
          <p className="text-xs text-muted-foreground">
            {systemData.networkStatus.latency}ms latency, {systemData.networkStatus.connectedDevices} devices
          </p>
          <Progress value={systemData.networkStatus.bandwidth} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            Bandwidth: {systemData.networkStatus.bandwidth}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {((systemData.storage.used / systemData.storage.total) * 100).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {systemData.storage.used}GB / {systemData.storage.total}GB used
          </p>
          <Progress 
            value={(systemData.storage.used / systemData.storage.total) * 100} 
            className="mt-2" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            Backup: {systemData.storage.backupStatus}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Security Status</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{systemData.security.threats}</div>
          <p className="text-xs text-muted-foreground">
            Active threats detected
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="outline" className="text-xs">
              {systemData.security.updates} updates
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {systemData.security.vulnerabilities} vulnerabilities
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last scan: {systemData.security.lastScan}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}