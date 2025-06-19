import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Monitor, Smartphone, Tablet, Laptop, Wifi, WifiOff, Battery, Settings, Power, Lock, Unlock } from "lucide-react";
import { trackDevice } from "@/lib/xapi/xapiHooks";

interface Device {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  batteryLevel?: number;
  lastSeen: string;
  isOnline: boolean;
  restrictions: string[];
}

interface DeviceGridProps {
  devices: Device[];
  onDeviceAction: (deviceId: string, action: string) => void;
}

export default function DeviceGrid({ devices, onDeviceAction }: DeviceGridProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop': return Laptop;
      case 'tablet': return Tablet;
      case 'smartphone': return Smartphone;
      case 'chromebook': return Monitor;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'restricted': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDeviceAction = (deviceId: string, action: string) => {
    trackDevice(deviceId, action, { timestamp: new Date().toISOString() });
    onDeviceAction(deviceId, action);
  };

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleBulkAction = (action: string) => {
    selectedDevices.forEach(deviceId => {
      handleDeviceAction(deviceId, action);
    });
    setSelectedDevices([]);
  };

  return (
    <div className="space-y-4">
      {selectedDevices.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 p-3 sm:p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium mb-2 sm:mb-0">
            {selectedDevices.length} device(s) selected:
          </span>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('lock')} className="flex-1 sm:flex-none">
              <Lock className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Lock All</span>
              <span className="sm:hidden">Lock</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('unlock')} className="flex-1 sm:flex-none">
              <Unlock className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Unlock All</span>
              <span className="sm:hidden">Unlock</span>
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction('restart')} className="flex-1 sm:flex-none">
              <Power className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Restart All</span>
              <span className="sm:hidden">Restart</span>
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedDevices([])} className="w-full sm:w-auto">
              Clear Selection
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {devices.map((device) => {
          const DeviceIcon = getDeviceIcon(device.type);
          const isSelected = selectedDevices.includes(device.id);

          return (
            <Card
              key={device.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => toggleDeviceSelection(device.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium text-sm">{device.name}</h3>
                      <p className="text-xs text-muted-foreground">{device.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {device.isOnline ? (
                      <Wifi className="h-4 w-4 text-green-500" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-500" />
                    )}
                    <Badge className={`${getStatusColor(device.status)} text-xs`}>
                      {device.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span>{device.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Seen:</span>
                    <span>{device.lastSeen}</span>
                  </div>
                  
                  {device.batteryLevel !== undefined && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Battery className="h-3 w-3" />
                          <span className="text-muted-foreground">Battery:</span>
                        </div>
                        <span>{device.batteryLevel}%</span>
                      </div>
                      <Progress value={device.batteryLevel} className="h-1" />
                    </div>
                  )}

                  {device.restrictions.length > 0 && (
                    <div>
                      <span className="text-muted-foreground">Restrictions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {device.restrictions.slice(0, 2).map((restriction, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {restriction}
                          </Badge>
                        ))}
                        {device.restrictions.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{device.restrictions.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-1 mt-3" onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => handleDeviceAction(device.id, 'view-details')}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Manage
                  </Button>
                  {device.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleDeviceAction(device.id, 'lock')}
                    >
                      <Lock className="h-3 w-3" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs"
                      onClick={() => handleDeviceAction(device.id, 'unlock')}
                    >
                      <Unlock className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}