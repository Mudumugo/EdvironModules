import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format, parseISO } from "date-fns";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  AlertCircle, 
  Check, 
  X, 
  Edit,
  Trash2
} from "lucide-react";

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
  tags: string[];
}

interface EventDetailsDialogProps {
  event: CalendarEvent | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (event: CalendarEvent) => void;
  onRSVP?: (status: string, response?: string) => void;
}

export function EventDetailsDialog({ 
  event, 
  isOpen, 
  onOpenChange, 
  onEdit, 
  onRSVP 
}: EventDetailsDialogProps) {
  const user = null; // Disabled auth polling to prevent twitching
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return apiRequest("DELETE", `/api/calendar/events/${eventId}`);
    },
    onSuccess: () => {
      toast({
        title: "Event Deleted",
        description: "Event has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/calendar/events"] });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      });
    },
  });

  if (!event) return null;

  const canEdit = user?.id === event.organizerId || user?.role === 'admin' || user?.role === 'teacher';
  const canDelete = user?.id === event.organizerId || user?.role === 'admin';

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "PPP");
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "p");
    } catch {
      return dateStr;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'academic': return 'bg-blue-500';
      case 'administrative': return 'bg-purple-500';
      case 'social': return 'bg-pink-500';
      case 'sports': return 'bg-green-500';
      case 'cultural': return 'bg-orange-500';
      case 'meeting': return 'bg-gray-500';
      case 'deadline': return 'bg-red-500';
      case 'holiday': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(event.id);
    }
  };

  const handleRSVP = (status: string) => {
    onRSVP?.(status);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-xl font-bold pr-8">
              {event.title}
            </DialogTitle>
            <div className="flex space-x-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit?.(event)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteEventMutation.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getEventTypeColor(event.eventType)} text-white`}>
              {event.eventType}
            </Badge>
            <Badge className={`${getPriorityColor(event.priority)} text-white`}>
              {event.priority} priority
            </Badge>
            <Badge variant="outline">
              {event.visibility}
            </Badge>
          </div>

          {event.description && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">
                  {formatDate(event.startDateTime)}
                  {formatDate(event.startDateTime) !== formatDate(event.endDateTime) && 
                    ` - ${formatDate(event.endDateTime)}`
                  }
                </span>
              </div>

              {!event.isAllDay && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {formatTime(event.startDateTime)} - {formatTime(event.endDateTime)}
                  </span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <span className="text-sm capitalize">{event.targetAudience}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Status: {event.status}</span>
              </div>

              {event.tags && event.tags.length > 0 && (
                <div>
                  <span className="text-sm text-gray-500">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {event.requiresRSVP && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium mb-2">RSVP Required</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRSVP('attending')}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Attending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRSVP('not_attending')}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Not Attending
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRSVP('maybe')}
                    className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Maybe
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}