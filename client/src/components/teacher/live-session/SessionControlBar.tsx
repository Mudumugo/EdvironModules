import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play,
  Square,
  Pause,
  Settings,
  Users
} from "lucide-react";

interface SessionControlBarProps {
  sessionStatus: string;
  participantCount: number;
  onStartSession: () => void;
  onEndSession: () => void;
  onPauseSession: () => void;
  onSettings: () => void;
}

export const SessionControlBar: React.FC<SessionControlBarProps> = ({
  sessionStatus,
  participantCount,
  onStartSession,
  onEndSession,
  onPauseSession,
  onSettings
}) => {
  const getStatusColor = () => {
    switch (sessionStatus) {
      case 'active':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'ended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusText = () => {
    switch (sessionStatus) {
      case 'active':
        return 'Live';
      case 'paused':
        return 'Paused';
      case 'ended':
        return 'Ended';
      case 'scheduled':
        return 'Scheduled';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800">
      <div className="flex items-center gap-4">
        <Badge variant={getStatusColor()} className="text-sm">
          {getStatusText()}
        </Badge>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Users className="h-4 w-4" />
          <span>{participantCount} participants</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {sessionStatus === 'scheduled' && (
          <Button
            variant="default"
            size="sm"
            onClick={onStartSession}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Session
          </Button>
        )}

        {sessionStatus === 'active' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={onPauseSession}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onEndSession}
            >
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </>
        )}

        {sessionStatus === 'paused' && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={onStartSession}
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onEndSession}
            >
              <Square className="h-4 w-4 mr-2" />
              End Session
            </Button>
          </>
        )}

        <Separator orientation="vertical" className="h-6" />
        
        <Button
          variant="outline"
          size="sm"
          onClick={onSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>
    </div>
  );
};