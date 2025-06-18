import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Battery, 
  MapPin,
  Settings2 
} from "lucide-react";
import { FamilyMember, Device } from "../types";

interface DeviceOverviewProps {
  familyMembers: FamilyMember[];
  selectedMember: string;
  onDeviceSettings: (deviceId: string) => void;
}

export function DeviceOverview({ familyMembers, selectedMember, onDeviceSettings }: DeviceOverviewProps) {
  const getDeviceIcon = (type: Device['type']) => {
    switch (type) {
      case 'phone': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'laptop': return <Laptop className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  const getBatteryColor = (level?: number) => {
    if (!level) return "bg-gray-500";
    if (level > 50) return "bg-green-500";
    if (level > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredMembers = selectedMember === "all" 
    ? familyMembers 
    : familyMembers.filter(member => member.id === selectedMember);

  return (
    <div className="space-y-6">
      {filteredMembers.map(member => (
        <Card key={member.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {member.profileImage && (
                <img 
                  src={member.profileImage} 
                  alt={member.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {member.role} {member.age && `• ${member.age} years old`}
                </div>
              </div>
              <Badge variant={member.role === 'child' ? 'secondary' : 'outline'}>
                {member.role}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {member.devices.map(device => (
                <Card key={device.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.type)}
                        <div>
                          <div className="font-medium text-sm">{device.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {device.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {device.isOnline ? (
                          <Wifi className="h-3 w-3 text-green-500" />
                        ) : (
                          <WifiOff className="h-3 w-3 text-gray-400" />
                        )}
                        <Badge 
                          variant={device.isOnline ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {device.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {device.batteryLevel !== undefined && (
                        <div className="flex items-center gap-2">
                          <Battery className="h-3 w-3" />
                          <Progress 
                            value={device.batteryLevel} 
                            className="flex-1 h-2"
                          />
                          <span className="text-xs text-muted-foreground">
                            {device.batteryLevel}%
                          </span>
                        </div>
                      )}

                      {device.location && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{device.location}</span>
                        </div>
                      )}

                      <div className="text-xs text-muted-foreground">
                        Last seen: {new Date(device.lastSeen).toLocaleString()}
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => onDeviceSettings(device.id)}
                    >
                      <Settings2 className="h-3 w-3 mr-1" />
                      Settings
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}