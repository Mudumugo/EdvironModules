import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutConfig } from '../LibraryLayoutConfig';
import { QuickAccessSection } from '../modules/QuickAccessSection';
import { SubjectTabs } from '../modules/SubjectTabs';
import { CategorySection } from '../modules/CategorySection';

interface SecondaryLayoutProps {
  categories: any[];
  subjects: any[];
  resources: any[];
  layout: LayoutConfig;
  gradeLevel: string;
  onResourceAccess: (resource: any, type: 'view' | 'save_to_locker') => void;
}

export const SecondaryLayout = ({ 
  categories, 
  subjects, 
  resources, 
  layout, 
  gradeLevel, 
  onResourceAccess 
}: SecondaryLayoutProps) => {
  const [activeTab, setActiveTab] = useState('subjects');
  const [activeSubjectTab, setActiveSubjectTab] = useState(subjects[0]?.id || '');

  const handleCategorySelect = (categoryId: string) => {
    // Filter resources by category and switch to subjects view
    setActiveTab('subjects');
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <QuickAccessSection />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="subjects" className="text-sm sm:text-base">
            By Subject
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-sm sm:text-base">
            By Category
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-6">
          <SubjectTabs
            subjects={subjects}
            resources={resources}
            activeTab={activeSubjectTab}
            onTabChange={setActiveSubjectTab}
            onResourceAccess={onResourceAccess}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <CategorySection
            categories={categories}
            resources={resources}
            onCategorySelect={handleCategorySelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};