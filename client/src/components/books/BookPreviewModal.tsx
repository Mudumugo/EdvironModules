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
  Download, 
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
  onDownload?: (resource: BookResource) => void;
}

export const BookPreviewModal: React.FC<BookPreviewModalProps> = ({
  isOpen,
  onClose,
  resource,
  onDownload
}) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [isBookViewerOpen, setIsBookViewerOpen] = useState(false);
  const [bookData, setBookData] = useState<any>(null);

  // Generate interactive book content
  useEffect(() => {
    if (resource && resource.type === 'book') {
      const generateBookPages = () => {
        const subject = resource.curriculum?.toLowerCase() || 'general';
        const grade = resource.grade || 'All Grades';
        const author = resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author';
        
        let pages = [];
        
        // Check if book has actual file content first
        if (resource.file_url && resource.file_url.trim() !== '') {
          // Use actual book file - this would be handled by a proper PDF viewer or file loader
          console.log('Book has file URL:', resource.file_url);
          // For now, show a message that this book has actual content
          const actualContentPage = `
            <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
              <h1>${resource.title}</h1>
              <p>This book contains actual content from: <br><code>${resource.file_url}</code></p>
              <p>In a full implementation, this would load and display the actual book content.</p>
              <p>Author: ${author}</p>
              <p>Grade: ${grade}</p>
              <p>Subject: ${resource.curriculum || 'N/A'}</p>
            </div>
          `;
          pages.push(`data:text/html,${encodeURIComponent(actualContentPage)}`);
          
        } else {
          // Check if this is the multimedia demo book (only generate content for this specific book)
          const isMultimediaDemo = resource.title === 'Interactive Multimedia Learning Adventure' || 
                                  resource.content === 'multimedia_demo' ||
                                  resource.id === 41;
          
          console.log('Resource data:', { title: resource.title, content: resource.content, id: resource.id });
          console.log('Is multimedia demo?', isMultimediaDemo);
          
          if (isMultimediaDemo) {
            // Multimedia demo book with advanced interactive content
            pages.push(`data:text/html,${encodeURIComponent(generateMultimediaCoverPage(resource.title, author, subject, grade))}`);
            pages.push(`data:text/html,${encodeURIComponent(generateVideoLearningPage(2, resource.title, grade))}`);
            pages.push(`data:text/html,${encodeURIComponent(generateInteractiveGamePage(3, resource.title, grade))}`);
            pages.push(`data:text/html,${encodeURIComponent(generateAnimatedStoryPage(4, resource.title, grade))}`);
            pages.push(`data:text/html,${encodeURIComponent(generateQuizPage(5, subject, grade))}`);
            pages.push(`data:text/html,${encodeURIComponent(generateGeneralPage(6, resource.title, grade))}`);
          } else {
            // For other books without content, show a placeholder
            const placeholderPage = `
              <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
                <h1>${resource.title}</h1>
                <p>by ${author}</p>
                <p>Grade: ${grade}</p>
                <p>Subject: ${resource.curriculum || 'N/A'}</p>
                <hr style="margin: 20px 0;">
                <p>This book is available in the library but does not have interactive content generated yet.</p>
                <p>In a full system, this would display the actual book content or require content upload.</p>
              </div>
            `;
            pages.push(`data:text/html,${encodeURIComponent(placeholderPage)}`);
          }
        }
        
        return {
          id: resource.id,
          title: resource.title,
          author: author,
          pages: pages,
          totalPages: pages.length,
          thumbnailUrl: pages[0],
          description: resource.description,
          grade: resource.grade,
          subject: resource.curriculum,
          language: resource.language || 'English',
          type: 'Interactive Book',
          isInteractive: true,
          hasAnswerKey: true,
          xapiEnabled: true,
          instructions: "Read each section carefully and complete the interactive exercises. Use the navigation controls to move between pages.",
          difficulty: resource.difficulty,
          duration: resource.duration,
          trackingConfig: {
            trackPageViews: true,
            trackCompletions: true,
            trackQuizResults: true
          }
        };
      };

      setBookData(generateBookPages());
    }
  }, [resource]);

  const handleOpenViewer = () => {
    setIsBookViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsBookViewerOpen(false);
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(resource);
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
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
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
          worksheetData={bookData}
          onClose={handleCloseViewer}
        />
      )}
    </>
  );
};

export default BookPreviewModal;