import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface BookProject {
  id: string;
  title: string;
  subject: string;
  grade: string;
  status: 'draft' | 'review' | 'published';
  chapters: Chapter[];
  metadata: BookMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  pages: Page[];
}

export interface Page {
  id: string;
  content: string;
  order: number;
  type: 'text' | 'image' | 'interactive';
}

export interface BookMetadata {
  author: string;
  description: string;
  isbn?: string;
  language: string;
  targetAge: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  keywords: string[];
}

export function useBookAuthoring() {
  const [selectedProject, setSelectedProject] = useState<BookProject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch book projects
  const { data: projects = [], isLoading } = useQuery<BookProject[]>({
    queryKey: ['/api/authoring/projects'],
    queryFn: () => apiRequest('GET', '/api/authoring/projects'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { title: string; subject: string; grade: string; metadata: Partial<BookMetadata> }) => {
      return apiRequest('POST', '/api/authoring/projects', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/projects'] });
      setShowCreateDialog(false);
      toast({
        title: "Project created",
        description: "Your book project has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BookProject> }) => {
      return apiRequest('PATCH', `/api/authoring/projects/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/projects'] });
      toast({
        title: "Project updated",
        description: "Your project has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  // Create chapter mutation
  const createChapterMutation = useMutation({
    mutationFn: async (data: { title: string; projectId: string; order?: number }) => {
      return apiRequest('POST', '/api/authoring/chapters', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/projects'] });
      toast({
        title: "Chapter created",
        description: "New chapter has been added to your book.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create chapter",
        variant: "destructive",
      });
    },
  });

  // Update chapter mutation
  const updateChapterMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Chapter> }) => {
      return apiRequest('PATCH', `/api/authoring/chapters/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/projects'] });
      toast({
        title: "Chapter updated",
        description: "Chapter has been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update chapter",
        variant: "destructive",
      });
    },
  });

  // Submit for review mutation
  const submitForReviewMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return apiRequest('POST', `/api/authoring/projects/${projectId}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/projects'] });
      toast({
        title: "Submitted for review",
        description: "Your book has been submitted for editorial review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit for review",
        variant: "destructive",
      });
    },
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return apiRequest('POST', `/api/authoring/projects/${projectId}/publish`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/projects'] });
      toast({
        title: "Book published",
        description: "Your book is now available in the digital library.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to publish book",
        variant: "destructive",
      });
    },
  });

  return {
    // State
    selectedProject,
    selectedChapter,
    currentStep,
    showCreateDialog,
    isPreviewMode,
    
    // Data
    projects,
    isLoading,
    
    // Actions
    setSelectedProject,
    setSelectedChapter,
    setCurrentStep,
    setShowCreateDialog,
    setIsPreviewMode,
    
    // Mutations
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    createChapter: createChapterMutation.mutate,
    updateChapter: updateChapterMutation.mutate,
    submitForReview: submitForReviewMutation.mutate,
    publish: publishMutation.mutate,
    
    // Loading states
    isCreatingProject: createProjectMutation.isPending,
    isUpdatingProject: updateProjectMutation.isPending,
    isCreatingChapter: createChapterMutation.isPending,
    isUpdatingChapter: updateChapterMutation.isPending,
    isSubmitting: submitForReviewMutation.isPending,
    isPublishing: publishMutation.isPending,
  };
}