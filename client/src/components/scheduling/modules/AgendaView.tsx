import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, Timer, Building, UserCheck, CheckCircle } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'meeting' | 'event' | 'exam';
  startTime: string;
  endTime: string;
  date: Date;
  room?: string;
  participants?: string[];
  description?: string;
  color?: string;
}

interface AgendaViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaView({ events, onEventClick }: AgendaViewProps) {
  const sortedEvents = events.sort((a, b) => 
    new Date(a.date.getTime() + a.startTime.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0) * 60000).getTime() - 
    new Date(b.date.getTime() + b.startTime.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0) * 60000).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Event Agenda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found.
            </div>
          ) : (
            sortedEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${
                    event.type === 'class' ? 'bg-blue-500' :
                    event.type === 'meeting' ? 'bg-green-500' :
                    event.type === 'event' ? 'bg-purple-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.date.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        {event.startTime} - {event.endTime}
                      </div>
                      {event.room && (
                        <div className="flex items-center gap-1">
                          <Building className="h-3 w-3" />
                          {event.room}
                        </div>
                      )}
                      {event.participants && event.participants.length > 0 && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          {event.participants.length} participants
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="capitalize">
                    {event.type}
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}