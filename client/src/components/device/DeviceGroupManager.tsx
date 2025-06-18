import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Users, Smartphone, Move } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  deviceCount: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupFormData {
  name: string;
  description: string;
  color: string;
}

interface AssignDeviceData {
  deviceIds: string[];
  groupId: string;
}

const GROUP_COLORS = [
  { value: "blue", label: "Blue", class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { value: "green", label: "Green", class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "red", label: "Red", class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { value: "purple", label: "Purple", class: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { value: "orange", label: "Orange", class: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" }
];

export default function DeviceGroupManager() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DeviceGroup | null>(null);
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

  const { data: devices = [] } = useQuery<any[]>({
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

  const getColorClass = (color: string) => {
    return GROUP_COLORS.find(c => c.value === color)?.class || GROUP_COLORS[0].class;
  };

  if (groupsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Device Groups</h3>
          <p className="text-sm text-muted-foreground">
            Organize devices into groups for easier management
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Move className="h-4 w-4 mr-2" />
                Assign Devices
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Devices to Group</DialogTitle>
                <DialogDescription>
                  Select devices and assign them to a group
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Devices</Label>
                  <div className="max-h-40 overflow-y-auto border rounded p-2">
                    {devices.map((device: any) => (
                      <div key={device.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          id={device.id}
                          checked={selectedDevices.includes(device.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDevices([...selectedDevices, device.id]);
                            } else {
                              setSelectedDevices(selectedDevices.filter(id => id !== device.id));
                            }
                          }}
                        />
                        <label htmlFor={device.id} className="text-sm">
                          {device.name} ({device.type})
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Group</Label>
                  <Select value={targetGroupId} onValueChange={setTargetGroupId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAssignDevices} disabled={assignDevicesMutation.isPending}>
                  Assign Devices
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { resetForm(); setEditingGroup(null); }}>
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
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Group Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter group name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter group description"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => setFormData({ ...formData, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {GROUP_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${color.class}`} />
                            <span>{color.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={createGroupMutation.isPending || updateGroupMutation.isPending}
                >
                  {editingGroup ? 'Update Group' : 'Create Group'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator />

      {groups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Groups Created</h3>
            <p className="text-muted-foreground mb-4">
              Create your first device group to organize and manage devices more effectively.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <Card key={group.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{group.name}</CardTitle>
                  <Badge className={getColorClass(group.color)}>
                    {group.deviceCount} devices
                  </Badge>
                </div>
                {group.description && (
                  <CardDescription className="text-sm">
                    {group.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                    <span>{group.deviceCount} devices</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(group)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteGroupMutation.mutate(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Created {new Date(group.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}