import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LibrarySearchFiltersProps {
  selectedCategory: string;
  selectedResourceType: string;
  onCategoryChange: (value: string) => void;
  onResourceTypeChange: (value: string) => void;
  categories?: any[];
  resourceTypes?: any[];
}

export function LibrarySearchFilters({
  selectedCategory,
  selectedResourceType,
  onCategoryChange,
  onResourceTypeChange,
  categories = [],
  resourceTypes = []
}: LibrarySearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Category:</span>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-700">Type:</span>
        <Select value={selectedResourceType} onValueChange={onResourceTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {resourceTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {(selectedCategory !== 'all' || selectedResourceType !== 'all') && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            onCategoryChange('all');
            onResourceTypeChange('all');
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
}