import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import LiveSessionControl from "../LiveSessionControl";
import { CreateSessionDialog } from "./CreateSessionDialog";
import { SessionCard } from "./SessionCard";
import { SessionStats } from "./SessionStats";

export default function LiveSessionPanel() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [controlSessionId, setControlSessionId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: liveSessions = [], isLoading: sessionsLoading } = useQuery({
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

  const startSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await apiRequest("POST", `/api/teacher/live-sessions/${sessionId}/start`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/live-sessions'] });
      toast({
        title: "Session Started",
        description: "Your live session is now active.",
      });
    }
  });

  const endSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      return await apiRequest("POST", `/api/teacher/live-sessions/${sessionId}/end`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teacher/live-sessions'] });
      toast({
        title: "Session Ended",
        description: "Your live session has been ended.",
      });
    }
  });

  const handleCreateSession = (sessionData: any) => {
    createSessionMutation.mutate(sessionData);
  };

  const handleStartSession = (sessionId: string) => {
    startSessionMutation.mutate(sessionId);
  };

  const handleEndSession = (sessionId: string) => {
    endSessionMutation.mutate(sessionId);
  };

  const handleJoinSession = (sessionId: string) => {
    const session = liveSessions.find(s => s.id === sessionId);
    if (session?.joinUrl) {
      window.open(session.joinUrl, '_blank');
    }
  };

  const handleOpenControl = (sessionId: string) => {
    setControlSessionId(sessionId);
  };

  if (sessionsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Live Sessions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Sessions</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <SessionStats sessions={liveSessions} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveSessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onStartSession={handleStartSession}
            onEndSession={handleEndSession}
            onJoinSession={handleJoinSession}
            onOpenControl={handleOpenControl}
          />
        ))}
      </div>

      {liveSessions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Plus className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Live Sessions</h3>
          <p className="text-gray-600 mb-4">
            Schedule your first live session to start teaching online.
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Your First Session
          </Button>
        </div>
      )}

      <CreateSessionDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateSession}
        classes={classes || []}
        isSubmitting={createSessionMutation.isPending}
      />

      {controlSessionId && (
        <LiveSessionControl 
          sessionId={controlSessionId} 
          onClose={() => setControlSessionId(null)} 
        />
      )}
    </div>
  );
}