import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Smartphone, Battery, MapPin, Move, Wifi, WifiOff } from "lucide-react";
import { Device, DeviceGroup } from "./DeviceGroupTypes";

interface DeviceListProps {
  devices: Device[];
  groups: DeviceGroup[];
  onMoveDevice: (deviceId: string, newGroupId: string) => void;
  selectedGroupId?: string;
  isLoading?: boolean;
}

export default function DeviceList({ devices, groups, onMoveDevice, selectedGroupId, isLoading }: DeviceListProps) {
  const getStatusColor = (status: Device['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Device['status']) => {
    return status === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />;
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level > 50) return 'text-green-600';
    if (level > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredDevices = selectedGroupId 
    ? devices.filter(device => device.groupId === selectedGroupId)
    : devices;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (filteredDevices.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Devices</h3>
          <p className="text-muted-foreground">
            {selectedGroupId ? "This group has no devices assigned." : "No devices found."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {selectedGroupId ? 'Group Devices' : 'All Devices'} ({filteredDevices.length})
        </h3>
      </div>

      <div className="space-y-3">
        {filteredDevices.map((device) => (
          <Card key={device.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Smartphone className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium truncate">{device.name}</h4>
                      <Badge className={`${getStatusColor(device.status)} border-0 text-xs`}>
                        {getStatusIcon(device.status)}
                        <span className="ml-1 capitalize">{device.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="capitalize">{device.type}</span>
                      
                      {device.batteryLevel && (
                        <div className="flex items-center gap-1">
                          <Battery className={`h-3 w-3 ${getBatteryColor(device.batteryLevel)}`} />
                          <span>{device.batteryLevel}%</span>
                        </div>
                      )}
                      
                      {device.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{device.location}</span>
                        </div>
                      )}
                      
                      <span>Last seen: {new Date(device.lastSeen).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {groups.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Move className="h-4 w-4 text-muted-foreground" />
                      <select
                        value={device.groupId || ''}
                        onChange={(e) => onMoveDevice(device.id, e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                      >
                        <option value="">No Group</option>
                        {groups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}