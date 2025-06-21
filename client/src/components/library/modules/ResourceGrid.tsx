import { ResourceCard } from '../ResourceCard';

interface ResourceGridProps {
  resources: any[];
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}

export function ResourceGrid({ resources, onResourceAccess }: ResourceGridProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="text-gray-400 dark:text-gray-600 mb-4">
          <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No resources available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Check back later for new content in this subject.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          onAccess={onResourceAccess}
        />
      ))}
    </div>
  );
}