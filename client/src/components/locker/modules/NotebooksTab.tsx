import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NotebookPen, Plus, Eye, Trash2 } from "lucide-react";

interface NotebookData {
  id: number;
  title: string;
  description?: string;
  color?: string;
  isShared: boolean;
  createdAt: string;
  updatedAt: string;
  subjects?: any[];
}

interface NotebooksTabProps {
  notebooks: NotebookData[];
  isLoading: boolean;
  onCreateNotebook: () => void;
}

export function NotebooksTab({ notebooks, isLoading, onCreateNotebook }: NotebooksTabProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Digital Notebooks</h2>
          <Button onClick={onCreateNotebook}>
            <Plus className="h-4 w-4 mr-2" />
            New Notebook
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (notebooks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Digital Notebooks (0)</h2>
          <Button onClick={onCreateNotebook}>
            <Plus className="h-4 w-4 mr-2" />
            New Notebook
          </Button>
        </div>
        <div className="text-center py-12">
          <NotebookPen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No notebooks yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Create your first digital notebook to organize your study materials.
          </p>
          <Button onClick={onCreateNotebook}>
            <Plus className="h-4 w-4 mr-2" />
            Create Notebook
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Digital Notebooks ({notebooks.length})</h2>
        <Button onClick={onCreateNotebook}>
          <Plus className="h-4 w-4 mr-2" />
          New Notebook
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.map((notebook: NotebookData) => (
          <Card key={notebook.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <NotebookPen className="h-5 w-5 text-blue-600" />
                  <Badge variant="secondary">Notebook</Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
              <CardTitle className="text-lg">{notebook.title}</CardTitle>
              {notebook.description && (
                <CardDescription className="line-clamp-2">
                  {notebook.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {notebook.subjects?.length || 0} subjects
                </span>
                <span>{new Date(notebook.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Open
                </Button>
                {notebook.isShared && (
                  <Badge variant="outline" className="text-xs">
                    Shared
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}