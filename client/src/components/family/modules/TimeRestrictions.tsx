import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Clock, Calendar } from "lucide-react";
import { TimeRestriction, Device, timeRestrictionSchema, TimeRestrictionFormType, daysOfWeek } from "./FamilyTypes";

interface TimeRestrictionsProps {
  restrictions: TimeRestriction[];
  devices: Device[];
  onAdd: (restriction: TimeRestrictionFormType) => void;
  onUpdate: (id: string, restriction: Partial<TimeRestrictionFormType>) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function TimeRestrictions({ 
  restrictions, 
  devices, 
  onAdd, 
  onUpdate, 
  onDelete, 
  isLoading 
}: TimeRestrictionsProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRestriction, setEditingRestriction] = React.useState<TimeRestriction | null>(null);

  const form = useForm<TimeRestrictionFormType>({
    resolver: zodResolver(timeRestrictionSchema),
    defaultValues: {
      deviceId: "",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (editingRestriction) {
      form.reset({
        deviceId: editingRestriction.deviceId,
        dayOfWeek: editingRestriction.dayOfWeek,
        startTime: editingRestriction.startTime,
        endTime: editingRestriction.endTime,
        isActive: editingRestriction.isActive,
      });
    } else {
      form.reset({
        deviceId: "",
        dayOfWeek: 1,
        startTime: "09:00",
        endTime: "17:00",
        isActive: true,
      });
    }
  }, [editingRestriction, form]);

  const handleSubmit = (data: TimeRestrictionFormType) => {
    if (editingRestriction) {
      onUpdate(editingRestriction.id, data);
    } else {
      onAdd(data);
    }
    setIsDialogOpen(false);
    setEditingRestriction(null);
  };

  const handleEdit = (restriction: TimeRestriction) => {
    setEditingRestriction(restriction);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRestriction(null);
    form.reset();
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find(d => d.id === deviceId)?.name || 'Unknown Device';
  };

  const getDayName = (dayOfWeek: number) => {
    return daysOfWeek.find(d => d.value === dayOfWeek)?.label || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Time Restrictions</h3>
          <p className="text-sm text-muted-foreground">
            Set allowed usage times for devices
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Restriction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRestriction ? 'Edit Time Restriction' : 'Add Time Restriction'}
              </DialogTitle>
              <DialogDescription>
                Set when devices can be used during the day
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a device" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {devices.map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.name}
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
                  name="dayOfWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Day of Week</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Enable this time restriction
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
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRestriction ? 'Update' : 'Add'} Restriction
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {restrictions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Time Restrictions</h3>
            <p className="text-muted-foreground mb-4">
              Set up time restrictions to control when devices can be used.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {restrictions.map((restriction) => (
            <Card key={restriction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{getDayName(restriction.dayOfWeek)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{restriction.startTime} - {restriction.endTime}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getDeviceName(restriction.deviceId)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant={restriction.isActive ? "default" : "secondary"}>
                      {restriction.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(restriction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(restriction.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}