import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Settings,
  Star,
  TrendingUp,
  Sparkles,
  Zap,
  Crown
} from "lucide-react";

interface App {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  downloads: string;
  price: string;
  icon: string;
  url: string;
  internal: boolean;
  featured: boolean;
  trending: boolean;
  recommended: boolean;
  popular: boolean;
  essential: boolean;
  premium: boolean;
  tags: string[];
  targetAudience: string[];
  gradeLevel: string[];
  status: string;
  createdBy?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  count?: number;
}

export default function AppsHubAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showAppDialog, setShowAppDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("apps");

  // Fetch apps
  const { data: apps, isLoading: appsLoading } = useQuery<App[]>({
    queryKey: ["/api/apps-hub"],
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/apps-hub/categories"],
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/apps-hub/analytics"],
  });

  // App mutations
  const createAppMutation = useMutation({
    mutationFn: async (appData: Partial<App>) => {
      return apiRequest("/api/apps-hub", {
        method: "POST",
        body: appData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub"] });
      setShowAppDialog(false);
      setSelectedApp(null);
      toast({ title: "App created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating app", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const updateAppMutation = useMutation({
    mutationFn: async ({ id, ...appData }: Partial<App> & { id: string }) => {
      return apiRequest(`/api/apps-hub/${id}`, {
        method: "PUT",
        body: appData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub"] });
      setShowAppDialog(false);
      setSelectedApp(null);
      toast({ title: "App updated successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating app", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteAppMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/apps-hub/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub"] });
      toast({ title: "App deleted successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error deleting app", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const approveAppMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/apps-hub/${id}/approve`, {
        method: "PATCH"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub"] });
      toast({ title: "App approved successfully" });
    }
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: Partial<Category>) => {
      return apiRequest("/api/apps-hub/categories", {
        method: "POST",
        body: categoryData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub/categories"] });
      setShowCategoryDialog(false);
      setSelectedCategory(null);
      toast({ title: "Category created successfully" });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...categoryData }: Partial<Category> & { id: string }) => {
      return apiRequest(`/api/apps-hub/categories/${id}`, {
        method: "PUT",
        body: categoryData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub/categories"] });
      setShowCategoryDialog(false);
      setSelectedCategory(null);
      toast({ title: "Category updated successfully" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/apps-hub/categories/${id}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/apps-hub/categories"] });
      toast({ title: "Category deleted successfully" });
    }
  });

  const handleSubmitApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const appData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      price: formData.get("price") as string,
      icon: formData.get("icon") as string,
      url: formData.get("url") as string,
      internal: formData.get("internal") === "on",
      featured: formData.get("featured") === "on",
      trending: formData.get("trending") === "on",
      recommended: formData.get("recommended") === "on",
      essential: formData.get("essential") === "on",
      premium: formData.get("premium") === "on",
      tags: (formData.get("tags") as string).split(",").map(tag => tag.trim()).filter(Boolean),
      targetAudience: Array.from(formData.getAll("targetAudience")),
      gradeLevel: Array.from(formData.getAll("gradeLevel"))
    };

    if (selectedApp) {
      updateAppMutation.mutate({ id: selectedApp.id, ...appData });
    } else {
      createAppMutation.mutate(appData);
    }
  };

  const handleSubmitCategory = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const categoryData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      icon: formData.get("icon") as string,
      color: formData.get("color") as string
    };

    if (selectedCategory) {
      updateCategoryMutation.mutate({ id: selectedCategory.id, ...categoryData });
    } else {
      createCategoryMutation.mutate(categoryData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (appsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Apps Hub Management</h1>
          <p className="text-muted-foreground">Manage educational applications and categories</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
          </Dialog>
          <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedApp(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add App
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="apps" className="space-y-4">
          <div className="grid gap-4">
            {apps?.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{app.icon}</span>
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {app.name}
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          {app.featured && <Sparkles className="w-4 h-4 text-blue-500" />}
                          {app.trending && <TrendingUp className="w-4 h-4 text-green-500" />}
                          {app.essential && <Zap className="w-4 h-4 text-orange-500" />}
                          {app.premium && <Crown className="w-4 h-4 text-yellow-500" />}
                        </CardTitle>
                        <CardDescription>{app.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => approveAppMutation.mutate(app.id)}
                          disabled={approveAppMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedApp(app);
                          setShowAppDialog(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteAppMutation.mutate(app.id)}
                        disabled={deleteAppMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {app.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4">
            {categories?.filter(cat => cat.id !== 'all').map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {category.icon && <span className="text-2xl">{category.icon}</span>}
                      <div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge>{category.count} apps</Badge>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowCategoryDialog(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => deleteCategoryMutation.mutate(category.id)}
                        disabled={deleteCategoryMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{apps?.length || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Active Apps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {apps?.filter(app => app.status === 'active').length || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {apps?.filter(app => app.status === 'pending').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* App Dialog */}
      <Dialog open={showAppDialog} onOpenChange={setShowAppDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedApp ? "Edit App" : "Add New App"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitApp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={selectedApp?.name} 
                  required 
                />
              </div>
              <div>
                <Label htmlFor="icon">Icon (emoji)</Label>
                <Input 
                  id="icon" 
                  name="icon" 
                  defaultValue={selectedApp?.icon}
                  placeholder="📚"
                  required 
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={selectedApp?.description}
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue={selectedApp?.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.filter(cat => cat.id !== 'all').map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Select name="price" defaultValue={selectedApp?.price}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Free">Free</SelectItem>
                    <SelectItem value="Freemium">Freemium</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Included">Included</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="url">URL</Label>
              <Input 
                id="url" 
                name="url" 
                type="url"
                defaultValue={selectedApp?.url}
                required 
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input 
                id="tags" 
                name="tags" 
                defaultValue={selectedApp?.tags.join(", ")}
                placeholder="Education, Math, Science"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Properties</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="internal" 
                      name="internal"
                      defaultChecked={selectedApp?.internal}
                    />
                    <Label htmlFor="internal">Internal App</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="featured" 
                      name="featured"
                      defaultChecked={selectedApp?.featured}
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="trending" 
                      name="trending"
                      defaultChecked={selectedApp?.trending}
                    />
                    <Label htmlFor="trending">Trending</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Additional</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="recommended" 
                      name="recommended"
                      defaultChecked={selectedApp?.recommended}
                    />
                    <Label htmlFor="recommended">Recommended</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="essential" 
                      name="essential"
                      defaultChecked={selectedApp?.essential}
                    />
                    <Label htmlFor="essential">Essential</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="premium" 
                      name="premium"
                      defaultChecked={selectedApp?.premium}
                    />
                    <Label htmlFor="premium">Premium</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAppDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createAppMutation.isPending || updateAppMutation.isPending}
              >
                {selectedApp ? "Update" : "Create"} App
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitCategory} className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input 
                id="cat-name" 
                name="name" 
                defaultValue={selectedCategory?.name} 
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="cat-description">Description</Label>
              <Textarea 
                id="cat-description" 
                name="description" 
                defaultValue={selectedCategory?.description}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cat-icon">Icon (emoji)</Label>
                <Input 
                  id="cat-icon" 
                  name="icon" 
                  defaultValue={selectedCategory?.icon}
                  placeholder="📚"
                />
              </div>
              <div>
                <Label htmlFor="cat-color">Color</Label>
                <Input 
                  id="cat-color" 
                  name="color" 
                  type="color"
                  defaultValue={selectedCategory?.color || "#3B82F6"}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCategoryDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {selectedCategory ? "Update" : "Create"} Category
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}