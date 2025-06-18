import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Wifi, 
  WifiOff, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff,
  MonitorSpeaker,
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DeviceControlCommand {
  actionId: string;
  actionType: string;
  actionData: any;
  controllerId: string;
}

interface StudentDeviceClientProps {
  sessionId?: string;
  userId: string;
  onStatusChange?: (status: string) => void;
}

export default function StudentDeviceClient({ sessionId, userId, onStatusChange }: StudentDeviceClientProps) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [deviceId, setDeviceId] = useState<string>("");
  const [isControlled, setIsControlled] = useState(false);
  const [controlStatus, setControlStatus] = useState<string>("free");
  const [screenLocked, setScreenLocked] = useState(false);
  const [viewingSharedScreen, setViewingSharedScreen] = useState(false);
  const [pendingCommands, setPendingCommands] = useState<DeviceControlCommand[]>([]);
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Get device information
  const getDeviceInfo = () => {
    return {
      type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 
            (/iPad/.test(navigator.userAgent) ? 'tablet' : 'mobile') : 'desktop',
      platform: navigator.platform,
      browser: navigator.userAgent.includes('Chrome') ? 'chrome' :
               navigator.userAgent.includes('Firefox') ? 'firefox' :
               navigator.userAgent.includes('Safari') ? 'safari' : 'unknown',
      screenResolution: `${screen.width}x${screen.height}`,
      capabilities: {
        camera: !!navigator.mediaDevices,
        microphone: !!navigator.mediaDevices,
        screenShare: !!navigator.mediaDevices?.getDisplayMedia,
        remoteControl: true
      }
    };
  };

  // Connect to WebSocket
  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/live-sessions`;
      
      const websocket = new WebSocket(wsUrl);
      wsRef.current = websocket;
      
      websocket.onopen = () => {
        console.log('Student device connected to live session WebSocket');
        setIsConnected(true);
        setWs(websocket);
        
        // Generate unique device ID
        const newDeviceId = `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setDeviceId(newDeviceId);
        
        // Register device
        websocket.send(JSON.stringify({
          type: 'register',
          userId,
          deviceId: newDeviceId,
          deviceInfo: getDeviceInfo(),
          tenantId: 'current_tenant_id' // Replace with actual tenant ID
        }));

        // Join session if sessionId is provided
        if (sessionId) {
          websocket.send(JSON.stringify({
            type: 'join_session',
            sessionId,
            userId,
            deviceId: newDeviceId,
            role: 'student'
          }));
        }

        // Start heartbeat
        startHeartbeat(websocket, newDeviceId);
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleWebSocketMessage(data);
      };

      websocket.onclose = () => {
        console.log('Disconnected from live session WebSocket');
        setIsConnected(false);
        setWs(null);
        
        // Stop heartbeat
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
          heartbeatRef.current = null;
        }
        
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to establish connection with live session server",
          variant: "destructive",
        });
      };
    };

    connectWebSocket();

    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
    };
  }, [sessionId, userId]);

  const startHeartbeat = (websocket: WebSocket, deviceId: string) => {
    heartbeatRef.current = setInterval(() => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send(JSON.stringify({
          type: 'heartbeat',
          deviceId
        }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  };

  const handleWebSocketMessage = (data: any) => {
    switch (data.type) {
      case 'registered':
        console.log('Device registered successfully:', data.deviceId);
        break;
      
      case 'session_joined':
        console.log('Joined session successfully:', data.sessionId);
        onStatusChange?.('joined');
        break;
      
      case 'device_control_command':
        handleControlCommand(data);
        break;
      
      case 'screen_share_started':
        setViewingSharedScreen(true);
        toast({
          title: "Screen Sharing Started",
          description: "The teacher is now sharing their screen",
        });
        break;
      
      case 'screen_share_stopped':
        setViewingSharedScreen(false);
        toast({
          title: "Screen Sharing Stopped",
          description: "Screen sharing has ended",
        });
        break;
      
      case 'session_status_changed':
        onStatusChange?.(data.status);
        break;
    }
  };

  const handleControlCommand = async (command: DeviceControlCommand) => {
    const { actionId, actionType, actionData, controllerId } = command;
    
    // Add to pending commands
    setPendingCommands(prev => [...prev, command]);
    
    try {
      let success = false;
      let responseData = {};

      switch (actionType) {
        case 'lock_screen':
          success = await handleLockScreen();
          break;
        
        case 'unlock_screen':
          success = await handleUnlockScreen();
          break;
        
        case 'restrict_apps':
          success = await handleRestrictApps(actionData.restrictions);
          break;
        
        case 'allow_apps':
          success = await handleAllowApps();
          break;
        
        case 'send_message':
          success = await handleSendMessage(actionData.message);
          responseData = { messageDisplayed: true };
          break;
        
        case 'remote_control':
          success = await handleRemoteControl(actionData.enabled);
          break;
        
        default:
          console.warn('Unknown control action:', actionType);
          success = false;
      }

      // Send response back to server
      await apiRequest("POST", "/api/device/control-response", {
        actionId,
        status: success ? 'executed' : 'failed',
        responseData
      });

      // Remove from pending commands
      setPendingCommands(prev => prev.filter(cmd => cmd.actionId !== actionId));

      // Show user notification
      toast({
        title: success ? "Action Completed" : "Action Failed",
        description: `${actionType.replace('_', ' ')} ${success ? 'completed successfully' : 'failed to execute'}`,
        variant: success ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error executing control command:', error);
      
      // Mark as failed
      await apiRequest("POST", "/api/device/control-response", {
        actionId,
        status: 'failed',
        responseData: { error: error instanceof Error ? error.message : 'Unknown error' }
      });

      setPendingCommands(prev => prev.filter(cmd => cmd.actionId !== actionId));
    }
  };

  const handleLockScreen = async (): Promise<boolean> => {
    try {
      // Create overlay to "lock" the screen
      const overlay = document.createElement('div');
      overlay.id = 'device-lock-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-family: system-ui;
      `;
      overlay.innerHTML = `
        <div style="text-align: center;">
          <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
          <div>Device Locked by Teacher</div>
          <div style="font-size: 16px; margin-top: 10px; opacity: 0.7;">
            This device is temporarily restricted
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      setScreenLocked(true);
      setControlStatus('locked');
      
      return true;
    } catch (error) {
      console.error('Failed to lock screen:', error);
      return false;
    }
  };

  const handleUnlockScreen = async (): Promise<boolean> => {
    try {
      const overlay = document.getElementById('device-lock-overlay');
      if (overlay) {
        overlay.remove();
      }
      
      setScreenLocked(false);
      setControlStatus('free');
      
      return true;
    } catch (error) {
      console.error('Failed to unlock screen:', error);
      return false;
    }
  };

  const handleRestrictApps = async (restrictions: any): Promise<boolean> => {
    try {
      // For web browsers, we can only restrict certain actions
      // This is a limited implementation for demonstration
      setControlStatus('restricted');
      setIsControlled(true);
      
      return true;
    } catch (error) {
      console.error('Failed to restrict apps:', error);
      return false;
    }
  };

  const handleAllowApps = async (): Promise<boolean> => {
    try {
      setControlStatus('free');
      setIsControlled(false);
      
      return true;
    } catch (error) {
      console.error('Failed to allow apps:', error);
      return false;
    }
  };

  const handleSendMessage = async (message: string): Promise<boolean> => {
    try {
      // Show message as toast notification
      toast({
        title: "Message from Teacher",
        description: message,
        duration: 10000, // Show for 10 seconds
      });
      
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  };

  const handleRemoteControl = async (enabled: boolean): Promise<boolean> => {
    try {
      setIsControlled(enabled);
      setControlStatus(enabled ? 'controlled' : 'free');
      
      if (enabled) {
        toast({
          title: "Remote Control Enabled",
          description: "Your device is now being controlled by the teacher",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Remote Control Disabled",
          description: "You have regained control of your device",
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to handle remote control:', error);
      return false;
    }
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="h-4 w-4 text-red-500" />;
    if (screenLocked) return <Lock className="h-4 w-4 text-red-500" />;
    if (isControlled) return <Eye className="h-4 w-4 text-yellow-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isConnected) return "Disconnected";
    if (screenLocked) return "Locked";
    if (isControlled) return "Controlled";
    return "Free";
  };

  const getStatusColor = () => {
    if (!isConnected || screenLocked) return "destructive";
    if (isControlled) return "secondary";
    return "default";
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                {getStatusIcon()}
                Device Status
              </CardTitle>
              <CardDescription>
                Live session device management status
              </CardDescription>
            </div>
            <Badge variant={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Connection</p>
              <p className="text-muted-foreground">
                {isConnected ? "Connected to live session" : "Attempting to connect..."}
              </p>
            </div>
            <div>
              <p className="font-medium">Device ID</p>
              <p className="text-muted-foreground font-mono">
                {deviceId || "Not assigned"}
              </p>
            </div>
            <div>
              <p className="font-medium">Control Status</p>
              <p className="text-muted-foreground">
                {controlStatus.charAt(0).toUpperCase() + controlStatus.slice(1)}
              </p>
            </div>
            <div>
              <p className="font-medium">Session</p>
              <p className="text-muted-foreground">
                {sessionId ? `Session ${sessionId.slice(0, 8)}...` : "Not in session"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen Sharing Status */}
      {viewingSharedScreen && (
        <Alert>
          <MonitorSpeaker className="h-4 w-4" />
          <AlertDescription>
            The teacher is currently sharing their screen. You can view the shared content above.
          </AlertDescription>
        </Alert>
      )}

      {/* Pending Commands */}
      {pendingCommands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Pending Commands
            </CardTitle>
            <CardDescription>
              Commands being processed by your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingCommands.map((command) => (
                <div key={command.actionId} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">
                    {command.actionType.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Control Warnings */}
      {isControlled && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your device is currently being controlled by the teacher. Some functions may be restricted.
          </AlertDescription>
        </Alert>
      )}

      {screenLocked && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Your device has been locked by the teacher. Please wait for it to be unlocked.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}