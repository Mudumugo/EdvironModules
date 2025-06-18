import { useState } from "react";
import { useSecurityModule } from "@/hooks/useSecurityModule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";
import CameraGrid from "@/components/security/CameraGrid";
import SecurityEventsList from "@/components/security/SecurityEventsList";
import SecurityCallsPanel from "@/components/security/SecurityCallsPanel";
import {
  SecurityHeader,
  SecurityMetrics,
  SecurityOverview,
  VisitorManagement,
  EventDetailsDialog
} from "@/components/security/modules";

export default function SecurityDashboard() {
  const [selectedZone, setSelectedZone] = useState<string>("all");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  // Using the security module hook
  const {
    useSecurityZones,
    useSecurityCameras,
    useSecurityEvents,
    useVisitorRegistrations,
    useSecurityCalls,
    useSecurityMetrics,
    createSecurityEvent,
    createVisitorRegistration,
    createSecurityCall
  } = useSecurityModule();

  // Fetch security data
  const { data: zones = [], isLoading: zonesLoading } = useSecurityZones();
  const { data: cameras = [], isLoading: camerasLoading } = useSecurityCameras();
  const { data: securityEvents = [], isLoading: eventsLoading } = useSecurityEvents();
  const { data: securityVisitors = [], isLoading: visitorsLoading } = useVisitorRegistrations();
  const { data: securityCalls = [], isLoading: callsLoading } = useSecurityCalls();
  const { data: metrics = {}, isLoading: metricsLoading } = useSecurityMetrics();

  // Mock threats data for now
  const threats: any[] = [];
  const threatsLoading = false;

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleVisitorRegister = (data: any) => {
    console.log('Visitor registered:', data);
  };

  const handleEmergencyCall = () => {
    console.log('Emergency call initiated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "destructive";
      case "resolved": return "default";
      case "investigating": return "secondary";
      case "checked_in": return "default";
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
      <SecurityHeader 
        onVisitorRegister={handleVisitorRegister}
        onEmergencyCall={handleEmergencyCall}
      />

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

      <SecurityMetrics metrics={metrics} />

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
          <SecurityOverview 
            securityEvents={securityEvents}
            eventsLoading={eventsLoading}
            zones={zones}
          />
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
                events={securityEvents || []} 
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
              <VisitorManagement 
                securityVisitors={securityVisitors}
                getStatusColor={getStatusColor}
              />
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

      <EventDetailsDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        selectedEvent={selectedEvent}
        getStatusColor={getStatusColor}
        getSeverityColor={getSeverityColor}
      />
    </div>
  );
}