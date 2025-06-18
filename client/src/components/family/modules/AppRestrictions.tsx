import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Plus, Smartphone, Edit, Trash2, Clock } from "lucide-react";
import { AppRestriction, Device, AppRestrictionFormType } from "../types";

interface AppRestrictionsProps {
  restrictions: AppRestriction[];
  devices: Device[];
  onAdd: (restriction: AppRestrictionFormType) => void;
  onUpdate: (id: string, restriction: Partial<AppRestrictionFormType>) => void;
  onDelete: (id: string) => void;
}

export function AppRestrictions({ 
  restrictions, 
  devices, 
  onAdd, 
  onUpdate, 
  onDelete 
}: AppRestrictionsProps) {
  const getDeviceName = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    return device?.name || 'Unknown Device';
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getUsagePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (used: number, limit: number) => {
    const percentage = getUsagePercentage(used, limit);
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            App Restrictions
          </span>
          <Button size="sm" onClick={() => {
            console.log("Add app restriction");
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Restriction
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {restrictions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Smartphone className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No app restrictions configured</p>
            <p className="text-sm">Add restrictions to control app usage</p>
          </div>
        ) : (
          <div className="space-y-4">
            {restrictions.map(restriction => (
              <div key={restriction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">{restriction.appName}</div>
                      <div className="text-xs text-muted-foreground">
                        {getDeviceName(restriction.deviceId)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={restriction.isBlocked ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {restriction.isBlocked ? "Blocked" : "Allowed"}
                    </Badge>
                    <Switch
                      checked={!restriction.isBlocked}
                      onCheckedChange={(checked) => 
                        onUpdate(restriction.id, { isBlocked: !checked })
                      }
                    />
                  </div>
                </div>

                {restriction.timeLimit && restriction.usedTime !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Time Usage
                      </span>
                      <span>
                        {formatTime(restriction.usedTime)} / {formatTime(restriction.timeLimit)}
                      </span>
                    </div>
                    <Progress 
                      value={getUsagePercentage(restriction.usedTime, restriction.timeLimit)}
                      className="h-2"
                    />
                    {restriction.usedTime >= restriction.timeLimit && (
                      <p className="text-xs text-red-600 mt-1">Time limit exceeded</p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(restriction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}