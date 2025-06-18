import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Users, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  GroupList, 
  GroupForm, 
  DeviceList, 
  GroupStats,
  DeviceGroup,
  Device,
  GroupFormData,
  GroupFormType
} from './modules';

// Additional types
interface AssignDeviceData {
  deviceIds: string[];
  groupId: string;
}

const GROUP_COLORS = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-800' },
  { value: 'green', label: 'Green', class: 'bg-green-100 text-green-800' },
  { value: 'red', label: 'Red', class: 'bg-red-100 text-red-800' },
  { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100 text-yellow-800' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-800' },
];

export default function DeviceGroupManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DeviceGroup | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [targetGroupId, setTargetGroupId] = useState<string>('');
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    color: 'blue'
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading: groupsLoading } = useQuery<DeviceGroup[]>({
    queryKey: ['/api/device-groups'],
    retry: false,
  });

  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
    retry: false,
  });

  const createGroupMutation = useMutation({
    mutationFn: async (groupData: GroupFormData) => {
      return apiRequest("POST", "/api/device-groups", groupData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-groups"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Group Created",
        description: "Device group has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateGroupMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<GroupFormData> }) => {
      return apiRequest("PUT", `/api/device-groups/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-groups"] });
      setEditingGroup(null);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Group Updated",
        description: "Device group has been updated successfully.",
      });
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/device-groups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-groups"] });
      toast({
        title: "Group Deleted",
        description: "Device group has been deleted successfully.",
      });
    }
  });

  const assignDevicesMutation = useMutation({
    mutationFn: async (assignData: AssignDeviceData) => {
      return apiRequest("POST", "/api/devices/assign-group", assignData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/device-groups"] });
      setIsAssignDialogOpen(false);
      setSelectedDevices([]);
      setTargetGroupId('');
      toast({
        title: "Devices Assigned",
        description: "Devices have been assigned to the group successfully.",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: 'blue'
    });
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a group name.",
        variant: "destructive",
      });
      return;
    }

    if (editingGroup) {
      updateGroupMutation.mutate({ id: editingGroup.id, data: formData });
    } else {
      createGroupMutation.mutate(formData);
    }
  };

  const handleEdit = (group: DeviceGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      color: group.color
    });
    setIsCreateDialogOpen(true);
  };

  const handleAssignDevices = () => {
    if (selectedDevices.length === 0 || !targetGroupId) {
      toast({
        title: "Missing Selection",
        description: "Please select devices and a target group.",
        variant: "destructive",
      });
      return;
    }

    assignDevicesMutation.mutate({
      deviceIds: selectedDevices,
      groupId: targetGroupId
    });
  };

  const handleDialogClose = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setEditingGroup(null);
      resetForm();
    }
  };

  const handleFormSubmit = (data: GroupFormData) => {
    if (editingGroup) {
      updateGroupMutation.mutate({ id: editingGroup.id, data });
    } else {
      createGroupMutation.mutate(data);
    }
  };

  const handleEditGroup = (group: DeviceGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      color: group.color
    });
    setIsCreateDialogOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    deleteGroupMutation.mutate(id);
  };

  const handleViewDevices = (groupId: string) => {
    setSelectedGroupId(groupId);
  };

  const handleMoveDevice = (deviceId: string, newGroupId: string) => {
    assignDevicesMutation.mutate({
      deviceIds: [deviceId],
      groupId: newGroupId
    });
  };

  const getColorClass = (color: string) => {
    return GROUP_COLORS.find(c => c.value === color)?.class || GROUP_COLORS[0].class;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Device Management</h1>
          <p className="text-muted-foreground">
            Organize and manage devices with groups and policies
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingGroup ? 'Edit Group' : 'Create New Group'}
              </DialogTitle>
              <DialogDescription>
                {editingGroup ? 'Update group information' : 'Create a new device group for organization'}
              </DialogDescription>
            </DialogHeader>
            <GroupForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsCreateDialogOpen(false)}
              editingGroup={editingGroup}
              isLoading={createGroupMutation.isPending || updateGroupMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <GroupStats 
        groups={groups} 
        devices={devices} 
        isLoading={groupsLoading} 
      />

      <Tabs defaultValue="groups" className="w-full">
        <TabsList>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Groups
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Devices
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="groups" className="space-y-4">
          <GroupList
            groups={groups}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
            onViewDevices={handleViewDevices}
            isLoading={groupsLoading}
          />
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <DeviceList
            devices={devices}
            groups={groups}
            onMoveDevice={handleMoveDevice}
            selectedGroupId={selectedGroupId}
            isLoading={groupsLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}