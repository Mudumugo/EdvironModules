import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Laptop, 
  Tablet, 
  Smartphone, 
  Battery, 
  Wifi, 
  Clock, 
  Activity,
  Shield,
  AlertTriangle
} from "lucide-react";
import { StudentDevice } from "./types";

interface DeviceStatusProps {
  device: StudentDevice;
}

export function DeviceStatus({ device }: DeviceStatusProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'laptop': return Laptop;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'green';
      case 'offline': return 'gray';
      case 'restricted': return 'red';
      default: return 'gray';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'green';
    if (level > 20) return 'yellow';
    return 'red';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const DeviceIcon = getDeviceIcon(device.type);
  const statusColor = getStatusColor(device.status);
  const activeRestrictions = device.restrictions.filter(r => r.isActive);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DeviceIcon className="h-5 w-5" />
          Device Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Info */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">{device.name}</h3>
            <p className="text-sm text-gray-600">{device.location}</p>
          </div>
          <Badge className={`bg-${statusColor}-100 text-${statusColor}-700`}>
            {device.status}
          </Badge>
        </div>

        {/* Battery Level (if available) */}
        {device.batteryLevel !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4" />
                <span className="text-sm font-medium">Battery</span>
              </div>
              <span className="text-sm text-gray-600">{device.batteryLevel}%</span>
            </div>
            <Progress 
              value={device.batteryLevel} 
              className={`h-2 bg-${getBatteryColor(device.batteryLevel)}-200`}
            />
          </div>
        )}

        {/* Screen Time Today */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Screen Time Today</span>
            </div>
            <span className="text-sm text-gray-600">
              {formatTime(device.screenTime.today)} / {formatTime(device.screenTime.dailyLimit)}
            </span>
          </div>
          <Progress 
            value={(device.screenTime.today / device.screenTime.dailyLimit) * 100} 
            className="h-2"
          />
        </div>

        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <Wifi className={`h-4 w-4 text-${device.status === 'online' ? 'green' : 'gray'}-500`} />
          <span className="text-sm">
            {device.status === 'online' ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Active Restrictions */}
        {activeRestrictions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Active Restrictions</span>
            </div>
            <div className="space-y-1">
              {activeRestrictions.slice(0, 3).map((restriction) => (
                <div key={restriction.id} className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-gray-600">{restriction.name}</span>
                </div>
              ))}
              {activeRestrictions.length > 3 && (
                <p className="text-xs text-gray-500">
                  +{activeRestrictions.length - 3} more restrictions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Last Activity */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Activity className="h-4 w-4 text-gray-500" />
          <span className="text-xs text-gray-600">
            Last activity: {new Date(device.lastActivity).toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}