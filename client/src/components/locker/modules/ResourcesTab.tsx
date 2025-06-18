import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Download, Trash2, FileText, Archive, BookmarkPlus } from "lucide-react";
import type { LockerItem } from "@shared/schema";

interface ResourcesTabProps {
  lockerItems: LockerItem[];
  isLoading: boolean;
  onViewItem: (item: LockerItem) => void;
}

export function ResourcesTab({ lockerItems, isLoading, onViewItem }: ResourcesTabProps) {
  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'resource': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'bookmark': return <BookmarkPlus className="h-5 w-5 text-green-500" />;
      case 'notebook': return <FileText className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Saved Resources</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (lockerItems.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Saved Resources (0)</h2>
        </div>
        <div className="text-center py-12">
          <Archive className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No saved resources yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Save annotated resources from the digital library to access them here.
          </p>
          <Button variant="outline">
            Browse Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Saved Resources ({lockerItems.length})</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lockerItems.map((item: LockerItem) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getItemIcon(item.itemType)}
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                    {item.description && (
                      <CardDescription className="text-xs mt-1 line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {item.thumbnailUrl && (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-md mb-3 overflow-hidden">
                  <img 
                    src={item.thumbnailUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>{item.category || 'General'}</span>
                <span>{item.views} views</span>
              </div>
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewItem(item)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  {item.fileUrl && (
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}