import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Table,
  Eye,
  Edit3,
  Target,
  Search,
  Settings,
} from "lucide-react";
import { ProjectInfo, EditorState } from "./ScrivenerTypes";

interface ScrivenerToolbarProps {
  project: ProjectInfo;
  state: EditorState;
  onStateChange: (updates: Partial<EditorState>) => void;
}

export const ScrivenerToolbar: React.FC<ScrivenerToolbarProps> = ({
  project,
  state,
  onStateChange,
}) => {
  return (
    <div className="h-12 bg-gray-50 dark:bg-gray-800 border-b flex items-center justify-between px-4">
      {/* Left: File Operations */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Save className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Undo className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Redo className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
        
        {/* Formatting Tools */}
        <Button variant="ghost" size="sm">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Underline className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
        
        <Button variant="ghost" size="sm">
          <List className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Quote className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Link className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Image className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Table className="h-4 w-4" />
        </Button>
      </div>

      {/* Center: Project Info */}
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium">{project.title}</div>
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {project.current} / {project.target} words
          </span>
          <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min((project.current / project.target) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Right: View Controls */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={state.searchQuery}
            onChange={(e) => onStateChange({ searchQuery: e.target.value })}
            className="pl-8 w-40 h-8"
          />
        </div>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />
        
        <Button
          variant={state.viewMode === 'editor' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onStateChange({ viewMode: 'editor' })}
        >
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button
          variant={state.viewMode === 'corkboard' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onStateChange({ viewMode: 'corkboard' })}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant={state.viewMode === 'outline' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onStateChange({ viewMode: 'outline' })}
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};