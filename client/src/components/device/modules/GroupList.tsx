import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users, Smartphone } from "lucide-react";
import { DeviceGroup, predefinedColors } from "./DeviceGroupTypes";

interface GroupListProps {
  groups: DeviceGroup[];
  onEdit: (group: DeviceGroup) => void;
  onDelete: (groupId: string) => void;
  onViewDevices: (groupId: string) => void;
  isLoading?: boolean;
}

export default function GroupList({ groups, onEdit, onDelete, onViewDevices, isLoading }: GroupListProps) {
  const getColorClasses = (colorValue: string) => {
    const color = predefinedColors.find(c => c.value === colorValue);
    return color ? { bg: color.bg, text: color.text } : { bg: 'bg-gray-100', text: 'text-gray-800' };
  };

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
              <div className="flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="flex gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Device Groups</h3>
          <p className="text-muted-foreground mb-4">
            Create your first device group to organize and manage devices efficiently.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => {
        const colorClasses = getColorClasses(group.color);
        
        return (
          <Card key={group.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <Badge 
                    className={`mt-2 ${colorClasses.bg} ${colorClasses.text} border-0`}
                  >
                    {group.deviceCount} devices
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(group)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(group.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="mb-4">
                {group.description}
              </CardDescription>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDevices(group.id)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Devices
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}