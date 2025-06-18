import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FolderOpen,
  FileText,
  BookOpen,
  Archive,
  User,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
} from "lucide-react";
import { DocumentNode } from "./ScrivenerTypes";

interface ScrivenerBinderProps {
  documents: DocumentNode[];
  activeDocument: string | null;
  searchQuery: string;
  onDocumentSelect: (id: string) => void;
  onDocumentToggle: (id: string) => void;
  onSearchChange: (query: string) => void;
}

export const ScrivenerBinder: React.FC<ScrivenerBinderProps> = ({
  documents,
  activeDocument,
  searchQuery,
  onDocumentSelect,
  onDocumentToggle,
  onSearchChange,
}) => {
  const renderDocumentTree = (nodes: DocumentNode[], level = 0): React.ReactNode => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 py-1 px-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded ${
            activeDocument === node.id ? 'bg-blue-100 dark:bg-blue-900' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.children) {
              onDocumentToggle(node.id);
            } else {
              onDocumentSelect(node.id);
            }
          }}
        >
          {node.children ? (
            node.expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <div className="w-4" />
          )}
          
          {node.type === 'folder' && <FolderOpen className="h-4 w-4 text-yellow-600" />}
          {node.type === 'chapter' && <BookOpen className="h-4 w-4 text-blue-600" />}
          {node.type === 'scene' && <FileText className="h-4 w-4 text-green-600" />}
          {node.type === 'research' && <Archive className="h-4 w-4 text-purple-600" />}
          {node.type === 'character' && <User className="h-4 w-4 text-orange-600" />}
          
          <span className="flex-1 truncate">{node.title}</span>
          
          {node.wordCount && (
            <span className="text-xs text-gray-500">{node.wordCount}</span>
          )}
          
          {node.status && (
            <Badge 
              variant={node.status === 'complete' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {node.status}
            </Badge>
          )}
        </div>
        
        {node.children && node.expanded && (
          <div>
            {renderDocumentTree(node.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 border-r">
      {/* Binder Header */}
      <div className="p-3 border-b bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Binder</h3>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Document Tree */}
      <ScrollArea className="h-[calc(100%-100px)]">
        <div className="p-2">
          {renderDocumentTree(documents)}
        </div>
      </ScrollArea>
    </div>
  );
};