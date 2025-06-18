import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  LibraryHeader,
  LibrarySearch,
  LibraryTabs,
  LibraryModals,
  LibraryState,
  LibraryResource,
  sampleResources,
  useLibraryActions,
} from "@/components/library-new";

const DigitalLibraryNew = () => {
  const [state, setState] = useState<LibraryState>({
    activeTab: "all",
    searchQuery: "",
    viewMode: "grid",
    selectedResource: null,
    showBookViewer: false,
    currentBook: null,
    showWorksheetViewer: false,
    currentWorksheet: null,
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch library resources
  const { data: apiResponse, isLoading, error } = useQuery({
    queryKey: ["/api/library/resources", { search: state.searchQuery, type: state.activeTab !== "all" ? state.activeTab : undefined }],
    enabled: true,
  });

  // Use sample data for demonstration
  const resources = apiResponse?.resources || sampleResources;

  // Library actions
  const { handlePreview, handleSaveToLocker } = useLibraryActions(
    (book) => setState(prev => ({ ...prev, currentBook: book })),
    (show) => setState(prev => ({ ...prev, showBookViewer: show })),
    (worksheet) => setState(prev => ({ ...prev, currentWorksheet: worksheet })),
    (show) => setState(prev => ({ ...prev, showWorksheetViewer: show })),
    (resource) => setState(prev => ({ ...prev, selectedResource: resource })),
    toast,
    user
  );

  // State updaters
  const updateState = (updates: Partial<LibraryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const closeModals = () => {
    updateState({
      selectedResource: null,
      showBookViewer: false,
      currentBook: null,
      showWorksheetViewer: false,
      currentWorksheet: null,
    });
  };

  return (
    <div className="space-y-6">
      <LibraryHeader
        viewMode={state.viewMode}
        onViewModeChange={(mode) => updateState({ viewMode: mode })}
      />

      <LibrarySearch
        searchQuery={state.searchQuery}
        onSearchChange={(query) => updateState({ searchQuery: query })}
      />

      <LibraryTabs
        activeTab={state.activeTab}
        onTabChange={(tab) => updateState({ activeTab: tab })}
        resources={resources}
        viewMode={state.viewMode}
        onPreview={handlePreview}
        onSaveToLocker={handleSaveToLocker}
      />

      <LibraryModals
        selectedResource={state.selectedResource}
        showBookViewer={state.showBookViewer}
        currentBook={state.currentBook}
        showWorksheetViewer={state.showWorksheetViewer}
        currentWorksheet={state.currentWorksheet}
        onCloseResource={() => updateState({ selectedResource: null })}
        onCloseBookViewer={() => updateState({ showBookViewer: false, currentBook: null })}
        onCloseWorksheetViewer={() => updateState({ showWorksheetViewer: false, currentWorksheet: null })}
        onSaveToLocker={handleSaveToLocker}
      />
    </div>
  );
};

export default DigitalLibraryNew;