import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Search, Filter, Grid, List, Download, Eye, Star, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface LibraryResource {
  id: number;
  contentId: string;
  title: string;
  author: string;
  type: string;
  subject: string;
  grade: string;
  level: string;
  description: string;
  pages: number;
  difficulty: string;
  estimatedTime: number;
  competencies: string[];
  topics: string[];
  views: number;
  downloads: number;
  rating: string;
  thumbnailUrl?: string;
}

const DigitalLibraryNew = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedResource, setSelectedResource] = useState<LibraryResource | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch library resources
  const { data: resources = [], isLoading, error } = useQuery({
    queryKey: ["/api/library/resources", { search: searchQuery, type: activeTab !== "all" ? activeTab : undefined }],
    enabled: !!user,
  });

  const handlePreview = (resource: LibraryResource) => {
    setSelectedResource(resource);
    toast({
      title: "Preview",
      description: `Opening preview for: ${resource.title}`,
    });
  };

  const handleDownload = (resource: LibraryResource) => {
    toast({
      title: "Download Started",
      description: `Downloading: ${resource.title}`,
    });
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

  const ResourceCard = ({ resource }: { resource: LibraryResource }) => (
    <Card className="h-full hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {getTypeIcon(resource.type)}
            <Badge variant="secondary" className="text-xs">
              {resource.type}
            </Badge>
          </div>
          <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
            {resource.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-sm font-semibold line-clamp-2">
          {resource.title}
        </CardTitle>
        <CardDescription className="text-xs">
          by {resource.author} • {resource.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {resource.pages} pages
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {resource.estimatedTime}min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {resource.views}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className="text-xs">
            {resource.grade}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {resource.level}
          </Badge>
          {resource.topics?.slice(0, 2).map((topic, index) => (
            <Badge key={index} variant="outline" className="text-xs bg-blue-50">
              {topic}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => handlePreview(resource)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => handleDownload(resource)}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );

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
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          
          {resources.length === 0 && (
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
    </div>
  );
};

export default DigitalLibraryNew;