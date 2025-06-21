import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Calendar, Clock } from "lucide-react";

interface CreateSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: any) => void;
  classes: any[];
  isSubmitting: boolean;
}

export function CreateSessionDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  classes, 
  isSubmitting 
}: CreateSessionDialogProps) {
  const [sessionData, setSessionData] = useState({
    title: '',
    description: '',
    classId: '',
    scheduledFor: '',
    duration: '60',
    recordSession: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sessionData);
  };

  const resetForm = () => {
    setSessionData({
      title: '',
      description: '',
      classId: '',
      scheduledFor: '',
      duration: '60',
      recordSession: false
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Live Session</DialogTitle>
          <DialogDescription>
            Create a new live teaching session for your students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Session Title</Label>
            <Input
              id="title"
              value={sessionData.title}
              onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter session title"
              required
            />
          </div>

          <div>
            <Label htmlFor="class">Select Class</Label>
            <Select
              value={sessionData.classId}
              onValueChange={(value) => setSessionData(prev => ({ ...prev, classId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a class" />
              </SelectTrigger>
              <SelectContent>
                {classes?.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name} ({cls.grade})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledFor" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date & Time
              </Label>
              <Input
                id="scheduledFor"
                type="datetime-local"
                value={sessionData.scheduledFor}
                onChange={(e) => setSessionData(prev => ({ ...prev, scheduledFor: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (min)
              </Label>
              <Select
                value={sessionData.duration}
                onValueChange={(value) => setSessionData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={sessionData.description}
              onChange={(e) => setSessionData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you'll cover in this session..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}