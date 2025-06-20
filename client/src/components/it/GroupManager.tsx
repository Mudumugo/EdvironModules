import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Users, Edit, Trash2, Settings } from "lucide-react";
import { DeviceGroup, Device } from "./types";

interface GroupManagerProps {
  groups: DeviceGroup[];
  devices: Device[];
  onCreateGroup: (groupData: Partial<DeviceGroup>) => void;
  onUpdateGroup: (groupId: string, updates: Partial<DeviceGroup>) => void;
  onDeleteGroup: (groupId: string) => void;
  onGroupAction: (action: string, groupIds: string[]) => void;
}

export function GroupManager({ 
  groups, 
  devices, 
  onCreateGroup, 
  onUpdateGroup, 
  onDeleteGroup, 
  onGroupAction 
}: GroupManagerProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DeviceGroup | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    deviceIds: [] as string[],
    color: '#3B82F6'
  });

  const handleSubmit = () => {
    if (editingGroup) {
      onUpdateGroup(editingGroup.id, formData);
      setEditingGroup(null);
    } else {
      onCreateGroup(formData);
    }
    
    setFormData({ name: '', description: '', deviceIds: [], color: '#3B82F6' });
    setShowCreateDialog(false);
  };

  const handleEdit = (group: DeviceGroup) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      deviceIds: group.deviceIds,
      color: group.color || '#3B82F6'
    });
    setShowCreateDialog(true);
  };

  const getDevicesByGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];
    return devices.filter(device => group.deviceIds.includes(device.id));
  };

  const availableDevices = devices.filter(device => 
    !groups.some(group => group.deviceIds.includes(device.id))
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Device Groups</h3>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No groups created</h3>
            <p className="text-gray-600 mb-4">Create groups to organize and manage devices efficiently.</p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Group
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => {
            const groupDevices = getDevicesByGroup(group.id);
            const onlineDevices = groupDevices.filter(d => d.status === 'online').length;

            return (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: group.color }}
                      />
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(group)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDeleteGroup(group.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-3">{group.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {groupDevices.length} devices
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {onlineDevices} online
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex gap-2 flex-wrap">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onGroupAction('lock', [group.id])}
                      >
                        Lock All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onGroupAction('unlock', [group.id])}
                      >
                        Unlock All
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => onGroupAction('refresh', [group.id])}
                      >
                        Refresh All
                      </Button>
                    </div>

                    {group.policies && group.policies.length > 0 && (
                      <div className="mt-2">
                        <div className="text-xs text-gray-500 mb-1">Active Policies:</div>
                        <div className="flex gap-1 flex-wrap">
                          {group.policies.slice(0, 2).map((policy) => (
                            <Badge key={policy} variant="outline" className="text-xs">
                              {policy}
                            </Badge>
                          ))}
                          {group.policies.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.policies.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Group Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Edit Group' : 'Create Device Group'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter group name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter group description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="color">Group Color</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="w-12 h-8 rounded border"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <Label>Select Devices</Label>
              <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                {(editingGroup ? devices : availableDevices).map((device) => (
                  <div key={device.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.deviceIds.includes(device.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ 
                            ...prev, 
                            deviceIds: [...prev.deviceIds, device.id] 
                          }));
                        } else {
                          setFormData(prev => ({ 
                            ...prev, 
                            deviceIds: prev.deviceIds.filter(id => id !== device.id) 
                          }));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{device.name} ({device.type})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                {editingGroup ? 'Update Group' : 'Create Group'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}