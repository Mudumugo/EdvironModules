import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon,
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Users,
  BookOpen,
  UserCheck,
  Coffee,
  Home
} from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: 'assessment' | 'school-event' | 'meeting' | 'professional-development' | 'holiday';
  description?: string;
  isAllDay?: boolean;
}

const eventTypes = [
  { id: 'assessment', label: 'Assessments', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'school-event', label: 'School Events', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  { id: 'meeting', label: 'Meetings', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  { id: 'professional-development', label: 'Professional Development', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
  { id: 'holiday', label: 'Holidays', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-100 dark:bg-red-900/20' }
];

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Math Quiz - Grade 7',
    date: new Date(2024, 11, 16), // December 16, 2024
    time: '9:00 AM',
    location: 'Room 101',
    type: 'assessment'
  },
  {
    id: '2',
    title: 'Science Fair Setup',
    date: new Date(2024, 11, 17), // December 17, 2024
    time: '2:00 PM',
    location: 'Main Hall',
    type: 'school-event'
  },
  {
    id: '3',
    title: 'Parent-Teacher Conference',
    date: new Date(2024, 11, 18), // December 18, 2024
    time: '3:30 PM',
    location: 'Conference Room',
    type: 'meeting'
  },
  {
    id: '4',
    title: 'Staff Development Workshop',
    date: new Date(2024, 11, 19), // December 19, 2024
    time: '8:00 AM',
    location: 'Faculty Lounge',
    type: 'professional-development'
  },
  {
    id: '5',
    title: 'Winter Break Begins',
    date: new Date(2024, 11, 20), // December 20, 2024
    time: 'All Day',
    location: 'School-wide',
    type: 'holiday',
    isAllDay: true
  }
];

export default function SchoolCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 11, 1)); // December 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    return mockEvents.filter(event => {
      return event.date.getDate() === date.getDate() &&
             event.date.getMonth() === date.getMonth() &&
             event.date.getFullYear() === date.getFullYear();
    });
  };

  const getEventTypeConfig = (type: string) => {
    return eventTypes.find(t => t.id === type) || eventTypes[0];
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'assessment': return BookOpen;
      case 'school-event': return Users;
      case 'meeting': return UserCheck;
      case 'professional-development': return Coffee;
      case 'holiday': return Home;
      default: return CalendarIcon;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const upcomingEvents = mockEvents
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const days = getDaysInMonth(currentDate);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">School Calendar</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage academic events and important dates
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('prev')}
                      className="border-slate-200 dark:border-slate-600"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={goToToday}
                      className="border-slate-200 dark:border-slate-600"
                    >
                      Today
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigateMonth('next')}
                      className="border-slate-200 dark:border-slate-600"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => {
                    if (day === null) {
                      return <div key={index} className="aspect-square p-1"></div>;
                    }

                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const events = getEventsForDate(date);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();

                    return (
                      <div
                        key={day}
                        className={`aspect-square p-1 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                          isToday ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <div className="h-full flex flex-col">
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'
                          }`}>
                            {day}
                          </div>
                          <div className="flex-1 space-y-1 overflow-hidden">
                            {events.slice(0, 3).map(event => {
                              const typeConfig = getEventTypeConfig(event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs px-1 py-0.5 rounded truncate ${typeConfig.bgColor} ${typeConfig.textColor}`}
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                            {events.length > 3 && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                +{events.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Events */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map(event => {
                  const typeConfig = getEventTypeConfig(event.type);
                  const IconComponent = getEventIcon(event.type);
                  
                  return (
                    <div key={event.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                      <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
                        <IconComponent className={`h-4 w-4 ${typeConfig.textColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {event.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Event Types */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800 dark:text-slate-200">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {eventTypes.map(type => (
                  <div key={type.id} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                    <span className="text-sm text-slate-700 dark:text-slate-300">{type.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card className="mt-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                Events for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-slate-600 dark:text-slate-400">No events scheduled for this date.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getEventsForDate(selectedDate).map(event => {
                    const typeConfig = getEventTypeConfig(event.type);
                    const IconComponent = getEventIcon(event.type);
                    
                    return (
                      <Card key={event.id} className="border-slate-200 dark:border-slate-600">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${typeConfig.bgColor}`}>
                              <IconComponent className={`h-4 w-4 ${typeConfig.textColor}`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800 dark:text-slate-200">
                                {event.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-2 text-sm text-slate-600 dark:text-slate-400">
                                <Clock className="h-3 w-3" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="h-3 w-3" />
                                <span>{event.location}</span>
                              </div>
                              <Badge variant="outline" className="mt-2">
                                {typeConfig.label}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}