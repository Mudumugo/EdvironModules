import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Grid3X3, List, Filter } from "lucide-react";

interface NotebooksHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  subjects: string[];
  onCreateNew: () => void;
}

export function NotebooksHeader({
  searchTerm,
  setSearchTerm,
  subjectFilter,
  setSubjectFilter,
  viewMode,
  setViewMode,
  subjects,
  onCreateNew
}: NotebooksHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search notebooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={onCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Notebook
        </Button>
      </div>
    </div>
  );
}