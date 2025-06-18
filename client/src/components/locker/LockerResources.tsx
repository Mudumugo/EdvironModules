import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Image, Video, Music, Eye, Download, Trash2, Star } from "lucide-react";
import { LockerItem } from "./LockerTypes";

interface LockerResourcesProps {
  resources: LockerItem[];
  onView: (id: number) => void;
  onDownload: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

const getResourceIcon = (metadata: any) => {
  const type = metadata?.type || 'document';
  switch (type) {
    case 'image': return <Image className="h-4 w-4 text-green-600" />;
    case 'video': return <Video className="h-4 w-4 text-red-600" />;
    case 'audio': return <Music className="h-4 w-4 text-purple-600" />;
    default: return <FileText className="h-4 w-4 text-blue-600" />;
  }
};

export default function LockerResources({ 
  resources, 
  onView, 
  onDownload, 
  onDelete, 
  onToggleFavorite 
}: LockerResourcesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <Card key={resource.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getResourceIcon(resource.metadata)}
                <CardTitle className="text-sm font-medium truncate">
                  {resource.title}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(resource.id)}
                className="h-6 w-6 p-0"
              >
                <Star className={`h-3 w-3 ${resource.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {resource.thumbnailUrl && (
              <div className="aspect-video rounded-md overflow-hidden bg-muted">
                <img 
                  src={resource.thumbnailUrl} 
                  alt={resource.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {resource.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {resource.gradeLevel}
              </Badge>
              {resource.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {resource.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {resource.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Saved {new Date(resource.createdAt).toLocaleDateString()}</span>
              <span>{resource.viewCount} views</span>
            </div>
            
            <div className="flex justify-between gap-2">
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => onView(resource.id)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onDownload(resource.id)}>
                  <Download className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(resource.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}