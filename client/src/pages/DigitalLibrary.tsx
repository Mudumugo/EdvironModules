import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Video, FileText, Users, Search, Filter, Grid, List, Star, Clock, Download, GraduationCap, Target, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function DigitalLibrary() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch library resources with curriculum-based filtering
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['/api/library/resources', selectedGrade, selectedCurriculum, selectedType, selectedDifficulty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedGrade) params.append('grade', selectedGrade);
      if (selectedCurriculum) params.append('curriculum', selectedCurriculum);
      if (selectedType) params.append('type', selectedType);
      if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
      
      const response = await fetch(`/api/library/resources?${params}`);
      if (!response.ok) throw new Error('Failed to fetch resources');
      return response.json();
    },
  });

  // Filter resources by search query
  const filteredResources = resources.filter((resource: any) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'book': return <BookOpen className="h-4 w-4" />;
      case 'document': return <FileText className="h-4 w-4" />;
      case 'quiz': return <Target className="h-4 w-4" />;
      case 'simulation': return <Users className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'book': return 'bg-blue-100 text-blue-800';
      case 'document': return 'bg-green-100 text-green-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'simulation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold">Digital Library</h1>
          <p className="text-muted-foreground">
            Curriculum-aligned educational resources for your academic journey
          </p>
          {user && (
            <div className="flex items-center gap-2 mt-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-muted-foreground">
                Showing resources for your grade level and curriculum
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')}>
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search resources, topics, or learning objectives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={selectedGrade} onValueChange={setSelectedGrade}>
            <SelectTrigger className="w-32">
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
              <SelectItem value="University">University</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Curriculum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Curricula</SelectItem>
              <SelectItem value="CBC">CBC (Kenya)</SelectItem>
              <SelectItem value="IGCSE">IGCSE</SelectItem>
              <SelectItem value="IB">International Baccalaureate</SelectItem>
              <SelectItem value="Common Core">Common Core</SelectItem>
              <SelectItem value="Cambridge">Cambridge</SelectItem>
              <SelectItem value="GCSE">GCSE</SelectItem>
              <SelectItem value="A-Level">A-Level</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="book">Books</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="quiz">Quizzes</SelectItem>
              <SelectItem value="simulation">Simulations</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredResources.length} resources found
            {(selectedGrade || selectedCurriculum) && " for your academic context"}
          </p>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Personalized for you</span>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resources found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery 
                  ? "No resources match your search criteria" 
                  : "No resources available for your current grade level and curriculum"}
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedGrade("");
                setSelectedCurriculum("");
                setSelectedType("");
                setSelectedDifficulty("");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredResources.map((resource: any) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getResourceIcon(resource.type)}
                      <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    </div>
                    <Badge className={`text-xs ${getResourceTypeColor(resource.type)}`}>
                      {resource.type}
                    </Badge>
                  </div>
                  {resource.description && (
                    <CardDescription className="line-clamp-2">
                      {resource.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Academic Context */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>Grade {resource.grade}</span>
                      <span>•</span>
                      <span>{resource.curriculum}</span>
                    </div>

                    {/* Learning Objectives */}
                    {resource.learningObjectives && resource.learningObjectives.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Target className="h-3 w-3" />
                          <span>Learning Objectives:</span>
                        </div>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {resource.learningObjectives.slice(0, 2).map((objective: string, index: number) => (
                            <li key={index} className="line-clamp-1">{objective}</li>
                          ))}
                          {resource.learningObjectives.length > 2 && (
                            <li className="text-xs">+{resource.learningObjectives.length - 2} more...</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {resource.difficulty && (
                          <Badge variant="outline" className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                            {resource.difficulty}
                          </Badge>
                        )}
                        {resource.duration && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{resource.duration}min</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {resource.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{resource.rating}</span>
                          </div>
                        )}
                        <span>{resource.viewCount || 0} views</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        Open Resource
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}