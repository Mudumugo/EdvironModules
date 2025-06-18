import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import {
  RelationshipHeader,
  RelationshipSearch,
  RelationshipTable,
  RelationshipCreateDialog,
  useRelationshipMutations,
  relationshipSchema,
  type ParentChildRelationship
} from "@/components/parent/modules";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export default function ParentPortalAdmin() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRelationship, setEditingRelationship] = useState<ParentChildRelationship | null>(null);

  // Fetch parent-child relationships
  const { data: relationships = [], isLoading: relationshipsLoading } = useQuery<ParentChildRelationship[]>({
    queryKey: ['/api/admin/parent-relationships'],
    retry: false,
  });

  // Fetch all users for dropdowns
  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ['/api/users/all'],
    retry: false,
  });

  // Filter users by role
  const parentUsers = allUsers.filter(user => user.role === 'parent');
  const studentUsers = allUsers.filter(user => user.role?.startsWith('student_'));

  // Create relationship mutation
  const createRelationshipMutation = useMutation({
    mutationFn: async (relationshipData: z.infer<typeof relationshipSchema>) => {
      return apiRequest("POST", "/api/admin/parent-relationships", relationshipData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/parent-relationships'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Parent-child relationship created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create relationship",
        variant: "destructive",
      });
    }
  });

  // Update relationship mutation
  const updateRelationshipMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ParentChildRelationship> }) => {
      return apiRequest("PUT", `/api/admin/parent-relationships/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/parent-relationships'] });
      setEditingRelationship(null);
      toast({
        title: "Success",
        description: "Relationship updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update relationship",
        variant: "destructive",
      });
    }
  });

  // Delete relationship mutation
  const deleteRelationshipMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/parent-relationships/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/parent-relationships'] });
      toast({
        title: "Success",
        description: "Relationship deleted successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete relationship",
        variant: "destructive",
      });
    }
  });

  // Form for creating relationships
  const createForm = useForm<z.infer<typeof relationshipSchema>>({
    resolver: zodResolver(relationshipSchema),
    defaultValues: {
      relationship: "parent",
      isPrimary: false,
      canViewGrades: true,
      canViewAttendance: true,
      canReceiveNotifications: true
    }
  });

  const onCreateSubmit = (data: z.infer<typeof relationshipSchema>) => {
    createRelationshipMutation.mutate(data);
  };

  const handleDeleteRelationship = (id: number) => {
    if (confirm("Are you sure you want to delete this relationship?")) {
      deleteRelationshipMutation.mutate(id);
    }
  };

  const handlePermissionToggle = (relationship: ParentChildRelationship, field: string, value: boolean) => {
    updateRelationshipMutation.mutate({
      id: relationship.id,
      data: { [field]: value }
    });
  };

  const filteredRelationships = relationships.filter(relationship =>
    searchTerm === "" ||
    relationship.parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relationship.parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    relationship.parent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (relationshipsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Portal Administration</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage parent-child relationships and portal access permissions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Relationship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Parent-Child Relationship</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={createForm.control}
                    name="parentUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select parent" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {parentUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createForm.control}
                    name="childUserId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select child" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {studentUsers.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={createForm.control}
                  name="relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="guardian">Guardian</SelectItem>
                          <SelectItem value="emergency_contact">Emergency Contact</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={createForm.control}
                    name="isPrimary"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Primary Contact</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Designated as the primary contact for this child
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
                    control={createForm.control}
                    name="canViewGrades"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">View Grades</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Can access child's academic grades and scores
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
                    control={createForm.control}
                    name="canViewAttendance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">View Attendance</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Can access child's attendance records
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
                    control={createForm.control}
                    name="canReceiveNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Receive Notifications</FormLabel>
                          <div className="text-sm text-muted-foreground">
                            Will receive notifications about child's activities
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
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createRelationshipMutation.isPending}>
                    {createRelationshipMutation.isPending ? "Creating..." : "Create Relationship"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search by parent name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="gap-1">
              <Users className="w-3 h-3" />
              {filteredRelationships.length} relationships
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Relationships table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Parent-Child Relationships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent</TableHead>
                <TableHead>Child</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Primary</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRelationships.map((relationship) => (
                <TableRow key={relationship.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {relationship.parent.firstName} {relationship.parent.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{relationship.parent.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{relationship.childUserId}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={relationship.relationship === 'parent' ? 'default' : 'secondary'}>
                      {relationship.relationship.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {relationship.isPrimary && (
                      <Badge variant="outline" className="gap-1">
                        <Shield className="w-3 h-3" />
                        Primary
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Switch
                        checked={relationship.canViewGrades}
                        onCheckedChange={(checked) => 
                          handlePermissionToggle(relationship, 'canViewGrades', checked)
                        }
                        disabled={updateRelationshipMutation.isPending}
                      />
                      <span className="text-xs">Grades</span>
                      <Switch
                        checked={relationship.canViewAttendance}
                        onCheckedChange={(checked) => 
                          handlePermissionToggle(relationship, 'canViewAttendance', checked)
                        }
                        disabled={updateRelationshipMutation.isPending}
                      />
                      <span className="text-xs">Attendance</span>
                      <Switch
                        checked={relationship.canReceiveNotifications}
                        onCheckedChange={(checked) => 
                          handlePermissionToggle(relationship, 'canReceiveNotifications', checked)
                        }
                        disabled={updateRelationshipMutation.isPending}
                      />
                      <span className="text-xs">Notifications</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRelationship(relationship)}
                        className="gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteRelationship(relationship.id)}
                        disabled={deleteRelationshipMutation.isPending}
                        className="gap-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredRelationships.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No parent-child relationships found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}