import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Save, 
  Eye, 
  Send, 
  Download,
  ArrowLeft,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthoringHeaderProps {
  projectTitle: string;
  status: 'draft' | 'review' | 'published';
  onSave: () => void;
  onPreview: () => void;
  onSubmitForReview: () => void;
  onPublish: () => void;
  onBack: () => void;
  isSaving?: boolean;
  isSubmitting?: boolean;
  isPublishing?: boolean;
}

export function AuthoringHeader({
  projectTitle,
  status,
  onSave,
  onPreview,
  onSubmitForReview,
  onPublish,
  onBack,
  isSaving = false,
  isSubmitting = false,
  isPublishing = false
}: AuthoringHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'review':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center space-x-3">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <div>
            <h1 className="font-semibold text-gray-900 truncate max-w-xs">
              {projectTitle}
            </h1>
            <Badge className={`text-xs ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onSave}
          disabled={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreview}
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>

        {status === 'draft' && (
          <Button 
            size="sm" 
            onClick={onSubmitForReview}
            disabled={isSubmitting}
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        )}

        {status === 'review' && (
          <Button 
            size="sm" 
            onClick={onPublish}
            disabled={isPublishing}
            className="bg-green-600 hover:bg-green-700"
          >
            <BookOpen className="h-4 w-4 mr-2" />
            {isPublishing ? 'Publishing...' : 'Publish'}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="h-4 w-4 mr-2" />
              Export as EPUB
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}