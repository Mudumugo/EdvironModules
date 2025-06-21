import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthoringDashboard } from "@/hooks/useAuthoringDashboard";
import {
  AuthoringStatsOverview,
  RecentContent,
  ContentCreationForm,
} from "@/components/authoring/modules";
import BookAuthoringWorkflow from "@/components/authoring/BookAuthoringWorkflow";

export default function AuthoringDashboard() {
  const {
    activeTab,
    setActiveTab,
    showCreateForm,
    setShowCreateForm,
    editingContent,
    setEditingContent,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    stats,
    content,
    taxonomy,
    statsLoading,
    contentLoading,
    createContent,
    updateContent,
    submitForReview,
    isCreating,
    isUpdating,
    isSubmitting
  } = useAuthoringDashboard();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Authoring</h1>
          <p className="text-gray-600">Create and manage educational content</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">My Content</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="book-authoring">Book Authoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <AuthoringStatsOverview stats={stats} isLoading={statsLoading} />
          <RecentContent 
            content={content.slice(0, 5)} 
            isLoading={contentLoading}
            onEdit={setEditingContent}
            onSubmitForReview={submitForReview}
          />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <RecentContent 
            content={content}
            isLoading={contentLoading}
            onEdit={setEditingContent}
            onSubmitForReview={submitForReview}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <ContentCreationForm
            taxonomy={taxonomy}
            onSubmit={createContent}
            isSubmitting={isCreating}
            editingContent={editingContent}
            onUpdate={updateContent}
            isUpdating={isUpdating}
          />
        </TabsContent>

        <TabsContent value="book-authoring" className="space-y-6">
          <BookAuthoringWorkflow />
        </TabsContent>
      </Tabs>
    </div>
  );
}