import React from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Star, Download, Eye } from "lucide-react";
import BookPreviewModal from "@/components/books/BookPreviewModal";
import { BookViewer } from "@/components/books/BookViewer";
import WorksheetViewer from "@/components/worksheets/WorksheetViewer";
import { LibraryResource } from "./LibraryTypes";

interface LibraryModalsProps {
  selectedResource: LibraryResource | null;
  showBookViewer: boolean;
  currentBook: any | null;
  showWorksheetViewer: boolean;
  currentWorksheet: any | null;
  onCloseResource: () => void;
  onCloseBookViewer: () => void;
  onCloseWorksheetViewer: () => void;
  onSaveToLocker: (resource: LibraryResource) => void;
}

export const LibraryModals: React.FC<LibraryModalsProps> = ({
  selectedResource,
  showBookViewer,
  currentBook,
  showWorksheetViewer,
  currentWorksheet,
  onCloseResource,
  onCloseBookViewer,
  onCloseWorksheetViewer,
  onSaveToLocker,
}) => {
  return (
    <>
      {/* Preview Modal */}
      {selectedResource && selectedResource.type === 'book' && (
        <BookPreviewModal
          isOpen={!!selectedResource}
          onClose={onCloseResource}
          resource={selectedResource}
          onSaveToLocker={onSaveToLocker}
        />
      )}

      {/* Generic Preview Dialog for non-book resources */}
      {selectedResource && selectedResource.type !== 'book' && (
        <Dialog open={!!selectedResource} onOpenChange={onCloseResource}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {selectedResource.title}
              </DialogTitle>
              <DialogDescription>
                {selectedResource.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Resource Preview/Content Area */}
              <div className="bg-gray-50 rounded-lg p-6 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <BookOpen className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {selectedResource.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {selectedResource.description}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <Badge variant="secondary">{selectedResource.grade}</Badge>
                      <Badge variant="outline">{selectedResource.curriculum}</Badge>
                      <Badge variant="outline" className="capitalize">{selectedResource.difficulty}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resource Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Resource Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{selectedResource.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade Level:</span>
                      <span>{selectedResource.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Curriculum:</span>
                      <span>{selectedResource.curriculum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {selectedResource.duration} min
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {selectedResource.rating}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedResource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => onSaveToLocker(selectedResource)}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Resource
                      </Button>
                      {selectedResource.fileUrl && (
                        <Button 
                          variant="outline"
                          onClick={() => window.open(selectedResource.fileUrl, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open File
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Enhanced BookViewer for immersive book reading - Rendered as Portal */}
      {showBookViewer && currentBook && createPortal(
        <LibraryBookViewer
          bookData={currentBook}
          onClose={onCloseBookViewer}
        />,
        document.body
      )}

      {/* WorksheetViewer for interactive worksheet viewing - Rendered as Portal */}
      {showWorksheetViewer && currentWorksheet && createPortal(
        <WorksheetViewer
          worksheetData={currentWorksheet}
          onClose={onCloseWorksheetViewer}
        />,
        document.body
      )}
    </>
  );
};