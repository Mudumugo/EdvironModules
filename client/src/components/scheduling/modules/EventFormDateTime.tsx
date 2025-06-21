import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calendar } from "lucide-react";

interface EventFormDateTimeProps {
  form: any;
  showRecurringOptions: boolean;
  recurringPatterns: Array<{ value: string; label: string; }>;
  onRecurringChange: (checked: boolean) => void;
  onSetStartTimeToNow: () => void;
  onSetEndTimeToOneHourLater: () => void;
}

export function EventFormDateTime({ 
  form, 
  showRecurringOptions, 
  recurringPatterns, 
  onRecurringChange, 
  onSetStartTimeToNow, 
  onSetEndTimeToOneHourLater 
}: EventFormDateTimeProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Date & Time</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Time *</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={onSetStartTimeToNow}
                >
                  Now
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Time *</FormLabel>
              <div className="flex gap-2">
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={onSetEndTimeToOneHourLater}
                >
                  +1hr
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="allDay"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">All Day Event</FormLabel>
              <div className="text-sm text-muted-foreground">
                This event lasts for the entire day
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
        name="recurring"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Recurring Event</FormLabel>
              <div className="text-sm text-muted-foreground">
                This event repeats on a schedule
              </div>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  onRecurringChange(checked);
                }}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {showRecurringOptions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <FormField
            control={form.control}
            name="recurringPattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Pattern</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pattern" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recurringPatterns.map((pattern) => (
                      <SelectItem key={pattern.value} value={pattern.value}>
                        {pattern.label}
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
            name="recurringUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat Until</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}