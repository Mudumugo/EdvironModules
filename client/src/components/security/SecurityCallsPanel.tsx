import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, PhoneCall, PhoneOff, Clock, Users, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function SecurityCallsPanel() {
  const [callType, setCallType] = useState<string>("emergency");
  const [callNumber, setCallNumber] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recent calls
  const { data: calls, isLoading } = useQuery({
    queryKey: ["/api/security/calls"],
  });

  // Make a security call
  const makeCallMutation = useMutation({
    mutationFn: async (callData: { type: string; number?: string; priority: string }) => {
      return apiRequest("POST", "/api/security/calls", callData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/calls"] });
      toast({
        title: "Call Initiated",
        description: "Security call has been initiated successfully",
      });
      setCallNumber("");
    },
    onError: (error: Error) => {
      toast({
        title: "Call Failed",
        description: error.message || "Failed to initiate call",
        variant: "destructive",
      });
    },
  });

  const handleEmergencyCall = () => {
    makeCallMutation.mutate({
      type: "emergency",
      priority: "critical"
    });
  };

  const handleCustomCall = () => {
    if (!callNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    makeCallMutation.mutate({
      type: callType,
      number: callNumber,
      priority: callType === "emergency" ? "critical" : "normal"
    });
  };

  const getCallTypeColor = (type: string) => {
    switch (type) {
      case "emergency": return "destructive";
      case "security": return "secondary";
      case "maintenance": return "outline";
      default: return "default";
    }
  };

  const getCallStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "completed": return "secondary";
      case "failed": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-100">Emergency</h3>
                <p className="text-sm text-red-700 dark:text-red-300">Critical situations</p>
              </div>
            </div>
            <Button 
              className="w-full mt-3 bg-red-600 hover:bg-red-700"
              onClick={handleEmergencyCall}
              disabled={makeCallMutation.isPending}
            >
              <Phone className="mr-2 h-4 w-4" />
              Emergency Call
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PhoneCall className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Security Line</h3>
                <p className="text-sm text-muted-foreground">Internal security</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full mt-3">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Security
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Make Security Call</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Call Type</label>
                    <Select value={callType} onValueChange={setCallType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input 
                      value={callNumber}
                      onChange={(e) => setCallNumber(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <Button 
                    onClick={handleCustomCall}
                    disabled={makeCallMutation.isPending}
                    className="w-full"
                  >
                    {makeCallMutation.isPending ? "Calling..." : "Make Call"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">All Call</h3>
                <p className="text-sm text-muted-foreground">Campus-wide announcement</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-3">
              <PhoneCall className="mr-2 h-4 w-4" />
              Broadcast
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded-lg" />
                </div>
              ))}
            </div>
          ) : calls && Array.isArray(calls) && calls.length > 0 ? (
            <div className="space-y-3">
              {(calls || []).map((call: any) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-muted rounded-lg">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{call.type.charAt(0).toUpperCase() + call.type.slice(1)} Call</p>
                        <Badge variant={getCallTypeColor(call.type)}>
                          {call.type}
                        </Badge>
                        <Badge variant={getCallStatusColor(call.status)}>
                          {call.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{call.number || "Internal"}</span>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(call.timestamp).toLocaleString()}</span>
                        </div>
                        {call.duration && (
                          <span>Duration: {call.duration}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {call.status === "active" && (
                      <Button size="sm" variant="destructive">
                        <PhoneOff className="h-3 w-3 mr-1" />
                        End
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No recent calls</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}