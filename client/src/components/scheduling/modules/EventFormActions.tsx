import { Button } from "@/components/ui/button";
import { Save, X, Trash2, Copy } from "lucide-react";

interface EventFormActionsProps {
  isSubmitting: boolean;
  isEditing: boolean;
  onCancel?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export function EventFormActions({ 
  isSubmitting, 
  isEditing, 
  onCancel, 
  onDelete, 
  onDuplicate 
}: EventFormActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
      <div className="flex gap-3 flex-1">
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="flex-1 sm:flex-none"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Saving..." : isEditing ? "Update Event" : "Create Event"}
        </Button>

        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 sm:flex-none"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        )}
      </div>

      {isEditing && (
        <div className="flex gap-3">
          {onDuplicate && (
            <Button 
              type="button" 
              variant="outline"
              onClick={onDuplicate}
            >
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
          )}

          {onDelete && (
            <Button 
              type="button" 
              variant="destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}