import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Search, 
  Filter,
  Plus,
  Eye,
  Star,
  Download,
  Play
} from "lucide-react";

export default function DigitalLibrary() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['/api/library/resources', { grade: selectedGrade, curriculum: selectedCurriculum }],
    retry: false,
  });

  const createResourceMutation = useMutation({
    mutationFn: async (resourceData: any) => {
      await apiRequest("POST", "/api/library/resources", resourceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/library/resources'] });
      toast({
        title: "Success",
        description: "Resource created successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create resource",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const filteredResources = resources?.filter((resource: any) => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || resource.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'book':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-50 text-red-600';
      case 'book':
        return 'bg-blue-50 text-blue-600';
      case 'quiz':
        return 'bg-green-50 text-green-600';
      case 'simulation':
        return 'bg-purple-50 text-purple-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const canCreateContent = user && ['admin', 'teacher', 'tutor'].includes(user.role);

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Digital Library</h1>
          <p className="text-gray-600 mt-1">
            Curriculum-aligned interactive books, videos, quizzes, and learning resources
          </p>
        </div>
        {canCreateContent && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Resource</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                createResourceMutation.mutate({
                  title: formData.get('title'),
                  type: formData.get('type'),
                  grade: formData.get('grade'),
                  curriculum: formData.get('curriculum'),
                  content: formData.get('content'),
                  fileUrl: formData.get('fileUrl'),
                  accessTier: formData.get('accessTier'),
                  tags: formData.get('tags')?.toString().split(',').map((tag: string) => tag.trim()).filter(Boolean),
                });
              }} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select name="type">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book">Book</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="simulation">Simulation</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select name="grade">
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grade-1">Grade 1</SelectItem>
                        <SelectItem value="grade-2">Grade 2</SelectItem>
                        <SelectItem value="grade-3">Grade 3</SelectItem>
                        <SelectItem value="grade-4">Grade 4</SelectItem>
                        <SelectItem value="grade-5">Grade 5</SelectItem>
                        <SelectItem value="grade-6">Grade 6</SelectItem>
                        <SelectItem value="grade-7">Grade 7</SelectItem>
                        <SelectItem value="grade-8">Grade 8</SelectItem>
                        <SelectItem value="grade-9">Grade 9</SelectItem>
                        <SelectItem value="grade-10">Grade 10</SelectItem>
                        <SelectItem value="grade-11">Grade 11</SelectItem>
                        <SelectItem value="grade-12">Grade 12</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="curriculum">Curriculum</Label>
                    <Select name="curriculum">
                      <SelectTrigger>
                        <SelectValue placeholder="Select curriculum" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CBC">CBC</SelectItem>
                        <SelectItem value="IGCSE">IGCSE</SelectItem>
                        <SelectItem value="IB">IB</SelectItem>
                        <SelectItem value="AP">AP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">Content/Description</Label>
                  <Textarea id="content" name="content" rows={3} />
                </div>
                <div>
                  <Label htmlFor="fileUrl">File URL</Label>
                  <Input id="fileUrl" name="fileUrl" type="url" />
                </div>
                <div>
                  <Label htmlFor="accessTier">Access Tier</Label>
                  <Select name="accessTier">
                    <SelectTrigger>
                      <SelectValue placeholder="Select access tier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="institutional">Institutional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input id="tags" name="tags" placeholder="math, algebra, equations" />
                </div>
                <Button type="submit" disabled={createResourceMutation.isPending}>
                  {createResourceMutation.isPending ? "Creating..." : "Create Resource"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="book">Books</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="quiz">Quizzes</SelectItem>
                  <SelectItem value="simulation">Simulations</SelectItem>
                  <SelectItem value="document">Documents</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Grades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Grades</SelectItem>
                  <SelectItem value="grade-1">Grade 1</SelectItem>
                  <SelectItem value="grade-2">Grade 2</SelectItem>
                  <SelectItem value="grade-3">Grade 3</SelectItem>
                  <SelectItem value="grade-4">Grade 4</SelectItem>
                  <SelectItem value="grade-5">Grade 5</SelectItem>
                  <SelectItem value="grade-6">Grade 6</SelectItem>
                  <SelectItem value="grade-7">Grade 7</SelectItem>
                  <SelectItem value="grade-8">Grade 8</SelectItem>
                  <SelectItem value="grade-9">Grade 9</SelectItem>
                  <SelectItem value="grade-10">Grade 10</SelectItem>
                  <SelectItem value="grade-11">Grade 11</SelectItem>
                  <SelectItem value="grade-12">Grade 12</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Curricula" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Curricula</SelectItem>
                  <SelectItem value="CBC">CBC</SelectItem>
                  <SelectItem value="IGCSE">IGCSE</SelectItem>
                  <SelectItem value="IB">IB</SelectItem>
                  <SelectItem value="AP">AP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Books</p>
                <p className="text-xl font-bold text-gray-900">
                  {resources?.filter((r: any) => r.type === 'book').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-xl font-bold text-gray-900">
                  {resources?.filter((r: any) => r.type === 'video').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Quizzes</p>
                <p className="text-xl font-bold text-gray-900">
                  {resources?.filter((r: any) => r.type === 'quiz').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-xl font-bold text-gray-900">
                  {resources?.reduce((acc: number, r: any) => acc + (r.viewCount || 0), 0) || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resourcesLoading ? (
          <div className="col-span-full text-center py-8">Loading resources...</div>
        ) : filteredResources && filteredResources.length > 0 ? (
          filteredResources.map((resource: any) => {
            const IconComponent = getResourceIcon(resource.type);
            return (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Resource Header */}
                  <div className="p-4 border-b">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-2">
                            {resource.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {resource.grade}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {resource.curriculum}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resource Content */}
                  <div className="p-4">
                    {resource.content && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                        {resource.content}
                      </p>
                    )}
                    
                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {resource.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Resource Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{resource.viewCount || 0}</span>
                        </div>
                        {resource.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{resource.rating}</span>
                          </div>
                        )}
                      </div>
                      <Badge 
                        variant={resource.accessTier === 'basic' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {resource.accessTier}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        {resource.type === 'video' ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Watch
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </>
                        )}
                      </Button>
                      {resource.fileUrl && (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
            <p>Try adjusting your search criteria or add new resources to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
