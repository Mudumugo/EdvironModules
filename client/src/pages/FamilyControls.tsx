import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Clock, Activity, Settings2 } from "lucide-react";
import { 
  DeviceOverview, 
  TimeRestrictions, 
  AppRestrictions, 
  ContentFilters,
  type FamilyMember,
  type TimeRestriction,
  type AppRestriction,
  type ContentFilter,
  type Device,
  type TimeRestrictionFormType,
  type AppRestrictionFormType,
  type ContentFilterFormType
} from "@/components/family/modules";

export default function FamilyControls() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>("all");

  // Mock data - replace with actual API calls
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: "1",
      name: "Emma Johnson",
      email: "emma@example.com",
      role: "child",
      age: 12,
      profileImage: "/api/placeholder/40/40",
      devices: [
        {
          id: "device-1",
          name: "Emma's iPad",
          type: "tablet",
          userId: "1",
          isOnline: true,
          lastSeen: new Date().toISOString(),
          batteryLevel: 85,
          location: "Home",
        },
        {
          id: "device-2",
          name: "Emma's Phone",
          type: "phone",
          userId: "1",
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000).toISOString(),
          batteryLevel: 15,
        },
      ],
    },
    {
      id: "2",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "child",
      age: 15,
      devices: [
        {
          id: "device-3",
          name: "Alex's Laptop",
          type: "laptop",
          userId: "2",
          isOnline: true,
          lastSeen: new Date().toISOString(),
          batteryLevel: 92,
          location: "School",
        },
      ],
    },
  ]);

  const [timeRestrictions, setTimeRestrictions] = useState<TimeRestriction[]>([
    {
      id: "1",
      deviceId: "device-1",
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
    },
    {
      id: "2",
      deviceId: "device-2",
      dayOfWeek: 6,
      startTime: "10:00",
      endTime: "20:00",
      isActive: true,
    },
  ]);

  const [appRestrictions, setAppRestrictions] = useState<AppRestriction[]>([
    {
      id: "1",
      deviceId: "device-1",
      appName: "TikTok",
      packageName: "com.zhiliaoapp.musically",
      isBlocked: true,
      timeLimit: 60,
      usedTime: 45,
    },
    {
      id: "2",
      deviceId: "device-3",
      appName: "Instagram",
      packageName: "com.instagram.android",
      isBlocked: false,
      timeLimit: 120,
      usedTime: 89,
    },
  ]);

  const [contentFilters, setContentFilters] = useState<ContentFilter[]>([
    {
      id: "1",
      deviceId: "device-1",
      category: "social",
      isBlocked: true,
      ageRating: "13+",
    },
    {
      id: "2",
      deviceId: "device-2",
      category: "games",
      isBlocked: false,
      ageRating: "E10+",
    },
  ]);

  // Get all devices for form selections
  const allDevices: Device[] = familyMembers.flatMap(member => member.devices);

  // Statistics
  const totalDevices = allDevices.length;
  const onlineDevices = allDevices.filter(d => d.isOnline).length;
  const activeRestrictions = timeRestrictions.filter(r => r.isActive).length + 
                           appRestrictions.filter(r => r.isBlocked).length + 
                           contentFilters.filter(f => f.isBlocked).length;
  const protectedDevices = allDevices.filter(d => 
    familyMembers.find(m => m.devices.includes(d))?.role === 'child'
  ).length;

  // Handler functions
  const handleAddTimeRestriction = (restriction: TimeRestrictionFormType) => {
    const newRestriction: TimeRestriction = {
      id: Date.now().toString(),
      ...restriction,
    };
    setTimeRestrictions(prev => [...prev, newRestriction]);
  };

  const handleUpdateTimeRestriction = (id: string, restriction: Partial<TimeRestrictionFormType>) => {
    setTimeRestrictions(prev => prev.map(r => r.id === id ? { ...r, ...restriction } : r));
  };

  const handleDeleteTimeRestriction = (id: string) => {
    setTimeRestrictions(prev => prev.filter(r => r.id !== id));
  };

  const handleAddAppRestriction = (restriction: AppRestrictionFormType) => {
    const newRestriction: AppRestriction = {
      id: Date.now().toString(),
      ...restriction,
    };
    setAppRestrictions(prev => [...prev, newRestriction]);
  };

  const handleUpdateAppRestriction = (id: string, restriction: Partial<AppRestrictionFormType>) => {
    setAppRestrictions(prev => prev.map(r => r.id === id ? { ...r, ...restriction } : r));
  };

  const handleDeleteAppRestriction = (id: string) => {
    setAppRestrictions(prev => prev.filter(r => r.id !== id));
  };

  const handleAddContentFilter = (filter: ContentFilterFormType) => {
    const newFilter: ContentFilter = {
      id: Date.now().toString(),
      ...filter,
    };
    setContentFilters(prev => [...prev, newFilter]);
  };

  const handleUpdateContentFilter = (id: string, filter: Partial<ContentFilterFormType>) => {
    setContentFilters(prev => prev.map(f => f.id === id ? { ...f, ...filter } : f));
  };

  const handleDeleteContentFilter = (id: string) => {
    setContentFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleDeviceSettings = (deviceId: string) => {
    // Navigate to device-specific settings
    console.log("Open device settings for:", deviceId);
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="truncate">Family Controls</span>
          </h1>
          <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
            Monitor and manage your children's educational activities with comprehensive parental controls
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Dialog open={restrictionDialog.isOpen} onOpenChange={(open) => open ? restrictionDialog.openDialog() : restrictionDialog.closeDialog()}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Lock className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Restriction</span>
                <span className="sm:hidden">Restriction</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Restriction</DialogTitle>
              </DialogHeader>
              <Form {...restrictionDialog.form}>
                <form onSubmit={restrictionDialog.handleSubmit} className="space-y-4">
                  <FormField
                    control={restrictionDialog.form.control}
                    name="childId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select child" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {children.map((child) => (
                              <SelectItem key={child.id} value={child.id}>
                                {child.firstName} {child.lastName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={restrictionDialog.form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restriction Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="screen-time">Screen Time Limit</SelectItem>
                              <SelectItem value="content-filter">Content Filter</SelectItem>
                              <SelectItem value="bedtime">Bedtime Schedule</SelectItem>
                              <SelectItem value="app-restriction">App Restriction</SelectItem>
                              <SelectItem value="website-block">Website Block</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={restrictionDialog.form.control}
                      name="value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Value</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 3 (hours), 20:00 (time)" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={restrictionDialog.form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe the restriction..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={restrictionDialog.form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Active restriction</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Apply Restriction
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={childDialog.isOpen} onOpenChange={(open) => open ? childDialog.openDialog() : childDialog.closeDialog()}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Add Child</span>
                <span className="sm:hidden">Child</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Child Profile</DialogTitle>
              </DialogHeader>
              <Form {...childDialog.form}>
                <form onSubmit={childDialog.handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={childDialog.form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter first name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={childDialog.form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter last name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={childDialog.form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Grade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="K">Kindergarten</SelectItem>
                              <SelectItem value="1st Grade">1st Grade</SelectItem>
                              <SelectItem value="2nd Grade">2nd Grade</SelectItem>
                              <SelectItem value="3rd Grade">3rd Grade</SelectItem>
                              <SelectItem value="4th Grade">4th Grade</SelectItem>
                              <SelectItem value="5th Grade">5th Grade</SelectItem>
                              <SelectItem value="6th Grade">6th Grade</SelectItem>
                              <SelectItem value="7th Grade">7th Grade</SelectItem>
                              <SelectItem value="8th Grade">8th Grade</SelectItem>
                              <SelectItem value="9th Grade">9th Grade</SelectItem>
                              <SelectItem value="10th Grade">10th Grade</SelectItem>
                              <SelectItem value="11th Grade">11th Grade</SelectItem>
                              <SelectItem value="12th Grade">12th Grade</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={childDialog.form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Enter age" type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={childDialog.form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter school name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Add Child Profile
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalChildren}</div>
            <p className="text-xs text-muted-foreground">Managed profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Active Restrictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRestrictions}</div>
            <p className="text-xs text-muted-foreground">Current controls</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Today's Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayActivities}</div>
            <p className="text-xs text-muted-foreground">Learning sessions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Avg Screen Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScreenTime.toFixed(1)}h</div>
            <p className="text-xs text-muted-foreground">Daily average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>View Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <Label htmlFor="child-filter">Filter by Child</Label>
              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="All Children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {children.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.firstName} {child.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-0 sm:max-w-48">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">
            Device Overview
          </TabsTrigger>
          <TabsTrigger value="time" className="text-xs sm:text-sm">
            Time Restrictions
          </TabsTrigger>
          <TabsTrigger value="apps" className="text-xs sm:text-sm">
            App Controls
          </TabsTrigger>
          <TabsTrigger value="content" className="text-xs sm:text-sm">
            Content Filters
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          <DeviceOverview
            familyMembers={familyMembers}
            onDeviceSettings={handleDeviceSettings}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="time" className="space-y-4 sm:space-y-6">
          <TimeRestrictions
            restrictions={timeRestrictions}
            devices={allDevices}
            onAdd={handleAddTimeRestriction}
            onUpdate={handleUpdateTimeRestriction}
            onDelete={handleDeleteTimeRestriction}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="apps" className="space-y-4 sm:space-y-6">
          <AppRestrictions
            restrictions={appRestrictions}
            devices={allDevices}
            onAdd={handleAddAppRestriction}
            onUpdate={handleUpdateAppRestriction}
            onDelete={handleDeleteAppRestriction}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-4 sm:space-y-6">
          <ContentFilters
            filters={contentFilters}
            devices={allDevices}
            onAdd={handleAddContentFilter}
            onUpdate={handleUpdateContentFilter}
            onDelete={handleDeleteContentFilter}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}