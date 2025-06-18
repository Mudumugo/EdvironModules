import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { LockerSearchFilters } from "./LockerTypes";

interface LockerSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filters: LockerSearchFilters;
  onFiltersChange: (filters: LockerSearchFilters) => void;
  onClearFilters: () => void;
}

export default function LockerSearch({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onClearFilters 
}: LockerSearchProps) {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  
  return (
    <div className="space-y-4 mb-6">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your locker..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select 
          value={filters.type} 
          onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="notebook">Notebooks</SelectItem>
            <SelectItem value="resource">Resources</SelectItem>
            <SelectItem value="bookmark">Bookmarks</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.subject} 
          onValueChange={(value) => onFiltersChange({ ...filters, subject: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="math">Mathematics</SelectItem>
            <SelectItem value="science">Science</SelectItem>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="history">History</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.grade} 
          onValueChange={(value) => onFiltersChange({ ...filters, grade: value })}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="All Grades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="junior">Junior Secondary</SelectItem>
            <SelectItem value="senior">Senior Secondary</SelectItem>
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => onFiltersChange({
                  ...filters,
                  tags: filters.tags.filter(t => t !== tag)
                })}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}