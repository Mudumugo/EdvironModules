import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Users, Mail } from "lucide-react";

interface EventFormNotificationsProps {
  form: any;
  reminderOptions: Array<{ value: string; label: string; }>;
}

export function EventFormNotifications({ form, reminderOptions }: EventFormNotificationsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Notifications & Attendees</h3>
      </div>

      <FormField
        control={form.control}
        name="reminder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reminder</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select reminder time" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {reminderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="attendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter attendee emails, separated by commas"
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <div className="text-sm text-muted-foreground">
              Separate multiple email addresses with commas
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sendInvitations"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Send Invitations
              </FormLabel>
              <div className="text-sm text-muted-foreground">
                Automatically send calendar invitations to attendees
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isPrivate"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Private Event</FormLabel>
              <div className="text-sm text-muted-foreground">
                Only you and invited attendees can see this event
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maxAttendees"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum Attendees</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter maximum number of attendees"
                min="1"
                {...field}
              />
            </FormControl>
            <div className="text-sm text-muted-foreground">
              Leave empty for unlimited attendees
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Internal Notes</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Add any internal notes about this event..."
                className="min-h-[80px]"
                {...field}
              />
            </FormControl>
            <div className="text-sm text-muted-foreground">
              These notes are only visible to event organizers
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}