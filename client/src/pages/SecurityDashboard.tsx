import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Shield, 
  Eye, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Camera,
  Lock,
  Activity,
  Bell,
  MapPin,
  Wifi,
  Monitor,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Settings,
  FileText,
  RefreshCw
} from "lucide-react";

interface SecurityMetrics {
  accessControl: {
    totalAccessPoints: number;
    securePoints: number;
    alertsActive: number;
    lastIncident: string;
  };
  surveillance: {
    cameras: {
      total: number;
      online: number;
      offline: number;
      alerts: number;
    };
    coverage: number;
    recordingStatus: string;
  };
  incidents: {
    today: number;
    thisWeek: number;
    resolved: number;
    pending: number;
  };
  personnel: {
    onDuty: number;
    totalStaff: number;
    locations: string[];
    lastRollCall: string;
  };
  systemHealth: {
    firewallStatus: string;
    intrusion: {
      attempts: number;
      blocked: number;
      success: number;
    };
    compliance: number;
  };
}

export default function SecurityDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/security/metrics"],
    refetchInterval: 10000, // Refresh every 10 seconds for security monitoring
  });

  const mockMetrics: SecurityMetrics = {
    accessControl: {
      totalAccessPoints: 45,
      securePoints: 43,
      alertsActive: 2,
      lastIncident: "6 hours ago"
    },
    surveillance: {
      cameras: {
        total: 32,
        online: 30,
        offline: 2,
        alerts: 1
      },
      coverage: 94,
      recordingStatus: "active"
    },
    incidents: {
      today: 3,
      thisWeek: 18,
      resolved: 15,
      pending: 3
    },
    personnel: {
      onDuty: 8,
      totalStaff: 12,
      locations: ["Main Building", "Library", "Sports Complex", "Parking"],
      lastRollCall: "2 hours ago"
    },
    systemHealth: {
      firewallStatus: "secure",
      intrusion: {
        attempts: 24,
        blocked: 23,
        success: 1
      },
      compliance: 96
    }
  };

  const securityData = metrics || mockMetrics;

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
          <h1 className="text-3xl font-bold tracking-tight">Security Operations Center</h1>
          <p className="text-muted-foreground">
            Monitor campus security, access control, and safety systems
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Critical Alerts Banner */}
      {securityData.accessControl.alertsActive > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-900">
                  {securityData.accessControl.alertsActive} Active Security Alert{securityData.accessControl.alertsActive > 1 ? 's' : ''}
                </h3>
                <p className="text-red-700">Immediate attention required - Check access control systems</p>
              </div>
              <Button variant="destructive" className="ml-auto">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Access Control</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityData.accessControl.securePoints}/{securityData.accessControl.totalAccessPoints}
            </div>
            <p className="text-xs text-muted-foreground">
              Points secured ({((securityData.accessControl.securePoints / securityData.accessControl.totalAccessPoints) * 100).toFixed(1)}%)
            </p>
            {securityData.accessControl.alertsActive > 0 ? (
              <Badge variant="destructive" className="mt-2">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {securityData.accessControl.alertsActive} Alerts
              </Badge>
            ) : (
              <Badge variant="default" className="mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                All Secure
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Surveillance</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityData.surveillance.cameras.online}/{securityData.surveillance.cameras.total}
            </div>
            <p className="text-xs text-muted-foreground">
              Cameras online ({securityData.surveillance.coverage}% coverage)
            </p>
            <Progress value={securityData.surveillance.coverage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Recording: {securityData.surveillance.recordingStatus}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Personnel</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {securityData.personnel.onDuty}/{securityData.personnel.totalStaff}
            </div>
            <p className="text-xs text-muted-foreground">
              Staff on duty
            </p>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline" className="text-xs">
                {securityData.personnel.locations.length} locations
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Last roll call: {securityData.personnel.lastRollCall}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidents Today</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {securityData.incidents.today}
            </div>
            <p className="text-xs text-muted-foreground">
              {securityData.incidents.pending} pending, {securityData.incidents.resolved} resolved
            </p>
            <div className="flex gap-1 mt-2">
              <Badge variant="secondary" className="text-xs">
                {securityData.incidents.thisWeek} this week
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Real-time Security Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Campus Perimeter</span>
                  <Badge variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Secure
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Building Access</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Monitored
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Systems</span>
                  <Badge variant="default">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Backup Power</span>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Standby
                  </Badge>
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
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Perimeter check completed - North gate</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">15 minutes ago</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span>Unauthorized access attempt - Side entrance</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">32 minutes ago</p>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Security patrol completed - Building A</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">1 hour ago</p>
                  </div>

                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-blue-500" />
                      <span>Camera maintenance completed - Parking lot</span>
                    </div>
                    <p className="text-xs text-muted-foreground ml-6">2 hours ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Point Status</CardTitle>
                <CardDescription>Real-time monitoring of all access control points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Main Entrance</span>
                    <Badge variant="default">Secure</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Staff Entrance</span>
                    <Badge variant="default">Secure</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Emergency Exit A</span>
                    <Badge variant="destructive">Alert</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Parking Gate</span>
                    <Badge variant="default">Secure</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Service Entrance</span>
                    <Badge variant="secondary">Maintenance</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badge Access Logs</CardTitle>
                <CardDescription>Recent access attempts and authorizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">John Smith (Staff)</span>
                      <p className="text-xs text-muted-foreground">Main Entrance</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="text-xs">Authorized</Badge>
                      <p className="text-xs text-muted-foreground">5 min ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Unknown Card</span>
                      <p className="text-xs text-muted-foreground">Emergency Exit A</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="destructive" className="text-xs">Denied</Badge>
                      <p className="text-xs text-muted-foreground">12 min ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Maria Garcia (Teacher)</span>
                      <p className="text-xs text-muted-foreground">Staff Entrance</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="default" className="text-xs">Authorized</Badge>
                      <p className="text-xs text-muted-foreground">18 min ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="surveillance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Camera Grid Status</CardTitle>
                <CardDescription>Live status of all surveillance cameras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 16 }, (_, i) => (
                    <div key={i} className="border rounded-lg p-3 text-center">
                      <div className="text-xs font-medium">Cam {i + 1}</div>
                      <div className="mt-1">
                        {i === 5 || i === 12 ? (
                          <Badge variant="destructive" className="text-xs">Offline</Badge>
                        ) : i === 8 ? (
                          <Badge variant="secondary" className="text-xs">Alert</Badge>
                        ) : (
                          <Badge variant="default" className="text-xs">Online</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recording Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recording Quality</span>
                    <Badge variant="default">HD</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Retention Period</span>
                    <span className="text-sm">30 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Incidents</CardTitle>
                <CardDescription>Incidents requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Unauthorized Access Attempt</h4>
                        <p className="text-sm text-muted-foreground">Emergency Exit A - Card swipe denied</p>
                      </div>
                      <Badge variant="destructive">High</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Reported: 32 minutes ago</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Camera Malfunction</h4>
                        <p className="text-sm text-muted-foreground">Parking lot camera offline</p>
                      </div>
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Reported: 1 hour ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Today</span>
                    <span className="font-bold">{securityData.incidents.today}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>This Week</span>
                    <span className="font-bold">{securityData.incidents.thisWeek}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resolved</span>
                    <span className="font-bold text-green-600">{securityData.incidents.resolved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Pending</span>
                    <span className="font-bold text-orange-600">{securityData.incidents.pending}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Overall Compliance</span>
                      <span>{securityData.systemHealth.compliance}%</span>
                    </div>
                    <Progress value={securityData.systemHealth.compliance} className="mt-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Access Control Policy</span>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Protection</span>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Emergency Procedures</span>
                      <Badge variant="secondary">Review Needed</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Audit Trail</span>
                      <Badge variant="default">Compliant</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intrusion Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Attempts Today</span>
                    <span className="font-bold text-red-600">{securityData.systemHealth.intrusion.attempts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Blocked</span>
                    <span className="font-bold text-green-600">{securityData.systemHealth.intrusion.blocked}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Success</span>
                    <span className="font-bold text-red-600">{securityData.systemHealth.intrusion.success}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Firewall Status</span>
                    <Badge variant="default">
                      <Shield className="h-3 w-3 mr-1" />
                      {securityData.systemHealth.firewallStatus}
                    </Badge>
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
          <CardTitle>Security Operations</CardTitle>
          <CardDescription>Quick access to security management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Eye className="h-6 w-6" />
              <span className="text-sm">Live Cameras</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Lock className="h-6 w-6" />
              <span className="text-sm">Access Control</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <Bell className="h-6 w-6" />
              <span className="text-sm">Emergency Alert</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Incident Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}