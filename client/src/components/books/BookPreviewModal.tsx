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
        const subject = resource.curriculum.toLowerCase();
        const grade = resource.grade;
        const author = resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author';
        
        let pages = [];
        
        // Check if this is the multimedia demo book
        const isMultimediaDemo = resource.title === 'Interactive Multimedia Learning Adventure' || 
                                resource.content === 'multimedia_demo' ||
                                (resource.tags && resource.tags.includes('multimedia'));
        
        if (isMultimediaDemo) {
          // Multimedia demo book with advanced interactive content
          pages.push(`data:text/html,${encodeURIComponent(generateMultimediaCoverPage(resource.title, author, subject, grade))}`);
          pages.push(`data:text/html,${encodeURIComponent(generateVideoLearningPage(2, resource.title, grade))}`);
          pages.push(`data:text/html,${encodeURIComponent(generateInteractiveGamePage(3, resource.title, grade))}`);
          pages.push(`data:text/html,${encodeURIComponent(generateAnimatedStoryPage(4, resource.title, grade))}`);
          pages.push(`data:text/html,${encodeURIComponent(generateQuizPage(5, subject, grade))}`);
          pages.push(`data:text/html,${encodeURIComponent(generateGeneralPage(6, resource.title, grade))}`);
        } else {
          // Standard interactive book content
          // Cover Page
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateCoverPage(resource.title, author, subject, grade))}`);
          
          // Table of Contents
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateTableOfContents(subject, grade))}`);
          
          // Chapter pages
          for (let i = 1; i <= 3; i++) {
            pages.push(`data:image/svg+xml,${encodeURIComponent(generateChapterIntro(`Chapter ${i}`, `Learning Module ${i}`, grade))}`);
            // Interactive content pages as HTML
            pages.push(`data:text/html,${encodeURIComponent(generateGeneralPage(i + 2, resource.title, grade))}`);
            // Interactive quiz pages as HTML
            pages.push(`data:text/html,${encodeURIComponent(generateQuizPage(i, subject, grade))}`);
          }
          
          // Final Assessment
          pages.push(`data:image/svg+xml,${encodeURIComponent(generateFinalAssessment(subject, grade))}`);
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