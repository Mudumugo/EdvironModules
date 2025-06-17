import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, FileText, Search, Filter, Grid, List, Download, Eye, Star, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import LibraryResourceCard from "@/components/library/LibraryResourceCard";
import BookPreviewModal from "@/components/books/BookPreviewModal";

interface LibraryResource {
  id: number;
  title: string;
  type: string;
  grade: string;
  curriculum: string;
  description: string;
  difficulty: string;
  duration: number;
  tags: string[];
  viewCount: number;
  rating: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  accessTier: string;
  isPublished: boolean;
  authorId: string;
  language: string;
}

const DigitalLibraryNew = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch library resources
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["/api/library/resources", { search: searchQuery, type: activeTab !== "all" ? activeTab : undefined }],
    enabled: true, // Allow library access without authentication
  });

  // Transform API response from snake_case to camelCase
  const rawResources = apiResponse?.resources || [];
  const resources = rawResources.map((resource: any) => ({
    id: resource.id,
    title: resource.title || 'Untitled',
    type: resource.type || 'book',
    grade: resource.grade || 'N/A',
    curriculum: resource.curriculum || 'General',
    description: resource.description || 'No description available',
    difficulty: resource.difficulty || 'medium',
    duration: resource.duration || 30,
    tags: resource.tags || [],
    viewCount: resource.viewCount || 0,
    rating: resource.rating || "0",
    thumbnailUrl: resource.thumbnail_url,
    fileUrl: resource.file_url,
    accessTier: resource.accessTier || 'free',
    isPublished: resource.isPublished !== false,
    authorId: resource.authorId || 'unknown-author',
    language: resource.language || 'English',
  }));

  const handlePreview = (resource: LibraryResource) => {
    setSelectedResource(resource);
  };

  const handleDownload = (resource: LibraryResource) => {
    if (resource.fileUrl) {
      // Create a temporary link and click it to download
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: `Downloading: ${resource.title}`,
      });
    } else {
      toast({
        title: "Download Error",
        description: "File not available for download",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "worksheet":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };



  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading library resources</p>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Digital Library
          </h1>
          <p className="text-gray-600">
            Comprehensive CBE-aligned educational resources
          </p>
        </div>
        <div className="flex items-center gap-2">
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

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Resource Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="book">Books</TabsTrigger>
          <TabsTrigger value="worksheet">Worksheets</TabsTrigger>
          <TabsTrigger value="quiz">Quizzes</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className={`${
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
              : "space-y-4"
          }`}>
            {resources.map((resource: LibraryResource) => (
              <LibraryResourceCard 
                key={resource.id} 
                resource={resource} 
                onPreview={handlePreview}
                onDownload={handleDownload}
                viewMode={viewMode}
              />
            ))}
          </div>
          
          {(resources as LibraryResource[]).length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria or browse different categories.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Preview Modal */}
      {selectedResource && selectedResource.type === 'book' && (
        <BookPreviewModal
          isOpen={!!selectedResource}
          onClose={() => setSelectedResource(null)}
          resource={selectedResource}
          onDownload={handleDownload}
        />
      )}

      {/* Generic Preview Dialog for non-book resources */}
      {selectedResource && selectedResource.type !== 'book' && (
        <Dialog open={!!selectedResource} onOpenChange={() => setSelectedResource(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedResource.title}</DialogTitle>
              <DialogDescription>
                by {selectedResource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Thumbnail */}
              {selectedResource.thumbnailUrl && (
                <div className="w-full max-w-md mx-auto">
                  <img 
                    src={selectedResource.thumbnailUrl} 
                    alt={selectedResource.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* Resource Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Resource Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Type:</span>
                        <Badge variant="secondary">{selectedResource.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Grade:</span>
                        <span>{selectedResource.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Curriculum:</span>
                        <span>{selectedResource.curriculum}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Difficulty:</span>
                        <Badge className={selectedResource.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                                         selectedResource.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                         'bg-red-100 text-red-800'}>
                          {selectedResource.difficulty}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Duration:</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {selectedResource.duration} min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Access:</span>
                        <Badge variant="outline">{selectedResource.accessTier}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats */}
                  <div>
                    <h3 className="font-semibold mb-2">Statistics</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {selectedResource.viewCount} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {selectedResource.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedResource.description}
                    </p>
                  </div>
                  
                  {/* Tags */}
                  {selectedResource.tags && selectedResource.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedResource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="pt-4">
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleDownload(selectedResource)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resource
                      </Button>
                      {selectedResource.fileUrl && (
                        <Button 
                          variant="outline"
                          onClick={() => window.open(selectedResource.fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open File
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DigitalLibraryNew;