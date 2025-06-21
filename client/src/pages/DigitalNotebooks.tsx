import { useDigitalNotebooks } from "@/hooks/useDigitalNotebooks";
import { NotebooksHeader } from "@/components/notebooks/NotebooksHeader";
import { NotebookGrid } from "@/components/notebooks/NotebookGrid";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DigitalNotebooks() {
  const [newNotebook, setNewNotebook] = useState({
    title: "",
    subject: "",
    isShared: false
  });

  const {
    selectedNotebook,
    setSelectedNotebook,
    searchTerm,
    setSearchTerm,
    subjectFilter,
    setSubjectFilter,
    viewMode,
    setViewMode,
    showCreateDialog,
    setShowCreateDialog,
    notebooks,
    subjects,
    isLoading,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    isCreatingNotebook
  } = useDigitalNotebooks();

  const handleCreateNotebook = () => {
    if (!newNotebook.title || !newNotebook.subject) return;
    
    createNotebook({
      title: newNotebook.title,
      subject: newNotebook.subject,
      isShared: newNotebook.isShared
    });
    
    setNewNotebook({ title: "", subject: "", isShared: false });
  };

  return (
    <div className="space-y-6">
      <NotebooksHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        subjects={subjects}
        onCreateNew={() => setShowCreateDialog(true)}
      />

      <NotebookGrid
        notebooks={notebooks}
        viewMode={viewMode}
        onNotebookSelect={setSelectedNotebook}
        onNotebookEdit={(notebook) => {
          setNewNotebook(notebook);
          setShowCreateDialog(true);
        }}
        onNotebookDelete={deleteNotebook}
        isLoading={isLoading}
      />

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Notebook</DialogTitle>
            <DialogDescription>
              Create a new digital notebook to organize your learning materials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter notebook title..."
                value={newNotebook.title}
                onChange={(e) => setNewNotebook(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter subject..."
                value={newNotebook.subject}
                onChange={(e) => setNewNotebook(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setNewNotebook({ title: "", subject: "", isShared: false });
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNotebook}
              disabled={!newNotebook.title || !newNotebook.subject || isCreatingNotebook}
            >
              Create Notebook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}