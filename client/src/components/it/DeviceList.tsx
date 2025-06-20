import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Monitor, Laptop, Tablet, Smartphone, MoreHorizontal, Lock, Unlock, RefreshCw, Power, Eye, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Device, DEVICE_STATUSES } from "./types";

interface DeviceListProps {
  devices: Device[];
  selectedDevices: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onDeviceAction: (action: string, deviceIds: string[]) => void;
  onDeviceDetails: (device: Device) => void;
}

export function DeviceList({ 
  devices, 
  selectedDevices, 
  onSelectionChange, 
  onDeviceAction, 
  onDeviceDetails 
}: DeviceListProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'desktop': return Monitor;
      case 'laptop': return Laptop;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  const getStatusInfo = (status: string) => {
    return DEVICE_STATUSES.find(s => s.value === status) || DEVICE_STATUSES[0];
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(devices.map(d => d.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleDeviceSelect = (deviceId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedDevices, deviceId]);
    } else {
      onSelectionChange(selectedDevices.filter(id => id !== deviceId));
    }
  };

  const isAllSelected = devices.length > 0 && selectedDevices.length === devices.length;
  const isPartiallySelected = selectedDevices.length > 0 && selectedDevices.length < devices.length;

  if (devices.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Monitor className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No devices found</h3>
          <p className="text-gray-600">Devices will appear here once they connect to the network.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Devices ({devices.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAllSelected}
              ref={(el) => {
                if (el) el.indeterminate = isPartiallySelected;
              }}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">
              {selectedDevices.length > 0 ? `${selectedDevices.length} selected` : 'Select all'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {devices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            const statusInfo = getStatusInfo(device.status);
            const isSelected = selectedDevices.includes(device.id);

            return (
              <div
                key={device.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleDeviceSelect(device.id, checked as boolean)}
                />
                
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    <DeviceIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{device.name}</h4>
                      <Badge 
                        variant="secondary" 
                        className={`text-${statusInfo.color}-700 bg-${statusInfo.color}-100`}
                      >
                        {statusInfo.label}
                      </Badge>
                      {device.isLocked && (
                        <Badge variant="outline" className="text-red-600">
                          <Lock className="h-3 w-3 mr-1" />
                          Locked
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{device.user}</span>
                      <span>{device.location}</span>
                      <span>{device.ip}</span>
                      <span>{device.os}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeviceDetails(device)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {device.isLocked ? (
                        <DropdownMenuItem onClick={() => onDeviceAction('unlock', [device.id])}>
                          <Unlock className="h-4 w-4 mr-2" />
                          Unlock Device
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => onDeviceAction('lock', [device.id])}>
                          <Lock className="h-4 w-4 mr-2" />
                          Lock Device
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onDeviceAction('refresh', [device.id])}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeviceAction('restart', [device.id])}>
                        <Power className="h-4 w-4 mr-2" />
                        Restart
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeviceAction('screenshot', [device.id])}>
                        <Eye className="h-4 w-4 mr-2" />
                        Take Screenshot
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeviceAction('settings', [device.id])}>
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}