import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { LockerItem } from "@shared/schema";

interface ResourceViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: LockerItem | null;
}

export function ResourceViewerDialog({ isOpen, onClose, item }: ResourceViewerDialogProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item.title}</DialogTitle>
          <DialogDescription>
            {(item.metadata as any)?.notes || (item.metadata as any)?.originalTitle || 'Saved resource'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {item.content && (
            <div 
              className="prose max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: item.content || '' }}
            />
          )}
          {(item.metadata as any)?.annotations && (
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Your Annotations</h4>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">
                  {typeof (item.metadata as any).annotations === 'string' 
                    ? (item.metadata as any).annotations 
                    : JSON.stringify((item.metadata as any).annotations, null, 2)}
                </pre>
              </div>
            </div>
          )}
          {(item.metadata as any)?.subject && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Subject:</span>
              <Badge variant="outline">{(item.metadata as any).subject}</Badge>
            </div>
          )}
          {(item.metadata as any)?.gradeLevel && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Grade Level:</span>
              <Badge variant="outline">{(item.metadata as any).gradeLevel}</Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}