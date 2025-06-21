import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Download, 
  Clock, 
  Star,
  Play,
  FileText,
  Image,
  Video,
  Headphones
} from "lucide-react";

interface LibraryItem {
  id: string;
  title: string;
  type: 'book' | 'video' | 'audio' | 'document' | 'interactive';
  subject: string;
  progress?: number;
  rating?: number;
  duration?: string;
  lastAccessed?: string;
  isDownloaded?: boolean;
  isFavorite?: boolean;
}

interface LibraryStatusCardProps {
  recentItems: LibraryItem[];
  recommendations: LibraryItem[];
  totalDownloads: number;
  readingGoal?: { current: number; target: number; };
  loading?: boolean;
  onViewLibrary?: () => void;
  onOpenItem?: (item: LibraryItem) => void;
}

export function LibraryStatusCard({ 
  recentItems, 
  recommendations, 
  totalDownloads, 
  readingGoal,
  loading = false, 
  onViewLibrary, 
  onOpenItem 
}: LibraryStatusCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </CardHeader>
        <CardContent className="animate-pulse">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <BookOpen className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Headphones className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'interactive':
        return <Play className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      book: 'bg-blue-100 text-blue-800',
      video: 'bg-red-100 text-red-800',
      audio: 'bg-green-100 text-green-800',
      document: 'bg-gray-100 text-gray-800',
      interactive: 'bg-purple-100 text-purple-800'
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || colors.book}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const readingProgress = readingGoal ? (readingGoal.current / readingGoal.target) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Digital Library
          </CardTitle>
          {onViewLibrary && (
            <Button variant="ghost" size="sm" onClick={onViewLibrary}>
              Browse Library
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{recentItems.length}</div>
            <div className="text-sm text-gray-500">Recent Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalDownloads}</div>
            <div className="text-sm text-gray-500">Downloads</div>
          </div>
        </div>
        
        {readingGoal && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Reading Goal</span>
              <span>{readingGoal.current} / {readingGoal.target} books</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recentItems.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Continue Reading
              </h4>
              <div className="space-y-2">
                {recentItems.slice(0, 2).map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => onOpenItem?.(item)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{item.title}</h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{item.subject}</span>
                          {item.duration && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.duration}
                              </span>
                            </>
                          )}
                          {item.isDownloaded && (
                            <>
                              <span>•</span>
                              <Download className="h-3 w-3 text-green-500" />
                            </>
                          )}
                        </div>
                        {item.progress !== undefined && (
                          <Progress value={item.progress} className="h-1 mt-2" />
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-3 flex flex-col items-end gap-1">
                      {getTypeBadge(item.type)}
                      {item.rating && (
                        <div className="flex">
                          {renderStars(item.rating)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Recommended for You
              </h4>
              <div className="space-y-2">
                {recommendations.slice(0, 2).map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                    onClick={() => onOpenItem?.(item)}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="p-1 rounded bg-gray-100 dark:bg-gray-800">
                        {getTypeIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-sm truncate">{item.title}</h5>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span>{item.subject}</span>
                          {item.rating && (
                            <>
                              <span>•</span>
                              <div className="flex">
                                {renderStars(item.rating).slice(0, 1)}
                                <span className="ml-1">{item.rating.toFixed(1)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-3">
                      {getTypeBadge(item.type)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentItems.length === 0 && recommendations.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No library items available</p>
              <Button variant="ghost" size="sm" className="mt-2" onClick={onViewLibrary}>
                Explore Library
              </Button>
            </div>
          )}

          <div className="pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full" onClick={onViewLibrary}>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Full Library
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}