import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  LiveSessionControlProps,
  WebSocketMessage,
  useWebSocketConnection,
  DeviceControlPanel,
  ParticipantPanel,
  ScreenSharingPanel,
  SessionControlBar
} from "./live-session";

export default function LiveSessionControl({ sessionId, onClose }: LiveSessionControlProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [sessionStatus, setSessionStatus] = useState<string>("scheduled");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['/api/live-sessions', sessionId],
  });

  const { data: participants = [], refetch: refetchParticipants } = useQuery({
    queryKey: ['/api/live-sessions', sessionId, 'participants'],
  });

  const { data: devices = [], refetch: refetchDevices } = useQuery({
    queryKey: ['/api/live-sessions', sessionId, 'devices'],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const { data: screenSharing } = useQuery({
    queryKey: ['/api/live-sessions', sessionId, 'screen-sharing'],
    refetchInterval: 2000,
  });

  // WebSocket connection for real-time updates
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/live-sessions`;
    
    const websocket = new WebSocket(wsUrl);
    wsRef.current = websocket;
    
    websocket.onopen = () => {
      console.log('Connected to live session WebSocket');
      setIsConnected(true);
      setWs(websocket);
      
      // Register as teacher device
      websocket.send(JSON.stringify({
        type: 'register',
        userId: 'current_user_id', // Replace with actual user ID
        deviceId: `teacher_${Date.now()}`,
        deviceInfo: {
          type: 'desktop',
          platform: navigator.platform,
          browser: navigator.userAgent,
          capabilities: {
            camera: true,
            microphone: true,
            screenShare: true,
            remoteControl: true
          }
        },
        tenantId: 'current_tenant_id' // Replace with actual tenant ID
      }));
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onclose = () => {
      console.log('Disconnected from live session WebSocket');
      setIsConnected(false);
      setWs(null);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to establish real-time connection",
        variant: "destructive",
      });
    };

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [sessionId]);

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'participant_joined':
        refetchParticipants();
        refetchDevices();
        toast({
          title: "Participant Joined",
          description: `A participant has joined the session`,
        });
        break;
      
      case 'participant_left':
        refetchParticipants();
        refetchDevices();
        break;
      
      case 'screen_share_started':
        setScreenSharingActive(true);
        queryClient.invalidateQueries({ queryKey: ['/api/live-sessions', sessionId, 'screen-sharing'] });
        break;
      
      case 'screen_share_stopped':
        setScreenSharingActive(false);
        queryClient.invalidateQueries({ queryKey: ['/api/live-sessions', sessionId, 'screen-sharing'] });
        break;
      
      case 'session_status_changed':
        setSessionStatus(data.status);
        break;
    }
  };

  const updateSessionStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return await apiRequest("PATCH", `/api/live-sessions/${sessionId}/status`, { status });
    },
    onSuccess: (_, status) => {
      setSessionStatus(status);
      queryClient.invalidateQueries({ queryKey: ['/api/live-sessions', sessionId] });
      toast({
        title: "Session Status Updated",
        description: `Session is now ${status}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update session status",
        variant: "destructive",
      });
    }
  });

  const deviceControlMutation = useMutation({
    mutationFn: async (controlData: any) => {
      return await apiRequest("POST", `/api/live-sessions/${sessionId}/device-control`, controlData);
    },
    onSuccess: () => {
      toast({
        title: "Control Command Sent",
        description: "Device control command has been sent successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send device control command",
        variant: "destructive",
      });
    }
  });

  const handleStartSession = () => {
    updateSessionStatusMutation.mutate("live");
  };

  const handleEndSession = () => {
    updateSessionStatusMutation.mutate("ended");
  };

  const handlePauseSession = () => {
    updateSessionStatusMutation.mutate("paused");
  };

  const handleDeviceControl = (deviceId: string, actionType: string, actionData?: any) => {
    const device = devices.find((d: ConnectedDevice) => d.deviceId === deviceId);
    if (!device) return;

    deviceControlMutation.mutate({
      targetDeviceId: deviceId,
      targetUserId: device.userId,
      actionType,
      actionData: actionData || {}
    });
  };

  const handleStartScreenShare = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'screen_share_start',
        sessionId,
        userId: 'current_user_id', // Replace with actual user ID
        deviceId: `teacher_${Date.now()}`,
        shareType: 'screen',
        quality: 'high'
      }));
    }
  };

  const handleStopScreenShare = () => {
    if (ws && ws.readyState === WebSocket.OPEN && screenSharing) {
      ws.send(JSON.stringify({
        type: 'screen_share_stop',
        sessionId,
        screenShareId: screenSharing.id
      }));
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Laptop className="h-4 w-4" />;
      case 'smart_board': return <MonitorSpeaker className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getConnectionIcon = (isConnected: boolean, quality: string) => {
    if (!isConnected) return <WifiOff className="h-4 w-4 text-red-500" />;
    
    const colorClass = quality === 'excellent' ? 'text-green-500' : 
                      quality === 'good' ? 'text-blue-500' : 
                      quality === 'fair' ? 'text-yellow-500' : 'text-red-500';
    
    return <Wifi className={`h-4 w-4 ${colorClass}`} />;
  };

  if (!session) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-32">
          <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Session Control Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                {session.title}
                <Badge className={sessionStatus === 'live' ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}>
                  {sessionStatus.toUpperCase()}
                </Badge>
              </CardTitle>
              <CardDescription>
                {session.description} • {participants.length} participants connected
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                <Circle className={`h-2 w-2 mr-1 ${isConnected ? 'fill-green-500' : 'fill-red-500'}`} />
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              {onClose && (
                <Button variant="outline" size="sm" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {sessionStatus === 'scheduled' && (
              <Button onClick={handleStartSession} className="bg-green-500 hover:bg-green-600">
                <Play className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            )}
            {sessionStatus === 'live' && (
              <>
                <Button onClick={handlePauseSession} variant="outline">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button onClick={handleEndSession} className="bg-red-500 hover:bg-red-600">
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </>
            )}
            
            <Separator orientation="vertical" className="h-6" />
            
            {!screenSharingActive ? (
              <Button onClick={handleStartScreenShare} variant="outline">
                <MonitorSpeaker className="h-4 w-4 mr-2" />
                Share Screen
              </Button>
            ) : (
              <Button onClick={handleStopScreenShare} variant="outline">
                <MonitorSpeaker className="h-4 w-4 mr-2" />
                Stop Sharing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Session Management Tabs */}
      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Participants ({participants.length})</TabsTrigger>
          <TabsTrigger value="devices">Devices ({devices.length})</TabsTrigger>
          <TabsTrigger value="controls">Device Control</TabsTrigger>
          <TabsTrigger value="sharing">Screen Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>Session Participants</CardTitle>
              <CardDescription>Manage participants and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {participants.map((participant: SessionParticipant) => (
                    <div key={participant.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(devices.find((d: ConnectedDevice) => d.deviceId === participant.deviceId)?.deviceType || 'desktop')}
                          <div>
                            <p className="font-medium">User {participant.userId}</p>
                            <p className="text-sm text-muted-foreground">
                              {participant.role} • {participant.status}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {participant.isAudioMuted ? (
                            <MicOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Mic className="h-4 w-4 text-green-500" />
                          )}
                          {participant.isVideoMuted ? (
                            <VideoOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Video className="h-4 w-4 text-green-500" />
                          )}
                          {participant.isScreenSharing && (
                            <MonitorSpeaker className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant={participant.connectionQuality === 'excellent' ? 'default' : 'secondary'}>
                          {participant.connectionQuality}
                        </Badge>
                        {participant.canBeControlled && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeviceControl(participant.deviceId, 'lock_screen')}
                          >
                            <Lock className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>Monitor and manage all connected devices</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {devices.map((device: ConnectedDevice) => (
                    <div key={device.deviceId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getDeviceIcon(device.deviceType)}
                        <div>
                          <p className="font-medium">{device.platform} - {device.browser}</p>
                          <p className="text-sm text-muted-foreground">
                            {device.screenResolution} • Last seen: {new Date(device.lastSeen).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getConnectionIcon(device.isConnected, 'good')}
                        <Badge variant={device.isConnected ? 'default' : 'secondary'}>
                          {device.status}
                        </Badge>
                        {device.isControlled && (
                          <Badge variant="destructive">
                            Controlled
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls">
          <Card>
            <CardHeader>
              <CardTitle>Device Control Center</CardTitle>
              <CardDescription>Send control commands to student devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Select Device</Label>
                  <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a device" />
                    </SelectTrigger>
                    <SelectContent>
                      {devices.filter((d: ConnectedDevice) => d.isConnected).map((device: ConnectedDevice) => (
                        <SelectItem key={device.deviceId} value={device.deviceId}>
                          {getDeviceIcon(device.deviceType)} User {device.userId} - {device.platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Control Action</Label>
                  <Select value={controlAction} onValueChange={setControlAction}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lock_screen">Lock Screen</SelectItem>
                      <SelectItem value="unlock_screen">Unlock Screen</SelectItem>
                      <SelectItem value="restrict_apps">Restrict Applications</SelectItem>
                      <SelectItem value="allow_apps">Allow Applications</SelectItem>
                      <SelectItem value="send_message">Send Message</SelectItem>
                      <SelectItem value="remote_control">Enable Remote Control</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (selectedDevice && controlAction) {
                      handleDeviceControl(selectedDevice, controlAction);
                    }
                  }}
                  disabled={!selectedDevice || !controlAction || deviceControlMutation.isPending}
                >
                  {deviceControlMutation.isPending ? "Sending..." : "Send Command"}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    devices.filter((d: ConnectedDevice) => d.isConnected).forEach((device: ConnectedDevice) => {
                      handleDeviceControl(device.deviceId, 'lock_screen');
                    });
                  }}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Lock All Devices
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    devices.filter((d: ConnectedDevice) => d.isConnected).forEach((device: ConnectedDevice) => {
                      handleDeviceControl(device.deviceId, 'unlock_screen');
                    });
                  }}
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Unlock All Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sharing">
          <Card>
            <CardHeader>
              <CardTitle>Screen Sharing Management</CardTitle>
              <CardDescription>Control screen sharing for the session</CardDescription>
            </CardHeader>
            <CardContent>
              {screenSharing && screenSharing.isActive ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Screen sharing is active</p>
                        <p className="text-sm text-muted-foreground">
                          Presenter: User {screenSharing.presenterId} • Quality: {screenSharing.quality}
                        </p>
                      </div>
                      <Button onClick={handleStopScreenShare} variant="destructive">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Sharing
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Viewers ({screenSharing.viewers?.length || 0})</p>
                    <div className="space-y-1">
                      {screenSharing.viewers?.map((viewerId: string) => (
                        <div key={viewerId} className="text-sm text-muted-foreground">
                          • User {viewerId}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MonitorSpeaker className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No active screen sharing</p>
                  <Button onClick={handleStartScreenShare}>
                    <MonitorSpeaker className="h-4 w-4 mr-2" />
                    Start Screen Sharing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}