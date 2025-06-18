import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LockerHeader, NotebooksTab, ResourcesTab, ResourceViewerDialog, CreateNotebookDialog } from "@/components/locker/modules";
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

  const handleCreateNotebook = (data: { title: string; description: string }) => {
    // Handle notebook creation
    console.log('Creating notebook:', data);
    queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <LockerHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notebooks">Digital Notebooks</TabsTrigger>
          <TabsTrigger value="resources">Saved Resources</TabsTrigger>
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