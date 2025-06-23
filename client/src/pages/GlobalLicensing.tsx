import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { CreditCard, Building, Users, TrendingUp, AlertTriangle } from "lucide-react";

export default function GlobalLicensing() {
  const [licenses] = useState([
    {
      id: "LIC-001",
      name: "Microsoft Office 365 Education",
      provider: "Microsoft",
      licenseType: "software",
      totalSeats: 1000,
      usedSeats: 750,
      costPerSeat: 5.00,
      billingCycle: "annual",
      expiresAt: "2025-12-31",
      isActive: true
    },
    {
      id: "LIC-002", 
      name: "Adobe Creative Cloud Education",
      provider: "Adobe",
      licenseType: "software",
      totalSeats: 500,
      usedSeats: 425,
      costPerSeat: 12.99,
      billingCycle: "monthly",
      expiresAt: "2025-08-15",
      isActive: true
    },
    {
      id: "LIC-003",
      name: "Khan Academy Premium Content",
      provider: "Khan Academy",
      licenseType: "content",
      totalSeats: 2000,
      usedSeats: 1850,
      costPerSeat: 2.50,
      billingCycle: "annual",
      expiresAt: "2025-09-30",
      isActive: true
    }
  ]);

  const [tenantAllocations] = useState([
    {
      tenantId: "school-001",
      tenantName: "Greenwood High School",
      subscriptionTier: "premium",
      allocations: [
        { licenseId: "LIC-001", licenseName: "Microsoft Office 365", allocatedSeats: 300, usedSeats: 285 },
        { licenseId: "LIC-002", licenseName: "Adobe Creative Cloud", allocatedSeats: 150, usedSeats: 142 },
        { licenseId: "LIC-003", licenseName: "Khan Academy Premium", allocatedSeats: 800, usedSeats: 750 }
      ]
    },
    {
      tenantId: "school-002",
      tenantName: "Riverside Elementary", 
      subscriptionTier: "standard",
      allocations: [
        { licenseId: "LIC-001", licenseName: "Microsoft Office 365", allocatedSeats: 200, usedSeats: 180 },
        { licenseId: "LIC-003", licenseName: "Khan Academy Premium", allocatedSeats: 500, usedSeats: 480 }
      ]
    },
    {
      tenantId: "school-003",
      tenantName: "Metro College Prep",
      subscriptionTier: "enterprise", 
      allocations: [
        { licenseId: "LIC-001", licenseName: "Microsoft Office 365", allocatedSeats: 250, usedSeats: 235 },
        { licenseId: "LIC-002", licenseName: "Adobe Creative Cloud", allocatedSeats: 275, usedSeats: 260 },
        { licenseId: "LIC-003", licenseName: "Khan Academy Premium", allocatedSeats: 700, usedSeats: 620 }
      ]
    }
  ]);

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 80) return "text-yellow-600";
    return "text-green-600";
  };

  const getUsageProgress = (used: number, total: number) => {
    return (used / total) * 100;
  };

  const getTotalCost = (license: any) => {
    return license.usedSeats * license.costPerSeat;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-8 w-8 text-green-600" />
        <div>
          <h1 className="text-3xl font-bold">Global License Management</h1>
          <p className="text-muted-foreground">Manage software licenses and tenant allocations across all schools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Active license agreements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Seats</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,500</div>
            <p className="text-xs text-muted-foreground">Available across all licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">Average across all licenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14,247</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="licenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="licenses">License Inventory</TabsTrigger>
          <TabsTrigger value="allocations">Tenant Allocations</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="costs">Cost Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Input placeholder="Search licenses..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="License Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Add New License</Button>
          </div>

          <div className="grid gap-4">
            {licenses.map((license) => (
              <Card key={license.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{license.id}</Badge>
                      <Badge variant={license.isActive ? "default" : "secondary"}>
                        {license.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">{license.licenseType}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Expires: {new Date(license.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{license.name}</CardTitle>
                  <CardDescription>Provider: {license.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Seat Usage</div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={getUsageProgress(license.usedSeats, license.totalSeats)} 
                          className="flex-1"
                        />
                        <span className={`text-sm font-medium ${getUsageColor(getUsageProgress(license.usedSeats, license.totalSeats))}`}>
                          {license.usedSeats} / {license.totalSeats}
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Cost Per Seat</div>
                      <div className="text-lg font-semibold">${license.costPerSeat}</div>
                      <div className="text-sm text-muted-foreground capitalize">{license.billingCycle}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Total Cost</div>
                      <div className="text-lg font-semibold">${getTotalCost(license).toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Current period</div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">Edit License</Button>
                    <Button size="sm" variant="outline">Manage Allocations</Button>
                    <Button size="sm" variant="outline">View Usage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="allocations" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <Input placeholder="Search tenants..." className="max-w-sm" />
            <Select>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subscription Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {tenantAllocations.map((tenant) => (
              <Card key={tenant.tenantId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{tenant.tenantName}</CardTitle>
                      <Badge variant="outline" className="capitalize">{tenant.subscriptionTier}</Badge>
                    </div>
                    <Button size="sm" variant="outline">Manage Allocations</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tenant.allocations.map((allocation) => (
                      <div key={allocation.licenseId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{allocation.licenseName}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress 
                              value={getUsageProgress(allocation.usedSeats, allocation.allocatedSeats)} 
                              className="w-32"
                            />
                            <span className={`text-sm ${getUsageColor(getUsageProgress(allocation.usedSeats, allocation.allocatedSeats))}`}>
                              {allocation.usedSeats} / {allocation.allocatedSeats}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Adjust</Button>
                          {getUsageProgress(allocation.usedSeats, allocation.allocatedSeats) > 90 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>License Utilization Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Microsoft Office 365</span>
                    <div className="flex items-center gap-2">
                      <Progress value={75} className="w-20" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Adobe Creative Cloud</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-20" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Khan Academy Premium</span>
                    <div className="flex items-center gap-2">
                      <Progress value={93} className="w-20" />
                      <span className="text-sm font-medium text-red-600">93%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Tenant Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Enterprise</span>
                    <span className="font-medium">1,115 seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Premium</span>
                    <span className="font-medium">1,177 seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Standard</span>
                    <span className="font-medium">660 seats</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Basic</span>
                    <span className="font-medium">73 seats</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="costs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Microsoft Office 365</span>
                    <span className="font-medium">$3,750</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adobe Creative Cloud</span>
                    <span className="font-medium">$5,517</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Khan Academy Premium</span>
                    <span className="font-medium">$4,625</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$13,892</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost per Tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Greenwood High</span>
                    <span className="font-medium">$6,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Metro College Prep</span>
                    <span className="font-medium">$4,875</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Riverside Elementary</span>
                    <span className="font-medium">$2,700</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-green-600">
                    ✓ Unused seats: 475 ($1,425 potential savings)
                  </div>
                  <div className="text-sm text-yellow-600">
                    ⚠ Khan Academy at 93% capacity
                  </div>
                  <div className="text-sm text-blue-600">
                    ℹ Adobe renewal in 2 months
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