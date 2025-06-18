import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Monitor, 
  Server, 
  Wifi, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  HardDrive,
  Cpu,
  Network,
  Database,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";

interface SystemMetrics {
  serverStatus: {
    total: number;
    online: number;
    offline: number;
    maintenance: number;
  };
  networkStatus: {
    bandwidth: number;
    latency: number;
    uptime: number;
    connectedDevices: number;
  };
  storage: {
    total: number;
    used: number;
    available: number;
    backupStatus: string;
  };
  security: {
    threats: number;
    updates: number;
    vulnerabilities: number;
    lastScan: string;
  };
  performance: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    networkLoad: number;
  };
}

export default function ITDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/it/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const mockMetrics: SystemMetrics = {
    serverStatus: {
      total: 15,
      online: 13,
      offline: 1,
      maintenance: 1
    },
    networkStatus: {
      bandwidth: 85.4,
      latency: 12,
      uptime: 99.7,
      connectedDevices: 247
    },
    storage: {
      total: 10240,
      used: 6847,
      available: 3393,
      backupStatus: "completed"
    },
    security: {
      threats: 2,
      updates: 5,
      vulnerabilities: 1,
      lastScan: "2 hours ago"
    },
    performance: {
      cpuUsage: 68,
      memoryUsage: 72,
      diskUsage: 67,
      networkLoad: 45
    }
  };

  const systemData = metrics || mockMetrics;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage school technology infrastructure
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Overview */}
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

      {/* Detailed Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Network Infrastructure</CardTitle>
                <CardDescription>Current network status and connected devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Main Router</span>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>WiFi Access Points</span>
                    <Badge variant="default">8/8 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Network Switches</span>
                    <Badge variant="default">12/12 Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Firewall</span>
                    <Badge variant="default">Protected</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Server Infrastructure</CardTitle>
                <CardDescription>Physical and virtual server status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Web Servers</span>
                    <Badge variant="default">4/4 Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Servers</span>
                    <Badge variant="default">2/2 Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Application Servers</span>
                    <Badge variant="default">6/6 Running</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Servers</span>
                    <Badge variant="secondary">1/2 Running</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance & Tasks</CardTitle>
              <CardDescription>Upcoming maintenance windows and system updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Security Updates</h4>
                      <p className="text-sm text-muted-foreground">Critical system patches pending</p>
                    </div>
                    <Badge variant="destructive">High Priority</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Scheduled: Tonight, 2:00 AM</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Database Optimization</h4>
                      <p className="text-sm text-muted-foreground">Performance tuning and cleanup</p>
                    </div>
                    <Badge variant="secondary">Medium Priority</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Scheduled: Weekend, 6:00 PM</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup Verification</h4>
                      <p className="text-sm text-muted-foreground">Monthly backup integrity check</p>
                    </div>
                    <Badge variant="outline">Routine</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Scheduled: Monthly, 1st Sunday</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Firewall Status</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Antivirus Protection</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Updated
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL Certificates</span>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Expiring Soon
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>VPN Access</span>
                    <Badge variant="default">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Configured
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>Suspicious login attempt blocked</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">2 hours ago</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Security scan completed</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">4 hours ago</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Firewall rules updated</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common IT management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Monitor className="h-6 w-6" />
              <span className="text-sm">Device Manager</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Database className="h-6 w-6" />
              <span className="text-sm">Database Admin</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Wifi className="h-6 w-6" />
              <span className="text-sm">Network Config</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Settings className="h-6 w-6" />
              <span className="text-sm">System Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}