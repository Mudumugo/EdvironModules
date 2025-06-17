import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Eye, 
  Calendar,
  User,
  BookMarked,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
  Grid,
  List,
  SortAsc,
  SortDesc
} from "lucide-react";

interface LibraryResource {
  id: number;
  title: string;
  type: string;
  authorId?: string;
  subjectId?: number;
  grade?: string;
  curriculum?: string;
  difficulty?: string;
  description?: string;
  content?: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  duration?: number;
  language: string;
  rating?: number;
  viewCount: number;
  tags: string[];
  learningObjectives: string[];
  prerequisites: string[];
  isPublished: boolean;
  isSharedGlobally: boolean;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

interface LibraryBorrowing {
  id: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  status: string;
  renewalCount: number;
  maxRenewals: number;
  resource: {
    id: number;
    title: string;
    author?: string;
    type: string;
    thumbnailUrl?: string;
  };
}

interface LibraryReservation {
  id: number;
  reservedAt: string;
  expiresAt: string;
  status: string;
  priority: number;
  resource: {
    id: number;
    title: string;
    author?: string;
    type: string;
    thumbnailUrl?: string;
    availableCopies: number;
  };
}

export default function DigitalLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch library resources
  const { data: resourcesData, isLoading: resourcesLoading } = useQuery({
    queryKey: [
      "/api/library/resources", 
      searchQuery, 
      selectedCategory, 
      selectedType, 
      selectedGrade, 
      sortBy, 
      sortOrder, 
      showFeatured, 
      showAvailable,
      currentPage
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "12",
        sortBy,
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedType && { type: selectedType }),
        ...(selectedGrade && { grade: selectedGrade }),
        ...(showFeatured && { featured: "true" }),
        ...(showAvailable && { available: "true" })
      });
      return fetch(`/api/library/resources?${params}`).then(res => res.json());
    }
  });

  // Fetch featured resources
  const { data: featuredResources } = useQuery({
    queryKey: ["/api/library/featured"],
    queryFn: () => fetch("/api/library/featured").then(res => res.json())
  });

  // Fetch user's borrowings
  const { data: borrowings } = useQuery({
    queryKey: ["/api/library/my-borrowings"],
    queryFn: () => fetch("/api/library/my-borrowings").then(res => res.json())
  });

  // Fetch user's reservations
  const { data: reservations } = useQuery({
    queryKey: ["/api/library/my-reservations"],
    queryFn: () => fetch("/api/library/my-reservations").then(res => res.json())
  });

  // Fetch library statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/library/stats"],
    queryFn: () => fetch("/api/library/stats").then(res => res.json())
  });

  // Borrow resource mutation
  const borrowMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      return apiRequest("POST", `/api/library/resources/${resourceId}/borrow`, {
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource borrowed successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/library/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library/my-borrowings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to borrow resource",
        variant: "destructive"
      });
    }
  });

  // Return resource mutation
  const returnMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      return apiRequest("POST", `/api/library/resources/${resourceId}/return`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource returned successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/library/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library/my-borrowings"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to return resource",
        variant: "destructive"
      });
    }
  });

  // Reserve resource mutation
  const reserveMutation = useMutation({
    mutationFn: async (resourceId: number) => {
      return apiRequest("POST", `/api/library/resources/${resourceId}/reserve`, {});
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Resource reserved successfully!"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/library/resources"] });
      queryClient.invalidateQueries({ queryKey: ["/api/library/my-reservations"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reserve resource",
        variant: "destructive"
      });
    }
  });

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleBorrow = (resourceId: number) => {
    borrowMutation.mutate(resourceId);
  };

  const handleReturn = (resourceId: number) => {
    returnMutation.mutate(resourceId);
  };

  const handleReserve = (resourceId: number) => {
    reserveMutation.mutate(resourceId);
  };

  const getStatusBadge = (resource: LibraryResource) => {
    if (!resource.isActive) {
      return <Badge variant="destructive">Inactive</Badge>;
    }
    if (resource.isPhysical) {
      return <Badge variant="default">Global</Badge>;
    }
    return <Badge variant="outline">Available</Badge>;
  };

  const getActionButton = (resource: LibraryResource) => {
    if (resource.fileUrl) {
      return (
        <Button 
          onClick={() => window.open(resource.fileUrl, '_blank')}
          size="sm"
        >
          <Download className="h-4 w-4 mr-2" />
          Access
        </Button>
      );
    }
    
    return (
      <Button 
        onClick={() => setSelectedResource(resource)}
        variant="outline"
        size="sm"
      >
        <Eye className="h-4 w-4 mr-2" />
        View
      </Button>
    );
  };

  const ResourceCard = ({ resource }: { resource: LibraryResource }) => (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight mb-1 truncate">
              {resource.title}
            </CardTitle>
            {resource.author && (
              <CardDescription className="text-sm text-muted-foreground">
                by {resource.author}
              </CardDescription>
            )}
          </div>
          {getStatusBadge(resource)}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {resource.thumbnailUrl && (
            <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center overflow-hidden">
              <img 
                src={resource.thumbnailUrl} 
                alt={resource.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {resource.type}
            </Badge>
            {resource.category && (
              <Badge variant="outline" className="text-xs">
                {resource.category}
              </Badge>
            )}
            {resource.grade && (
              <Badge variant="outline" className="text-xs">
                Grade {resource.grade}
              </Badge>
            )}
          </div>
          
          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {resource.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {resource.viewCount}
              </span>
              {resource.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {resource.rating.toFixed(1)}
                </span>
              )}
            </div>
            {resource.duration ? (
              <span>{resource.duration} min</span>
            ) : (
              <span>{resource.language.toUpperCase()}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            {getActionButton(resource)}
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedResource(resource)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{resource.title}</DialogTitle>
                  <DialogDescription>
                    {resource.author && `by ${resource.author}`}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {resource.coverImageUrl && (
                    <div className="w-48 h-64 mx-auto bg-muted rounded-md overflow-hidden">
                      <img 
                        src={resource.coverImageUrl} 
                        alt={resource.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {resource.isbn && (
                      <div>
                        <span className="font-medium">ISBN:</span> {resource.isbn}
                      </div>
                    )}
                    {resource.publisher && (
                      <div>
                        <span className="font-medium">Publisher:</span> {resource.publisher}
                      </div>
                    )}
                    {resource.publicationYear && (
                      <div>
                        <span className="font-medium">Year:</span> {resource.publicationYear}
                      </div>
                    )}
                    {resource.pageCount && (
                      <div>
                        <span className="font-medium">Pages:</span> {resource.pageCount}
                      </div>
                    )}
                    {resource.language && (
                      <div>
                        <span className="font-medium">Language:</span> {resource.language}
                      </div>
                    )}
                    {resource.deweyDecimal && (
                      <div>
                        <span className="font-medium">Dewey:</span> {resource.deweyDecimal}
                      </div>
                    )}
                  </div>
                  
                  {resource.summary && (
                    <div>
                      <h4 className="font-medium mb-2">Summary</h4>
                      <p className="text-sm text-muted-foreground">{resource.summary}</p>
                    </div>
                  )}
                  
                  {resource.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Digital Library</h1>
          <p className="text-muted-foreground">
            Discover, borrow, and manage your educational resources
          </p>
        </div>
        
        {stats && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{stats.totalResources}</div>
              <div className="text-muted-foreground">Total Resources</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{stats.availableResources}</div>
              <div className="text-muted-foreground">Available</div>
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="borrowed">
            My Borrowed ({borrowings?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="reserved">
            My Reserved ({reservations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search & Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by title, author, description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="ebook">E-Book</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Fiction">Fiction</SelectItem>
                    <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                    <SelectItem value="Reference">Reference</SelectItem>
                    <SelectItem value="Textbook">Textbook</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Grades</SelectItem>
                    <SelectItem value="K">Kindergarten</SelectItem>
                    <SelectItem value="1">Grade 1</SelectItem>
                    <SelectItem value="2">Grade 2</SelectItem>
                    <SelectItem value="3">Grade 3</SelectItem>
                    <SelectItem value="4">Grade 4</SelectItem>
                    <SelectItem value="5">Grade 5</SelectItem>
                    <SelectItem value="6">Grade 6</SelectItem>
                    <SelectItem value="7">Grade 7</SelectItem>
                    <SelectItem value="8">Grade 8</SelectItem>
                    <SelectItem value="9">Grade 9</SelectItem>
                    <SelectItem value="10">Grade 10</SelectItem>
                    <SelectItem value="11">Grade 11</SelectItem>
                    <SelectItem value="12">Grade 12</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="publicationYear">Year</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="viewCount">Popularity</SelectItem>
                    <SelectItem value="createdAt">Date Added</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex gap-2">
                  <Button
                    variant={sortOrder === "asc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortOrder("asc")}
                  >
                    <SortAsc className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={sortOrder === "desc" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSortOrder("desc")}
                  >
                    <SortDesc className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <Button
                  variant={showFeatured ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowFeatured(!showFeatured)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Featured Only
                </Button>
                
                <Button
                  variant={showAvailable ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowAvailable(!showAvailable)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Available Only
                </Button>
                
                <div className="ml-auto flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          {resourcesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-muted rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {resourcesData?.resources?.map((resource: LibraryResource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {resourcesData?.pagination && resourcesData.pagination.pages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {resourcesData.pagination.pages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(resourcesData.pagination.pages, currentPage + 1))}
                disabled={currentPage === resourcesData.pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="borrowed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookMarked className="h-5 w-5" />
                My Borrowed Resources
              </CardTitle>
              <CardDescription>
                Manage your currently borrowed items and track due dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {borrowings && borrowings.length > 0 ? (
                <div className="space-y-4">
                  {borrowings.map((borrowing: LibraryBorrowing) => (
                    <Card key={borrowing.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {borrowing.resource.thumbnailUrl && (
                              <div className="w-16 h-20 bg-muted rounded overflow-hidden">
                                <img 
                                  src={borrowing.resource.thumbnailUrl} 
                                  alt={borrowing.resource.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">{borrowing.resource.title}</h4>
                              {borrowing.resource.author && (
                                <p className="text-sm text-muted-foreground">
                                  by {borrowing.resource.author}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                                </span>
                                <Badge variant={borrowing.status === 'overdue' ? 'destructive' : 'default'}>
                                  {borrowing.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {borrowing.renewalCount < borrowing.maxRenewals && (
                              <Button variant="outline" size="sm">
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Renew
                              </Button>
                            )}
                            <Button 
                              onClick={() => handleReturn(borrowing.resource.id)}
                              disabled={returnMutation.isPending}
                              size="sm"
                            >
                              Return
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookMarked className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No borrowed resources</h3>
                  <p className="text-muted-foreground">
                    Start exploring the library to borrow resources
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reserved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                My Reservations
              </CardTitle>
              <CardDescription>
                Track your reserved items and queue position
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reservations && reservations.length > 0 ? (
                <div className="space-y-4">
                  {reservations.map((reservation: LibraryReservation) => (
                    <Card key={reservation.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {reservation.resource.thumbnailUrl && (
                              <div className="w-16 h-20 bg-muted rounded overflow-hidden">
                                <img 
                                  src={reservation.resource.thumbnailUrl} 
                                  alt={reservation.resource.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <h4 className="font-medium">{reservation.resource.title}</h4>
                              {reservation.resource.author && (
                                <p className="text-sm text-muted-foreground">
                                  by {reservation.resource.author}
                                </p>
                              )}
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span>Queue Position: #{reservation.priority}</span>
                                <Badge variant="outline">
                                  {reservation.status}
                                </Badge>
                                <span className="text-muted-foreground">
                                  Expires: {new Date(reservation.expiresAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {reservation.resource.availableCopies} available
                            </div>
                            {reservation.status === 'ready' && (
                              <Button size="sm" className="mt-2">
                                Borrow Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No reservations</h3>
                  <p className="text-muted-foreground">
                    Reserve unavailable resources to get them when they become available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Featured Resources
              </CardTitle>
              <CardDescription>
                Curated selection of recommended educational materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              {featuredResources && featuredResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredResources.map((resource: LibraryResource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No featured resources</h3>
                  <p className="text-muted-foreground">
                    Check back later for curated recommendations
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}