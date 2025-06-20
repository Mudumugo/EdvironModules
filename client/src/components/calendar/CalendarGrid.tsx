import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarEvent, EVENT_TYPES } from "./types";

interface CalendarGridProps {
  events: CalendarEvent[];
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: (date: Date, time?: string) => void;
}

export function CalendarGrid({ 
  events, 
  currentDate, 
  view, 
  onDateChange, 
  onEventClick, 
  onCreateEvent 
}: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { startDate, endDate, days } = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (view === 'month') {
      start.setDate(1);
      start.setDate(start.getDate() - start.getDay());
      end.setMonth(end.getMonth() + 1, 0);
      end.setDate(end.getDate() + (6 - end.getDay()));
    } else if (view === 'week') {
      start.setDate(start.getDate() - start.getDay());
      end.setDate(start.getDate() + 6);
    } else {
      end.setDate(start.getDate());
    }

    const daysList = [];
    const current = new Date(start);
    while (current <= end) {
      daysList.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return { startDate: start, endDate: end, days: daysList };
  }, [currentDate, view]);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDateTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeInfo = (type: string) => {
    return EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[0];
  };

  const formatTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    
    onDateChange(newDate);
  };

  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-medium text-gray-600 border-b">
            {day}
          </div>
        ))}
        
        {/* Days */}
        {days.map((date, index) => {
          const dayEvents = getEventsForDate(date);
          const isCurrentMonthDay = isCurrentMonth(date);
          const isTodayDate = isToday(date);
          
          return (
            <Card 
              key={index} 
              className={`min-h-24 cursor-pointer hover:bg-gray-50 ${
                !isCurrentMonthDay ? 'opacity-50' : ''
              } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onCreateEvent(date)}
            >
              <CardContent className="p-2">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-sm ${isTodayDate ? 'font-bold text-blue-600' : ''}`}>
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 2 && (
                    <span className="text-xs text-gray-500">+{dayEvents.length - 2}</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => {
                    const typeInfo = getEventTypeInfo(event.eventType);
                    return (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded bg-${typeInfo.color}-100 text-${typeInfo.color}-800 truncate cursor-pointer hover:bg-${typeInfo.color}-200`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        {event.isAllDay ? event.title : `${formatTime(event.startDateTime)} ${event.title}`}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
    
    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column header */}
        <div className="p-2 text-center font-medium text-gray-600 border-b">Time</div>
        
        {/* Day headers */}
        {days.map(date => (
          <div key={date.toISOString()} className="p-2 text-center font-medium text-gray-600 border-b">
            <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <div className={`text-lg ${isToday(date) ? 'font-bold text-blue-600' : ''}`}>
              {date.getDate()}
            </div>
          </div>
        ))}
        
        {/* Time slots */}
        {timeSlots.map(hour => (
          <div key={hour} className="contents">
            <div className="p-2 text-sm text-gray-500 border-r">
              {hour}:00
            </div>
            {days.map(date => {
              const slotEvents = events.filter(event => {
                const eventDate = new Date(event.startDateTime);
                const eventHour = eventDate.getHours();
                return eventDate.toDateString() === date.toDateString() && eventHour === hour;
              });
              
              return (
                <div 
                  key={`${date.toISOString()}-${hour}`}
                  className="min-h-12 border border-gray-100 p-1 cursor-pointer hover:bg-gray-50"
                  onClick={() => onCreateEvent(date, `${hour}:00`)}
                >
                  {slotEvents.map(event => {
                    const typeInfo = getEventTypeInfo(event.eventType);
                    return (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded bg-${typeInfo.color}-100 text-${typeInfo.color}-800 mb-1 cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);
    const dayEvents = getEventsForDate(currentDate);
    
    return (
      <div className="space-y-1">
        {timeSlots.map(hour => {
          const slotEvents = dayEvents.filter(event => {
            const eventHour = new Date(event.startDateTime).getHours();
            return eventHour === hour;
          });
          
          return (
            <div key={hour} className="flex border-b">
              <div className="w-20 p-2 text-sm text-gray-500 border-r">
                {hour}:00
              </div>
              <div 
                className="flex-1 min-h-16 p-2 cursor-pointer hover:bg-gray-50"
                onClick={() => onCreateEvent(currentDate, `${hour}:00`)}
              >
                {slotEvents.map(event => {
                  const typeInfo = getEventTypeInfo(event.eventType);
                  return (
                    <div
                      key={event.id}
                      className={`p-2 rounded bg-${typeInfo.color}-100 text-${typeInfo.color}-800 mb-1 cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs">
                        {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
                      </div>
                      {event.location && (
                        <div className="text-xs opacity-75">{event.location}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {currentDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric',
              ...(view === 'day' && { day: 'numeric' })
            })}
          </h2>
        </div>
        
        <Button onClick={() => onCreateEvent(new Date())} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-lg border">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
}

export default CalendarGrid;