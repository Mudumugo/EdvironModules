import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Star, Clock, Play, Bookmark } from 'lucide-react';
import { LayoutConfig } from './LibraryLayoutConfig';
import { LibraryResourceTypes } from './LibraryResourceTypes';

interface ResourceCardProps {
  resource: any;
  layout: LayoutConfig;
  onAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}

export const ResourceCard = ({ resource, layout, onAccess }: ResourceCardProps) => {
  const ResourceIcon = LibraryResourceTypes.getResourceIcon(resource.resourceType);
  const resourceTypeColor = LibraryResourceTypes.getResourceTypeColor(resource.resourceType);
  
  return (
    <Card className={`${layout.cardStyle} group cursor-pointer hover:shadow-lg transition-shadow`}>
      <CardContent className="p-3 sm:p-4">
        <div className="flex items-start gap-2 sm:gap-3 mb-3">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 ${resourceTypeColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <ResourceIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 group-hover:text-primary transition-colors leading-tight">
              {resource.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}
            </p>
          </div>
        </div>
        
        {resource.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-tight">
            {resource.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">{resource.viewCount || 0}</span>
              <span className="sm:hidden">{(resource.viewCount || 0) > 999 ? '999+' : (resource.viewCount || 0)}</span>
            </span>
            {resource.rating && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {resource.rating}
              </span>
            )}
          </div>
          {resource.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {resource.duration}m
            </span>
          )}
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          <Button 
            size="sm" 
            className="flex-1 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3" 
            onClick={() => onAccess(resource, 'view')}
          >
            <Play className="w-3 h-3 mr-1" />
            <span className="hidden sm:inline">View</span>
            <span className="sm:hidden">View</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="w-8 sm:w-9 h-8 sm:h-9 p-0"
            onClick={() => onAccess(resource, 'save_to_locker')}
          >
            <Bookmark className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};