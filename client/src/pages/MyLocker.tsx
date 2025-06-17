import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Search, BookOpen, FileText, Bookmark, Download, Folder, Tag, Grid, List, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface LockerItem {
  id: number;
  title: string;
  type: 'resource' | 'note' | 'bookmark' | 'file';
  content?: string;
  resourceId?: number;
  tags: string[];
  category: string;
  isOfflineAvailable: boolean;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  resource?: {
    title: string;
    description: string;
    type: string;
    fileUrl: string;
  };
}

interface LockerCollection {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
  isPrivate: boolean;
  itemCount?: number;
}

export default function MyLocker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateItemOpen, setIsCreateItemOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const { toast } = useToast();

  // Fetch locker items
  const { data: lockerItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ['/api/locker/items'],
  });

  // Fetch collections
  const { data: collections = [], isLoading: collectionsLoading } = useQuery({
    queryKey: ['/api/locker/collections'],
  });

  // Create new locker item
  const createItem = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/locker/items', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/items'] });
      setIsCreateItemOpen(false);
      toast({
        title: "Item saved",
        description: "Your item has been added to My Locker",
      });
    },
    onError: (error) => {
      toast({
        title: "Error saving item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create new collection
  const createCollection = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/locker/collections', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/collections'] });
      setIsCreateCollectionOpen(false);
      toast({
        title: "Collection created",
        description: "Your new collection has been created",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating collection",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter items based on search and filters
  const filteredItems = lockerItems.filter((item: LockerItem) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'resource': return <BookOpen className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      case 'bookmark': return <Bookmark className="h-4 w-4" />;
      case 'file': return <Download className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'resource': return 'bg-blue-100 text-blue-800';
      case 'note': return 'bg-green-100 text-green-800';
      case 'bookmark': return 'bg-yellow-100 text-yellow-800';
      case 'file': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (itemsLoading || collectionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Locker</h1>
          <p className="text-muted-foreground">
            Your personal workspace for saved resources, notes, and offline learning materials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateCollectionOpen} onOpenChange={setIsCreateCollectionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Folder className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
                <DialogDescription>
                  Organize your locker items into collections
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createCollection.mutate({
                  name: formData.get('name'),
                  description: formData.get('description'),
                  color: formData.get('color') || '#3B82F6',
                  icon: formData.get('icon') || 'folder',
                  isPrivate: formData.get('isPrivate') === 'on',
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Collection Name</Label>
                    <Input id="name" name="name" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isPrivate" name="isPrivate" defaultChecked />
                    <Label htmlFor="isPrivate">Private collection</Label>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={createCollection.isPending}>
                    {createCollection.isPending ? "Creating..." : "Create Collection"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateItemOpen} onOpenChange={setIsCreateItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add to My Locker</DialogTitle>
                <DialogDescription>
                  Save resources, create notes, or add bookmarks for offline learning
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createItem.mutate({
                  title: formData.get('title'),
                  type: formData.get('type'),
                  content: formData.get('content'),
                  category: formData.get('category') || 'personal',
                  tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
                  isOfflineAvailable: formData.get('isOfflineAvailable') === 'on',
                  isPrivate: formData.get('isPrivate') === 'on',
                });
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" required />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" defaultValue="note">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="note">Personal Note</SelectItem>
                        <SelectItem value="bookmark">Bookmark</SelectItem>
                        <SelectItem value="resource">Resource</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea id="content" name="content" placeholder="Add your notes, links, or content here..." />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select name="category" defaultValue="personal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="course">Course</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" name="tags" placeholder="math, physics, important" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isOfflineAvailable" name="isOfflineAvailable" />
                    <Label htmlFor="isOfflineAvailable">Available offline</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isPrivate" name="isPrivate" defaultChecked />
                    <Label htmlFor="isPrivate">Private item</Label>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button type="submit" disabled={createItem.isPending}>
                    {createItem.isPending ? "Saving..." : "Save to Locker"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search your locker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="research">Research</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="note">Notes</SelectItem>
              <SelectItem value="resource">Resources</SelectItem>
              <SelectItem value="bookmark">Bookmarks</SelectItem>
              <SelectItem value="file">Files</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="items" className="space-y-6">
        <TabsList>
          <TabsTrigger value="items">Items ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="collections">Collections ({collections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? "No items match your search criteria" : "Start building your personal learning workspace"}
                </p>
                <Button onClick={() => setIsCreateItemOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
              {filteredItems.map((item: LockerItem) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getItemIcon(item.type)}
                        <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                      </div>
                      <Badge className={`text-xs ${getTypeColor(item.type)}`}>
                        {item.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {item.content && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {item.content}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.isOfflineAvailable && (
                          <Download className="h-3 w-3 text-green-600" title="Available offline" />
                        )}
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-4">
          {collections.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create collections to organize your locker items
                </p>
                <Button onClick={() => setIsCreateCollectionOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Collection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((collection: LockerCollection) => (
                <Card key={collection.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded" 
                        style={{ backgroundColor: collection.color }}
                      />
                      <CardTitle className="text-sm font-medium">{collection.name}</CardTitle>
                    </div>
                    {collection.description && (
                      <CardDescription className="text-xs">{collection.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{collection.itemCount || 0} items</span>
                      <Badge variant="outline" className="text-xs">
                        {collection.isPrivate ? 'Private' : 'Shared'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}