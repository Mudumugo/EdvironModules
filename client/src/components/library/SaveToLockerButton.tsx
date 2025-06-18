import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BookmarkPlus, Save, X } from "lucide-react";

interface SaveToLockerButtonProps {
  resourceId: number;
  resourceTitle: string;
  resourceType?: string;
  subject?: string;
  gradeLevel?: string;
  currentAnnotations?: any;
  currentNotes?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export function SaveToLockerButton({
  resourceId,
  resourceTitle,
  resourceType = "resource",
  subject,
  gradeLevel,
  currentAnnotations,
  currentNotes = "",
  className,
  variant = "outline",
  size = "sm"
}: SaveToLockerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(resourceTitle);
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState(currentNotes);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [makeOfflineAvailable, setMakeOfflineAvailable] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const saveToLockerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/locker/save-resource", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/items'] });
      setIsOpen(false);
      toast({
        title: "Success",
        description: data.id ? "Resource updated in your locker" : "Resource saved to your locker"
      });
      // Reset form
      setTitle(resourceTitle);
      setDescription("");
      setNotes(currentNotes);
      setTags([]);
      setTagInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Failed to save resource to locker",
        variant: "destructive"
      });
    }
  });

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    saveToLockerMutation.mutate({
      resourceId,
      title,
      description,
      notes,
      annotations: currentAnnotations,
      tags,
      isPrivate,
      makeOfflineAvailable
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save to Locker
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save to My Locker</DialogTitle>
          <DialogDescription>
            Save this resource with your annotations and notes for future reference
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this saved resource"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Your Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add your personal notes about this resource"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="private">Keep Private</Label>
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="offline">Make Available Offline</Label>
              <Switch
                id="offline"
                checked={makeOfflineAvailable}
                onCheckedChange={setMakeOfflineAvailable}
              />
            </div>
          </div>

          {currentAnnotations && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your annotations and highlights will be saved with this resource
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p><strong>Resource Info:</strong></p>
            <p>Type: {resourceType}</p>
            {subject && <p>Subject: {subject}</p>}
            {gradeLevel && <p>Grade: {gradeLevel}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveToLockerMutation.isPending || !title.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              {saveToLockerMutation.isPending ? "Saving..." : "Save to Locker"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}