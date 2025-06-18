import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface EventDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedEvent: any;
  getStatusColor: (status: string) => string;
  getSeverityColor: (severity: string) => string;
}

export function EventDetailsDialog({ 
  isOpen, 
  onClose, 
  selectedEvent, 
  getStatusColor, 
  getSeverityColor 
}: EventDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Security Event Details</DialogTitle>
        </DialogHeader>
        {selectedEvent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Event Type</Label>
                <p className="text-sm">{selectedEvent.type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Severity</Label>
                <Badge variant={getSeverityColor(selectedEvent.severity)}>
                  {selectedEvent.severity}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge variant={getStatusColor(selectedEvent.status)}>
                  {selectedEvent.status}
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium">Time</Label>
                <p className="text-sm">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm mt-1">{selectedEvent.description}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Location</Label>
              <p className="text-sm mt-1">{selectedEvent.location}</p>
            </div>
            <div className="flex space-x-2">
              <Button>Investigate</Button>
              <Button variant="outline">Assign Officer</Button>
              <Button variant="outline">Mark Resolved</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}