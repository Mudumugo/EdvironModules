import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Users, 
  Radio, 
  AlertTriangle, 
  Volume2, 
  Settings, 
  Plus,
  Clock,
  Activity,
  Mic,
  MicOff,
  Speaker,
  Headphones
} from "lucide-react";

export default function PBXInterface() {
  const [selectedExtensions, setSelectedExtensions] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [callTarget, setCallTarget] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pbxData, isLoading } = useQuery({
    queryKey: ["/api/pbx/dashboard"],
    refetchInterval: 5000,
  });

  const { data: extensionsData } = useQuery({
    queryKey: ["/api/pbx/extensions"],
  });

  const { data: callLogsData } = useQuery({
    queryKey: ["/api/pbx/call-logs"],
  });

  const emergencyBroadcastMutation = useMutation({
    mutationFn: async (data: any) => 
      apiRequest("POST", "/api/pbx/emergency-broadcast", data),
    onSuccess: () => {
      toast({
        title: "Emergency Broadcast Sent",
        description: "Emergency alert has been broadcasted to all devices",
      });
      setBroadcastMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/pbx/dashboard"] });
    },
    onError: () => {
      toast({
        title: "Broadcast Failed",
        description: "Failed to send emergency broadcast",
        variant: "destructive",
      });
    },
  });

  const pageMutation = useMutation({
    mutationFn: async (data: any) => 
      apiRequest("POST", "/api/pbx/page", data),
    onSuccess: () => {
      toast({
        title: "Page Sent",
        description: "Page has been sent to selected devices",
      });
      setPageMessage("");
      setSelectedExtensions([]);
    },
    onError: () => {
      toast({
        title: "Page Failed",
        description: "Failed to send page",
        variant: "destructive",
      });
    },
  });

  const initiateCallMutation = useMutation({
    mutationFn: async (data: any) => 
      apiRequest("POST", "/api/pbx/initiate-call", data),
    onSuccess: () => {
      toast({
        title: "Call Initiated",
        description: "Call has been initiated successfully",
      });
      setCallTarget("");
    },
    onError: () => {
      toast({
        title: "Call Failed",
        description: "Failed to initiate call",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter an emergency message",
        variant: "destructive",
      });
      return;
    }

    emergencyBroadcastMutation.mutate({
      title: "EMERGENCY ALERT",
      message: broadcastMessage,
      priority: "critical",
      targetExtensions: [],
      targetDepartments: []
    });
  };

  const handlePageDevices = () => {
    if (!pageMessage.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a page message",
        variant: "destructive",
      });
      return;
    }

    pageMutation.mutate({
      message: pageMessage,
      targetExtensions: selectedExtensions,
      targetDepartments: []
    });
  };

  const handleInitiateCall = () => {
    if (!callTarget.trim()) {
      toast({
        title: "Target Required",
        description: "Please enter an extension to call",
        variant: "destructive",
      });
      return;
    }

    initiateCallMutation.mutate({
      fromExtension: "auto", // Will use current user's extension
      toExtension: callTarget
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const extensions = extensionsData?.extensions || [];
  const callLogs = callLogsData?.callLogs || [];
  const dashboard = pbxData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PBX Communication Center</h1>
          <p className="text-muted-foreground">
            Campus-wide communication system with Asterisk integration
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={dashboard.system?.status === "online" ? "default" : "destructive"}>
            {dashboard.system?.status || "offline"}
          </Badge>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Extensions</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.system?.activeExtensions || 0}/{dashboard.system?.totalExtensions || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Extensions online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calls</CardTitle>
            <PhoneCall className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.system?.activeCalls || 0}</div>
            <p className="text-xs text-muted-foreground">
              Calls in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server Load</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard.system?.serverLoad || 0}%</div>
            <p className="text-xs text-muted-foreground">
              System utilization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{dashboard.system?.uptime || "0 days"}</div>
            <p className="text-xs text-muted-foreground">
              Continuous operation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="extensions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="extensions">Extensions</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
          <TabsTrigger value="paging">Paging</TabsTrigger>
          <TabsTrigger value="calls">Call Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="extensions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Extension Directory</CardTitle>
                <CardDescription>All registered phone extensions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {extensions.map((ext: any) => (
                    <div key={ext.extension} className="flex items-center justify-between border rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span className="font-medium">{ext.extension}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium">{ext.displayName}</div>
                          <div className="text-xs text-muted-foreground">{ext.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            ext.status === "online" ? "default" :
                            ext.status === "busy" ? "secondary" :
                            ext.status === "dnd" ? "destructive" : "outline"
                          }
                        >
                          {ext.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setCallTarget(ext.extension)}
                        >
                          <PhoneCall className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Instant communication tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="call-target">Call Extension</Label>
                  <div className="flex gap-2">
                    <Input
                      id="call-target"
                      placeholder="Enter extension number"
                      value={callTarget}
                      onChange={(e) => setCallTarget(e.target.value)}
                    />
                    <Button onClick={handleInitiateCall} disabled={initiateCallMutation.isPending}>
                      <PhoneCall className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Conference Rooms</Label>
                  <div className="space-y-2">
                    {dashboard.conferenceRooms?.map((room: any) => (
                      <div key={room.roomNumber} className="flex items-center justify-between border rounded p-2">
                        <div>
                          <div className="font-medium">{room.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Room {room.roomNumber} - {room.participants}/{room.maxParticipants} participants
                          </div>
                        </div>
                        <Badge variant={room.status === "active" ? "default" : "outline"}>
                          {room.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Emergency Broadcast System
              </CardTitle>
              <CardDescription>
                Send critical alerts to all devices across the campus
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergency-message">Emergency Message</Label>
                <Textarea
                  id="emergency-message"
                  placeholder="Enter emergency announcement message..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="min-h-20"
                />
              </div>
              <Button 
                onClick={handleEmergencyBroadcast}
                disabled={emergencyBroadcastMutation.isPending}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Send Emergency Broadcast
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Emergency Broadcasts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboard.recentBroadcasts?.map((broadcast: any) => (
                  <div key={broadcast.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{broadcast.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {broadcast.initiator} • {new Date(broadcast.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <Badge variant="outline">{broadcast.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Page Devices
              </CardTitle>
              <CardDescription>
                Send announcements to specific extensions or departments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Select Extensions to Page</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {extensions.map((ext: any) => (
                    <div key={ext.extension} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`ext-${ext.extension}`}
                        checked={selectedExtensions.includes(ext.extension)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedExtensions([...selectedExtensions, ext.extension]);
                          } else {
                            setSelectedExtensions(selectedExtensions.filter(x => x !== ext.extension));
                          }
                        }}
                      />
                      <label htmlFor={`ext-${ext.extension}`} className="text-sm">
                        {ext.extension} - {ext.displayName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="page-message">Page Message</Label>
                <Textarea
                  id="page-message"
                  placeholder="Enter announcement message..."
                  value={pageMessage}
                  onChange={(e) => setPageMessage(e.target.value)}
                />
              </div>

              <Button 
                onClick={handlePageDevices}
                disabled={pageMutation.isPending}
                className="w-full"
              >
                <Volume2 className="h-4 w-4 mr-2" />
                Send Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>Recent call activity across the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {callLogs.map((call: any) => (
                  <div key={call.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {call.status === "answered" ? (
                            <PhoneCall className="h-4 w-4 text-green-600" />
                          ) : call.status === "missed" ? (
                            <PhoneOff className="h-4 w-4 text-red-600" />
                          ) : (
                            <Phone className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {call.fromUser || call.fromExtension} → {call.toUser || call.toExtension || call.toNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(call.startTime).toLocaleString()} • {call.callType}
                            {call.duration && ` • ${Math.floor(call.duration / 60)}:${(call.duration % 60).toString().padStart(2, '0')}`}
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={
                          call.status === "answered" ? "default" :
                          call.status === "missed" ? "destructive" : "secondary"
                        }
                      >
                        {call.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}