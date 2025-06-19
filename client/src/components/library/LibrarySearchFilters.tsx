import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { LibraryResourceTypes } from './LibraryResourceTypes';

interface LibrarySearchFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  selectedResourceType: string;
  categories: any[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onResourceTypeChange: (value: string) => void;
}

export const LibrarySearchFilters = ({
  searchTerm,
  selectedCategory,
  selectedResourceType,
  categories,
  onSearchChange,
  onCategoryChange,
  onResourceTypeChange
}: LibrarySearchFiltersProps) => {
  const resourceTypes = LibraryResourceTypes.getResourceTypes();

  return (
    <div className="mb-4 sm:mb-8">
      <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-10 sm:h-auto"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          <select
            value={selectedResourceType}
            onChange={(e) => onResourceTypeChange(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
          >
            {resourceTypes.map((type: any) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};