import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Plus,
  Search,
  BookOpen,
  FileText,
  Bookmark,
  Download,
  Folder,
  Tag,
  Grid,
  List,
  Filter,
  Star,
  Eye,
  Edit,
  Trash2,
  Share2,
  Archive,
  CloudDownload,
  Wifi,
  WifiOff,
  Lock,
  Unlock,
  FolderOpen,
  Calendar,
  Clock,
  User,
  Users,
  Video,
  Image,
  Music,
  FileImage,
  File
} from "lucide-react";

// Form schemas
const itemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Type is required"),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  tags: z.string().optional(),
  collectionId: z.string().optional(),
  isOfflineAvailable: z.boolean().default(false),
  isPrivate: z.boolean().default(true),
});

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().default("#3B82F6"),
  isPrivate: z.boolean().default(true),
});

export default function MyLocker() {
  const { toast } = useToast();
  
  // Dialog states
  const [isItemDialogOpen, setIsItemDialogOpen] = useState(false);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  
  // View states
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState("all");
  const [offlineOnly, setOfflineOnly] = useState(false);

  // Sample data for demonstration
  const [lockerItems, setLockerItems] = useState([
    {
      id: 1,
      title: "Calculus Study Notes",
      type: "note",
      content: "Comprehensive notes on differential and integral calculus including key formulas and problem-solving strategies.",
      category: "course",
      tags: ["mathematics", "calculus", "study-guide"],
      collectionId: "1",
      isOfflineAvailable: true,
      isPrivate: true,
      createdAt: "2024-01-15",
      updatedAt: "2024-01-18",
      size: "2.5 MB",
      views: 12,
      sourceUrl: ""
    },
    {
      id: 2,
      title: "Physics Lab Video - Pendulum Experiment",
      type: "resource",
      content: "Step-by-step video demonstration of pendulum motion analysis",
      category: "course",
      tags: ["physics", "laboratory", "mechanics"],
      collectionId: "1",
      isOfflineAvailable: true,
      isPrivate: false,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
      size: "45.2 MB",
      views: 8,
      sourceUrl: "https://example.com/physics-lab"
    },
    {
      id: 3,
      title: "Chemistry Reference Formulas",
      type: "bookmark",
      content: "Quick reference bookmark for organic chemistry formulas and reactions",
      category: "research",
      tags: ["chemistry", "reference", "formulas"],
      collectionId: "2",
      isOfflineAvailable: false,
      isPrivate: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-10",
      size: "1.2 MB",
      views: 25,
      sourceUrl: "https://example.com/chem-formulas"
    },
    {
      id: 4,
      title: "Research Paper - AI in Education",
      type: "file",
      content: "Academic paper on artificial intelligence applications in educational technology",
      category: "research",
      tags: ["AI", "education", "research", "technology"],
      collectionId: "3",
      isOfflineAvailable: true,
      isPrivate: true,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-14",
      size: "8.7 MB",
      views: 6,
      sourceUrl: ""
    },
    {
      id: 5,
      title: "Project Ideas for Next Semester",
      type: "note",
      content: "Brainstorming notes for potential projects in computer science and mathematics courses",
      category: "project",
      tags: ["planning", "projects", "computer-science"],
      collectionId: "",
      isOfflineAvailable: true,
      isPrivate: true,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-16",
      size: "0.8 MB",
      views: 3,
      sourceUrl: ""
    }
  ]);

  const [collections, setCollections] = useState([
    {
      id: "1",
      name: "STEM Courses",
      description: "Resources and notes for Science, Technology, Engineering, and Mathematics courses",
      color: "#3B82F6",
      isPrivate: true,
      itemCount: 8,
      createdAt: "2024-01-01"
    },
    {
      id: "2",
      name: "Quick References",
      description: "Bookmarks and quick reference materials for easy access",
      color: "#10B981",
      isPrivate: false,
      itemCount: 5,
      createdAt: "2024-01-03"
    },
    {
      id: "3",
      name: "Research Papers",
      description: "Academic papers and research materials for thesis work",
      color: "#8B5CF6",
      isPrivate: true,
      itemCount: 12,
      createdAt: "2024-01-05"
    }
  ]);

  // Forms
  const itemForm = useForm({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      type: "note",
      content: "",
      category: "personal",
      tags: "",
      collectionId: "",
      isOfflineAvailable: false,
      isPrivate: true,
    },
  });

  const collectionForm = useForm({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
      color: "#3B82F6",
      isPrivate: true,
    },
  });

  // Handle form submissions
  const handleCreateItem = (data: z.infer<typeof itemSchema>) => {
    const newItem = {
      ...data,
      id: lockerItems.length + 1,
      content: data.content || "",
      collectionId: data.collectionId || "",
      tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      size: "1.0 MB",
      views: 0,
      sourceUrl: ""
    };
    setLockerItems([...lockerItems, newItem]);
    setIsItemDialogOpen(false);
    itemForm.reset();
    toast({
      title: "Success",
      description: "Item added to your locker",
    });
  };

  const handleCreateCollection = (data: z.infer<typeof collectionSchema>) => {
    const newCollection = {
      ...data,
      id: String(collections.length + 1),
      description: data.description || "",
      itemCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCollections([...collections, newCollection]);
    setIsCollectionDialogOpen(false);
    collectionForm.reset();
    toast({
      title: "Success",
      description: "Collection created successfully",
    });
  };

  // Filter functions
  const filteredItems = lockerItems.filter((item) => {
    const matchesSearch = searchTerm === "" || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesType = selectedType === "all" || item.type === selectedType;
    const matchesCollection = selectedCollection === "all" || item.collectionId === selectedCollection;
    const matchesOffline = !offlineOnly || item.isOfflineAvailable;
    
    return matchesSearch && matchesCategory && matchesType && matchesCollection && matchesOffline;
  });

  // Helper functions
  const getItemIcon = (type: string) => {
    switch (type) {
      case "resource": return <BookOpen className="h-4 w-4" />;
      case "note": return <FileText className="h-4 w-4" />;
      case "bookmark": return <Bookmark className="h-4 w-4" />;
      case "file": return <File className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "resource": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "note": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "bookmark": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "file": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "course": return <BookOpen className="h-3 w-3" />;
      case "project": return <Folder className="h-3 w-3" />;
      case "research": return <Search className="h-3 w-3" />;
      default: return <User className="h-3 w-3" />;
    }
  };

  // Calculate statistics
  const totalItems = lockerItems.length;
  const offlineItems = lockerItems.filter(item => item.isOfflineAvailable).length;
  const privateItems = lockerItems.filter(item => item.isPrivate).length;
  const totalSize = lockerItems.reduce((acc, item) => acc + parseFloat(item.size), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Archive className="h-8 w-8" />
            My Locker
          </h1>
          <p className="text-muted-foreground mt-2">
            Your personal workspace for saved resources, notes, and offline learning materials
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isCollectionDialogOpen} onOpenChange={setIsCollectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Folder className="h-4 w-4 mr-2" />
                New Collection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Collection</DialogTitle>
              </DialogHeader>
              <Form {...collectionForm}>
                <form onSubmit={collectionForm.handleSubmit(handleCreateCollection)} className="space-y-4">
                  <FormField
                    control={collectionForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter collection name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={collectionForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your collection..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={collectionForm.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Private collection</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Collection
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isItemDialogOpen} onOpenChange={setIsItemDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add to My Locker</DialogTitle>
              </DialogHeader>
              <Form {...itemForm}>
                <form onSubmit={itemForm.handleSubmit(handleCreateItem)} className="space-y-4">
                  <FormField
                    control={itemForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter item title" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={itemForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="note">Personal Note</SelectItem>
                              <SelectItem value="bookmark">Bookmark</SelectItem>
                              <SelectItem value="resource">Resource</SelectItem>
                              <SelectItem value="file">File</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="course">Course</SelectItem>
                              <SelectItem value="project">Project</SelectItem>
                              <SelectItem value="research">Research</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={itemForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Add your notes, links, or content here..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemForm.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (comma-separated)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="math, physics, important" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemForm.control}
                    name="collectionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">No Collection</SelectItem>
                            {collections.map((collection) => (
                              <SelectItem key={collection.id} value={collection.id}>
                                {collection.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between">
                    <FormField
                      control={itemForm.control}
                      name="isOfflineAvailable"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>Available offline</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={itemForm.control}
                      name="isPrivate"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel>Private item</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Save to Locker
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <WifiOff className="h-4 w-4" />
              Offline Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{offlineItems}</div>
            <p className="text-xs text-muted-foreground">Ready for offline use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Private Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{privateItems}</div>
            <p className="text-xs text-muted-foreground">Personal content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Download className="h-4 w-4" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSize.toFixed(1)} MB</div>
            <p className="text-xs text-muted-foreground">Space utilized</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search and Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search your locker..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="research">Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label htmlFor="type">Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="note">Notes</SelectItem>
                  <SelectItem value="resource">Resources</SelectItem>
                  <SelectItem value="bookmark">Bookmarks</SelectItem>
                  <SelectItem value="file">Files</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch checked={offlineOnly} onCheckedChange={setOfflineOnly} />
                <Label>Offline only</Label>
              </div>
              <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Collections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Collections</SelectItem>
                  {collections.map((collection) => (
                    <SelectItem key={collection.id} value={collection.id}>
                      {collection.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="items" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="items">Items ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="collections">Collections ({collections.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-6">
          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Archive className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm ? "No items match your search criteria" : "Start building your personal learning workspace"}
                </p>
                <Button onClick={() => setIsItemDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Item
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getItemIcon(item.type)}
                        <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1">
                        {item.isOfflineAvailable && (
                          <WifiOff className="h-3 w-3 text-green-600" />
                        )}
                        {item.isPrivate ? (
                          <Lock className="h-3 w-3 text-gray-500" />
                        ) : (
                          <Unlock className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                    <Badge className={`text-xs w-fit ${getTypeColor(item.type)}`}>
                      {item.type}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(item.category)}
                        <span>{item.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{item.views}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {item.size} • {item.updatedAt}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="collections" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Card key={collection.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: collection.color }}
                      />
                      <CardTitle className="text-lg">{collection.name}</CardTitle>
                    </div>
                    {collection.isPrivate ? (
                      <Lock className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Users className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">
                      {collection.itemCount} items
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created {collection.createdAt}
                    </div>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <Button variant="ghost" size="sm">
                      <FolderOpen className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}