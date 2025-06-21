import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ResourceGrid } from './ResourceGrid';

interface SubjectTabsProps {
  subjects: any[];
  resources: any[];
  activeTab: string;
  onTabChange: (value: string) => void;
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}

export function SubjectTabs({ 
  subjects, 
  resources, 
  activeTab, 
  onTabChange, 
  onResourceAccess 
}: SubjectTabsProps) {
  const getSubjectResources = (subjectId: string) => {
    return resources.filter(resource => resource.subjectId === subjectId);
  };

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 mb-4 sm:mb-6 h-auto">
        {subjects.slice(0, 6).map((subject) => {
          const subjectResources = getSubjectResources(subject.id);
          return (
            <TabsTrigger 
              key={subject.id} 
              value={subject.id} 
              className="flex flex-col items-center p-2 sm:p-3 h-auto"
            >
              <span className="text-xs sm:text-sm font-medium truncate w-full text-center">
                {subject.name}
              </span>
              <Badge variant="secondary" className="text-xs mt-1">
                {subjectResources.length}
              </Badge>
            </TabsTrigger>
          );
        })}
      </TabsList>

      {subjects.slice(0, 6).map((subject) => {
        const subjectResources = getSubjectResources(subject.id);
        return (
          <TabsContent key={subject.id} value={subject.id} className="mt-4">
            <div className="mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {subject.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subject.description || `Explore ${subject.name} resources`}
              </p>
            </div>
            
            <ResourceGrid 
              resources={subjectResources}
              onResourceAccess={onResourceAccess}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}