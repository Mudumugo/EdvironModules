import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { addWeeks, subWeeks } from "date-fns";
import { 
  Calendar,
  Plus,
  BookOpen,
  Bell,
  CheckCircle,
  UserCheck,
  CalendarDays,
  Timer,
  Globe,
  Building
} from "lucide-react";

// Import modular components
import { CalendarView } from "@/components/scheduling/CalendarView";
import { EventDialog } from "@/components/scheduling/EventDialog";
import { ScheduleFilters } from "@/components/scheduling/ScheduleFilters";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Scheduling System</h1>
          <p className="text-gray-600 mt-1">Manage events, classes, and appointments</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsEventDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{currentStats.totalEvents}</p>
              </div>
              <CalendarDays className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Events</p>
                <p className="text-2xl font-bold text-green-600">{currentStats.todayEvents}</p>
              </div>
              <Timer className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">{currentStats.thisWeekEvents}</p>
              </div>
              <Timer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-orange-600">{currentStats.upcomingEvents}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                  events
                    .sort((a, b) => new Date(a.date.getTime() + a.startTime.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0) * 60000).getTime() - 
                                  new Date(b.date.getTime() + b.startTime.split(':').reduce((acc, time) => acc * 60 + parseInt(time), 0) * 60000).getTime())
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm cursor-pointer"
                        onClick={() => handleEventClick(event)}
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
        </TabsContent>

        {/* Analytics View */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Event Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(eventTypeCounts).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          type === 'class' ? 'bg-blue-500' :
                          type === 'meeting' ? 'bg-green-500' :
                          type === 'event' ? 'bg-purple-500' :
                          'bg-red-500'
                        }`} />
                        <span className="capitalize">{type}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Classes</span>
                    <span className="text-sm text-gray-600">{eventTypeCounts.class}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Meetings</span>
                    <span className="text-sm text-gray-600">{eventTypeCounts.meeting}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Events</span>
                    <span className="text-sm text-gray-600">{eventTypeCounts.event}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Exams</span>
                    <span className="text-sm text-gray-600">{eventTypeCounts.exam}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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