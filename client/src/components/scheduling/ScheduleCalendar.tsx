import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay, addWeeks, subWeeks } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  type: string;
  startDate: string;
  startTime: string;
  endTime: string;
  location?: string;
  status: string;
}

interface ScheduleCalendarProps {
  events: Event[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export function ScheduleCalendar({ events, selectedDate, onDateSelect, onEventClick }: ScheduleCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'class': 'bg-blue-500',
      'meeting': 'bg-green-500',
      'event': 'bg-purple-500',
      'exam': 'bg-red-500',
      'workshop': 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.startDate), date)
    );
  };

  const goToPreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(startOfWeek(today));
    onDateSelect(today);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-3">
              {format(currentWeek, "MMM d")} - {format(addDays(currentWeek, 6), "MMM d, yyyy")}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium p-2 text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map((day) => {
            const dayEvents = getEventsForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`min-h-[120px] p-2 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-300' 
                    : isToday 
                      ? 'bg-yellow-50 border-yellow-300' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onDateSelect(day)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-yellow-600' : isSelected ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded text-white cursor-pointer hover:opacity-80 ${getEventTypeColor(event.type)}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="truncate font-medium">{event.title}</div>
                      <div className="flex items-center gap-1 opacity-90">
                        <Clock className="h-3 w-3" />
                        {event.startTime}
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}