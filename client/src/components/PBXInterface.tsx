import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CallControl } from "./pbx/CallControl";
import { ExtensionDirectory } from "./pbx/ExtensionDirectory";
import { CallHistory } from "./pbx/CallHistory";
import { VoicemailManager } from "./pbx/VoicemailManager";
import { Call, Extension, CallLog, VoicemailMessage } from "./pbx/types";

export default function PBXInterface() {
  const [activeTab, setActiveTab] = useState("calls");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: callsData } = useQuery({
    queryKey: ['/api/pbx/calls'],
  });

  const { data: extensionsData } = useQuery({
    queryKey: ['/api/pbx/extensions'],
  });

  const { data: callHistoryData } = useQuery({
    queryKey: ['/api/pbx/call-history'],
  });

  const { data: voicemailsData } = useQuery({
    queryKey: ['/api/pbx/voicemails'],
  });

  // Mutations
  const callMutation = useMutation({
    mutationFn: async (action: { type: string; data: any }) => {
      return apiRequest(`/api/pbx/calls/${action.type}`, {
        method: 'POST',
        body: action.data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pbx/calls'] });
      toast({ title: "Call action completed" });
    },
    onError: () => {
      toast({ title: "Call action failed", variant: "destructive" });
    }
  });

  const voicemailMutation = useMutation({
    mutationFn: async (action: { type: string; id: string; data?: any }) => {
      return apiRequest(`/api/pbx/voicemails/${action.id}/${action.type}`, {
        method: 'POST',
        body: action.data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pbx/voicemails'] });
    }
  });

  // Call handlers
  const handleMakeCall = (number: string) => {
    callMutation.mutate({ type: 'make', data: { number } });
  };

  const handleAnswerCall = (callId: string) => {
    callMutation.mutate({ type: 'answer', data: { callId } });
  };

  const handleEndCall = (callId: string) => {
    callMutation.mutate({ type: 'end', data: { callId } });
  };

  const handleHoldCall = (callId: string) => {
    callMutation.mutate({ type: 'hold', data: { callId } });
  };

  const handleResumeCall = (callId: string) => {
    callMutation.mutate({ type: 'resume', data: { callId } });
  };

  const handleMuteCall = (callId: string) => {
    callMutation.mutate({ type: 'mute', data: { callId } });
  };

  const handleTransferCall = (callId: string, destination: string) => {
    callMutation.mutate({ type: 'transfer', data: { callId, destination } });
  };

  // Extension handlers
  const handleCallExtension = (extension: string) => {
    handleMakeCall(extension);
  };

  const handleExtensionDetails = (extension: Extension) => {
    console.log('Extension details:', extension);
  };

  // History handlers
  const handlePlayRecording = (recordingUrl: string) => {
    window.open(recordingUrl, '_blank');
  };

  const handleDownloadRecording = (recordingUrl: string, callId: string) => {
    const link = document.createElement('a');
    link.href = recordingUrl;
    link.download = `call-recording-${callId}.mp3`;
    link.click();
  };

  const handleCallBack = (number: string) => {
    handleMakeCall(number);
  };

  // Voicemail handlers
  const handlePlayVoicemail = (voicemailId: string) => {
    voicemailMutation.mutate({ type: 'play', id: voicemailId });
  };

  const handleDeleteVoicemail = (voicemailId: string) => {
    voicemailMutation.mutate({ type: 'delete', id: voicemailId });
  };

  const handleMarkAsRead = (voicemailId: string) => {
    voicemailMutation.mutate({ type: 'mark-read', id: voicemailId });
  };

  const handleDownloadVoicemail = (audioUrl: string, voicemailId: string) => {
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = `voicemail-${voicemailId}.mp3`;
    link.click();
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PBX System</h1>
          <p className="text-muted-foreground">
            Manage calls, extensions, and voicemail
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calls">Active Calls</TabsTrigger>
          <TabsTrigger value="directory">Directory</TabsTrigger>
          <TabsTrigger value="history">Call History</TabsTrigger>
          <TabsTrigger value="voicemail">Voicemail</TabsTrigger>
        </TabsList>

        <TabsContent value="calls">
          <CallControl
            activeCalls={callsData?.calls || []}
            onMakeCall={handleMakeCall}
            onAnswerCall={handleAnswerCall}
            onEndCall={handleEndCall}
            onHoldCall={handleHoldCall}
            onResumeCall={handleResumeCall}
            onMuteCall={handleMuteCall}
            onTransferCall={handleTransferCall}
          />
        </TabsContent>

        <TabsContent value="directory">
          <ExtensionDirectory
            extensions={extensionsData?.extensions || []}
            onCallExtension={handleCallExtension}
            onExtensionDetails={handleExtensionDetails}
          />
        </TabsContent>

        <TabsContent value="history">
          <CallHistory
            callLogs={callHistoryData?.logs || []}
            onPlayRecording={handlePlayRecording}
            onDownloadRecording={handleDownloadRecording}
            onCallBack={handleCallBack}
          />
        </TabsContent>

        <TabsContent value="voicemail">
          <VoicemailManager
            voicemails={voicemailsData?.voicemails || []}
            onPlayVoicemail={handlePlayVoicemail}
            onDeleteVoicemail={handleDeleteVoicemail}
            onMarkAsRead={handleMarkAsRead}
            onCallBack={handleCallBack}
            onDownloadVoicemail={handleDownloadVoicemail}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}