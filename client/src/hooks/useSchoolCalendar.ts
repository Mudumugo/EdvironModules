import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { addDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday } from "date-fns";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'academic' | 'holiday' | 'exam' | 'event' | 'meeting';
  isAllDay: boolean;
  location?: string;
  attendees?: string[];
  createdBy: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'agenda';
  currentDate: Date;
}

export function useSchoolCalendar() {
  const [view, setView] = useState<CalendarView>({
    type: 'month',
    currentDate: new Date()
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate date range based on view
  const dateRange = useMemo(() => {
    const { currentDate, type } = view;
    
    switch (type) {
      case 'month':
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        };
      case 'week':
        const startOfWeek = addDays(currentDate, -currentDate.getDay());
        return {
          start: startOfWeek,
          end: addDays(startOfWeek, 6)
        };
      case 'day':
        return {
          start: currentDate,
          end: currentDate
        };
      default:
        return {
          start: startOfMonth(currentDate),
          end: addDays(endOfMonth(currentDate), 30)
        };
    }
  }, [view]);

  // Fetch calendar events
  const { data: events = [], isLoading } = useQuery<CalendarEvent[]>({
    queryKey: ['/api/calendar/events', dateRange.start, dateRange.end, filterType],
    queryFn: () => apiRequest('GET', `/api/calendar/events?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}${filterType !== 'all' ? `&type=${filterType}` : ''}`),
    select: (data) => Array.isArray(data) ? data.map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate)
    })) : [],
  });

  // Get calendar days for month view
  const calendarDays = useMemo(() => {
    if (view.type !== 'month') return [];
    
    const monthStart = startOfMonth(view.currentDate);
    const monthEnd = endOfMonth(view.currentDate);
    const calendarStart = addDays(monthStart, -monthStart.getDay());
    const calendarEnd = addDays(monthEnd, 6 - monthEnd.getDay());
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [view]);

  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.startDate, date) || 
      (event.startDate <= date && event.endDate >= date)
    );
  };

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (data: Omit<CalendarEvent, 'id'>) => {
      return apiRequest('POST', '/api/calendar/events', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setShowCreateDialog(false);
      toast({
        title: "Event created",
        description: "Calendar event has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CalendarEvent> }) => {
      return apiRequest('PATCH', `/api/calendar/events/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setSelectedEvent(null);
      toast({
        title: "Event updated",
        description: "Calendar event has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/calendar/events/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      setSelectedEvent(null);
      setShowEventDetails(false);
      toast({
        title: "Event deleted",
        description: "Calendar event has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    },
  });

  // Navigation functions
  const navigateToToday = () => {
    setView(prev => ({ ...prev, currentDate: new Date() }));
  };

  const navigateNext = () => {
    setView(prev => {
      const { currentDate, type } = prev;
      let newDate: Date;
      
      switch (type) {
        case 'month':
          newDate = addDays(currentDate, 30);
          break;
        case 'week':
          newDate = addDays(currentDate, 7);
          break;
        case 'day':
          newDate = addDays(currentDate, 1);
          break;
        default:
          newDate = addDays(currentDate, 30);
      }
      
      return { ...prev, currentDate: newDate };
    });
  };

  const navigatePrevious = () => {
    setView(prev => {
      const { currentDate, type } = prev;
      let newDate: Date;
      
      switch (type) {
        case 'month':
          newDate = addDays(currentDate, -30);
          break;
        case 'week':
          newDate = addDays(currentDate, -7);
          break;
        case 'day':
          newDate = addDays(currentDate, -1);
          break;
        default:
          newDate = addDays(currentDate, -30);
      }
      
      return { ...prev, currentDate: newDate };
    });
  };

  const changeView = (newViewType: CalendarView['type']) => {
    setView(prev => ({ ...prev, type: newViewType }));
  };

  return {
    // State
    view,
    selectedEvent,
    showCreateDialog,
    showEventDetails,
    filterType,
    
    // Data
    events,
    calendarDays,
    isLoading,
    
    // Computed
    currentMonthName: format(view.currentDate, 'MMMM yyyy'),
    
    // Actions
    setSelectedEvent,
    setShowCreateDialog,
    setShowEventDetails,
    setFilterType,
    getEventsForDay,
    navigateToToday,
    navigateNext,
    navigatePrevious,
    changeView,
    
    // Mutations
    createEvent: createEventMutation.mutate,
    updateEvent: updateEventMutation.mutate,
    deleteEvent: deleteEventMutation.mutate,
    
    // Loading states
    isCreating: createEventMutation.isPending,
    isUpdating: updateEventMutation.isPending,
    isDeleting: deleteEventMutation.isPending,
  };
}