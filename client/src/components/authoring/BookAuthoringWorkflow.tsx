import { useBookAuthoring } from "@/hooks/useBookAuthoring";
import { AuthoringHeader } from "@/components/authoring/AuthoringHeader";
import { ChapterEditor } from "@/components/authoring/ChapterEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, FileText } from "lucide-react";
import { useState } from "react";

export default function BookAuthoringWorkflow() {
  const [newProject, setNewProject] = useState({
    title: "",
    subject: "",
    grade: "",
    description: ""
  });

  const {
    selectedProject,
    setSelectedProject,
    selectedChapter,
    setSelectedChapter,
    showCreateDialog,
    setShowCreateDialog,
    isPreviewMode,
    setIsPreviewMode,
    projects,
    isLoading,
    createProject,
    updateProject,
    createChapter,
    updateChapter,
    submitForReview,
    publish,
    isCreatingProject,
    isUpdatingProject,
    isSubmitting,
    isPublishing
  } = useBookAuthoring();

  if (selectedProject && selectedChapter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AuthoringHeader
          projectTitle={`${selectedChapter.title} - ${selectedProject.title}`}
          status={selectedProject.status}
          onSave={() => updateChapter({ id: selectedChapter.id, data: selectedChapter })}
          onPreview={() => setIsPreviewMode(!isPreviewMode)}
          onSubmitForReview={() => submitForReview(selectedProject.id)}
          onPublish={() => publish(selectedProject.id)}
          onBack={() => setSelectedChapter(null)}
          isSaving={isUpdatingProject}
          isSubmitting={isSubmitting}
          isPublishing={isPublishing}
        />

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <ChapterEditor 
              chapter={selectedChapter}
              onUpdateChapter={(data) => updateChapter({ id: selectedChapter.id, data })}
              onCreatePage={(data) => createChapter({ ...data, projectId: selectedProject.id })}
              onUpdatePage={(pageId, data) => updateChapter({ id: pageId, data })}
              onDeletePage={(pageId) => console.log('Delete page:', pageId)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (selectedProject) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Project: {selectedProject.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProject.chapters?.map((chapter) => (
                  <Card key={chapter.id} className="cursor-pointer hover:shadow-md" onClick={() => setSelectedChapter(chapter)}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{chapter.title}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Card className="cursor-pointer hover:shadow-md border-dashed" onClick={() => createChapter({ title: "New Chapter", projectId: selectedProject.id })}>
                  <CardContent className="p-4 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Plus className="h-5 w-5" />
                      <span>Add Chapter</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Book Authoring</h1>
          <p className="text-gray-600">Create and manage your educational content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedProject(project)}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{project.metadata?.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{project.subject}</span>
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{project.status}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-dashed" onClick={() => setShowCreateDialog(true)}>
            <CardContent className="p-6 flex items-center justify-center">
              <div className="text-center">
                <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <span className="text-gray-600">Create New Project</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}