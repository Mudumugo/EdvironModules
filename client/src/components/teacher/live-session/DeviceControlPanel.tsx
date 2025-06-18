import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Smartphone,
  Tablet,
  Laptop,
  Wifi,
  WifiOff,
  Circle,
  Lock,
  Unlock,
  Power,
  Monitor,
  Eye,
  EyeOff
} from "lucide-react";
import { ConnectedDevice } from "./LiveSessionTypes";

interface DeviceControlPanelProps {
  devices: ConnectedDevice[];
  selectedDevice: string;
  onDeviceSelect: (deviceId: string) => void;
  onDeviceAction: (deviceId: string, action: string) => void;
}

export const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({
  devices,
  selectedDevice,
  onDeviceSelect,
  onDeviceAction
}) => {
  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'smartphone':
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Laptop className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          Device Control
        </CardTitle>
        <CardDescription>
          Monitor and control student devices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Device</label>
          <Select value={selectedDevice} onValueChange={onDeviceSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a device to control" />
            </SelectTrigger>
            <SelectContent>
              {devices.map((device) => (
                <SelectItem key={device.id} value={device.id}>
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(device.deviceType)}
                    <span>{device.deviceId}</span>
                    <Circle className={`h-2 w-2 ${getStatusColor(device.status)}`} />
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDevice && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeviceAction(selectedDevice, 'lock')}
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeviceAction(selectedDevice, 'unlock')}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unlock
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeviceAction(selectedDevice, 'monitor')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Monitor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeviceAction(selectedDevice, 'stop_monitor')}
              >
                <EyeOff className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
            
            <Button
              variant="destructive"
              size="sm"
              className="w-full"
              onClick={() => onDeviceAction(selectedDevice, 'restart')}
            >
              <Power className="h-4 w-4 mr-2" />
              Restart Device
            </Button>
          </div>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Connected Devices</h4>
          <div className="max-h-32 overflow-y-auto space-y-2">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {getDeviceIcon(device.deviceType)}
                  <div>
                    <div className="text-sm font-medium">{device.deviceId}</div>
                    <div className="text-xs text-gray-500">{device.platform}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={device.isConnected ? "default" : "secondary"}>
                    {device.status}
                  </Badge>
                  {device.isConnected ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};