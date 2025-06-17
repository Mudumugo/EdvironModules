import { useState } from "react";
import { useRole, useUsers } from "@/hooks/useRole";
import { RoleGuard, AdminOnly } from "@/components/RoleGuard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  GraduationCap,
  Shield,
  Settings,
  BookOpen
} from "lucide-react";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { role: currentUserRole } = useRole();
  const { users, availableRoles, isLoading } = useUsers();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUserRoleMutation = useMutation({
    mutationFn: async ({ userId, role, gradeLevel, department }: any) => {
      return await apiRequest("PUT", `/api/users/${userId}/role`, {
        role,
        gradeLevel,
        department
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      setIsEditDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive",
      });
    },
  });

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    if (role.includes('student')) return <GraduationCap className="h-4 w-4" />;
    if (role === 'teacher' || role === 'tutor') return <BookOpen className="h-4 w-4" />;
    if (role.includes('admin') || role.includes('principal')) return <Shield className="h-4 w-4" />;
    return <Settings className="h-4 w-4" />;
  };

  const getRoleBadgeColor = (role: string) => {
    if (role.includes('student')) return "bg-blue-100 text-blue-800";
    if (role === 'teacher' || role === 'tutor') return "bg-green-100 text-green-800";
    if (role.includes('admin') || role.includes('principal')) return "bg-purple-100 text-purple-800";
    if (role.includes('security')) return "bg-red-100 text-red-800";
    if (role.includes('it')) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateRole = () => {
    if (!selectedUser) return;

    updateUserRoleMutation.mutate({
      userId: selectedUser.id,
      role: selectedUser.role,
      gradeLevel: selectedUser.gradeLevel,
      department: selectedUser.department
    });
  };

  return (
    <AdminOnly fallback={
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Access Denied</h3>
          <p className="text-muted-foreground">You need administrator privileges to access user management.</p>
        </div>
      </div>
    }>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">
              Manage users, roles, and permissions across your institution
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {availableRoles.map((role: any) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.gradeLevel && (
                          <p className="text-xs text-muted-foreground">
                            Grade: {user.gradeLevel}
                          </p>
                        )}
                        {user.department && (
                          <p className="text-xs text-muted-foreground">
                            Department: {user.department}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.roleDisplayName}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit Role
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No users found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Role</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <Label>User</Label>
                  <p className="font-semibold">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={selectedUser.role}
                    onValueChange={(value) => 
                      setSelectedUser({ ...selectedUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map((role: any) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {role.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedUser.role?.includes('student') && (
                  <div className="space-y-2">
                    <Label htmlFor="gradeLevel">Grade Level</Label>
                    <Input
                      id="gradeLevel"
                      value={selectedUser.gradeLevel || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, gradeLevel: e.target.value })
                      }
                      placeholder="e.g., K, 1, 2, 9, College Year 1"
                    />
                  </div>
                )}

                {(selectedUser.role === 'teacher' || selectedUser.role === 'tutor' || 
                  selectedUser.role?.includes('admin') || selectedUser.role?.includes('staff')) && (
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={selectedUser.department || ""}
                      onChange={(e) =>
                        setSelectedUser({ ...selectedUser, department: e.target.value })
                      }
                      placeholder="e.g., Mathematics, Science, Administration"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateRole}
                    disabled={updateUserRoleMutation.isPending}
                  >
                    {updateUserRoleMutation.isPending ? "Updating..." : "Update Role"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminOnly>
  );
}