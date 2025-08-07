import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import {
  LibraryHeader,
  LibrarySearchFilters,
  PrimaryLayout,
  SecondaryLayout,
  getLayoutConfig,
  LibraryResourceTypes
} from '@/components/library';
import LibraryBookViewer from '@/components/books/LibraryBookViewer';
import { convertResourceToBookConfig, shouldUseBookViewer, getBookOpenMessage } from '@/lib/bookViewerConfig';

export default function DigitalLibrary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedResourceType, setSelectedResourceType] = useState('all');

  // Book viewer state
  const [showBookViewer, setShowBookViewer] = useState(false);
  const [currentBook, setCurrentBook] = useState<any>(null);

  // Allow manual grade level switching for demo purposes
  const [demoGradeLevel, setDemoGradeLevel] = useState<string>('primary');
  const gradeLevel = demoGradeLevel;
  const layout = getLayoutConfig(gradeLevel);

  // Fetch categories for current grade level
  const { data: categoriesResponse = [] } = useQuery({
    queryKey: [`/api/library/categories?gradeLevel=${gradeLevel}`],
  });

  // Fetch subjects for current grade level with resource counts
  const { data: subjectsResponse = [] } = useQuery({
    queryKey: [`/api/library/subjects?gradeLevel=${gradeLevel}${selectedCategory !== 'all' ? `&categoryId=${selectedCategory}` : ''}`],
  });

  // Fetch resources
  const queryParams = new URLSearchParams({
    gradeLevel,
    ...(selectedCategory !== 'all' && { categoryId: selectedCategory }),
    ...(selectedResourceType !== 'all' && { resourceType: selectedResourceType }),
    ...(searchTerm && { search: searchTerm }),
  });
  
  const { data: resourcesResponse = [] } = useQuery({
    queryKey: [`/api/library/resources?${queryParams.toString()}`],
  });

  // Ensure we have arrays for rendering
  const categories = Array.isArray(categoriesResponse) ? categoriesResponse : [];
  const subjects = Array.isArray(subjectsResponse) ? subjectsResponse : [];
  const resources = Array.isArray(resourcesResponse) ? resourcesResponse : [];

  // Get featured resources
  const featuredResources = resources.filter((r: any) => r.isFeatured);
  const recentResources = resources.slice(0, 8);

  const handleResourceAccess = async (resource: any, accessType: 'view' | 'save_to_locker') => {
    try {
      const response = await apiRequest('POST', '/api/library/access', {
        resourceId: resource.id,
        accessType
      });
      
      if (accessType === 'view') {
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
        } else {
          // For non-book resources, show a simple message
          toast({
            title: "Resource Accessed",
            description: `Opening ${resource.title}`,
          });
        }
      } else if (accessType === 'save_to_locker') {
        toast({
          title: "Saved to Locker",
          description: `${resource.title} has been saved to your locker`,
        });
      }
    } catch (error) {
      console.error('Failed to access resource:', error);
      toast({
        title: "Error",
        description: "Failed to access resource. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LibraryHeader
        layout={layout}
        gradeLevel={gradeLevel}
        demoGradeLevel={demoGradeLevel}
        onGradeLevelChange={setDemoGradeLevel}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <LibrarySearchFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedResourceType={selectedResourceType}
          categories={categories}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
          onResourceTypeChange={setSelectedResourceType}
        />

        {gradeLevel === 'primary' ? (
          <PrimaryLayout 
            categories={categories} 
            resources={resources}
            layout={layout}
            onResourceAccess={handleResourceAccess}
          />
        ) : (
          <SecondaryLayout 
            categories={categories} 
            subjects={subjects}
            resources={resources}
            layout={layout}
            gradeLevel={gradeLevel}
            onResourceAccess={handleResourceAccess}
          />
        )}

        {/* Book Viewer Modal */}
        {showBookViewer && currentBook && (
          <LibraryBookViewer
            bookData={currentBook}
            onClose={() => {
              setShowBookViewer(false);
              setCurrentBook(null);
            }}
          />
        )}
      </div>
    </div>
  );
}