import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen } from "lucide-react";
import LibraryResourceCard from "@/components/library/LibraryResourceCard";
import { LibraryResource } from "./LibraryTypes";

interface LibraryTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  resources: LibraryResource[];
  viewMode: "grid" | "list";
  onPreview: (resource: LibraryResource) => void;
  onSaveToLocker: (resource: LibraryResource) => void;
}

export const LibraryTabs: React.FC<LibraryTabsProps> = ({
  activeTab,
  onTabChange,
  resources,
  viewMode,
  onPreview,
  onSaveToLocker,
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="all">All Resources</TabsTrigger>
        <TabsTrigger value="book">Books</TabsTrigger>
        <TabsTrigger value="worksheet">Worksheets</TabsTrigger>
        <TabsTrigger value="quiz">Quizzes</TabsTrigger>
      </TabsList>

      <TabsContent value={activeTab} className="mt-6">
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" 
            : "space-y-4"
        }`}>
          {resources.map((resource: LibraryResource) => (
            <LibraryResourceCard 
              key={resource.id} 
              resource={resource} 
              onPreview={onPreview}
              onSaveToLocker={onSaveToLocker}
              viewMode={viewMode}
            />
          ))}
        </div>
        
        {resources.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or browse different categories.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};