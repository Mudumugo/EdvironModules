import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface DevicePolicy {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'usage' | 'content' | 'network';
  status: 'active' | 'inactive' | 'draft';
  rules: PolicyRule[];
  targetDevices: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyRule {
  id: string;
  type: string;
  condition: string;
  action: string;
  parameters: Record<string, any>;
}

export function useDevicePolicies() {
  const [selectedPolicy, setSelectedPolicy] = useState<DevicePolicy | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch device policies
  const { data: policies = [], isLoading } = useQuery<DevicePolicy[]>({
    queryKey: ['/api/device-policies'],
    queryFn: () => apiRequest('GET', '/api/device-policies'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Filter policies
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = !searchTerm || 
      policy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || policy.type === filterType;
    const matchesStatus = filterStatus === "all" || policy.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Create policy mutation
  const createPolicyMutation = useMutation({
    mutationFn: async (data: Omit<DevicePolicy, 'id' | 'createdAt' | 'updatedAt'>) => {
      return apiRequest('POST', '/api/device-policies', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-policies'] });
      setShowCreateDialog(false);
      toast({
        title: "Policy created",
        description: "Device policy has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create policy",
        variant: "destructive",
      });
    },
  });

  // Update policy mutation
  const updatePolicyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<DevicePolicy> }) => {
      return apiRequest('PATCH', `/api/device-policies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-policies'] });
      toast({
        title: "Policy updated",
        description: "Device policy has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update policy",
        variant: "destructive",
      });
    },
  });

  // Delete policy mutation
  const deletePolicyMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/device-policies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-policies'] });
      setSelectedPolicy(null);
      toast({
        title: "Policy deleted",
        description: "Device policy has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete policy",
        variant: "destructive",
      });
    },
  });

  // Deploy policy mutation
  const deployPolicyMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('POST', `/api/device-policies/${id}/deploy`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/device-policies'] });
      toast({
        title: "Policy deployed",
        description: "Device policy has been deployed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deploy policy",
        variant: "destructive",
      });
    },
  });

  return {
    // State
    selectedPolicy,
    showCreateDialog,
    searchTerm,
    filterType,
    filterStatus,
    
    // Data
    policies: filteredPolicies,
    allPolicies: policies,
    isLoading,
    
    // Actions
    setSelectedPolicy,
    setShowCreateDialog,
    setSearchTerm,
    setFilterType,
    setFilterStatus,
    
    // Mutations
    createPolicy: createPolicyMutation.mutate,
    updatePolicy: updatePolicyMutation.mutate,
    deletePolicy: deletePolicyMutation.mutate,
    deployPolicy: deployPolicyMutation.mutate,
    
    // Loading states
    isCreating: createPolicyMutation.isPending,
    isUpdating: updatePolicyMutation.isPending,
    isDeleting: deletePolicyMutation.isPending,
    isDeploying: deployPolicyMutation.isPending,
  };
}