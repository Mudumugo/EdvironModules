import { Card, CardContent } from "@/components/ui/card";
import ParentCard from "./ParentCard";
import type { Parent } from "./ParentTypes";

interface ParentGridProps {
  parents: Parent[];
  isLoading: boolean;
  onViewDetails?: (parentId: string) => void;
  onEditParent?: (parentId: string) => void;
  onSendMessage?: (parentId: string) => void;
  onCallParent?: (parentId: string) => void;
}

export default function ParentGrid({ 
  parents, 
  isLoading, 
  onViewDetails, 
  onEditParent, 
  onSendMessage, 
  onCallParent 
}: ParentGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
              <div className="mt-4 flex justify-between">
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-8"></div>
                </div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (parents.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">👥</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          No parents found
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Try adjusting your search criteria or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {parents.map((parent) => (
        <ParentCard
          key={parent.id}
          parent={parent}
          onViewDetails={onViewDetails}
          onEditParent={onEditParent}
          onSendMessage={onSendMessage}
          onCallParent={onCallParent}
        />
      ))}
    </div>
  );
}