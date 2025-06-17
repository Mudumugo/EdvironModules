import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Download, Eye, Clock, Star, Users } from "lucide-react";
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
  pages?: number;
  difficulty: string;
  estimatedTime?: number;
  competencies: string[];
  topics: string[];
  views: number;
  downloads: number;
  rating?: string;
  thumbnailUrl?: string;
}

interface LibraryResourceCardProps {
  resource: LibraryResource;
  onPreview: (resource: LibraryResource) => void;
  onDownload: (resource: LibraryResource) => void;
  viewMode?: "grid" | "list";
}

export const LibraryResourceCard: React.FC<LibraryResourceCardProps> = ({
  resource,
  onPreview,
  onDownload,
  viewMode = "grid"
}) => {
  const { toast } = useToast();

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
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

  const getSubjectColor = (subject: string) => {
    switch (subject?.toLowerCase()) {
      case "mathematics":
        return "bg-blue-100 text-blue-800";
      case "english":
        return "bg-purple-100 text-purple-800";
      case "science":
        return "bg-green-100 text-green-800";
      case "social studies":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePreview = () => {
    onPreview(resource);
    toast({
      title: "Opening Preview",
      description: `Loading preview for ${resource.title}`,
    });
  };

  const handleDownload = () => {
    onDownload(resource);
    toast({
      title: "Download Started",
      description: `Downloading ${resource.title}`,
    });
  };

  if (viewMode === "list") {
    return (
      <Card className="w-full hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {resource.thumbnailUrl ? (
                <img 
                  src={resource.thumbnailUrl} 
                  alt={resource.title}
                  className="w-16 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                  {getTypeIcon(resource.type)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {resource.author}
                  </p>
                  <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className={getSubjectColor(resource.subject)}>
                      {resource.subject}
                    </Badge>
                    <Badge variant="outline">
                      {resource.grade}
                    </Badge>
                    <Badge className={getDifficultyColor(resource.difficulty)}>
                      {resource.difficulty}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    {resource.pages && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {resource.pages} pages
                      </span>
                    )}
                    {resource.estimatedTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {resource.estimatedTime}min
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {resource.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {resource.downloads} downloads
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePreview}>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
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
        
        {resource.thumbnailUrl && (
          <div className="w-full h-32 mb-3 overflow-hidden rounded">
            <img 
              src={resource.thumbnailUrl} 
              alt={resource.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <CardTitle className="text-sm font-semibold line-clamp-2">
          {resource.title}
        </CardTitle>
        <CardDescription className="text-xs">
          by {resource.author}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {resource.description}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {resource.pages && (
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {resource.pages} pages
            </span>
          )}
          {resource.estimatedTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {resource.estimatedTime}min
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {resource.views}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          <Badge variant="outline" className={`text-xs ${getSubjectColor(resource.subject)}`}>
            {resource.subject}
          </Badge>
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
          {resource.topics?.length > 2 && (
            <Badge variant="outline" className="text-xs bg-gray-50">
              +{resource.topics.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handlePreview}
          >
            <Eye className="h-3 w-3 mr-1" />
            Preview
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleDownload}
          >
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};