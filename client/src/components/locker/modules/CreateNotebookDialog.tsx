import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CreateNotebookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { title: string; description: string }) => void;
}

export function CreateNotebookDialog({ isOpen, onClose, onCreate }: CreateNotebookDialogProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    
    if (title.trim()) {
      onCreate({ title: title.trim(), description: description.trim() });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Notebook</DialogTitle>
          <DialogDescription>
            Create a new digital notebook to organize your study materials.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            name="title"
            placeholder="Notebook title..." 
            required
          />
          <Input 
            name="description"
            placeholder="Description (optional)..." 
          />
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Notebook
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}