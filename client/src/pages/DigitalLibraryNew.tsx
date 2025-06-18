import React, { useState } from "react";
import { createPortal } from "react-dom";
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
import { BookViewer } from "@/components/books/BookViewer";
import WorksheetViewer from "@/components/worksheets/WorksheetViewer";
import { shouldUseBookViewer, shouldUseWorksheetViewer, convertResourceToBookConfig, convertResourceToWorksheetConfig, getBookOpenMessage } from "@/lib/bookViewerConfig";

export interface LibraryResource {
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
  const [showBookViewer, setShowBookViewer] = useState(false);
  const [currentBook, setCurrentBook] = useState<any | null>(null);
  const [showWorksheetViewer, setShowWorksheetViewer] = useState(false);
  const [currentWorksheet, setCurrentWorksheet] = useState<any | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch library resources
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["/api/library/resources", { search: searchQuery, type: activeTab !== "all" ? activeTab : undefined }],
    enabled: true, // Allow library access without authentication
  });

  // Sample resources for demonstration
  const sampleResources = [
    {
      id: "1",
      title: "Mathematics Grade 5",
      type: "book",
      grade: "Grade 5",
      curriculum: "CBE",
      thumbnailUrl: "/api/placeholder/200/150",
      fileUrl: "#",
      difficulty: "medium",
      duration: 45,
      tags: ["mathematics", "grade5", "textbook"],
      viewCount: 150,
      rating: "4.5",
      accessTier: "free",
      isPublished: true,
      authorId: "math-publisher",
      language: "English",
      isInteractive: false,
      hasVideo: false,
      hasAudio: false,
      xapiEnabled: true,
      content: `<div class="textbook-content"><h2>Chapter 1: Numbers and Operations</h2><p>Learn about addition, subtraction, multiplication and division...</p></div>`,
      mediaAssets: [],
      interactiveElements: [],
      trackingConfig: {
        trackingEnabled: true,
        trackReadingProgress: true,
        trackMediaInteractions: false,
        trackAssessments: false
      }
    },
    {
      id: "2",
      title: "Science Experiments",
      type: "video",
      grade: "Grade 4",
      curriculum: "CBE",
      thumbnailUrl: "/api/placeholder/200/150",
      fileUrl: "#",
      difficulty: "easy",
      duration: 30,
      tags: ["science", "experiments", "grade4"],
      viewCount: 89,
      rating: "4.8",
      accessTier: "free",
      isPublished: true,
      authorId: "science-academy",
      language: "English",
      isInteractive: false,
      hasVideo: true,
      hasAudio: true,
      xapiEnabled: true,
      content: `<div class="video-content"><h2>Simple Science Experiments</h2><video controls><source src="#" type="video/mp4"></video></div>`,
      mediaAssets: [{ type: "video", url: "#" }],
      interactiveElements: [],
      trackingConfig: {
        trackingEnabled: true,
        trackReadingProgress: false,
        trackMediaInteractions: true,
        trackAssessments: false
      }
    }
  ];

  // Transform API response from snake_case to camelCase and add multimedia sample data
  const rawResources = apiResponse?.resources || [];
  const resources = rawResources.length > 0 ? rawResources.map((resource: any) => ({
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
    // Enhanced multimedia properties
    isInteractive: resource.type === 'interactive' || resource.type === 'html5',
    hasVideo: resource.type === 'video' || resource.type === 'multimedia',
    hasAudio: resource.type === 'audio' || resource.type === 'multimedia',
    xapiEnabled: true,
    content: resource.content || generateSampleContent(resource.type),
    mediaAssets: generateSampleMediaAssets(resource.type),
    interactiveElements: generateSampleInteractiveElements(resource.type),
    trackingConfig: {
      trackingEnabled: true,
      trackReadingProgress: true,
      trackMediaInteractions: true,
      trackAssessments: true
    }
  })) : sampleResources;

  // Generate sample multimedia content based on type
  function generateSampleContent(type: string): string {
    switch (type) {
      case 'interactive':
      case 'html5':
        return `
          <div class="interactive-lesson">
            <h2>Interactive Learning Module</h2>
            <p>This is a sample interactive learning experience with embedded multimedia and assessment elements.</p>
            <div class="content-section">
              <h3>Learning Objectives</h3>
              <ul>
                <li>Understand key concepts through interactive exploration</li>
                <li>Apply knowledge through hands-on activities</li>
                <li>Demonstrate mastery through embedded assessments</li>
              </ul>
            </div>
          </div>
        `;
      case 'video':
      case 'multimedia':
        return `
          <div class="video-lesson">
            <h2>Video Learning Experience</h2>
            <p>Interactive video content with embedded questions and activities.</p>
          </div>
        `;
      default:
        return '';
    }
  }

  // Generate sample media assets
  function generateSampleMediaAssets(type: string): any[] {
    if (type === 'video' || type === 'multimedia' || type === 'interactive') {
      return [
        {
          id: 'video-1',
          type: 'video',
          url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          duration: 120,
          title: 'Introduction Video',
          subtitles: 'Sample video content with educational material'
        },
        {
          id: 'audio-1',
          type: 'audio',
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
          duration: 30,
          title: 'Audio Narration'
        }
      ];
    }
    return [];
  }

  // Generate sample interactive elements
  function generateSampleInteractiveElements(type: string): any[] {
    if (type === 'interactive' || type === 'html5') {
      return [
        {
          id: 'quiz-1',
          type: 'quiz',
          position: { x: 50, y: 30 },
          content: {
            question: 'What is the main concept discussed in this lesson?',
            options: [
              'Interactive Learning',
              'Traditional Teaching',
              'Assessment Methods',
              'Content Management'
            ],
            correctAnswer: 0
          },
          xapiVerb: 'answered',
          required: true
        },
        {
          id: 'hotspot-1',
          type: 'hotspot',
          position: { x: 25, y: 60 },
          content: {
            title: 'Click for More Info',
            description: 'Additional information about this topic'
          },
          xapiVerb: 'interacted'
        }
      ];
    }
    return [];
  }

  const handlePreview = (resource: LibraryResource) => {
    const message = getBookOpenMessage(resource);
    
    // Use enhanced BookViewer for book-type resources
    if (shouldUseBookViewer(resource)) {
      const bookData = convertResourceToBookConfig(resource);
      setCurrentBook(bookData);
      setShowBookViewer(true);
      
      toast({
        title: message.title,
        description: message.description,
      });
    } 
    // Use WorksheetViewer for worksheet-type resources
    else if (shouldUseWorksheetViewer(resource)) {
      const worksheetData = convertResourceToWorksheetConfig(resource);
      setCurrentWorksheet(worksheetData);
      setShowWorksheetViewer(true);
      
      toast({
        title: message.title,
        description: message.description,
      });
    } 
    else {
      // For other resources, use the basic modal
      setSelectedResource(resource);
      
      toast({
        title: message.title,
        description: message.description,
      });
    }
  };



  const handleSaveToLocker = async (resource: LibraryResource) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save resources to your locker",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/locker/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemType: 'library_resource',
          title: resource.title,
          content: resource.description,
          originalResourceId: resource.id.toString(),
          originalTitle: resource.title,
          subject: resource.curriculum,
          gradeLevel: resource.grade,
          fileUrl: resource.fileUrl,
          thumbnailUrl: resource.thumbnailUrl,
          metadata: {
            type: resource.type,
            difficulty: resource.difficulty,
            duration: resource.duration,
            rating: resource.rating,
            language: resource.language,
            tags: resource.tags,
            accessTier: resource.accessTier,
            originalAuthor: resource.authorId,
            savedFromLibrary: true,
            savedAt: new Date().toISOString(),
          },
          tags: resource.tags,
        }),
      });

      if (response.ok) {
        toast({
          title: "Saved to Locker",
          description: `"${resource.title}" has been saved to your locker`,
        });
      } else {
        throw new Error('Failed to save to locker');
      }
    } catch (error) {
      console.error('Error saving to locker:', error);
      toast({
        title: "Save Failed",
        description: "Could not save resource to locker. Please try again.",
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
    <>
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
                onSaveToLocker={handleSaveToLocker}
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
          onSaveToLocker={handleSaveToLocker}
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
                        onClick={() => handleSaveToLocker(selectedResource)}
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
    {/* Enhanced BookViewer for immersive book reading - Rendered as Portal */}
    {showBookViewer && currentBook && createPortal(
      <BookViewer
        bookData={currentBook}
        onClose={() => {
          setShowBookViewer(false);
          setCurrentBook(null);
        }}
      />,
      document.body
    )}

    {/* WorksheetViewer for interactive worksheet viewing - Rendered as Portal */}
    {showWorksheetViewer && currentWorksheet && createPortal(
      <WorksheetViewer
        worksheetData={currentWorksheet}
        onClose={() => {
          setShowWorksheetViewer(false);
          setCurrentWorksheet(null);
        }}
      />,
      document.body
    )}
    </>
  );
};

export default DigitalLibraryNew;