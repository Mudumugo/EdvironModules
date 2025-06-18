import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Camera, 
  AlertTriangle, 
  Phone, 
  Users, 
  Activity,
  Eye,
  PhoneCall,
  UserPlus,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import CameraGrid from "@/components/security/CameraGrid";
import SecurityEventsList from "@/components/security/SecurityEventsList";
import VisitorRegistrationForm from "@/components/security/VisitorRegistrationForm";
import SecurityCallsPanel from "@/components/security/SecurityCallsPanel";

export default function SecurityDashboard() {
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Fetch security metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/security/metrics"],
  });

  // Fetch security zones
  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ["/api/security/zones"],
  });

  // Fetch active threats
  const { data: threats, isLoading: threatsLoading } = useQuery({
    queryKey: ["/api/security/threats"],
  });

  // Fetch security events
  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: selectedZone === "all" ? ["/api/security/events"] : ["/api/security/events", { zoneId: selectedZone }],
  });

  // Fetch visitor registrations
  const { data: visitors, isLoading: visitorsLoading } = useQuery({
    queryKey: ["/api/security/visitors"],
  });

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "destructive";
      case "resolved": return "default";
      case "investigating": return "secondary";
      default: return "outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  if (metricsLoading || zonesLoading || threatsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor campus security, manage incidents, and coordinate responses
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Register Visitor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Register New Visitor</DialogTitle>
              </DialogHeader>
              <VisitorRegistrationForm />
            </DialogContent>
          </Dialog>
          <Button>
            <Phone className="mr-2 h-4 w-4" />
            Emergency Call
          </Button>
        </div>
      </div>

      {/* Active Threats Alert */}
      {threats && threats.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <span className="font-medium text-red-800 dark:text-red-200">
              {threats.length} active threat{threats.length > 1 ? 's' : ''} detected.
            </span>
            <Button variant="link" className="p-0 h-auto ml-2 text-red-600">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cameras</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.activeCameras || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.totalCameras || 0} total cameras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Events</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.openEvents || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.todayEvents || 0} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitors Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.visitorsToday || 0}</div>
            <p className="text-xs text-muted-foreground">
              {metrics?.activeVisitors || 0} currently on campus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-green-600">Online</div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cameras">Cameras</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="visitors">Visitors</TabsTrigger>
          <TabsTrigger value="calls">Communications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>Latest incidents and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <SecurityEventsList 
                  events={events?.slice(0, 5) || []} 
                  onEventClick={handleEventClick}
                  compact={true}
                />
              </CardContent>
            </Card>

            {/* Zone Status */}
            <Card>
              <CardHeader>
                <CardTitle>Security Zones</CardTitle>
                <CardDescription>Zone monitoring status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {zones?.map((zone: any) => (
                  <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{zone.name}</p>
                        <p className="text-sm text-muted-foreground">{zone.description}</p>
                      </div>
                    </div>
                    <Badge variant={zone.status === "active" ? "default" : "secondary"}>
                      {zone.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cameras">
          <Card>
            <CardHeader>
              <CardTitle>Camera Monitoring</CardTitle>
              <CardDescription>Live feeds and camera management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    {zones?.map((zone: any) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <CameraGrid zoneId={selectedZone === "all" ? undefined : selectedZone} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Incident management and response</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityEventsList 
                events={events || []} 
                onEventClick={handleEventClick}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visitors">
          <Card>
            <CardHeader>
              <CardTitle>Visitor Management</CardTitle>
              <CardDescription>Gate registration and visitor tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitors?.map((visitor: any) => (
                  <div key={visitor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{visitor.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {visitor.purpose} • {visitor.hostName}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Check-in: {new Date(visitor.checkInTime).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusColor(visitor.status)}>
                        {visitor.status}
                      </Badge>
                      {visitor.status === "checked_in" && (
                        <Button size="sm" variant="outline">
                          Check Out
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls">
          <Card>
            <CardHeader>
              <CardTitle>Security Communications</CardTitle>
              <CardDescription>Emergency calls and PBX system</CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityCallsPanel />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Event Details Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Security Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Event Type</Label>
                  <p className="text-sm">{selectedEvent.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Severity</Label>
                  <Badge variant={getSeverityColor(selectedEvent.severity)}>
                    {selectedEvent.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusColor(selectedEvent.status)}>
                    {selectedEvent.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Time</Label>
                  <p className="text-sm">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm mt-1">{selectedEvent.description}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Location</Label>
                <p className="text-sm mt-1">{selectedEvent.location}</p>
              </div>
              <div className="flex space-x-2">
                <Button>Investigate</Button>
                <Button variant="outline">Assign Officer</Button>
                <Button variant="outline">Mark Resolved</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}