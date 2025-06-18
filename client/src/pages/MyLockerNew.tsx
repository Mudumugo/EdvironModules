import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Edit, 
  FileText, 
  Image, 
  Video, 
  Music,
  Star,
  Clock,
  Tag,
  Folder,
  Archive,
  Share2
} from "lucide-react";

interface LockerItem {
  id: number;
  userId: string;
  itemType: 'notebook' | 'resource' | 'bookmark';
  title: string;
  description?: string;
  originalResourceId?: number;
  content?: string;
  annotations?: any;
  metadata?: any;
  fileUrl?: string;
  thumbnailUrl?: string;
  tags?: string[];
  category?: string;
  subject?: string;
  gradeLevel?: string;
  isPrivate: boolean;
  isOfflineAvailable: boolean;
  sizeMb?: number;
  views: number;
  lastAccessed?: string;
  createdAt: string;
  updatedAt: string;
}

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
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<LockerItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isCreateNotebookOpen, setIsCreateNotebookOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch locker items (saved resources)
  const { data: lockerItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['/api/locker/items', { type: activeTab, category: selectedCategory, search: searchTerm }],
    enabled: true
  });

  // Fetch notebooks
  const { data: notebooks = [], isLoading: isLoadingNotebooks } = useQuery({
    queryKey: ['/api/notebooks'],
    enabled: true
  });

  // Delete locker item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("DELETE", `/api/locker/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/items'] });
      toast({
        title: "Success",
        description: "Item removed from locker successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove item from locker",
        variant: "destructive"
      });
    }
  });

  // Create notebook mutation
  const createNotebookMutation = useMutation({
    mutationFn: async (data: { title: string; description?: string; color?: string }) => {
      const response = await apiRequest("POST", "/api/notebooks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notebooks'] });
      setIsCreateNotebookOpen(false);
      toast({
        title: "Success",
        description: "Notebook created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create notebook",
        variant: "destructive"
      });
    }
  });

  // Update access tracking
  const trackAccessMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest("POST", `/api/locker/items/${itemId}/access`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/items'] });
    }
  });

  const handleViewItem = (item: LockerItem) => {
    setSelectedItem(item);
    setIsViewerOpen(true);
    trackAccessMutation.mutate(item.id);
  };

  const handleDeleteItem = (itemId: number) => {
    deleteItemMutation.mutate(itemId);
  };

  const getItemIcon = (itemType: string, category?: string) => {
    if (itemType === 'notebook') return <NotebookPen className="h-4 w-4" />;
    
    switch (category?.toLowerCase()) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (sizeMb?: number) => {
    if (!sizeMb) return "Unknown size";
    if (sizeMb < 1) return `${(sizeMb * 1024).toFixed(0)} KB`;
    return `${sizeMb.toFixed(1)} MB`;
  };

  const categories = ['all', 'textbook', 'worksheet', 'quiz', 'video', 'audio', 'reference'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Locker
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your personal collection of notebooks and saved learning resources
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your locker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="notebook">Digital Notebooks</TabsTrigger>
            <TabsTrigger value="resource">Saved Resources</TabsTrigger>
            <TabsTrigger value="bookmark">Bookmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">All Items ({lockerItems.length + notebooks.length})</h2>
              <Button onClick={() => setIsCreateNotebookOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Notebook
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Digital Notebooks */}
              {notebooks.map((notebook: NotebookData) => (
                <Card key={`notebook-${notebook.id}`} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <NotebookPen className="h-5 w-5 text-blue-600" />
                        <Badge variant="secondary">Notebook</Badge>
                      </div>
                      {notebook.isShared && <Share2 className="h-4 w-4 text-green-600" />}
                    </div>
                    <CardTitle className="text-lg">{notebook.title}</CardTitle>
                    <CardDescription>{notebook.description || "Personal notebook"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {notebook.subjects?.length || 0} subjects
                      </span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Saved Resources */}
              {lockerItems.map((item: LockerItem) => (
                <Card key={`item-${item.id}`} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getItemIcon(item.itemType, item.category)}
                        <Badge variant="outline">{item.category || 'Resource'}</Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.isOfflineAvailable && <Download className="h-4 w-4 text-green-600" />}
                        {item.isPrivate && <Archive className="h-4 w-4 text-orange-600" />}
                      </div>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {item.lastAccessed ? new Date(item.lastAccessed).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                        <span>{formatFileSize(item.sizeMb)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-600">
                          {item.subject} • {item.gradeLevel}
                        </span>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewItem(item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {lockerItems.length === 0 && notebooks.length === 0 && (
              <div className="text-center py-12">
                <Folder className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your locker is empty
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by creating a notebook or saving resources from the digital library
                </p>
                <Button onClick={() => setIsCreateNotebookOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Notebook
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notebook">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Digital Notebooks ({notebooks.length})</h2>
              <Button onClick={() => setIsCreateNotebookOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Notebook
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notebooks.map((notebook: NotebookData) => (
                <Card key={notebook.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <NotebookPen className="h-6 w-6 text-blue-600" />
                      {notebook.isShared && <Share2 className="h-4 w-4 text-green-600" />}
                    </div>
                    <CardTitle>{notebook.title}</CardTitle>
                    <CardDescription>{notebook.description || "Personal notebook"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {notebook.subjects?.length || 0} subjects
                      </span>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resource">
            <h2 className="text-2xl font-semibold mb-4">Saved Resources ({lockerItems.filter(item => item.itemType === 'resource').length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockerItems.filter(item => item.itemType === 'resource').map((item: LockerItem) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {getItemIcon(item.itemType, item.category)}
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">
                          {item.subject} • {item.gradeLevel}
                        </span>
                        <div className="flex gap-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewItem(item)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookmark">
            <h2 className="text-2xl font-semibold mb-4">Bookmarks ({lockerItems.filter(item => item.itemType === 'bookmark').length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockerItems.filter(item => item.itemType === 'bookmark').map((item: LockerItem) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <Badge variant="outline">Bookmark</Badge>
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600">
                        {item.subject} • {item.gradeLevel}
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Notebook Dialog */}
        <Dialog open={isCreateNotebookOpen} onOpenChange={setIsCreateNotebookOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Notebook</DialogTitle>
              <DialogDescription>
                Create a new digital notebook to organize your notes and studies
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              createNotebookMutation.mutate({
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                color: formData.get('color') as string
              });
            }}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Notebook Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter notebook title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what this notebook is for"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Color Theme</Label>
                  <Select name="color" defaultValue="blue">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="orange">Orange</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateNotebookOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createNotebookMutation.isPending}>
                    {createNotebookMutation.isPending ? "Creating..." : "Create Notebook"}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Item Viewer Dialog */}
        <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>{selectedItem?.title}</DialogTitle>
              <DialogDescription>
                {selectedItem?.category} • {selectedItem?.subject} • {selectedItem?.gradeLevel}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {selectedItem?.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-600 dark:text-gray-300">{selectedItem.description}</p>
                  </div>
                )}
                
                {selectedItem?.content && (
                  <div>
                    <h4 className="font-semibold mb-2">Your Notes</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap">{selectedItem.content}</p>
                    </div>
                  </div>
                )}

                {selectedItem?.annotations && (
                  <div>
                    <h4 className="font-semibold mb-2">Annotations</h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(selectedItem.annotations, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedItem?.metadata && (
                  <div>
                    <h4 className="font-semibold mb-2">Resource Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Original Title:</strong> {selectedItem.metadata.originalTitle}
                      </div>
                      <div>
                        <strong>Author:</strong> {selectedItem.metadata.originalAuthor}
                      </div>
                      <div>
                        <strong>Type:</strong> {selectedItem.metadata.resourceType}
                      </div>
                      <div>
                        <strong>Curriculum:</strong> {selectedItem.metadata.curriculum}
                      </div>
                    </div>
                  </div>
                )}

                {selectedItem?.tags && selectedItem.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}