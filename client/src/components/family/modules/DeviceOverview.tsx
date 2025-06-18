import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Laptop, Battery, MapPin, Shield, Settings } from "lucide-react";
import { Device, FamilyMember } from "./FamilyTypes";

interface DeviceOverviewProps {
  familyMembers: FamilyMember[];
  onDeviceSettings: (deviceId: string) => void;
  isLoading?: boolean;
}

export default function DeviceOverview({ familyMembers, onDeviceSettings, isLoading }: DeviceOverviewProps) {
  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'laptop':
        return <Laptop className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const allDevices = familyMembers.flatMap(member => 
    member.devices.map(device => ({ ...device, memberName: member.name, memberRole: member.role }))
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (allDevices.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Devices Found</h3>
          <p className="text-muted-foreground">
            Add family members and their devices to start managing parental controls.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <Smartphone className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold">{allDevices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-green-100">
                <Shield className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Online</p>
                <p className="text-2xl font-bold">{allDevices.filter(d => d.isOnline).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Protected</p>
                <p className="text-2xl font-bold">{allDevices.filter(d => d.memberRole === 'child').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <Battery className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Battery</p>
                <p className="text-2xl font-bold">
                  {allDevices.filter(d => d.batteryLevel && d.batteryLevel < 20).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allDevices.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${device.isOnline ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{device.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{device.memberName}</p>
                  </div>
                </div>
                <Badge variant={device.isOnline ? "default" : "secondary"}>
                  {device.isOnline ? "Online" : "Offline"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{device.type}</span>
              </div>
              
              {device.batteryLevel && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Battery</span>
                  <div className="flex items-center space-x-1">
                    <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                    <span>{device.batteryLevel}%</span>
                  </div>
                </div>
              )}
              
              {device.location && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Location</span>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{device.location}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last Seen</span>
                <span>{new Date(device.lastSeen).toLocaleString()}</span>
              </div>

              <Button 
                className="w-full"
                variant="outline"
                onClick={() => onDeviceSettings(device.id)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Device
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}