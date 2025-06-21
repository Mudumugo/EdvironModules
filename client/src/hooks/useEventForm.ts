import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Event type is required"),
  startDate: z.string().min(1, "Start date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endDate: z.string().min(1, "End date is required"),
  endTime: z.string().min(1, "End time is required"),
  location: z.string().optional(),
  maxAttendees: z.number().optional(),
  isRecurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
  reminderMinutes: z.number().default(15),
  isPublic: z.boolean().default(false),
  requiresApproval: z.boolean().default(false),
});

export type EventFormData = z.infer<typeof eventSchema>;

export interface Event {
  id: string;
  title: string;
  type: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  location?: string;
  description?: string;
  maxAttendees?: number;
  isRecurring?: boolean;
  recurringPattern?: string;
  reminderMinutes?: number;
  isPublic?: boolean;
  requiresApproval?: boolean;
}

export const EVENT_TYPES = [
  { value: "meeting", label: "Meeting" },
  { value: "class", label: "Class" },
  { value: "exam", label: "Exam" },
  { value: "event", label: "Event" },
  { value: "holiday", label: "Holiday" },
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
];

export const RECURRING_PATTERNS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export const REMINDER_OPTIONS = [
  { value: 0, label: "No reminder" },
  { value: 5, label: "5 minutes before" },
  { value: 15, label: "15 minutes before" },
  { value: 30, label: "30 minutes before" },
  { value: 60, label: "1 hour before" },
  { value: 1440, label: "1 day before" },
];

export function useEventForm(initialEvent?: Event, onSuccess?: () => void) {
  const [showRecurringOptions, setShowRecurringOptions] = useState(initialEvent?.isRecurring || false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialEvent?.title || "",
      description: initialEvent?.description || "",
      type: initialEvent?.type || "",
      startDate: initialEvent?.startDate || "",
      startTime: initialEvent?.startTime || "",
      endDate: initialEvent?.endDate || "",
      endTime: initialEvent?.endTime || "",
      location: initialEvent?.location || "",
      maxAttendees: initialEvent?.maxAttendees || undefined,
      isRecurring: initialEvent?.isRecurring || false,
      recurringPattern: initialEvent?.recurringPattern || "",
      reminderMinutes: initialEvent?.reminderMinutes || 15,
      isPublic: initialEvent?.isPublic || false,
      requiresApproval: initialEvent?.requiresApproval || false,
    },
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const eventData = {
        ...data,
        startDateTime: `${data.startDate}T${data.startTime}`,
        endDateTime: `${data.endDate}T${data.endTime}`,
      };
      return apiRequest('POST', '/api/calendar/events', eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
      onSuccess?.();
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      if (!initialEvent?.id) throw new Error("No event ID provided");
      
      const eventData = {
        ...data,
        startDateTime: `${data.startDate}T${data.startTime}`,
        endDateTime: `${data.endDate}T${data.endTime}`,
      };
      return apiRequest('PUT', `/api/calendar/events/${initialEvent.id}`, eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/calendar/events'] });
      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: EventFormData) => {
    if (initialEvent) {
      updateEventMutation.mutate(data);
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleRecurringChange = (isRecurring: boolean) => {
    setShowRecurringOptions(isRecurring);
    form.setValue("isRecurring", isRecurring);
    if (!isRecurring) {
      form.setValue("recurringPattern", "");
    }
  };

  const setDateTimeFromNow = (minutesFromNow: number = 0) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutesFromNow);
    
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].slice(0, 5);
    
    return { date, time };
  };

  const setStartTimeToNow = () => {
    const { date, time } = setDateTimeFromNow();
    form.setValue("startDate", date);
    form.setValue("startTime", time);
  };

  const setEndTimeToOneHourLater = () => {
    const { date, time } = setDateTimeFromNow(60);
    form.setValue("endDate", date);
    form.setValue("endTime", time);
  };

  const validateDateTime = () => {
    const startDateTime = new Date(`${form.getValues("startDate")}T${form.getValues("startTime")}`);
    const endDateTime = new Date(`${form.getValues("endDate")}T${form.getValues("endTime")}`);
    
    if (endDateTime <= startDateTime) {
      form.setError("endTime", {
        type: "manual",
        message: "End time must be after start time"
      });
      return false;
    }
    
    form.clearErrors("endTime");
    return true;
  };

  return {
    form,
    showRecurringOptions,
    isSubmitting: createEventMutation.isPending || updateEventMutation.isPending,
    isEditing: !!initialEvent,
    
    // Actions
    handleSubmit: form.handleSubmit(handleSubmit),
    handleRecurringChange,
    setStartTimeToNow,
    setEndTimeToOneHourLater,
    validateDateTime,
    
    // Options
    eventTypes: EVENT_TYPES,
    recurringPatterns: RECURRING_PATTERNS,
    reminderOptions: REMINDER_OPTIONS,
  };
}