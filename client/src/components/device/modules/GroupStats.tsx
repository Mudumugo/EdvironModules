import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Smartphone, Wifi, WifiOff } from "lucide-react";
import { DeviceGroup, Device } from "./DeviceGroupTypes";

interface GroupStatsProps {
  groups: DeviceGroup[];
  devices: Device[];
  isLoading?: boolean;
}

export default function GroupStats({ groups, devices, isLoading }: GroupStatsProps) {
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const offlineDevices = devices.filter(d => d.status === 'offline').length;
  const maintenanceDevices = devices.filter(d => d.status === 'maintenance').length;

  const stats = [
    {
      title: "Total Groups",
      value: groups.length,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100"
    },
    {
      title: "Total Devices",
      value: totalDevices,
      icon: Smartphone,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Online",
      value: onlineDevices,
      icon: Wifi,
      color: "text-green-600",
      bg: "bg-green-100"
    },
    {
      title: "Offline",
      value: offlineDevices,
      icon: WifiOff,
      color: "text-red-600",
      bg: "bg-red-100"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="space-y-1 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}