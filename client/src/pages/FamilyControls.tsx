import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Users, Clock, Activity, Settings2 } from "lucide-react";
import { 
  FamilyStatsOverview,
  DeviceOverview, 
  TimeRestrictions, 
  AppRestrictions, 
  ContentFilters,
  type FamilyMember,
  type FamilyStats,
  type TimeRestriction,
  type AppRestriction,
  type ContentFilter,
  type Device,
  type TimeRestrictionFormType,
  type AppRestrictionFormType,
  type ContentFilterFormType
} from "@/components/family/modules";

export default function FamilyControls() {
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
  const stats: FamilyStats = {
    totalDevices: allDevices.length,
    onlineDevices: allDevices.filter(d => d.isOnline).length,
    activeRestrictions: timeRestrictions.filter(r => r.isActive).length + 
                       appRestrictions.filter(r => r.isBlocked).length + 
                       contentFilters.filter(f => f.isBlocked).length,
    protectedDevices: allDevices.filter(d => 
      familyMembers.find(m => m.devices.includes(d))?.role === 'child'
    ).length,
  };

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
      </div>

      {/* Statistics Overview */}
      <FamilyStatsOverview stats={stats} />

      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle>View Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <label className="text-sm font-medium">Filter by Family Member</label>
              <Select value={selectedMember} onValueChange={setSelectedMember}>
                <SelectTrigger>
                  <SelectValue placeholder="All family members" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Family Members</SelectItem>
                  {familyMembers.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="time">Time Limits</TabsTrigger>
          <TabsTrigger value="apps">App Controls</TabsTrigger>
          <TabsTrigger value="content">Content Filters</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="space-y-4">
          <DeviceOverview
            familyMembers={familyMembers}
            selectedMember={selectedMember}
            onDeviceSettings={handleDeviceSettings}
          />
        </TabsContent>

        <TabsContent value="time" className="space-y-4">
          <TimeRestrictions
            restrictions={timeRestrictions}
            devices={allDevices}
            onAdd={handleAddTimeRestriction}
            onUpdate={handleUpdateTimeRestriction}
            onDelete={handleDeleteTimeRestriction}
          />
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <AppRestrictions
            restrictions={appRestrictions}
            devices={allDevices}
            onAdd={handleAddAppRestriction}
            onUpdate={handleUpdateAppRestriction}
            onDelete={handleDeleteAppRestriction}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <ContentFilters
            filters={contentFilters}
            devices={allDevices}
            onAdd={handleAddContentFilter}
            onUpdate={handleUpdateContentFilter}
            onDelete={handleDeleteContentFilter}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}