import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  ChevronLeft,
  ChevronRight,
  Bell,
  BookOpen,
  UserCheck,
  Coffee,
  Home,
  GraduationCap,
  AlertCircle,
  Search,
  Filter,
  Download,
  Printer
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, addMonths, subMonths, isSameMonth, isSameDay, parseISO, isWithinInterval, addDays } from "date-fns";

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
  maxAttendees?: number;
  currentAttendees?: number;
  tags: string[];
  recurrence?: {
    pattern: string;
    interval: number;
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Calendar</h1>
          <p className="text-muted-foreground">
            Manage events, classes, and important school dates
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>
    </div>
  );
}

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

const eventTypes = [
  { id: 'class', label: 'Classes', color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
  { id: 'exam', label: 'Exams', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' },
  { id: 'meeting', label: 'Meetings', color: 'bg-purple-500', textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
  { id: 'assembly', label: 'Assembly', color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
  { id: 'sports', label: 'Sports', color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
  { id: 'cultural', label: 'Cultural Events', color: 'bg-pink-500', textColor: 'text-pink-700', bgColor: 'bg-pink-50' },
  { id: 'holiday', label: 'Holidays', color: 'bg-gray-500', textColor: 'text-gray-700', bgColor: 'bg-gray-50' },
  { id: 'parent_conference', label: 'Parent Conferences', color: 'bg-indigo-500', textColor: 'text-indigo-700', bgColor: 'bg-indigo-50' }
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'agenda'>('month');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch events for current month
  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar/events', format(currentMonth, 'yyyy-MM')],
    queryFn: () => apiRequest('GET', '/api/calendar/events', {
      start: format(startOfMonth(currentMonth), 'yyyy-MM-dd'),
      end: format(endOfMonth(currentMonth), 'yyyy-MM-dd')
    }),
  });

  // Filter and search events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesType = filterType === 'all' || event.eventType === filterType;
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [events, filterType, searchTerm]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    filteredEvents.forEach(event => {
      const date = format(parseISO(event.startDateTime), 'yyyy-MM-dd');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(event);
    });
    return grouped;
  }, [filteredEvents]);

  // Get upcoming events
  const upcomingEvents = useMemo(() => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return filteredEvents
      .filter(event => {
        const eventDate = parseISO(event.startDateTime);
        return isWithinInterval(eventDate, { start: today, end: nextWeek });
      })
      .sort((a, b) => parseISO(a.startDateTime).getTime() - parseISO(b.startDateTime).getTime())
      .slice(0, 5);
  }, [filteredEvents]);

  // Get events for selected date
  const selectedDateEvents = eventsByDate[format(selectedDate, 'yyyy-MM-dd')] || [];

  // Navigation functions
  const goToPreviousMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const goToNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
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

  // Get event type styling
  const getEventTypeStyle = (eventType: string) => {
    return eventTypes.find(type => type.id === eventType) || eventTypes[0];
  };

  // Get event icon
  const getEventIcon = (eventType: string) => {
    const icons = {
      class: BookOpen,
      exam: AlertCircle,
      meeting: UserCheck,
      assembly: Users,
      sports: Users,
      cultural: Users,
      holiday: Home,
      parent_conference: Coffee
    };
    return icons[eventType as keyof typeof icons] || CalendarIcon;
  };

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: (eventData: any) => apiRequest('POST', '/api/calendar/events', eventData),
    onSuccess: () => {
      toast({ title: "Event created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setShowCreateDialog(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error creating event",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-6 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">School Calendar</h1>
            <p className="text-muted-foreground">
              Manage school events, classes, and important dates
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {(user?.role === 'admin' || user?.role === 'school_admin' || user?.role === 'teacher') && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <CreateEventForm onSubmit={(data) => createEventMutation.mutate(data)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold min-w-[200px] text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <Button variant="outline" size="sm" onClick={goToNextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {eventTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              className="w-full"
              components={{
                Day: ({ date }) => {
                  const dateKey = format(date, 'yyyy-MM-dd');
                  const dayEvents = eventsByDate[dateKey] || [];
                  const isSelected = isSameDay(date, selectedDate);
                  const isToday = isSameDay(date, new Date());

                  return (
                    <div 
                      className={`relative min-h-[80px] p-2 cursor-pointer border rounded-md transition-all ${
                        isSelected ? 'bg-primary text-primary-foreground ring-2 ring-primary' :
                        isToday ? 'bg-accent border-primary' : 'hover:bg-muted'
                      }`}
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="text-sm font-medium mb-1">
                        {format(date, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event) => {
                          const style = getEventTypeStyle(event.eventType);
                          return (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded ${style.bgColor} ${style.textColor} truncate cursor-pointer hover:opacity-80`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEventClick(event);
                              }}
                              title={event.title}
                            >
                              {event.title}
                            </div>
                          );
                        })}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground font-medium">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        {/* Event Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Date Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No events scheduled for this date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => {
                    const style = getEventTypeStyle(event.eventType);
                    const Icon = getEventIcon(event.eventType);
                    
                    return (
                      <div
                        key={event.id}
                        className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${style.bgColor}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`h-5 w-5 mt-0.5 ${style.textColor}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold ${style.textColor}`}>{event.title}</h4>
                            {event.description && (
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
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
                              <Badge variant="secondary" className="text-xs">
                                {eventTypes.find(t => t.id === event.eventType)?.label}
                              </Badge>
                              {event.requiresRSVP && (
                                <Badge variant="outline" className="text-xs">
                                  RSVP Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => {
                    const style = getEventTypeStyle(event.eventType);
                    const Icon = getEventIcon(event.eventType);
                    
                    return (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className={`h-4 w-4 mt-1 ${style.textColor}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <div className="text-sm text-muted-foreground mt-1">
                              {format(parseISO(event.startDateTime), 'MMM d, yyyy')}
                              {!event.isAllDay && (
                                <span> at {format(parseISO(event.startDateTime), 'HH:mm')}</span>
                              )}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {eventTypes.find(t => t.id === event.eventType)?.label}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Event Types Legend */}
        <Card>
          <CardHeader>
            <CardTitle>Event Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eventTypes.map(type => {
                const Icon = getEventIcon(type.id);
                return (
                  <div key={type.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${type.color}`} />
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium">{type.label}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Event Details Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <EventDetailsView event={selectedEvent} eventTypes={eventTypes} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Create Event Form Component
function CreateEventForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'class',
    startDateTime: '',
    endDateTime: '',
    isAllDay: false,
    location: '',
    targetAudience: 'all',
    priority: 'normal',
    requiresRSVP: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="eventType">Event Type</Label>
        <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {eventTypes.map(type => (
              <SelectItem key={type.id} value={type.id}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDateTime">Start Date & Time</Label>
          <Input
            id="startDateTime"
            type="datetime-local"
            value={formData.startDateTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startDateTime: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="endDateTime">End Date & Time</Label>
          <Input
            id="endDateTime"
            type="datetime-local"
            value={formData.endDateTime}
            onChange={(e) => setFormData(prev => ({ ...prev, endDateTime: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Create Event
      </Button>
    </form>
  );
}

// Event Details View Component
function EventDetailsView({ event, eventTypes }: { event: CalendarEvent; eventTypes: any[] }) {
  const eventType = eventTypes.find(t => t.id === event.eventType);
  const Icon = eventTypes.find(t => t.id === event.eventType) ? 
    getEventIcon(event.eventType) : CalendarIcon;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${eventType?.bgColor || 'bg-gray-50'}`}>
          <Icon className={`h-6 w-6 ${eventType?.textColor || 'text-gray-700'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <Badge variant="secondary" className="mt-2">
            {eventType?.label || event.eventType}
          </Badge>
        </div>
      </div>

      {event.description && (
        <div>
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-muted-foreground">{event.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium mb-2">Date & Time</h4>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {format(parseISO(event.startDateTime), 'MMM d, yyyy')}
              {event.isAllDay ? ' (All day)' : 
                ` ${format(parseISO(event.startDateTime), 'HH:mm')} - ${format(parseISO(event.endDateTime), 'HH:mm')}`
              }
            </span>
          </div>
        </div>

        {event.location && (
          <div>
            <h4 className="font-medium mb-2">Location</h4>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">Priority: {event.priority}</Badge>
        <Badge variant="outline">Status: {event.status}</Badge>
        {event.requiresRSVP && (
          <Badge variant="secondary">RSVP Required</Badge>
        )}
      </div>
    </div>
  );
}

function getEventIcon(eventType: string) {
  const icons = {
    class: BookOpen,
    exam: AlertCircle,
    meeting: UserCheck,
    assembly: Users,
    sports: Users,
    cultural: Users,
    holiday: Home,
    parent_conference: Coffee
  };
  return icons[eventType as keyof typeof icons] || CalendarIcon;
}