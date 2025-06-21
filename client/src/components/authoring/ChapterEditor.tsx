import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  FileText, 
  Image, 
  Video, 
  Mic,
  Trash2,
  GripVertical,
  Edit
} from "lucide-react";
import type { Chapter, Page } from "@/hooks/useBookAuthoring";

interface ChapterEditorProps {
  chapter: Chapter;
  onUpdateChapter: (data: Partial<Chapter>) => void;
  onCreatePage: (data: { content: string; type: string; order: number }) => void;
  onUpdatePage: (pageId: string, data: Partial<Page>) => void;
  onDeletePage: (pageId: string) => void;
}

export function ChapterEditor({
  chapter,
  onUpdateChapter,
  onCreatePage,
  onUpdatePage,
  onDeletePage
}: ChapterEditorProps) {
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [newPageContent, setNewPageContent] = useState("");
  const [showAddPage, setShowAddPage] = useState(false);

  const handleTitleChange = (title: string) => {
    onUpdateChapter({ title });
  };

  const handleAddPage = (type: string) => {
    if (!newPageContent.trim()) return;
    
    const order = chapter.pages.length + 1;
    onCreatePage({
      content: newPageContent,
      type,
      order
    });
    
    setNewPageContent("");
    setShowAddPage(false);
  };

  const handlePageEdit = (pageId: string, content: string) => {
    onUpdatePage(pageId, { content });
    setEditingPage(null);
  };

  return (
    <div className="space-y-6">
      {/* Chapter Header */}
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <Input
              value={chapter.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Chapter title..."
              className="text-lg font-medium"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Pages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Pages</h3>
          <Button onClick={() => setShowAddPage(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </div>

        {chapter.pages.map((page, index) => (
          <Card key={page.id} className="group">
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-2 text-gray-400">
                  <GripVertical className="h-4 w-4" />
                  <span className="text-sm font-medium">{index + 1}</span>
                </div>
                
                <div className="flex-1 space-y-2">
                  {editingPage === page.id ? (
                    <div className="space-y-2">
                      <Textarea
                        defaultValue={page.content}
                        placeholder="Page content..."
                        rows={4}
                        onBlur={(e) => handlePageEdit(page.id, e.target.value)}
                        autoFocus
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => setEditingPage(null)}>
                          Done
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="min-h-[60px] p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                      onClick={() => setEditingPage(page.id)}
                    >
                      {page.content || (
                        <span className="text-gray-400 italic">Click to add content...</span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {page.type === 'text' && <FileText className="h-3 w-3" />}
                    {page.type === 'image' && <Image className="h-3 w-3" />}
                    {page.type === 'interactive' && <Video className="h-3 w-3" />}
                    <span className="capitalize">{page.type} Page</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingPage(page.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDeletePage(page.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Page Form */}
        {showAddPage && (
          <Card className="border-dashed">
            <CardContent className="p-4">
              <div className="space-y-4">
                <Textarea
                  value={newPageContent}
                  onChange={(e) => setNewPageContent(e.target.value)}
                  placeholder="Enter page content..."
                  rows={3}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => handleAddPage('text')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Text Page
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddPage('image')}>
                      <Image className="h-4 w-4 mr-2" />
                      Image Page
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleAddPage('interactive')}>
                      <Video className="h-4 w-4 mr-2" />
                      Interactive
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowAddPage(false);
                      setNewPageContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}