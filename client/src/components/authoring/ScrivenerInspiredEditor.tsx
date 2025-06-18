import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  ScrivenerToolbar,
  ScrivenerBinder,
  ScrivenerEditor,
  ScrivenerInspector,
  ScrivenerUtils,
  defaultProject,
  defaultDocuments,
  defaultResearch,
  defaultCharacters,
  type DocumentNode,
  type EditorState,
} from "./scrivener";

export default function ScrivenerInspiredEditor() {
  const [documents, setDocuments] = useState<DocumentNode[]>(defaultDocuments);
  const [state, setState] = useState<EditorState>({
    activeDocument: null,
    viewMode: 'editor',
    editorMode: 'compose',
    splitView: false,
    showInspector: true,
    searchQuery: ''
  });

  const activeDoc = state.activeDocument 
    ? ScrivenerUtils.findDocument(documents, state.activeDocument)
    : null;

  const handleStateChange = (updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const handleDocumentSelect = (id: string) => {
    setState(prev => ({ ...prev, activeDocument: id }));
  };

  const handleDocumentToggle = (id: string) => {
    setDocuments(prev => ScrivenerUtils.toggleDocumentExpansion(prev, id));
  };

  const handleContentChange = (content: string) => {
    if (state.activeDocument) {
      setDocuments(prev => ScrivenerUtils.updateDocumentContent(prev, state.activeDocument!, content));
    }
  };

  const filteredDocuments = state.searchQuery 
    ? ScrivenerUtils.filterDocuments(documents, state.searchQuery)
    : documents;

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ScrivenerToolbar
        project={{
          ...defaultProject,
          current: ScrivenerUtils.calculateTotalWordCount(documents)
        }}
        state={state}
        onStateChange={handleStateChange}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={20} minSize={15}>
          <ScrivenerBinder
            documents={filteredDocuments}
            activeDocument={state.activeDocument}
            searchQuery={state.searchQuery}
            onDocumentSelect={handleDocumentSelect}
            onDocumentToggle={handleDocumentToggle}
            onSearchChange={(query) => handleStateChange({ searchQuery: query })}
          />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={state.showInspector ? 55 : 80}>
          <ScrivenerEditor
            activeDoc={activeDoc}
            state={state}
            onStateChange={handleStateChange}
            onContentChange={handleContentChange}
          />
        </ResizablePanel>

        {state.showInspector && (
          <>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={20}>
              <ScrivenerInspector
                activeDoc={activeDoc}
                research={defaultResearch}
                characters={defaultCharacters}
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
