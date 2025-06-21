import { useDevicePolicies } from "@/hooks/useDevicePolicies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter, Shield, Settings, Play, Pause, Trash2 } from "lucide-react";

export function DevicePolicies() {
  const {
    selectedPolicy,
    setSelectedPolicy,
    showCreateDialog,
    setShowCreateDialog,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    policies,
    isLoading,
    createPolicy,
    updatePolicy,
    deletePolicy,
    deployPolicy,
    isCreating,
    isUpdating,
    isDeleting,
    isDeploying
  } = useDevicePolicies();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'usage':
        return <Settings className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Device Policies</h1>
          <p className="text-gray-600">Manage security and usage policies for school devices</p>
        </div>
        
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Policy
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="usage">Usage</SelectItem>
              <SelectItem value="content">Content</SelectItem>
              <SelectItem value="network">Network</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy) => (
          <Card key={policy.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(policy.type)}
                  <CardTitle className="text-lg">{policy.name}</CardTitle>
                </div>
                <Badge className={getStatusColor(policy.status)}>
                  {policy.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {policy.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{policy.rules.length} rules</span>
                  <span>{policy.targetDevices.length} devices</span>
                </div>

                <div className="flex items-center space-x-2">
                  {policy.status === 'active' ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updatePolicy({ id: policy.id, data: { status: 'inactive' } })}
                      disabled={isUpdating}
                    >
                      <Pause className="h-3 w-3 mr-1" />
                      Pause
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => deployPolicy(policy.id)}
                      disabled={isDeploying}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Deploy
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedPolicy(policy)}
                  >
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePolicy(policy.id)}
                    disabled={isDeleting}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {policies.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No policies found</h3>
          <p className="text-gray-500">Create your first device policy to get started.</p>
        </div>
      )}
    </div>
  );
}