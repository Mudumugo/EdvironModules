import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
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
  Eye,
  Play,
  FileCheck,
  DollarSign,
  Calendar,
  TrendingUp,
  Scan,
  ShieldCheck,
  Ban,
  Download,
  Upload,
  Video,
  FileText,
  Book,
  Package,
  Music,
  CloudDownload,
  Zap,
  Globe
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch devices from API
  const { data: devices = [], isLoading: devicesLoading } = useQuery({
    queryKey: ['/api/mdm/devices'],
    queryFn: () => apiRequest('GET', '/api/mdm/devices').then(res => res.json())
  });

  // Fetch violations from API
  const { data: violationData = [], isLoading: violationsLoading } = useQuery({
    queryKey: ['/api/mdm/violations'],
    queryFn: () => apiRequest('GET', '/api/mdm/violations').then(res => res.json())
  });

  // Fetch policies from API
  const { data: policyData = [], isLoading: policiesLoading } = useQuery({
    queryKey: ['/api/mdm/policies'],
    queryFn: () => apiRequest('GET', '/api/mdm/policies').then(res => res.json())
  });

  // Fetch license data from API
  const { data: licenses = [], isLoading: licensesLoading } = useQuery({
    queryKey: ['/api/licenses'],
    queryFn: () => apiRequest('GET', '/api/licenses').then(res => res.json())
  });

  const { data: licenseViolations = [], isLoading: licenseViolationsLoading } = useQuery({
    queryKey: ['/api/licenses/violations'],
    queryFn: () => apiRequest('GET', '/api/licenses/violations').then(res => res.json())
  });

  const { data: softwareRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['/api/licenses/requests'],
    queryFn: () => apiRequest('GET', '/api/licenses/requests').then(res => res.json())
  });

  // Fetch media content and delivery data
  const { data: mediaContent = [], isLoading: mediaLoading } = useQuery({
    queryKey: ['/api/media/content'],
    queryFn: () => apiRequest('GET', '/api/media/content').then(res => res.json())
  });

  const { data: mediaAnalytics = {}, isLoading: mediaAnalyticsLoading } = useQuery({
    queryKey: ['/api/media/analytics'],
    queryFn: () => apiRequest('GET', '/api/media/analytics').then(res => res.json())
  });

  // Remote action mutation
  const remoteActionMutation = useMutation({
    mutationFn: async (data: { deviceId: string; action: string; parameters?: any }) => {
      const response = await apiRequest('POST', '/api/mdm/remote-action', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Remote Action Successful",
        description: "The device action was executed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mdm/devices'] });
    },
    onError: () => {
      toast({
        title: "Remote Action Failed",
        description: "Failed to execute the device action. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate stats from actual data
  const deviceStats = {
    totalDevices: devices.length,
    activeDevices: devices.filter((d: Device) => d.status === 'active').length,
    complianceIssues: devices.filter((d: Device) => !d.isCompliant).length,
    lostDevices: devices.filter((d: Device) => d.status === 'lost' || d.status === 'stolen').length
  };

  const filteredDevices = devices.filter((device: Device) => {
    const matchesSearch = device.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || device.status === statusFilter;
    const matchesType = deviceTypeFilter === "all" || device.deviceType === deviceTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleRemoteAction = (deviceId: string, action: string) => {
    remoteActionMutation.mutate({ deviceId, action });
  };

  if (devicesLoading) {
    return (
      <Layout>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">Monitor and manage all institutional devices with real-time surveillance</p>
        </div>

        {/* Stats Overview - Responsive Grid */}
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Devices</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold">{deviceStats.totalDevices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Active Devices</CardTitle>
              <Wifi className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-green-600">{deviceStats.activeDevices}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Compliance Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-orange-600">{deviceStats.complianceIssues}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Lost/Stolen</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-red-600">{deviceStats.lostDevices}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="devices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="devices" className="text-xs sm:text-sm">Devices</TabsTrigger>
            <TabsTrigger value="violations" className="text-xs sm:text-sm">Violations</TabsTrigger>
            <TabsTrigger value="policies" className="text-xs sm:text-sm">Policies</TabsTrigger>
            <TabsTrigger value="licenses" className="text-xs sm:text-sm">Licenses</TabsTrigger>
            <TabsTrigger value="media" className="text-xs sm:text-sm">Media</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-4">
            {/* Filters - Mobile Responsive */}
            <div className="flex flex-col gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search devices or users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
                <div className="flex items-center space-x-2 flex-1">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1 min-w-0">
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
                </div>
                <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
                  <SelectTrigger className="flex-1 min-w-0">
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

            {/* Device List - Mobile Responsive */}
            <div className="grid gap-4">
              {filteredDevices.map((device: Device) => (
                <Card key={device.id}>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <DeviceIcon type={device.deviceType} />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{device.deviceName}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground truncate">
                            {device.user.name} • {device.model}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <StatusBadge status={device.status} />
                          {!device.isCompliant && (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Non-compliant
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end space-x-4">
                          <div className="flex items-center space-x-2">
                            <Battery className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <span className="text-xs sm:text-sm">{device.batteryLevel}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <HardDrive className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                            <span className="text-xs sm:text-sm">
                              {device.storageUsed}GB / {device.storageTotal}GB
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1 justify-center sm:justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoteAction(device.id, 'locate')}
                            disabled={remoteActionMutation.isPending}
                            className="flex-1 sm:flex-initial"
                          >
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="ml-1 text-xs sm:hidden">Locate</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoteAction(device.id, 'lock')}
                            disabled={remoteActionMutation.isPending}
                            className="flex-1 sm:flex-initial"
                          >
                            <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="ml-1 text-xs sm:hidden">Lock</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoteAction(device.id, 'wipe')}
                            disabled={remoteActionMutation.isPending}
                            className="flex-1 sm:flex-initial"
                          >
                            <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="ml-1 text-xs sm:hidden">Wipe</span>
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
                  Real-time policy violations and security incidents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {violationData.map((violation: ComplianceViolation) => (
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
                  Active surveillance and control policies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {policyData.map((policy: any) => (
                    <Card key={policy.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{policy.name}</h3>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{policy.policyType}</Badge>
                              <Badge className={policy.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                                {policy.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="licenses" className="space-y-4">
            {/* License Overview Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{licenses.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Across all software vendors
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">License Value</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${licenses.reduce((sum: number, license: any) => sum + (license.cost || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total investment value
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{licenseViolations.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Active violations
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {softwareRequests.filter((req: any) => req.status === 'pending').length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* License Management Actions */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Software License Portfolio</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    apiRequest('POST', '/api/licenses/compliance/scan', {}).then(() => {
                      toast({
                        title: "Compliance Scan Initiated",
                        description: "Full license compliance audit is now running.",
                      });
                    });
                  }}
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Run Compliance Scan
                </Button>
                <Button>
                  <FileCheck className="h-4 w-4 mr-2" />
                  Request Software
                </Button>
              </div>
            </div>

            {/* License Inventory */}
            <div className="grid gap-4">
              {licenses.map((license: any) => (
                <Card key={license.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <ShieldCheck className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-semibold">{license.softwareName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {license.vendor} • {license.licenseType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge className={
                          license.complianceStatus === 'compliant' ? "bg-green-100 text-green-800" :
                          license.complianceStatus === 'over_licensed' ? "bg-red-100 text-red-800" :
                          license.complianceStatus === 'expired' ? "bg-gray-100 text-gray-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {license.complianceStatus.replace('_', ' ')}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {license.usedSeats} / {license.totalSeats} seats
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {license.availableSeats} available
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">${license.cost?.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {license.expirationDate ? 
                              `Expires ${new Date(license.expirationDate).toLocaleDateString()}` : 
                              'Perpetual'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* License utilization bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>License Utilization</span>
                        <span>{Math.round((license.usedSeats / license.totalSeats) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            license.usedSeats > license.totalSeats ? 'bg-red-600' :
                            license.usedSeats / license.totalSeats > 0.8 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={{ width: `${Math.min((license.usedSeats / license.totalSeats) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Usage Analytics
                      </Button>
                      {license.complianceStatus !== 'compliant' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            apiRequest('POST', '/api/licenses/enforce', {
                              licenseId: license.id,
                              action: 'block_usage',
                              deviceIds: ['device-001', 'device-002']
                            }).then(() => {
                              toast({
                                title: "License Enforcement Initiated",
                                description: "Compliance actions are being applied to affected devices.",
                              });
                            });
                          }}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Enforce Compliance
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* License Violations */}
            <Card>
              <CardHeader>
                <CardTitle>License Compliance Violations</CardTitle>
                <CardDescription>
                  Critical issues requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {licenseViolations.map((violation: any) => (
                    <Alert key={violation.id} className={
                      violation.severity === 'critical' ? 'border-red-500 bg-red-50' :
                      violation.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                      'border-yellow-500 bg-yellow-50'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{violation.softwareName}</span>
                              <SeverityBadge severity={violation.severity} />
                              <Badge variant="outline">{violation.status}</Badge>
                              {violation.estimatedCost > 0 && (
                                <Badge className="bg-red-100 text-red-800">
                                  Risk: ${violation.estimatedCost.toLocaleString()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {violation.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Device: {violation.deviceName} • Detected: {new Date(violation.detectedAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Investigate
                            </Button>
                            <Button size="sm">
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Software Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Software License Requests</CardTitle>
                <CardDescription>
                  Pending and recent software acquisition requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {softwareRequests.map((request: any) => (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{request.softwareName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Requested by {request.requesterName} • {request.requestType.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.justification}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={
                            request.status === 'approved' ? "bg-green-100 text-green-800" :
                            request.status === 'pending' ? "bg-yellow-100 text-yellow-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {request.status}
                          </Badge>
                          <Badge variant="outline">
                            ${request.estimatedCost?.toLocaleString()}
                          </Badge>
                          <Badge variant="outline">
                            {request.urgency}
                          </Badge>
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Reject
                          </Button>
                          <Button size="sm">
                            Approve
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            {/* Media Delivery Overview Stats - Mobile Responsive */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Content Library</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{mediaAnalytics.contentLibrary?.totalContent || 247}</div>
                  <p className="text-xs text-muted-foreground">
                    {(mediaAnalytics.contentLibrary?.totalSize || 15.8).toLocaleString()} GB total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Daily Deliveries</CardTitle>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{mediaAnalytics.delivery?.dailyDeliveries || 142}</div>
                  <p className="text-xs text-muted-foreground">
                    {mediaAnalytics.delivery?.successRate || 94.8}% success rate
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Bandwidth Usage</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{mediaAnalytics.network?.currentUsage || 342} Mbps</div>
                  <p className="text-xs text-muted-foreground">
                    of {mediaAnalytics.network?.totalBandwidthAvailable || 1000} Mbps available
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Active Users</CardTitle>
                  <Globe className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">{mediaAnalytics.usage?.activeUsers || 1247}</div>
                  <p className="text-xs text-muted-foreground">
                    Accessing content now
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Distribution Actions - Mobile Responsive */}
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
              <h3 className="text-lg sm:text-xl font-semibold">EdVirons Media Delivery System</h3>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    apiRequest('POST', '/api/media/distribute', {
                      contentId: 1,
                      targetDevices: filteredDevices.map((d: Device) => d.id),
                      deliveryMethod: 'download',
                      priority: 8
                    }).then(() => {
                      toast({
                        title: "Content Distribution Initiated",
                        description: `Distributing content to ${filteredDevices.length} devices.`,
                      });
                    });
                  }}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Distribute Content</span>
                </Button>
                <Button className="w-full sm:w-auto">
                  <CloudDownload className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Sync All Devices</span>
                </Button>
              </div>
            </div>

            {/* Content Library */}
            <Card>
              <CardHeader>
                <CardTitle>Content Library</CardTitle>
                <CardDescription>
                  Educational content available for distribution across managed devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mediaContent.map((content: any) => {
                    const ContentIcon = content.contentType === 'video' ? Video :
                                       content.contentType === 'document' ? FileText :
                                       content.contentType === 'ebook' ? Book :
                                       content.contentType === 'audio' ? Music :
                                       Package;
                    
                    return (
                      <Card key={content.id}>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-start space-x-3 sm:space-x-4 min-w-0 flex-1">
                              <ContentIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 flex-shrink-0 mt-1" />
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-sm sm:text-base truncate">{content.contentName}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                  {content.subject} • {content.gradeLevel} • {content.format.toUpperCase()}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 sm:line-clamp-1">
                                  {content.description}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between sm:justify-end sm:flex-col sm:items-end space-x-4 sm:space-x-0 sm:space-y-2">
                              <div className="flex flex-col sm:text-right">
                                <div className="text-xs sm:text-sm font-medium">{content.fileSize} MB</div>
                                <div className="text-xs text-muted-foreground">
                                  {content.duration ? `${Math.floor(content.duration / 60)}m ${content.duration % 60}s` : 'Document'}
                                </div>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Badge className={
                                  content.syncStatus === 'synced' ? "bg-green-100 text-green-800" :
                                  content.syncStatus === 'pending' ? "bg-yellow-100 text-yellow-800" :
                                  "bg-gray-100 text-gray-800"
                                }>
                                  {content.syncStatus}
                                </Badge>
                                <Badge className={
                                  content.isRestricted ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                                }>
                                  {content.contentRating}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          {/* Content distribution controls - Mobile Responsive */}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 sm:flex-initial min-w-0"
                              onClick={() => {
                                apiRequest('POST', '/api/media/distribute', {
                                  contentId: content.id,
                                  targetDevices: filteredDevices.slice(0, 5).map((d: Device) => d.id),
                                  deliveryMethod: 'download',
                                  priority: 5
                                }).then(() => {
                                  toast({
                                    title: "Content Distribution Started",
                                    description: `Distributing "${content.contentName}" to selected devices.`,
                                  });
                                });
                              }}
                            >
                              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="text-xs sm:text-sm">Push</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1 sm:flex-initial min-w-0"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                              <span className="text-xs sm:text-sm">Analytics</span>
                            </Button>
                            {content.syncStatus !== 'synced' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="flex-1 sm:flex-initial min-w-0"
                                onClick={() => {
                                  apiRequest('POST', `/api/media/sync/${filteredDevices[0]?.id}`, {
                                    contentIds: [content.id],
                                    syncPriority: 8
                                  }).then(() => {
                                    toast({
                                      title: "Content Sync Initiated",
                                      description: `Syncing "${content.contentName}" across devices.`,
                                    });
                                  });
                                }}
                              >
                                <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                <span className="text-xs sm:text-sm">Sync</span>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Content by Type Distribution */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Content Distribution by Type</CardTitle>
                  <CardDescription>
                    Breakdown of content library by media type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mediaAnalytics.contentLibrary?.contentByType || {}).map(([type, count]) => {
                      const ContentIcon = type === 'video' ? Video :
                                         type === 'document' ? FileText :
                                         type === 'ebook' ? Book :
                                         type === 'audio' ? Music :
                                         Package;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ContentIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{type}</span>
                          </div>
                          <Badge variant="outline">{count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Performance</CardTitle>
                  <CardDescription>
                    Real-time delivery network status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bandwidth Utilization</span>
                        <span>{Math.round(((mediaAnalytics.network?.currentUsage || 0) / (mediaAnalytics.network?.totalBandwidthAvailable || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.round(((mediaAnalytics.network?.currentUsage || 0) / (mediaAnalytics.network?.totalBandwidthAvailable || 1)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current:</span>
                        <span className="ml-2 font-medium">{mediaAnalytics.network?.currentUsage || 0} Mbps</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Peak:</span>
                        <span className="ml-2 font-medium">{mediaAnalytics.network?.peakUsage || 0} Mbps</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Efficiency:</span>
                        <span className="ml-2 font-medium">{mediaAnalytics.network?.efficiency || 0}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg Speed:</span>
                        <span className="ml-2 font-medium">{mediaAnalytics.delivery?.averageSpeed || 0} Mbps</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Content Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Top Content Usage</CardTitle>
                <CardDescription>
                  Most accessed educational content across the institution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(mediaAnalytics.usage?.topContent || []).map((content: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{content.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {content.views} views • {content.downloads} downloads
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{content.views} views</Badge>
                        <Button variant="outline" size="sm">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Device Analytics & Surveillance</CardTitle>
                <CardDescription>
                  Real-time monitoring and behavioral analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    View comprehensive device usage patterns, security trends, compliance reports, and behavioral analytics
                  </p>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    View Full Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}