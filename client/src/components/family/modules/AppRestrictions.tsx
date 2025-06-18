import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Smartphone, Shield, Timer } from "lucide-react";
import { AppRestriction, Device, appRestrictionSchema, AppRestrictionFormType } from "./FamilyTypes";

interface AppRestrictionsProps {
  restrictions: AppRestriction[];
  devices: Device[];
  onAdd: (restriction: AppRestrictionFormType) => void;
  onUpdate: (id: string, restriction: Partial<AppRestrictionFormType>) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function AppRestrictions({ 
  restrictions, 
  devices, 
  onAdd, 
  onUpdate, 
  onDelete, 
  isLoading 
}: AppRestrictionsProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRestriction, setEditingRestriction] = React.useState<AppRestriction | null>(null);

  const form = useForm<AppRestrictionFormType>({
    resolver: zodResolver(appRestrictionSchema),
    defaultValues: {
      deviceId: "",
      appName: "",
      packageName: "",
      isBlocked: false,
      timeLimit: undefined,
    },
  });

  React.useEffect(() => {
    if (editingRestriction) {
      form.reset({
        deviceId: editingRestriction.deviceId,
        appName: editingRestriction.appName,
        packageName: editingRestriction.packageName,
        isBlocked: editingRestriction.isBlocked,
        timeLimit: editingRestriction.timeLimit,
      });
    } else {
      form.reset({
        deviceId: "",
        appName: "",
        packageName: "",
        isBlocked: false,
        timeLimit: undefined,
      });
    }
  }, [editingRestriction, form]);

  const handleSubmit = (data: AppRestrictionFormType) => {
    if (editingRestriction) {
      onUpdate(editingRestriction.id, data);
    } else {
      onAdd(data);
    }
    setIsDialogOpen(false);
    setEditingRestriction(null);
  };

  const handleEdit = (restriction: AppRestriction) => {
    setEditingRestriction(restriction);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingRestriction(null);
    form.reset();
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find(d => d.id === deviceId)?.name || 'Unknown Device';
  };

  const calculateUsagePercentage = (used: number = 0, limit: number = 0) => {
    if (limit === 0) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">App Restrictions</h3>
          <p className="text-sm text-muted-foreground">
            Block apps or set time limits for individual applications
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add App Rule
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRestriction ? 'Edit App Restriction' : 'Add App Restriction'}
              </DialogTitle>
              <DialogDescription>
                Block apps or set daily time limits
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="deviceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a device" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {devices.map((device) => (
                            <SelectItem key={device.id} value={device.id}>
                              {device.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Instagram, TikTok" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="packageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Package Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., com.instagram.android" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isBlocked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Block App</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Completely block access to this app
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Daily Time Limit (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 60" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingRestriction ? 'Update' : 'Add'} Restriction
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {restrictions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No App Restrictions</h3>
            <p className="text-muted-foreground mb-4">
              Add app restrictions to control access to specific applications.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {restrictions.map((restriction) => (
            <Card key={restriction.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{restriction.appName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {getDeviceName(restriction.deviceId)}
                        </p>
                      </div>
                    </div>
                    
                    {restriction.timeLimit && (
                      <div className="flex-1 max-w-xs">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Usage Today</span>
                          <span>{restriction.usedTime || 0}/{restriction.timeLimit} min</span>
                        </div>
                        <Progress 
                          value={calculateUsagePercentage(restriction.usedTime, restriction.timeLimit)}
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {restriction.isBlocked ? (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Blocked
                      </Badge>
                    ) : restriction.timeLimit ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Timer className="h-3 w-3" />
                        Limited
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Allowed</Badge>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(restriction)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(restriction.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}