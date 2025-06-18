import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  LockerStats,
  LockerSearch,
  LockerNotebook,
  LockerResources,
  LockerBookmarks,
  LockerItem,
  LockerSearchFilters,
  LockerStats as StatsType
} from "@/components/locker";

export default function MyLockerNew() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<LockerSearchFilters>({
    type: "all",
    subject: "all",
    grade: "all",
    tags: [],
    dateRange: "all",
    favorites: false,
    archived: false
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stats } = useQuery<StatsType>({
    queryKey: ['/api/locker/stats'],
  });

  const { data: items = [] } = useQuery<LockerItem[]>({
    queryKey: ['/api/locker/items'],
  });

  const itemMutations = useMutation({
    mutationFn: async ({ action, id, data }: { action: string; id?: number; data?: any }) => {
      switch (action) {
        case 'delete':
          return await apiRequest("DELETE", `/api/locker/items/${id}`);
        case 'favorite':
          return await apiRequest("PATCH", `/api/locker/items/${id}/favorite`);
        case 'create':
          return await apiRequest("POST", `/api/locker/items`, data);
        case 'update':
          return await apiRequest("PATCH", `/api/locker/items/${id}`, data);
        default:
          throw new Error('Unknown action');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/locker/stats'] });
      toast({
        title: "Success",
        description: "Action completed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete action",
        variant: "destructive",
      });
    }
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filters.type !== "all" && item.itemType !== filters.type) {
        return false;
      }
      if (filters.subject !== "all" && item.subject !== filters.subject) {
        return false;
      }
      if (filters.grade !== "all" && item.gradeLevel !== filters.grade) {
        return false;
      }
      if (filters.favorites && !item.isFavorite) {
        return false;
      }
      if (filters.archived !== item.isArchived) {
        return false;
      }
      return true;
    });
  }, [items, searchTerm, filters]);

  const notebooks = filteredItems.filter(item => item.itemType === 'notebook');
  const resources = filteredItems.filter(item => item.itemType === 'resource');
  const bookmarks = filteredItems.filter(item => item.itemType === 'bookmark');

  const handleItemAction = (action: string, id: number, data?: any) => {
    itemMutations.mutate({ action, id, data });
  };

  const handleClearFilters = () => {
    setFilters({
      type: "all",
      subject: "all", 
      grade: "all",
      tags: [],
      dateRange: "all",
      favorites: false,
      archived: false
    });
    setSearchTerm("");
  };

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Locker</h1>
          <p className="text-muted-foreground">Your personal collection of notes, resources, and bookmarks</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      <LockerStats stats={stats} />

      <LockerSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Items ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="notebooks">Notebooks ({notebooks.length})</TabsTrigger>
          <TabsTrigger value="resources">Resources ({resources.length})</TabsTrigger>
          <TabsTrigger value="bookmarks">Bookmarks ({bookmarks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No items found matching your criteria
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.itemType}</p>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="notebooks">
          <LockerNotebook
            notebooks={notebooks}
            onView={(id) => handleItemAction('view', id)}
            onEdit={(id) => handleItemAction('edit', id)}
            onDelete={(id) => handleItemAction('delete', id)}
            onToggleFavorite={(id) => handleItemAction('favorite', id)}
            onShare={(id) => handleItemAction('share', id)}
          />
        </TabsContent>

        <TabsContent value="resources">
          <LockerResources
            resources={resources}
            onView={(id) => handleItemAction('view', id)}
            onDownload={(id) => handleItemAction('download', id)}
            onDelete={(id) => handleItemAction('delete', id)}
            onToggleFavorite={(id) => handleItemAction('favorite', id)}
          />
        </TabsContent>

        <TabsContent value="bookmarks">
          <LockerBookmarks
            bookmarks={bookmarks}
            onView={(id) => handleItemAction('view', id)}
            onOpen={(id) => handleItemAction('open', id)}
            onDelete={(id) => handleItemAction('delete', id)}
            onToggleFavorite={(id) => handleItemAction('favorite', id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}