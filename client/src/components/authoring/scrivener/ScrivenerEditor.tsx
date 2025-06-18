import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentNode, EditorState } from "./ScrivenerTypes";

interface ScrivenerEditorProps {
  activeDoc: DocumentNode | null;
  state: EditorState;
  onStateChange: (updates: Partial<EditorState>) => void;
  onContentChange: (content: string) => void;
}

export const ScrivenerEditor: React.FC<ScrivenerEditorProps> = ({
  activeDoc,
  state,
  onStateChange,
  onContentChange,
}) => {
  if (!activeDoc) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Document Selected</h3>
          <p className="text-sm">Choose a document from the binder to start writing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Document Header */}
      <div className="p-3 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{activeDoc.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
              {activeDoc.wordCount && (
                <span>{activeDoc.wordCount} words</span>
              )}
              {activeDoc.target && (
                <span>Target: {activeDoc.target}</span>
              )}
              {activeDoc.status && (
                <Badge variant="secondary">{activeDoc.status}</Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={state.editorMode === 'compose' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onStateChange({ editorMode: 'compose' })}
            >
              Compose
            </Button>
            <Button
              variant={state.editorMode === 'edit' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onStateChange({ editorMode: 'edit' })}
            >
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 p-6 bg-white dark:bg-gray-900">
        {state.viewMode === 'editor' && (
          <div className="max-w-4xl mx-auto">
            <Textarea
              placeholder="Start writing..."
              value={activeDoc.content || ''}
              onChange={(e) => onContentChange(e.target.value)}
              className="min-h-[500px] border-none resize-none text-base leading-relaxed focus:ring-0"
              style={{
                fontFamily: state.editorMode === 'compose' ? 'Georgia, serif' : 'system-ui, sans-serif',
                fontSize: state.editorMode === 'compose' ? '18px' : '14px',
                lineHeight: state.editorMode === 'compose' ? '1.8' : '1.6'
              }}
            />
          </div>
        )}

        {state.viewMode === 'corkboard' && (
          <div className="grid grid-cols-3 gap-4 p-4">
            {activeDoc.children?.map(child => (
              <Card key={child.id} className="h-40 cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm truncate">{child.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4">
                    {child.content || 'No content yet...'}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">{child.wordCount || 0} words</span>
                    {child.status && (
                      <Badge variant="secondary" className="text-xs">{child.status}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {state.viewMode === 'outline' && (
          <div className="p-4 space-y-2">
            {activeDoc.children?.map(child => (
              <div key={child.id} className="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                <div className="flex-1">
                  <div className="font-medium">{child.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {child.content || 'No content'}
                  </div>
                </div>
                <div className="text-xs text-gray-500">{child.wordCount || 0} words</div>
                {child.status && (
                  <Badge variant="secondary" className="text-xs">{child.status}</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};