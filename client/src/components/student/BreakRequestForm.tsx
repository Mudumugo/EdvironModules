import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { BreakRequest } from "./types";

interface BreakRequestFormProps {
  onSubmitRequest: (request: { reason: string; duration: number }) => void;
  pendingRequests: BreakRequest[];
  onCancelRequest: (requestId: string) => void;
}

export function BreakRequestForm({ 
  onSubmitRequest, 
  pendingRequests, 
  onCancelRequest 
}: BreakRequestFormProps) {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState(15);
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedReasons = [
    "Bathroom break",
    "Water/snack break",
    "Technical difficulties",
    "Health issue",
    "Emergency",
    "Teacher permission",
    "Custom"
  ];

  const durationOptions = [
    { value: 5, label: "5 minutes" },
    { value: 10, label: "10 minutes" },
    { value: 15, label: "15 minutes" },
    { value: 30, label: "30 minutes" },
    { value: 60, label: "1 hour" }
  ];

  const handleSubmit = async () => {
    const finalReason = reason === "Custom" ? customReason : reason;
    
    if (!finalReason.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmitRequest({
        reason: finalReason,
        duration
      });
      
      // Reset form
      setReason("");
      setCustomReason("");
      setDuration(15);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return AlertCircle;
      case 'approved': return CheckCircle;
      case 'denied': return XCircle;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'approved': return 'green';
      case 'denied': return 'red';
      default: return 'gray';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const hasPendingRequest = pendingRequests.some(req => req.status === 'pending');

  return (
    <div className="space-y-4">
      {/* Break Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Request Break Time
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasPendingRequest ? (
            <div className="text-center py-6">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-medium text-gray-900 mb-1">Request Pending</h3>
              <p className="text-sm text-gray-600">
                You have a break request waiting for approval.
              </p>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="reason">Reason for break</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedReasons.map((reasonOption) => (
                      <SelectItem key={reasonOption} value={reasonOption}>
                        {reasonOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {reason === "Custom" && (
                <div>
                  <Label htmlFor="customReason">Custom reason</Label>
                  <Textarea
                    id="customReason"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Please explain why you need a break..."
                    rows={3}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select 
                  value={duration.toString()} 
                  onValueChange={(value) => setDuration(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Important</span>
                </div>
                <p className="text-xs text-blue-800">
                  Break requests require teacher approval. Emergency situations will be prioritized.
                  Please use break time responsibly.
                </p>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!reason || (reason === "Custom" && !customReason.trim()) || isSubmitting}
                className="w-full"
              >
                <Clock className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : `Request ${formatDuration(duration)} Break`}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.slice(0, 5).map((request) => {
                const StatusIcon = getStatusIcon(request.status);
                const statusColor = getStatusColor(request.status);
                
                return (
                  <div 
                    key={request.id} 
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 text-${statusColor}-500`} />
                      <div>
                        <div className="font-medium text-sm">{request.reason}</div>
                        <div className="text-xs text-gray-600">
                          {formatDuration(request.duration)} • {new Date(request.timestamp).toLocaleString()}
                        </div>
                        {request.approvedBy && (
                          <div className="text-xs text-gray-500">
                            Approved by {request.approvedBy}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`bg-${statusColor}-100 text-${statusColor}-700`}>
                        {request.status}
                      </Badge>
                      
                      {request.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCancelRequest(request.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}