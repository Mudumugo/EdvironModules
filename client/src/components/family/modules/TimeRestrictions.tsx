import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Clock, Edit, Trash2 } from "lucide-react";
import { TimeRestriction, Device, TimeRestrictionFormType } from "../types";

interface TimeRestrictionsProps {
  restrictions: TimeRestriction[];
  devices: Device[];
  onAdd: (restriction: TimeRestrictionFormType) => void;
  onUpdate: (id: string, restriction: Partial<TimeRestrictionFormType>) => void;
  onDelete: (id: string) => void;
}

export function TimeRestrictions({ 
  restrictions, 
  devices, 
  onAdd, 
  onUpdate, 
  onDelete 
}: TimeRestrictionsProps) {
  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayOfWeek];
  };

  const getDeviceName = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    return device?.name || 'Unknown Device';
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour12 = parseInt(hours) % 12 || 12;
    const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Time Restrictions
          </span>
          <Button size="sm" onClick={() => {
            // This would open a dialog to add new restriction
            console.log("Add time restriction");
          }}>
            <Plus className="h-4 w-4 mr-1" />
            Add Restriction
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {restrictions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No time restrictions configured</p>
            <p className="text-sm">Add restrictions to control device usage times</p>
          </div>
        ) : (
          <div className="space-y-4">
            {restrictions.map(restriction => (
              <div key={restriction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {getDeviceName(restriction.deviceId)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getDayName(restriction.dayOfWeek)}
                      </Badge>
                      <Badge 
                        variant={restriction.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {restriction.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <strong>
                        {formatTime(restriction.startTime)} - {formatTime(restriction.endTime)}
                      </strong>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={restriction.isActive}
                      onCheckedChange={(checked) => 
                        onUpdate(restriction.id, { isActive: checked })
                      }
                    />
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}