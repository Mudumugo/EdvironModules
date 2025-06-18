import { LibraryResource } from "./LibraryTypes";
import { 
  shouldUseBookViewer, 
  shouldUseWorksheetViewer, 
  convertResourceToBookConfig, 
  convertResourceToWorksheetConfig, 
  getBookOpenMessage 
} from "@/lib/bookViewerConfig";

export const useLibraryActions = (
  setCurrentBook: (book: any) => void,
  setShowBookViewer: (show: boolean) => void,
  setCurrentWorksheet: (worksheet: any) => void,
  setShowWorksheetViewer: (show: boolean) => void,
  setSelectedResource: (resource: LibraryResource | null) => void,
  toast: any,
  user: any
) => {
  const handlePreview = (resource: LibraryResource) => {
    const message = getBookOpenMessage(resource);
    
    // Use enhanced BookViewer for book-type resources
    if (shouldUseBookViewer(resource)) {
      const bookData = convertResourceToBookConfig(resource);
      setCurrentBook(bookData);
      setShowBookViewer(true);
      
      toast({
        title: message.title,
        description: message.description,
      });
    } 
    // Use WorksheetViewer for worksheet-type resources
    else if (shouldUseWorksheetViewer(resource)) {
      const worksheetData = convertResourceToWorksheetConfig(resource);
      setCurrentWorksheet(worksheetData);
      setShowWorksheetViewer(true);
      
      toast({
        title: message.title,
        description: message.description,
      });
    } 
    else {
      // For other resources, use the basic modal
      setSelectedResource(resource);
      
      toast({
        title: message.title,
        description: message.description,
      });
    }
  };

  const handleSaveToLocker = async (resource: LibraryResource) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save resources to your locker",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/locker/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId: resource.id,
          resourceType: resource.type,
          title: resource.title,
          metadata: {
            grade: resource.grade,
            curriculum: resource.curriculum,
            difficulty: resource.difficulty,
            tags: resource.tags,
          },
        }),
      });

      if (response.ok) {
        toast({
          title: "Saved to Locker",
          description: `${resource.title} has been saved to your locker`,
        });
      } else {
        throw new Error('Failed to save resource');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save resource to your locker",
        variant: "destructive",
      });
    }
  };

  return {
    handlePreview,
    handleSaveToLocker,
  };
};