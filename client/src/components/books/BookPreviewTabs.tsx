import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Clock, 
  User, 
  FileText,
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

interface BookPreviewTabsProps {
  resource: BookResource;
  activeTab: string;
  onTabChange: (value: string) => void;
  onOpenViewer: () => void;
}

export const BookPreviewTabs: React.FC<BookPreviewTabsProps> = ({
  resource,
  activeTab,
  onTabChange,
  onOpenViewer
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="related">Related</TabsTrigger>
      </TabsList>

      <TabsContent value="preview" className="mt-4">
        <div className="space-y-4">
          {/* Thumbnail and Quick Info */}
          <div className="flex gap-4">
            <div className="w-32 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-blue-300">
              {resource.thumbnailUrl ? (
                <img 
                  src={resource.thumbnailUrl} 
                  alt={resource.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <FileText className="h-16 w-16 text-blue-600" />
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{resource.type}</Badge>
                <Badge variant="outline">{resource.grade}</Badge>
                <Badge variant="outline">{resource.difficulty}</Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {resource.duration} min
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {resource.rating}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {resource.viewCount} views
                </div>
              </div>
              
              <p className="text-sm text-gray-700 line-clamp-3">
                {resource.description}
              </p>
              
              <button
                onClick={onOpenViewer}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Open Full Book
              </button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="details" className="mt-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Academic Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Grade Level:</span> {resource.grade}</div>
                <div><span className="font-medium">Curriculum:</span> {resource.curriculum}</div>
                <div><span className="font-medium">Subject:</span> {resource.type}</div>
                <div><span className="font-medium">Language:</span> {resource.language}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Resource Details</h4>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Difficulty:</span> {resource.difficulty}</div>
                <div><span className="font-medium">Duration:</span> {resource.duration} minutes</div>
                <div><span className="font-medium">Access Level:</span> {resource.accessTier}</div>
                <div><span className="font-medium">Status:</span> {resource.isPublished ? 'Published' : 'Draft'}</div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {resource.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700">{resource.description}</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Student Reviews</h4>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{resource.rating}</span>
              <span className="text-sm text-gray-500">({resource.viewCount} reviews)</span>
            </div>
          </div>
          
          {/* Sample reviews */}
          <div className="space-y-3">
            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="font-medium text-sm">Sarah M.</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Great interactive content! My students really enjoyed the engaging exercises.
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful (12)
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <MessageCircle className="h-3 w-3" />
                  Reply
                </button>
              </div>
            </div>

            <div className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="font-medium text-sm">Teacher K.</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4].map((star) => (
                    <Star key={star} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-3 w-3 text-gray-300" />
                </div>
              </div>
              <p className="text-sm text-gray-700">
                Good resource but could use more practice problems for advanced students.
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <ThumbsUp className="h-3 w-3" />
                  Helpful (8)
                </button>
                <button className="flex items-center gap-1 hover:text-blue-600">
                  <MessageCircle className="h-3 w-3" />
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="related" className="mt-4">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Related Resources</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sample related resources */}
            {[
              { title: "Advanced Math Workbook", grade: "Grade 4", type: "Workbook" },
              { title: "Math Practice Tests", grade: "Grade 3", type: "Assessment" },
              { title: "Interactive Math Games", grade: "Grade 3-4", type: "Interactive" },
              { title: "Math Fundamentals Guide", grade: "Grade 2-3", type: "Textbook" }
            ].map((item, index) => (
              <div key={index} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer">
                <div className="flex gap-3">
                  <div className="w-12 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm text-gray-900">{item.title}</h5>
                    <p className="text-xs text-gray-600 mt-1">{item.grade}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{item.type}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};