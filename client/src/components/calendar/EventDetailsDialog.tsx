import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Tag,
  User,
  CheckCircle,
  XCircle,
  Clock3,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  eventType: string;
  startDateTime: string;
  endDateTime: string;
  isAllDay: boolean;
  location?: string;
  organizerId: string;
  visibility: string;
  targetAudience: string;
  priority: string;
  status: string;
  requiresRSVP: boolean;
  maxAttendees?: number;
  tags: string[];
  participants?: Array<{
    id: string;
    userId: string;
    participantType: string;
    rsvpStatus: string;
    rsvpResponse?: string;
  }>;
  roleTargets?: Array<{
    id: string;
    targetType: string;
    targetValue: string;
    isRequired: boolean;
  }>;
}

interface EventDetailsDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventUpdated: () => void;
  onRSVP: (status: string, response?: string) => void;
}

export function EventDetailsDialog({ event, open, onOpenChange, onEventUpdated, onRSVP }: EventDetailsDialogProps) {
  const { user } = useAuth();
  const [rsvpStatus, setRsvpStatus] = useState<string>('');
  const [rsvpResponse, setRsvpResponse] = useState<string>('');

  if (!event) return null;

  const userParticipant = event.participants?.find(p => p.userId === user?.id);
  const isOrganizer = event.organizerId === user?.id;
  const canManage = isOrganizer || user?.role === 'admin';

  const handleRSVP = () => {
    if (rsvpStatus) {
      onRSVP(rsvpStatus, rsvpResponse || undefined);
      setRsvpStatus('');
      setRsvpResponse('');
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'normal': return 'default';
      case 'low': return 'outline';
      default: return 'default';
    }
  };

  const getEventTypeColor = (eventType: string) => {
    const colors = {
      meeting: 'bg-blue-500',
      holiday: 'bg-green-500',
      exam: 'bg-red-500',
      assembly: 'bg-purple-500',
      parent_conference: 'bg-orange-500',
      sports: 'bg-yellow-500',
      cultural: 'bg-pink-500',
    };
    return colors[eventType as keyof typeof colors] || 'bg-gray-500';
  };

  const getRSVPIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'tentative': return <Clock3 className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{event.title}</span>
            <div className="flex items-center gap-2">
              <Badge variant={getPriorityVariant(event.priority)}>
                {event.priority}
              </Badge>
              <Badge variant="outline">{event.eventType}</Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.description && (
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(event.startDateTime), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-sm text-muted-foreground">
                        {event.isAllDay 
                          ? 'All day'
                          : `${format(parseISO(event.startDateTime), 'HH:mm')} - ${format(parseISO(event.endDateTime), 'HH:mm')}`
                        }
                      </p>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Audience</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {event.targetAudience.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">Tags</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Targets */}
            {event.roleTargets && event.roleTargets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {event.roleTargets.map((target, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="capitalize">
                            {target.targetType}: {target.targetValue.replace('_', ' ')}
                          </span>
                        </div>
                        {target.isRequired && (
                          <Badge variant="secondary">Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* RSVP Section */}
            {event.requiresRSVP && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">RSVP</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userParticipant ? (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        {getRSVPIcon(userParticipant.rsvpStatus)}
                        <span className="font-medium capitalize">
                          Your Response: {userParticipant.rsvpStatus || 'Pending'}
                        </span>
                      </div>
                      
                      {userParticipant.rsvpResponse && (
                        <div className="p-3 bg-muted rounded">
                          <p className="text-sm font-medium mb-1">Your Message:</p>
                          <p className="text-sm text-muted-foreground">{userParticipant.rsvpResponse}</p>
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-3">
                        <p className="font-medium">Update your response:</p>
                        <Select value={rsvpStatus} onValueChange={setRsvpStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your response" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="accepted">Accept</SelectItem>
                            <SelectItem value="declined">Decline</SelectItem>
                            <SelectItem value="tentative">Maybe</SelectItem>
                          </SelectContent>
                        </Select>

                        <Textarea
                          value={rsvpResponse}
                          onChange={(e) => setRsvpResponse(e.target.value)}
                          placeholder="Optional message (e.g., dietary requirements, questions, etc.)"
                          rows={3}
                        />

                        <Button onClick={handleRSVP} disabled={!rsvpStatus}>
                          Update RSVP
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      You are not a participant in this event
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={event.status === 'active' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visibility:</span>
                    <Badge variant="outline">{event.visibility}</Badge>
                  </div>

                  {event.requiresRSVP && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">RSVP Required:</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      
                      {event.maxAttendees && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Attendees:</span>
                          <span>{event.maxAttendees}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            {event.participants && event.participants.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Participants ({event.participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {event.participants.map((participant, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{participant.userId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getRSVPIcon(participant.rsvpStatus)}
                          <Badge variant="outline" className="text-xs">
                            {participant.participantType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            {canManage && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Edit Event
                  </Button>
                  <Button variant="outline" className="w-full">
                    Manage Participants
                  </Button>
                  <Button variant="destructive" className="w-full">
                    Cancel Event
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}