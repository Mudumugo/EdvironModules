import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Tag, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { CalendarEvent, EVENT_TYPES, PRIORITY_LEVELS } from "./types";

interface EventDetailsProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  onRSVP?: (event: CalendarEvent, status: 'yes' | 'no' | 'maybe') => void;
}

export function EventDetails({ 
  event, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  onRSVP 
}: EventDetailsProps) {
  if (!event) return null;

  const typeInfo = EVENT_TYPES.find(t => t.value === event.eventType);
  const priorityInfo = PRIORITY_LEVELS.find(p => p.value === event.priority);

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: event.isAllDay ? undefined : '2-digit',
      minute: event.isAllDay ? undefined : '2-digit'
    });
  };

  const formatDuration = () => {
    if (event.isAllDay) return "All day";
    
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const duration = end.getTime() - start.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'tentative': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span>{typeInfo?.icon}</span>
              {event.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
              <Badge variant="outline" className={`text-${priorityInfo?.color}-600`}>
                {priorityInfo?.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-2">
            {onEdit && (
              <Button onClick={() => onEdit(event)} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button onClick={() => onDelete(event)} variant="outline" className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            )}
            {event.requiresRSVP && onRSVP && (
              <>
                <Button onClick={() => onRSVP(event, 'yes')} size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Accept
                </Button>
                <Button onClick={() => onRSVP(event, 'maybe')} variant="outline" size="sm">
                  Maybe
                </Button>
                <Button onClick={() => onRSVP(event, 'no')} variant="outline" size="sm">
                  Decline
                </Button>
              </>
            )}
          </div>

          {/* Description */}
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date & Time */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <div className="text-sm font-medium text-gray-600">Start</div>
                  <div>{formatDateTime(event.startDateTime)}</div>
                </div>
                
                {!event.isAllDay && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">End</div>
                    <div>{formatDateTime(event.endDateTime)}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-medium text-gray-600">Duration</div>
                  <div>{formatDuration()}</div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Organizer */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {event.location && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Location</div>
                    <div>{event.location}</div>
                  </div>
                )}
                
                {event.organizer && (
                  <div>
                    <div className="text-sm font-medium text-gray-600">Organizer</div>
                    <div>{event.organizer}</div>
                  </div>
                )}
                
                <div>
                  <div className="text-sm font-medium text-gray-600">Visibility</div>
                  <div className="capitalize">{event.visibility}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RSVP Information */}
          {event.requiresRSVP && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  RSVP Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Requires RSVP</span>
                  <Badge variant="secondary">Yes</Badge>
                </div>
                
                {event.maxAttendees && (
                  <div className="flex justify-between items-center">
                    <span>Maximum Attendees</span>
                    <span>{event.maxAttendees}</span>
                  </div>
                )}
                
                {event.currentAttendees !== undefined && (
                  <div className="flex justify-between items-center">
                    <span>Current Attendees</span>
                    <span>{event.currentAttendees}{event.maxAttendees ? ` / ${event.maxAttendees}` : ''}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recurrence */}
          {event.recurrence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recurrence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Pattern</span>
                    <span className="capitalize">{event.recurrence.pattern}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interval</span>
                    <span>Every {event.recurrence.interval} {event.recurrence.pattern.slice(0, -2)}(s)</span>
                  </div>
                  {event.recurrence.endDate && (
                    <div className="flex justify-between">
                      <span>End Date</span>
                      <span>{new Date(event.recurrence.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created</span>
                <span>{new Date(event.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Updated</span>
                <span>{new Date(event.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Created By</span>
                <span>{event.createdBy}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EventDetails;