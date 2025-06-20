import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DeviceStatus } from "./DeviceStatus";
import { AppList } from "./AppList";
import { ScreenTimeChart } from "./ScreenTimeChart";
import { BreakRequestForm } from "./BreakRequestForm";
import { StudentDevice, BreakRequest } from "./types";

export default function StudentDeviceClient() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: deviceData, isLoading } = useQuery({
    queryKey: ['/api/student/device'],
  });

  const { data: breakRequestsData } = useQuery({
    queryKey: ['/api/student/break-requests'],
  });

  // Mutations
  const appActionMutation = useMutation({
    mutationFn: async (action: { type: string; appId: string }) => {
      return apiRequest(`/api/student/apps/${action.appId}/${action.type}`, {
        method: 'POST'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/device'] });
    },
    onError: () => {
      toast({ title: "Action failed", variant: "destructive" });
    }
  });

  const breakRequestMutation = useMutation({
    mutationFn: async (request: { reason: string; duration: number }) => {
      return apiRequest('/api/student/break-requests', {
        method: 'POST',
        body: request
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/break-requests'] });
      toast({ title: "Break request submitted" });
    },
    onError: () => {
      toast({ title: "Failed to submit request", variant: "destructive" });
    }
  });

  const cancelRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return apiRequest(`/api/student/break-requests/${requestId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/student/break-requests'] });
      toast({ title: "Request cancelled" });
    }
  });

  // Handlers
  const handleLaunchApp = (appId: string) => {
    appActionMutation.mutate({ type: 'launch', appId });
  };

  const handleRequestUnblock = (appId: string) => {
    appActionMutation.mutate({ type: 'request-unblock', appId });
    toast({ title: "Unblock request sent to teacher" });
  };

  const handleSubmitBreakRequest = (request: { reason: string; duration: number }) => {
    breakRequestMutation.mutate(request);
  };

  const handleCancelRequest = (requestId: string) => {
    cancelRequestMutation.mutate(requestId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your device information...</p>
          </div>
        </div>
      </div>
    );
  }

  const device: StudentDevice = deviceData?.device;
  const breakRequests: BreakRequest[] = breakRequestsData?.requests || [];

  if (!device) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Device not found</h3>
          <p className="text-gray-600">Unable to load your device information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Device</h1>
          <p className="text-muted-foreground">
            Monitor your device usage and manage applications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Device Status */}
        <div className="lg:col-span-1">
          <DeviceStatus device={device} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="apps">Applications</TabsTrigger>
              <TabsTrigger value="screen-time">Screen Time</TabsTrigger>
              <TabsTrigger value="break-request">Break Request</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ScreenTimeChart screenTimeData={device.screenTime} />
                </div>
                <div>
                  <BreakRequestForm
                    onSubmitRequest={handleSubmitBreakRequest}
                    pendingRequests={breakRequests}
                    onCancelRequest={handleCancelRequest}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="apps">
              <AppList
                apps={device.apps}
                onLaunchApp={handleLaunchApp}
                onRequestUnblock={handleRequestUnblock}
              />
            </TabsContent>

            <TabsContent value="screen-time">
              <ScreenTimeChart screenTimeData={device.screenTime} />
            </TabsContent>

            <TabsContent value="break-request">
              <BreakRequestForm
                onSubmitRequest={handleSubmitBreakRequest}
                pendingRequests={breakRequests}
                onCancelRequest={handleCancelRequest}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}