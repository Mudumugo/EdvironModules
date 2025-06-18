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

  // Use relationship mutations hook
  const { createRelationshipMutation, updateRelationshipMutation, deleteRelationshipMutation } = useRelationshipMutations();

  const onCreateSubmit = (data: z.infer<typeof relationshipSchema>) => {
    createRelationshipMutation.mutate(data, {
      onSuccess: () => setIsCreateDialogOpen(false)
    });
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
      <RelationshipHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
      
      <RelationshipSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        relationshipCount={filteredRelationships.length}
      />

      <RelationshipTable
        relationships={filteredRelationships}
        onPermissionToggle={handlePermissionToggle}
        onEdit={setEditingRelationship}
        onDelete={handleDeleteRelationship}
        isUpdating={updateRelationshipMutation.isPending}
        isDeleting={deleteRelationshipMutation.isPending}
      />

      <RelationshipCreateDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={onCreateSubmit}
        parentUsers={parentUsers}
        studentUsers={studentUsers}
        isCreating={createRelationshipMutation.isPending}
      />
    </div>
  );
}