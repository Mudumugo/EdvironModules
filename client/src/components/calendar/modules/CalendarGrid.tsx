import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  eventTypes: any[];
}

export function CalendarGrid({ currentDate, events, onEventClick, onDateClick, eventTypes }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventTypeStyle = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType || { textColor: 'text-gray-700', bgColor: 'bg-gray-100' };
  };

  const today = new Date();
  const days = getDaysInMonth(currentDate);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b bg-gray-50">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center font-medium text-gray-600 border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-24 border-r border-b last:border-r-0 bg-gray-50" />;
          }

          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
          const dayEvents = getEventsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();

          return (
            <div
              key={day}
              className={`h-24 border-r border-b last:border-r-0 p-1 cursor-pointer hover:bg-gray-50 ${
                isToday ? 'bg-blue-50' : ''
              } ${!isCurrentMonth ? 'bg-gray-100' : ''}`}
              onClick={() => onDateClick(date)}
            >
              <div className={`text-sm font-medium mb-1 ${
                isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {day}
              </div>
              <div className="space-y-1 overflow-hidden">
                {dayEvents.slice(0, 2).map(event => {
                  const style = getEventTypeStyle(event.type);
                  return (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${style.bgColor} ${style.textColor}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayEvents.length - 2} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}