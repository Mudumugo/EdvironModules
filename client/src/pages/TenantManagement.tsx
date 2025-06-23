import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Building, Server, Users, TrendingUp, AlertCircle, CheckCircle, Zap } from "lucide-react";

export default function TenantManagement() {
  const [tenants] = useState([
    {
      id: "school-001",
      name: "Greenwood High School",
      subdomain: "greenwood-high",
      subscriptionTier: "premium",
      region: "us-central1",
      status: "active",
      vmStatus: "running",
      users: 485,
      maxUsers: 500,
      storage: 75,
      maxStorage: 100,
      createdAt: "2024-09-15",
      lastActivity: "2025-06-23T12:30:00Z",
      vmSize: "e2-standard-2",
      dbSize: "db-custom-2-4096"
    },
    {
      id: "school-002", 
      name: "Riverside Elementary",
      subdomain: "riverside-elem",
      subscriptionTier: "standard",
      region: "us-east1",
      status: "active",
      vmStatus: "running",
      users: 185,
      maxUsers: 200,
      storage: 28,
      maxStorage: 50,
      createdAt: "2024-11-02",
      lastActivity: "2025-06-23T11:45:00Z",
      vmSize: "e2-medium",
      dbSize: "db-g1-small"
    },
    {
      id: "school-003",
      name: "Metro College Prep",
      subdomain: "metro-college",
      subscriptionTier: "enterprise",
      region: "us-west1",
      status: "active",
      vmStatus: "running",
      users: 1250,
      maxUsers: 2000,
      storage: 145,
      maxStorage: 200,
      createdAt: "2024-08-20",
      lastActivity: "2025-06-23T13:15:00Z",
      vmSize: "e2-standard-4",
      dbSize: "db-custom-4-8192"
    },
    {
      id: "school-004",
      name: "Pine Valley Academy",
      subdomain: "pine-valley",
      subscriptionTier: "basic",
      region: "us-central1",
      status: "provisioning",
      vmStatus: "starting",
      users: 0,
      maxUsers: 50,
      storage: 0,
      maxStorage: 20,
      createdAt: "2025-06-23",
      lastActivity: "2025-06-23T13:00:00Z",
      vmSize: "e2-small",
      dbSize: "db-f1-micro"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "provisioning": return "secondary";
      case "suspended": return "destructive";
      case "maintenance": return "outline";
      default: return "outline";
    }
  };

  const getVmStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-green-600";
      case "starting": return "text-yellow-600";
      case "stopped": return "text-red-600";
      case "maintenance": return "text-blue-600";
      default: return "text-gray-600";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "enterprise": return "default";
      case "premium": return "secondary";
      case "standard": return "outline";
      case "basic": return "outline";
      default: return "outline";
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Building className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Tenant Management</h1>
          <p className="text-muted-foreground">Manage school tenants and their infrastructure across all regions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">1 provisioning</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,920</div>
            <p className="text-xs text-muted-foreground">Across all tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">VMs deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Platform uptime</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenant Overview</TabsTrigger>
          <TabsTrigger value="provisioning">Provisioning</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="scaling">Auto-Scaling</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input placeholder="Search tenants..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="provisioning">Provisioning</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Provision New Tenant</Button>
          </div>

          <div className="grid gap-4">
            {tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{tenant.id}</Badge>
                      <Badge variant={getStatusColor(tenant.status)}>{tenant.status}</Badge>
                      <Badge variant={getTierColor(tenant.subscriptionTier)} className="capitalize">
                        {tenant.subscriptionTier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 ${getVmStatusColor(tenant.vmStatus)}`}>
                        <div className="w-2 h-2 rounded-full bg-current"></div>
                        <span className="text-sm capitalize">{tenant.vmStatus}</span>
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{tenant.name}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-4 text-sm">
                      <span>https://{tenant.subdomain}.edvirons.com</span>
                      <span>•</span>
                      <span>{tenant.region}</span>
                      <span>•</span>
                      <span>Created {new Date(tenant.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">User Capacity</div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(tenant.users / tenant.maxUsers) * 100} 
                          className="flex-1"
                        />
                        <span className={`text-sm font-medium ${getUsageColor((tenant.users / tenant.maxUsers) * 100)}`}>
                          {tenant.users} / {tenant.maxUsers}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Storage Usage</div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(tenant.storage / tenant.maxStorage) * 100} 
                          className="flex-1"
                        />
                        <span className={`text-sm font-medium ${getUsageColor((tenant.storage / tenant.maxStorage) * 100)}`}>
                          {tenant.storage}GB / {tenant.maxStorage}GB
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Infrastructure</div>
                      <div className="text-sm text-muted-foreground">
                        <div>VM: {tenant.vmSize}</div>
                        <div>DB: {tenant.dbSize}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Last Activity</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tenant.lastActivity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm" variant="outline">Scale Resources</Button>
                    <Button size="sm" variant="outline">Manage Apps</Button>
                    <Button size="sm" variant="outline">View Logs</Button>
                    {tenant.status === "active" && (
                      <Button size="sm" variant="outline" className="text-red-600">
                        Suspend
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="provisioning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Provision New Tenant</CardTitle>
              <CardDescription>Deploy isolated infrastructure for a new school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">School Name</label>
                  <Input placeholder="Enter school name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subdomain</label>
                  <Input placeholder="school-name" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subscription Tier</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (50 users)</SelectItem>
                      <SelectItem value="standard">Standard (200 users)</SelectItem>
                      <SelectItem value="premium">Premium (500 users)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (2000 users)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Region</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us-central1">US Central (Iowa)</SelectItem>
                      <SelectItem value="us-east1">US East (South Carolina)</SelectItem>
                      <SelectItem value="us-west1">US West (Oregon)</SelectItem>
                      <SelectItem value="europe-west1">Europe West (Belgium)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button>Provision Tenant</Button>
                <Button variant="outline">Save as Draft</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>CPU Usage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={68} className="w-20" />
                      <span className="text-sm font-medium">68%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Memory Usage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={74} className="w-20" />
                      <span className="text-sm font-medium">74%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Storage Usage</span>
                    <div className="flex items-center gap-2">
                      <Progress value={62} className="w-20" />
                      <span className="text-sm font-medium">62%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Network I/O</span>
                    <div className="flex items-center gap-2">
                      <Progress value={45} className="w-20" />
                      <span className="text-sm font-medium">45%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>All VMs operational</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Database connections healthy</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span>High storage usage detected</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>SSL certificates valid</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Avg Response Time</span>
                    <span className="font-medium">245ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime</span>
                    <span className="font-medium">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error Rate</span>
                    <span className="font-medium">0.02%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Sessions</span>
                    <span className="font-medium">1,247</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scaling" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Auto-Scaling Configuration</CardTitle>
                <CardDescription>Automatic resource scaling based on usage patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CPU Threshold</label>
                  <div className="flex items-center gap-2">
                    <Input value="80" className="w-20" />
                    <span className="text-sm text-muted-foreground">% to trigger scaling</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Memory Threshold</label>
                  <div className="flex items-center gap-2">
                    <Input value="85" className="w-20" />
                    <span className="text-sm text-muted-foreground">% to trigger scaling</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scale Down Delay</label>
                  <div className="flex items-center gap-2">
                    <Input value="15" className="w-20" />
                    <span className="text-sm text-muted-foreground">minutes</span>
                  </div>
                </div>
                <Button>Update Configuration</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scaling History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <div>Greenwood High scaled up</div>
                      <div className="text-muted-foreground">e2-medium → e2-standard-2</div>
                    </div>
                    <div className="text-muted-foreground">2h ago</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Zap className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <div>Metro College scaled down</div>
                      <div className="text-muted-foreground">e2-standard-8 → e2-standard-4</div>
                    </div>
                    <div className="text-muted-foreground">1d ago</div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <div className="flex-1">
                      <div>Riverside Elementary scaled up</div>
                      <div className="text-muted-foreground">e2-small → e2-medium</div>
                    </div>
                    <div className="text-muted-foreground">3d ago</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}