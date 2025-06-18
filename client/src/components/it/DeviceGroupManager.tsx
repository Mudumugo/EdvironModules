import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Monitor,
  Laptop,
  Tablet,
  Smartphone,
  Users,
  Shield,
  MapPin,
  Plus,
  Settings,
  Play,
  Square,
  RotateCcw,
  Power,
  RefreshCw,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff
} from "lucide-react";

interface Device {
  id: string;
  name: string;
  type: 'desktop' | 'laptop' | 'tablet' | 'mobile';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  zone: string;
  user: string;
  ip: string;
  os: string;
  lastSeen: string;
  policies: string[];
  isLocked: boolean;
}

interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  devices: string[];
  zone: string;
  policies: string[];
  createdAt: string;
  isActive: boolean;
}

interface Zone {
  id: string;
  name: string;
  description: string;
  deviceCount: number;
  restrictions: string[];
}

interface Policy {
  id: string;
  name: string;
  description: string;
  rules: string[];
}

export default function DeviceGroupManager() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    name: '',
    description: '',
    zone: '',
    selectedDevices: [] as string[]
  });
  const [activeTab, setActiveTab] = useState('devices');
  const [examLockDuration, setExamLockDuration] = useState(180);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: devicesData, isLoading: devicesLoading } = useQuery({
    queryKey: ['/api/it/devices'],
  });

  const { data: groupsData, isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/it/device-groups'],
  });

  const { data: zonesData, isLoading: zonesLoading } = useQuery({
    queryKey: ['/api/it/zones'],
  });

  const { data: policiesData, isLoading: policiesLoading } = useQuery({
    queryKey: ['/api/it/policies'],
  });

  const devices: Device[] = devicesData?.devices || [];
  const groups: DeviceGroup[] = groupsData?.groups || [];
  const zones: Zone[] = zonesData?.zones || [];
  const policies: Policy[] = policiesData?.policies || [];

  // Mutations
  const createGroupMutation = useMutation({
    mutationFn: async (groupData: any) => {
      return await apiRequest('POST', '/api/it/device-groups', groupData);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Device group created successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/it/device-groups'] });
      setIsCreateGroupOpen(false);
      setNewGroupData({ name: '', description: '', zone: '', selectedDevices: [] });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Failed to create device group", variant: "destructive" });
    }
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, deviceIds, groupIds }: { action: string; deviceIds?: string[]; groupIds?: string[] }) => {
      return await apiRequest('POST', '/api/it/devices/bulk-action', { action, deviceIds, groupIds });
    },
    onSuccess: (data) => {
      toast({ title: "Success", description: data.message });
      queryClient.invalidateQueries({ queryKey: ['/api/it/devices'] });
      setSelectedDevices([]);
      setSelectedGroups([]);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to execute action", variant: "destructive" });
    }
  });

  const examLockMutation = useMutation({
    mutationFn: async ({ deviceIds, groupIds, lockDuration }: { deviceIds?: string[]; groupIds?: string[]; lockDuration: number }) => {
      return await apiRequest('POST', '/api/it/devices/exam-lock', { deviceIds, groupIds, lockDuration });
    },
    onSuccess: (data) => {
      toast({ title: "Exam Mode Activated", description: data.message });
      queryClient.invalidateQueries({ queryKey: ['/api/it/devices'] });
      setSelectedDevices([]);
      setSelectedGroups([]);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to activate exam mode", variant: "destructive" });
    }
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'laptop': return Laptop;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedDevices.length === 0 && selectedGroups.length === 0) {
      toast({ title: "No Selection", description: "Please select devices or groups first", variant: "destructive" });
      return;
    }
    bulkActionMutation.mutate({ action, deviceIds: selectedDevices, groupIds: selectedGroups });
  };

  const handleExamLock = () => {
    if (selectedDevices.length === 0 && selectedGroups.length === 0) {
      toast({ title: "No Selection", description: "Please select devices or groups first", variant: "destructive" });
      return;
    }
    examLockMutation.mutate({ deviceIds: selectedDevices, groupIds: selectedGroups, lockDuration: examLockDuration });
  };

  const handleCreateGroup = () => {
    if (!newGroupData.name || newGroupData.selectedDevices.length === 0) {
      toast({ title: "Invalid Input", description: "Please provide a name and select devices", variant: "destructive" });
      return;
    }
    createGroupMutation.mutate({
      name: newGroupData.name,
      description: newGroupData.description,
      zone: newGroupData.zone,
      devices: newGroupData.selectedDevices
    });
  };

  if (devicesLoading || groupsLoading || zonesLoading || policiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Device Group</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input
                    id="groupName"
                    value={newGroupData.name}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter group name"
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription">Description</Label>
                  <Textarea
                    id="groupDescription"
                    value={newGroupData.description}
                    onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter group description"
                  />
                </div>
                <div>
                  <Label htmlFor="groupZone">Zone</Label>
                  <Select value={newGroupData.zone} onValueChange={(value) => setNewGroupData(prev => ({ ...prev, zone: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map(zone => (
                        <SelectItem key={zone.id} value={zone.id}>{zone.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Select Devices</Label>
                  <div className="max-h-40 overflow-y-auto border rounded-md p-2 space-y-2">
                    {devices.map(device => (
                      <div key={device.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`new-group-${device.id}`}
                          checked={newGroupData.selectedDevices.includes(device.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setNewGroupData(prev => ({ ...prev, selectedDevices: [...prev.selectedDevices, device.id] }));
                            } else {
                              setNewGroupData(prev => ({ ...prev, selectedDevices: prev.selectedDevices.filter(id => id !== device.id) }));
                            }
                          }}
                        />
                        <label htmlFor={`new-group-${device.id}`} className="text-sm">{device.name}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={handleCreateGroup} className="w-full" disabled={createGroupMutation.isPending}>
                  {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bulk Actions */}
        {(selectedDevices.length > 0 || selectedGroups.length > 0) && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('restart')}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Restart
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('shutdown')}>
              <Power className="h-4 w-4 mr-1" />
              Shutdown
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleBulkAction('update-software')}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Update
            </Button>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={examLockDuration}
                onChange={(e) => setExamLockDuration(Number(e.target.value))}
                className="w-20"
                min="30"
                max="480"
              />
              <Button variant="destructive" size="sm" onClick={handleExamLock}>
                <Lock className="h-4 w-4 mr-1" />
                Exam Lock ({examLockDuration}m)
              </Button>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="devices">Individual Devices</TabsTrigger>
          <TabsTrigger value="groups">Device Groups</TabsTrigger>
          <TabsTrigger value="zones">Zone Management</TabsTrigger>
          <TabsTrigger value="policies">Policy Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map(device => {
              const DeviceIcon = getDeviceIcon(device.type);
              return (
                <Card key={device.id} className={`cursor-pointer transition-all ${selectedDevices.includes(device.id) ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => handleDeviceSelection(device.id)}
                        />
                        <DeviceIcon className="h-5 w-5" />
                        <div>
                          <CardTitle className="text-sm">{device.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">{device.user}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                        {device.isLocked && <Lock className="h-3 w-3 text-red-500" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Location:</span>
                        <span>{device.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">IP:</span>
                        <span>{device.ip}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">OS:</span>
                        <span>{device.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Zone:</span>
                        <Badge variant="outline" className="text-xs">
                          {zones.find(z => z.id === device.zone)?.name || device.zone}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground">Policies:</span>
                        <div className="flex flex-wrap gap-1">
                          {device.policies.slice(0, 2).map(policy => (
                            <Badge key={policy} variant="secondary" className="text-xs">
                              {policies.find(p => p.id === policy)?.name || policy}
                            </Badge>
                          ))}
                          {device.policies.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{device.policies.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(group => (
              <Card key={group.id} className={`cursor-pointer transition-all ${selectedGroups.includes(group.id) ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => handleGroupSelection(group.id)}
                      />
                      <Users className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-sm">{group.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{group.devices.length} devices</p>
                      </div>
                    </div>
                    <Badge variant={group.isActive ? "default" : "secondary"}>
                      {group.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs">
                    <p className="text-muted-foreground">{group.description}</p>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Zone:</span>
                      <Badge variant="outline" className="text-xs">
                        {zones.find(z => z.id === group.zone)?.name || group.zone}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Policies:</span>
                      <div className="flex flex-wrap gap-1">
                        {group.policies.slice(0, 2).map(policy => (
                          <Badge key={policy} variant="secondary" className="text-xs">
                            {policies.find(p => p.id === policy)?.name || policy}
                          </Badge>
                        ))}
                        {group.policies.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{group.policies.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(group.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map(zone => (
              <Card key={zone.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <CardTitle className="text-lg">{zone.name}</CardTitle>
                    </div>
                    <Badge variant="secondary">{zone.deviceCount} devices</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{zone.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Zone Restrictions:</h4>
                    <div className="space-y-1">
                      {zone.restrictions.map((restriction, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <Shield className="h-3 w-3 text-muted-foreground" />
                          <span>{restriction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policies.map(policy => (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <CardTitle className="text-lg">{policy.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{policy.description}</p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Policy Rules:</h4>
                    <div className="space-y-1">
                      {policy.rules.map((rule, index) => (
                        <div key={index} className="flex items-center space-x-2 text-xs">
                          <Settings className="h-3 w-3 text-muted-foreground" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selection Summary */}
      {(selectedDevices.length > 0 || selectedGroups.length > 0) && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="text-sm">
              <strong>Selection Summary:</strong>
              {selectedDevices.length > 0 && (
                <span className="ml-2">
                  {selectedDevices.length} device{selectedDevices.length !== 1 ? 's' : ''}
                </span>
              )}
              {selectedDevices.length > 0 && selectedGroups.length > 0 && <span>, </span>}
              {selectedGroups.length > 0 && (
                <span className="ml-2">
                  {selectedGroups.length} group{selectedGroups.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}