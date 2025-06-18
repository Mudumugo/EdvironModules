import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { BookmarkPlus, Save, Loader2 } from "lucide-react";

interface SaveToLockerButtonProps {
  resourceId: number;
  resourceTitle: string;
  resourceType?: string;
  subject?: string;
  gradeLevel?: string;
  currentAnnotations?: any;
  currentNotes?: string;
  originalContent?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
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
  currentNotes,
  originalContent,
  fileUrl,
  thumbnailUrl,
  className,
  variant = "outline",
  size = "sm"
}: SaveToLockerButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(resourceTitle);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);

  const saveToLockerMutation = useMutation({
    mutationFn: async (data: any) => apiRequest("POST", "/api/locker/items", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/locker/items'] });
      toast({
        title: "Success",
        description: "Resource saved to your locker successfully",
      });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save resource to locker",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setTitle(resourceTitle);
    setDescription("");
    setTags([]);
    setNewTag("");
    setIsPrivate(true);
    setIsOfflineAvailable(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const lockerItem = {
      itemType: resourceType,
      title,
      description: description || null,
      originalResourceId: resourceId,
      content: originalContent || null,
      annotations: currentAnnotations || null,
      metadata: {
        notes: currentNotes,
        originalTitle: resourceTitle,
        savedAt: new Date().toISOString(),
      },
      fileUrl: fileUrl || null,
      thumbnailUrl: thumbnailUrl || null,
      tags: tags.length > 0 ? tags : null,
      category: resourceType,
      subject: subject || null,
      gradeLevel: gradeLevel || null,
      isPrivate,
      isOfflineAvailable,
      views: 0,
    };

    saveToLockerMutation.mutate(lockerItem);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save to Locker
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Resource to My Locker</DialogTitle>
          <DialogDescription>
            Save this resource with your annotations and notes to access it later offline.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title..."
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description or notes about this resource..."
              rows={3}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} size="sm">
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="private">Private</Label>
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="offline">Available Offline</Label>
              <Switch
                id="offline"
                checked={isOfflineAvailable}
                onCheckedChange={setIsOfflineAvailable}
              />
            </div>
          </div>

          {currentAnnotations && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
              <Label className="text-sm font-medium">Your Annotations</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Your highlights and annotations will be saved with this resource.
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saveToLockerMutation.isPending || !title.trim()}
            >
              {saveToLockerMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save to Locker
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}