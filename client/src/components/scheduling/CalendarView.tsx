import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, MapPin, Plus } from "lucide-react";
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, isToday } from "date-fns";

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

interface CalendarViewProps {
  events: CalendarEvent[];
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date, hour: number) => void;
}

export function CalendarView({ events, currentWeek, onWeekChange, onEventClick, onAddEvent }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7 AM to 6 PM

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'meeting': return 'bg-green-100 border-green-300 text-green-800';
      case 'event': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'exam': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const getEventsForHour = (date: Date, hour: number) => {
    return events.filter(event => {
      if (!isSameDay(event.date, date)) return false;
      const eventHour = parseInt(event.startTime.split(':')[0]);
      return eventHour === hour;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar View
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('day')}
            >
              Day
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(subWeeks(currentWeek, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="font-medium">
            {format(weekStart, 'MMM dd')} - {format(addDays(weekStart, 6), 'MMM dd, yyyy')}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onWeekChange(addWeeks(currentWeek, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-8 gap-1">
          {/* Time column header */}
          <div className="p-2 text-sm font-medium text-muted-foreground">
            Time
          </div>
          
          {/* Day headers */}
          {weekDays.map((day) => (
            <div
              key={day.toString()}
              className={`p-2 text-center text-sm font-medium border-b ${
                isToday(day) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              }`}
            >
              <div>{format(day, 'EEE')}</div>
              <div className={`text-lg ${isToday(day) ? 'font-bold' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
          
          {/* Time slots */}
          {hours.map((hour) => (
            <div key={hour} className="contents">
              {/* Time label */}
              <div className="p-2 text-sm text-muted-foreground border-r">
                {format(new Date().setHours(hour, 0), 'HH:mm')}
              </div>
              
              {/* Day slots */}
              {weekDays.map((day) => {
                const hourEvents = getEventsForHour(day, hour);
                
                return (
                  <div
                    key={`${day.toString()}-${hour}`}
                    className="min-h-[60px] border border-gray-200 p-1 hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => onAddEvent(day, hour)}
                  >
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded border cursor-pointer hover:shadow-sm ${getEventTypeColor(event.type)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{event.startTime}-{event.endTime}</span>
                        </div>
                        {event.room && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{event.room}</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {hourEvents.length === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}