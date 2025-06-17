import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Upload, RefreshCw } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useXapiPageTracking } from "@/lib/xapi/xapiHooks";
import DeviceGrid from "@/components/device/DeviceGrid";
import DeviceFilters from "@/components/device/DeviceFilters";
import DeviceStats from "@/components/device/DeviceStats";

export default function DeviceManagement() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    type: "all",
    location: "all"
  });
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Track page view with xAPI
  useXapiPageTracking("Device Management", "device-management");

  const { data: deviceData, isLoading: devicesLoading, refetch } = useQuery({
    queryKey: ['/api/devices', filters]
  });

  const { data: deviceStats } = useQuery({
    queryKey: ['/api/devices/stats']
  });

  const deviceActionMutation = useMutation({
    mutationFn: async ({ deviceId, action }: { deviceId: string; action: string }) => {
      return await apiRequest("POST", `/api/devices/${deviceId}/action`, { action });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/devices/stats'] });
      toast({
        title: "Action Completed",
        description: `Device action "${variables.action}" completed successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: "Failed to perform device action. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleDeviceAction = (deviceId: string, action: string) => {
    deviceActionMutation.mutate({ deviceId, action });
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Mock data for development
  const devices = deviceData?.devices || [
    {
      id: "dev-001",
      name: "Student Laptop 001",
      type: "laptop",
      status: "active",
      location: "Classroom A",
      batteryLevel: 85,
      lastSeen: "2 minutes ago",
      isOnline: true,
      restrictions: ["social-media", "games"]
    },
    {
      id: "dev-002",
      name: "Student Tablet 002",
      type: "tablet",
      status: "restricted",
      location: "Library",
      batteryLevel: 45,
      lastSeen: "1 hour ago",
      isOnline: false,
      restrictions: ["web-browsing", "apps"]
    },
    {
      id: "dev-003",
      name: "Teacher Laptop",
      type: "laptop",
      status: "active",
      location: "Classroom B",
      batteryLevel: 92,
      lastSeen: "Online now",
      isOnline: true,
      restrictions: []
    }
  ];

  const stats = deviceStats || {
    total: 156,
    online: 142,
    offline: 14,
    active: 128,
    restricted: 18,
    maintenance: 8,
    batteryLow: 12,
    lastUpdate: "2 minutes ago"
  };

  if (devicesLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Device Management</h1>
          <p className="text-muted-foreground">Monitor and control student devices across your institution</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">All Devices</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DeviceStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest device management actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Device locked: Student Tablet 015</div>
                      <div className="text-sm text-muted-foreground">Policy violation detected</div>
                    </div>
                    <div className="text-sm text-muted-foreground">2 min ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">App installation blocked</div>
                      <div className="text-sm text-muted-foreground">Unauthorized game installation attempt</div>
                    </div>
                    <div className="text-sm text-muted-foreground">5 min ago</div>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Device registered: Student Laptop 157</div>
                      <div className="text-sm text-muted-foreground">New device added to management</div>
                    </div>
                    <div className="text-sm text-muted-foreground">1 hour ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Violations</CardTitle>
                <CardDescription>Devices requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg">
                    <div>
                      <div className="font-medium text-red-600">Critical: Unauthorized access attempt</div>
                      <div className="text-sm text-muted-foreground">Student Tablet 008 • Library</div>
                    </div>
                    <Button size="sm" variant="destructive">Action Required</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-yellow-200 rounded-lg">
                    <div>
                      <div className="font-medium text-yellow-600">Warning: App usage exceeded</div>
                      <div className="text-sm text-muted-foreground">Student Laptop 034 • Classroom C</div>
                    </div>
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-orange-200 rounded-lg">
                    <div>
                      <div className="font-medium text-orange-600">Info: Battery critically low</div>
                      <div className="text-sm text-muted-foreground">Student Tablet 021 • Home</div>
                    </div>
                    <Button size="sm" variant="outline">Notify</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Filters</CardTitle>
              <CardDescription>Filter and search your managed devices</CardDescription>
            </CardHeader>
            <CardContent>
              <DeviceFilters onFiltersChange={handleFiltersChange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Managed Devices</CardTitle>
                  <CardDescription>
                    {devices.length} devices found
                  </CardDescription>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {stats.lastUpdate}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DeviceGrid 
                devices={devices} 
                onDeviceAction={handleDeviceAction}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Policies</CardTitle>
              <CardDescription>Manage access controls and restrictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Policy management interface coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Reports</CardTitle>
              <CardDescription>Usage analytics and compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Reporting dashboard under development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}