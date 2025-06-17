import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookViewer } from './BookViewer';
import { 
  BookOpen, 
  Eye, 
  Download, 
  Star, 
  Clock, 
  User, 
  FileText,
  Bookmark,
  Share2,
  ThumbsUp,
  MessageCircle
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

  // Mock book data - in real implementation, this would come from the API
  useEffect(() => {
    if (resource && resource.type === 'book') {
      setBookData({
        id: resource.id,
        title: resource.title,
        author: resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author',
        pages: [
          resource.thumbnailUrl || '/api/placeholder/400/500',
          '/api/placeholder/400/500',
          '/api/placeholder/400/500',
          '/api/placeholder/400/500',
          '/api/placeholder/400/500'
        ],
        totalPages: 5,
        thumbnailUrl: resource.thumbnailUrl,
        description: resource.description,
        grade: resource.grade,
        subject: resource.curriculum,
        language: resource.language
      });
    }
  }, [resource]);

  const handleDownload = () => {
    if (onDownload) {
      onDownload(resource);
    }
  };

  const handleOpenBook = () => {
    setIsBookViewerOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'restricted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isBookViewerOpen && bookData) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0">
          <BookViewer 
            bookData={bookData}
            onClose={() => setIsBookViewerOpen(false)}
            className="w-full h-[90vh]"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            {resource.title}
          </DialogTitle>
          <DialogDescription>
            by {resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown Author'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="flex-shrink-0 grid w-full grid-cols-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contents">Contents</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Book Cover and Quick Info */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  {resource.thumbnailUrl ? (
                    <img 
                      src={resource.thumbnailUrl} 
                      alt={resource.title}
                      className="w-48 h-64 object-cover rounded-lg shadow-md"
                    />
                  ) : (
                    <div className="w-48 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg shadow-md flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Quick Information</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{resource.type}</Badge>
                        <span>Type</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{resource.grade}</Badge>
                        <span>Grade Level</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{resource.curriculum}</Badge>
                        <span>Subject</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                        <span>Difficulty</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{resource.duration} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getAccessTierColor(resource.accessTier)}>
                          {resource.accessTier}
                        </Badge>
                        <span>Access</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Statistics</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {resource.viewCount} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {resource.rating}/5 rating
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {resource.language}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleOpenBook} className="flex-1">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read Book
                    </Button>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="default">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="default">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {resource.description}
                </p>
              </div>

              {/* Tags */}
              {resource.tags && resource.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="details" className="flex-1 overflow-y-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Book Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Title:</span>
                      <span>{resource.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Author:</span>
                      <span>{resource.authorId?.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Language:</span>
                      <span>{resource.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Grade Level:</span>
                      <span>{resource.grade}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Subject:</span>
                      <span>{resource.curriculum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Difficulty:</span>
                      <span>{resource.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Usage Statistics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Views:</span>
                      <span>{resource.viewCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Rating:</span>
                      <span>{resource.rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{resource.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Access Level:</span>
                      <span>{resource.accessTier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span>{resource.isPublished ? 'Published' : 'Draft'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contents" className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Table of Contents</h3>
              <div className="space-y-2">
                {/* Mock table of contents */}
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">Page {i + 1}</span>
                      <span>Chapter {i + 1}: Introduction to {resource.curriculum}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Reviews & Ratings</h3>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{resource.rating}/5</span>
                  <span className="text-sm text-gray-500">(12 reviews)</span>
                </div>
              </div>

              {/* Mock reviews */}
              <div className="space-y-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          U{i + 1}
                        </div>
                        <span className="font-medium">User {i + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <Star key={j} className={`h-4 w-4 ${j < 4 ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      This is a great educational resource. The content is well-structured and easy to understand for {resource.grade} students.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>2 days ago</span>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <ThumbsUp className="h-3 w-3" />
                        Helpful (5)
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <MessageCircle className="h-3 w-3" />
                        Reply
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BookPreviewModal;