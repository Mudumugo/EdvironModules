import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, BookOpen } from "lucide-react";

interface LibraryHeaderProps {
  title: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  showFilters?: boolean;
  onToggleFilters?: () => void;
}

export function LibraryHeader({ 
  title, 
  searchTerm, 
  onSearchChange, 
  showFilters = true,
  onToggleFilters 
}: LibraryHeaderProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        {showFilters && (
          <Button variant="outline" onClick={onToggleFilters}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        )}
      </div>
      
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}