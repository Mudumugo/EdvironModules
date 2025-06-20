import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { InteractiveGuide } from "@/components/help/InteractiveGuide";
import { RoleOnboarding } from "@/components/help/RoleOnboarding";
import { SearchInterface } from "@/components/help/SearchInterface";
import { HelpCategories } from "@/components/help/HelpCategories";
import { PopularArticles } from "@/components/help/PopularArticles";
import { ContactSupport } from "@/components/help/ContactSupport";
import { RoleBasedHelp } from "@/components/help/RoleBasedHelp";
import { 
  helpCategories, 
  popularArticles, 
  contactOptions, 
  roleBasedContent, 
  interactiveFeatures 
} from "@/components/help/HelpData";

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const { user } = useAuth();

  const handleCategorySelect = (categoryId: string) => {
    console.log('Selected category:', categoryId);
    // Navigate to category content
  };

  const handleArticleSelect = (articleId: string) => {
    console.log('Selected article:', articleId);
    // Navigate to article content
  };

  const handleContactSelect = (option: any) => {
    console.log('Contact option selected:', option);
    // Handle contact action
  };

  const handleTaskComplete = (taskId: number) => {
    setCompletedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleStartGuide = (guideType: string) => {
    console.log('Starting guide:', guideType);
    // Handle guide start
  };

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Handle search
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Help Center</h1>
        <p className="text-gray-600">
          Find answers, get support, and learn how to make the most of Edvirons
        </p>
      </div>

      <SearchInterface 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="guides">Interactive Guides</TabsTrigger>
          <TabsTrigger value="role-help">Role-Based Help</TabsTrigger>
          <TabsTrigger value="support">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-6">
          <HelpCategories 
            categories={helpCategories}
            onCategorySelect={handleCategorySelect}
          />
          
          <PopularArticles 
            articles={popularArticles}
            onArticleSelect={handleArticleSelect}
          />
        </TabsContent>

        <TabsContent value="guides" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InteractiveGuide features={interactiveFeatures} />
            <RoleOnboarding userRole={user?.role || 'student'} />
          </div>
        </TabsContent>

        <TabsContent value="role-help" className="mt-6">
          <RoleBasedHelp
            userRole={user?.role || 'student'}
            roleContent={roleBasedContent}
            completedTasks={completedTasks}
            onTaskComplete={handleTaskComplete}
            onStartGuide={handleStartGuide}
          />
        </TabsContent>

        <TabsContent value="support" className="mt-6">
          <ContactSupport 
            contactOptions={contactOptions}
            onContactSelect={handleContactSelect}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}