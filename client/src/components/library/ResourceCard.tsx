import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Download, 
  Eye, 
  Star, 
  Clock, 
  User,
  Heart,
  BookMarked,
  FileText,
  Video,
  Headphones
} from "lucide-react";

interface LibraryResource {
  id: number;
  title: string;
  type: string;
  author?: string;
  subject?: string;
  grade?: string;
  description?: string;
  thumbnailUrl?: string;
  rating?: number;
  duration?: number;
  totalCopies: number;
  availableCopies: number;
  tags: string[];
  isPhysical: boolean;
  isDigital: boolean;
  isFeatured: boolean;
  createdAt: string;
}

interface ResourceCardProps {
  resource: LibraryResource;
  viewMode: string;
  onView?: (resourceId: number) => void;
  onBorrow?: (resourceId: number) => void;
  onReserve?: (resourceId: number) => void;
  onFavorite?: (resourceId: number) => void;
}

export function ResourceCard({
  resource,
  viewMode,
  onView,
  onBorrow,
  onReserve,
  onFavorite
}: ResourceCardProps) {
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "video":
        return <Video className="h-5 w-5 text-blue-500" />;
      case "audio":
        return <Headphones className="h-5 w-5 text-purple-500" />;
      case "book":
      case "ebook":
        return <BookOpen className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAvailabilityColor = () => {
    if (resource.availableCopies === 0) return "bg-red-100 text-red-800";
    if (resource.availableCopies <= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getAvailabilityText = () => {
    if (resource.availableCopies === 0) return "Unavailable";
    if (resource.availableCopies === 1) return "1 copy available";
    return `${resource.availableCopies} copies available`;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              {resource.thumbnailUrl ? (
                <img
                  src={resource.thumbnailUrl}
                  alt={resource.title}
                  className="w-16 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-20 bg-gray-100 rounded flex items-center justify-center">
                  {getTypeIcon(resource.type)}
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg leading-tight">{resource.title}</h3>
                  {resource.author && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="h-3 w-3" />
                      {resource.author}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{resource.type}</Badge>
                    {resource.subject && <Badge variant="outline">{resource.subject}</Badge>}
                    {resource.grade && <Badge variant="outline">{resource.grade}</Badge>}
                    <Badge className={getAvailabilityColor()}>
                      {getAvailabilityText()}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {resource.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{resource.rating}</span>
                    </div>
                  )}
                  {resource.duration && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDuration(resource.duration)}
                    </div>
                  )}
                </div>
              </div>
              
              {resource.description && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                  {resource.description}
                </p>
              )}
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={() => onView?.(resource.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              {resource.availableCopies > 0 ? (
                <Button size="sm" onClick={() => onBorrow?.(resource.id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Borrow
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onReserve?.(resource.id)}>
                  <BookMarked className="h-4 w-4 mr-2" />
                  Reserve
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onFavorite?.(resource.id)}>
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <div className="aspect-[3/4] relative mb-3">
          {resource.thumbnailUrl ? (
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
              {getTypeIcon(resource.type)}
            </div>
          )}
          {resource.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-orange-500">
              Featured
            </Badge>
          )}
        </div>
        
        <CardTitle className="text-base leading-tight">{resource.title}</CardTitle>
        {resource.author && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-3 w-3" />
            {resource.author}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">{resource.type}</Badge>
            {resource.subject && <Badge variant="outline">{resource.subject}</Badge>}
            {resource.grade && <Badge variant="outline">{resource.grade}</Badge>
          </div>

          <Badge className={getAvailabilityColor()}>
            {getAvailabilityText()}
          </Badge>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {resource.rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{resource.rating}</span>
              </div>
            )}
            {resource.duration && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formatDuration(resource.duration)}
              </div>
            )}
          </div>

          {resource.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {resource.description}
            </p>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => onView?.(resource.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
            {resource.availableCopies > 0 ? (
              <Button size="sm" className="flex-1" onClick={() => onBorrow?.(resource.id)}>
                <Download className="h-4 w-4 mr-2" />
                Borrow
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="flex-1" onClick={() => onReserve?.(resource.id)}>
                <BookMarked className="h-4 w-4 mr-2" />
                Reserve
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => onFavorite?.(resource.id)}>
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}