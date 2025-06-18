import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, ExternalLink, Eye, Trash2, Star } from "lucide-react";
import { LockerItem } from "./LockerTypes";

interface LockerBookmarksProps {
  bookmarks: LockerItem[];
  onView: (id: number) => void;
  onOpen: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
}

export default function LockerBookmarks({ 
  bookmarks, 
  onView, 
  onOpen, 
  onDelete, 
  onToggleFavorite 
}: LockerBookmarksProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-sm font-medium truncate">
                  {bookmark.title}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(bookmark.id)}
                className="h-6 w-6 p-0"
              >
                <Star className={`h-3 w-3 ${bookmark.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookmark.thumbnailUrl && (
              <div className="aspect-video rounded-md overflow-hidden bg-muted">
                <img 
                  src={bookmark.thumbnailUrl} 
                  alt={bookmark.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {bookmark.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {bookmark.gradeLevel}
              </Badge>
              {bookmark.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {bookmark.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bookmark.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Bookmarked {new Date(bookmark.createdAt).toLocaleDateString()}</span>
              <span>{bookmark.viewCount} opens</span>
            </div>
            
            <div className="flex justify-between gap-2">
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => onView(bookmark.id)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onOpen(bookmark.id)}>
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(bookmark.id)}
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