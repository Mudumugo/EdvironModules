import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneOff, Pause, Play, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { Call, CALL_STATUSES } from "./types";

interface CallControlProps {
  activeCalls: Call[];
  onMakeCall: (number: string) => void;
  onAnswerCall: (callId: string) => void;
  onEndCall: (callId: string) => void;
  onHoldCall: (callId: string) => void;
  onResumeCall: (callId: string) => void;
  onMuteCall: (callId: string) => void;
  onTransferCall: (callId: string, destination: string) => void;
}

export function CallControl({
  activeCalls,
  onMakeCall,
  onAnswerCall,
  onEndCall,
  onHoldCall,
  onResumeCall,
  onMuteCall,
  onTransferCall
}: CallControlProps) {
  const [dialNumber, setDialNumber] = useState("");
  const [transferNumber, setTransferNumber] = useState("");
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const handleDial = () => {
    if (dialNumber.trim()) {
      onMakeCall(dialNumber);
      setDialNumber("");
    }
  };

  const handleTransfer = () => {
    if (selectedCall && transferNumber.trim()) {
      onTransferCall(selectedCall, transferNumber);
      setTransferNumber("");
      setSelectedCall(null);
    }
  };

  const getStatusInfo = (status: string) => {
    return CALL_STATUSES.find(s => s.value === status) || CALL_STATUSES[0];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Dialer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Make Call
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter phone number or extension"
              value={dialNumber}
              onChange={(e) => setDialNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleDial()}
              className="flex-1"
            />
            <Button onClick={handleDial} disabled={!dialNumber.trim()}>
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Calls */}
      {activeCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Calls ({activeCalls.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeCalls.map((call) => {
                const statusInfo = getStatusInfo(call.status);
                const isSelected = selectedCall === call.id;

                return (
                  <div
                    key={call.id}
                    className={`p-4 border rounded-lg transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedCall(call.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {call.direction === 'inbound' ? call.from : call.to}
                          </span>
                          <span className="text-sm text-gray-600">
                            {call.type} • {call.direction}
                          </span>
                        </div>
                        <Badge className={`bg-${statusInfo.color}-100 text-${statusInfo.color}-700`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {call.duration ? formatDuration(call.duration) : '00:00'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {call.status === 'ringing' && call.direction === 'inbound' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAnswerCall(call.id);
                          }}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Answer
                        </Button>
                      )}

                      {call.status === 'active' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onHoldCall(call.id);
                            }}
                          >
                            <Pause className="h-4 w-4 mr-1" />
                            Hold
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsMuted(!isMuted);
                              onMuteCall(call.id);
                            }}
                          >
                            {isMuted ? (
                              <MicOff className="h-4 w-4 mr-1" />
                            ) : (
                              <Mic className="h-4 w-4 mr-1" />
                            )}
                            {isMuted ? 'Unmute' : 'Mute'}
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsSpeakerOn(!isSpeakerOn);
                            }}
                          >
                            {isSpeakerOn ? (
                              <VolumeX className="h-4 w-4 mr-1" />
                            ) : (
                              <Volume2 className="h-4 w-4 mr-1" />
                            )}
                            Speaker
                          </Button>
                        </>
                      )}

                      {call.status === 'hold' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onResumeCall(call.id);
                          }}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Resume
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEndCall(call.id);
                        }}
                      >
                        <PhoneOff className="h-4 w-4 mr-1" />
                        End
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call Transfer */}
      {selectedCall && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Call</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Transfer to number or extension"
                value={transferNumber}
                onChange={(e) => setTransferNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTransfer()}
                className="flex-1"
              />
              <Button onClick={handleTransfer} disabled={!transferNumber.trim()}>
                Transfer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}