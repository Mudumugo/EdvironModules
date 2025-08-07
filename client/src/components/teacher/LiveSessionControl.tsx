import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<string>("scheduled");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session } = useQuery({
    queryKey: ['/api/live-sessions', sessionId],
  });

  const { data: participants = [] } = useQuery({
    queryKey: ['/api/live-sessions', sessionId, 'participants'],
  });

  const { data: devices = [] } = useQuery({
    queryKey: ['/api/live-sessions', sessionId, 'devices'],
    refetchInterval: 5000,
  });

  const { data: screenSharing = { isActive: false, quality: 'auto', viewers: [] } } = useQuery({
    queryKey: ['/api/live-sessions', sessionId, 'screen-sharing'],
    refetchInterval: false, // Disabled to prevent unnecessary polling
    enabled: false, // Temporarily disabled
  });

  const { isConnected } = useWebSocketConnection(sessionId, {
    onMessage: (data: WebSocketMessage) => {
      switch (data.type) {
        case 'participant_joined':
        case 'participant_left':
          queryClient.invalidateQueries({ queryKey: ['/api/live-sessions', sessionId] });
          break;
        case 'screen_share_started':
        case 'screen_share_stopped':
          queryClient.invalidateQueries({ queryKey: ['/api/live-sessions', sessionId, 'screen-sharing'] });
          break;
        case 'session_status_changed':
          setSessionStatus(data.status);
          break;
      }
    },
    onError: () => {
      toast({
        title: "Connection Error",
        description: "Failed to establish real-time connection",
        variant: "destructive",
      });
    }
  });

  const sessionMutations = useMutation({
    mutationFn: async ({ action, data }: { action: string; data?: any }) => {
      switch (action) {
        case 'start':
        case 'end':
        case 'pause':
          return await apiRequest("PATCH", `/api/live-sessions/${sessionId}/status`, { 
            status: action === 'start' ? 'live' : action === 'end' ? 'ended' : 'paused' 
          });
        case 'device-control':
          return await apiRequest("POST", `/api/live-sessions/${sessionId}/device-control`, data);
        case 'screen-share-start':
          return await apiRequest("POST", `/api/live-sessions/${sessionId}/screen-share/start`, data);
        case 'screen-share-stop':
          return await apiRequest("POST", `/api/live-sessions/${sessionId}/screen-share/stop`);
        default:
          throw new Error('Unknown action');
      }
    },
    onSuccess: (_, { action }) => {
      queryClient.invalidateQueries({ queryKey: ['/api/live-sessions', sessionId] });
      const messages = {
        'start': 'Session started successfully',
        'end': 'Session ended',
        'pause': 'Session paused',
        'device-control': 'Control command sent',
        'screen-share-start': 'Screen sharing started',
        'screen-share-stop': 'Screen sharing stopped'
      };
      toast({
        title: "Success",
        description: messages[action as keyof typeof messages] || "Action completed",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to perform action",
        variant: "destructive",
      });
    }
  });

  if (!session) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SessionControlBar
        sessionStatus={sessionStatus}
        participantCount={participants.length}
        onStartSession={() => sessionMutations.mutate({ action: 'start' })}
        onEndSession={() => sessionMutations.mutate({ action: 'end' })}
        onPauseSession={() => sessionMutations.mutate({ action: 'pause' })}
        onSettings={() => setIsSettingsOpen(true)}
      />

      <Tabs defaultValue="participants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="participants">Participants ({participants.length})</TabsTrigger>
          <TabsTrigger value="devices">Devices ({devices.length})</TabsTrigger>
          <TabsTrigger value="controls">Device Control</TabsTrigger>
          <TabsTrigger value="sharing">Screen Sharing</TabsTrigger>
        </TabsList>

        <TabsContent value="participants">
          <ParticipantPanel 
            participants={participants}
            onParticipantAction={(participantId, action) => {
              sessionMutations.mutate({ 
                action: 'device-control', 
                data: { participantId, action } 
              });
            }}
          />
        </TabsContent>

        <TabsContent value="devices">
          <DeviceControlPanel 
            devices={devices}
            onDeviceAction={(deviceId, action, data) => {
              sessionMutations.mutate({ 
                action: 'device-control', 
                data: { deviceId, action, ...data } 
              });
            }}
          />
        </TabsContent>

        <TabsContent value="controls">
          <DeviceControlPanel 
            devices={devices}
            onDeviceAction={(deviceId, action, data) => {
              sessionMutations.mutate({ 
                action: 'device-control', 
                data: { deviceId, action, ...data } 
              });
            }}
          />
        </TabsContent>

        <TabsContent value="sharing">
          <ScreenSharingPanel 
            screenSharing={screenSharing}
            onStartScreenShare={() => sessionMutations.mutate({ action: 'screen-share-start' })}
            onStopScreenShare={() => sessionMutations.mutate({ action: 'screen-share-stop' })}
            onQualityChange={(quality) => {
              sessionMutations.mutate({ 
                action: 'screen-share-start', 
                data: { quality } 
              });
            }}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Settings</DialogTitle>
            <DialogDescription>Configure session parameters and permissions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="session-title">Session Title</Label>
              <Input id="session-title" defaultValue={session?.title} />
            </div>
            <div>
              <Label htmlFor="session-description">Description</Label>
              <Textarea id="session-description" defaultValue={session?.description} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsSettingsOpen(false)}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}