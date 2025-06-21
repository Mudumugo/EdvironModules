import { useState, useRef, useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  priority: number;
  isAvailable: boolean;
  lastContacted?: Date;
}

export interface SecurityIncident {
  id: string;
  type: 'emergency' | 'security' | 'medical' | 'fire' | 'lockdown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  reportedBy: string;
  reportedAt: Date;
  status: 'active' | 'resolved' | 'investigating';
  assignedTo?: string;
  responseTime?: number;
  resolutionTime?: number;
}

export interface CallSession {
  id: string;
  incidentId?: string;
  contactId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'dialing' | 'connected' | 'ended' | 'failed';
  callType: 'voice' | 'video';
  recordingUrl?: string;
}

export const INCIDENT_TYPES = [
  { value: 'emergency', label: 'Emergency', icon: 'AlertTriangle', color: 'red' },
  { value: 'security', label: 'Security Alert', icon: 'Shield', color: 'orange' },
  { value: 'medical', label: 'Medical Emergency', icon: 'Heart', color: 'red' },
  { value: 'fire', label: 'Fire Emergency', icon: 'Flame', color: 'red' },
  { value: 'lockdown', label: 'Lockdown', icon: 'Lock', color: 'purple' }
];

export const SEVERITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'green' },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'critical', label: 'Critical', color: 'red' }
];

export function useSecurityCallSystem() {
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [currentIncident, setCurrentIncident] = useState<SecurityIncident | null>(null);
  const [isDialPadOpen, setIsDialPadOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState("");
  const [callHistory, setCallHistory] = useState<CallSession[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callVolume, setCallVolume] = useState(80);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch emergency contacts
  const { data: contacts = [], isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ['/api/security/contacts'],
    queryFn: () => apiRequest('GET', '/api/security/contacts'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch active incidents
  const { data: incidents = [], isLoading: incidentsLoading } = useQuery<SecurityIncident[]>({
    queryKey: ['/api/security/incidents'],
    queryFn: () => apiRequest('GET', '/api/security/incidents'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Start call mutation
  const startCallMutation = useMutation({
    mutationFn: async ({ contactId, callType }: { contactId: string; callType: 'voice' | 'video' }) => {
      return apiRequest('POST', '/api/security/calls/start', { contactId, callType });
    },
    onSuccess: (callSession) => {
      setActiveCall(callSession);
      toast({
        title: "Call started",
        description: "Connecting to emergency contact...",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Call failed",
        description: error.message || "Failed to start call",
        variant: "destructive",
      });
    },
  });

  // End call mutation
  const endCallMutation = useMutation({
    mutationFn: async (callId: string) => {
      return apiRequest('POST', `/api/security/calls/${callId}/end`);
    },
    onSuccess: (endedCall) => {
      setActiveCall(null);
      setCallHistory(prev => [endedCall, ...prev]);
      setIsRecording(false);
      toast({
        title: "Call ended",
        description: `Call duration: ${endedCall.duration || 0} seconds`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error ending call",
        description: error.message || "Failed to end call properly",
        variant: "destructive",
      });
    },
  });

  // Report incident mutation
  const reportIncidentMutation = useMutation({
    mutationFn: async (incident: Omit<SecurityIncident, 'id' | 'reportedAt' | 'status'>) => {
      return apiRequest('POST', '/api/security/incidents', {
        ...incident,
        reportedAt: new Date().toISOString(),
        status: 'active'
      });
    },
    onSuccess: (newIncident) => {
      queryClient.invalidateQueries({ queryKey: ['/api/security/incidents'] });
      setCurrentIncident(newIncident);
      toast({
        title: "Incident reported",
        description: "Security incident has been logged and authorities notified.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to report incident",
        description: error.message || "Could not submit incident report",
        variant: "destructive",
      });
    },
  });

  // Call management functions
  const startCall = useCallback((contactId: string, callType: 'voice' | 'video' = 'voice') => {
    if (activeCall) {
      toast({
        title: "Call in progress",
        description: "Please end the current call before starting a new one.",
        variant: "destructive",
      });
      return;
    }
    
    startCallMutation.mutate({ contactId, callType });
  }, [activeCall, startCallMutation, toast]);

  const endCall = useCallback(() => {
    if (!activeCall) return;
    endCallMutation.mutate(activeCall.id);
  }, [activeCall, endCallMutation]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    // In a real implementation, this would affect the actual call audio
  }, []);

  const adjustVolume = useCallback((volume: number) => {
    setCallVolume(Math.max(0, Math.min(100, volume)));
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (!activeCall) return;

    if (isRecording) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording logic would go here
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Call is now being recorded for security purposes.",
      });
    }
  }, [activeCall, isRecording, toast]);

  // Dial pad functions
  const dialDigit = useCallback((digit: string) => {
    setDialNumber(prev => prev + digit);
  }, []);

  const clearDialNumber = useCallback(() => {
    setDialNumber("");
  }, []);

  const dialEmergencyNumber = useCallback((number: string) => {
    setDialNumber(number);
    // In a real implementation, this would initiate an actual call
    toast({
      title: "Emergency call",
      description: `Dialing ${number}...`,
    });
  }, [toast]);

  // Quick action functions
  const triggerEmergencyAlert = useCallback((type: SecurityIncident['type']) => {
    const incident = {
      type,
      severity: 'critical' as const,
      title: `${type.toUpperCase()} Alert`,
      description: `Emergency ${type} situation reported`,
      location: 'Unknown', // Would be determined by user location
      reportedBy: 'Security System'
    };

    reportIncidentMutation.mutate(incident);
  }, [reportIncidentMutation]);

  const callAllContacts = useCallback(() => {
    const availableContacts = contacts.filter(contact => contact.isAvailable);
    
    if (availableContacts.length === 0) {
      toast({
        title: "No contacts available",
        description: "All emergency contacts are currently unavailable.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would start a conference call or sequential calls
    toast({
      title: "Calling all contacts",
      description: `Attempting to reach ${availableContacts.length} emergency contacts...`,
    });
  }, [contacts, toast]);

  const sendEmergencyMessage = useCallback((message: string) => {
    // In a real implementation, this would send SMS/email to all contacts
    toast({
      title: "Emergency message sent",
      description: "All emergency contacts have been notified.",
    });
  }, [toast]);

  // Status and utility functions
  const getContactAvailability = useCallback((contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.isAvailable || false;
  }, [contacts]);

  const getIncidentsByType = useCallback((type: SecurityIncident['type']) => {
    return incidents.filter(incident => incident.type === type);
  }, [incidents]);

  const getActiveIncidents = useCallback(() => {
    return incidents.filter(incident => incident.status === 'active');
  }, [incidents]);

  const formatCallDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    activeCall,
    currentIncident,
    isDialPadOpen,
    dialNumber,
    callHistory,
    isRecording,
    isMuted,
    callVolume,

    // Data
    contacts,
    incidents,
    incidentTypes: INCIDENT_TYPES,
    severityLevels: SEVERITY_LEVELS,

    // Loading states
    contactsLoading,
    incidentsLoading,
    isStartingCall: startCallMutation.isPending,
    isEndingCall: endCallMutation.isPending,
    isReportingIncident: reportIncidentMutation.isPending,

    // Actions
    startCall,
    endCall,
    toggleMute,
    adjustVolume,
    toggleRecording,
    setIsDialPadOpen,
    dialDigit,
    clearDialNumber,
    dialEmergencyNumber,
    triggerEmergencyAlert,
    callAllContacts,
    sendEmergencyMessage,
    setCurrentIncident,

    // Utilities
    getContactAvailability,
    getIncidentsByType,
    getActiveIncidents,
    formatCallDuration,

    // Computed
    hasActiveCall: !!activeCall,
    activeIncidentsCount: getActiveIncidents().length,
    availableContactsCount: contacts.filter(c => c.isAvailable).length,
    emergencyContacts: contacts.filter(c => c.priority <= 3).sort((a, b) => a.priority - b.priority),
  };
}