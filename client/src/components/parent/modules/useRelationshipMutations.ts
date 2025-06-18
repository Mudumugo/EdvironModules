import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { relationshipSchema } from "./RelationshipCreateDialog";
import { ParentChildRelationship } from "./RelationshipTable";

export function useRelationshipMutations() {
  const { toast } = useToast();

  const handleUnauthorizedError = () => {
    toast({
      title: "Unauthorized",
      description: "You are logged out. Logging in again...",
      variant: "destructive",
    });
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 500);
  };

  const createRelationshipMutation = useMutation({
    mutationFn: async (relationshipData: z.infer<typeof relationshipSchema>) => {
      return apiRequest("POST", "/api/admin/parent-relationships", relationshipData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/parent-relationships'] });
      toast({
        title: "Success",
        description: "Parent-child relationship created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorizedError();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create relationship",
        variant: "destructive",
      });
    }
  });

  const updateRelationshipMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ParentChildRelationship> }) => {
      return apiRequest("PUT", `/api/admin/parent-relationships/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/parent-relationships'] });
      toast({
        title: "Success",
        description: "Relationship updated successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        handleUnauthorizedError();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update relationship",
        variant: "destructive",
      });
    }
  });

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
        handleUnauthorizedError();
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete relationship",
        variant: "destructive",
      });
    }
  });

  return {
    createRelationshipMutation,
    updateRelationshipMutation,
    deleteRelationshipMutation
  };
}