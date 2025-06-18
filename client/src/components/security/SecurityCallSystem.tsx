import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Phone, PhoneCall, PhoneOff, Clock, AlertTriangle, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecurityCall {
  id: string;
  callType: string;
  fromExtension: string;
  toExtension: string;
  fromZone?: string;
  toZone?: string;
  duration?: number;
  status: string;
  priority: string;
  notes?: string;
  startedAt: string;
  endedAt?: string;
}

interface SecurityCallSystemProps {
  calls: SecurityCall[];
  onInitiateCall?: (data: any) => void;
  onAnswerCall?: (callId: string) => void;
  onEndCall?: (callId: string) => void;
}

export default function SecurityCallSystem({ calls, onInitiateCall, onAnswerCall, onEndCall }: SecurityCallSystemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [callData, setCallData] = useState({
    toExtension: "",
    callType: "routine",
    priority: "normal",
    notes: "",
  });
  const { toast } = useToast();

  const handleInitiateCall = (e: React.FormEvent) => {
    e.preventDefault();
    onInitiateCall?.(callData);
    setIsDialogOpen(false);
    setCallData({
      toExtension: "",
      callType: "routine",
      priority: "normal",
      notes: "",
    });
    toast({
      title: "Call Initiated",
      description: `Calling extension ${callData.toExtension}...`,
    });
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const callTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - callTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const statusColors = {
    ringing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    completed: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    missed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    busy: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    normal: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    emergency: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const activeCalls = calls.filter(call => call.status === 'ringing' || call.status === 'active');
  const recentCalls = calls.filter(call => call.status !== 'ringing' && call.status !== 'active').slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Header with Quick Call */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Security Communication</h3>
          <p className="text-sm text-muted-foreground">Internal communication system</p>
        </div>
        <div className="flex space-x-2">
          {/* Emergency Call Button */}
          <Button 
            variant="destructive" 
            onClick={() => {
              onInitiateCall?.({
                toExtension: "911",
                callType: "emergency",
                priority: "emergency",
                notes: "Emergency call initiated from security",
              });
              toast({
                title: "Emergency Call",
                description: "Emergency services contacted",
                variant: "destructive",
              });
            }}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PhoneCall className="h-4 w-4 mr-2" />
                Make Call
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Initiate Security Call</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleInitiateCall} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="toExtension">Extension Number *</Label>
                  <Input
                    id="toExtension"
                    value={callData.toExtension}
                    onChange={(e) => setCallData({ ...callData, toExtension: e.target.value })}
                    placeholder="e.g., 3001, 3002"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Call Type</Label>
                    <Select value={callData.callType} onValueChange={(value) => setCallData({ ...callData, callType: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={callData.priority} onValueChange={(value) => setCallData({ ...callData, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={callData.notes}
                    onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                    placeholder="Call purpose or additional information"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Calls */}
      {activeCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              Active Calls ({activeCalls.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    call.status === 'ringing' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                  }`}>
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Ext {call.toExtension}</span>
                      <Badge className={`text-xs ${statusColors[call.status as keyof typeof statusColors]}`}>
                        {call.status.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${priorityColors[call.priority as keyof typeof priorityColors]}`}>
                        {call.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {call.callType} • Started {getTimeAgo(call.startedAt)}
                      {call.notes && ` • ${call.notes}`}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {call.status === 'ringing' && (
                    <Button size="sm" onClick={() => onAnswerCall?.(call.id)}>
                      <PhoneCall className="h-3 w-3 mr-1" />
                      Answer
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => onEndCall?.(call.id)}>
                    <PhoneOff className="h-3 w-3 mr-1" />
                    End
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Calls */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    call.status === 'completed' ? 'bg-green-100 text-green-600' :
                    call.status === 'missed' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Ext {call.toExtension}</span>
                      <Badge className={`text-xs ${statusColors[call.status as keyof typeof statusColors]}`}>
                        {call.status.toUpperCase()}
                      </Badge>
                      <Badge className={`text-xs ${priorityColors[call.priority as keyof typeof priorityColors]}`}>
                        {call.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {call.callType} • {getTimeAgo(call.startedAt)}
                      {call.duration && ` • Duration: ${formatDuration(call.duration)}`}
                      {call.notes && ` • ${call.notes}`}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {new Date(call.startedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {recentCalls.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent calls</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Extensions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Extensions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { ext: "3000", label: "Security HQ" },
              { ext: "3001", label: "Main Gate" },
              { ext: "3002", label: "Admin Office" },
              { ext: "3003", label: "Maintenance" },
              { ext: "3004", label: "IT Support" },
              { ext: "3005", label: "Medical Bay" },
              { ext: "911", label: "Emergency", priority: "emergency" },
              { ext: "100", label: "Fire Dept", priority: "high" },
            ].map((contact) => (
              <Button
                key={contact.ext}
                variant="outline"
                size="sm"
                className={`flex flex-col h-auto p-3 ${
                  contact.priority === 'emergency' ? 'border-red-200 hover:bg-red-50' :
                  contact.priority === 'high' ? 'border-orange-200 hover:bg-orange-50' : ''
                }`}
                onClick={() => {
                  onInitiateCall?.({
                    toExtension: contact.ext,
                    callType: contact.priority === 'emergency' ? 'emergency' : 'routine',
                    priority: contact.priority || 'normal',
                    notes: `Quick call to ${contact.label}`,
                  });
                  toast({
                    title: "Call Initiated",
                    description: `Calling ${contact.label} (${contact.ext})...`,
                  });
                }}
              >
                <Phone className="h-3 w-3 mb-1" />
                <span className="text-xs font-medium">{contact.ext}</span>
                <span className="text-xs text-muted-foreground">{contact.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}