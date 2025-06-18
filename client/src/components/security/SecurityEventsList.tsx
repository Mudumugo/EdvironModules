import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Clock, MapPin, Eye } from "lucide-react";

interface SecurityEventsListProps {
  events: any[];
  onEventClick?: (event: any) => void;
  compact?: boolean;
}

export default function SecurityEventsList({ events, onEventClick, compact = false }: SecurityEventsListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "destructive";
      case "high": return "destructive";
      case "medium": return "secondary";
      case "low": return "outline";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "destructive";
      case "resolved": return "default";
      case "investigating": return "secondary";
      default: return "outline";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No security events found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event: any) => (
        <Card 
          key={event.id} 
          className={`transition-colors hover:bg-muted/50 ${compact ? 'p-3' : 'p-4'} cursor-pointer`}
          onClick={() => onEventClick?.(event)}
        >
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-1">
                  {getSeverityIcon(event.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className={`font-medium ${compact ? 'text-sm' : 'text-base'} truncate`}>
                      {event.type}
                    </h4>
                    <Badge variant={getSeverityColor(event.severity)} className="text-xs">
                      {event.severity}
                    </Badge>
                    <Badge variant={getStatusColor(event.status)} className="text-xs">
                      {event.status}
                    </Badge>
                  </div>
                  <p className={`text-muted-foreground ${compact ? 'text-xs' : 'text-sm'} line-clamp-2`}>
                    {event.description}
                  </p>
                  <div className={`flex items-center space-x-4 mt-2 ${compact ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {!compact && (
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  {event.status !== "resolved" && (
                    <Button size="sm">
                      Respond
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}