import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus,
  MapPin,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function Scheduling() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: schedules, isLoading: schedulesLoading } = useQuery({
    queryKey: ['/api/schedules'],
    retry: false,
  });

  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ['/api/classes'],
    retry: false,
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ['/api/subjects'],
    retry: false,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData: any) => {
      await apiRequest("POST", "/api/schedules", scheduleData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules'] });
      toast({
        title: "Success",
        description: "Event scheduled successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to schedule event",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const todaySchedules = schedules?.filter((schedule: any) => {
    const scheduleDate = new Date(schedule.startTime);
    const today = new Date();
    return scheduleDate.toDateString() === today.toDateString();
  }) || [];

  const upcomingSchedules = schedules?.filter((schedule: any) => {
    const scheduleDate = new Date(schedule.startTime);
    const today = new Date();
    return scheduleDate > today;
  }).slice(0, 5) || [];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'exam':
        return 'bg-red-50 text-red-600 border-red-200';
      case 'event':
        return 'bg-green-50 text-green-600 border-green-200';
      case 'maintenance':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-600';
      case 'completed':
        return 'bg-green-50 text-green-600';
      case 'cancelled':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scheduling & Events</h1>
          <p className="text-gray-600 mt-1">
            Unified calendar for lessons, exams, and notifications
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary-600 hover:bg-primary-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Schedule New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              createScheduleMutation.mutate({
                title: formData.get('title'),
                description: formData.get('description'),
                type: formData.get('type'),
                startTime: formData.get('startTime'),
                endTime: formData.get('endTime'),
                location: formData.get('location'),
                classId: formData.get('classId') ? parseInt(formData.get('classId') as string) : null,
                subjectId: formData.get('subjectId') ? parseInt(formData.get('subjectId') as string) : null,
                isRecurring: formData.get('isRecurring') === 'on',
                recurrencePattern: formData.get('recurrencePattern'),
              });
            }} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select name="type">
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" name="startTime" type="datetime-local" required />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" name="endTime" type="datetime-local" required />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Room 101, Online, etc." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classId">Class (Optional)</Label>
                  <Select name="classId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes?.map((classItem: any) => (
                        <SelectItem key={classItem.id} value={classItem.id.toString()}>
                          {classItem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subjectId">Subject (Optional)</Label>
                  <Select name="subjectId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject: any) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="isRecurring" name="isRecurring" />
                <Label htmlFor="isRecurring">Recurring Event</Label>
              </div>
              <div>
                <Label htmlFor="recurrencePattern">Recurrence Pattern</Label>
                <Select name="recurrencePattern">
                  <SelectTrigger>
                    <SelectValue placeholder="Select pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={createScheduleMutation.isPending}>
                {createScheduleMutation.isPending ? "Scheduling..." : "Schedule Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Events</p>
                <p className="text-2xl font-bold text-gray-900">{todaySchedules.length}</p>
              </div>
              <div className="bg-primary-50 p-3 rounded-lg">
                <CalendarIcon className="text-primary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">Scheduled</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Classes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules?.filter((s: any) => s.type === 'class').length || 0}
                </p>
              </div>
              <div className="bg-secondary-50 p-3 rounded-lg">
                <BookOpen className="text-secondary-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500 font-medium">This week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules?.filter((s: any) => s.type === 'exam' && new Date(s.startTime) > new Date()).length || 0}
                </p>
              </div>
              <div className="bg-accent-50 p-3 rounded-lg">
                <AlertCircle className="text-accent-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-yellow-600 font-medium">Next 30 days</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {schedules?.filter((s: any) => s.status === 'completed').length || 0}
                </p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <CheckCircle className="text-yellow-600 h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-accent-600 font-medium">This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {/* Today's Schedule */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {schedulesLoading ? (
                  <div>Loading today's schedule...</div>
                ) : todaySchedules.length > 0 ? (
                  <div className="space-y-4">
                    {todaySchedules.map((schedule: any) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex flex-col items-center text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(schedule.startTime).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: false 
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {Math.round((new Date(schedule.endTime).getTime() - new Date(schedule.startTime).getTime()) / (1000 * 60))}m
                            </div>
                          </div>
                          <div className="w-px h-12 bg-gray-200"></div>
                          <div>
                            <p className="font-medium text-gray-900">{schedule.title}</p>
                            <p className="text-sm text-gray-500">{schedule.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {schedule.location && (
                                <div className="flex items-center text-xs text-gray-400">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {schedule.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getEventTypeColor(schedule.type)}>
                            {schedule.type}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events today</h3>
                    <p>Schedule your first event to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {schedulesLoading ? (
                  <div>Loading upcoming events...</div>
                ) : upcomingSchedules.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSchedules.map((schedule: any) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(schedule.startTime).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(schedule.startTime).toLocaleDateString('en-US', { 
                                weekday: 'short' 
                              })}
                            </div>
                          </div>
                          <div className="w-px h-12 bg-gray-200"></div>
                          <div>
                            <p className="font-medium text-gray-900">{schedule.title}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(schedule.startTime).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(schedule.endTime).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                            {schedule.location && (
                              <div className="flex items-center text-xs text-gray-400 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {schedule.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getEventTypeColor(schedule.type)}>
                            {schedule.type}
                          </Badge>
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events</h3>
                    <p>All caught up! Schedule new events as needed.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
