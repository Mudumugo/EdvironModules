import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCalendarEventSchema } from "@shared/schema";
import { z } from "zod";
import { Plus } from "lucide-react";

const createEventSchema = insertCalendarEventSchema.extend({
  startDate: z.string(),
  startTime: z.string(),
  endDate: z.string(),
  endTime: z.string(),
});

type CreateEventForm = z.infer<typeof createEventSchema>;

interface CreateEventDialogProps {
  onEventCreated?: () => void;
}

export function CreateEventDialog({ onEventCreated }: CreateEventDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEventForm>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventType: "academic",
      visibility: "public",
      targetAudience: "all",
      priority: "medium",
      status: "active",
      requiresRSVP: false,
      isAllDay: false,
      tags: [],
    },
  });

  const isAllDay = watch("isAllDay");

  const createEventMutation = useMutation({
    mutationFn: async (data: CreateEventForm) => {
      const { startDate, startTime, endDate, endTime, ...eventData } = data;
      
      let startDateTime: string;
      let endDateTime: string;

      if (data.isAllDay) {
        startDateTime = new Date(startDate).toISOString();
        endDateTime = new Date(endDate).toISOString();
      } else {
        startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
        endDateTime = new Date(`${endDate}T${endTime}`).toISOString();
      }

      return apiRequest("POST", "/api/calendar/events", {
        ...eventData,
        startDateTime,
        endDateTime,
      });
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "Event has been successfully created",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/events"] });
      setIsOpen(false);
      reset();
      onEventCreated?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateEventForm) => {
    createEventMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Event title"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select onValueChange={(value) => setValue("eventType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="administrative">Administrative</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Event location"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAllDay"
              onCheckedChange={(checked) => setValue("isAllDay", !!checked)}
            />
            <Label htmlFor="isAllDay">All day event</Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            {!isAllDay && (
              <div>
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  {...register("startTime")}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate")}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
            {!isAllDay && (
              <div>
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  {...register("endTime")}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select onValueChange={(value) => setValue("visibility", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="restricted">Restricted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select onValueChange={(value) => setValue("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Select onValueChange={(value) => setValue("targetAudience", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="parents">Parents</SelectItem>
                  <SelectItem value="administrators">Administrators</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="requiresRSVP"
              onCheckedChange={(checked) => setValue("requiresRSVP", !!checked)}
            />
            <Label htmlFor="requiresRSVP">Requires RSVP</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createEventMutation.isPending}
            >
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}