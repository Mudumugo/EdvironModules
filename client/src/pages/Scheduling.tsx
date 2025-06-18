import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BookOpen, Globe } from "lucide-react";

// Import modular components
import { CalendarView } from "@/components/scheduling/CalendarView";
import { EventDialog } from "@/components/scheduling/EventDialog";
import { ScheduleFilters } from "@/components/scheduling/ScheduleFilters";
import { 
  SchedulingHeader, 
  SchedulingStats, 
  AgendaView, 
  AnalyticsView 
} from "@/components/scheduling/modules";

// Calendar event interface
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

export default function Scheduling() {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'agenda' | 'analytics'>('calendar');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Mathematics Class',
      type: 'class',
      startTime: '09:00',
      endTime: '10:00',
      date: new Date(),
      room: 'Room 101',
      participants: ['John Doe', 'Jane Smith'],
      description: 'Advanced calculus lesson'
    },
    {
      id: '2',
      title: 'Staff Meeting',
      type: 'meeting',
      startTime: '14:00',
      endTime: '15:00',
      date: new Date(),
      room: 'Conference Room',
      participants: ['All Staff'],
      description: 'Monthly planning meeting'
    }
  ]);
  const [initialDate, setInitialDate] = useState<Date | undefined>();
  const [initialTime, setInitialTime] = useState<string | undefined>();

  // Available options for filters
  const availableRooms = ['Room 101', 'Room 102', 'Conference Room', 'Library', 'Lab 1', 'Lab 2'];
  const availableParticipants = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];

  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEventDialogOpen(true);
  };

  const handleAddEvent = (date: Date, hour: number) => {
    setInitialDate(date);
    setInitialTime(`${hour.toString().padStart(2, '0')}:00`);
    setSelectedEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleSaveEvent = (eventData: CalendarEvent) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prev => prev.map(e => e.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : e));
      toast({
        title: "Event Updated",
        description: "Event has been successfully updated.",
      });
    } else {
      // Create new event
      const newEvent = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents(prev => [...prev, newEvent]);
      toast({
        title: "Event Created",
        description: "New event has been successfully created.",
      });
    }
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
    setInitialDate(undefined);
    setInitialTime(undefined);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    toast({
      title: "Event Deleted",
      description: "Event has been successfully deleted.",
      variant: "destructive"
    });
    setIsEventDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleFilterChange = (filters: any) => {
    // Apply filters to events (implement filtering logic as needed)
    console.log('Filters applied:', filters);
  };

  // Navigation handlers
  const handleWeekChange = (date: Date) => {
    setCurrentWeek(date);
  };

  // Statistics
  const currentStats = {
    totalEvents: events.length,
    upcomingEvents: events.filter(e => e.date >= new Date()).length,
    todayEvents: events.filter(e => e.date.toDateString() === new Date().toDateString()).length,
    thisWeekEvents: events.length
  };

  const eventTypeCounts = {
    class: events.filter(e => e.type === 'class').length,
    meeting: events.filter(e => e.type === 'meeting').length,
    event: events.filter(e => e.type === 'event').length,
    exam: events.filter(e => e.type === 'exam').length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <SchedulingHeader onCreateEvent={() => setIsEventDialogOpen(true)} />

      {/* Quick Stats */}
      <SchedulingStats stats={currentStats} />

      {/* Filters */}
      <ScheduleFilters
        onFilterChange={handleFilterChange}
        availableRooms={availableRooms}
        availableParticipants={availableParticipants}
      />

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Agenda View
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-4">
          <CalendarView
            events={events}
            currentWeek={currentWeek}
            onWeekChange={handleWeekChange}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
          />
        </TabsContent>

        {/* Agenda View */}
        <TabsContent value="agenda" className="space-y-4">
          <AgendaView events={events} onEventClick={handleEventClick} />
        </TabsContent>

        {/* Analytics View */}
        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsView eventTypeCounts={eventTypeCounts} />
        </TabsContent>
      </Tabs>

      {/* Event Dialog */}
      <EventDialog
        isOpen={isEventDialogOpen}
        onClose={() => setIsEventDialogOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
        initialDate={initialDate}
        initialTime={initialTime}
      />
    </div>
  );
}