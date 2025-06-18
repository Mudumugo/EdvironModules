import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NotebookPen, Eye, Edit, Trash2, Star, Share2 } from "lucide-react";
import { LockerItem } from "./LockerTypes";

interface LockerNotebookProps {
  notebooks: LockerItem[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleFavorite: (id: number) => void;
  onShare: (id: number) => void;
}

export default function LockerNotebook({ 
  notebooks, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleFavorite,
  onShare 
}: LockerNotebookProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notebooks.map((notebook) => (
        <Card key={notebook.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <NotebookPen className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-sm font-medium truncate">
                  {notebook.title}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(notebook.id)}
                className="h-6 w-6 p-0"
              >
                <Star className={`h-3 w-3 ${notebook.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                {notebook.subject}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {notebook.gradeLevel}
              </Badge>
              {notebook.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {notebook.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {notebook.description}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Updated {new Date(notebook.updatedAt).toLocaleDateString()}</span>
              <span>{notebook.viewCount} views</span>
            </div>
            
            <div className="flex justify-between gap-2">
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => onView(notebook.id)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(notebook.id)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onShare(notebook.id)}>
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(notebook.id)}
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