import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LockerHeader, NotebooksTab, ResourcesTab, ResourceViewerDialog, CreateNotebookDialog } from "@/components/locker/modules";
import Calculator from "@/components/locker/tools/Calculator";
import Dictionary from "@/components/locker/tools/Dictionary";
import type { LockerItem } from "@shared/schema";

interface NotebookData {
  id: number;
  title: string;
  description?: string;
  color?: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  subjects?: any[];
}

export default function MyLocker() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [activeTab, setActiveTab] = useState("notebooks");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLockerItem, setSelectedLockerItem] = useState<LockerItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);

  // Data fetching
  const { data: notebooks = [], isLoading: isLoadingNotebooks } = useQuery({
    queryKey: ['/api/notebooks'],
  });

  const { data: lockerItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['/api/locker/items'],
  });

  const handleViewItem = (item: LockerItem) => {
    setSelectedLockerItem(item);
    setIsViewerOpen(true);
  };

  const createNotebook = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      const response = await apiRequest('/api/notebooks', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      toast({
        title: "Notebook Created",
        description: "Your new notebook has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to create notebook. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateNotebook = (data: { title: string; description: string }) => {
    createNotebook.mutate(data);
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      <LockerHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
          <TabsTrigger value="notebooks" className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <span className="hidden sm:inline">Digital </span>Notebooks
          </TabsTrigger>
          <TabsTrigger value="resources" className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <span className="hidden sm:inline">Saved </span>Resources
          </TabsTrigger>
          <TabsTrigger value="calculator" className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Calculator
          </TabsTrigger>
          <TabsTrigger value="dictionary" className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Dictionary
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notebooks" className="space-y-4">
          <NotebooksTab
            notebooks={notebooks as NotebookData[]}
            isLoading={isLoadingNotebooks}
            onCreateNotebook={() => setIsCreateNotebookOpen(true)}
          />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourcesTab
            lockerItems={lockerItems as LockerItem[]}
            isLoading={isLoadingItems}
            onViewItem={handleViewItem}
          />
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
          <Calculator />
        </TabsContent>

        <TabsContent value="dictionary" className="space-y-4">
          <Dictionary />
        </TabsContent>

        <TabsContent value="dictionary" className="space-y-4">
          <Dictionary />
        </TabsContent>
      </Tabs>

      <ResourceViewerDialog
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        item={selectedLockerItem}
      />

      <CreateNotebookDialog
        isOpen={isCreateNotebookOpen}
        onClose={() => setIsCreateNotebookOpen(false)}
        onCreate={handleCreateNotebook}
      />
    </div>
  );
}