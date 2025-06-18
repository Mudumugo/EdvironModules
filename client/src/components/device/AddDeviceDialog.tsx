import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AddDeviceDialogProps {
  onDeviceAdded?: () => void;
}

interface DeviceFormData {
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  macAddress: string;
  osVersion: string;
  assignedTo: string;
  location: string;
  notes: string;
  groupId?: string;
}

const DEVICE_TYPES = [
  { value: "tablet", label: "Tablet" },
  { value: "laptop", label: "Laptop" },
  { value: "desktop", label: "Desktop" },
  { value: "chromebook", label: "Chromebook" },
  { value: "smartphone", label: "Smartphone" },
  { value: "interactive_board", label: "Interactive Board" },
  { value: "projector", label: "Projector" },
  { value: "printer", label: "Printer" }
];

export default function AddDeviceDialog({ onDeviceAdded }: AddDeviceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({
    name: '',
    type: '',
    model: '',
    serialNumber: '',
    macAddress: '',
    osVersion: '',
    assignedTo: '',
    location: '',
    notes: '',
    groupId: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addDeviceMutation = useMutation({
    mutationFn: async (deviceData: DeviceFormData) => {
      return apiRequest("POST", "/api/devices", deviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/devices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/devices/stats"] });
      setIsOpen(false);
      resetForm();
      onDeviceAdded?.();
      toast({
        title: "Device Added",
        description: "New device has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      model: '',
      serialNumber: '',
      macAddress: '',
      osVersion: '',
      assignedTo: '',
      location: '',
      notes: '',
      groupId: ''
    });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.type || !formData.serialNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    addDeviceMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Device
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Device</DialogTitle>
          <DialogDescription>
            Register a new device in the system for management and monitoring.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Device Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., iPad Pro #1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Device Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select device type" />
              </SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input
              id="model"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="e.g., iPad Pro 12.9-inch"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number *</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
              placeholder="Device serial number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="macAddress">MAC Address</Label>
            <Input
              id="macAddress"
              value={formData.macAddress}
              onChange={(e) => setFormData({ ...formData, macAddress: e.target.value })}
              placeholder="XX:XX:XX:XX:XX:XX"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="osVersion">OS Version</Label>
            <Input
              id="osVersion"
              value={formData.osVersion}
              onChange={(e) => setFormData({ ...formData, osVersion: e.target.value })}
              placeholder="e.g., iOS 17.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="User or department"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Room 101, Library"
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes about the device"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={addDeviceMutation.isPending}
          >
            Add Device
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}