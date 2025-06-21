import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Lead, Activity, DemoRequest } from "@/components/crm/types";

export function useCRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch leads
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/crm/leads"],
    queryFn: () => apiRequest("GET", "/api/crm/leads"),
  });

  // Fetch demo requests
  const { data: demoRequests = [], isLoading: demosLoading } = useQuery({
    queryKey: ["/api/crm/demo-requests"],
    queryFn: () => apiRequest("GET", "/api/crm/demo-requests"),
  });

  // Fetch lead activities
  const { data: activities = [] } = useQuery({
    queryKey: ["/api/crm/activities", selectedLead?.id],
    queryFn: () => apiRequest("GET", `/api/crm/activities?leadId=${selectedLead?.id}`),
    enabled: !!selectedLead,
  });

  // Create lead mutation
  const createLeadMutation = useMutation({
    mutationFn: async (data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest("POST", "/api/crm/leads", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      setShowLeadForm(false);
      setEditingLead(null);
      toast({
        title: "Lead created",
        description: "New lead has been added successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create lead",
        variant: "destructive",
      });
    },
  });

  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: async (data: { id: number; updates: Partial<Lead> }) => {
      return apiRequest("PATCH", `/api/crm/leads/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      setEditingLead(null);
      toast({
        title: "Lead updated",
        description: "Lead information has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead",
        variant: "destructive",
      });
    },
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/crm/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      setSelectedLead(null);
      toast({
        title: "Lead deleted",
        description: "Lead has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lead",
        variant: "destructive",
      });
    },
  });

  // Add activity mutation
  const addActivityMutation = useMutation({
    mutationFn: async (data: Omit<Activity, 'id' | 'createdAt'>) => {
      return apiRequest("POST", "/api/crm/activities", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/activities", selectedLead?.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      toast({
        title: "Activity added",
        description: "Activity has been logged successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add activity",
        variant: "destructive",
      });
    },
  });

  // Create demo request mutation
  const createDemoRequestMutation = useMutation({
    mutationFn: async (data: Omit<DemoRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest("POST", "/api/crm/demo-requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/demo-requests"] });
      toast({
        title: "Demo request created",
        description: "Demo request has been scheduled successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create demo request",
        variant: "destructive",
      });
    },
  });

  // Filter leads based on search and filters
  const filteredLeads = leads.filter((lead: Lead) => {
    const matchesSearch = !searchTerm || 
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return {
    // State
    searchTerm,
    statusFilter,
    priorityFilter,
    selectedLead,
    showLeadForm,
    editingLead,
    
    // Data
    leads: filteredLeads,
    allLeads: leads,
    demoRequests,
    activities,
    
    // Loading states
    leadsLoading,
    demosLoading,
    isCreatingLead: createLeadMutation.isPending,
    isUpdatingLead: updateLeadMutation.isPending,
    isDeletingLead: deleteLeadMutation.isPending,
    isAddingActivity: addActivityMutation.isPending,
    isCreatingDemo: createDemoRequestMutation.isPending,
    
    // Actions
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    setSelectedLead,
    setShowLeadForm,
    setEditingLead,
    
    // Mutations
    createLead: createLeadMutation.mutate,
    updateLead: updateLeadMutation.mutate,
    deleteLead: deleteLeadMutation.mutate,
    addActivity: addActivityMutation.mutate,
    createDemoRequest: createDemoRequestMutation.mutate,
  };
}