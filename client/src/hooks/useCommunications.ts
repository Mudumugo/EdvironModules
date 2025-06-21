import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Communication, CommunicationFormData } from "@/components/communications/types";

export function useCommunications() {
  const [activeView, setActiveView] = useState<"all" | "draft" | "scheduled" | "sent" | "archived">("all");
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch communications
  const { data: communications = [], isLoading } = useQuery<Communication[]>({
    queryKey: ['/api/communications'],
    queryFn: () => apiRequest('GET', '/api/communications'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Filter communications
  const filteredCommunications = useMemo(() => {
    if (!Array.isArray(communications)) return [];
    return communications.filter(comm => {
      const matchesType = filterType === 'all' || comm.type === filterType;
      const matchesStatus = filterStatus === 'all' || comm.status === filterStatus;
      const matchesSearch = !searchTerm || 
        comm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comm.content.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [communications, filterType, filterStatus, searchTerm]);

  // Group communications by status
  const groupedCommunications = useMemo(() => {
    const groups = {
      all: filteredCommunications,
      draft: filteredCommunications.filter(c => c.status === 'draft'),
      scheduled: filteredCommunications.filter(c => c.status === 'scheduled'),
      sent: filteredCommunications.filter(c => c.status === 'sent'),
      archived: filteredCommunications.filter(c => c.status === 'archived'),
    };
    return groups;
  }, [filteredCommunications]);

  // Create communication mutation
  const createCommunicationMutation = useMutation({
    mutationFn: async (data: CommunicationFormData) => {
      return apiRequest('POST', '/api/communications', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      setShowCreateDialog(false);
      toast({
        title: "Communication created",
        description: "Your communication has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create communication",
        variant: "destructive",
      });
    },
  });

  // Update communication mutation
  const updateCommunicationMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CommunicationFormData> }) => {
      return apiRequest('PUT', `/api/communications/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      toast({
        title: "Communication updated",
        description: "Your communication has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update communication",
        variant: "destructive",
      });
    },
  });

  // Delete communication mutation
  const deleteCommunicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/communications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      toast({
        title: "Communication deleted",
        description: "The communication has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete communication",
        variant: "destructive",
      });
    },
  });

  // Send communication mutation
  const sendCommunicationMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('POST', `/api/communications/${id}/send`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communications'] });
      toast({
        title: "Communication sent",
        description: "Your communication has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send communication",
        variant: "destructive",
      });
    },
  });

  return {
    // State
    activeView,
    selectedCommunication,
    showCreateDialog,
    showDetailsDialog,
    filterType,
    filterStatus,
    searchTerm,
    
    // Data
    communications: groupedCommunications[activeView],
    allCommunications: communications,
    isLoading,
    
    // Actions
    setActiveView,
    setSelectedCommunication,
    setShowCreateDialog,
    setShowDetailsDialog,
    setFilterType,
    setFilterStatus,
    setSearchTerm,
    
    // Mutations
    createCommunication: createCommunicationMutation.mutate,
    updateCommunication: updateCommunicationMutation.mutate,
    deleteCommunication: deleteCommunicationMutation.mutate,
    sendCommunication: sendCommunicationMutation.mutate,
    
    // Loading states
    isCreating: createCommunicationMutation.isPending,
    isUpdating: updateCommunicationMutation.isPending,
    isDeleting: deleteCommunicationMutation.isPending,
    isSending: sendCommunicationMutation.isPending,
  };
}