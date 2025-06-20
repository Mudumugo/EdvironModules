import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { DeviceList } from "./DeviceList";
import { GroupManager } from "./GroupManager";
import { DeviceActions } from "./DeviceActions";
import { Device, DeviceGroup, DeviceAction } from "./types";

export default function DeviceGroupManager() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('devices');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: devicesData, isLoading: devicesLoading } = useQuery({
    queryKey: ['/api/it/devices'],
  });

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/it/device-groups'],
  });

  // Mutations
  const deviceActionMutation = useMutation({
    mutationFn: async ({ action, deviceIds, options }: { action: string; deviceIds: string[]; options?: any }) => {
      return apiRequest(`/api/it/devices/action`, {
        method: 'POST',
        body: { action, deviceIds, options }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/it/devices'] });
      toast({ title: "Action completed successfully" });
    },
    onError: () => {
      toast({ title: "Action failed", variant: "destructive" });
    }
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: Partial<DeviceGroup>) => {
      return apiRequest('/api/it/device-groups', {
        method: 'POST',
        body: groupData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/it/device-groups'] });
      toast({ title: "Group created successfully" });
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({ groupId, updates }: { groupId: string; updates: Partial<DeviceGroup> }) => {
      return apiRequest(`/api/it/device-groups/${groupId}`, {
        method: 'PATCH',
        body: updates
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/it/device-groups'] });
      toast({ title: "Group updated successfully" });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return apiRequest(`/api/it/device-groups/${groupId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/it/device-groups'] });
      toast({ title: "Group deleted successfully" });
    }
  });

  // Handlers
  const handleDeviceAction = (action: string, deviceIds?: string[], options?: any) => {
    const targetDevices = deviceIds || selectedDevices;
    if (targetDevices.length === 0) {
      toast({ title: "No devices selected", variant: "destructive" });
      return;
    }

    deviceActionMutation.mutate({ action, deviceIds: targetDevices, options });
  };

  const handleCreateGroup = (groupData: Partial<DeviceGroup>) => {
    createGroupMutation.mutate(groupData);
  };

  const handleUpdateGroup = (groupId: string, updates: Partial<DeviceGroup>) => {
    updateGroupMutation.mutate({ groupId, updates });
  };

  const handleDeleteGroup = (groupId: string) => {
    deleteGroupMutation.mutate(groupId);
  };

  const handleGroupAction = (action: string, groupIds: string[]) => {
    // Get all device IDs from the selected groups
    const allDeviceIds = groupIds.flatMap(groupId => {
      const group = groupsData?.groups?.find((g: DeviceGroup) => g.id === groupId);
      return group?.deviceIds || [];
    });

    if (allDeviceIds.length === 0) {
      toast({ title: "No devices in selected groups", variant: "destructive" });
      return;
    }

    handleDeviceAction(action, allDeviceIds);
  };

  if (devicesLoading || groupsLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">
            Manage devices, create groups, and apply policies across your network
          </p>
        </div>
      </div>

      <DeviceActions
        selectedDevices={selectedDevices}
        onAction={handleDeviceAction}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <DeviceList
            devices={devicesData?.devices || []}
            selectedDevices={selectedDevices}
            onSelectionChange={setSelectedDevices}
            onDeviceAction={handleDeviceAction}
            onDeviceDetails={(device) => console.log('Device details:', device)}
          />
        </TabsContent>

        <TabsContent value="groups">
          <GroupManager
            groups={groupsData?.groups || []}
            devices={devicesData?.devices || []}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onGroupAction={handleGroupAction}
          />
        </TabsContent>

        <TabsContent value="policies">
          <div className="text-center py-12 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Policy Management</h3>
            <p>Policy management interface coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}