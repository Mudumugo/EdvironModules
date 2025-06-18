// Security module hook - isolated from other modules
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SecurityZone, SecurityCamera, SecurityEvent, VisitorRegistration, SecurityCall, SecurityMetrics } from "@shared/types/security.types";

export function useSecurityModule() {
  const queryClient = useQueryClient();

  // Security zones
  const useSecurityZones = () => {
    return useQuery<SecurityZone[]>({
      queryKey: ["/api/security/zones"],
    });
  };

  // Security cameras
  const useSecurityCameras = (zoneId?: string) => {
    return useQuery<SecurityCamera[]>({
      queryKey: zoneId ? ["/api/security/cameras", { zoneId }] : ["/api/security/cameras"],
    });
  };

  // Security events
  const useSecurityEvents = (filters?: { zoneId?: string; severity?: string }) => {
    return useQuery<SecurityEvent[]>({
      queryKey: filters && Object.keys(filters).length > 0 
        ? ["/api/security/events", filters] 
        : ["/api/security/events"],
    });
  };

  // Visitor registrations
  const useVisitorRegistrations = () => {
    return useQuery<VisitorRegistration[]>({
      queryKey: ["/api/security/visitors"],
    });
  };

  // Security calls
  const useSecurityCalls = () => {
    return useQuery<SecurityCall[]>({
      queryKey: ["/api/security/calls"],
    });
  };

  // Security metrics
  const useSecurityMetrics = () => {
    return useQuery<SecurityMetrics>({
      queryKey: ["/api/security/metrics"],
    });
  };

  // Active threats
  const useActiveThreats = () => {
    return useQuery<SecurityEvent[]>({
      queryKey: ["/api/security/threats"],
    });
  };

  // Mutations
  const createSecurityEvent = useMutation({
    mutationFn: async (eventData: Partial<SecurityEvent>) => {
      return await apiRequest("POST", "/api/security/events", eventData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/events"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/metrics"] });
    },
  });

  const createVisitorRegistration = useMutation({
    mutationFn: async (visitorData: Partial<VisitorRegistration>) => {
      return await apiRequest("POST", "/api/security/visitors", visitorData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/visitors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/security/metrics"] });
    },
  });

  const createSecurityCall = useMutation({
    mutationFn: async (callData: Partial<SecurityCall>) => {
      return await apiRequest("POST", "/api/security/calls", callData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/security/calls"] });
    },
  });

  return {
    // Queries
    useSecurityZones,
    useSecurityCameras,
    useSecurityEvents,
    useVisitorRegistrations,
    useSecurityCalls,
    useSecurityMetrics,
    useActiveThreats,
    // Mutations
    createSecurityEvent,
    createVisitorRegistration,
    createSecurityCall,
  };
}