import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Eye, Shield, Users, Camera, Clock, MapPin } from "lucide-react";

interface SecurityEvent {
  id: string;
  type: string;
  severity: string;
  status: string;
  zoneId: string;
  zoneName: string;
  cameraId: string;
  cameraName: string;
  description: string;
  detectedAt: string;
  resolvedAt?: string;
  assignedTo?: string;
  imageUrl?: string;
  metadata?: any;
}

interface SecurityEventsListProps {
  events: SecurityEvent[];
  onEventSelect?: (event: SecurityEvent) => void;
  onUpdateStatus?: (eventId: string, status: string) => void;
}

const eventTypeIcons = {
  intrusion: AlertTriangle,
  suspicious_activity: Eye,
  vandalism: Shield,
  theft: Users,
  violence: AlertTriangle,
};

const severityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const statusColors = {
  active: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  investigating: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  resolved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  false_alarm: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export default function SecurityEventsList({ events, onEventSelect, onUpdateStatus }: SecurityEventsListProps) {
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const eventTime = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - eventTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="space-y-3">
      {events.map((event) => {
        const EventIcon = eventTypeIcons[event.type as keyof typeof eventTypeIcons] || AlertTriangle;
        
        return (
          <Card key={event.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onEventSelect?.(event)}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Event Type Icon */}
                <div className={`p-2 rounded-full ${
                  event.severity === 'critical' ? 'bg-red-100 text-red-600' :
                  event.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                  event.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <EventIcon className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  {/* Event Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-sm">{event.description}</h3>
                      <Badge className={`text-xs ${severityColors[event.severity as keyof typeof severityColors]}`}>
                        {event.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <Badge className={`text-xs ${statusColors[event.status as keyof typeof statusColors]}`}>
                      {event.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{event.zoneName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Camera className="h-3 w-3" />
                      <span>{event.cameraName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{getTimeAgo(event.detectedAt)}</span>
                    </div>
                    {event.assignedTo && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{event.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  {/* Metadata */}
                  {event.metadata && (
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                      {event.metadata.confidence && (
                        <span>Confidence: {Math.round(event.metadata.confidence * 100)}%</span>
                      )}
                      {event.metadata.personCount && (
                        <span>Persons: {event.metadata.personCount}</span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  {event.status === 'active' && (
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus?.(event.id, 'investigating');
                        }}
                      >
                        Investigate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus?.(event.id, 'false_alarm');
                        }}
                      >
                        False Alarm
                      </Button>
                    </div>
                  )}

                  {event.status === 'investigating' && (
                    <div className="flex space-x-2 mt-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateStatus?.(event.id, 'resolved');
                        }}
                      >
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {events.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No security events found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}