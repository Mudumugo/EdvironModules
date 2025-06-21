import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface AuthoringStats {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  reviewContent: number;
  totalViews: number;
  avgRating: number;
  revenue: number;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'book' | 'worksheet' | 'video' | 'quiz';
  status: 'published' | 'draft' | 'review';
  views: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  subject: string;
  grade: string;
}

export interface ContentFormData {
  title: string;
  type: string;
  subject: string;
  grade: string;
  description: string;
  content: string;
  status: string;
}

export interface Taxonomy {
  subjects: string[];
  grades: string[];
  contentTypes: string[];
}

export function useAuthoringDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch authoring stats
  const { data: stats, isLoading: statsLoading } = useQuery<AuthoringStats>({
    queryKey: ['/api/authoring/dashboard'],
    queryFn: () => apiRequest('GET', '/api/authoring/dashboard'),
  });

  // Fetch user's content
  const { data: content = [], isLoading: contentLoading } = useQuery<ContentItem[]>({
    queryKey: ['/api/authoring/content'],
    queryFn: () => apiRequest('GET', '/api/authoring/content'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Fetch taxonomy data
  const { data: taxonomy } = useQuery<Taxonomy>({
    queryKey: ['/api/authoring/taxonomy'],
    queryFn: () => apiRequest('GET', '/api/authoring/taxonomy'),
  });

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      return apiRequest('POST', '/api/authoring/content', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/content'] });
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/dashboard'] });
      setShowCreateForm(false);
      toast({
        title: "Content created",
        description: "Your content has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create content",
        variant: "destructive",
      });
    },
  });

  // Update content mutation
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContentFormData> }) => {
      return apiRequest('PATCH', `/api/authoring/content/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/content'] });
      setEditingContent(null);
      toast({
        title: "Content updated",
        description: "Your content has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update content",
        variant: "destructive",
      });
    },
  });

  // Submit for review mutation
  const submitForReviewMutation = useMutation({
    mutationFn: async (contentId: string) => {
      return apiRequest('POST', `/api/authoring/content/${contentId}/submit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/authoring/content'] });
      toast({
        title: "Submitted for review",
        description: "Your content has been submitted for review.",
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

  // Filter content
  const filteredContent = content.filter(item => {
    const matchesSearch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return {
    // State
    activeTab,
    showCreateForm,
    editingContent,
    searchTerm,
    filterType,
    filterStatus,
    
    // Data
    stats,
    content: filteredContent,
    allContent: content,
    taxonomy,
    
    // Loading states
    statsLoading,
    contentLoading,
    isCreating: createContentMutation.isPending,
    isUpdating: updateContentMutation.isPending,
    isSubmitting: submitForReviewMutation.isPending,
    
    // Actions
    setActiveTab,
    setShowCreateForm,
    setEditingContent,
    setSearchTerm,
    setFilterType,
    setFilterStatus,
    
    // Mutations
    createContent: createContentMutation.mutate,
    updateContent: updateContentMutation.mutate,
    submitForReview: submitForReviewMutation.mutate,
  };
}