import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarHeader, CalendarGrid, CalendarSidebar, EventDetailsDialog } from "@/components/calendar/modules";

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
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [view, setView] = useState('month');

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

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventCreate = (data: any) => {
    // Handle event creation
    console.log('Creating event:', data);
  };

  const upcomingEvents = useMemo(() => 
    mockEvents
      .filter(event => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [mockEvents]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8">
        <CalendarHeader
          currentDate={currentDate}
          onPrevious={() => navigateMonth('prev')}
          onNext={() => navigateMonth('next')}
          onToday={goToToday}
          view={view}
          onViewChange={setView}
          onEventCreate={handleEventCreate}
          canCreateEvents={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <CalendarGrid
                  currentDate={currentDate}
                  events={mockEvents}
                  onEventClick={handleEventClick}
                  onDateClick={handleDateClick}
                  eventTypes={eventTypes}
                />
              </CardContent>
            </Card>
          </div>

          <CalendarSidebar
            events={mockEvents}
            eventTypes={eventTypes}
            selectedDate={selectedDate}
            onEventClick={handleEventClick}
          />
        </div>

        <EventDetailsDialog
          isOpen={isEventDialogOpen}
          onClose={() => setIsEventDialogOpen(false)}
          event={selectedEvent}
          eventTypes={eventTypes}
          canEdit={true}
        />
      </div>
    </div>
  );
}