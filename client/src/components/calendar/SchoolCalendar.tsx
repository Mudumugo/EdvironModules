import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, isSameDay, parseISO } from "date-fns";
import { CreateEventDialog } from "@/components/calendar/CreateEventDialog";
import { EventDetailsDialog } from "@/components/calendar/EventDetailsDialog";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  location?: string;
  organizerId: string;
  visibility: string;
  targetAudience: string;
  priority: string;
  status: string;
  requiresRSVP: boolean;
  tags: string[];
}

interface EventsByDate {
  [date: string]: CalendarEvent[];
}

export default function SchoolCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const user = null; // Disabled auth polling to prevent twitching
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch events for current month
  const { data: events = [], isLoading, refetch } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar/events', format(currentMonth, 'yyyy-MM')],
    enabled: !!user,
    retry: false,
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/calendar/events', {
        start: format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
        end: format(endOfMonth(currentMonth), 'yyyy-MM-dd'),
        view: viewMode
      });
      return response.json();
    },
  });

  // Fetch upcoming events for quick view
  const { data: upcomingEvents = [] } = useQuery({
    queryKey: ['/api/calendar/upcoming'],
    enabled: !!user,
    retry: false,
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/calendar/upcoming', { limit: 5 });
      return response.json();
    },
  });

  // Group events by date
  const eventsByDate: EventsByDate = events.reduce((acc: EventsByDate, event: CalendarEvent) => {
    const date = format(parseISO(event.startDateTime), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  // Filter events based on selected filters
  const filteredEvents = events.filter((event: CalendarEvent) => {
    if (filterType !== 'all' && event.eventType !== filterType) return false;
    if (filterPriority !== 'all' && event.priority !== filterPriority) return false;
    return true;
  });

  // Get events for selected date
  const selectedDateEvents = eventsByDate[format(selectedDate, 'yyyy-MM-dd')] || [];

  // Navigation functions
  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  // Event handlers
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      if (!isSameMonth(date, currentMonth)) {
        setCurrentMonth(date);
      }
    }
  };

  // RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: ({ eventId, status, response }: { eventId: string; status: string; response?: string }) =>
      apiRequest('POST', `/api/calendar/events/${eventId}/rsvp`, { rsvpStatus: status, response }),
    onSuccess: () => {
      toast({
        title: "RSVP Updated",
        description: "Your response has been recorded",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      refetch();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update RSVP",
        variant: "destructive",
      });
    }
  });

  // RSVP handler
  const handleRSVP = (eventId: string, status: string, response?: string) => {
    rsvpMutation.mutate({ eventId, status, response });
  };

  // Get event type color
  const getEventTypeColor = (eventType: string) => {
    const colors = {
      meeting: 'bg-blue-500',
      holiday: 'bg-green-500',
      exam: 'bg-red-500',
      assembly: 'bg-purple-500',
      parent_conference: 'bg-orange-500',
      sports: 'bg-yellow-500',
      cultural: 'bg-pink-500',
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-500';
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'normal': return 'default';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  // Custom day cell renderer
  const renderDayCell = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const dayEvents = eventsByDate[dateKey] || [];
    const isSelected = isSameDay(date, selectedDate);
    const isToday = isSameDay(date, new Date());

    return (
      <div 
        className={`relative min-h-[60px] p-1 cursor-pointer border rounded-sm transition-colors ${
          isSelected ? 'bg-primary text-primary-foreground' :
          isToday ? 'bg-accent' : 'hover:bg-muted'
        }`}
        onClick={() => handleDateSelect(date)}
      >
        <div className="text-sm font-medium mb-1">
          {format(date, 'd')}
        </div>
        <div className="space-y-0.5">
          {dayEvents.slice(0, 2).map((event, index) => (
            <div
              key={event.id}
              className={`text-xs p-1 rounded text-white truncate cursor-pointer ${getEventTypeColor(event.eventType)}`}
              onClick={(e) => {
                e.stopPropagation();
                handleEventClick(event);
              }}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 2 && (
            <div className="text-xs text-muted-foreground">
              +{dayEvents.length - 2} more
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">School Calendar</h1>
          <p className="text-muted-foreground">
            View and manage school events, meetings, and activities
          </p>
        </div>
        
        <div className="flex gap-2">
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          )}
        </div>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <Button variant="outline" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="holiday">Holidays</SelectItem>
                  <SelectItem value="exam">Exams</SelectItem>
                  <SelectItem value="assembly">Assembly</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}
          </div>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            month={currentMonth}
            className="w-full"
            components={{
              Day: ({ date }) => renderDayCell(date),
            }}
          />
        </CardContent>
      </Card>

      {/* Selected Date Events & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Date Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(selectedDate, 'MMMM d, yyyy')}
            </CardTitle>
            <CardDescription>
              {selectedDateEvents.length} event(s) scheduled
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No events scheduled for this date
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant={getPriorityVariant(event.priority)}>
                        {event.priority}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {event.isAllDay ? 'All day' : 
                          `${format(parseISO(event.startDateTime), 'HH:mm')} - ${format(parseISO(event.endDateTime), 'HH:mm')}`
                        }
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{event.eventType}</Badge>
                      {event.requiresRSVP && (
                        <Badge variant="secondary">RSVP Required</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Upcoming Events
            </CardTitle>
            <CardDescription>
              Next {upcomingEvents.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No upcoming events
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event: CalendarEvent) => (
                  <div
                    key={event.id}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant={getPriorityVariant(event.priority)}>
                        {event.priority}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-2">
                      {format(parseISO(event.startDateTime), 'MMM d, yyyy')}
                      {!event.isAllDay && (
                        <span> at {format(parseISO(event.startDateTime), 'HH:mm')}</span>
                      )}
                    </div>
                    
                    <Badge variant="outline">{event.eventType}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <CreateEventDialog 
        onEventCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
          queryClient.invalidateQueries({ queryKey: ['/api/calendar/upcoming'] });
        }}
      />

      <EventDetailsDialog
        event={selectedEvent}
        isOpen={showEventDetails}
        onOpenChange={setShowEventDetails}
        onEdit={(event) => {
          setSelectedEvent(event);
          setShowCreateDialog(true);
        }}
        onRSVP={handleRSVP}
      />
    </div>
  );
}