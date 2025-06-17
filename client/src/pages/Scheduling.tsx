import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, startOfWeek, addDays, parseISO, isSameDay, addWeeks, subWeeks } from "date-fns";
import { 
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  MapPin,
  Users,
  BookOpen,
  Video,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Bell,
  AlertCircle,
  CheckCircle,
  UserCheck,
  CalendarDays,
  Timer,
  Globe,
  Building
} from "lucide-react";

// Form schemas
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Event type is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  isVirtual: z.boolean().default(false),
  meetingLink: z.string().optional(),
  capacity: z.string().optional(),
  priority: z.string().default("medium"),
  isRecurring: z.boolean().default(false),
  recurrencePattern: z.string().optional(),
  reminder: z.string().default("15"),
  isPublic: z.boolean().default(true),
});

export default function Scheduling() {
  const { toast } = useToast();
  
  // Dialog states
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  
  // View states
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<"week" | "month" | "list">("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");

  // Sample events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Advanced Mathematics Class",
      description: "Calculus and differential equations for senior students",
      type: "class",
      startDate: "2024-01-15",
      startTime: "09:00",
      endDate: "2024-01-15",
      endTime: "10:30",
      location: "Room 205, Math Building",
      isVirtual: false,
      meetingLink: "",
      capacity: "25",
      priority: "high",
      isRecurring: true,
      recurrencePattern: "weekly",
      reminder: "30",
      isPublic: true,
      attendees: 23,
      status: "confirmed",
      instructor: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Physics Lab Session",
      description: "Experimental physics - Wave motion and optics",
      type: "lab",
      startDate: "2024-01-15",
      startTime: "14:00",
      endDate: "2024-01-15",
      endTime: "16:00",
      location: "Physics Lab 3",
      isVirtual: false,
      meetingLink: "",
      capacity: "15",
      priority: "high",
      isRecurring: true,
      recurrencePattern: "weekly",
      reminder: "60",
      isPublic: true,
      attendees: 14,
      status: "confirmed",
      instructor: "Prof. Michael Chen"
    },
    {
      id: 3,
      title: "Virtual Study Group - Chemistry",
      description: "Organic chemistry review session for upcoming exam",
      type: "study-group",
      startDate: "2024-01-16",
      startTime: "19:00",
      endDate: "2024-01-16",
      endTime: "21:00",
      location: "",
      isVirtual: true,
      meetingLink: "https://meet.example.com/chemistry-study",
      capacity: "10",
      priority: "medium",
      isRecurring: false,
      recurrencePattern: "",
      reminder: "15",
      isPublic: false,
      attendees: 8,
      status: "confirmed",
      instructor: "Student Group"
    },
    {
      id: 4,
      title: "Faculty Meeting",
      description: "Monthly department meeting to discuss curriculum updates",
      type: "meeting",
      startDate: "2024-01-17",
      startTime: "10:00",
      endDate: "2024-01-17",
      endTime: "11:30",
      location: "Conference Room A",
      isVirtual: false,
      meetingLink: "",
      capacity: "20",
      priority: "high",
      isRecurring: true,
      recurrencePattern: "monthly",
      reminder: "60",
      isPublic: false,
      attendees: 18,
      status: "confirmed",
      instructor: "Department Head"
    },
    {
      id: 5,
      title: "Student Project Presentations",
      description: "Final project presentations for Computer Science course",
      type: "presentation",
      startDate: "2024-01-18",
      startTime: "13:00",
      endDate: "2024-01-18",
      endTime: "17:00",
      location: "Auditorium B",
      isVirtual: false,
      meetingLink: "",
      capacity: "100",
      priority: "medium",
      isRecurring: false,
      recurrencePattern: "",
      reminder: "30",
      isPublic: true,
      attendees: 85,
      status: "confirmed",
      instructor: "Dr. Lisa Wang"
    },
    {
      id: 6,
      title: "Online Workshop: Digital Learning Tools",
      description: "Training session on new educational technology platforms",
      type: "workshop",
      startDate: "2024-01-19",
      startTime: "15:00",
      endDate: "2024-01-19",
      endTime: "16:30",
      location: "",
      isVirtual: true,
      meetingLink: "https://meet.example.com/workshop-digital-tools",
      capacity: "50",
      priority: "medium",
      isRecurring: false,
      recurrencePattern: "",
      reminder: "45",
      isPublic: true,
      attendees: 42,
      status: "confirmed",
      instructor: "Tech Support Team"
    }
  ]);

  // Form
  const eventForm = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "class",
      startDate: format(new Date(), "yyyy-MM-dd"),
      startTime: "09:00",
      endDate: format(new Date(), "yyyy-MM-dd"),
      endTime: "10:00",
      location: "",
      isVirtual: false,
      meetingLink: "",
      capacity: "",
      priority: "medium",
      isRecurring: false,
      recurrencePattern: "",
      reminder: "15",
      isPublic: true,
    },
  });

  // Handle form submission
  const handleCreateEvent = (data: z.infer<typeof eventSchema>) => {
    const newEvent = {
      ...data,
      id: events.length + 1,
      description: data.description || "",
      location: data.location || "",
      meetingLink: data.meetingLink || "",
      capacity: data.capacity || "0",
      recurrencePattern: data.recurrencePattern || "",
      attendees: 0,
      status: "confirmed" as const,
      instructor: "Current User"
    };
    setEvents([...events, newEvent]);
    setIsEventDialogOpen(false);
    eventForm.reset();
    toast({
      title: "Success",
      description: "Event created successfully",
    });
  };

  // Filter events
  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm === "" || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || event.type === selectedType;
    const matchesPriority = selectedPriority === "all" || event.priority === selectedPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  // Helper functions
  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "class": return <BookOpen className="h-4 w-4" />;
      case "lab": return <Globe className="h-4 w-4" />;
      case "study-group": return <Users className="h-4 w-4" />;
      case "meeting": return <Building className="h-4 w-4" />;
      case "presentation": return <Eye className="h-4 w-4" />;
      case "workshop": return <Video className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "class": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "lab": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "study-group": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "meeting": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "presentation": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "workshop": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return <AlertCircle className="h-3 w-3" />;
      case "medium": return <Clock className="h-3 w-3" />;
      case "low": return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  // Week view helpers
  const getWeekDays = () => {
    const start = startOfWeek(currentWeek);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(event => 
      isSameDay(parseISO(event.startDate), day)
    );
  };

  // Statistics
  const totalEvents = events.length;
  const upcomingEvents = events.filter(event => 
    new Date(event.startDate + 'T' + event.startTime) > new Date()
  ).length;
  const virtualEvents = events.filter(event => event.isVirtual).length;
  const recurringEvents = events.filter(event => event.isRecurring).length;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDays className="h-8 w-8" />
            Scheduling & Events
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage classes, meetings, workshops, and educational events
          </p>
        </div>
        <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <Form {...eventForm}>
              <form onSubmit={eventForm.handleSubmit(handleCreateEvent)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={eventForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter event title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="class">Class</SelectItem>
                            <SelectItem value="lab">Lab Session</SelectItem>
                            <SelectItem value="study-group">Study Group</SelectItem>
                            <SelectItem value="meeting">Meeting</SelectItem>
                            <SelectItem value="presentation">Presentation</SelectItem>
                            <SelectItem value="workshop">Workshop</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={eventForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe the event..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={eventForm.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={eventForm.control}
                  name="isVirtual"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel>Virtual Event</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={eventForm.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Room, building, or address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="meetingLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Link (if virtual)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://meet.example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={eventForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Maximum attendees" type="number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="reminder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder (minutes before)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select reminder" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="15">15 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">1 hour</SelectItem>
                            <SelectItem value="1440">1 day</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <FormField
                    control={eventForm.control}
                    name="isRecurring"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Recurring Event</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={eventForm.control}
                    name="isPublic"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Public Event</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Create Event
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Total Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">All scheduled events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Upcoming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Future events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Video className="h-4 w-4" />
              Virtual Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{virtualEvents}</div>
            <p className="text-xs text-muted-foreground">Online sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Recurring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recurringEvents}</div>
            <p className="text-xs text-muted-foreground">Repeating events</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Events</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="type">Event Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="class">Classes</SelectItem>
                  <SelectItem value="lab">Lab Sessions</SelectItem>
                  <SelectItem value="study-group">Study Groups</SelectItem>
                  <SelectItem value="meeting">Meetings</SelectItem>
                  <SelectItem value="presentation">Presentations</SelectItem>
                  <SelectItem value="workshop">Workshops</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="priority">Priority</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                onClick={() => setViewMode("week")}
                size="sm"
              >
                Week View
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                onClick={() => setViewMode("month")}
                size="sm"
              >
                Month View
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                List View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-6">
        <TabsContent value="week" className="space-y-6">
          {/* Week Navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Week of {format(startOfWeek(currentWeek), "MMMM d, yyyy")}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
                    Today
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-4">
                {getWeekDays().map((day) => (
                  <div key={day.toISOString()} className="space-y-2">
                    <div className="text-center">
                      <div className="text-sm font-medium">{format(day, "EEE")}</div>
                      <div className={`text-2xl font-bold ${
                        isSameDay(day, new Date()) ? "text-primary" : ""
                      }`}>
                        {format(day, "d")}
                      </div>
                    </div>
                    <div className="space-y-1">
                      {getEventsForDay(day).map((event) => (
                        <Card key={event.id} className="p-2 cursor-pointer hover:shadow-md transition-shadow">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              {getEventTypeIcon(event.type)}
                              <div className="text-xs font-medium truncate">{event.title}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {event.startTime} - {event.endTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                                {event.type}
                              </Badge>
                              <div className={`flex items-center gap-1 ${getPriorityColor(event.priority)}`}>
                                {getPriorityIcon(event.priority)}
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    {searchTerm ? "No events match your search criteria" : "Start scheduling your educational events"}
                  </p>
                  <Button onClick={() => setIsEventDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Event
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getEventTypeIcon(event.type)}
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 ${getPriorityColor(event.priority)}`}>
                          {getPriorityIcon(event.priority)}
                          <span className="text-xs capitalize">{event.priority}</span>
                        </div>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>{format(parseISO(event.startDate), "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{event.startTime} - {event.endTime}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {event.isVirtual ? (
                          <div className="flex items-center gap-2 text-sm">
                            <Video className="h-4 w-4" />
                            <span>Virtual Event</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location || "Location TBD"}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="h-4 w-4" />
                          <span>{event.attendees}/{event.capacity} attendees</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{event.instructor}</span>
                        </div>
                        {event.isRecurring && (
                          <div className="flex items-center gap-2 text-sm">
                            <Bell className="h-4 w-4" />
                            <span>Recurring {event.recurrencePattern}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <Badge variant={event.status === "confirmed" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                        {!event.isPublic && (
                          <Badge variant="outline">Private</Badge>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}