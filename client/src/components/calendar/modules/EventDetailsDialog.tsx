import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, MapPin, User, Edit, Trash2, Users, BookOpen, UserCheck, Coffee, Home } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  location: string;
  type: string;
  description?: string;
  isAllDay?: boolean;
}

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  eventTypes: any[];
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  canEdit: boolean;
}

export function EventDetailsDialog({
  isOpen,
  onClose,
  event,
  eventTypes,
  onEdit,
  onDelete,
  canEdit
}: EventDetailsDialogProps) {
  if (!event) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'assessment': return BookOpen;
      case 'school-event': return Users;
      case 'meeting': return UserCheck;
      case 'professional-development': return Coffee;
      case 'holiday': return Home;
      default: return Calendar;
    }
  };

  const getEventTypeStyle = (type: string) => {
    const eventType = eventTypes.find(t => t.id === type);
    return eventType || { textColor: 'text-gray-700', bgColor: 'bg-gray-100', label: type };
  };

  const eventStyle = getEventTypeStyle(event.type);
  const Icon = getEventIcon(event.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <span>{event.title}</span>
            </div>
            <Badge className={`${eventStyle.bgColor} ${eventStyle.textColor}`}>
              {eventStyle.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Date</span>
              </Label>
              <p className="text-sm mt-1">
                {event.date.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Time</span>
              </Label>
              <p className="text-sm mt-1">{event.isAllDay ? 'All Day' : event.time}</p>
            </div>

            <div className="col-span-2">
              <Label className="text-sm font-medium flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </Label>
              <p className="text-sm mt-1">{event.location}</p>
            </div>
          </div>

          {event.description && (
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm mt-1 text-gray-600">{event.description}</p>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-4 border-t text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>Event ID: {event.id}</span>
          </div>

          {canEdit && (
            <div className="flex space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => onEdit && onEdit(event)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Event
              </Button>
              <Button
                variant="outline"
                onClick={() => onDelete && onDelete(event.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Event
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}