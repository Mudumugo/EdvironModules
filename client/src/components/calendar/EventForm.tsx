import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EVENT_TYPES, PRIORITY_LEVELS } from "./types";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startDateTime: z.string().min(1, "Start date and time is required"),
  endDateTime: z.string().min(1, "End date and time is required"),
  isAllDay: z.boolean().default(false),
  location: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
  priority: z.string().min(1, "Priority is required"),
  requiresRSVP: z.boolean().default(false),
  maxAttendees: z.number().optional(),
  tags: z.string().optional(),
  visibility: z.enum(['public', 'private', 'confidential']).default('public')
}).refine(data => {
  const start = new Date(data.startDateTime);
  const end = new Date(data.endDateTime);
  return start < end;
}, {
  message: "End time must be after start time",
  path: ["endDateTime"]
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventFormData) => void;
  initialData?: Partial<EventFormData>;
  initialDate?: Date;
  initialTime?: string;
  isLoading?: boolean;
  title?: string;
}

export function EventForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  initialDate,
  initialTime,
  isLoading, 
  title = "Create Event" 
}: EventFormProps) {
  const getInitialDateTime = () => {
    if (initialDate) {
      const date = new Date(initialDate);
      if (initialTime) {
        const [hours, minutes] = initialTime.split(':');
        date.setHours(parseInt(hours), parseInt(minutes));
      } else {
        date.setHours(9, 0); // Default to 9 AM
      }
      return date.toISOString().slice(0, 16);
    }
    const now = new Date();
    now.setHours(now.getHours() + 1, 0, 0, 0);
    return now.toISOString().slice(0, 16);
  };

  const getInitialEndDateTime = () => {
    const start = new Date(getInitialDateTime());
    start.setHours(start.getHours() + 1);
    return start.toISOString().slice(0, 16);
  };

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      startDateTime: initialData?.startDateTime || getInitialDateTime(),
      endDateTime: initialData?.endDateTime || getInitialEndDateTime(),
      isAllDay: initialData?.isAllDay || false,
      location: initialData?.location || "",
      eventType: initialData?.eventType || "",
      priority: initialData?.priority || "normal",
      requiresRSVP: initialData?.requiresRSVP || false,
      maxAttendees: initialData?.maxAttendees || undefined,
      tags: initialData?.tags || "",
      visibility: initialData?.visibility || "public"
    }
  });

  const watchIsAllDay = form.watch("isAllDay");

  const handleSubmit = (data: EventFormData) => {
    // Process tags
    const processedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
    };
    onSubmit(processedData);
  };

  const handleAllDayChange = (checked: boolean) => {
    form.setValue("isAllDay", checked);
    if (checked) {
      const startDate = new Date(form.getValues("startDateTime"));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      form.setValue("startDateTime", startDate.toISOString().slice(0, 16));
      form.setValue("endDateTime", endDate.toISOString().slice(0, 16));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* Basic Information */}
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              {...form.register("title")}
              placeholder="Enter event title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Enter event description"
              rows={3}
            />
          </div>

          {/* Event Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select value={form.watch("eventType")} onValueChange={(value) => form.setValue("eventType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.eventType && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.eventType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={form.watch("priority")} onValueChange={(value) => form.setValue("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITY_LEVELS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isAllDay"
                checked={watchIsAllDay}
                onCheckedChange={handleAllDayChange}
              />
              <Label htmlFor="isAllDay">All day event</Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDateTime">
                  {watchIsAllDay ? "Start Date" : "Start Date & Time"}
                </Label>
                <Input
                  id="startDateTime"
                  type={watchIsAllDay ? "date" : "datetime-local"}
                  {...form.register("startDateTime")}
                />
                {form.formState.errors.startDateTime && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.startDateTime.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="endDateTime">
                  {watchIsAllDay ? "End Date" : "End Date & Time"}
                </Label>
                <Input
                  id="endDateTime"
                  type={watchIsAllDay ? "date" : "datetime-local"}
                  {...form.register("endDateTime")}
                />
                {form.formState.errors.endDateTime && (
                  <p className="text-sm text-red-500 mt-1">{form.formState.errors.endDateTime.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...form.register("location")}
              placeholder="Enter event location"
            />
          </div>

          {/* RSVP Settings */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="requiresRSVP"
                checked={form.watch("requiresRSVP")}
                onCheckedChange={(checked) => form.setValue("requiresRSVP", checked as boolean)}
              />
              <Label htmlFor="requiresRSVP">Requires RSVP</Label>
            </div>

            {form.watch("requiresRSVP") && (
              <div>
                <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  {...form.register("maxAttendees", { valueAsNumber: true })}
                  placeholder="Enter maximum number of attendees"
                />
              </div>
            )}
          </div>

          {/* Additional Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={form.watch("visibility")} onValueChange={(value: any) => form.setValue("visibility", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                {...form.register("tags")}
                placeholder="math, important, exam"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EventForm;