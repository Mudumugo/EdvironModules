import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  NotebookPen, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Download, 
  Trash2, 
  FileText, 
  Archive,
  BookmarkPlus
} from "lucide-react";
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

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'resource': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'bookmark': return <BookmarkPlus className="h-5 w-5 text-green-500" />;
      case 'notebook': return <BookOpen className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            My Locker
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your digital notebooks and saved library resources
          </p>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your locker..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notebooks">Digital Notebooks</TabsTrigger>
          <TabsTrigger value="resources">Saved Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="notebooks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Digital Notebooks ({(notebooks as NotebookData[]).length})</h2>
            <Button onClick={() => setIsCreateNotebookOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Notebook
            </Button>
          </div>
          
          {isLoadingNotebooks ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(notebooks as NotebookData[]).map((notebook: NotebookData) => (
                <Card key={notebook.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <NotebookPen className="h-5 w-5 text-blue-600" />
                        <Badge variant="secondary">Notebook</Badge>
                      </div>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg">{notebook.title}</CardTitle>
                    {notebook.description && (
                      <CardDescription className="line-clamp-2">
                        {notebook.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>
                        {notebook.subjects?.length || 0} subjects
                      </span>
                      <span>{new Date(notebook.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Open
                      </Button>
                      {notebook.isShared && (
                        <Badge variant="outline" className="text-xs">
                          Shared
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoadingNotebooks && (notebooks as NotebookData[]).length === 0 && (
            <div className="text-center py-12">
              <NotebookPen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No notebooks yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Create your first digital notebook to organize your study materials.
              </p>
              <Button onClick={() => setIsCreateNotebookOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Notebook
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Saved Resources ({(lockerItems as LockerItem[]).length})</h2>
          </div>
          
          {isLoadingItems ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(lockerItems as LockerItem[]).map((item: LockerItem) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getItemIcon(item.itemType)}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                          {item.description && (
                            <CardDescription className="text-xs mt-1 line-clamp-2">
                              {item.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {item.thumbnailUrl && (
                      <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md mb-3 overflow-hidden">
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>{item.category || 'General'}</span>
                      <span>{item.views} views</span>
                    </div>
                    
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{item.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {item.fileUrl && (
                          <Button size="sm" variant="ghost">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {!isLoadingItems && (lockerItems as LockerItem[]).length === 0 && (
            <div className="text-center py-12">
              <Archive className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No saved resources yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Save annotated resources from the digital library to access them here.
              </p>
              <Button variant="outline">
                Browse Library
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Resource Viewer Dialog */}
      {selectedLockerItem && (
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedLockerItem.title}</DialogTitle>
              <DialogDescription>
                {(selectedLockerItem.metadata as any)?.notes || (selectedLockerItem.metadata as any)?.originalTitle || 'Saved resource'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedLockerItem.content && (
                <div 
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: selectedLockerItem.content || '' }}
                />
              )}
              {(selectedLockerItem.metadata as any)?.annotations && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Your Annotations</h4>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {typeof (selectedLockerItem.metadata as any).annotations === 'string' 
                        ? (selectedLockerItem.metadata as any).annotations 
                        : JSON.stringify((selectedLockerItem.metadata as any).annotations, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
              {(selectedLockerItem.metadata as any)?.subject && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Subject:</span>
                  <Badge variant="outline">{(selectedLockerItem.metadata as any).subject}</Badge>
                </div>
              )}
              {(selectedLockerItem.metadata as any)?.gradeLevel && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Grade Level:</span>
                  <Badge variant="outline">{(selectedLockerItem.metadata as any).gradeLevel}</Badge>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Notebook Dialog */}
      <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
            <DialogDescription>
              Create a new digital notebook to organize your study materials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Notebook title..." />
            <Input placeholder="Description (optional)..." />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateNotebookOpen(false)}>
                Cancel
              </Button>
              <Button>
                Create Notebook
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}