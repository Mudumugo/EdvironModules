import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Users, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Event {
  id: string;
  title: string;
  type: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  attendees?: number;
  status: string;
  description?: string;
}

interface EventsListProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onEventEdit: (event: Event) => void;
  onEventDelete: (eventId: string) => void;
  selectedDate: Date;
}

export function EventsList({ 
  events, 
  onEventClick, 
  onEventEdit, 
  onEventDelete,
  selectedDate 
}: EventsListProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'class': 'border-l-blue-500',
      'meeting': 'border-l-green-500',
      'event': 'border-l-purple-500',
      'exam': 'border-l-red-500',
      'workshop': 'border-l-orange-500'
    };
    return colors[type] || 'border-l-gray-500';
  };

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            Events for {format(selectedDate, "MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No events scheduled for this date</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Events for {format(selectedDate, "MMMM d, yyyy")} ({events.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-4 border-l-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer ${getTypeColor(event.type)}`}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {event.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {event.startTime} - {event.endTime}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.attendees} attendees
                      </div>
                    )}
                  </div>
                  
                  {event.description && (
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEventEdit(event)}>
                      Edit Event
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onEventDelete(event.id)}
                      className="text-red-600"
                    >
                      Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}