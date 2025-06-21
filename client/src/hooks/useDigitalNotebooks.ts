import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export interface Notebook {
  id: string;
  title: string;
  subject: string;
  userId: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  sections: NotebookSection[];
}

export interface NotebookSection {
  id: string;
  title: string;
  notebookId: string;
  order: number;
  pages: NotebookPage[];
}

export interface NotebookPage {
  id: string;
  title: string;
  content: string;
  sectionId: string;
  order: number;
  type: 'text' | 'image' | 'video' | 'audio';
}

export function useDigitalNotebooks() {
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [selectedSection, setSelectedSection] = useState<NotebookSection | null>(null);
  const [selectedPage, setSelectedPage] = useState<NotebookPage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notebooks
  const { data: notebooks = [], isLoading } = useQuery<Notebook[]>({
    queryKey: ['/api/notebooks'],
    queryFn: () => apiRequest('GET', '/api/notebooks'),
    select: (data) => Array.isArray(data) ? data : [],
  });

  // Filter notebooks
  const filteredNotebooks = useMemo(() => {
    return notebooks.filter(notebook => {
      const matchesSearch = !searchTerm || 
        notebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notebook.subject.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSubject = subjectFilter === "all" || notebook.subject === subjectFilter;
      
      return matchesSearch && matchesSubject;
    });
  }, [notebooks, searchTerm, subjectFilter]);

  // Get unique subjects
  const subjects = useMemo(() => {
    const subjectSet = new Set(notebooks.map(nb => nb.subject));
    return Array.from(subjectSet);
  }, [notebooks]);

  // Create notebook mutation
  const createNotebookMutation = useMutation({
    mutationFn: async (data: { title: string; subject: string; isShared?: boolean }) => {
      return apiRequest('POST', '/api/notebooks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      setShowCreateDialog(false);
      toast({
        title: "Notebook created",
        description: "Your new notebook has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create notebook",
        variant: "destructive",
      });
    },
  });

  // Update notebook mutation
  const updateNotebookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Notebook> }) => {
      return apiRequest('PATCH', `/api/notebooks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      toast({
        title: "Notebook updated",
        description: "Your notebook has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update notebook",
        variant: "destructive",
      });
    },
  });

  // Delete notebook mutation
  const deleteNotebookMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/notebooks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      setSelectedNotebook(null);
      toast({
        title: "Notebook deleted",
        description: "The notebook has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notebook",
        variant: "destructive",
      });
    },
  });

  // Create section mutation
  const createSectionMutation = useMutation({
    mutationFn: async (data: { title: string; notebookId: string }) => {
      return apiRequest('POST', '/api/notebook-sections', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      toast({
        title: "Section created",
        description: "New section has been added to your notebook.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create section",
        variant: "destructive",
      });
    },
  });

  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; sectionId: string; type?: string }) => {
      return apiRequest('POST', '/api/notebook-pages', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      toast({
        title: "Page created",
        description: "New page has been added to your section.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create page",
        variant: "destructive",
      });
    },
  });

  return {
    // State
    selectedNotebook,
    selectedSection,
    selectedPage,
    searchTerm,
    subjectFilter,
    viewMode,
    showCreateDialog,
    
    // Data
    notebooks: filteredNotebooks,
    allNotebooks: notebooks,
    subjects,
    isLoading,
    
    // Actions
    setSelectedNotebook,
    setSelectedSection,
    setSelectedPage,
    setSearchTerm,
    setSubjectFilter,
    setViewMode,
    setShowCreateDialog,
    
    // Mutations
    createNotebook: createNotebookMutation.mutate,
    updateNotebook: updateNotebookMutation.mutate,
    deleteNotebook: deleteNotebookMutation.mutate,
    createSection: createSectionMutation.mutate,
    createPage: createPageMutation.mutate,
    
    // Loading states
    isCreatingNotebook: createNotebookMutation.isPending,
    isUpdatingNotebook: updateNotebookMutation.isPending,
    isDeletingNotebook: deleteNotebookMutation.isPending,
    isCreatingSection: createSectionMutation.isPending,
    isCreatingPage: createPageMutation.isPending,
  };
}