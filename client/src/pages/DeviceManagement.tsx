import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Smartphone, 
  Laptop, 
  Tablet, 
  Monitor, 
  Shield, 
  AlertTriangle, 
  MapPin, 
  Battery, 
  HardDrive,
  Clock,
  Wifi,
  Lock,
  Unlock,
  RotateCcw,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import Layout from "@/components/Layout";

interface Device {
  id: string;
  deviceName: string;
  deviceType: 'tablet' | 'laptop' | 'smartphone' | 'desktop';
  platform: string;
  osVersion: string;
  model: string;
  status: 'active' | 'inactive' | 'lost' | 'stolen' | 'wiped';
  lastSeen: string;
  batteryLevel: number;
  storageUsed: number;
  storageTotal: number;
  isCompliant: boolean;
  location: { lat: number; lng: number; accuracy: number };
  user: { name: string; email: string };
}

interface ComplianceViolation {
  id: number;
  deviceName: string;
  violationType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  detectedAt: string;
  status: 'open' | 'acknowledged' | 'resolved';
}

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'smartphone': return <Smartphone className="h-4 w-4" />;
    case 'tablet': return <Tablet className="h-4 w-4" />;
    case 'laptop': return <Laptop className="h-4 w-4" />;
    case 'desktop': return <Monitor className="h-4 w-4" />;
    default: return <Smartphone className="h-4 w-4" />;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  const variants = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    lost: "bg-red-100 text-red-800",
    stolen: "bg-red-100 text-red-800",
    wiped: "bg-orange-100 text-orange-800"
  };

  return (
    <Badge className={variants[status as keyof typeof variants] || variants.inactive}>
      {status}
    </Badge>
  );
};

const SeverityBadge = ({ severity }: { severity: string }) => {
  const variants = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800"
  };

  return (
    <Badge className={variants[severity as keyof typeof variants] || variants.low}>
      {severity}
    </Badge>
  );
};

export default function DeviceManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("all");

  // Mock data for development - replace with actual API calls
  const devices: Device[] = [
    {
      id: "device-1",
      deviceName: "Sarah's iPad",
      deviceType: "tablet",
      platform: "iOS",
      osVersion: "17.2",
      model: "iPad Pro 11-inch",
      status: "active",
      lastSeen: "2024-01-15T10:30:00Z",
      batteryLevel: 85,
      storageUsed: 32.5,
      storageTotal: 128,
      isCompliant: true,
      location: { lat: 40.7128, lng: -74.0060, accuracy: 10 },
      user: { name: "Sarah Johnson", email: "sarah.j@school.edu" }
    },
    {
      id: "device-2",
      deviceName: "Math Lab Laptop 05",
      deviceType: "laptop",
      platform: "Windows",
      osVersion: "11",
      model: "Dell Latitude 5520",
      status: "active",
      lastSeen: "2024-01-15T09:45:00Z",
      batteryLevel: 45,
      storageUsed: 180.2,
      storageTotal: 256,
      isCompliant: false,
      location: { lat: 40.7589, lng: -73.9851, accuracy: 5 },
      user: { name: "Michael Chen", email: "m.chen@school.edu" }
    },
    {
      id: "device-3",
      deviceName: "Teacher iPhone",
      deviceType: "smartphone",
      platform: "iOS",
      osVersion: "17.1",
      model: "iPhone 14",
      status: "lost",
      lastSeen: "2024-01-14T16:20:00Z",
      batteryLevel: 12,
      storageUsed: 45.8,
      storageTotal: 128,
      isCompliant: true,
      location: { lat: 40.7831, lng: -73.9712, accuracy: 50 },
      user: { name: "Emma Wilson", email: "e.wilson@school.edu" }
    }
  ];

  const violations: ComplianceViolation[] = [
    {
      id: 1,
      deviceName: "Math Lab Laptop 05",
      violationType: "Unauthorized App",
      severity: "high",
      description: "Gaming application detected during class hours",
      detectedAt: "2024-01-15T09:30:00Z",
      status: "open"
    },
    {
      id: 2,
      deviceName: "Sarah's iPad",
      violationType: "Screen Time Exceeded",
      severity: "medium",
      description: "Daily screen time limit exceeded by 2 hours",
      detectedAt: "2024-01-14T20:15:00Z",
      status: "acknowledged"
    }
  ];

  const stats = {
    totalDevices: devices.length,
    activeDevices: devices.filter(d => d.status === 'active').length,
    complianceIssues: devices.filter(d => !d.isCompliant).length,
    lostDevices: devices.filter(d => d.status === 'lost' || d.status === 'stolen').length
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesType = deviceTypeFilter === "all" || device.deviceType === deviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRemoteAction = (deviceId: string, action: string) => {
    console.log(`Performing ${action} on device ${deviceId}`);
    // Implement remote action logic
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">Monitor and manage all institutional devices</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDevices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeDevices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.complianceIssues}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lost/Stolen</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lostDevices}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="violations">Violations</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                    <SelectItem value="stolen">Stolen</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="tablet">Tablets</SelectItem>
                    <SelectItem value="laptop">Laptops</SelectItem>
                    <SelectItem value="smartphone">Phones</SelectItem>
                    <SelectItem value="desktop">Desktops</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Device List */}
            <div className="grid gap-4">
              {filteredDevices.map((device) => (
                <Card key={device.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <DeviceIcon type={device.deviceType} />
                        <div>
                          <h3 className="font-semibold">{device.deviceName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {device.user.name} • {device.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={device.status} />
                        {!device.isCompliant && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Non-compliant
                          </Badge>
                        )}
                        <div className="flex items-center space-x-2">
                          <Battery className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{device.batteryLevel}%</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <HardDrive className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {device.storageUsed}GB / {device.storageTotal}GB
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoteAction(device.id, 'locate')}
                          >
                            <MapPin className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoteAction(device.id, 'lock')}
                          >
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoteAction(device.id, 'wipe')}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Platform:</span>
                        <span className="ml-2">{device.platform} {device.osVersion}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Seen:</span>
                        <span className="ml-2">
                          {new Date(device.lastSeen).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <span className="ml-2">{device.user.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="violations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Violations</CardTitle>
                <CardDescription>
                  Recent policy violations and security issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violations.map((violation) => (
                    <Alert key={violation.id}>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{violation.deviceName}</span>
                              <SeverityBadge severity={violation.severity} />
                              <Badge variant="outline">{violation.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {violation.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Detected: {new Date(violation.detectedAt).toLocaleString()}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Resolve
                          </Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Policies</CardTitle>
                <CardDescription>
                  Configure and manage device policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Policy Management</h3>
                  <p className="text-muted-foreground mb-4">
                    Create and manage device policies for different user groups
                  </p>
                  <Button>Create New Policy</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Analytics</CardTitle>
                <CardDescription>
                  Usage patterns and security insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    View device usage patterns, security trends, and compliance reports
                  </p>
                  <Button>View Full Analytics</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}