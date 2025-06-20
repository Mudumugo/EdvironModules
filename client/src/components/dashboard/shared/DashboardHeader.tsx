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
    <div className="mb-4 sm:mb-6">
      {/* Plan Info Header */}
      {showPlanInfo && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-0 sm:justify-between mb-3 sm:mb-4 lg:mb-6 bg-white rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
              <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <span className="font-medium text-gray-700 text-sm sm:text-base">Free Basic Plan</span>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto mt-2 sm:mt-0">
            Upgrade to Premium
          </Button>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-white rounded-lg p-3 lg:p-4 shadow-sm">
        <div className="text-center mb-3 lg:mb-4">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 mb-1">
            {getGreeting()}, {user?.firstName || "Student"}!
          </h1>
          <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-1">{title}</h2>
          {subtitle && <p className="text-gray-600 text-xs sm:text-sm">{subtitle}</p>}
        </div>

        {/* Search and Filters */}
        {(showSearch || showFilters) && (
          <div className="flex flex-col gap-2 sm:gap-3 lg:gap-4">
            {showSearch && (
              <div className="relative w-full sm:max-w-md lg:max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 text-sm sm:text-base"
                />
              </div>
            )}

            {showFilters && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between">
                <Select value={selectedCategory} onValueChange={onCategoryChange}>
                  <SelectTrigger className="w-full sm:w-[180px] lg:w-[200px] text-sm sm:text-base">
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
                    className="hidden sm:flex"
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