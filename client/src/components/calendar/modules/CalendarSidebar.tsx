import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, BookOpen, UserCheck, Coffee, Home } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: string;
  description?: string;
  isAllDay?: boolean;
}

interface CalendarSidebarProps {
  events: CalendarEvent[];
  eventTypes: any[];
  selectedDate: Date | null;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarSidebar({ events, eventTypes, selectedDate, onEventClick }: CalendarSidebarProps) {
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'assessment': return BookOpen;
      case 'school-event': return Users;
      case 'meeting': return UserCheck;
      case 'professional-development': return Coffee;
      case 'holiday': return Home;
      default: return Calendar;
    }
  };

  const getEventTypeStyle = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType || { textColor: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  const upcomingEvents = getUpcomingEvents();
  const selectedDateEvents = getEventsForSelectedDate();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{events.length}</div>
              <div className="text-sm text-gray-600">Total Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{upcomingEvents.length}</div>
              <div className="text-sm text-gray-600">This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Events</span>
          </CardTitle>
          <CardDescription>Next 7 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.map(event => {
            const style = getEventTypeStyle(event.type);
            const Icon = getEventIcon(event.type);
            return (
              <div
                key={event.id}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-start space-x-3">
                  <Icon className="h-4 w-4 mt-1 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{event.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs ${style.bgColor} ${style.textColor}`}>
                    {eventTypes.find(t => t.id === event.type)?.label || event.type}
                  </Badge>
                </div>
              </div>
            );
          })}
          {upcomingEvents.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No upcoming events
            </p>
          )}
        </CardContent>
      </Card>

      {/* Selected Date Events */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate.toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </CardTitle>
            <CardDescription>Events on selected date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDateEvents.map(event => {
              const style = getEventTypeStyle(event.type);
              const Icon = getEventIcon(event.type);
              return (
                <div
                  key={event.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => onEventClick(event)}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className="h-4 w-4 mt-1 text-gray-400" />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Badge className={`text-xs ${style.bgColor} ${style.textColor}`}>
                      {eventTypes.find(t => t.id === event.type)?.label || event.type}
                    </Badge>
                  </div>
                </div>
              );
            })}
            {selectedDateEvents.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No events on this date
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Event Types Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Event Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {eventTypes.map(type => {
            const Icon = getEventIcon(type.id);
            return (
              <div key={type.id} className="flex items-center space-x-3">
                <Icon className="h-4 w-4" />
                <div className={`w-3 h-3 rounded-full ${type.color}`} />
                <span className="text-sm">{type.label}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}