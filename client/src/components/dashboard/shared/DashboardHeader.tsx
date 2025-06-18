import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Grid3X3, List, Star } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  user?: any;
  showSearch?: boolean;
  showFilters?: boolean;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showPlanInfo?: boolean;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
};

export function DashboardHeader({
  title,
  subtitle,
  user,
  showSearch = false,
  showFilters = false,
  categories = [],
  selectedCategory = "All Modules",
  onCategoryChange,
  searchTerm = "",
  onSearchChange,
  viewMode = "grid",
  onViewModeChange,
  showPlanInfo = false
}: DashboardHeaderProps) {
  return (
    <div className="mb-6">
      {/* Plan Info Header */}
      {showPlanInfo && (
        <div className="flex items-center justify-between mb-6 bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Star className="h-5 w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-700">Free Basic Plan</span>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Upgrade to Premium
          </Button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {getGreeting()}, {user?.firstName || "Student"}!
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {showSearch && (
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {onViewModeChange && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onViewModeChange(viewMode === "grid" ? "list" : "grid")}
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}