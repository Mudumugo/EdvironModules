import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function useUserProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user settings
  const { data: userSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["/api/user/settings"],
    retry: false,
  });

  // Update settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", "/api/user/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/settings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  return {
    activeTab,
    setActiveTab,
    userSettings,
    settingsLoading,
    updateSettingsMutation,
  };
}