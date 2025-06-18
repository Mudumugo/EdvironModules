import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Monitor, 
  Users, 
  Plus, 
  Settings, 
  Shield, 
  Lock, 
  MapPin, 
  Network, 
  Smartphone,
  Laptop,
  Tablet,
  Wifi,
  AlertTriangle,
  CheckCircle,
  Play,
  Square,
  RotateCcw,
  Globe,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Clock
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

export default function DeviceGroupManager() {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [bulkAction, setBulkAction] = useState("");
  const [filterZone, setFilterZone] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: devicesData } = useQuery({
    queryKey: ["/api/it/devices"],
    refetchInterval: 5000,
  });

  const { data: groupsData } = useQuery({
    queryKey: ["/api/it/device-groups"],
  });

  const { data: zonesData } = useQuery({
    queryKey: ["/api/it/zones"],
  });

  const { data: policiesData } = useQuery({
    queryKey: ["/api/it/policies"],
  });

  const createGroupMutation = useMutation({
    mutationFn: async (data: any) =>
      apiRequest("POST", "/api/it/device-groups", data),
    onSuccess: () => {
      toast({
        title: "Group Created",
        description: "Device group has been created successfully.",
      });
      setNewGroupName("");
      setNewGroupDescription("");
      setSelectedDevices([]);
      queryClient.invalidateQueries({ queryKey: ["/api/it/device-groups"] });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async (data: any) =>
      apiRequest("POST", "/api/it/devices/bulk-action", data),
    onSuccess: (_, variables) => {
      toast({
        title: "Bulk Action Complete",
        description: `${variables.action} applied to ${variables.targets.length} device(s).`,
      });
      setSelectedDevices([]);
      setSelectedGroups([]);
      queryClient.invalidateQueries({ queryKey: ["/api/it/devices"] });
    },
  });

  const examLockMutation = useMutation({
    mutationFn: async (data: any) =>
      apiRequest("POST", "/api/it/devices/exam-lock", data),
    onSuccess: () => {
      toast({
        title: "Exam Mode Activated",
        description: "Selected devices have been locked for examination.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/it/devices"] });
    },
  });

  const devices: Device[] = devicesData?.devices || [];
  const groups: DeviceGroup[] = groupsData?.groups || [];
  const zones: Zone[] = zonesData?.zones || [];
  const policies = policiesData?.policies || [];

  const filteredDevices = devices.filter(device => {
    const zoneMatch = filterZone === "all" || device.zone === filterZone;
    const statusMatch = filterStatus === "all" || device.status === filterStatus;
    return zoneMatch && statusMatch;
  });

  const handleDeviceSelect = (deviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedDevices([...selectedDevices, deviceId]);
    } else {
      setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
    }
  };

  const handleGroupSelect = (groupId: string, checked: boolean) => {
    if (checked) {
      setSelectedGroups([...selectedGroups, groupId]);
    } else {
      setSelectedGroups(selectedGroups.filter(id => id !== groupId));
    }
  };

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(device => device.id));
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedDevices.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please provide a group name and select devices.",
        variant: "destructive",
      });
      return;
    }

    createGroupMutation.mutate({
      name: newGroupName,
      description: newGroupDescription,
      devices: selectedDevices,
      zone: selectedZone,
    });
  };

  const handleBulkAction = () => {
    const targets = [...selectedDevices, ...selectedGroups];
    if (targets.length === 0 || !bulkAction) {
      toast({
        title: "Invalid Selection",
        description: "Please select devices/groups and an action.",
        variant: "destructive",
      });
      return;
    }

    bulkActionMutation.mutate({
      action: bulkAction,
      targets,
      deviceIds: selectedDevices,
      groupIds: selectedGroups,
    });
  };

  const handleExamLock = () => {
    if (selectedDevices.length === 0 && selectedGroups.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select devices or groups for exam mode.",
        variant: "destructive",
      });
      return;
    }

    examLockMutation.mutate({
      deviceIds: selectedDevices,
      groupIds: selectedGroups,
      lockDuration: 180, // 3 hours default
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return <Monitor className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Device Group Management</h2>
          <p className="text-muted-foreground">Organize devices into groups for bulk operations</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Device Group</DialogTitle>
                <DialogDescription>
                  Group devices together for easier management and bulk operations.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input
                    id="group-name"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Computer Lab A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Input
                    id="group-description"
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Optional description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone-select">Zone</Label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Selected Devices: {selectedDevices.length}</Label>
                  <p className="text-sm text-muted-foreground">
                    Select devices from the main view before creating the group.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateGroup} disabled={createGroupMutation.isPending}>
                  {createGroupMutation.isPending ? "Creating..." : "Create Group"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {(selectedDevices.length > 0 || selectedGroups.length > 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedDevices.length + selectedGroups.length} selected
              </span>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apply-policy">Apply Policy</SelectItem>
                  <SelectItem value="restart">Restart Devices</SelectItem>
                  <SelectItem value="shutdown">Shutdown Devices</SelectItem>
                  <SelectItem value="update-software">Update Software</SelectItem>
                  <SelectItem value="clear-cache">Clear Cache</SelectItem>
                  <SelectItem value="enable-monitoring">Enable Monitoring</SelectItem>
                  <SelectItem value="disable-monitoring">Disable Monitoring</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleBulkAction} disabled={bulkActionMutation.isPending}>
                {bulkActionMutation.isPending ? "Applying..." : "Apply Action"}
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleExamLock}
                disabled={examLockMutation.isPending}
              >
                <Lock className="mr-2 h-4 w-4" />
                {examLockMutation.isPending ? "Locking..." : "Exam Lock"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="zones">Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label>Zone:</Label>
                  <Select value={filterZone} onValueChange={setFilterZone}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      {zones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id}>
                          {zone.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Status:</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" onClick={handleSelectAll}>
                  {selectedDevices.length === filteredDevices.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Devices List */}
          <div className="grid gap-4">
            {filteredDevices.map((device) => (
              <Card key={device.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedDevices.includes(device.id)}
                        onCheckedChange={(checked) => 
                          handleDeviceSelect(device.id, checked as boolean)
                        }
                      />
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.type)}
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)}`} />
                      </div>
                      <div>
                        <h4 className="font-medium">{device.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {device.user} • {device.location} • {device.ip}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{device.zone}</Badge>
                      <Badge variant={device.isLocked ? "destructive" : "secondary"}>
                        {device.isLocked ? "Locked" : "Active"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <div className="grid gap-4">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={(checked) => 
                          handleGroupSelect(group.id, checked as boolean)
                        }
                      />
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{group.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {group.description} • {group.devices.length} devices
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{group.zone}</Badge>
                      <Badge variant={group.isActive ? "default" : "secondary"}>
                        {group.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <Card key={zone.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {zone.name}
                  </CardTitle>
                  <CardDescription>{zone.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Devices:</span>
                      <span className="font-medium">{zone.deviceCount}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-sm text-muted-foreground">Restrictions:</span>
                      <div className="flex flex-wrap gap-1">
                        {zone.restrictions.map((restriction, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {restriction}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}