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
    <Card className={`${layout.cardStyle} group cursor-pointer`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-10 h-10 ${resourceTypeColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
            <ResourceIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {resource.title}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {resource.resourceType.charAt(0).toUpperCase() + resource.resourceType.slice(1)}
            </p>
          </div>
        </div>
        
        {resource.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {resource.description}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {resource.viewCount || 0}
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
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={() => onAccess(resource, 'view')}
          >
            <Play className="w-3 h-3 mr-1" />
            View
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAccess(resource, 'save_to_locker')}
          >
            <Bookmark className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};