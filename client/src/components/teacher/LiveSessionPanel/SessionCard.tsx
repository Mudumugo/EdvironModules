import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, Calendar, Clock, Play, Square, Settings, Monitor } from "lucide-react";

interface SessionCardProps {
  session: any;
  onStartSession: (sessionId: string) => void;
  onEndSession: (sessionId: string) => void;
  onJoinSession: (sessionId: string) => void;
  onOpenControl: (sessionId: string) => void;
}

export function SessionCard({ 
  session, 
  onStartSession, 
  onEndSession, 
  onJoinSession, 
  onOpenControl 
}: SessionCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline">Scheduled</Badge>;
      case 'live':
        return <Badge variant="default" className="bg-red-500">Live</Badge>;
      case 'ended':
        return <Badge variant="secondary">Ended</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const { date, time } = formatDateTime(session.scheduledFor);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Video className="h-5 w-5" />
              {session.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {session.className} • {session.grade}
            </CardDescription>
          </div>
          {getStatusBadge(session.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{session.participants || 0} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4 text-gray-500" />
            <span>{session.duration} min</span>
          </div>
        </div>

        {session.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {session.description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          {session.status === 'scheduled' && (
            <Button
              size="sm"
              onClick={() => onStartSession(session.id)}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          )}

          {session.status === 'live' && (
            <>
              <Button
                size="sm"
                onClick={() => onJoinSession(session.id)}
                className="flex-1"
              >
                <Video className="h-4 w-4 mr-2" />
                Join
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenControl(session.id)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onEndSession(session.id)}
              >
                <Square className="h-4 w-4" />
              </Button>
            </>
          )}

          {session.status === 'ended' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenControl(session.id)}
              className="flex-1"
            >
              <Monitor className="h-4 w-4 mr-2" />
              View Recording
            </Button>
          )}
        </div>

        {session.status === 'live' && session.joinUrl && (
          <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm">
            <strong>Join URL:</strong>
            <div className="font-mono text-xs mt-1 break-all">
              {session.joinUrl}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}