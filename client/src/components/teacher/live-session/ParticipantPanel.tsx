import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users,
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorSpeaker,
  MessageSquare,
  Circle
} from "lucide-react";
import { SessionParticipant } from "./LiveSessionTypes";

interface ParticipantPanelProps {
  participants: SessionParticipant[];
  onParticipantAction: (participantId: string, action: string) => void;
}

export const ParticipantPanel: React.FC<ParticipantPanelProps> = ({
  participants,
  onParticipantAction
}) => {
  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-blue-500';
      case 'fair':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participants ({participants.length})
        </CardTitle>
        <CardDescription>
          Manage session participants and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className={`h-2 w-2 ${getStatusColor(participant.status)}`} />
                    <span className="font-medium">{participant.userId}</span>
                    <Badge variant="outline" className="text-xs">
                      {participant.role}
                    </Badge>
                  </div>
                  <div className={`text-xs ${getConnectionQualityColor(participant.connectionQuality)}`}>
                    {participant.connectionQuality}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>Device: {participant.deviceId}</span>
                  <span>•</span>
                  <span>Last active: {new Date(participant.lastActivity).toLocaleTimeString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button
                      variant={participant.isAudioMuted ? "outline" : "default"}
                      size="sm"
                      onClick={() => onParticipantAction(participant.id, 'toggle_audio')}
                    >
                      {participant.isAudioMuted ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant={participant.isVideoMuted ? "outline" : "default"}
                      size="sm"
                      onClick={() => onParticipantAction(participant.id, 'toggle_video')}
                    >
                      {participant.isVideoMuted ? (
                        <VideoOff className="h-4 w-4" />
                      ) : (
                        <Video className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant={participant.isScreenSharing ? "default" : "outline"}
                      size="sm"
                      onClick={() => onParticipantAction(participant.id, 'toggle_screen_share')}
                    >
                      <MonitorSpeaker className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onParticipantAction(participant.id, 'message')}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    {participant.canBeControlled && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onParticipantAction(participant.id, 'request_control')}
                      >
                        Control
                      </Button>
                    )}
                  </div>
                </div>

                {participant.isScreenSharing && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                    <div className="flex items-center gap-2">
                      <MonitorSpeaker className="h-4 w-4 text-blue-500" />
                      <span className="text-blue-700 dark:text-blue-300">
                        Currently sharing screen
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};