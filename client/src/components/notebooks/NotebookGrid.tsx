import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Share2, Lock, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Notebook } from "@/hooks/useDigitalNotebooks";

interface NotebookGridProps {
  notebooks: Notebook[];
  viewMode: "grid" | "list";
  onNotebookSelect: (notebook: Notebook) => void;
  onNotebookEdit: (notebook: Notebook) => void;
  onNotebookDelete: (id: string) => void;
  isLoading: boolean;
}

export function NotebookGrid({
  notebooks,
  viewMode,
  onNotebookSelect,
  onNotebookEdit,
  onNotebookDelete,
  isLoading
}: NotebookGridProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (notebooks.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No notebooks found</h3>
        <p className="text-gray-500">Create your first notebook to get started.</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {notebooks.map((notebook) => (
          <Card key={notebook.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1" onClick={() => onNotebookSelect(notebook)}>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{notebook.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {notebook.subject}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {notebook.sections?.length || 0} sections
                      </span>
                      <span className="text-sm text-gray-500">
                        Updated {formatDate(notebook.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {notebook.isShared ? (
                      <Share2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onNotebookEdit(notebook)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onNotebookDelete(notebook.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notebooks.map((notebook) => (
        <Card key={notebook.id} className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
          <CardHeader className="pb-3" onClick={() => onNotebookSelect(notebook)}>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {notebook.title}
                  </CardTitle>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onNotebookEdit(notebook)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onNotebookDelete(notebook.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pt-0" onClick={() => onNotebookSelect(notebook)}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {notebook.subject}
                </Badge>
                {notebook.isShared ? (
                  <Share2 className="h-4 w-4 text-green-600" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>{notebook.sections?.length || 0} sections</p>
                <p className="text-xs text-gray-500 mt-1">
                  Updated {formatDate(notebook.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}