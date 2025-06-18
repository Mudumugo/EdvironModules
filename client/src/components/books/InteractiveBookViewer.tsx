import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SaveToLockerButton } from "@/components/library/SaveToLockerButton";
import { BookOpen, Bookmark, Highlighter, Palette, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

interface InteractiveBookViewerProps {
  book: {
    id: number;
    title: string;
    content?: string;
    subject?: string;
    grade?: string;
    fileUrl?: string;
    thumbnailUrl?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveBookViewer({ book, isOpen, onClose }: InteractiveBookViewerProps) {
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [currentHighlightColor, setCurrentHighlightColor] = useState("#yellow");
  const [zoom, setZoom] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  const highlightColors = [
    { name: "Yellow", value: "#ffff00", class: "bg-yellow-200" },
    { name: "Blue", value: "#87ceeb", class: "bg-blue-200" },
    { name: "Green", value: "#90ee90", class: "bg-green-200" },
    { name: "Pink", value: "#ffb6c1", class: "bg-pink-200" }
  ];

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString();
      
      // Create highlight span
      const highlightSpan = document.createElement('span');
      highlightSpan.style.backgroundColor = currentHighlightColor;
      highlightSpan.style.padding = '2px';
      highlightSpan.className = 'user-highlight';
      highlightSpan.title = `Highlighted: ${new Date().toLocaleString()}`;
      
      try {
        range.surroundContents(highlightSpan);
        
        // Save annotation
        const newAnnotation = {
          id: Date.now(),
          text: selectedText,
          color: currentHighlightColor,
          timestamp: new Date().toISOString(),
          position: range.startOffset
        };
        setAnnotations(prev => [...prev, newAnnotation]);
        
        selection.removeAllRanges();
      } catch (e) {
        console.warn("Could not highlight selected text:", e);
      }
    }
  };

  const addBookmark = () => {
    const bookmark = {
      id: Date.now(),
      page: 1, // In a real implementation, track current page
      timestamp: new Date().toISOString(),
      note: prompt("Add a note for this bookmark (optional):") || ""
    };
    setAnnotations(prev => [...prev, { ...bookmark, type: 'bookmark' }]);
  };

  const resetZoom = () => setZoom(1);
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.transform = `scale(${zoom})`;
      contentRef.current.style.transformOrigin = 'top left';
    }
  }, [zoom]);

  const getCurrentContent = () => {
    return contentRef.current?.innerHTML || book.content || '';
  };

  const getCurrentAnnotations = () => {
    return {
      highlights: annotations.filter(a => !a.type),
      bookmarks: annotations.filter(a => a.type === 'bookmark'),
      notes: notes
    };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {book.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                {book.subject && <Badge variant="outline">{book.subject}</Badge>}
                {book.grade && <Badge variant="outline">Grade {book.grade}</Badge>}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <SaveToLockerButton
                resourceId={book.id}
                resourceTitle={book.title}
                resourceType="book"
                subject={book.subject}
                gradeLevel={book.grade}
                currentAnnotations={getCurrentAnnotations()}
                currentNotes={notes}
                originalContent={getCurrentContent()}
                fileUrl={book.fileUrl}
                thumbnailUrl={book.thumbnailUrl}
                variant="default"
                size="sm"
              />
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center gap-2 p-2 border-b flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-2">Highlight:</span>
            {highlightColors.map(color => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full border-2 ${color.class} ${
                  currentHighlightColor === color.value ? 'border-black' : 'border-gray-300'
                }`}
                onClick={() => setCurrentHighlightColor(color.value)}
                title={`Highlight with ${color.name}`}
              />
            ))}
          </div>
          
          <div className="h-4 w-px bg-border mx-2" />
          
          <Button variant="ghost" size="sm" onClick={addBookmark}>
            <Bookmark className="h-4 w-4 mr-1" />
            Bookmark
          </Button>
          
          <div className="h-4 w-px bg-border mx-2" />
          
          <Button variant="ghost" size="sm" onClick={zoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="sm" onClick={zoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={resetZoom}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4">
          <div
            ref={contentRef}
            className="prose max-w-none dark:prose-invert transition-transform duration-200"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ 
              __html: book.content || `
                <h1>Interactive Book Content</h1>
                <p>This is a sample interactive book viewer where users can:</p>
                <ul>
                  <li>Highlight text with different colors</li>
                  <li>Add bookmarks with notes</li>
                  <li>Zoom in and out for better readability</li>
                  <li>Save their annotated version to their locker</li>
                </ul>
                <p>The original library content remains unchanged while user interactions are saved as personal copies.</p>
                <h2>Chapter 1: Introduction</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <h2>Chapter 2: Advanced Topics</h2>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
              `
            }}
          />
        </div>

        {/* Annotations Panel */}
        {annotations.length > 0 && (
          <div className="border-t p-4 max-h-40 overflow-auto flex-shrink-0">
            <h4 className="font-medium mb-2">Your Annotations ({annotations.length})</h4>
            <div className="space-y-2">
              {annotations.slice(-3).map(annotation => (
                <div key={annotation.id} className="text-sm bg-muted p-2 rounded">
                  {annotation.type === 'bookmark' ? (
                    <div className="flex items-center gap-2">
                      <Bookmark className="h-3 w-3" />
                      <span>Bookmark {annotation.note && `- ${annotation.note}`}</span>
                    </div>
                  ) : (
                    <div>
                      <span style={{ backgroundColor: annotation.color, padding: '2px 4px', borderRadius: '2px' }}>
                        {annotation.text.substring(0, 50)}...
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}