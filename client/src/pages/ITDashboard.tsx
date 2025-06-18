import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import DeviceGroupManager from "@/components/it/DeviceGroupManager";
import { RefreshCw } from "lucide-react";
import { SystemMetrics } from "@/components/it/types";
import {
  SystemMetricsOverview,
  PerformanceTab,
  InfrastructureTab,
  MaintenanceTab,
  SecurityTab,
  QuickActionsSection
} from "@/components/it/modules";

export default function ITDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/it/metrics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const mockMetrics: SystemMetrics = {
    serverStatus: {
      total: 15,
      online: 13,
      offline: 1,
      maintenance: 1
    },
    networkStatus: {
      bandwidth: 85.4,
      latency: 12,
      uptime: 99.7,
      connectedDevices: 247
    },
    storage: {
      total: 10240,
      used: 6847,
      available: 3393,
      backupStatus: "completed"
    },
    security: {
      threats: 2,
      updates: 5,
      vulnerabilities: 1,
      lastScan: "2 hours ago"
    },
    performance: {
      cpuUsage: 68,
      memoryUsage: 72,
      diskUsage: 67,
      networkLoad: 45
    }
  };

  const systemData = metrics || mockMetrics;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Operations Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage school technology infrastructure
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics Overview */}
      <SystemMetricsOverview systemData={systemData} />

      {/* Detailed Tabs */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="devices">Device Groups</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <PerformanceTab systemData={systemData} />
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-4">
          <InfrastructureTab />
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <MaintenanceTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <DeviceGroupManager />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <QuickActionsSection />
    </div>
  );
}