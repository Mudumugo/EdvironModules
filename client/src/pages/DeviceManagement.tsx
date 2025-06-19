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
import DevicePolicies from "@/components/device/DevicePolicies";
import AddDeviceDialog from "@/components/device/AddDeviceDialog";
import DeviceGroupManager from "@/components/device/DeviceGroupManager";

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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
    queryClient.invalidateQueries({ queryKey: ["/api/devices/stats"] });
    queryClient.invalidateQueries({ queryKey: ["/api/device-groups"] });
    toast({
      title: "Refreshed",
      description: "Device data has been refreshed successfully.",
    });
  };

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
  const mockDevices = [
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

  const devices = mockDevices;

  const stats = {
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
    <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Device Management</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Monitor and control student devices across your institution</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => refetch()} className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 lg:w-auto">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
            <TabsTrigger value="devices" className="text-xs sm:text-sm">Devices</TabsTrigger>
            <TabsTrigger value="groups" className="text-xs sm:text-sm">Groups</TabsTrigger>
            <TabsTrigger value="policies" className="text-xs sm:text-sm">Policies</TabsTrigger>
            <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Settings</TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-2">
            <AddDeviceDialog onDeviceAdded={handleRefresh} />
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Export Data</span>
            </Button>
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Import</span>
              <span className="sm:hidden">Import Data</span>
            </Button>
            <Button size="sm" onClick={handleRefresh} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh Data</span>
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <DeviceStats stats={stats} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
                <CardDescription className="text-sm">Latest device management actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">Device locked: Student Tablet 015</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Policy violation detected</div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">2 min ago</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">App installation blocked</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Unauthorized game installation attempt</div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">5 min ago</div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">Device registered: Student Laptop 157</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">New device added to management</div>
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">1 hour ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Policy Violations</CardTitle>
                <CardDescription className="text-sm">Devices requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-red-200 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-red-600 text-sm sm:text-base truncate">Critical: Unauthorized access attempt</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Student Tablet 008 • Library</div>
                    </div>
                    <Button size="sm" variant="destructive" className="w-full sm:w-auto">Action Required</Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-yellow-200 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-yellow-600 text-sm sm:text-base truncate">Warning: App usage exceeded</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Student Laptop 034 • Classroom C</div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">Review</Button>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-orange-200 rounded-lg space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-orange-600 text-sm sm:text-base truncate">Info: Battery critically low</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Student Tablet 021 • Home</div>
                    </div>
                    <Button size="sm" variant="outline" className="w-full sm:w-auto">Notify</Button>
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
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                <div>
                  <CardTitle className="text-base sm:text-lg">Managed Devices</CardTitle>
                  <CardDescription className="text-sm">
                    {devices.length} devices found
                  </CardDescription>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Last updated: {new Date().toLocaleString()}
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

        <TabsContent value="groups" className="space-y-6">
          <DeviceGroupManager />
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <DevicePolicies />
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