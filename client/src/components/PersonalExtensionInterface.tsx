import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneForwarded,
  Volume2, 
  VolumeX,
  Mic,
  MicOff,
  Clock,
  User,
  Settings
} from "lucide-react";

export default function PersonalExtensionInterface() {
  const [callTarget, setCallTarget] = useState("");
  const [forwardNumber, setForwardNumber] = useState("");
  const [isCallForwarding, setIsCallForwarding] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Get user's personal extension based on their ID
  const userExtension = `10${user?.id?.slice(-2) || '01'}`;

  const { data: extensionData } = useQuery({
    queryKey: ["/api/pbx/user-extension", userExtension],
    refetchInterval: 3000,
  });

  const { data: callLogsData } = useQuery({
    queryKey: ["/api/pbx/user-call-logs", userExtension],
    refetchInterval: 5000,
  });

  const initiateCallMutation = useMutation({
    mutationFn: async ({ from, to }: { from: string; to: string }) =>
      apiRequest("POST", "/api/pbx/initiate-call", { from, to }),
    onSuccess: () => {
      toast({
        title: "Call Initiated",
        description: `Calling ${callTarget}...`,
      });
      setCallTarget("");
      queryClient.invalidateQueries({ queryKey: ["/api/pbx/user-extension"] });
    },
    onError: (error) => {
      toast({
        title: "Call Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const endCallMutation = useMutation({
    mutationFn: async (callId: string) =>
      apiRequest("POST", "/api/pbx/end-call", { callId }),
    onSuccess: () => {
      toast({
        title: "Call Ended",
        description: "Call has been terminated.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pbx/user-extension"] });
    },
  });

  const forwardCallMutation = useMutation({
    mutationFn: async ({ extension, forwardTo, enabled }: { extension: string; forwardTo: string; enabled: boolean }) =>
      apiRequest("POST", "/api/pbx/call-forward", { extension, forwardTo, enabled }),
    onSuccess: () => {
      toast({
        title: isCallForwarding ? "Call Forwarding Disabled" : "Call Forwarding Enabled",
        description: isCallForwarding ? "Calls will now ring your extension" : `Calls will be forwarded to ${forwardNumber}`,
      });
      setIsCallForwarding(!isCallForwarding);
      queryClient.invalidateQueries({ queryKey: ["/api/pbx/user-extension"] });
    },
  });

  const handleMakeCall = () => {
    if (!callTarget.trim()) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid extension or phone number",
        variant: "destructive",
      });
      return;
    }
    initiateCallMutation.mutate({ from: userExtension, to: callTarget });
  };

  const handleCallForwarding = () => {
    if (!isCallForwarding && !forwardNumber.trim()) {
      toast({
        title: "Invalid Forward Number",
        description: "Please enter a valid forwarding number",
        variant: "destructive",
      });
      return;
    }
    forwardCallMutation.mutate({
      extension: userExtension,
      forwardTo: forwardNumber,
      enabled: !isCallForwarding
    });
  };

  if (!user) return null;

  const extension = extensionData?.extension || {
    id: userExtension,
    name: `${user.firstName} ${user.lastName}`,
    status: 'available',
    currentCall: null
  };

  const recentCalls = callLogsData?.callLogs?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phone System</h1>
          <p className="text-muted-foreground">Your personal extension: {userExtension}</p>
        </div>
        <Badge 
          variant={extension.status === 'available' ? 'default' : 
                   extension.status === 'busy' ? 'destructive' : 'secondary'}
          className="px-3 py-1"
        >
          {extension.status === 'available' ? 'Available' :
           extension.status === 'busy' ? 'On Call' : 'Offline'}
        </Badge>
      </div>

      {/* Main Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Make a Call
            </CardTitle>
            <CardDescription>
              Enter an extension (1001-1050) or external phone number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="call-target">Phone Number / Extension</Label>
              <Input
                id="call-target"
                placeholder="e.g., 1001 or +1234567890"
                value={callTarget}
                onChange={(e) => setCallTarget(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleMakeCall()}
              />
            </div>
            <Button 
              onClick={handleMakeCall}
              disabled={initiateCallMutation.isPending || extension.status === 'busy'}
              className="w-full"
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              {initiateCallMutation.isPending ? 'Calling...' : 'Make Call'}
            </Button>

            {extension.currentCall && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-200">Active Call</p>
                    <p className="text-sm text-green-600 dark:text-green-300">
                      {extension.currentCall.direction === 'outbound' ? 'Calling' : 'Call from'}: {extension.currentCall.number}
                    </p>
                    <p className="text-xs text-green-500">
                      Duration: {extension.currentCall.duration || '00:00'}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => endCallMutation.mutate(extension.currentCall.id)}
                  >
                    <PhoneOff className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Extension Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Extension Settings
            </CardTitle>
            <CardDescription>
              Configure your personal phone settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Call Forwarding */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <PhoneForwarded className="h-4 w-4" />
                  Call Forwarding
                </Label>
                <Badge variant={isCallForwarding ? "default" : "secondary"}>
                  {isCallForwarding ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              {!isCallForwarding && (
                <Input
                  placeholder="Forward to number"
                  value={forwardNumber}
                  onChange={(e) => setForwardNumber(e.target.value)}
                />
              )}
              
              <Button
                variant={isCallForwarding ? "destructive" : "default"}
                size="sm"
                onClick={handleCallForwarding}
                disabled={forwardCallMutation.isPending}
                className="w-full"
              >
                {isCallForwarding ? "Disable Forwarding" : "Enable Forwarding"}
              </Button>
            </div>

            {/* Audio Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  Microphone
                </Label>
                <Button
                  variant={isMuted ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Volume: {volume}%
                </Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Call History */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Calls
            </CardTitle>
            <CardDescription>
              Your call history from the last 24 hours
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentCalls.length > 0 ? (
              <div className="space-y-3">
                {recentCalls.map((call: any) => (
                  <div key={call.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        call.direction === 'inbound' ? 'bg-green-100 dark:bg-green-900/20' :
                        call.direction === 'outbound' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        'bg-red-100 dark:bg-red-900/20'
                      }`}>
                        {call.direction === 'inbound' ? 
                          <PhoneCall className="h-4 w-4 text-green-600 dark:text-green-400" /> :
                          call.direction === 'outbound' ?
                          <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                          <PhoneOff className="h-4 w-4 text-red-600 dark:text-red-400" />
                        }
                      </div>
                      <div>
                        <p className="font-medium">{call.fromNumber === userExtension ? call.toNumber : call.fromNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {call.direction === 'inbound' ? 'Incoming' : 
                           call.direction === 'outbound' ? 'Outgoing' : 'Missed'} • {call.duration}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {new Date(call.startTime).toLocaleTimeString()}
                      </p>
                      <Badge variant={call.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                        {call.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Phone className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No recent calls</p>
                <p className="text-sm">Your call history will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}