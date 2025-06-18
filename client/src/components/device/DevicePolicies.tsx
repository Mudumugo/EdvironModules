import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Shield, Clock, Users, Smartphone, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DevicePolicy {
  id: number;
  name: string;
  description: string;
  targetType: string;
  targetIds: string[];
  policyType: string;
  rules: any;
  isActive: boolean;
  priority: number;
  effectiveFrom: string;
  effectiveTo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface PolicyFormData {
  name: string;
  description: string;
  targetType: string;
  targetIds: string[];
  policyType: string;
  rules: any;
  priority: number;
  effectiveFrom: string;
  effectiveTo: string;
}

const POLICY_TYPES = [
  { value: 'app_restriction', label: 'Application Restrictions', icon: Shield },
  { value: 'content_filter', label: 'Content Filtering', icon: Shield },
  { value: 'screen_time', label: 'Screen Time Limits', icon: Clock },
  { value: 'location', label: 'Location Controls', icon: Smartphone }
];

const TARGET_TYPES = [
  { value: 'all', label: 'All Devices' },
  { value: 'user', label: 'Specific Users' },
  { value: 'group', label: 'Device Groups' },
  { value: 'device_type', label: 'Device Types' }
];

export default function DevicePolicies() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<DevicePolicy | null>(null);
  const [formData, setFormData] = useState<PolicyFormData>({
    name: '',
    description: '',
    targetType: 'all',
    targetIds: [],
    policyType: 'app_restriction',
    rules: {},
    priority: 1,
    effectiveFrom: '',
    effectiveTo: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: policies = [], isLoading } = useQuery<DevicePolicy[]>({
    queryKey: ['/api/device-policies'],
    retry: false,
  });

  const { data: violations = [] } = useQuery<any[]>({
    queryKey: ['/api/compliance-violations'],
    retry: false,
  });

  const createPolicyMutation = useMutation({
    mutationFn: async (policyData: PolicyFormData) => {
      return apiRequest("POST", "/api/device-policies", policyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-policies"] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: "Policy Created",
        description: "Device policy has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create policy. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePolicyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PolicyFormData> }) => {
      return apiRequest("PUT", `/api/device-policies/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-policies"] });
      setEditingPolicy(null);
      resetForm();
      toast({
        title: "Policy Updated",
        description: "Device policy has been updated successfully.",
      });
    }
  });

  const deletePolicyMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/device-policies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-policies"] });
      toast({
        title: "Policy Deleted",
        description: "Device policy has been deleted successfully.",
      });
    }
  });

  const togglePolicyMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
      return apiRequest("PUT", `/api/device-policies/${id}/toggle`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/device-policies"] });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      targetType: 'all',
      targetIds: [],
      policyType: 'app_restriction',
      rules: {},
      priority: 1,
      effectiveFrom: '',
      effectiveTo: ''
    });
  };

  const handleSubmit = () => {
    if (editingPolicy) {
      updatePolicyMutation.mutate({ id: editingPolicy.id, data: formData });
    } else {
      createPolicyMutation.mutate(formData);
    }
  };

  const handleEdit = (policy: DevicePolicy) => {
    setEditingPolicy(policy);
    setFormData({
      name: policy.name,
      description: policy.description,
      targetType: policy.targetType,
      targetIds: policy.targetIds,
      policyType: policy.policyType,
      rules: policy.rules,
      priority: policy.priority,
      effectiveFrom: policy.effectiveFrom ? policy.effectiveFrom.split('T')[0] : '',
      effectiveTo: policy.effectiveTo ? policy.effectiveTo.split('T')[0] : ''
    });
    setIsCreateDialogOpen(true);
  };

  const getPolicyTypeIcon = (type: string) => {
    const policyType = POLICY_TYPES.find(pt => pt.value === type);
    return policyType ? policyType.icon : Shield;
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    if (priority >= 5) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Device Policies</h3>
          <p className="text-sm text-muted-foreground">
            Manage device access controls and restrictions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPolicy(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Policy
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
              </DialogTitle>
              <DialogDescription>
                Configure device restrictions and access controls
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                <TabsTrigger value="rules">Policy Rules</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Policy Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter policy name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyType">Policy Type</Label>
                    <Select
                      value={formData.policyType}
                      onValueChange={(value) => setFormData({ ...formData, policyType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {POLICY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter policy description"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetType">Target Type</Label>
                    <Select
                      value={formData.targetType}
                      onValueChange={(value) => setFormData({ ...formData, targetType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TARGET_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority (1-10)</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="effectiveFrom">Effective From</Label>
                    <Input
                      id="effectiveFrom"
                      type="date"
                      value={formData.effectiveFrom}
                      onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effectiveTo">Effective To</Label>
                    <Input
                      id="effectiveTo"
                      type="date"
                      value={formData.effectiveTo}
                      onChange={(e) => setFormData({ ...formData, effectiveTo: e.target.value })}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="rules" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Policy rule configuration will be implemented based on policy type</p>
                  <p className="text-sm">Advanced rule builder coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.name || createPolicyMutation.isPending || updatePolicyMutation.isPending}>
                {editingPolicy ? 'Update Policy' : 'Create Policy'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="policies">Active Policies</TabsTrigger>
          <TabsTrigger value="violations" className="relative">
            Violations
            {violations.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">
                {violations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          {policies.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Policies Created</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first device policy to start managing device access and restrictions.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Policy
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {policies.map((policy: DevicePolicy) => {
                const PolicyIcon = getPolicyTypeIcon(policy.policyType);
                return (
                  <Card key={policy.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <PolicyIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{policy.name}</h4>
                            <p className="text-sm text-muted-foreground">{policy.description}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(policy.priority)}>
                            Priority {policy.priority}
                          </Badge>
                          <Badge variant={policy.isActive ? "default" : "secondary"}>
                            {policy.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Switch
                            checked={policy.isActive}
                            onCheckedChange={(checked) => 
                              togglePolicyMutation.mutate({ id: policy.id, isActive: checked })
                            }
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(policy)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePolicyMutation.mutate(policy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {policy.targetType === 'all' ? 'All Devices' : `${policy.targetType}`}
                          </span>
                          <span>
                            {POLICY_TYPES.find(pt => pt.value === policy.policyType)?.label}
                          </span>
                        </div>
                        <span>
                          Created {new Date(policy.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          {violations.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Violations Detected</h3>
                <p className="text-muted-foreground">
                  All devices are compliant with current policies.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {violations.map((violation: any) => (
                <Card key={violation.id} className="border-l-4 border-l-red-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-red-900 dark:text-red-100">
                          {violation.violationType.replace('_', ' ').toUpperCase()}
                        </h4>
                        <p className="text-sm text-muted-foreground">{violation.description}</p>
                      </div>
                      <Badge variant="destructive">{violation.severity}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Detected on {new Date(violation.detectedAt).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}