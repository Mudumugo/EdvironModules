import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Video, Users, Calendar, Clock, Play, Square, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LiveSessionPanel() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: liveSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/teacher/live-sessions']
  });

  const { data: classes } = useQuery({
    queryKey: ['/api/teacher/classes']
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      return await apiRequest("POST", "/api/teacher/live-sessions", sessionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/live-sessions'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Session Scheduled",
        description: "Your live session has been successfully scheduled.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to schedule live session. Please try again.",
        variant: "destructive",
      });
    }
  });

  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    classId: '',
    sessionType: 'lecture',
    scheduledTime: '',
    duration: 60
  });

  const handleCreateSession = () => {
    createSessionMutation.mutate(newSession);
  };

  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-500';
      case 'review': return 'bg-green-500';
      case 'office-hours': return 'bg-purple-500';
      case 'lab': return 'bg-orange-500';
      case 'discussion': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-500 animate-pulse';
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const isSessionLive = (session: any) => {
    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    const sessionEnd = new Date(sessionTime.getTime() + session.duration * 60000);
    return now >= sessionTime && now <= sessionEnd;
  };

  const isSessionUpcoming = (session: any) => {
    const now = new Date();
    const sessionTime = new Date(session.scheduledTime);
    const timeDiff = sessionTime.getTime() - now.getTime();
    return timeDiff > 0 && timeDiff <= 30 * 60 * 1000; // Within 30 minutes
  };

  if (sessionsLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Live Sessions</CardTitle>
            <CardDescription>Schedule and manage live video sessions</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Schedule Live Session</DialogTitle>
                <DialogDescription>
                  Create a new live video session for your students.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Session Title</Label>
                    <Input
                      id="title"
                      value={newSession.title}
                      onChange={(e) => setNewSession({ ...newSession, title: e.target.value })}
                      placeholder="Enter session title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class</Label>
                    <Select 
                      value={newSession.classId} 
                      onValueChange={(value) => setNewSession({ ...newSession, classId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes?.map((cls: any) => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name} - {cls.grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSession.description}
                    onChange={(e) => setNewSession({ ...newSession, description: e.target.value })}
                    placeholder="Brief description of the session"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Session Type</Label>
                    <Select 
                      value={newSession.sessionType} 
                      onValueChange={(value) => setNewSession({ ...newSession, sessionType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture">Lecture</SelectItem>
                        <SelectItem value="review">Review Session</SelectItem>
                        <SelectItem value="office-hours">Office Hours</SelectItem>
                        <SelectItem value="lab">Lab Session</SelectItem>
                        <SelectItem value="discussion">Discussion</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newSession.duration}
                      onChange={(e) => setNewSession({ ...newSession, duration: parseInt(e.target.value) })}
                      min={15}
                      max={240}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scheduledTime">Scheduled Time</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      value={newSession.scheduledTime}
                      onChange={(e) => setNewSession({ ...newSession, scheduledTime: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateSession}
                  disabled={createSessionMutation.isPending}
                >
                  {createSessionMutation.isPending ? "Scheduling..." : "Schedule Session"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {liveSessions?.map((session: any) => {
            const isLive = isSessionLive(session);
            const isUpcoming = isSessionUpcoming(session);
            const sessionDate = new Date(session.scheduledTime);

            return (
              <div key={session.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <Badge className={getSessionTypeColor(session.sessionType)}>
                        {session.sessionType}
                      </Badge>
                      {isLive && (
                        <Badge className="bg-red-500 animate-pulse">
                          <Video className="h-3 w-3 mr-1" />
                          LIVE
                        </Badge>
                      )}
                      {isUpcoming && (
                        <Badge className="bg-orange-500">
                          Starting Soon
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{session.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{session.className}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{sessionDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{sessionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{session.attendees} attendees</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {isLive ? (
                    <>
                      <Button className="bg-red-500 hover:bg-red-600">
                        <Square className="h-4 w-4 mr-2" />
                        End Session
                      </Button>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage
                      </Button>
                    </>
                  ) : isUpcoming ? (
                    <>
                      <Button className="bg-green-500 hover:bg-green-600">
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline">
                        <Video className="h-4 w-4 mr-2" />
                        View Recording
                      </Button>
                      <Button variant="outline">
                        <Settings className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}