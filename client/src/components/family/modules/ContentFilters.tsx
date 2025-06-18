import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Shield, Eye, EyeOff } from "lucide-react";
import { ContentFilter, Device, contentFilterSchema, ContentFilterFormType, contentCategories } from "./FamilyTypes";

interface ContentFiltersProps {
  filters: ContentFilter[];
  devices: Device[];
  onAdd: (filter: ContentFilterFormType) => void;
  onUpdate: (id: string, filter: Partial<ContentFilterFormType>) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ContentFilters({ 
  filters, 
  devices, 
  onAdd, 
  onUpdate, 
  onDelete, 
  isLoading 
}: ContentFiltersProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingFilter, setEditingFilter] = React.useState<ContentFilter | null>(null);

  const form = useForm<ContentFilterFormType>({
    resolver: zodResolver(contentFilterSchema),
    defaultValues: {
      deviceId: "",
      category: "social",
      isBlocked: false,
      ageRating: "",
    },
  });

  React.useEffect(() => {
    if (editingFilter) {
      form.reset({
        deviceId: editingFilter.deviceId,
        category: editingFilter.category,
        isBlocked: editingFilter.isBlocked,
        ageRating: editingFilter.ageRating || "",
      });
    } else {
      form.reset({
        deviceId: "",
        category: "social",
        isBlocked: false,
        ageRating: "",
      });
    }
  }, [editingFilter, form]);

  const handleSubmit = (data: ContentFilterFormType) => {
    if (editingFilter) {
      onUpdate(editingFilter.id, data);
    } else {
      onAdd(data);
    }
    setIsDialogOpen(false);
    setEditingFilter(null);
  };

  const handleEdit = (filter: ContentFilter) => {
    setEditingFilter(filter);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingFilter(null);
    form.reset();
  };

  const getDeviceName = (deviceId: string) => {
    return devices.find(d => d.id === deviceId)?.name || 'Unknown Device';
  };

  const getCategoryInfo = (category: ContentFilter['category']) => {
    return contentCategories.find(c => c.value === category) || contentCategories[0];
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
          <h3 className="text-lg font-semibold">Content Filters</h3>
          <p className="text-sm text-muted-foreground">
            Block or allow content categories based on age-appropriateness
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Filter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFilter ? 'Edit Content Filter' : 'Add Content Filter'}
              </DialogTitle>
              <DialogDescription>
                Configure content filtering for specific categories
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {contentCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <span>{category.icon}</span>
                                <span>{category.label}</span>
                              </div>
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
                  name="ageRating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Rating (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 13+, 18+" {...field} />
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
                        <FormLabel className="text-base">Block Content</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Block access to this content category
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
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingFilter ? 'Update' : 'Add'} Filter
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {filters.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Content Filters</h3>
            <p className="text-muted-foreground mb-4">
              Add content filters to control what types of content can be accessed.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filters.map((filter) => {
            const categoryInfo = getCategoryInfo(filter.category);
            return (
              <Card key={filter.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                        <span className="text-lg">{categoryInfo.icon}</span>
                      </div>
                      <div>
                        <h4 className="font-medium">{categoryInfo.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {getDeviceName(filter.deviceId)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {filter.isBlocked ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Blocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Allowed
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {filter.ageRating && (
                    <div className="mb-3">
                      <Badge variant="secondary" className="text-xs">
                        Age Rating: {filter.ageRating}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(filter)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(filter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}