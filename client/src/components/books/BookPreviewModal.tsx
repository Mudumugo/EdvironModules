import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookViewer } from './BookViewer';
import { BookPreviewTabs } from './BookPreviewTabs';
import { 
  generateCoverPage,
  generateTableOfContents,
  generateChapterIntro,
  generateQuizPage,
  generateFinalAssessment,
  generateGeneralPage
} from './generators/BookPageGenerators';
import {
  generateMultimediaCoverPage,
  generateVideoLearningPage,
  generateInteractiveGamePage,
  generateAnimatedStoryPage
} from './generators/MultimediaPageGenerators';
import { 
  BookOpen, 
  Eye, 
  Save, 
  Share2,
  Bookmark
} from 'lucide-react';

interface BookResource {
  id: number;
  title: string;
  type: string;
  grade: string;
  curriculum: string;
  description: string;
  difficulty: string;
  duration: number;
  tags: string[];
  viewCount: number;
  rating: string;
  thumbnailUrl?: string;
  fileUrl?: string;
  accessTier: string;
  isPublished: boolean;
  authorId: string;
  language: string;
}

interface BookPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: BookResource;
  onSaveToLocker?: (resource: BookResource) => void;
}

export const BookPreviewModal: React.FC<BookPreviewModalProps> = ({
  isOpen,
  onClose,
  resource,
  onSaveToLocker
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isBookViewerOpen, setIsBookViewerOpen] = useState(false);
  const [bookData, setBookData] = useState<any>(null);

  // Load book content
  useEffect(() => {
    if (resource && resource.type === 'book') {
      const loadBookContent = () => {
        const author = resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author';
        let pages = [];
        
        // Check if book has actual content stored in database
        if ((resource as any).content && (resource as any).content.trim() !== '' && (resource as any).content !== 'multimedia_demo') {
          // Use the actual HTML content from the database
          pages.push(`data:text/html,${encodeURIComponent((resource as any).content)}`);
        } 
        // Check if book has a file URL
        else if (resource.fileUrl && resource.fileUrl.trim() !== '') {
          // Display information about the file
          const fileInfoPage = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
              <h1>${resource.title}</h1>
              <p>by ${author}</p>
              <hr style="margin: 20px 0;">
              <p>This book has a file resource: <br><code>${resource.fileUrl}</code></p>
              <p>File-based content would be loaded here in a full implementation.</p>
            </div>
          `;
          pages.push(`data:text/html,${encodeURIComponent(fileInfoPage)}`);
        }
        // Fallback for books without content
        else {
          const noContentPage = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
              <h1>${resource.title}</h1>
              <p>by ${author}</p>
              <p>Grade: ${resource.grade || 'N/A'}</p>
              <p>Subject: ${resource.curriculum || 'N/A'}</p>
              <hr style="margin: 20px 0;">
              <p>This book is registered in the library but content is not yet available.</p>
            </div>
          `;
          pages.push(`data:text/html,${encodeURIComponent(noContentPage)}`);
        }
        
        return {
          id: resource.id,
          title: resource.title,
          author: author,
          pages: pages,
          totalPages: pages.length,
          currentPage: 0
        };
      };

      setBookData(loadBookContent());
    }
  }, [resource]);

  const handleOpenViewer = () => {
    setIsBookViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsBookViewerOpen(false);
  };

  const handleSaveToLocker = () => {
    if (onSaveToLocker) {
      onSaveToLocker(resource);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!resource) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{resource.title}</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveToLocker}>
                  <Save className="h-4 w-4 mr-1" />
                  Save to Locker
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {resource.curriculum} • {resource.grade} • {resource.duration} minutes
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <BookPreviewTabs
              resource={resource}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onOpenViewer={handleOpenViewer}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Book Viewer Modal */}
      {isBookViewerOpen && bookData && (
        <BookViewer
          resource={resource}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};

export default BookPreviewModal;