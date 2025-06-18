import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, X, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated: () => void;
}

interface EventFormData {
  title: string;
  description: string;
  eventType: string;
  startDateTime: Date;
  endDateTime: Date;
  isAllDay: boolean;
  location: string;
  targetAudience: string;
  priority: string;
  visibility: string;
  requiresRSVP: boolean;
  maxAttendees?: number;
  tags: string[];
  isRecurring: boolean;
  recurrencePattern?: {
    type: string;
    interval: number;
    endDate?: string;
    daysOfWeek?: number[];
  };
  roleTargets: Array<{
    targetType: string;
    targetValue: string;
    isRequired: boolean;
  }>;
}

const eventTypes = [
  { value: 'meeting', label: 'Meeting' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'exam', label: 'Exam' },
  { value: 'assembly', label: 'Assembly' },
  { value: 'parent_conference', label: 'Parent Conference' },
  { value: 'sports', label: 'Sports Event' },
  { value: 'cultural', label: 'Cultural Event' },
];

const targetAudiences = [
  { value: 'all', label: 'Entire School' },
  { value: 'staff', label: 'Staff Only' },
  { value: 'students', label: 'Students Only' },
  { value: 'parents', label: 'Parents Only' },
  { value: 'specific_roles', label: 'Specific Roles' },
];

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const visibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'restricted', label: 'Restricted' },
  { value: 'private', label: 'Private' },
];

const roleOptions = [
  { value: 'teacher', label: 'Teachers' },
  { value: 'student', label: 'Students' },
  { value: 'parent', label: 'Parents' },
  { value: 'admin', label: 'Administrators' },
  { value: 'staff', label: 'Staff' },
];

const gradeOptions = [
  { value: 'grade_1', label: 'Grade 1' },
  { value: 'grade_2', label: 'Grade 2' },
  { value: 'grade_3', label: 'Grade 3' },
  { value: 'grade_4', label: 'Grade 4' },
  { value: 'grade_5', label: 'Grade 5' },
  { value: 'grade_6', label: 'Grade 6' },
  { value: 'grade_7', label: 'Grade 7' },
  { value: 'grade_8', label: 'Grade 8' },
  { value: 'grade_9', label: 'Grade 9' },
  { value: 'grade_10', label: 'Grade 10' },
  { value: 'grade_11', label: 'Grade 11' },
  { value: 'grade_12', label: 'Grade 12' },
];

export function CreateEventDialog({ open, onOpenChange, onEventCreated }: CreateEventDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    eventType: 'meeting',
    startDateTime: new Date(),
    endDateTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
    isAllDay: false,
    location: '',
    targetAudience: 'all',
    priority: 'normal',
    visibility: 'public',
    requiresRSVP: false,
    tags: [],
    isRecurring: false,
    roleTargets: [],
  });

  const [newTag, setNewTag] = useState('');
  const [showRoleTargets, setShowRoleTargets] = useState(false);

  const createEventMutation = useMutation({
    mutationFn: (eventData: any) => apiRequest('POST', '/api/calendar/events', eventData),
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "The event has been successfully created",
      });
      onEventCreated();
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventType: 'meeting',
      startDateTime: new Date(),
      endDateTime: new Date(Date.now() + 60 * 60 * 1000),
      isAllDay: false,
      location: '',
      targetAudience: 'all',
      priority: 'normal',
      visibility: 'public',
      requiresRSVP: false,
      tags: [],
      isRecurring: false,
      roleTargets: [],
    });
    setNewTag('');
    setShowRoleTargets(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Event title is required",
        variant: "destructive",
      });
      return;
    }

    createEventMutation.mutate({
      ...formData,
      roleTargets: showRoleTargets ? formData.roleTargets : [],
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addRoleTarget = (targetType: string, targetValue: string) => {
    const newTarget = {
      targetType,
      targetValue,
      isRequired: false,
    };

    setFormData(prev => ({
      ...prev,
      roleTargets: [...prev.roleTargets, newTarget]
    }));
  };

  const removeRoleTarget = (index: number) => {
    setFormData(prev => ({
      ...prev,
      roleTargets: prev.roleTargets.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter event description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type</Label>
                  <Select value={formData.eventType} onValueChange={(value) => setFormData(prev => ({ ...prev, eventType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Event location"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Date & Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isAllDay}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAllDay: checked }))}
                  />
                  <Label>All Day Event</Label>
                </div>

                <div className="space-y-2">
                  <Label>Start Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.startDateTime, 'PPP')}
                        {!formData.isAllDay && <Clock className="ml-2 h-4 w-4" />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDateTime}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, startDateTime: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {!formData.isAllDay && (
                    <Input
                      type="time"
                      value={format(formData.startDateTime, 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(formData.startDateTime);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setFormData(prev => ({ ...prev, startDateTime: newDate }));
                      }}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>End Date & Time</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.endDateTime, 'PPP')}
                        {!formData.isAllDay && <Clock className="ml-2 h-4 w-4" />}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDateTime}
                        onSelect={(date) => date && setFormData(prev => ({ ...prev, endDateTime: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {!formData.isAllDay && (
                    <Input
                      type="time"
                      value={format(formData.endDateTime, 'HH:mm')}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':');
                        const newDate = new Date(formData.endDateTime);
                        newDate.setHours(parseInt(hours), parseInt(minutes));
                        setFormData(prev => ({ ...prev, endDateTime: newDate }));
                      }}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select 
                    value={formData.targetAudience} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, targetAudience: value }));
                      setShowRoleTargets(value === 'specific_roles');
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetAudiences.map(audience => (
                        <SelectItem key={audience.value} value={audience.value}>
                          {audience.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {visibilityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.requiresRSVP}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requiresRSVP: checked }))}
                  />
                  <Label>Requires RSVP</Label>
                </div>

                {formData.requiresRSVP && (
                  <div className="space-y-2">
                    <Label htmlFor="maxAttendees">Max Attendees</Label>
                    <Input
                      id="maxAttendees"
                      type="number"
                      value={formData.maxAttendees || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, maxAttendees: e.target.value ? parseInt(e.target.value) : undefined }))}
                      placeholder="Optional"
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Role Targeting */}
          {showRoleTargets && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role Targeting</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Target Roles</Label>
                    <div className="space-y-2 mt-2">
                      {roleOptions.map(role => (
                        <Button
                          key={role.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addRoleTarget('role', role.value)}
                          className="mr-2"
                        >
                          Add {role.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label>Target Grades</Label>
                    <div className="space-y-2 mt-2">
                      {gradeOptions.slice(0, 6).map(grade => (
                        <Button
                          key={grade.value}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addRoleTarget('grade', grade.value)}
                          className="mr-2"
                        >
                          Add {grade.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                {formData.roleTargets.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Targets</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.roleTargets.map((target, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {target.targetType}: {target.targetValue}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeRoleTarget(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEventMutation.isPending}>
              {createEventMutation.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}