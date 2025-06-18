import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, Type, X } from "lucide-react";
import { format } from "date-fns";

interface CalendarEvent {
  id?: string;
  title: string;
  type: 'class' | 'meeting' | 'event' | 'exam';
  startTime: string;
  endTime: string;
  date: Date;
  room?: string;
  participants?: string[];
  description?: string;
  color?: string;
}

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  event?: CalendarEvent;
  initialDate?: Date;
  initialTime?: string;
}

export function EventDialog({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  initialDate,
  initialTime
}: EventDialogProps) {
  const [formData, setFormData] = useState<CalendarEvent>({
    title: '',
    type: 'class',
    startTime: initialTime || '09:00',
    endTime: '10:00',
    date: initialDate || new Date(),
    room: '',
    participants: [],
    description: ''
  });
  
  const [participantInput, setParticipantInput] = useState('');

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else if (initialDate || initialTime) {
      setFormData(prev => ({
        ...prev,
        date: initialDate || prev.date,
        startTime: initialTime || prev.startTime
      }));
    }
  }, [event, initialDate, initialTime]);

  const handleSave = () => {
    onSave(formData);
    onClose();
    resetForm();
  };

  const handleDelete = () => {
    if (event?.id && onDelete) {
      onDelete(event.id);
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'class',
      startTime: '09:00',
      endTime: '10:00',
      date: new Date(),
      room: '',
      participants: [],
      description: ''
    });
    setParticipantInput('');
  };

  const addParticipant = () => {
    if (participantInput.trim()) {
      setFormData(prev => ({
        ...prev,
        participants: [...(prev.participants || []), participantInput.trim()]
      }));
      setParticipantInput('');
    }
  };

  const removeParticipant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants?.filter((_, i) => i !== index) || []
    }));
  };

  const eventTypes = [
    { value: 'class', label: 'Class', color: 'bg-blue-100 text-blue-800' },
    { value: 'meeting', label: 'Meeting', color: 'bg-green-100 text-green-800' },
    { value: 'event', label: 'Event', color: 'bg-purple-100 text-purple-800' },
    { value: 'exam', label: 'Exam', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter event title"
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label>Date</Label>
            <div className="flex items-center gap-2 p-2 border rounded">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(formData.date, 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Room */}
          <div className="space-y-2">
            <Label htmlFor="room">Room/Location</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="room"
                className="pl-8"
                value={formData.room || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                placeholder="Enter room or location"
              />
            </div>
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <Label>Participants</Label>
            <div className="flex gap-2">
              <Input
                value={participantInput}
                onChange={(e) => setParticipantInput(e.target.value)}
                placeholder="Add participant"
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
              />
              <Button type="button" onClick={addParticipant} size="sm">
                Add
              </Button>
            </div>
            {formData.participants && formData.participants.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.participants.map((participant, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {participant}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-red-500"
                      onClick={() => removeParticipant(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter event description (optional)"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div>
            {event && onDelete && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.title.trim()}>
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}